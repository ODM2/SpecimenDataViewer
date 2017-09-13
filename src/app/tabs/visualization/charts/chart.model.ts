import * as d3 from 'd3';

export class Chart {
  public margin: {top: number, right: number, bottom: number, left: number};
  public scales: {x: any, x2: any, y: any, y2: any};
  private dimensions: {width: number, height: number};
  public axis: {x: any, x2: any, y: any, y2: any, gridX: any, gridY: any};
  public g: any;
  public components: any;
  public host: d3.selection;
  public data = [];
  public svg: d3.Selection;
  public htmlElement: HTMLElement;

  constructor(){
    this.margin = {top: 0, right: 0, bottom: 0, left: 0};
    this.scales = {x: null, x2: null, y: null, y2: null};
    this.dimensions = {width: 0, height: 0};
    this.axis = {x: null, x2: null, y: null, y2: null, gridX: null, gridY: null};
    this.g = null;
    this.svg = null;
    this.components = {};
    this.host = null;
    this.svg = null;
    this.htmlElement = null;
  }

  setDimensions(width: number, height: number) {
    this.dimensions.width = width;
    this.dimensions.height = height;
  }

  getWidth() {
    return this.dimensions.width;
  }

  getHeight() {
    return this.dimensions.height;
  }
}
