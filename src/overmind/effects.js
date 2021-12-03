import page from 'page';

export const router = {
  // Each key in routes is a route, and the value is an action function from overmind
  initialize (routes) {
    console.log('Initializing router with routes: ', routes);
    Object.keys(routes).forEach(url => {
      page(url, ({ params }) => routes[url](params));
    });
    page.base('/geowhen');
    page.start();
  },
  navigateTo: (url) => {
    console.log('Navigating to: ', url);
    // If the stage is undefined, just go back to home
    if (url.match('undefined')) {
      page.show('/');
    } else {
      page.show(url)
    }
  },
};
