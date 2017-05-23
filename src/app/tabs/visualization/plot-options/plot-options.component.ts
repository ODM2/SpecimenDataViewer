import { Component, OnInit } from '@angular/core';
import {VisualizationService} from "../../../visualization.service";
import {SummaryStatisticsComponent} from "../summary-statistics/summary-statistics.component";
import {MdDialog} from "@angular/material";

@Component({
  selector: 'app-plot-options',
  templateUrl: './plot-options.component.html',
  styleUrls: ['./plot-options.component.css']
})
export class PlotOptionsComponent implements OnInit {
  private xAxisDataset: number;
  plotType: string;
  datasets = [
    {
      variableName:"Blue-green algae (cyanobacteria), phycocyanin",
      siteName:"Red Butte Creek",
      visible: true
    },
    {
      variableName:"Blue-green algae (cyanobacteria), phycocyanin",
      siteName:"Red Butte Creek",
      visible: true
    },
    {
      variableName:"Blue-green algae (cyanobacteria), phycocyanin",
      siteName:"Red Butte Creek",
      visible: true
    },
    {
      variableName:"Blue-green algae (cyanobacteria), phycocyanin",
      siteName:"Red Butte Creek",
      visible: true
    },
  ];

  constructor(private visualizationService: VisualizationService, public dialog: MdDialog) { }

  openDialog() {
    this.dialog.open(SummaryStatisticsComponent,
      {
        data: {
          title: "Some datasset",
        },
        height: '500px',
        width: '800px',
      });
  }

  ngOnInit() {
    this.visualizationService.setPlotType(this.visualizationService.plotTypes.timeSeries);
    this.plotType = "time-series";

    this.xAxisDataset = 0;
  }

  toggleVisibility(i: number) {
    this.datasets[i].visible = !this.datasets[i].visible;
  }

}