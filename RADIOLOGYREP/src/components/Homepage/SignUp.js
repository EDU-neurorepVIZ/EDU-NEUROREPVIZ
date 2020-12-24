import React, { Component } from "react";
import { Redirect } from "react-router";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants.js";
import Loading from "../Loading";

import axios from "axios";

import API from "../../API.js";

const INITIAL_STATE = {
  name: "",
  email: "",
  password: "",
  redirect: false,
  error: null,
  shouldSend: true
};

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.state.shouldSend) {
      this.setState({ shouldSend: false }, () => {
        const { name, email, password } = this.state;
        axios
          .post(API+"/user", {
            name: name,
            email: email
          })
          .then(res => {
            this.props.firebase
              .doCreateUserWithEmailAndPassword(email, password)
              .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.SESSION);
              })
              .catch(error => {
                this.setState({ shouldSend: true });

                this.props.setErrorMessage(
                  "Error al crear cuenta. Por favor vuelva a intentar."
                );
                this.setState({ error });
              });
          })
          .catch(err => {
            this.setState({ shouldSend: true });

            this.props.setErrorMessage("Email no autorizado.");
          });
      });
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/session" />;
    }

    const { name, email, password, error } = this.state;

    const isInvalid = password === "" || email === "" || name === "";
    return (
      <div className="row">
        <form className="col s12">
          <div className="container">
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="user_name"
                  name="name"
                  type="text"
                  className="validate"
                  value={name}
                  onChange={this.onChange}
                />
                <label htmlFor="user_name">Nombre</label>
                <span
                  className="helper-text"
                  data-error="This e-mail is not valid"
                  data-success="This e-mail is valid"
                >
                  Escribe tu nombre.
                </span>
              </div>
            </div>

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
                Registrarse
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

export default compose(withRouter, withFirebase)(SignUp);
