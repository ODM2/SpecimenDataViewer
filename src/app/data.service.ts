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
  // public pageChanged;
  public initialized = new BehaviorSubject('');

  constructor(private http: Http) {
  }

  initialize() {
    console.log('Initializing data service');
    this.getData().subscribe(function (data) {
      // let networks = [];
      // let mediums = [];
      // let variables = [];
      // let resultTypes = [];
      let siteCodes = {};

      for (const samplingFeature of data) {
        // networks.push("Some Network");

        for (const dataset of samplingFeature.Datasets) {
          // All results in a dataset share the same variable, medium and result type
          // variables.push(dataset.Results[0].Variable.VariableNameCV);
          // mediums.push(dataset.Results[0].SampledMediumCV);
          // resultTypes.push(dataset.Results[0].ResultTypeCV);

          // Get date ranges
          let minDate = new Date(dataset.Results[0].ResultDateTime);
          let maxDate = new Date(dataset.Results[0].ResultDateTime);

          for (const result of dataset.Results) {
            let date = new Date(result.ResultDateTime);
            if (minDate > date) {
              minDate = date;
            }

            if (maxDate < date) {
              maxDate = date;
            }
          }

          this.datasets.push({
            resultType: dataset.Results[0].ResultTypeCV,
            network: 'Some Network',
            siteCode: samplingFeature.related_features.SamplingFeatureCode,
            siteName: samplingFeature.related_features.SamplingFeatureName,
            medium: dataset.Results[0].SampledMediumCV,
            variableCode: dataset.Results[0].Variable.VariableCode,
            variableName: dataset.Results[0].Variable.VariableNameCV,
            startDate: minDate,
            endDate: maxDate,
            numberOfValues: 12,
            selected: false,
            plotted: false
          });

          if (!siteCodes[samplingFeature.related_features.SamplingFeatureCode]) {
            this.sites.push({
              siteName: samplingFeature.related_features.SamplingFeatureName,
              siteCode: samplingFeature.related_features.SamplingFeatureCode,
              network: " - ",
              state: " - ",
              siteType: samplingFeature.related_features.SiteTypeCV,
              county: " - ",
              latitude: samplingFeature.related_features.Latitude,
              longitude: samplingFeature.related_features.Longitude,
            });

            siteCodes[samplingFeature.related_features.SamplingFeatureCode] = true;
          }
        }
      }

      // // Classifier definition
      // const count = function (ary, classifier) {
      //   return ary.reduce(function (counter, item) {
      //     const p = (classifier || String)(item);
      //     counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
      //     return counter;
      //   }, {});
      // };
      //
      // networks = count(networks, function (item) {
      //   return item;
      // });
      //
      // let sitesCount = count(this.sites, function (item) {
      //   return item.siteName;
      // });
      //
      // variables = count(variables, function (item) {
      //   return item;
      // });
      //
      // mediums = count(mediums, function (item) {
      //   return item;
      // });
      //
      // resultTypes = count(resultTypes, function (item) {
      //   return item;
      // });
      //
      // const networkItems = [];
      // for (const network in networks) {
      //   networkItems.push(new FilterItem(network, networks[network], "test"));
      // }
      //
      // const siteItems = [];
      // for (const site in sitesCount) {
      //   siteItems.push(new FilterItem(site, sitesCount[site], "test"));
      // }
      //
      // const variableItems = [];
      // for (const variable in variables) {
      //   variableItems.push(new FilterItem(variable, variables[variable], "test"));
      // }
      //
      // const mediumItems = [];
      // for (const medium in mediums) {
      //   mediumItems.push(new FilterItem(medium, mediums[medium], "test"));
      // }
      //
      // const resultTypeItems = [];
      // for (const resultType in resultTypes) {
      //   resultTypeItems.push(new FilterItem(resultType, resultTypes[resultType], "test"));
      // }

      this.filters = [
        new Filter('Network', networkItems, 'group_work', "network"),
        new Filter('Site', siteItems, 'location_on', "siteCode"),
        new Filter('Medium', mediumItems, 'landscape', "medium"),
        new Filter('Variable', variableItems, 'settings_remote', "variableCode"),
        new Filter('Result Type', resultTypeItems, 'class', "resultType" ),
      ];

      this.initialized.next('Data loaded');
    }.bind(this));
  }

  getData() {
    return this.http.get('http://odm2wofpy1.uwrl.usu.edu/v1/samplingfeaturedatasets?samplingFeatureID=1001%2C%201002%2C%201003%2C%201004').map(
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
  }

  getDatasets() {
    return this.datasets.slice();
  }

  getSites() {
    return this.sites.slice();
  }

  clearAllFilters() {
    for(let filter of this.filters) {
      for (let item of filter.items) {
        item.selected = false;
      }
    }
  }
}
