import React, { Component } from "react";
import { Redirect } from "react-router";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants.js";
import axios from "axios";

import Loading from "../Loading";

import API from "../../API.js";

const INITIAL_STATE = {
  email: "",
  password: "",
  redirect: false,
  error: null,
  shouldSend: true
};

class LogIn extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  handleSubmit = ( event ) => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.SESSION);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  /*
  handleSubmit = event => {
    event.preventDefault();

    if (this.state.shouldSend) {
      this.setState({ shouldSend: false }, () => {
        const { email, password } = this.state;

        axios
          .get(API+"/user/email/" + this.state.email)
          .then(res => {
            this.props.firebase
              .doSignInWithEmailAndPassword(email, password)
              .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.SESSION);
              })
              .catch(error => {
                this.setState({ shouldSend: true });
                this.props.setErrorMessage(
                  "No se pudo iniciar sesión. Contraseña incorrecta."
                );
                this.setState({ error });
              });
          })
          .catch(err => {
            this.setState({ shouldSend: true });
            this.props.setErrorMessage(
              "No se pudo iniciar sesión. No existe ningun usuario con ese Email."
            );
          });
      });
    }
  };
  */
 
  render() {
    if (this.state.redirect) {
      return <Redirect to="/session" />;
    }

    const { email, password } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <div className="row">
        <form className="col s12">
          <div className="container">
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="user_email"
                  name="email"
                  type="email"
                  className="validate"
                  value={email}
                  onChange={this.onChange}
                />
                <label htmlFor="user_email">E-mail</label>
                <span
                  className="helper-text"
                  data-error="This e-mail is not valid"
                  data-success="This e-mail is valid"
                >
                  Escribe tu e-mail...
                </span>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="user_password"
                  type="password"
                  className="validate"
                  value={password}
                  name="password"
                  onChange={this.onChange}
                />
                <label htmlFor="user_password">Password</label>
              </div>
            </div>
          </div>
          <div className="center">
            {this.state.shouldSend ? (
              <a
                onClick={this.handleSubmit}
                disabled={isInvalid}
                className="waves-effect waves-light btn blue"
              >
                Iniciar Sesión
              </a>
            ) : (
              <Loading />
            )}
          </div>
        </form>

        {/**<a onClick = {this.toSignUp} href="#">Did you forget your password?</a>*/}
      </div>
    );
  }
}

export default compose(withRouter, withFirebase)(LogIn);
