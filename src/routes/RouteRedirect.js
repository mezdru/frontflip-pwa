import React from 'react';
import { Redirect } from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import undefsafe from 'undefsafe';

export const RedirectMissingLocale = function () {
  let locale = navigator.language || navigator.browserLanguage;
  if(locale.includes('fr')) locale = 'fr';
  else locale = 'en';

  return <Redirect to={"/" + locale + window.location.pathname + window.location.search} push />
}

export const RedirectNoMatch = inject("authStore", "userStore", "orgStore")(observer(
  function ({ authStore, userStore, orgStore, ...props }) {  
    if (authStore.isAuth()) {
      if(!userStore.currentUser) return <Redirect to={'/' + props.locale + '/error/500/routes'} push />
      if(!userStore.currentUser.email.validated) return <Redirect to={'/' + props.locale + '/error/403/email'} push />
      if (undefsafe(userStore.currentUser, 'orgsAndRecords.length') > 0) {
        let oar = userStore.currentUser.orgsAndRecords[0];
        let org = orgStore.getOrganisation((oar.organisation._id || oar.organisation), null);
        if(org) return <Redirect to={'/' + props.locale + '/' + org.tag} push />
        else return <Redirect to={'/' + props.locale + '/welcome'} push />
      } else {
        return <Redirect to={'/' + props.locale + '/welcome'} push />
      }
    } else {
      return <Redirect to={'/' + props.locale + '/signin'} push />
    }
  }
));