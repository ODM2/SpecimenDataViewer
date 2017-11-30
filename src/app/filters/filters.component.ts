import { Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";
import {Filter} from "./filter.model";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  filters: Filter[];

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.dataService.initialized.subscribe(() => {
      this.filters = this.dataService.getFilters();
      console.log("Filters loaded");
    });

  }

}
