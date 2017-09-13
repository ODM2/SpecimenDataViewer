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
  histogramTicks: number;
  selectedLineChartView: number;
  selectedPointRadius: number;

  chartChangedSubsc = new Subscription;
  ticksChangedSubsc = new Subscription();

  constructor(private visualizationService: VisualizationService) {
  }

  ngOnInit() {
    this.chartChangedSubsc = this.visualizationService.currentChartChanged.subscribe(
      (chart: number) => {
        this.selectedChart = chart;
      }
    );

    this.ticksChangedSubsc = this.visualizationService.ticksChanged.subscribe(
      (ticks: number) => {
        this.histogramTicks = ticks;
      }
    );

    this.visualizationService.init();
    this.selectedChart = this.visualizationService.getCurrentChart();
    this.selectedLineChartView = this.visualizationService.getLineChartView();
  }

  ngOnDestroy() {
    this.chartChangedSubsc.unsubscribe();
    this.ticksChangedSubsc.unsubscribe();
  }

  onTicksChange() {
    this.visualizationService.setHistogramTicks(this.histogramTicks);
  }

}
