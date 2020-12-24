import React, { Component } from "react";

import SignOutButton from "../Management/Signout.js";

import LogIn from "./Login";
import SignUp from "./SignUp";

export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = { currentForm: "login", errorMessage: "" };
  }

  componentDidMount() {
    document.dispatchEvent(new Event("component"));
  }

  setErrorMessage(message) {
    this.setState({ errorMessage: message });
  }

  render() {
    if (this.props.authUser != null) {
      this.props.history.push("/session");
    }

    return (
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <nav>
          <div className="nav-wrapper blue darken-1">
            <div className="row">
              <div className="col s12">
                <a href="/homepage" className="brand-logo center">
                  NeuroRepVIZ
                </a>
                <ul className="right hide-on-med-and-down">
                  <li>
                    <a href="#action">Comenzar a trabajar</a>
                  </li>
                  <li>
                    {this.props.authUser ? <SignOutButton /> : <div></div>}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <div
          style={{
            margin: "0 auto",
            width: "67%",
            marginTop: "20vh",
            height: "5vh",
            marginBottom: "1rem"
          }}
        >
          {this.state.errorMessage ? (
            <div
              style={{
                color: "#D8000C",
                backgroundColor: "#FFD2D2",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem"
              }}
            >
              {this.state.errorMessage}
              <i
                style={{ cursor: "pointer" }}
                onClick={() => {
                  this.setState({ errorMessage: "" });
                }}
              >
                x
              </i>
            </div>
          ) : null}
        </div>
        <div className="container" style={{ display: "flex" }}>
          <button
            onClick={() => {
              this.setState({ currentForm: "login" });
            }}
            disabled={this.state.currentForm === "login"}
            className="waves-effect waves-light btn light blue"
            style={{ flex: "1" }}
          >
            Iniciar sesion
          </button>
          <button
            onClick={() => {
              this.setState({ currentForm: "signup" });
            }}
            disabled={this.state.currentForm === "signup"}
            className="waves-effect waves-light btn light blue"
            style={{ flex: "1" }}
          >
            Registrarse
          </button>
        </div>

        <div
          id="action"
          className="container"
          style={{
            flex: "1"
          }}
        >
          {this.state.currentForm === "login" ? (
            <LogIn setErrorMessage={this.setErrorMessage.bind(this)} />
          ) : (
            <SignUp setErrorMessage={this.setErrorMessage.bind(this)} />
          )}
        </div>

        <footer className="page-footer blue darken-1">
          <div className="container">
            <div className="row">
              <div className="col l6 s12">
                <h5 className="white-text">
                Repositorio de Imágenes Neurorradiología
                </h5>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <div className="container">
              © 2019 Copyright Text
              <a className="grey-text text-lighten-4 right" href="#">
                Home
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
