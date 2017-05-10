import { SpecimenDataViewerPage } from './app.po';

describe('specimen-data-viewer App', () => {
  let page: SpecimenDataViewerPage;

  beforeEach(() => {
    page = new SpecimenDataViewerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
