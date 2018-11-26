import GuestRoutes from './pages/guest';
import AuthRoutes from './pages/auth';
import SplashScreen from './pages/splash';
import PwaIcon192 from "./resources/img/react-pwa.png";
import PwaIcon512 from "./resources/img/react-pwa-big.png";

export default class Routes {
  // eslint-disable-next-line
  apply(routeHandler) {
    routeHandler.setPwaSchema({
        "name": "Wingzy",
        "short_name": "Wingzy",
  
        // Possible values ltr(left to right)/rtl(right to left) #optional
        "dir": "ltr",
  
        // language: Default en-US #optional
        "lang": "en-US",
        "icons": [
              {
                "src": PwaIcon192,
                "sizes": "192x192"
              },
              {
                "src": PwaIcon512,
                "sizes": "512x512"
              }
              // You may add more size if you want to, but it is optional
            ]
      });
    routeHandler.setDefaultSeoSchema({
      title: 'Wingzy',
    });

    const routes = [
      ...GuestRoutes,
      ...AuthRoutes,
      ...SplashScreen,
    ];

    routeHandler.hooks.initRoutes.tapPromise('AppRoutes', async () => {
      routeHandler.addRoutes(routes);
    });
  }
  
}
