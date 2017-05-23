import { Component, OnInit } from '@angular/core';
import {DataService} from "../../data.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  lat: number = 41.0648701;
  lng: number = -111.4622151;
  zoom: number = 4;

  sites = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.sites = this.dataService.getSites();
  }

}
