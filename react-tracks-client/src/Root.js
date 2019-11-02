import React from "react";
import withRoot from "./withRoot";
import {gql} from 'apollo-boost'
import { Query } from 'react-apollo'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import App from "./pages/App"
import Profile from "./pages/Profile"
import Header from "./components/Shared/Header"

import Loading from "./components/Shared/Loading"
import Error from "./components/Shared/Error"


const Root = () => (
    <Query query={ME_QUERY}>
    
    {({data, loading, error}) => {
        if(loading) return <Loading/>
        if(error) return <Error error={error}/>

        const currentUser = data.me
        return (
            <Router>
                <div>
                    {/*IMP: Here an extra var currentUser is passed,
                    with info fetched at Root level passed to Header, which after init in Header
                    can be used easily */}
                <Header currentUser={currentUser}/>
                <Switch>
                    <Route exact path='/' component={App}/>
                    <Route path='/profile/:id' component={Profile}/>
                </Switch>
                </div>
            </Router>
        )
    }}
    </Query>
)

const ME_QUERY = gql`
{
    me{
        id
        username
        email
    }
}
`

const GET_TRACKS_QUERY = gql`
{
    tracks
    {
        id
    }
}
`

export default withRoot(Root);
