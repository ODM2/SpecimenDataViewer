export class FilterItem {
  public name: string;
  public count: number;
  public selected: boolean;
  public filterValue: string;

  constructor(name: string, count: number, filterValue: string, selected = false) {
    this.name = name;
    this.count = count;
    this.selected = selected;
    this.filterValue = filterValue;
  }
}
