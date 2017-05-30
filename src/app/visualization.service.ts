import {Subject} from "rxjs/Subject";
export class VisualizationService {
  private plotType: number;
  private currentChart: number;
  private currentLineChartView: number;
  private histogramTicks: number;

  readonly charts = {scatterPlot: 0, lineChart: 1, histogram: 2, boxPlot: 3};
  readonly plotTypes = {timeSeries: 0, location: 1, correlation: 2};
  readonly lineChartViews = {point: 0, line: 1, both: 2};
  readonly histogramTickTypes = {day: 0, week: 1, month: 2, sixMonths: 3, year: 4};

  currentChartChanged = new Subject();
  ticksChanged = new Subject();
  lineChartViewChanged = new Subject();

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
    this.setLineChartView(this.lineChartViews.both);
    this.setPlotType(this.plotTypes.timeSeries);
    this.setHistogramTicks(this.histogramTickTypes.month);
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
    this.lineChartViewChanged.next(this.currentLineChartView);
  }

  getLineChartView() {
    return this.currentLineChartView;
  }

  setHistogramTicks(ticks: number) {
    this.histogramTicks = ticks;
    this.ticksChanged.next(this.histogramTicks);
  }
}
