import React from 'react';
import {RedirectMissingLocale, RedirectNoMatch} from './RouteRedirect';

const PasswordForgot = React.lazy(() => import('../pages/auth/PasswordForgot'));
const PasswordReset = React.lazy(() => import('../pages/auth/PasswordReset'));
const OnboardPage = React.lazy(() => import('../pages/OnboardPage'));
const SearchPage = React.lazy(() => import('../pages/SearchPage'));
const AuthPage = React.lazy(() => import('../pages/auth/AuthPage'));
const ErrorPage = React.lazy(() => import('../pages/ErrorPage'));
const WelcomePage = React.lazy(() => import('../pages/WelcomePage'));
const RoutesWithLocale = React.lazy(() => import('./RoutesWithLocale'));
const RoutesWithOrgTag = React.lazy(() => import('./RoutesWithOrgTag'));

export const routes = [
  {
    path: "/:locale(en|fr|en-UK)",
    component: RoutesWithLocale,
    routes: [
      {
        path: "/:locale(en|fr|en-UK)/welcome",
        component: WelcomePage,
        exact: true
      },
      {
        path: "/:locale(en|fr|en-UK)/error/:errorCode/:errorType?",
        component: ErrorPage,
        exact: true
      },
      {
        path: "/:locale(en|fr|en-UK)/password/forgot",
        component: PasswordForgot,
        exact: true
      },
      {
        path: "/:locale(en|fr|en-UK)/password/reset/:token/:hash",
        component: PasswordReset,
        exact: true
      },
      {
        path: "/:locale(en|fr|en-UK)/password/create/:token/:hash/:email",
        component: PasswordReset,
        exact: true
      },
      {
        path: "/:locale(en|fr|en-UK)/(signin|signup)",
        component: AuthPage,
      },
      {
        path: "/:locale(en|fr|en-UK)/:orgTag",
        component: RoutesWithOrgTag,
        routes: [
          {
            path: "/:locale(en|fr|en-UK)/:orgTag/password/forgot",
            component: PasswordForgot,
            exact: true
          },
          {
            path: "/:locale(en|fr|en-UK)/:orgTag/password/reset/:token/:hash",
            component: PasswordReset,
            exact: true
          },
          {
            path: "/:locale(en|fr|en-UK)/:orgTag/password/create/:token/:hash/:email",
            component: PasswordReset,
            exact: true
          },
          {
            path: "/:locale(en|fr|en-UK)/:orgTag/(signin|signup)/google/callback",
            component: AuthPage
          },
          {
            path: "/:locale(en|fr|en-UK)/:orgTag/(signin|signup)/:invitationCode?",
            component: AuthPage
          },
          {
            path: "/:locale(en|fr|en-UK)/:orgTag/password/forgot",
            component: PasswordForgot,
            exact: true
          },
          {
            path: [
              "/:locale(en|fr|en-UK)/:orgTag/onboard/:step/:mode/:recordTag",
              "/:locale(en|fr|en-UK)/:orgTag/onboard/:step?"
            ],
            component: OnboardPage,
            exact: true
          },
          {
            path: [
              "/:locale(en|fr|en-UK)/:orgTag/:hashtags/:action",
              "/:locale(en|fr|en-UK)/:orgTag/congrats",
              "/:locale(en|fr|en-UK)/:orgTag/:recordTag?"
            ],
            component: SearchPage,
            exact: true
          },
          {
            path: "*",
            component: RedirectNoMatch
          }
        ]
      },
      {
        path: "*",
        component: RedirectNoMatch
      }
    ]
  },
  {
    path: "*",
    component: RedirectMissingLocale
  }
]