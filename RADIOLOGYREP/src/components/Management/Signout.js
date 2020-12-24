import React from "react";

import { withFirebase } from "../Firebase";

const SignOutButton = ({ firebase }) => (
  <a
    className="waves-effect waves-light blue modal-trigger right"
    onClick={firebase.doSignOut}
  >
    Log Out
  </a>
);

export default withFirebase(SignOutButton);
