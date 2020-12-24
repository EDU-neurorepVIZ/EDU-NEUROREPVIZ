import React, { Component } from "react";

import axios from "axios";

import moment from "moment";

import Loading from "../../Loading";

import API from "../../../API.js";

class TeacherSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submissions: [],
      selectedSubmission: null,
      feedbackText: "",
      shouldSend: true
    };
    this.handleSubmissionFeedback = this.handleSubmissionFeedback.bind(this);
  }

  componentDidMount() {
    this.fetchSubmissions();
  }

  fetchSubmissions() {
    axios.get(API+"/submission/all").then(res => {
      let submissions = [];
      res.data.forEach(sub => {
        if (sub.challengeId === this.props.challenge._id) {
          var obj = {};
          axios.get(API+"/user/" + sub.ownerId).then(res => {
            obj.name = res.data.name;
            obj.status = sub.status;
            obj._id = sub._id;
            obj.comment = sub.comment;

            axios
              .get(API+"/attachment/owner/" + sub._id)
              .then(res => {
                obj.studentFile =
                  API+"/file/" + res.data.filename;

                submissions.push(obj);
                this.setState({ submissions }, () => {});
              });
          });
        }
      });
    });
  }

  handleSubmissionFeedback(event) {
    event.preventDefault();

    let data = new FormData();
    data.append("file", this.fileInput.current.files[0]);

    axios
      .post(API+"/submission", {
        ownerId: this.props.userAuth.id,
        challengeId: this.props.challenge._id,
        status: "entregado"
      })
      .then(res => {
        const newSubmission = res.data._id;
        axios.post(API+"/file", data).then(res => {
          axios
            .post(API+"/attachment", {
              ownerId: newSubmission,
              originalname: res.data.originalname,
              filename: res.data.name,
              type: "challenges"
            })
            .then(res => {
              this.props.deleteHistory(-1);
              this.props.return();
            });
        });
      });
  }

  renderSubmissionList() {
    return (
      <ul>
        {!this.state.submissions.length
          ? null
          : this.state.submissions.map(submission => {
              return (
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer"
                  }}
                  key={submission._id}
                  className={`card hoverable ${
                    this.state.selectedSubmission
                      ? this.state.selectedSubmission._id === submission._id
                        ? "submission-selected"
                        : ""
                      : ""
                  }`}
                  onClick={() => {
                    this.setState({
                      selectedSubmission: submission
                    });
                  }}
                >
                  <p>
                    {" "}
                    <b>Nombre: </b>
                    {submission.name}
                  </p>

                  <p>
                    {" "}
                    <b>Estado:</b> {submission.status}
                  </p>
                </li>
              );
            })}
      </ul>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.shouldSend) {
      this.setState({ shouldSend: false }, () => {
        axios
          .put(
            API+"/submission/" +
              this.state.selectedSubmission._id,
            {
              status: "revisado",
              comment: this.state.feedbackText
            }
          )
          .then(res => {
            this.setState(
              { selectedSubmission: null, feedbackText: "", shouldSend: true },
              () => {
                this.fetchSubmissions();
              }
            );
          });
      });
    }
  }

  renderSubmissionSelected() {
    return (
      <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
        {this.state.selectedSubmission ? (
          <div>
            <h5>
              1. Revisa el{" "}
              <a
                href={this.state.selectedSubmission.studentFile}
                download
                style={{ fontSize: "1.6rem" }}
                onClick={() => {
                  if (this.state.selectedSubmission.status !== "revisado") {
                    axios.put(
                      API+"/submission/" +
                        this.state.selectedSubmission._id,
                      {
                        status: "visto"
                      }
                    );
                  }
                }}
              >
                Archivo enviado
              </a>
            </h5>

            <h5>2. Retroalimentación: </h5>
            {this.state.selectedSubmission.comment ? (
              <div>
                <b>
                  Ya mandaste tu retroalimentación. La puedes ver aqui abajo.
                  <textarea
                    style={{ minHeight: "10rem" }}
                    disabled
                    value={this.state.selectedSubmission.comment}
                    cols="30"
                    rows="10"
                  ></textarea>
                </b>
              </div>
            ) : (
              <form onSubmit={this.handleSubmit.bind(this)}>
                <textarea
                  cols="30"
                  rows="10"
                  maxLength={3000}
                  style={{ minHeight: "10rem" }}
                  value={this.state.feedbackText}
                  onChange={e => {
                    this.setState({ feedbackText: e.target.value });
                  }}
                ></textarea>
                <div className="center">
                  {this.state.shouldSend ? (
                    <input
                      type="submit"
                      value={"Enviar"}
                      className="btn light blue"
                    />
                  ) : (
                    <Loading />
                  )}
                </div>
              </form>
            )}
          </div>
        ) : (
          <b
            style={{
              display: "flex",
              flex: "1",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            No has seleccionado nada
          </b>
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="col s12">
        <h1 className="center">
          Respuestas a reto:{" "}
          <strong className="main-color">{this.props.challenge.name}</strong>
        </h1>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1", padding: "1rem" }}>
            <h4>Entregas:</h4>
            {this.renderSubmissionList()}
          </div>
          <div
            style={{
              flex: "1",
              padding: "1rem"
            }}
          >
            <h4>Entrega Seleccionada: </h4>
            {this.renderSubmissionSelected()}
          </div>
        </div>
      </div>
    );
  }
}

export default TeacherSection;
