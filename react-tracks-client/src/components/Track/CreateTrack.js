import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";

import {Mutation} from "react-apollo"
import {gql} from "apollo-boost"
import {GET_TRACKS_QUERY} from '../../pages/App'

//C9 Using apollo cache, via 'update' below, in order to update page 
//via cache instead of calling query again
const CreateTrack = ({ classes }) => {

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  //What it does?
  //get data from GET_TRACKS_QUERY saved in cache
  //get latest track created
  //update the cache with the latest track
  const handleUpdateCache = (cache, {data: {createTrack}}) => {
    const data = cache.readQuery({query: GET_TRACKS_QUERY})
    const tracks = data.tracks.concat(createTrack.track)
    cache.writeQuery({query: GET_TRACKS_QUERY, data:{tracks}})
  }

  const handleSubmit = (event, createTrack) => {
    event.preventDefault()
    createTrack({variables: {title, description, url: "http://www.www.com"}})
  }
  
  return (
    <div>
      {/* Create Add Track Button*/}
      <Button variant="fab" className={classes.fab} color="secondary"
      onClick={() => setOpen(true)}>
        {open? <ClearIcon/> : <AddIcon/>}
      </Button>

      {/*onCompleted, hides the box by setting Open to false
      refetchQueries can be used to run some query again to update page etc*/}
      <Mutation mutation={CREATE_TRACK_MUTATION}
      onCompleted={data => {
        setOpen(false)
      }}
      //to run after data posted successfully instead of refetchQueries
      //IMPORTANT: no () with handleUpdateCache??
      update={handleUpdateCache}
      >


        {(createTrack, {loading, error}) => {


          //Create Track Dialog
            return (
              <Dialog open={open} classname={classes.dialog}>
              {/*on Submit the form, the createTrack is called via handleSubmit
              which runs a mutation and returns the value of created Track
              and onCompleted of mutation updates the page as well*/}
              <form onSubmit={event=> handleSubmit(event, createTrack)}>
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
                    onChange={event => setTitle(event.target.value)}/>
                    <TextField
                    multiline
                    rows="2"
                    label="Description"
                    placeholder="Add Description"
                    className={classes.textField}
                    onChange={event => setDescription(event.target.value)}/>
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


//C4 query to create a new track with info given by user
const CREATE_TRACK_MUTATION = gql`
mutation($title: String!, $description: String!, $url: String!){
  createTrack(title: $title, description: $description, url: $url)
  {
    track
    {
      id
      title
      description
      url
      likes{
        id
      }
      postedBy{
        id
        username
      }
    }
  }
}
`

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
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: "200"
  }
});

export default withStyles(styles)(CreateTrack);
