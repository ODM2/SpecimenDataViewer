import {Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import * as d3 from "d3";
import {VisualizationService} from "../../../../visualization.service";
import {Subscription} from "rxjs";
import {Chart} from "../chart.model";

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css']
})
export class HistogramComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("containerHistogram") element: ElementRef;
  private data = [];
  private host: d3.Selection;
  private svg: d3.Selection;
  private htmlElement: HTMLElement;
  private parseDate = d3.timeParse("%d-%m-%Y");
  private y: any;
  private x: any;
  private gridY: any;
  private chart = new Chart();

  ticksChangedSubscription = new Subscription;

  constructor(private visualizationService: VisualizationService) {
  }

  ngOnInit() {
    let that = this;
    this.ticksChangedSubscription = this.visualizationService.ticksChanged.subscribe(
      (ticks: number) => {
        if (ticks == this.visualizationService.histogramTickTypes.day) {
          that.chart.components.layout.thresholds(that.x.ticks(d3.timeDay));
        }
        else if (ticks == this.visualizationService.histogramTickTypes.week) {
          that.chart.components.layout.thresholds(that.x.ticks(d3.timeWeek));
        }
        else if (ticks == this.visualizationService.histogramTickTypes.month) {
          that.chart.components.layout.thresholds(that.x.ticks(d3.timeMonth));
        }
        else if (ticks == this.visualizationService.histogramTickTypes.sixMonths) {
          that.chart.components.layout.thresholds(that.x.ticks(d3.timeMonth.every(6)));
        }
        else if (ticks == this.visualizationService.histogramTickTypes.year) {
          that.chart.components.layout.thresholds(that.x.ticks(d3.timeYear));
        }

        d3.csv("assets/histogram-data.csv", this.loadData.bind(that));
      }
    );
  }

  ngOnDestroy() {
    this.ticksChangedSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.htmlElement);
    this.host.html("");

    // set the dimensions and margins of the graph
    this.chart.margin = {top: 40, right: 30, bottom: 40, left: 60};
    let w = 730 - this.chart.margin.left - this.chart.margin.right;
    let h = 500 - this.chart.margin.top - this.chart.margin.bottom;

    this.chart.setDimensions(w, h);
    // console.log(this.dimensions.height);

    // set the ranges
    this.x = d3.scaleTime()
      .domain([new Date(2010, 6, 3), new Date(2012, 0, 1)])
      .rangeRound([0, this.chart.getWidth()]);
    this.y = d3.scaleLinear()
      .range([this.chart.getHeight() , 0]);

    // set the parameters for the histogram
    this.chart.components.layout = d3.histogram()
      .value((d) => {
        return d.date;
      })
      .domain(this.x.domain())
      .thresholds(this.x.ticks(d3.timeMonth));

    // get the data
    d3.csv("assets/histogram-data.csv", this.loadData.bind(this));
  }

  loadData(error, data) {
    this.host.selectAll("svg").remove();
    this.svg = this.host.append("svg").attr("width", this.chart.getWidth() + this.chart.margin.left + this.chart.margin.right)
      .attr("height", this.chart.getHeight() + this.chart.margin.top + this.chart.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.chart.margin.left + "," + this.chart.margin.top + ")");

    // Y-axis label
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.chart.margin.left)
      .attr("class", "y-axis-label")
      .attr("x", 0 - (this.chart.getHeight() / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Y axis label");

    // X-axis label
    this.svg.append("text")
      .attr("x", this.chart.getWidth() / 2)
      .attr("y", this.chart.getHeight() + this.chart.margin.top)
      .attr("class", "x-axis-label")
      .style("text-anchor", "middle")
      .text("Date");

    // add a title
    this.svg.append("text")
      .attr("x", (this.chart.getWidth() / 2))
      .attr("y", 0 - (this.chart.margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("text-decoration", "underline")
      .text("Graph Title");

    if (error) throw error;

    // format the data
    data.forEach((d) => {
      d.date = this.parseDate(d.dtg);
    });

    // group the data for the bars
    let bins = this.chart.components.layout(data);

    // Scale the range of the data in the y domain
    let maxY = d3.max(bins, (d) => {
      return d.length;
    });

    this.y.domain([0, maxY]);

    this.gridY = d3.axisLeft(this.y)
      .tickSize(-this.chart.getWidth())
      .tickFormat("");

    // add the Y gridlines
    this.svg.append("g")
      .attr("class", "grid grid-y")
      .call(this.gridY);

    // append the bar rectangles to the svg element
    this.svg.selectAll("rect")
      .data(bins)
      .enter().append("rect")
      .attr("height", 0)      //setting height 0 for the transition effect
      .attr("class", "bar")
      .attr("y", this.y(0))
      .attr("x", 1)
      .attr("x", this.rectTransformX.bind(this))
      .attr("width", this.rectWidth.bind(this))
      .transition()
        .ease(d3.easeExp)
        .duration(600)
        .attr("y", this.rectTransformY.bind(this))
        .attr("height", this.rectHeight.bind(this));

    // add the x Axis
    this.svg.append("g")
      .attr("transform", "translate(0," + this.chart.getHeight() + ")")
      .call(d3.axisBottom(this.x));
      // .call(d3.axisBottom(this.x).ticks(bins.length));

    // add the y Axis
    this.svg.append("g")
      .call(d3.axisLeft(this.y));
  }

  rectTransformX(d) {
    return this.x(d.x0);
  }

  rectTransformY(d) {
    return this.y(d.length);
  }

  rectWidth(d) {
    return Math.max(0,this.x(d.x1) - this.x(d.x0) - 1);
  }

  rectHeight(d) {
    return this.chart.getHeight() - this.y(d.length);
  }
}
