import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import {Link} from 'react-router-dom'

import AudioPlayer from '../Shared/AudioPlayer'
import LikeTrack from './LikeTrack'
import DeleteTrack from './DeleteTrack'
import UpdateTrack from './UpdateTrack'


//C4. Displaying and adding Tracks on the page
//below receives the tracks from data after making a query
//each track is then mapped so that it can be displayed as an individual element
const TrackList = ({ classes, tracks }) => (
  <List>
  {tracks.map(track => (
      <ExpansionPanel key={track.id}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <ListItem className={classes.root}>
          <LikeTrack trackId={track.id} likeCount={track.likes.length}/>
          {/*Various detail of tracks are displayed */}
            <ListItemText
            primaryTypographyProps={{
              variant: "subheading",
              color: "primary"
            }}
            primary={track.title} secondary={<Link className={classes.link} to={`/profile/${track.postedBy.id}`}>
              {track.postedBy.username}
            </Link>}/>
          </ListItem>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
            <Typography variant="body1">
              {track.description}
            </Typography>
        </ExpansionPanelDetails>
      <ExpansionPanelActions>
            <UpdateTrack track={track}/>
            <DeleteTrack track={track}/>
      </ExpansionPanelActions>
      </ExpansionPanel>
    ))}
  </List>
);

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  details: {
    alignItems: "center"
  },
  link: {
    color: "#424242",
    textDecoration: "none",
    "&:hover": {
      color: "black"
    }
  }
};

export default withStyles(styles)(TrackList);
