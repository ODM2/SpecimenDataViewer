import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import * as d3 from "d3";
import {LineChart} from "./line-chart.model";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements AfterViewInit, OnInit {
  @ViewChild("containerLineChart") element: ElementRef;

  private data = [];
  private host: d3.Selection;
  private svg: d3.Selection;
  private htmlElement: HTMLElement;
  private width;
  private height;
  private brush;
  private zoom;
  private parseDate = d3.timeParse("%b %Y");
  private focus = new LineChart();
  private context = new LineChart();

  constructor() {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.htmlElement);
    this.host.html("");

    this.svg = this.host.append("svg");
    this.svg.attr("width", document.querySelector(".mat-tab-body-wrapper").clientWidth - 145);
    this.svg.attr("height", document.querySelector(".mat-tab-body-wrapper").clientHeight - 100);

    this.focus.margin = {top: 20, right: 20, bottom: 160, left: 40};
    this.focus.dimensions.width = +this.svg.attr("width") - this.focus.margin.left - this.focus.margin.right;
    this.focus.dimensions.height = +this.svg.attr("height") - this.focus.margin.top - this.focus.margin.bottom;

    this.context.margin = {top: this.focus.dimensions.height + 80, right: 20, bottom: 30, left: 40};
    this.context.dimensions.height = +this.svg.attr("height") - this.context.margin.top - this.context.margin.bottom;
    this.context.dimensions.width = this.focus.dimensions.width;

    this.focus.scale.x = d3.scaleTime().range([0, this.focus.dimensions.width]);
    this.focus.scale.y = d3.scaleLinear().range([this.focus.dimensions.height, 0]);

    this.context.scale.x = d3.scaleTime().range([0, this.context.dimensions.width]);
    this.context.scale.y = d3.scaleLinear().range([this.context.dimensions.height, 0]);

    this.focus.axis.x = d3.axisBottom(this.focus.scale.x);
    this.focus.axis.y = d3.axisLeft(this.focus.scale.y);

    this.context.axis.x = d3.axisBottom(this.context.scale.x);

    this.brush = d3.brushX()
      .extent([[0, 0], [this.focus.dimensions.width, this.context.dimensions.height]])
      .on("brush end", this.brushed.bind(this));

    this.zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [this.focus.dimensions.width, this.focus.dimensions.height]])
      .extent([[0, 0], [this.focus.dimensions.width, this.focus.dimensions.height]])
      .on("zoom", this.zoomed.bind(this));

    this.focus.line = d3.line()
      .x((d) => {
        return this.focus.scale.x(d.date);
      })
      .y((d) => {
        return this.focus.scale.y(d.price);
      });

    this.context.line = d3.line()
      .x((d) => {
        return this.context.scale.x(d.date);
      })
      .y((d) => {
        return this.context.scale.y(d.price);
      });

    this.svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", this.focus.dimensions.width)
      .attr("height", this.focus.dimensions.height);

    this.focus.g = this.svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + this.focus.margin.left + "," + this.focus.margin.top + ")");

    this.context.g = this.svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + this.context.margin.left + "," + this.context.margin.top + ")");

    // Data handling
    d3.csv("assets/line-chart-data.csv", this.type.bind(this), this.loadData.bind(this));
  }

  loadData(error, data) {
    if (error) throw error;
    this.focus.scale.x.domain(d3.extent(data, (d) => {
      return d.date;
    }));
    this.focus.scale.y.domain([0, d3.max(data, (d) => {
      return d.price;
    })]);
    this.context.scale.x.domain(this.focus.scale.x.domain());
    this.context.scale.y.domain(this.focus.scale.y.domain());

    this.focus.g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", this.focus.line);

    this.focus.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.focus.dimensions.height + ")")
      .call(this.focus.axis.x);

    this.focus.g.append("g")
      .attr("class", "axis axis--y")
      .call(this.focus.axis.y);

    this.context.g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", this.context.line);

    this.context.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.context.dimensions.height + ")")
      .call(this.context.axis.x);

    this.context.g.append("g")
      .attr("class", "brush")
      .call(this.brush)
      .call(this.brush.move, this.focus.scale.x.range());

    this.svg.append("rect")
      .attr("class", "zoom")
      .attr("width", this.focus.dimensions.width)
      .attr("height", this.focus.dimensions.height)
      .attr("transform", "translate(" + this.focus.margin.left + "," + this.focus.margin.top + ")")
      .call(this.zoom);
  }

  brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    let s = d3.event.selection || this.context.scale.x.range();
    this.focus.scale.x.domain(s.map(this.context.scale.x.invert, this.context.scale.x));
    this.focus.g.select(".line").attr("d", this.focus.line);
    this.focus.g.select(".axis--x").call(this.focus.axis.x);
    this.svg.select(".zoom").call(this.zoom.transform, d3.zoomIdentity
      .scale(this.focus.dimensions.width / (s[1] - s[0]))
      .translate(-s[0], 0));
  }

  zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    let t = d3.event.transform;
    this.focus.scale.x.domain(t.rescaleX(this.context.scale.x).domain());
    this.focus.g.select(".line").attr("d", this.focus.line);
    this.focus.g.select(".axis--x").call(this.focus.axis.x);
    this.context.g.select(".brush").call(this.brush.move, this.focus.scale.x.range().map(t.invertX, t));
  }

  type(d) {
    d.date = this.parseDate(d.date);
    d.price = +d.price;
    return d;
  }
}
