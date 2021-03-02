import React, { Component } from "react";

import PreviewSample from "../../PreviewSample";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import axios from "axios";

import moment from "moment";

import Loading from "../../Loading";

import API from "../../../API.js";
import ReactDatePicker from "react-datepicker";

class CreateChallengeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enunciado: "",
      attachments: null,
      feedback: null,
      samples: [],
      selectedSample: null,
      selectedName: "",
      description: "",
      date: moment(),
      shouldSend: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
    this.previewSampleRef = React.createRef();
    this.fileInputFeedback = React.createRef();
  }

  componentDidMount() {
    this.props.addHistory({
      value: this.props.group.name,
      action: () => {
        this.props.return();
      }
    });

    if (this.props.userAuth.role === "profesor") {
      axios.get(API+"/sample/all").then(res => {
        const allSamples = res.data;
        let userSamples = [];
        allSamples.forEach(sample => {
          if (sample["ownerId"] === this.props.userAuth.id) {
            userSamples.push(sample);
          }
        });
        if (userSamples.length) {
          this.setState({
            samples: userSamples,
            selectedSample: userSamples[0],
            selectedName: userSamples[0].name + " (" + userSamples[0]._id + ")"
          });
        }
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.shouldSend) {
      this.setState({ shouldSend: false }, () => {
        let data = new FormData();
        let dataFeed = new FormData();
        data.append("file", this.fileInput.current.files[0]);
        dataFeed.append("filefeedback", this.fileInputFeedback.current.files[0]);

        axios
          .post(API+"/challenge", {
            groupId: this.props.group._id,
            name: this.state.enunciado,
            description: this.state.description,
            sample: this.state.selectedSample
              ? this.state.selectedSample._id
              : "",
            status: "enviado",
            endDate: this.state.date.unix()
          })
          
          .then(res => {
            console.log(res);

            const newChallengeId = res.data._id;
            axios.post(API+"/file", data).then(res => {
              axios
                .post(API+"/attachment", {
                  ownerId: newChallengeId,
                  originalname: res.data.originalname,
                  filename: res.data.name,
                  type: "challenges"
                })
                .then(res => {
                  console.log(res);
                  
                  axios.post(API+"/file", dataFeed).then(res => {
                    axios
                    .post(API+"/feedback" , {
                      ownerId: newChallengeId,
                      originalname: res.data.originalname,
                      filename: res.data.name,
                      type: "feedback"
                    })
                    .then(res =>{
                      this.props.deleteHistory(-1);
                      this.props.return();}
                      )
                  })
                  
                });
            });
          
          });      
      });
      
    }
  }

  render() {
    return (
      <div className="col s12">
        <h2>Crear nuevo reto para grupo {this.props.group.name}</h2>
        <form onSubmit={this.handleSubmit} className="row">
          <label className="col s6" style={{ paddingLeft: "0" }}>
            <h5>Nombre:</h5>
            <input
              required
              type="text"
              placeholder={"Mi nuevo reto"}
              value={this.state.enunciado}
              onChange={e => {
                this.setState({ enunciado: e.target.value });
              }}
            />
          </label>

          <label className="col s6">
            <h5>Fecha Limite: </h5>
            <div className="customDatePickerWidth">
              <DatePicker
                minDate={new Date()}
                className="custom-date-picker"
                selected={this.state.date.toDate()}
                onChange={date => {
                  this.setState({ date: moment(date) });
                }}
                name="startDate"
                showTimeSelect
                timeFormat="HH:mm"
                dateFormat="MMMM d, yyyy h:mm aa"
                timeIntervals={5}
                timeCaption="Hora"
              />
            </div>
          </label>
          
          <label className="col s12" style={{ paddingLeft: "0" }}>
          <div>
            <h5>Descripción/Leyenda:</h5>
          </div>
          
          </label>
          <label className="col s12" style={{ paddingLeft: "0" }}>
          <div>
            <input
              required
              type="text"
              placeholder={"La descripción del reto"}
              value={this.state.description}
              onChange={e => {
                this.setState({ description: e.target.value });
              }}
            />
            </div>
          </label>

          <label>
            <h5>Enunciado: </h5>
            <input type="file" ref={this.fileInput} required />
          </label>
          <label>
            <h5>Retroalimentación: </h5>
            <input type="file" ref={this.fileInputFeedback} required />
          </label>
          {this.state.selectedSample ? (
            <label>
              <h5>Muestra:</h5>
              <div className="row">
                <div className="col s12">
                  <select
                    style={{ marginBottom: "5vh" }}
                    className="browser-default"
                    value={this.state.selectedName}
                    onChange={event => {
                      const regExp = /\(([^)]+)\)/;
                      const matches = regExp.exec(event.target.value);
                      const id = matches[1];
                      let foundSample = null;
                      for (let i = 0; i < this.state.samples.length; i++) {
                        if (this.state.samples[i]._id === id) {
                          foundSample = this.state.samples[i];
                          break;
                        }
                      }
                      this.setState(
                        {
                          selectedName: event.target.value,
                          selectedSample: foundSample
                        },
                        () => {
                          this.previewSampleRef.current.sampleData();
                        }
                      );
                    }}
                  >
                    {this.state.samples.map(s => {
                      return (
                        <option
                          key={s.name + " (" + s._id + ")"}
                          value={s.name + " (" + s._id + ")"}
                        >
                          {s.name + " (" + s._id + ")"}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col s12">
                  <PreviewSample
                    ref={this.previewSampleRef}
                    sample={this.state.selectedSample}
                    withGallery={true}
                  />
                </div>
              </div>
            </label>
          ) : null}
          <div className="center">
            {this.state.shouldSend ? (
              <input
                style={{ fontSize: "1.3rem" }}
                type="submit"
                className="btn light blue"
                value={"Crear "}
              />
            ) : (
              <Loading />
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default CreateChallengeForm;
