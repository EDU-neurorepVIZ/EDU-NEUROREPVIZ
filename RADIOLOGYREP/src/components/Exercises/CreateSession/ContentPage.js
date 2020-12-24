import React, { Component } from "react";

import FilterForm from "./FilterForm";
import NavioForm from "../NavioForm";

import axios from "axios";

import API from "../../../API";

class ContentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /*
       *   0 = none selected
       *   1 = filter type
       *   2 = navio type
       */
      filterType: 0,
      data: [],
      extra_data: [],
      input: "",
      name: "",
      description: "",
      shouldSend: true
    };

    this.filterFormRef = React.createRef();
    this.navioFormRef = React.createRef();
  }

  fetchData() {
    if (this.state.filterType === 1) {
      const data = this.filterFormRef.current.fetchData();
      this.setState({ data: data });
    } else if (this.state.filterType === 2) {
      const data = this.navioFormRef.current.fetchData();
      this.setState({ data: data });
    }
  }

  createSession(callback) {
    if (this.state.shouldSend) {
      this.props.changeSendButton();
      this.setState({ shouldSend: false }, () => {
        let allData = [];
        this.state.data.forEach(e => {
          allData.push(e["id"]);
        });
        this.state.extra_data.forEach(e => {
          allData.push(e);
        });
        axios
          .post(API + "/sample", {
            ownerId: this.props.userAuth.id,
            subjects: allData.join(","),
            name: this.state.name,
            description: this.state.description
          })
          .then(res => {
            callback();
          });
      });
    }
  }

  render() {
    switch (this.props.page) {
      case 0:
        return (
          <div>
            <h5 className="center">Paso 1. Selecciona tipo de filtro</h5>
            <div className="paso-1-holder">
              <button
                className={
                  this.state.filterType === 1 ? "button-selected" : "null"
                }
                disabled={this.state.filterType === 1}
                onClick={() => {
                  this.setState({ filterType: 1 }, () => {
                    this.props.continue();
                  });
                }}
              >
                Parametros
              </button>
              <button
                className={
                  this.state.filterType === 2 ? "button-selected" : "null"
                }
                disabled={this.state.filterType === 2}
                onClick={() => {
                  this.setState({ filterType: 2 }, () => {
                    this.props.continue();
                  });
                }}
              >
                Navio
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <h5 className="center">Paso 2. Crea la muestra.</h5>
            {this.state.filterType === 1 ? (
              <FilterForm
                csvData={this.props.csvData}
                ref={this.filterFormRef}
                continue={() => {
                  this.props.continue();
                }}
              />
            ) : (
              <NavioForm
                csvData={this.props.csvData}
                ref={this.navioFormRef}
                continue={() => {
                  this.props.continue();
                }}
              />
            )}
          </div>
        );

      default:
        return (
          <div>
            <h5 className="center">Paso 3. Agrega detalles.</h5>
            <div className="col s12">
              <h6>
                Nombre de muestra
                <input
                  required
                  type="text"
                  value={this.state.name}
                  onChange={e => {
                    this.setState({ name: e.target.value });
                  }}
                />
              </h6>
            </div>
            <h6>Descripción de la muestra: </h6>

            <textarea
              cols="30"
              rows="10"
              style={{ minHeight: "10rem" }}
              maxLength={300}
              required
              value={this.state.description}
              onChange={e => {
                this.setState({ description: e.target.value });
              }}
            />
            <h6>Agrega a pacientes especificos: </h6>
            <form onSubmit={this.formSubmit.bind(this)}>
              <input
                type="text"
                value={this.state.input}
                onChange={e => {
                  this.setState({ input: e.target.value });
                }}
              />
              <input type="submit" value="Agregar" className="agregar-boton" />
            </form>
            <ul className="center">
              {this.state.extra_data.map(e => {
                return <li key={e}>{e}</li>;
              })}
            </ul>
          </div>
        );
    }
  }

  formSubmit(e) {
    e.preventDefault();

    const myArray = this.props.csvData;
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i]["id"] === this.state.input) {
        let copy = this.state.extra_data;
        copy.push(myArray[i]["id"]);
        this.setState({ extra_data: copy, input: "" });
        break;
      }
    }
  }
}

export default ContentPage;
