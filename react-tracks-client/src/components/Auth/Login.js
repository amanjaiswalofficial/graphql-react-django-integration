import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Lock from "@material-ui/icons/Lock";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import Error from '../Shared/Error'

//To Login the user and obtain it's JWTToken, which is later stored in localStorage as authToken
//And at the same time, value for isLoggedIn set to true in clientState variable
const Login = ({ classes, setnewUser }) => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  //b.handleSubmit takes a method as input and executes it
  const handleSubmit = async(event, tokenAuth, client) =>
  {
    console.log(client)
    event.preventDefault()
    //c. method same name as defined in the GQLQuery below executed with values provided
    const res = await tokenAuth()
    localStorage.setItem("authToken", res.data.tokenAuth.token)
    client.writeData({data: {isLoggedIn: true}})
  }


  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}><Lock/></Avatar>
        <Typography variant="headline">Login</Typography>

        {/*Mutation defined with what GQLQuery to use, 
        the variables to be used in it and what to do when success.
        Here, they are passed and displayed on the console*/}
        <Mutation
        mutation={LOGIN_MUTATION} 
        variables={{username, password}}
        onCompleted={data => {
          console.log({data})
          setnewUser(false)
        }}>
              {/*tokenAuth passed as function to pass and call
              error and client parts of Mutation, client defined while initializing apolloclient*/}
              {(tokenAuth, {error, called, client}) => {
                return (
                  <form onSubmit={event => handleSubmit(event, tokenAuth, client)} className={classes.form}>
                    <FormControl margin='normal' required>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input id="username" 
                    onChange={event => {setUsername(event.target.value)}}/>
                    </FormControl>
                    <FormControl margin='normal' required>
                    <InputLabel htmlFor="Password">Password</InputLabel>
                    <Input id="password" type="password"
                    onChange={event => {setPassword(event.target.value)}}/>
                    </FormControl>
                    {/*a. With correct username and password, passed to onSubmit's method*/}
                    <Button 
                    type="submit" 
                    variant="contained" color="primary" 
                    className={classes.submit}>Login</Button>
                    <Button 
                    variant="outlined" color="secondary" onClick={() => {setnewUser(true)}}>New User? Register</Button>

                  {/*Error handling*/}
                  {/* If any error returned, display it as an Error class's instance*/}
                  {error && <Error error={error}/>}

                  </form>)
              }}
        </Mutation>

      </Paper>
    </div>
  )
};

//Actual GQLQuery that will be run and will return a token based on the user
//Otherwise return an error
const LOGIN_MUTATION=gql`
mutation ($username: String!, $password: String!)
{
  tokenAuth(username: $username, password: $password)
  {
    token
  }
}

`


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
    color: theme.palette.secondary.main
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Login);
