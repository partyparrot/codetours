export const Tours = new Mongo.Collection('tours');
export const Pages = new Mongo.Collection('pages');

if (typeof window !== 'undefined') {
  window.Tours = Tours;
  window.Pages = Pages;
}
