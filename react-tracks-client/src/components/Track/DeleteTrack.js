import React, {useContext} from "react";
import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/DeleteForeverOutlined";

import {Mutation} from "react-apollo"
import {gql} from "apollo-boost"

//To use UserContext to check for user id
import {UserContext} from '../../Root'
//To run after deletion has been made to update the page
import {GET_TRACKS_QUERY} from "../../pages/App"

//C7, use UserContext to check if same user is deleting the track who created it
//if yes, run the mutation, and update the page
const DeleteTrack = ({track}) => {

  const currentUser = useContext(UserContext)
  //check for same user
  const isCurrentUser = currentUser.id === track.postedBy.id
  {/*Mutation with variables defined*/}
  return isCurrentUser && (  

    <Mutation 
    mutation={DELETE_TRACK_MUTATION}
    variables={{trackId: track.id}}
    onCompleted={data => {
        console.log({data})
      }}
    refetchQueries={() => [{query: GET_TRACKS_QUERY}]}
    >
    {deleteTrack => (
      <IconButton onClick={deleteTrack}
      >
        <TrashIcon/>
      </IconButton>
    )}
    </Mutation>
  )
};

//return track's title after deletion
const DELETE_TRACK_MUTATION = gql`
mutation($trackId: Int!){
  deleteTrack(trackId: $trackId){
    track{
      title
    }
  }
}
`

export default DeleteTrack;
