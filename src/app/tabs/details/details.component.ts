import {Component, OnInit, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, AfterViewInit {
  @ViewChild("containerTree") element: ElementRef;
  private data = [];
  private host: d3.Selection;
  private svg: d3.Selection;
  private htmlElement: HTMLElement;

  private height: number;
  private width: number;
  private margin: any;
  private treemap: any;
  private root: any;
  private i: any;
  private duration: any;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.htmlElement);
    this.host.html("");

    // set the dimensions and margins of the graph
    this.margin = {top: 10, right: 30, bottom: 30, left: 100};
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 480 - this.margin.top - this.margin.bottom;

    this.svg = this.host.append("svg")
      .attr("width", this.width + this.margin.right + this.margin.left)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate("
        + this.margin.left + "," + this.margin.top + ")");

    var treeData =
    {
      "name": "Dataset",
      "children": [
        {
          "name": "Metadata",
          "children": [
            {"name": "Variable Code"},
            {"name": "Variable Name"}
          ]
        },
        {
          "name": "Data",
          "children": [
            {
              "name": "point",
              "children": [
                {
                  "name": "time",
                  "children": [
                    {"name": "11/24/2017"}
                  ]
                },
                {"name": "value",
                  "children": [
                    {"name": "20.35"}
                  ]
                }
              ]
            },
            {
              "name": "point",
              "children": [
                {
                  "name": "time",
                  "children": [
                    {"name": "11/24/2017"}
                  ]
                },
                {"name": "value",
                  "children": [
                    {"name": "20.35"}
                  ]
                }
              ]
            },
            {
              "name": "point",
              "children": [
                {
                  "name": "time",
                  "children": [
                    {"name": "11/24/2017"}
                  ]
                },
                {"name": "value",
                  "children": [
                    {"name": "20.35"}
                  ]
                }
              ]
            },
            {
              "name": "point",
              "children": [
                {
                  "name": "time",
                  "children": [
                    {"name": "11/24/2017"}
                  ]
                },
                {"name": "value",
                  "children": [
                    {"name": "20.35"}
                  ]
                }
              ]
            },
          ]
        }
      ]
    };

    this.i = 0;
    this.duration = 400;

// declares a tree layout and assigns the size
    this.treemap = d3.tree().size([this.height, this.width]);

// Assigns parent, children, height, depth
    this.root = d3.hierarchy(treeData, (d) => {
      return d.children;
    });
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;

// Collapse after the second level

    this.root.children.forEach(this.collapse.bind(this));

    this.update(this.root);

  }

  // Collapse the node and all it's children
  collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse.bind(this));
      d.children = null;
    }
  }

  update(source) {
    // Assigns the x and y position for the nodes
    var treeData = this.treemap(this.root);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach((d) => {
      d.y = d.depth * 180
    });

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = this.svg.selectAll('g.node')
      .data(nodes, (d) => {
        return d.id || (d.id = ++this.i);
      });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", (d) => {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on('click', click.bind(this));

    // Add Circle for the nodes
    nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", (d) => {
        return d._children ? "lightsteelblue" : "#fff";
      });

    // Add labels for the nodes
    nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", (d) => {
        return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", (d) => {
        return d.children || d._children ? "end" : "start";
      })
      .text((d) => {
        return d.data.name;
      });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(this.duration)
      .attr("transform", (d) => {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
      .attr('r', 10)
      .style("fill", (d) => {
        return d._children ? "lightsteelblue" : "#fff";
      })
      .attr('cursor', 'pointer');


    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr("transform", (d) => {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
      .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = this.svg.selectAll('path.link')
      .data(links, (d) => {
        return d.id;
      });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', (d) => {
        var o = {x: source.x0, y: source.y0};
        return diagonal(o, o)
      });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
      .duration(this.duration)
      .attr('d', (d) => {
        return diagonal(d, d.parent)
      });

    // Remove any exiting links
    var linkExit = link.exit().transition()
      .duration(this.duration)
      .attr('d', (d) => {
        var o = {x: source.x, y: source.y};
        return diagonal(o, o)
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {

      let path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

      return path
    }

    // Toggle children on click.
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      this.update(d).bind(this);
    }
  }

}
