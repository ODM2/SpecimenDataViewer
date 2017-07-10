import { Component, OnInit } from '@angular/core';
import {DataService} from "../../data.service";
import {DetailsComponent} from "../details/details.component";
import {MdDialog, MdTableModule} from "@angular/material";
import {CdkTableModule} from "@angular/cdk"
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
  allSelected: boolean = false;
  flagIsSomeSelected = false;
  searchString: string = "";
  __beginDate: Date;
  __endDate: Date;

  displayedColumns = ['userId', 'userName', 'progress', 'color'];
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;

  ngOnInit() {
    this.dataseries = this.dataService.getDataseries();
    for (let dataset of this.dataseries) {
      dataset.plotted = false;
      dataset.selected = false;
    }

    this.dataSource = new ExampleDataSource(this.exampleDatabase);
  }

  onDisplay(option: string) {
    this.optionDisplay = option;
  }

  // clearSelected() {
  //   for (let entry of this.dataseries) {
  //     entry.selected = false;
  //   }
  //   this.flagIsSomeSelected = false;
  // }

  toggleSelect(index: number) {
    this.dataseries[index].selected = !this.dataseries[index].selected;
    this.flagIsSomeSelected = this.isSomeSelected();
  }

  loadDetails () {

  }

  togglePlot(index: number) {
    this.dataseries[index].plotted = !this.dataseries[index].plotted;
    if (!this.dataseries[index].plotted) {
      this.plotCount = this.plotCount - 1;
    }
    else {
     this.plotCount = this.plotCount + 1;
    }
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
    for (let dataset of this.dataseries) {
      dataset.selected = !this.allSelected;
    }
    this.flagIsSomeSelected = !this.allSelected;
  }

  clearSearch() {
    this.searchString = "";
  }

  isSomeSelected() {
    for (let dataset of this.dataseries) {
      if (dataset.selected) {
        return true;
      }
    }

    return false;
  }

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

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];


/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);
  get data(): UserData[] { return this.dataChange.value; }

  constructor() {
    // Fill up the database with 100 users.
    for (let i = 0; i < 100; i++) { this.addUser(); }
  }

  /** Adds a new user to the database. */
  addUser() {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewUser());
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewUser() {
    const name =
        NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
      id: (this.data.length + 1).toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
  }
}

export class ExampleDataSource extends DataSource<any> {
  constructor(private _exampleDatabase: ExampleDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserData[]> {
    return this._exampleDatabase.dataChange;
  }

  disconnect() {}
}
