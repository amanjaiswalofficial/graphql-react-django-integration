import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root"
import Auth from "./components/Auth"
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider, Query } from 'react-apollo';
import ApolloClient, {gql} from 'apollo-boost'


//C2: To add header and adding auth header value
const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql/',
    //2a. adding option to include credentials
    fetchOptions: {
        credentials: "include"
    },
    //2b. getting value out of localStorage
    //and adding it as auth header while passing any request
    request: operation => {
        const token = localStorage.getItem('authToken') || ""
        operation.setContext({
            headers: {
                Authorization: `JWT ${token}`
            }
        })
    },
    //2c.After this any query needing JWT token can be run, as shown in Root's ME_QUERY
    clientState: {
        defaults: {
            isLoggedIn: !!localStorage.getItem('authToken')
        }
    }
})


const IS_LOGGED_IN_QUERY = gql`
query{
    isLoggedIn @client
}
`

ReactDOM.render(
    <ApolloProvider client={client}>
    <Query query={IS_LOGGED_IN_QUERY}>
        {({data}) => data.isLoggedIn ? <Root/> : <Auth/>}
    </Query>
    </ApolloProvider>
, document.getElementById("root"))


serviceWorker.unregister();
