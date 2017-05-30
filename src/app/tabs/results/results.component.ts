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
  optionDisplay: string = "All";

  ngOnInit() {
    this.dataseries = this.dataService.getDataseries();
    this.clearSelected();
  }

  onDisplay(option: string) {
    this.optionDisplay = option;
  }

  clearSelected() {
    for (let entry of this.dataseries) {
      entry.selected = false;
    }
  }

  onToggleSelect(index: number) {
    this.dataseries[index].selected = !this.dataseries[index].selected;
  }

  loadDetails () {

  }

  plotSelected() {

  }

  clearSearch() {

  }


  clearDateRange() {

  }
}
