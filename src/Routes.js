import React from "react";
import { Route, Switch } from 'react-router-dom';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import Profile from './components/profile/ProfileBox';

export default class Routes extends React.Component {
    
    render() {
        return (
                
                <div>
                    <Switch>
                        {/* HOME PART */}
                        <Route exact path="/" component={Home} />
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
                        <Route path="/profile" component={Profile} />
                        <Route path="/profile/edit" component={null} />

                        {/* Search */}
                        <Route path="/search" component={Search} />

                        {/* Wingzy admin */}
                        <Route path="/admin/organisation" component={null} />
                        <Route path="/admin/user/list" component={null} />
                        
                    </Switch>
                </div>

        );
    }
}
