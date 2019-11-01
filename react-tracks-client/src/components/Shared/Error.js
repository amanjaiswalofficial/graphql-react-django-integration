import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Snackbar, Button } from "@material-ui/core";

const Error = ({ classes,error }) => {

  const [open, setOpen] = useState(true)

  return (
    <Snackbar open={open} 
    className={classes.snackbar} 
    message={error.message} 
    action={<Button onClick={()=> setOpen(false)} color="secondary">Close</Button>}/>
  )
};

const styles = theme => ({
  snackbar: {
    margin: theme.spacing.unit
  }
});

export default withStyles(styles)(Error);
