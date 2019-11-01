import React, {useState} from "react";
import Login from "./Login";
import Register from "./Register";
import withRoot from "../../withRoot";

export default withRoot(() => {
  const [newUser, setnewUser] = useState(true)

  return newUser ? 
  (
    <Register setnewUser={setnewUser}/>
  )
  :
  (
    <Login setnewUser={setnewUser}/>
  )
});
