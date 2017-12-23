import {Component, OnInit, OnDestroy, ElementRef, ViewChild} from '@angular/core';
import {DataService} from "../../data.service";
import {DetailsComponent} from "../details/details.component";
import {MatDialog, MatPaginator, MatSort, MatDatepicker} from "@angular/material";
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnDestroy {
  dataseries = [];
  allSelected = false;
  plotCount = 0;
  selectedCount = 0;
  optionDisplay = 'All';
  __beginDate: Date;
  __endDate: Date;
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;
  searchString = '';
  pageChanged = new Subscription;
  dataLoaded = new Subscription;

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

  @ViewChild('chkSelectAll') selectAll: ElementRef;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') myTable;

  constructor(private dataService: DataService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.dataseries = this.dataService.getDatasets();

    this.dataLoaded = this.dataService.initialized.subscribe(() => {
      this.exampleDatabase.loadDatasets(this.dataService.getDatasets());

      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);

      this.pageChanged = this.paginator.page.subscribe((d) => {
        let data = this.exampleDatabase.data.slice()
          .sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';
            let DateA: Date;
            let DateB: Date;

            switch (this.sort.active) {
              case 'variableCode':
                [propertyA, propertyB] = [a.variableCode, b.variableCode];
                break;
              case 'network':
                [propertyA, propertyB] = [a.network, b.network];
                break;
              case 'siteCode':
                [propertyA, propertyB] = [a.siteCode, b.siteCode];
                break;
              case 'siteName':
                [propertyA, propertyB] = [a.siteName, b.siteName];
                break;
              case 'variableName':
                [propertyA, propertyB] = [a.variableName, b.variableName];
                break;
              case 'startDate':
                [DateA, DateB] = [a.startDate, b.startDate];
                break;
              case 'endDate':
                [DateA, DateB] = [a.endDate, b.endDate];
                break;
              case 'medium':
                [propertyA, propertyB] = [a.medium, b.medium];
                break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
          })
          .filter((item: Dataset) => {
            const searchStr =
              (item.network + item.siteName + item.variableName + item.variableCode
              + item.siteCode + item.medium).toLowerCase();
            const flagSearched = searchStr.indexOf(this.searchString.toLowerCase()) !== -1;
            const flagDisplayed = (item.selected === true && this.optionDisplay === 'Selected')
              || (item.plotted === true && this.optionDisplay === 'Plotted') || this.optionDisplay === 'All';
            let withinDateRange = true;

            const start = this.__beginDate;
            const end = this.__endDate;
            if ((start && item.startDate < start ) || (end && item.endDate > end)) {
              withinDateRange = false;
            }

            return flagDisplayed && flagSearched && withinDateRange;
          });

        // Grab the page's slice of data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        data = data.splice(startIndex, this.paginator.pageSize);

        let selected = 0;
        for (const d of data) {
          if (d.selected) {
            selected++;
          }
        }

        this.selectedCount = selected;
        this.allSelected = this.selectedCount == data.length;
      });

      this.onDisplayChange('All');

      Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) {
            return;
          }
          this.dataSource.filter = this.filter.nativeElement.value;
        });
    });
  }

  ngOnDestroy() {
    this.pageChanged.unsubscribe();
  }

  onDisplayChange(option: string) {
    this.optionDisplay = option;
    this.paginator.pageIndex = 0;
    this.dataSource.display = option;
  }

  onDateRangeChange() {
    this.dataSource.dateRange = [this.__beginDate, this.__endDate];
  }

  plotSelected() {
    this.plotCount = 0;
    for (let dataset of this.exampleDatabase.data) {
      dataset.plotted = dataset.selected;
      if (dataset.plotted) {
        this.plotCount = this.plotCount + 1;
      }
    }
  }

  clearPlots() {
    for (let dataset of this.exampleDatabase.data) {
      dataset.plotted = false;
      this.plotCount = 0;
    }
  }

  updatePlotCount() {
    let plotted = 0;
    for (const dataset of this.exampleDatabase.data) {
      if (dataset.plotted) {
        plotted++;
      }
    }
    this.plotCount = plotted;
  }

  toggleSelectedAll() {
    // Some are selected, deselect all
    if (this.selectedCount > 0 && this.selectedCount < this.myTable._dataDiffer.collection.length) {
      this.myTable._dataDiffer.collection.forEach((d) => {
        d.selected = false;
      });
    } else if (this.selectedCount === 0) {  // None selected, select all
      this.myTable._dataDiffer.collection.forEach((d) => {
        d.selected = true;
      });
    } else if (this.selectedCount === this.myTable._dataDiffer.collection.length) { // All selected, deselect all
      this.myTable._dataDiffer.collection.forEach((d) => {
        d.selected = false;
      });
    }

    this.updateSelectedCount();
  }

  clearSearch() {
    this.searchString = '';
  }

  updateSelectedCount() {
    let selected = 0;
    for (const d of this.myTable._dataDiffer.collection) {
      if (d.selected) {
        selected++;
      }
    }

    this.selectedCount = selected;
    this.allSelected = this.selectedCount == this.myTable._dataDiffer.collection.length;
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
// const VARIABLE_CODES = ['ODO', 'ODO_Local', 'AAA'];
// const SITE_CODES = ['RB_ARBR_A	', 'ASDSASDFW', 'FFFCVBB'];
// const NETWORKS = ['GAMUT	', 'Logan', 'SLC'];
// const SITE_NAMES = ['Logan River', 'Red Butte Creek', 'Utah River'];
// const VARIABLE_NAMES = ['Temperature', 'Water Pressure', 'Wind Speed'];
// const MEDIUMS = ['Air', 'Water', 'Wind'];

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Dataset[]> = new BehaviorSubject<Dataset[]>([]);

  get data(): Dataset[] {
    return this.dataChange.value;
  }

  constructor() {
    // Fill up the database with samples.
    // for (let i = 0; i < 100; i++) {
    //   this.addDataset();
    // }
  }

  loadDatasets(datasets) {
    this.dataChange.next(datasets);
  }

  /** Adds a dataset to the database. */
  // addDataset() {
  //   const copiedData = this.data.slice();
  //   copiedData.push(this.createNewDataset());
  //   this.dataChange.next(copiedData);
  // }

  /** Builds and returns a new User. */
  // private createNewDataset() {
  //   return {
  //     variableCode: VARIABLE_CODES[Math.round(Math.random() * (VARIABLE_CODES.length - 1))],
  //     network: NETWORKS[Math.round(Math.random() * (NETWORKS.length - 1))],
  //     siteCode: SITE_CODES[Math.round(Math.random() * (SITE_CODES.length - 1))],
  //     siteName: SITE_NAMES[Math.round(Math.random() * (SITE_NAMES.length - 1))],
  //     variableName: VARIABLE_NAMES[Math.round(Math.random() * (VARIABLE_NAMES.length - 1))],
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     medium: MEDIUMS[Math.round(Math.random() * (MEDIUMS.length - 1))],
  //     selected: false,
  //     plotted: false
  //   };
  // }
}

export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  _displayChange = new BehaviorSubject('');
  _dateRangeChange = new BehaviorSubject([]);

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  get display(): string {
    return this._displayChange.value;
  }

  set display(filter: string) {
    this._displayChange.next(filter);
  }

  get dateRange() {
    return this._dateRangeChange;
  }

  set dateRange(filter: any) {
    this._dateRangeChange.next(filter);
  }

  constructor(private _exampleDatabase: ExampleDatabase, private _paginator: MatPaginator, private _sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Dataset[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._filterChange,
      this._displayChange,
      this._paginator.page,
      this._dateRangeChange,
      this._sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this._exampleDatabase.data.slice()
        .sort((a, b) => {
          let propertyA: number | string = '';
          let propertyB: number | string = '';
          let DateA: Date;
          let DateB: Date;

          switch (this._sort.active) {
            case 'variableCode':
              [propertyA, propertyB] = [a.variableCode, b.variableCode];
              break;
            case 'network':
              [propertyA, propertyB] = [a.network, b.network];
              break;
            case 'siteCode':
              [propertyA, propertyB] = [a.siteCode, b.siteCode];
              break;
            case 'siteName':
              [propertyA, propertyB] = [a.siteName, b.siteName];
              break;
            case 'variableName':
              [propertyA, propertyB] = [a.variableName, b.variableName];
              break;
            case 'startDate':
              [DateA, DateB] = [a.startDate, b.startDate];
              break;
            case 'endDate':
              [DateA, DateB] = [a.endDate, b.endDate];
              break;
            case 'medium':
              [propertyA, propertyB] = [a.medium, b.medium];
              break;
          }

          const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

          return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        })
        .filter((item: Dataset) => {
          const searchStr =
            (item.network + item.siteName + item.variableName + item.variableCode
            + item.siteCode + item.medium).toLowerCase();
          const flagSearched = searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          const flagDisplayed = (item.selected === true && this.display === 'Selected')
            || (item.plotted === true && this.display === 'Plotted') || this.display === 'All';
          let withinDateRange = true;

          const start = this.dateRange.value[0];
          const end = this.dateRange.value[1];
          if ((start && item.startDate < start ) || (end && item.endDate > end)) {
            withinDateRange = false;
          }

          return flagDisplayed && flagSearched && withinDateRange;
        });

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      data = data.splice(startIndex, this._paginator.pageSize);
      return data;
    });
  }

  disconnect() {
  }
}
