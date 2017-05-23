import {FilterItem} from "./filter-item.model";
export class Filter {
  public name: string;
  public items: FilterItem[];
  public icon: string;

  constructor(name: string, items: FilterItem[], icon: string) {
    this.name = name;
    this.items = items;
    this.icon = icon;
  }
}
