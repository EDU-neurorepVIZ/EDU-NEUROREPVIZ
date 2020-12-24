import React, { Component } from "react";

import PreviewSample from "../../PreviewSample";

import axios from "axios";

import moment from "moment";

import Loading from "../../Loading";

import API from "../../../API.js";

import { toast } from "react-toastify";


class StudentSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      teacherSample: null,
      teacherFile: "",
      feedbackFile : "",
      teacherResponse: "",
      shouldSend: true,
      studentSentSubmission: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);

    this.fileInput = React.createRef();
  }

  notify = () =>
    toast.success(
      "Entrega enviada! Recuerda que puedes seguir enviando entregas hasta la fecha limite."
    );

  componentDidMount() {
    //ESTO BUSCA EL SAMPLE Y EL ATTACHEMENT
    axios
      .get(API+"/sample/" + this.props.challenge.sampleId)
      .then(res => {
        this.setState({ teacherSample: res.data });
      });

    axios.get(API+"/attachment/all").then(res => {
      console.log(res.data)
      res.data.forEach(attachment => {
        if (
          (attachment.type =
            "challenges" && attachment.ownerId === this.props.challenge._id)
        ) {
          this.setState({
            teacherFile: API+"/file/" + attachment.filename
          });
        }
      });
    });

    axios.get(API+"/feedback/all").then(res => {
      console.log(res.data)
      res.data.forEach(feedback =>{
        if (
          (feedback.type = "feedback" && feedback.ownerId === this.props.challenge._id)
        ) {
          this.setState({
            feedbackFile: API+"/file/"+ feedback.filename
          });
        }
      });
    });

    //ESTO BUSCA FEEDBACK DEL PROFESOR
    axios.get(API+"/submission/all").then(res => {
      const submissions = res.data;
      let found = false;
      let response = "";
      for (let i = 0; i < submissions.length; i++) {
        let sub = submissions[i];
        if (
          sub.ownerId === this.props.userAuth.id &&
          sub.challengeId === this.props.challenge._id
        ) {
          found = true;

          if (sub.comment) {
            response = sub.comment;
          }
        }
      }

      this.setState({
        studentSentSubmission: found,
        teacherResponse: response
      });
    });
  }

  render() {
    return (
      <div className="col s12">
        <h1 className="center">
          Respondiendo reto:{" "}
          <strong className="main-color">{this.props.challenge.name}</strong>
        </h1>

        <h4 className="justify">Descripción/Leyenda: 
        </h4>
        
        <h5> 
          {" "}{this.props.challenge.description}
        </h5>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <h5>
            1. Descarga el enunciado{" "}
            <a
              href={this.state.teacherFile}
              download
              style={{ fontSize: "1.6rem" }}
            >
              aqui
            </a>
          </h5>

          {this.state.teacherSample ? (
            <div>
              <h5>2. Muestra para desarrollar el reto: </h5>
              <PreviewSample sample={this.state.teacherSample} />
            </div>
          ) : null}
          {this.props.challenge.endDate < moment().unix() ? (
            <div>
              <h5>
            3. Conoce un poco más{" "}
            <a
              href={this.state.feedbackFile}
              download
              style={{ fontSize: "1.6rem" }}
            >
              aqui
            </a>
          </h5>
              {this.state.studentSentSubmission ? (
                this.state.teacherResponse ? (
                  <textarea
                    style={{ minHeight: "10rem" }}
                    value={this.state.teacherResponse}
                    disabled
                    cols="30"
                    rows="10"
                  ></textarea>
                ) : (
                  <b>En revisión.</b>
                )
              ) : (
                <b>No enviaste nada.</b>
              )}
            </div>
          ) : (
            <div>
              <h5>3. Envía tu respuesta: </h5>
              <form
                onSubmit={this.handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <label>
                  <input type="file" ref={this.fileInput} required />
                </label>
                <div className="center" style={{ marginBottom: "5vh" }}>
                  {this.state.shouldSend ? (
                    <input
                      className="btn light blue"
                      type="submit"
                      value={"Enviar"}
                    />
                  ) : (
                    <Loading />
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.shouldSend) {
      this.setState({ shouldSend: false }, () => {
        let data = new FormData();
        data.append("file", this.fileInput.current.files[0]);

        //Buscamos todas las submissions
        axios.get(API+"/submission/all").then(res => {
          let foundSubmission = null;

          const allSubs = res.data;

          for (let i = 0; i < allSubs.length; i++) {
            let currentSub = allSubs[i];

            if (
              currentSub.ownerId === this.props.userAuth.id &&
              currentSub.challengeId === this.props.challenge._id
            ) {
              foundSubmission = currentSub;
              break;
            }
          }

          // Aqui solamente haces un UPDATE attachment
          if (foundSubmission) {
            axios.get(API+"/attachment/all").then(res => {
              const allAttachments = res.data;
              let foundAttachment = null;
              for (let i = 0; i < allAttachments.length; i++) {
                let attachment = allAttachments[i];
                if (attachment.ownerId === foundSubmission._id) {
                  foundAttachment = attachment;
                  break;
                }
              }
              axios.post(API+"file", data).then(res => {
                axios
                  .put(
                    API+"/attachment/" + foundAttachment._id,
                    {
                      originalname: res.data.originalname,
                      filename: res.data.name
                    }
                  )
                  .then(res => {
                    this.notify();
                    this.props.deleteHistory(-1);
                    this.props.return();
                  });
              });
            });
          }
          //Aqui hacemos el flujo completo
          else {
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
                      this.notify();
                      this.props.deleteHistory(-1);
                      this.props.return();
                    });
                });
              });
          }
        });
      });
    }
  }
}

export default StudentSection;
