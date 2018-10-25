import { TALHackatonFrontPage } from './app.po';

describe('tal-hackaton-front App', () => {
  let page: TALHackatonFrontPage;

  beforeEach(() => {
    page = new TALHackatonFrontPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
