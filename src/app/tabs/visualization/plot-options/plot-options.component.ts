import {Component, OnInit, OnDestroy} from '@angular/core';
import {VisualizationService} from "../../../visualization.service";
import {SummaryStatisticsComponent} from "../summary-statistics/summary-statistics.component";
import {MatDialog} from "@angular/material";
import * as d3 from "d3";
import {Subscription} from "rxjs";
import {DataService} from "../../../data.service";

@Component({
  selector: 'app-plot-options',
  templateUrl: './plot-options.component.html',
  styleUrls: ['./plot-options.component.css']
})
export class PlotOptionsComponent implements OnInit, OnDestroy {
  private xAxisDataset: number;
  plotType: number;
  colors: any;
  onPlot = new Subscription;
  onUnplot = new Subscription;
  onMakeVisible = new Subscription;
  datasets = [];

  constructor(private dataService: DataService, private visualizationService: VisualizationService, public dialog: MatDialog) { }

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

    this.onPlot = this.dataService.onPlotDataset.subscribe(function(datasets) {
      this.onPlotListChange(datasets);
    }.bind(this));

    this.onUnplot = this.dataService.onUnplotDataset.subscribe(function(datasets) {
      this.onPlotListChange(datasets);
    }.bind(this));
    //
    // this.onMakeVisible = this.dataService.onMakeVisible.subscribe(function(id) {
    //   this.makeVisible(id);
    // }.bind(this));
  }

  ngOnDestroy() {
    this.onPlot.unsubscribe();
    this.onUnplot.unsubscribe();
  }

  onPlotListChange(datasets) {
    let collection = [];
    for (let item in datasets) {
      collection.push(datasets[item])
    }
    this.datasets = collection;
  }

  makeVisible(id: number) {
    if (isNaN(id)) return;
    for (let d of this.datasets) {
      if (d.id == id) {
        d.visible = true;
        this.dataService.onMakeVisible.next(id);
      }
      else {
        d.visible = false;
      }
    }
  }
}
