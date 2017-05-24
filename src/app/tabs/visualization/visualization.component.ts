import {Component, OnInit, OnDestroy} from '@angular/core';
import {VisualizationService} from "../../visualization.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css'],
})
export class VisualizationComponent implements OnInit, OnDestroy {
  selectedChart: number;
  chartChangedSubscription = new Subscription;

  selectedLineChartView: number;
  xAxisDataset: string;

  constructor(private visualizationService: VisualizationService) {}

  ngOnInit() {
    this.visualizationService.init();

    this.selectedLineChartView = this.visualizationService.lineChartViews.line;
    this.selectedChart = this.visualizationService.charts.lineChart;

    this.visualizationService.setCurrentChart(this.visualizationService.charts.lineChart);
    this.selectedChart = this.visualizationService.charts.lineChart;

    this.chartChangedSubscription = this.visualizationService.currentChartChanged.subscribe(
      (chart: number) => {
        this.selectedChart = chart;
      }
    )
  }

  ngOnDestroy() {
    this.chartChangedSubscription.unsubscribe();
  }

}
