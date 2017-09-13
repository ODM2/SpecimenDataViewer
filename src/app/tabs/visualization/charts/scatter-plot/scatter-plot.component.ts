import {Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import * as d3 from 'd3';
import {Subscription} from 'rxjs/Subscription';
import {VisualizationService} from '../../../../visualization.service';
import {Chart} from '../chart.model';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('containerScatterPlot') element: ElementRef;
  private host: d3.Selection;
  private svg: d3.Selection;
  private htmlElement: HTMLElement;
  private parseDate = d3.timeParse('%b %Y');
  private focus = new Chart();

  constructor(private visualizationService: VisualizationService) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.htmlElement);
    this.host.html("");

    this.svg = this.host.append("svg");
    this.svg.attr("width", document.querySelector(".mat-tab-body-wrapper").clientWidth - 585);
    this.svg.attr("height", document.querySelector(".mat-tab-body-wrapper").clientHeight - 175);

    this.focus.margin = {top: 20, right: 20, bottom: 60, left: 60};
    const w = +this.svg.attr("width") - this.focus.margin.left - this.focus.margin.right;
    const h = +this.svg.attr("height") - this.focus.margin.top - this.focus.margin.bottom;
    this.focus.setDimensions(w, h);

    this.focus.scales.x = d3.scaleTime().range([0, this.focus.getWidth()]);
    this.focus.scales.x2 = d3.scaleLinear().range([0, this.focus.getWidth()]);
    this.focus.scales.y = d3.scaleLinear().range([this.focus.getHeight(), 0]);
    this.focus.scales.y2 = d3.scaleTime().range([0, this.focus.getHeight()]);

    this.focus.axis.x = d3.axisBottom(this.focus.scales.x);
    this.focus.axis.y = d3.axisLeft(this.focus.scales.y);
    this.focus.axis.x2 = d3.axisBottom(this.focus.scales.x2);
    this.focus.axis.y2 = d3.axisLeft(this.focus.scales.y2);

    this.svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", this.focus.getWidth())
      .attr("height", this.focus.getHeight());

    this.focus.g = this.svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + this.focus.margin.left + "," + this.focus.margin.top + ")");

    // Data handling
    d3.csv("assets/line-chart-data.csv", this.type.bind(this), this.loadData.bind(this));
  }

  loadData(error, data) {
    if (error) {
      throw error;
    }

    this.focus.scales.x.domain(d3.extent(data, (d) => {
      return d.date;
    }));

    this.focus.scales.x2.domain([0, d3.max(data, (d) => {
      return d.price;
    })]);

    this.focus.scales.y.domain([0, d3.max(data, (d) => {
      return d.price;
    })]);

    this.focus.scales.y2.domain(d3.extent(data, (d) => {
      return d.date;
    }));



    this.focus.axis.gridY = d3.axisLeft(this.focus.scales.y)
      .tickSize(-this.focus.getWidth())
      .tickFormat("");

    this.focus.axis.gridX = d3.axisBottom(this.focus.scales.x2)
      .tickSize(-this.focus.getHeight())
      .tickFormat("");

    // add the Y gridlines
    this.focus.g.append("g")
      .attr("class", "grid grid-y")
      .call(this.focus.axis.gridY);

    // add the X gridlines
    this.focus.g.append("g")
      .attr("class", "grid grid-x")
      .attr("transform", "translate(0," + this.focus.getHeight() + ")")
      .call(this.focus.axis.gridX);

    // Add circle points to the focus graph
    this.focus.g.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("r", 3)
      .attr("class", "point")
      .attr("fill", "steelblue")
      .attr("cx", function (d) {
        return this.focus.scales.x(d.date);
      }.bind(this))
      .attr("cy", function (d) {
        return this.focus.scales.y(d.price);
      }.bind(this));

    this.focus.g.selectAll("dot2")
      .data(data)
      .enter().append("circle")
      .attr("r", 3)
      .attr("class", "point")
      .attr("fill", "orange")
      .attr("cx", function (d) {
        return this.focus.scales.x2(d.price);
      }.bind(this))
      .attr("cy", function (d) {
        return this.focus.scales.y2(d.date);
      }.bind(this));

    // this.focus.g.append("g")
    //   .attr("class", "axis axis--x")
    //   .attr("transform", "translate(0," + this.focus.getHeight() + ")")
    //   .call(this.focus.axis.x);

    this.focus.g.append("g")
      .attr("class", "axis axis--y")
      .call(this.focus.axis.y);

    this.focus.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.focus.getHeight() + ")")
      .call(this.focus.axis.x2);

    // this.focus.g.append("g")
    //   .attr("class", "axis axis--y")
    //   .call(this.focus.axis.y2);


    // Y-axis label
    this.focus.g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.focus.margin.left)
      .attr("x", 0 - (this.focus.getHeight() / 2))
      .attr("dy", "1em")
      .attr("class", "y-axis-label")
      .style("text-anchor", "middle")
      .text("Y axis label");

    // X-axis label
    this.focus.g.append("text")
      .attr("x", this.focus.getWidth() / 2)
      .attr("y", this.focus.getHeight() + this.focus.margin.top + 20)
      .style("text-anchor", "middle")
      .attr("class", "x-axis-label")
      .text("X axis label");
  }


  type(d) {
    d.date = this.parseDate(d.date);
    d.price = +d.price;
    return d;
  }

}
