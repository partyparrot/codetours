export const Tours = new Mongo.Collection('tours');
export const Pages = new Mongo.Collection('pages');
import _ from 'lodash';

Tours.helpers({
  getPages() {
    const allPages = _.keyBy(Pages.find({
      tourName: this.repository,
    }).fetch(), 'slug');

    // Sort the pages we got by the array
    return this.pages.map(slug => allPages[slug]);
  }
})

if (typeof window !== 'undefined') {
  window.Tours = Tours;
  window.Pages = Pages;
}
