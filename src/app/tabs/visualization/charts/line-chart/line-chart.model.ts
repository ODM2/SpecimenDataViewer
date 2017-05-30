export class LineChart {
  public margin: {top: number, right: number, bottom: number, left: number};
  public scale: {x: any, y: any};
  public dimensions: {width: number, height: number};
  public axis: {x: any, y: any, gridX: any, gridY: any};
  public line: any;
  public g: any;

  constructor(){
    this.margin = {top: 0, right: 0, bottom: 0, left: 0};
    this.scale = {x: null, y: null};
    this.dimensions = {width: 0, height: 0};
    this.axis = {x: null, y: null, gridX: null, gridY: null};
    this.line = null;
    this.g = null;
  }
}
