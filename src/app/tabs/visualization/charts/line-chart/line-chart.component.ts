import {Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import * as d3 from 'd3';
import {Subscription} from 'rxjs/Subscription';
import {VisualizationService} from '../../../../visualization.service';
import {Chart} from '../chart.model';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('containerLineChart') element: ElementRef;
  private host: d3.Selection;
  private svg: d3.Selection;
  private htmlElement: HTMLElement;
  private brush;
  private zoom;
  private parseDate = d3.timeParse('%b %Y');
  private focus = new Chart();
  private context = new Chart();

  chartViewSubsc = new Subscription;

  constructor(private visualizationService: VisualizationService) {
  }

  ngOnInit() {
    this.chartViewSubsc = this.visualizationService.lineChartViewChanged.subscribe(
      (view: number) => {
        if (view === this.visualizationService.lineChartViews.point) {
          this.focus.g.selectAll('.line')
            .classed('invisible ', true);
          this.focus.g.selectAll('.point')
            .classed('invisible ', false);
          this.context.g.selectAll('.line')
            .classed('invisible ', true);
          this.context.g.selectAll('.point')
            .classed('invisible ', false);
        } else if (view === this.visualizationService.lineChartViews.line) {
          this.focus.g.selectAll('.line')
            .classed('invisible ', false);
          this.focus.g.selectAll('.point')
            .classed('invisible ', true);
          this.context.g.selectAll('.line')
            .classed('invisible ', false);
          this.context.g.selectAll('.point')
            .classed('invisible ', true);
        } else if (view === this.visualizationService.lineChartViews.both) {
          this.focus.g.selectAll('.line')
            .classed('invisible ', false);
          this.focus.g.selectAll('.point')
            .classed('invisible ', false);
          this.context.g.selectAll('.line')
            .classed('invisible ', false);
          this.context.g.selectAll('.point')
            .classed('invisible ', false);
        }
      }
    );
  }

  ngOnDestroy() {
    this.chartViewSubsc.unsubscribe();
  }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.htmlElement);
    this.host.html("");

    this.svg = this.host.append("svg");
    this.svg.attr("width", document.querySelector(".mat-tab-body-wrapper").clientWidth - 485);
    this.svg.attr("height", document.querySelector(".mat-tab-body-wrapper").clientHeight - 175);

    this.focus.margin = {top: 20, right: 20, bottom: 180, left: 60};
    let w = +this.svg.attr("width") - this.focus.margin.left - this.focus.margin.right;
    let h = +this.svg.attr("height") - this.focus.margin.top - this.focus.margin.bottom;
    this.focus.setDimensions(w, h);

    this.context.margin = {top: this.focus.getHeight() + 80, right: 20, bottom: 30, left: 60};
    w = this.focus.getWidth();
    h = +this.svg.attr("height") - this.context.margin.top - this.context.margin.bottom;
    this.context.setDimensions(w, h);

    this.focus.scales.x = d3.scaleTime().range([0, this.focus.getWidth()]);
    this.focus.scales.y = d3.scaleLinear().range([this.focus.getHeight(), 0]);

    this.context.scales.x = d3.scaleTime().range([0, this.context.getWidth()]);
    this.context.scales.y = d3.scaleLinear().range([this.context.getHeight(), 0]);

    this.focus.axis.x = d3.axisBottom(this.focus.scales.x);
    this.focus.axis.y = d3.axisLeft(this.focus.scales.y);

    this.context.axis.x = d3.axisBottom(this.context.scales.x);

    this.brush = d3.brushX()
      .extent([[0, 0], [this.focus.getWidth(), this.context.getHeight()]])
      .on("brush end", this.brushed.bind(this));

    this.zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [this.focus.getWidth(), this.focus.getHeight()]])
      .extent([[0, 0], [this.focus.getWidth(), this.focus.getHeight()]])
      .on("zoom", this.zoomed.bind(this));

    this.focus.components.line = d3.line()
      .x((d) => {
        return this.focus.scales.x(d.date);
      })
      .y((d) => {
        return this.focus.scales.y(d.price);
      });

    this.context.components.line = d3.line()
      .x((d) => {
        return this.context.scales.x(d.date);
      })
      .y((d) => {
        return this.context.scales.y(d.price);
      });

    this.svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", this.focus.getWidth())
      .attr("height", this.focus.getHeight());

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
    if (error) {
      throw error;
    }
    this.focus.scales.x.domain(d3.extent(data, (d) => {
      return d.date;
    }));
    this.focus.scales.y.domain([0, d3.max(data, (d) => {
      return d.price;
    })]);
    this.context.scales.x.domain(this.focus.scales.x.domain());
    this.context.scales.y.domain(this.focus.scales.y.domain());

    this.focus.axis.gridY = d3.axisLeft(this.focus.scales.y)
        .tickSize(-this.focus.getWidth())
        .tickFormat("");

    this.focus.axis.gridX = d3.axisBottom(this.focus.scales.x)
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

    this.focus.g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", this.focus.components.line);

    let div;
    console.log(document.getElementsByClassName("graph-tooltip").length);
    if (document.getElementsByClassName("graph-tooltip").length == 0) {
      div = d3.select("body").append("div")
        .attr("class", "graph-tooltip")
        .style("opacity", 0);
    }else {
      div = d3.select(".graph-tooltip");
    }


    // Add circle points to the focus graph
    this.focus.g.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("r", 3)
      .attr("class", "point")
      .attr("fill", "steelblue")
      .on("mouseover", (d) => {
        div.transition()
          .duration(200)
          .style("opacity", 0.9);
        div.html("<h2>Test</h2>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", (d) => {
        div.transition()
          .duration(500)
          .style("opacity", 0)
      })
      .attr("cx", function (d) {
        return this.focus.scales.x(d.date);
      }.bind(this))
      .attr("cy", function (d) {
        return this.focus.scales.y(d.price);
      }.bind(this));

    this.focus.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.focus.getHeight() + ")")
      .call(this.focus.axis.x);

    this.focus.g.append("g")
      .attr("class", "axis axis--y")
      .call(this.focus.axis.y);

    this.context.g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", this.context.components.line);

    // Add circle points to the context graph
    this.context.g.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("r", 1.5)
      .attr("class", "point")
      .attr("fill", "steelblue")
      .attr("cx", function (d) {
        return this.context.scales.x(d.date);
      }.bind(this))
      .attr("cy", function (d) {
        return this.context.scales.y(d.price);
      }.bind(this));

    this.context.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.context.getHeight() + ")")
      .call(this.context.axis.x);

    this.context.g.append("g")
      .attr("class", "brush")
      .call(this.brush)
      .call(this.brush.move, this.focus.scales.x.range());

    this.svg.append("rect")
      .attr("class", "zoom")
      .attr("width", this.focus.getWidth())
      .attr("height", this.focus.getHeight())
      .attr("transform", "translate(" + this.focus.margin.left + "," + this.focus.margin.top + ")")
      .call(this.zoom);

    // Y-axis label
    this.focus.g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.focus.margin.left)
      .attr("x",0 - (this.focus.getHeight() / 2))
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
      .text("Date");
  }

  brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    let s = d3.event.selection || this.context.scales.x.range();
    this.focus.scales.x.domain(s.map(this.context.scales.x.invert, this.context.scales.x));
    this.focus.g.select(".line").attr("d", this.focus.components.line);
    this.focus.g.selectAll(".point")
      .attr("cx", function (d) {
        return this.focus.scales.x(d.date);
      }.bind(this))
      .attr("cy", function (d) {
        return this.focus.scales.y(d.price);
      }.bind(this));
    this.focus.g.select(".axis--x").call(this.focus.axis.x);
    this.focus.g.select(".grid-x").call(this.focus.axis.gridX);
    this.svg.select(".zoom").call(this.zoom.transform, d3.zoomIdentity
      .scale(this.focus.getWidth() / (s[1] - s[0]))
      .translate(-s[0], 0));
  }

  zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    let t = d3.event.transform;
    this.focus.scales.x.domain(t.rescaleX(this.context.scales.x).domain());
    this.focus.g.select(".line").attr("d", this.focus.components.line);
    this.focus.g.selectAll(".point")
      .attr("cx", function (d) {
        return this.focus.scales.x(d.date);
      }.bind(this))
      .attr("cy", function (d) {
        return this.focus.scales.y(d.price);
      }.bind(this));
    this.focus.g.select(".axis--x").call(this.focus.axis.x);
    this.focus.g.select(".grid-x").call(this.focus.axis.gridX);
    this.context.g.select(".brush").call(this.brush.move, this.focus.scales.x.range().map(t.invertX, t));
  }

  type(d) {
    d.date = this.parseDate(d.date);
    d.price = +d.price;
    return d;
  }
}
