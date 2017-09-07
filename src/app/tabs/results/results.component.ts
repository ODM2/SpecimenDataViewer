import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {DataService} from "../../data.service";
import {DetailsComponent} from "../details/details.component";
import {MdDialog} from "@angular/material";
// import {CdkTableModule} from "@angular/cdk"
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  constructor(private dataService: DataService, public dialog: MdDialog) { }

  dataseries = [];
  plotCount: number = 0;
  selectedCount: number = 0;
  optionDisplay: string = "All";
  // flagIsSomeSelected = false;
  __beginDate: Date;
  __endDate: Date;
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;

  displayedColumns = [
    'selection',
    'variableCode',
    'network',
    'siteCode',
    'siteName',
    'variableName',
    'startDate',
    'endDate',
    'medium',
    'actions',
  ];

  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.dataseries = this.dataService.getDataseries();

    this.dataSource = new ExampleDataSource(this.exampleDatabase);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  onDisplay(option: string) {
    this.optionDisplay = option;
  }

  plotSelected() {
    this.plotCount = 0;
    for (let dataset of this.dataseries) {
      dataset.plotted = dataset.selected;
      if (dataset.plotted) {
        this.plotCount = this.plotCount + 1;
      }
    }
  }

  toggleSelectedAll() {
    // this.dataSource.toggleAllSelected(true);

    console.log(this.exampleDatabase);
    console.log(this.dataSource);
  }

  clearSearch() {
    this.dataSource.filter = "";
  }

  // isSomeSelected() {
  //   for (let dataset of this.dataseries) {
  //     if (dataset.selected) {
  //       return true;
  //     }
  //   }
  //
  //   return false;
  // }

  openDetailsDialog(somedata: string) {
    this.dialog.open(DetailsComponent,
      {
        data: somedata,
        height: '600px',
        width: '1000px',
      });
  }
  //
  // clearDateRange() {
  //   this.__beginDate = null;
  //   this.__endDate = null;
  // }
}

export interface Dataset {
  variableCode: string;
  network: string;
  siteCode: string;
  siteName: string;
  variableName: string;
  startDate: Date;
  endDate: Date;
  medium: string;
  selected: boolean;
  plotted: boolean;
}

/** Constants used to fill up our data base. */
const VARIABLE_CODES = ['ODO', 'ODO_Local', 'AAA'];
const SITE_CODES = ['RB_ARBR_A	', 'ASDSASDFW', 'FFFCVBB'];
const NETWORKS = ['GAMUT	', 'Logan', 'SLC'];
const SITE_NAMES = ['Logan River', 'Red Butte Creek', 'Utah River'];
const VARIABLE_NAMES = ['Temperature', 'Water Pressure', 'Wind Speed'];
const MEDIUMS = ['Air', 'Water', 'Wind'];


/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Dataset[]> = new BehaviorSubject<Dataset[]>([]);
  get data(): Dataset[] { return this.dataChange.value; }

  constructor() {
    // Fill up the database with 15 users.
    for (let i = 0; i < 8; i++) { this.addDataset(); }
    this.toggleAllSelected(false);
  }

  /** Adds a new user to the database. */
  addDataset() {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewDataset());
    this.dataChange.next(copiedData);
  }

  toggleAllSelected(state: boolean) {
    const copiedData = this.data.slice();
    for (let dataset of copiedData) {
      dataset.selected = state;
    }
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewDataset() {
    return {
        variableCode: VARIABLE_CODES[Math.round(Math.random() * (VARIABLE_CODES.length - 1))],
        network: NETWORKS[Math.round(Math.random() * (NETWORKS.length - 1))],
        siteCode: SITE_CODES[Math.round(Math.random() * (SITE_CODES.length - 1))],
        siteName: SITE_NAMES[Math.round(Math.random() * (SITE_NAMES.length - 1))],
        variableName: VARIABLE_NAMES[Math.round(Math.random() * (VARIABLE_NAMES.length - 1))],
        startDate: new Date(),
        endDate: new Date(),
        medium: MEDIUMS[Math.round(Math.random() * (MEDIUMS.length - 1))],
        selected: false,
        plotted: false
    };
  }
}

export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  constructor(private _exampleDatabase: ExampleDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Dataset[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._filterChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this._exampleDatabase.data.slice().filter((item: Dataset) => {
        let searchStr = (item.network + item.siteName + item.variableName + item.variableCode + item.siteCode + item.medium).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
    });
  }

  disconnect() {}
}
