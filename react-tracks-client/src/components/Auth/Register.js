import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Gavel from "@material-ui/icons/Gavel";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import Error from '../Shared/Error'



//This will use createUser and pass 3 values to run the query on GraphQL side
const Register = ({ classes, setnewUser }) => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [open, setOpen] = useState(false)

  //c.handleSubmit runs createUser function from GQLMutation
  const handleSubmit = (event, createUser) =>
  {
    event.preventDefault()
    //e.gets whatever output createUser returns
    createUser()
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}><Gavel/></Avatar>
        <Typography variant="headline">Register</Typography>

        <Mutation 
        mutation={REGISTER_MUTATION} 
        variables={{username, email, password}}
        onCompleted={data => {
          console.log({data})
          setOpen(true)
          setnewUser(true)
        }}>


        {(createUser, {error}) => {
          return (
            <form onSubmit={event => handleSubmit(event, createUser)} className={classes.form}>
              <FormControl margin='normal' required fullwidth>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input id="username" 
              onChange={event => {setUsername(event.target.value)}}/>
              </FormControl>
              <FormControl margin='normal' required fullwidth>
              <InputLabel htmlFor="Password">Password</InputLabel>
              <Input id="password" type="password"
              onChange={event => {setPassword(event.target.value)}}/>
              </FormControl>
              <FormControl margin='normal' required fullwidth>
              <InputLabel htmlFor="email">E-mail address</InputLabel>
              <Input id="email"
              onChange={event => {setEmail(event.target.value)}}/>
              </FormControl>
              <Button 
              type="submit" 
              fullwidth variant="contained" color="secondary" 
              className={classes.submit}>Register</Button>
              <Button 
              fullwidth variant="outlined" color="primary" onClick={() => {setnewUser(false)}}>Previous User Log In</Button>

            {/*Error handling*/}
            {/* If any error returned, display it as an Error class's instance*/}
            {error && <Error error={error}/>}

            </form>)
        }}
        </Mutation>

        {/*Success dialog box*/}
        <Dialog 
        open={open}
        disableBackdropClick={true}>
          <DialogTitle>
            <VerifiedUserTwoTone className={classes.icon}/>
            New Account
          </DialogTitle>
          <DialogContent>
            <DialogContentText>User created Successfully!</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" variant="contained" onClick={()=> {setnewUser(false)}}>
            Login
            </Button>
          </DialogActions>
        </Dialog>

      </Paper>
    </div>
  )
};


//The actual query when run will return a created user
//Hence requires values for variables to be provided.
//Which here are being passed from above form.
//d.Values are provided for the required variables
const REGISTER_MUTATION = gql`
mutation ($username: String!, $email: String!, $password: String!){
  createUser(username: $username, email: $email, password: $password)
  {
    user{
      username
      email
    }
  }
}`

const styles = theme => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle",
    color: "green"
  }
});

export default withStyles(styles)(Register);
