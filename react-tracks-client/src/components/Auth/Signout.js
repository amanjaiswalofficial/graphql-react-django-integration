import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

//C2.a.To use Client object to remove isLoggedIn when SignOut
import { ApolloConsumer } from "react-apollo"

const Signout = ({ classes }) => {

  const handleSignout = client => {
    localStorage.removeItem('authToken')
    client.writeData({data: {isLoggedIn: false}})
    console.log(client)
  }

  //b.here, via ApolloConsumer, client object is passed which can be used to remove anything from client
  //and trigger any true false type events
  return (
    <ApolloConsumer>
    {client => (<Button onClick={() => handleSignout(client)}>
      <Typography
      variant="body1"
      className={classes.buttonText}
      color="secondary">
        Signout
      </Typography>
      <ExitToApp className={classes.buttonIcon} color="secondary"/>
    </Button>)}
    </ApolloConsumer>
  )
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonIcon: {
    marginLeft: "5px"
  }
};

export default withStyles(styles)(Signout);
