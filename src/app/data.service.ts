import {Filter} from './filters/filter.model';
import {FilterItem} from './filters/filter-item.model';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/Rx';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class DataService {
  private filters: Filter[];
  private datasets = [];
  private sites = [];
  public pageChanged;
  public initialized = new BehaviorSubject('');

  constructor(private http: Http) {
  }

  initialize() {
    console.log('Initializing data service');
    this.getData().subscribe(function (data) {

      let networks = [];
      let sites = [];
      let mediums = [];
      let variables = [];
      let resultTypes = [];

      for (const samplingFeature of data) {
        networks.push("Some Network");
        // sites.push("Some Site");

        for (const dataset of samplingFeature.Datasets) {
          // All results in a dataset share the same variable, medium and result type
          variables.push(dataset.Results[0].Variable.VariableNameCV);
          mediums.push(dataset.Results[0].SampledMediumCV);
          resultTypes.push(dataset.Results[0].ResultTypeCV);

          this.datasets.push({
            type: dataset.Results[0].ResultTypeCV,
            network: 'Some Network',
            siteCode: samplingFeature.related_features.SamplingFeatureCode,
            siteName: samplingFeature.related_features.SamplingFeatureName,
            medium: dataset.Results[0].SampledMediumCV,
            variableCode: dataset.Results[0].Variable.VariableCode,
            variableName: dataset.Results[0].Variable.VariableNameCV,
            startDate: new Date('February 2, 2016 10:13:00'),
            endDate: new Date('February 5, 2016 10:13:00'),
            numberOfValues: 12,
            selected: false,
            plotted: false
          })
        }

        sites.push(samplingFeature.related_features.SamplingFeatureName);
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
        return response.json();
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

  getDatasets() {
    return this.datasets.slice();
  }

  getSites() {
    return this.sites.slice();
  }
}
