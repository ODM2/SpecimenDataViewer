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
      let siteCodes = {};

      for (const samplingFeature of data) {

        for (const dataset of samplingFeature.Datasets) {
          // All results in a dataset share the same variable, medium and result type

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

      // ---- FACETS ----
      // Name: the name used for the facet panel header
      // label: the key used to render the item label
      // filterKey: the key used to filter against the table
      let facets = [
        {name: 'Network', label: 'network', filterKey: 'network', icon: 'group_work', items: [], count: 0},
        {name: 'Site', label: 'siteName', filterKey: 'siteCode', icon: 'location_on', items: [], count: 0},
        {name: 'Variable', label: 'variableName', filterKey: 'variableCode', icon: 'settings_remote', items: [], count: 0},
        {name: 'Medium', label: 'medium', filterKey: 'medium', icon: 'landscape', items: [], count: 0},
        {name: 'Result Type', label: 'resultType', filterKey: 'resultType', icon: 'class', items: [], count: 0},
      ];

      // Fetch the filter data from the datasets
      for (let dataset of this.datasets) {
        for (let facet of facets) {
          if (facet.items[dataset[facet.filterKey]]) {
            facet.items[dataset[facet.filterKey]].count += 1;
          }
          else {
            facet.items[dataset[facet.filterKey]] = new FilterItem(dataset[facet.label], dataset[facet.filterKey], 1)
          }
        }
      }

      // Build Filter instances using the object data
      this.filters = [];
      for (let facet of facets) {
        let collection = [];
        for (let item in facet.items) {
          collection.push(facet.items[item]);
        }

        this.filters.push(new Filter(facet.name, collection, facet.icon, facet.filterKey))
      }

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
