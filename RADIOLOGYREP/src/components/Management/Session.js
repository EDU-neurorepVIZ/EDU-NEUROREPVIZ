import React, { Component } from "react";
import M from "materialize-css";
import SignOutButton from "./Signout.js";
import App from "../../App.js";
import Exercisespage from "../Exercises/Exercisespage.js";
import Grupo from "../Groups/index";

import axios from "axios";

import API from "../../API.js";

class Session extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      authUser: this.props.authUser,
      page: "explorer",
      ready: true
    };
  }

  // this.setState({

  //     ready: true
  //  });

  updateProfile = newUser => {
    this.setState({
      user: newUser
    });
  };

  changePage = new_page => {
    if (this.state.ready) {
      this.setState({
        page: new_page
      });
    }
  };

  componentDidMount() {
    M.Sidenav.init(this.Sidenav);

    document.dispatchEvent(new Event("component"));

    if (this.state.authUser) {
      axios
        .get(API+"/user/email/" + this.state.authUser.email)
        .then(res => {
          let newAuth = this.state.authUser;
          newAuth.id = res.data._id;
          newAuth.role = res.data.role;
          this.setState({ authUser: newAuth });
        });
    }
  }

  componentWillUnmount() {
    M.Sidenav.init(this.Sidenav);

    let instance = M.Sidenav.getInstance(this.Sidenav);

    instance.close();

    document.dispatchEvent(new Event("component"));
  }

  render() {
    if (this.props.authUser === null) {
      this.props.history.push("/");
    }
    return (
      <div className="content">
        <div className="sessionmain">
          <nav className="blue darken-1">
            <a href="/" className="brand-logo center">
              NeuroRepVIZ
            </a>
            <ul className="right">
              <SignOutButton />
            </ul>
          </nav>
          <div>
            <button
              data-target="slide-out"
              className="sidenav-trigger"
              style={{
                border: "none",
                backgroundColor: "transparent",
                position: "absolute",
                top: "0"
              }}
            >
              <i className="medium material-icons" style={{ color: "white" }}>
                menu
              </i>
            </button>
          </div>

          {this.state.ready ? (
            <div className="new-session">
              {this.state.page === "explorer" ? (
                <App userAuth={this.props.authUser} />
              ) : this.state.page === "exercises" ? (
                <Exercisespage userAuth={this.state.authUser} />
              ) : this.state.page === "grupos" ? (
                <Grupo userAuth={this.props.authUser} />
              ) : null}
            </div>
          ) : (
            <div className="container">
              <br></br>
              <div className="progress blue lighten-5">
                <div className="indeterminate blue darken-4"></div>
              </div>
            </div>
          )}
        </div>

        <footer className="page-footer blue darken-1">
          <div className="footer-copyright">
            <div className="container">
              © 2019 Copyright Text
              <a className="grey-text text-lighten-4 right" href="/homepage">
                Home
              </a>
            </div>
          </div>
        </footer>

        <div>
          <ul
            ref={Sidenav => {
              this.Sidenav = Sidenav;
            }}
            id="slide-out"
            className="sidenav"
          >
            <li>
              {this.state.ready ? (
                <div className="user-view">
                  <div className="background">
                    <img
                      className="responsive-img"
                      src={"././././images/defaultbanner.jpg"}
                    />
                  </div>
                  <a href="#!">
                    <img
                      className="circle"
                      src={"././././images/defaultprofile.jpg"}
                    />
                  </a>
                  <a href="#!">
                    <span className="white-text name">
                      {this.state.user.user_names +
                        " " +
                        this.state.user.user_lastnames}
                    </span>
                  </a>
                  <a href="#!">
                    <span className="white-text email">
                      {this.state.user.user_email}
                    </span>
                  </a>
                </div>
              ) : (
                <div className="user-view">
                  <div className="background">
                    <img
                      className="responsive-img"
                      src={"././././images/defaultbanner.jpg"}
                    />
                  </div>
                  <a href="#!">
                    <img
                      className="circle"
                      src={"././././images/defaultprofile.jpg"}
                    />
                  </a>
                  <a href="#!">
                    <span className="white-text name">{"Loading..."}</span>
                  </a>
                  <a href="#!">
                    <span className="white-text email">
                      {"Wait a second..."}
                    </span>
                  </a>
                </div>
              )}
            </li>

            {this.state.page == "grupos" ? (
              <li className="active">
                <a
                  className="waves-effect"
                  onClick={() => this.changePage("grupos")}
                >
                  <i className="material-icons">people</i>Grupos
                </a>
              </li>
            ) : (
              <li>
                <a
                  className="waves-effect"
                  onClick={() => this.changePage("grupos")}
                >
                  <i className="material-icons">people</i>Grupos
                </a>
              </li>
            )}

            {this.state.page == "exercises" ? (
              <li className="active">
                <a
                  className="waves-effect"
                  onClick={() => this.changePage("exercises")}
                >
                  <i className="material-icons">view_list</i>Muestras
                </a>
              </li>
            ) : (
              <li>
                <a
                  className="waves-effect"
                  onClick={() => this.changePage("exercises")}
                >
                  <i className="material-icons">view_list</i>Muestras
                </a>
              </li>
            )}

            {this.state.page == "explorer" ? (
              <li className="active">
                <a
                  className="waves-effect"
                  onClick={() => this.changePage("explorer")}
                >
                  <i className="material-icons">search</i>Explorer
                </a>
              </li>
            ) : (
              <li>
                <a
                  className="waves-effect"
                  onClick={() => this.changePage("explorer")}
                >
                  <i className="material-icons">search</i>Explorer
                </a>
              </li>
            )}

            <li>
              <div className="divider"></div>
            </li>
            <li>
              <a className="subheader">Your account</a>
            </li>
            {this.state.page == "preferences" ? (
              <li>
                <a
                  className="waves-effect"
                  onClick={() => this.changePage("preferences")}
                >
                  Settings
                </a>
              </li>
            ) : (
              <li>
                <a
                  className="waves-effect"
                  onClick={() => this.changePage("preferences")}
                >
                  Settings
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Modals */}
      </div>
    );
  }
}

export default Session;
