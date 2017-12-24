import { Component, OnInit } from '@angular/core';
import {DataService} from "../../data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  lat: number = 41.0648701;
  lng: number = -111.4622151;
  zoom: number = 4;
  dataLoaded = new Subscription;

  sites = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.dataLoaded = this.dataService.initialized.subscribe(() => {
      this.sites = this.dataService.getSites();
      console.log("Loaded map sites", this.sites)
    });
  }
}
