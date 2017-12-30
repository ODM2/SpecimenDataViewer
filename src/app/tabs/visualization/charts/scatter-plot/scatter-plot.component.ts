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
  private colors = d3.scaleOrdinal(d3.schemeCategory10);
  private zoom;
  data1;
  data2;
  originalScales = {x: null, y: null};

  pointRadiusSub = new Subscription;

  constructor(private visualizationService: VisualizationService) {
  }

  ngOnInit() {
    this.pointRadiusSub = this.visualizationService.pointRadiusChanged.subscribe(
      (val: number) => {
        this.focus.g.selectAll('circle').attr('r', val);
      }
    );
  }

  ngOnDestroy() {
    this.pointRadiusSub.unsubscribe();
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

    this.focus.scales.x = d3.scaleLinear().range([0, this.focus.getWidth()]);
    this.focus.scales.y = d3.scaleLinear().range([this.focus.getHeight(), 0]);

    this.focus.axis.x = d3.axisBottom(this.focus.scales.x);
    this.focus.axis.y = d3.axisLeft(this.focus.scales.y);

    this.zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [this.focus.getWidth(), this.focus.getHeight()]])
      .extent([[0, 0], [this.focus.getWidth(), this.focus.getHeight()]])
      .on("zoom", this.zoomed.bind(this));

    this.svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", this.focus.getWidth())
      .attr("height", this.focus.getHeight());
    this.focus.g = this.svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + this.focus.margin.left + "," + this.focus.margin.top + ")");

    // Data handling
    // d3.csv("assets/scatter.csv", this.type.bind(this), this.loadData.bind(this));
    // Data handling
    d3.csv("assets/scatter.csv", this.type.bind(this), function (error, data) {
      this.data1 = data;
      if (this.data2) {
        let data = this.combineDatasets(this.data1, this.data2);
        this.plotData(data);
      }
    }.bind(this));

    d3.csv("assets/scatter2.csv", this.type.bind(this), function (error, data) {
      this.data2 = data;
      if (this.data1) {
        let data = this.combineDatasets(this.data1, this.data2);
        this.plotData(data);
      }
    }.bind(this));
  }

  // Combines values of entries matching in datetime
  combineDatasets(d1, d2) {
    let data = d1.concat(d2);
    let result = [];
    data.forEach((entry) => {
      let existing = result.filter((v) => {
        return v.date.getTime() == entry.date.getTime();
      });

      if (existing.length) {
        let existingIndex = result.indexOf(existing[0]);
        result[existingIndex] = {
          date: result[existingIndex].date,
          price1: result[existingIndex].price,
          price2: entry.price
        }
      } else {
        result.push(entry);
      }
    });

    result = result.filter((v) => {
      return v.hasOwnProperty('price1') && v.hasOwnProperty('price2');
    });

    return result;
  }

  plotData(data) {
    let extentX = d3.extent(data, (d) => {
      return d.price1;
    });

    // Make the extent a little bigger to show data close to the edges more clearly
    let deltaX = (extentX[1] - extentX[0]) / 10;
    extentX[0] = extentX[0] - deltaX;
    extentX[1] = extentX[1] + deltaX;
    this.focus.scales.x.domain(extentX);

    // Same for y axis
    let extentY = d3.extent(data, (d) => {
      return d.price2;
    });

    let deltaY = (extentY[1] - extentY[0]) / 10;
    extentY[0] = extentY[0] - deltaY;
    extentY[1] = extentY[1] + deltaY;
    this.focus.scales.y.domain(extentY);

    this.originalScales.x = this.focus.scales.x.copy();
    this.originalScales.y = this.focus.scales.y.copy();

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

    let div;
    console.log(document.getElementsByClassName("graph-tooltip").length);
    if (document.getElementsByClassName("graph-tooltip").length == 0) {
      div = d3.select("body").append("div")
        .attr("class", "graph-tooltip")
        .style("opacity", 0);
    }else {
      div = d3.select(".graph-tooltip");
    }

    this.focus.g.append("rect")
      .attr("class", "zoom")
      .attr("width", this.focus.getWidth())
      .attr("height", this.focus.getHeight())
      .attr("transform", "translate(" + this.focus.margin.left + "," + this.focus.margin.top + ")")
      .call(this.zoom);

    this.focus.g.append("g")
      .attr("class", "axis axis--y")
      .call(this.focus.axis.y);

    this.focus.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.focus.getHeight() + ")")
      .call(this.focus.axis.x);

    // Add circle points to the focus graph
    const radius = this.visualizationService.getPointRadius();
    this.focus.g.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("r", radius)
      .attr("class", "point")
      .attr("fill", this.colors(0))
      .on("mouseover", (d) => {
        div.transition()
          .duration(200)
          .style("opacity", 0.9);
        div.html("" +
          "<table>" +
            "<tr>" +
              "<th>Date: </th>" +
              "<td>" + new Date(d.date).toDateString() + "</td>" +
            "</tr>" +
            "<tr>" +
              "<th>Value1: </th>" +
              "<td>" + d.price1 + "</td>" +
            "</tr>" +
            "<tr>" +
              "<th>Value2: </th>" +
              "<td>" + d.price2 + "</td>" +
            "</tr>" +
          "</table>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", () => {
        div.transition()
          .duration(500)
          .style("opacity", 0);
        div.style("left", -100 + "px");
        div.style("top", -100 + "px");
      })
      .attr("cx", function (d) {
        return this.focus.scales.x(d.price1);
      }.bind(this))
      .attr("cy", function (d) {
        return this.focus.scales.y(d.price2);
      }.bind(this));

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

  zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    let t = d3.event.transform;
    this.focus.scales.x.domain(t.rescaleX(this.originalScales.x).domain());
    this.focus.scales.y.domain(t.rescaleY(this.originalScales.y).domain());

    this.focus.g.selectAll(".point")
      .attr("cx", function (d) {
        return this.focus.scales.x(d.price1);
      }.bind(this))
      .attr("cy", function (d) {
        return this.focus.scales.y(d.price2);
      }.bind(this));

    this.focus.g.select(".axis--x").call(this.focus.axis.x);
    this.focus.g.select(".grid-x").call(this.focus.axis.gridX);
    this.focus.g.select(".axis--y").call(this.focus.axis.y);
    this.focus.g.select(".grid-y").call(this.focus.axis.gridY);
    // this.context.g.select(".brush").call(this.brush.move, this.focus.scales.x.range().map(t.invertX, t));
  }


  type(d) {
    d.date = this.parseDate(d.date);
    d.price = +d.price;
    return d;
  }

}
