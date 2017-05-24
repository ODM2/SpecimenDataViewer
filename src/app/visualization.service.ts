import {Subject} from "rxjs/Subject";
export class VisualizationService {
  private plotType: number;
  private currentChart: number;
  private currentLineChartView: number;

  readonly charts = {scatterPlot: 0, lineChart: 1, histogram: 2, boxPlot: 3};
  readonly plotTypes = {timeSeries: 0, location: 1, correlation: 2};
  readonly lineChartViews = {point: 0, line: 1, both: 2};

  currentChartChanged = new Subject();

  setPlotType (type: number) {
    if(type == this.plotTypes.timeSeries) {
      this.plotType = type;
      this.setCurrentChart(this.charts.lineChart);
    }
    else if(type == this.plotTypes.location) {
      this.plotType = type;
      this.setCurrentChart(this.charts.boxPlot);
    }
    else if(type == this.plotTypes.correlation) {
      this.plotType = type;
      this.setCurrentChart(this.charts.scatterPlot);
    }
  }
  init() {
    this.setLineChartView(this.lineChartViews.line);
    this.setPlotType(this.plotTypes.timeSeries);
  }

  getPlotType () {
    return this.plotType;
  }

  setCurrentChart (chart: number) {
    this.currentChart = chart;
    this.currentChartChanged.next(this.currentChart);
  }

  getCurrentChart () {
    return this.currentChart;
  }

  setLineChartView(view: number) {
    this.currentLineChartView = view;
  }

  getLineChartView() {
    return this.currentLineChartView;
  }
}
