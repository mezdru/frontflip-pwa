import React from "react";
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';

export default class Routes extends React.Component {

    render() {
        return (
                <BrowserRouter>
                    <Switch>
                        {/* HOME PART */}
                        <Route path="/" component={Home} />
                        <Route path="/pricing" component={null} />
                        <Route path="/terms" component={null} />
                        <Route path="/protectingYourData" component={null} />

                        {/* Login */}
                        <Route path="/login/:action" component={null} />

                        {/* Onboard : new wingzy*/}
                        <Route path="/wingzy/intro" component={null} />
                        <Route path="/wingzy/create" component={null} />
                        <Route path="/wingzy/congratulations" component={null} />

                        {/* Onboard : new profile */}
                        <Route path="/onboard/welcome" component={null} />
                        <Route path="/onboard/intro" component={null} />
                        <Route path="/onboard/hashtags" component={null} />
                        <Route path="/onboard/links" component={null} />

                        {/* Invitation */}
                        <Route path="/invite" component={null} />

                        {/* Profile */}
                        <Route path="/profile" component={null} />
                        <Route path="/profile/edit" component={null} />

                        {/* Search */}
                        <Route path="/search" component={null} />

                        {/* Wingzy admin */}
                        <Route path="/admin/organisation" component={null} />
                        <Route path="/admin/user/list" component={null} />
                        
                    </Switch>
                </BrowserRouter>
        );
    }
}