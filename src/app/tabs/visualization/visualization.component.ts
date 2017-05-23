import {Component, OnInit} from '@angular/core';
import {VisualizationService} from "../../visualization.service";

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css'],
})
export class VisualizationComponent implements OnInit {
  selectedChart: number;
  xAxisDataset: string;

  constructor(private visualizationService: VisualizationService) {
    this.selectedChart = this.visualizationService.charts.lineChart;
  }

  ngOnInit() {
    this.visualizationService.setCurrentChart(this.visualizationService.charts.lineChart);
    this.selectedChart = this.visualizationService.charts.lineChart;
  }


}
