import React, { Component } from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import NotFound from "./NotFound";
import Homepage from "./components/Homepage/Homepage.js";
import Session from "./components/Management/Session.js";

import { withFirebase } from "./components/Firebase";
import * as ROUTES from "./constants.js";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

class Routes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null
    };
  }
  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path={ROUTES.HOME}
            render={props => (
              <Homepage {...props} authUser={this.state.authUser} />
            )}
          />
          <Route
            exact
            path={ROUTES.SESSION}
            render={props => (
              <Session {...props} authUser={this.state.authUser} />
            )}
          />
        
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default withFirebase(Routes);
