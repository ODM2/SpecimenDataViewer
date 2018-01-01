export class FilterItem {
  public label: string;
  public count: number;
  public selected: boolean;
  public filterValue: string;

  constructor(label: string, filterValue: string, count: number, selected = false) {
    this.label = label;
    this.count = count;
    this.selected = selected;
    this.filterValue = filterValue;
  }
}
