import React, { Component } from "react";

import "./App.css";

import Gallery from "./components/Repository/Gallery.js";
import NavioComponent from "./NavioComponent.js";

import * as d3 from "d3";

function convert(data) {
  return data.map(image => {
    return {
      src: image.ThumbnailURL,
      thumbnail: image.ThumbnailURL,
      directory: image.link,
      thumbnailWidth: 40,
      thumbnailHeight: 20,
      caption: image.Title
    };
  });
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      images: []
    };
  }

  componentDidMount() {
    d3.csv("./MOCKmedic.csv", (err, data) => {
      data.forEach(row => {
        row.date = !isNaN(row.date) && row.date > 1700 ? row.date : null;
      });

      this.setState({
        images: convert(data.slice(0, 51)),
        data: data
      });
    });
  }

  updateCallback(filteredData) {
    this.setState({
      images: convert(filteredData.slice(0, 151))
    });
  }

  render() {
    return (
      <div className="App">
        <h2 className="header center">
          Explorador académico de imágenes 
        </h2>
        {this.state.data.length === 0 ? (
          <h3>
            Porfavor, espera mientras cargamos las imágenes para explorar :)
          </h3>
        ) : (
          <div
          
          >
            <div             
              
            >
              <NavioComponent
                data={this.state.data}
                updateCallback={this.updateCallback.bind(this)}
              ></NavioComponent>

              <Gallery 
              images={this.state.images} 
              />
            </div>
          </div>
        )}
        <div className="footer">
          <p>
            {" "}
            Esto es un trabajo en progreso. Desarrollo de un explorador de
            imágenes radiologicas. Licencia Universidad de Los Andes
          </p>
        </div>
      </div>
    );
  }
}

export default App;
