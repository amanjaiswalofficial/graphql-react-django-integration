import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {gql} from 'apollo-boost'
import { Query } from 'react-apollo'

import SearchTracks from "../components/Track/SearchTracks"
import TrackList from "../components/Track/TrackList"
import CreateTrack from "../components/Track/CreateTrack"
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";


//C4 Based on the query made, a list of tracks is sent as value for Tracks
//to Tracks component, which will display all of them as individual components
const App = ({ classes }) => {
  return (
    <div className={classes.container}>
    <SearchTracks/>
    <CreateTrack/>
    <Query query={GET_TRACKS_QUERY}>
    {({data, loading, error}) => {
      if (loading) return <Loading/>
      if (error) return <Error/>

      return <TrackList tracks={data.tracks}/>
    }}
    </Query>
    </div>
  )
};


//C4, actual query to get the track details
export const GET_TRACKS_QUERY = gql`
query getTracksQuery{
  tracks{
    id
    title
    description
    url
    likes{
      id
    }
    postedBy
    {
      id
      username
    }
  }
}
`

const styles = theme => ({
  container: {
    margin: "0 auto",
    maxWidth: 960,
    padding: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(App);
