export class VisualizationService {
  private plotType: number;
  private currentChart: number;
  readonly charts = {scatterPlot: 0, lineChart: 1, histogram: 2, boxPlot: 3};
  readonly plotTypes = {timeSeries: 0, location: 1, correlation: 2};

  setPlotType (type: number) {
    this.plotType = type;
  }

  setCurrentChart (chart: number) {
    this.currentChart = chart;
  }
}
