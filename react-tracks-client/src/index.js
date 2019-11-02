import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root"
import Auth from "./components/Auth"
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider, Query } from 'react-apollo';
import ApolloClient, {gql} from 'apollo-boost'


const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql/',
    fetchOptions: {
        credentials: "include"
    },
    request: operation => {
        const token = localStorage.getItem('authToken') || ""
        operation.setContext({
            headers: {
                Authorization: `JWT ${token}`
            }
        })
    },
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
