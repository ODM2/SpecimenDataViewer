import {Filter} from './filters/filter.model';
import {FilterItem} from './filters/filter-item.model';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/Rx';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class DataService {
  private filters: Filter[];
  private dataseries = [];
  private sites = [];
  public pageChanged;
  public initialized = new BehaviorSubject('');

  constructor(private http: Http) {
  }

  initialize() {
    console.log('Initializing data service');
    this.getData().subscribe(function (data) {
      this.dataseries = [
        {
          type: 'Sample Result',
          network: 'Some Network',
          siteCode: 'ABCDE',
          siteName: 'Red Butte Creek',
          medium: 'Aquatic',
          variableCode: 'ODO',
          variableName: 'Oxygen, dissolved',
          variableDate: new Date('February 4, 2016 10:13:00'),
          startDate: new Date('February 2, 2016 10:13:00'),
          endDate: new Date('February 5, 2016 10:13:00'),
          numberOfValues: 12,
        },
        {
          type: 'Sensor Result',
          network: 'Logan River',
          siteCode: 'RB_ARBR_A',
          siteName: 'Water Lab',
          medium: 'Aquatic',
          variableCode: 'ODO_Local',
          variableName: 'Oxygen, dissolved',
          variableDate: new Date('February 22, 2016 10:13:00'),
          startDate: new Date('February 1, 2016 10:13:00'),
          endDate: new Date('February 8, 2016 10:13:00'),
          numberOfValues: 23,
        },
        {
          type: 'Sample Result',
          network: 'Red Butte Creek',
          siteCode: 'ZZZ',
          siteName: 'Some Site Name',
          medium: 'Aquatic',
          variableCode: 'AAA',
          variableName: 'Oxygen',
          variableDate: new Date('January 1, 2016 10:13:00'),
          startDate: new Date('February 22, 2016 10:13:00'),
          endDate: new Date('February 29, 2016 10:13:00'),
          numberOfValues: 100,
        }
      ];

      this.sites = [
        {
          siteName: 'Logan River near Franklin Basin',
          siteCode: 'LR_FB_BA',
          network: 'Logan River',
          state: 'Utah',
          siteType: 'Stream',
          county: 'Cache',
          latitude: 41.9502,
          longitude: -111.580553
        },
        {
          siteName: 'Some other site',
          siteCode: 'SOS',
          network: 'Logan River',
          state: 'Utah',
          siteType: 'Stream',
          county: 'Cache',
          latitude: 40.9502,
          longitude: -113.580553
        },
      ];

      let networks = [];
      let sites = [];
      let mediums = [];
      let variables = [];
      let resultTypes = [];


      for (const samplingFeature of data) {
        networks.push("Some Network");
        sites.push("Some Site");

        for (const dataset of samplingFeature.Datasets) {
          for (const result of dataset.Results) {
            variables.push(result.Variable.VariableNameCV);
            break; // Because all results in one dataset share the same variable
          }
        }

        mediums.push(samplingFeature.SpecimenMediumCV);
        resultTypes.push("Some Result Type");
      }

      // Classifier definition
      const count = function (ary, classifier) {
        return ary.reduce(function (counter, item) {
          const p = (classifier || String)(item);
          counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
          return counter;
        }, {});
      };

      networks = count(networks, function (item) {
        return item;
      });

      sites = count(sites, function (item) {
        return item;
      });

      console.log(variables)

      variables = count(variables, function (item) {
        return item;
      });

      mediums = count(mediums, function (item) {
        return item;
      });

      resultTypes = count(resultTypes, function (item) {
        return item;
      });

      const networkItems = [];
      for (const network in networks) {
        networkItems.push(new FilterItem(network, networks[network]));
      }

      const siteItems = [];
      for (const site in sites) {
        siteItems.push(new FilterItem(site, sites[site]));
      }

      const variableItems = [];
      for (const variable in variables) {
        variableItems.push(new FilterItem(variable, variables[variable]));
      }

      const mediumItems = [];
      for (const medium in mediums) {
        mediumItems.push(new FilterItem(medium, mediums[medium]));
      }

      const resultTypeItems = [];
      for (const resultType in resultTypes) {
        resultTypeItems.push(new FilterItem(resultType, resultTypes[resultType]));
      }

      this.filters = [
        new Filter('Network', networkItems, 'group_work'),
        new Filter('Site', siteItems, 'location_on'),
        new Filter('Medium', mediumItems, 'landscape'),
        new Filter('Variable', variableItems, 'settings_remote'),
        new Filter('Result Type', resultTypeItems, 'class'),
      ];

      this.initialized.next('Data loaded');
    }.bind(this));
  }

  getData() {
    return this.http.get('http://odm2wofpy1.uwrl.usu.edu/v1/samplingfeaturedatasets?samplingFeatureID=1001%2C1002').map(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        return data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getFilters() {
    return this.filters;
    // return this.filters.slice();
  }

  getDataseries() {
    return this.dataseries.slice();
  }

  getSites() {
    return this.sites.slice();
  }
}
