import { Component, OnInit } from '@angular/core';
import {DataService} from "../../data.service";
import {DetailsComponent} from "../details/details.component";
import {MdDialog} from "@angular/material";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  constructor(private dataService: DataService, public dialog: MdDialog) { }

  dataseries = [];
  plotCount: number = 0;
  selectedCount: number = 0;
  optionDisplay: string = "All";
  allSelected: boolean = false;
  flagIsSomeSelected = false;
  searchString: string = "";
  __beginDate: Date;
  __endDate: Date;

  ngOnInit() {
    this.dataseries = this.dataService.getDataseries();
    for (let dataset of this.dataseries) {
      dataset.plotted = false;
      dataset.selected = false;
    }
  }

  onDisplay(option: string) {
    this.optionDisplay = option;
  }

  // clearSelected() {
  //   for (let entry of this.dataseries) {
  //     entry.selected = false;
  //   }
  //   this.flagIsSomeSelected = false;
  // }

  toggleSelect(index: number) {
    this.dataseries[index].selected = !this.dataseries[index].selected;
    this.flagIsSomeSelected = this.isSomeSelected();
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
    this.flagIsSomeSelected = !this.allSelected;
  }

  clearSearch() {
    this.searchString = "";
  }

  isSomeSelected() {
    for (let dataset of this.dataseries) {
      if (dataset.selected) {
        return true;
      }
    }

    return false;
  }

  openDetailsDialog(somedata: string) {
    this.dialog.open(DetailsComponent,
      {
        data: somedata,
        height: '600px',
        width: '1000px',
      });
  }

  clearDateRange() {
    this.__beginDate = null;
    this.__endDate = null;
  }
}
