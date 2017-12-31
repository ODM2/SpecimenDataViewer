import {FilterItem} from "./filter-item.model";
export class Filter {
  public label: string;
  public items: FilterItem[];
  public icon: string;
  public key: string;

  constructor(name: string, items: FilterItem[], icon: string, filterKey: string) {
    this.label = name;
    this.key = filterKey;
    this.items = items;
    this.icon = icon;
  }
}
