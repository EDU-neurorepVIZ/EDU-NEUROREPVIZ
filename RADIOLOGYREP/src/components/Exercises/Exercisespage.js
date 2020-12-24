import React, { Component } from "react";
import CreateSession from "./CreateSession/index";
import ViewSession from "./ViewSession/index";

import Loading from "../Loading";

import * as d3 from "d3";

import axios from "axios";

import API from "../../API";

class Exercisespage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 0 : home screen, show options,
      // 1 : create session
      // 2 : view session
      sessionState: 0,
      scenarios: null,
      // Null: loading,
      // [] : samples
      selectedSample: null,
      csvData: []
    };
  }

  componentDidMount() {
    d3.csv("./MOCKmedic.csv", (err, data) => {
      data.forEach(row => {
        row.date = !isNaN(row.date) && row.date > 1700 ? row.date : null;
      });
      this.setState({ csvData: data });
    });

    this.fetchData();
  }

  fetchData() {
    if (this.props.userAuth.role === "profesor") {
      axios.get(API + "/sample/all").then(res => {
        const allSamples = res.data;
        let userSamples = [];
        allSamples.forEach(sample => {
          if (sample["ownerId"] === this.props.userAuth.id) {
            userSamples.push(sample);
          }
        });
        this.setState({ scenarios: userSamples.reverse() });
      });
    }
  }

  reset() {
    this.setState(
      { sessionState: 0, scenarios: null, selectedSample: null },
      () => {
        this.fetchData();
      }
    );
  }

  renderScenarios() {
    if (this.state.scenarios === null) {
      return <Loading />;
    } else if (this.state.scenarios.length) {
      return (
        <ul className="scenario-list">
          {this.state.scenarios.map(s => {
            return (
              <li
                style={{ cursor: "pointer", display: "flex", padding: "1rem" }}
                className="scenario-item card hoverable"
                key={s._id}
                onClick={() => {
                  this.setState({
                    sessionState: 2,
                    selectedSample: s
                  });
                }}
              >
                <h5 style={{ flexBasis: "30%" }}>
                  <b>Nombre: </b>
                  {s.name}
                </h5>
                <h5 style={{ flexBasis: "70%" }}>
                  <b>Descripción: </b>
                  {s.description}
                </h5>
                {this.props.userAuth.role === "profesor" ? (
                <button
                  className="btn light red"
                  onClick={() => {
                  this.renderDeleteSample(s);
                  }}
                >
                  Eliminar
                </button>
              ) : null}
              </li>
            );
          })}
        </ul>
      );
    } else {
      return (
        <ul className="scenario-list center-it">
          <h4>No tienes muestras actualmente.</h4>
        </ul>
      );
    }
  }

  renderDeleteSample(s) {
    if (window.confirm('¿Está seguro de eliminar la muestra?')) {
    axios.delete(
      API+"/sample/" +
                s._id,
      )
      .then(res => {
        this.reset();
        this.setState({ selectedSample: null}, () => {
        });
      });
    }
  }

  render() {
    if (this.props.userAuth)
      if (this.props.userAuth.role === "profesor") {
        return (
          <div
            style={{
              minHeight: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {this.state.sessionState !== 0 ? (
              <div
                style={{
                  display: "flex",
                  marginLeft: "10vw",
                  marginTop: "5vh"
                }}
              >
                <button
                  className="button-like-link"
                  onClick={() => {
                    this.reset();
                  }}
                >
                  Mis Muestras
                </button>
              </div>
            ) : null}

            {this.renderContent()}
          </div>
        );
      } else {
        return (
          <div
            style={{
              height: "80vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <h3>Debe ser profesor para crear muestras.</h3>
          </div>
        );
      }
    else return null;
  }

  renderContent() {
    if (this.state.sessionState === 0) {
      return (
        <div id="session-choice-container">
          <div className="scenario-title">
            <h2>Muestras</h2>
            <div className="choice-container">
              <button
                onClick={() => {
                  this.setState({ sessionState: 1 });
                }}
                className="btn-large waves-effect waves-light blue"
              >
                Crear una muestra
              </button>
            </div>
          </div>

          {this.renderScenarios()}
        </div>
      );
    } else if (this.state.sessionState === 1) {
      return (
        <CreateSession
          userAuth={this.props.userAuth}
          csvData={this.state.csvData}
          returnHome={() => {
            this.reset();
          }}
        />
      );
    } else if (this.state.sessionState === 2) {
      return (
        <ViewSession
          sample={this.state.selectedSample}
          csvData={this.state.csvData}
        />
      );
    }
  }
}

export default Exercisespage;
