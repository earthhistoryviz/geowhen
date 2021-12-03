import page from 'page';

export const router = {
  initialize (routes) {
    Object.keys(routes).forEach(url => {
      page(url, ({ params }) => routes[url](params));
    });
    page.start();
  },
  open: (url) => page.show(url)
};
