import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {DataService} from "../../data.service";
import {Subscription} from "rxjs";
import {
  AgmMap,
} from '@agm/core';

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
  map: AgmMap;
  @ViewChild('m') sitesMap: ElementRef;

  sites = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.dataLoaded = this.dataService.initialized.subscribe(() => {
      this.sites = this.dataService.getSites();
    });

    console.log(this.sitesMap);
  }
}
