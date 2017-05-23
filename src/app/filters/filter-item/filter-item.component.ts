import {Component, OnInit, Input} from '@angular/core';
import {Filter} from "../filter.model";

@Component({
  selector: 'app-filter-item',
  templateUrl: './filter-item.component.html',
  styleUrls: ['./filter-item.component.css']
})
export class FilterItemComponent implements OnInit {
  @Input() filter: Filter;

  constructor() { }

  ngOnInit() {

  }

}
