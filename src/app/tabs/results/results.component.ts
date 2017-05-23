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
  selected: string = "All";

  ngOnInit() {
    this.dataseries = this.dataService.getDataseries();
    this.onClearSelected();
  }

  onDisplay(option: string) {
    this.selected = option;
  }

  onClearSelected() {
    for (let entry of this.dataseries) {
      entry.selected = false;
    }
  }

  onToggleSelect(index: number) {
    this.dataseries[index].selected = !this.dataseries[index].selected;
  }
}
