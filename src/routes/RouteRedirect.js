import React from 'react';
import { Redirect } from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import undefsafe from 'undefsafe';

export const RedirectMissingLocale = function () {
  return <Redirect to={"/en" + window.location.pathname + window.location.search} push />
}

export const RedirectNoMatch = inject("authStore", "userStore", "orgStore")(observer(
  function ({ authStore, userStore, orgStore, ...props }) {  
    if (authStore.isAuth()) {
      if (undefsafe(userStore.currentUser, 'orgsAndRecords.length') > 0) {
        let org = orgStore.getOrganisation(userStore.currentUser.orgsAndRecords[0].organisation, null);
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