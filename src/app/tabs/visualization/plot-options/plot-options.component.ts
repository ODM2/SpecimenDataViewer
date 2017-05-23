import { Component, OnInit } from '@angular/core';
import {VisualizationService} from "../../../visualization.service";

@Component({
  selector: 'app-plot-options',
  templateUrl: './plot-options.component.html',
  styleUrls: ['./plot-options.component.css']
})
export class PlotOptionsComponent implements OnInit {
  xAxisDataset: string;
  plotType: string;
  datasets = [
    {
      variableName:"Blue-green algae (cyanobacteria), phycocyanin",
      siteName:"Red Butte Creek"
    },
    {
      variableName:"Blue-green algae (cyanobacteria), phycocyanin",
      siteName:"Red Butte Creek"
    },
    {
      variableName:"Blue-green algae (cyanobacteria), phycocyanin",
      siteName:"Red Butte Creek"
    },
    {
      variableName:"Blue-green algae (cyanobacteria), phycocyanin",
      siteName:"Red Butte Creek"
    },

  ];

  constructor(private visualizationService: VisualizationService) { }

  ngOnInit() {
    this.visualizationService.setPlotType(this.visualizationService.plotTypes.timeSeries);
    this.plotType = "time-series";
  }

}
