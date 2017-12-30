import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {DataService} from "../../data.service";
import {Subscription} from "rxjs";
import {MarkerManager, LatLng, MapTypeStyle, AgmMap, GoogleMapsAPIWrapper} from '@agm/core';

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
  @ViewChild("sites-map") sitesMap: ElementRef;

  sites = [];

  constructor(private dataService: DataService, private wrapper: GoogleMapsAPIWrapper ) {
  }

  ngOnInit() {
    this.dataLoaded = this.dataService.initialized.subscribe(() => {
      this.sites = this.dataService.getSites();
      // console.log("Loaded map sites", this.sites)
    });

    this.map = new AgmMap(this.sitesMap, this.wrapper );
  }

  onInfoWindowOpen() {
    console.log("Opened")
  }
}
