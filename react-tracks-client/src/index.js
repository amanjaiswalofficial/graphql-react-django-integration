import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root"
import Auth from "./components/Auth"
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider, Query } from 'react-apollo';
import ApolloClient, {gql} from 'apollo-boost'


//a.defined client's clientState is passed on the Mutation/Query and used to read write data
const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql/',
    clientState: {
        defaults: {
            // two times ! convert any value to boolean, hence stored as true or false
            isLoggedIn: !!localStorage.getItem('authToken')
        }
    }
})

//b.to check the value from the client, the const defined above
const IS_LOGGED_IN_QUERY = gql`
query{
    isLoggedIn @client
}
`

//c.value of isLoggedIn is checked to see if user logged in or not
//if not return Auth component else return Root
ReactDOM.render(
    <ApolloProvider client={client}>
    <Query query={IS_LOGGED_IN_QUERY}>
        {({data}) => data.isLoggedIn ? <Root/> : <Auth/>}
    </Query>
    </ApolloProvider>
, document.getElementById("root"))


serviceWorker.unregister();
