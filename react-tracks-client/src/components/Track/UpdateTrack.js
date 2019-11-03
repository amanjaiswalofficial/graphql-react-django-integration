import React, {useState, useContext} from "react";
import {Mutation} from "react-apollo"
import {gql} from "apollo-boost"
import axios from "axios"
import {GET_TRACKS_QUERY} from '../../pages/App'
import ClearIcon from "@material-ui/icons/Clear";

import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";

import {UserContext} from '../../Root'

const UpdateTrack = ({ classes, track }) => {

  //C5 using useContext to get value sent by Root
  const currentUser = useContext(UserContext)
  //onChange of values, the value of title and description changes as well
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(track.title)
  const [description, setDescription] = useState(track.description)

  //checking if same user who created the track is trying to change the track
  const isCurrentUser = currentUser.id === track.postedBy.id

  const handleSubmit = (event, updateTrack) => {
    event.preventDefault()
    updateTrack({variables: {trackId:track.id, title, description, url: "http://www.www.com"}})
  }
  
  //only if isCurrentUser is true, the update button is displayed
  return isCurrentUser && (
    <div>
      {/* Create Update Track Button*/}
      <Button variant="fab" classname={classes.fab} color="secondary"
      onClick={() => setOpen(true)}>
        {open? <ClearIcon/> : <EditIcon/>}
      </Button>

      {/* Query to run in order to update the track*/}
      <Mutation mutation={UPDATE_TRACK_MUTATION}
      onCompleted={data => {
        setOpen(false)
      }}
      refetchQueries={() => [{query: GET_TRACKS_QUERY}]}
      >


        {(updateTrack, {loading, error}) => {


          //Update Track Dialog
            return (
              <Dialog open={open} classname={classes.dialog}>
              <form onSubmit={event=> handleSubmit(event, updateTrack)}>
                <DialogTitle>Create Track</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Add Title and Description
                  </DialogContentText>
                  <FormControl fullWidth>
                    <TextField
                    label="Title"
                    placeholder="Add Title"
                    className={classes.textField}
                    onChange={event => setTitle(event.target.value)}
                    value={title}/>
                    
                    <TextField
                    multiline
                    rows="2"
                    label="Description"
                    placeholder="Add Description"
                    className={classes.textField}
                    onChange={event => setDescription(event.target.value)}
                    value={description}/>
                  </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button className={classes.cancel} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" className={classes.save}>Save</Button>
                  </DialogActions>
                </form>
                </Dialog>        
            )
        }}

      </Mutation>
      
    </div>

  )
};

const UPDATE_TRACK_MUTATION = gql`
mutation($trackId: Int!, $title: String!, $description: String!, $url: String!)
{
  updateTrack(trackId: $trackId, title: $title, description: $description, url: $url)
  {
    track{
    id
    title
    description
    url
    postedBy
    {
      id
      username
    }
    }
  }
}`

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  dialog: {
    margin: "0 auto",
    maxWidth: 550
  },
  textField: {
    margin: theme.spacing.unit
  },
  cancel: {
    color: "red"
  },
  save: {
    color: "green"
  },
  button: {
    margin: theme.spacing.unit * 2
  },
  icon: {
    marginLeft: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

export default withStyles(styles)(UpdateTrack);
