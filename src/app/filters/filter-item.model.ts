export class FilterItem {
  public name: string;
  public count: number;
  public selected: boolean;

  constructor(name: string, count: number, selected: boolean) {
    this.name = name;
    this.count = count;
    this.selected = selected;
  }
}
