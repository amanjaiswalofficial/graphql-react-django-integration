import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {gql} from 'apollo-boost'
import { Query } from 'react-apollo'

import SearchTracks from "../components/Track/SearchTracks"
import TrackList from "../components/Track/TrackList"
import CreateTrack from "../components/Track/CreateTrack"
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";


//C5 Added search functionality, also searchResult is passed via SearchList
//if any value exist in searchResult, that is displayed instead of all
//otherwise all the data's query will be returned
const App = ({ classes }) => {

  const [searchResults, setSearchResults] = useState([])

  return (
    <div className={classes.container}>
    <SearchTracks setSearchResults={setSearchResults}/>
    <CreateTrack/>
    <Query query={GET_TRACKS_QUERY}>
    {({data, loading, error}) => {
      if (loading) return <Loading/>
      if (error) return <Error/>

      const tracks = searchResults.length > 0 ? searchResults: data.tracks
      return <TrackList tracks={tracks}/>
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
