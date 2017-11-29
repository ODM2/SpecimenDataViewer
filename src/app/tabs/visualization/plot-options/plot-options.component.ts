import { Component, OnInit } from '@angular/core';
import {VisualizationService} from "../../../visualization.service";
import {SummaryStatisticsComponent} from "../summary-statistics/summary-statistics.component";
import {MatDialog} from "@angular/material";
import * as d3 from "d3";

@Component({
  selector: 'app-plot-options',
  templateUrl: './plot-options.component.html',
  styleUrls: ['./plot-options.component.css']
})
export class PlotOptionsComponent implements OnInit {
  private xAxisDataset: number;
  plotType: number;
  colors: any;
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

  constructor(private visualizationService: VisualizationService, public dialog: MatDialog) { }

  openDialog(dataset: {variableName: string, siteName:string, visible:boolean}) {
    this.dialog.open(SummaryStatisticsComponent,
      {
        data: {
          dataset: dataset,
        },
        height: '500px',
        width: '800px',
      });
  }

  ngOnInit() {
    this.visualizationService.setPlotType(this.visualizationService.plotTypes.timeSeries);
    this.plotType = this.visualizationService.plotTypes.timeSeries;
    this.xAxisDataset = 0;
    this.colors = d3.scaleOrdinal(d3.schemeCategory10);
  }

  toggleVisibility(i: number) {
    this.datasets[i].visible = !this.datasets[i].visible;
  }

}
