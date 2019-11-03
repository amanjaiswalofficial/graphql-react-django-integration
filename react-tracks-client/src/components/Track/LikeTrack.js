import React, {useContext} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

//get updated ME_QUERY as well to compare if user already liked a track once
//by comparing if that user's id exists in the likeSet of the track
import {UserContext, ME_QUERY} from "../../Root"

//C8 Compare if user already liked a track, and disable the like button in that case
//otherwise enable the like button and allow to like the track once
const LikeTrack = ({ classes, trackId, likeCount }) => {

  const currentUser = useContext(UserContext)

  //check for likeSet and user presence in likeSet of a track
  const handleDisabledLikedTrack = () => {
    const userLikes = currentUser.likeSet
    const isTrackLiked = userLikes.findIndex(({track}) => track.id === trackId) > -1
    return isTrackLiked
  }

  return (
    <Mutation mutation={CREATE_LIKE_MUTATION}
    variables={{trackId}}
    onCompleted={data => {
      console.log(data)
    }}
    refetchQueries={() => [{query: ME_QUERY}]}>
      {createLike => (
        <IconButton className={classes.iconButton} onClick={event => 
          {
            event.stopPropagation()
            createLike()
          }}
          disabled={handleDisabledLikedTrack()}
          >
        {likeCount}
        <ThumbUpIcon className={classes.icon}/>
        </IconButton>
      )}
    </Mutation>
  )
};


//if user can like the track
//mutation to add a like to that track
const CREATE_LIKE_MUTATION =gql`
mutation($trackId: Int!){
  createLike(trackId: $trackId){
    track{
      id
      likes{
        id
      }
    }
  }
}
`

const styles = theme => ({
  iconButton: {
    color: "deeppink"
  },
  icon: {
    marginLeft: theme.spacing.unit / 2
  }
});

export default withStyles(styles)(LikeTrack);
