import {Component, OnInit, Input} from '@angular/core';
import {Filter} from "../filter.model";
import {DataService} from "../../data.service";

@Component({
  selector: 'app-filter-item',
  templateUrl: './filter-item.component.html',
  styleUrls: ['./filter-item.component.css']
})
export class FilterItemComponent implements OnInit {
  @Input() filter: Filter;

  constructor(private dataService: DataService) { }

  ngOnInit() {

  }

  filterFacets() {
    console.log("Filtering", this.dataService.getFilters());
  }

}
