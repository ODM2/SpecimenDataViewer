import {Component, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css']
})
export class HistogramComponent implements OnInit, AfterViewInit {
  @ViewChild("containerHistogram") element: ElementRef;
  private data = [];
  private host: d3.Selection;
  private svg: d3.Selection;
  private htmlElement: HTMLElement;
  private parseDate = d3.timeParse("%d-%m-%Y");
  private chart: any;
  private y: any;
  private x: any;
  private height: number;
  private width: number;
  private margin: any;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.htmlElement);
    this.host.html("");

    // set the dimensions and margins of the graph
    this.margin = {top: 10, right: 30, bottom: 30, left: 40};
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

    // set the ranges
    this.x = d3.scaleTime()
      .domain([new Date(2010, 6, 3), new Date(2012, 0, 1)])
      .rangeRound([0, this.width]);
    this.y = d3.scaleLinear()
      .range([this.height , 0]);

    // set the parameters for the histogram
    this.chart = d3.histogram()
      .value((d) => {
        return d.date;
      })
      .domain(this.x.domain())
      .thresholds(this.x.ticks(d3.timeMonth));

    this.svg = this.host.append("svg").attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");

    // get the data
    d3.csv("assets/histogram-data.csv", this.loadData.bind(this));
  }

  loadData(error, data) {
    if (error) throw error;

    // format the data
    data.forEach((d) => {
      d.date = this.parseDate(d.dtg);
    });

    // group the data for the bars
    let bins = this.chart(data);

    // Scale the range of the data in the y domain
    let maxY = d3.max(bins, (d) => {
      return d.length;
    });
    this.y.domain([0, maxY]);

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
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x));

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
    return this.height - this.y(d.length);
  }
}
