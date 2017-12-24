import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {Filter} from "./filter.model";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit, OnDestroy {
  filters: Filter[];
  dataLoaded = new Subscription();

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.dataLoaded = this.dataService.initialized.subscribe(() => {
      this.filters = this.dataService.getFilters();
    });
  }

  ngOnDestroy() {
    this.dataLoaded.unsubscribe();
  }
}
