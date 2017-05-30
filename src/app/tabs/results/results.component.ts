import { Component, OnInit } from '@angular/core';
import {DataService} from "../../data.service";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  constructor(private dataService: DataService) { }

  dataseries = [];
  plotCount: number;
  optionDisplay: string = "All";
  allSelected: boolean = false;

  ngOnInit() {
    this.dataseries = this.dataService.getDataseries();
    this.clearSelected();
    this.plotCount = 0;
  }

  onDisplay(option: string) {
    this.optionDisplay = option;
  }

  clearSelected() {
    for (let entry of this.dataseries) {
      entry.selected = false;
    }
  }

  toggleSelect(index: number) {
    this.dataseries[index].selected = !this.dataseries[index].selected;
  }

  loadDetails () {

  }

  togglePlot(index: number) {
    this.dataseries[index].plotted = !this.dataseries[index].plotted;
    if (!this.dataseries[index].plotted) {
      this.plotCount = this.plotCount - 1;
    }
    else {
     this.plotCount = this.plotCount + 1;
    }
  }

  plotSelected() {
    this.plotCount = 0;
    for (let dataset of this.dataseries) {
      dataset.plotted = dataset.selected;
      if (dataset.plotted) {
        this.plotCount = this.plotCount + 1;
      }
    }
  }

  toggleSelectedAll() {
    for (let dataset of this.dataseries) {
      dataset.selected = !this.allSelected;
    }
  }


  clearSearch() {

  }


  clearDateRange() {

  }
}
