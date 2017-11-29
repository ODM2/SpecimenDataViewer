import {Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject} from '@angular/core';
import * as d3 from "d3";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";

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

  constructor(public dialogRef: MatDialogRef<DetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.htmlElement);
    this.host.html("");

    // set the dimensions and margins of the graph
    this.margin = {top: 10, right: 30, bottom: 30, left: 100};
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 480 - this.margin.top - this.margin.bottom;

    this.svg = this.host.append("svg")
      .attr("width", this.width + this.margin.right + this.margin.left)
      .attr("height", this.height + this.margin.top + this.margin.bottom)


    let filter = this.svg.append("defs").append("filter")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 1)
      .attr("height", 1)
      .attr("id", "solid");

    filter.append("feFlood")
      .attr("flood-color", "rgba(255, 255, 255, 0.64)");

    filter.append("feComposite")
      .attr("in", "SourceGraphic");

    this.svg = this.svg.append("g")
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
                {
                  "name": "value",
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
                {
                  "name": "value",
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
                {
                  "name": "value",
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
                {
                  "name": "value",
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
    let treeData = this.treemap(this.root);

    // Compute the new tree layout.
    let nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach((d) => {
      d.y = d.depth * 180
    });

    // ****************** Nodes section ***************************

    // Update the nodes...
    let node = this.svg.selectAll('g.node')
      .data(nodes, (d) => {
        return d.id || (d.id = ++this.i);
      });

    // Enter any new modes at the parent's previous position.
    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", (d) => {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on('click', this.click.bind(this));

    // Add Circle for the nodes
    nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", (d) => {
        return d._children ? "#9bc0de" : "#fff";
      });

    // Add labels for the nodes
    nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("filter", "url(#solid)")
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
    let nodeUpdate = nodeEnter.merge(node);

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
        return d._children ? "#9bc0de" : "#fff";
      })
      .attr('cursor', 'pointer');


    // Remove any exiting nodes
    let nodeExit = node.exit().transition()
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
    let link = this.svg.selectAll('path.link')
      .data(links, (d) => {
        return d.id;
      });

    // Enter any new links at the parent's previous position.
    let linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', (d) => {
        var o = {x: source.x0, y: source.y0};
        return this.diagonal(o, o)
      });

    // UPDATE
    let linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
      .duration(this.duration)
      .attr('d', (d) => {
        return this.diagonal(d, d.parent)
      });

    // Remove any exiting links
    let linkExit = link.exit().transition()
      .duration(this.duration)
      .attr('d', (d) => {
        let o = {x: source.x, y: source.y};
        return this.diagonal(o, o)
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Creates a curved (diagonal) path from parent to the child nodes
  diagonal(s, d) {
    let path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;
    return path;
  }

  // Toggle children on click.
  click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d);
  }
}
