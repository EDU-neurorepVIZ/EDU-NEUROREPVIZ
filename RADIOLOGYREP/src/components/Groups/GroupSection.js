import React, { Component } from "react";

import CreateChallengeForm from "./Challenge/CreateChallengeForm";

import ChallengeSection from "./Challenge/index";

import axios from "axios";

import moment from "moment";

import Loading from "../Loading";

import API from "../../API.js";

class GroupSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "home",
      selectedChallenge: "",
      challenges: null
    };
  }

  fetchChallenges(callback) {
    axios.get(API+"/challenge/all").then(res => {
      let challenges = [];
      res.data.forEach(challenge => {
        if (challenge.groupId === this.props.selectedGroup._id) {
          challenges.push(challenge);
        }
      });
      this.setState({ challenges: challenges.reverse() }, () => {
        callback();
      });
    });
  }

  componentDidMount() {
    this.fetchChallenges(() => {
      this.props.addHistory({
        value: "Mis Grupos",
        action: () => {
          this.props.return();
        }
      });
    });
  }

  render() {
    if (this.state.page === "home") {
      return (
        <div className="col s12">
          <h1 className="center" style={{ marginTop: "0" }}>
            Grupo:{" "}
            <strong className="main-color">
              {this.props.selectedGroup.name}
            </strong>
          </h1>
          <div className="group-section-container">
            <div>
              <div>
                <h4>Profesores: </h4>
                {this.renderTeacherList()}
              </div>
              <div>
                <h4>Estudiantes: </h4>
                {this.renderStudentList()}
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h4>Retos: </h4>
                {this.props.userAuth.role === "profesor" ? (
                  <button
                    className="btn light blue"
                    onClick={() => {
                      this.setState({ page: "create-challenge" });
                    }}
                  >
                    Crear Reto
                  </button>
                ) : null}
              </div>
              {this.renderChallengeList()}
            </div>
          </div>
        </div>
      );
    } else if (this.state.page === "create-challenge") {
      return (
        <CreateChallengeForm
          addHistory={this.props.addHistory}
          deleteHistory={this.props.deleteHistory}
          userAuth={this.props.userAuth}
          group={this.props.selectedGroup}
          return={this.return.bind(this)}
        />
      );
    } else if (this.state.page === "view-challenge") {
      return (
        <ChallengeSection
          group={this.props.selectedGroup}
          addHistory={this.props.addHistory}
          deleteHistory={this.props.deleteHistory}
          userAuth={this.props.userAuth}
          challenge={this.state.selectedChallenge}
          return={this.return.bind(this)}
        />
      );
    }
  }

  return() {
    this.fetchChallenges(() => {
      this.setState({ page: "home", selectedChallenge: "" });
    });
  }

  renderTeacherList() {
    return (
      <ul style={{ height: "30vh", overflowY: "auto" }}>
        {!this.props.selectedGroup.ownerEmails.length
          ? null
          : this.props.selectedGroup.ownerEmails.map(owner => {
              return <li key={owner._id}>{owner.email}</li>;
            })}
      </ul>
    );
  }

  renderStudentList() {
    return (
      <ul style={{ height: "30vh", overflowY: "auto" }}>
        {!this.props.selectedGroup.members.length
          ? null
          : this.props.selectedGroup.members.map(member => {
              return <li key={member._id}>{member.email}</li>;
            })}
      </ul>
    );
  }

  renderDeleteChallenge(challenge) {
    if (window.confirm('¿Está seguro de eliminar el reto?')) {
    axios.delete(
      API+"/challenge/" +
                challenge._id,
      )
      .then(res => {
        this.fetchChallenges(() => {
          this.setState({ page: "home", selectedChallenge: "" });
        });
        this.setState({ selectedChallenge: null}, () => {
        });
        
      });
    }
  }

  renderChallengeList() {
    return (
      <div>
        {this.state.challenges ? (
          <ul>
            {!this.state.challenges.length ? (
              <li
                style={{
                  height: "40vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {" "}
                <b>No hay retos.</b>{" "}
              </li>
            ) : (
              this.state.challenges.map(challenge => {
                let shouldProfessorView =
                  (this.props.userAuth.role === "profesor" &&
                    challenge.endDate < moment().unix()) ||
                  this.props.userAuth.role === "estudiantes";
                return (
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      cursor: `${
                        shouldProfessorView ? "pointer" : "not-allowed"
                      }`,
                      padding: "1rem"
                    }}
                    key={challenge._id}
                    className={`hoverable card ${
                      shouldProfessorView ? "" : "light grey"
                    }`}
                    onClick={() => {
                      if (shouldProfessorView) {
                        this.setState({
                          page: "view-challenge",
                          selectedChallenge: challenge
                        });
                      }
                    }}
                  >
                    <p>
                      <b>Nombre:</b> {challenge.name}
                    </p>
                    <p>
                      <b>Estado:</b>{" "}
                      {challenge.endDate < moment().unix()
                        ? "Finalizado"
                        : "En proceso"}
                    </p>
                    <p>
                      <b>Fecha Limite:</b>{" "}
                      {moment
                        .unix(challenge.endDate)
                        .format("MMMM D, YYYY h:mm a")}
                    </p>
                    {this.props.userAuth.role === "profesor" ? (
                    <button
                      className="btn light red"
                      onClick={() => {
                      this.renderDeleteChallenge(challenge);
                      }}
                    >
                  Eliminar
                </button>
              ) : null}
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>
    );
  }
}

export default GroupSection;
