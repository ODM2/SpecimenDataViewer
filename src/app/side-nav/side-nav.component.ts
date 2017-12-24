import { Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  private sideNavVisible = true;

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  onNavBarClose() {
    this.sideNavVisible = false;
  }

  onNavBarOpen() {
    this.sideNavVisible = true;
  }

}
