import React, { Component } from "react";

import NavioComponent from "../NavioComponent";
import Gallery from "./Repository/Gallery";

import * as d3 from "d3";

class PreviewSample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      csvData: [],
      subjects: [],
      data: [],
      images: []
    };
  }

  updateCallback(filteredData) {
    this.setState({
      images: this.convert(filteredData.slice(0, 151))
    });
  }

  convert(data) {
    return data.map(image => {
      return {
        src: image.src,
        thumbnail: image.thumbnail,
        directory: image.directory,
        thumbnailWidth: 160,
        thumbnailHeight: 87,
        caption: image.Title
      };
    });
  }

  componentDidMount() {
    d3.csv("./MOCKmedic.csv", (err, data) => {
      const parseDate = d3.timeParse("%m/%d/%Y");
      data.forEach(row => {
        row.date = !isNaN(row.date) && row.date > 1700 ? row.date : null;
      });
      // AQUI UTILIZAR NESTED CALLBACKS
      this.setState({ csvData: data }, () => {
        this.sampleData();
      });
    });
  }

  retrieveData() {
    let newData = [];
    let imageData = [];
    this.state.subjects.forEach(subject => {
      this.state.csvData.forEach(row => {
        if (row["id"] === subject) {
          imageData.push({
            thumbnail: row["imagen"],
            src: row["imagen"],
            directory: row["link"]
          });
          newData.push(row);
        }
      });
    });

    this.setState({ data: newData, images: this.convert(imageData) });
  }

  sampleData() {
    let subjects = [];
    this.props.sample.subjects.forEach(subject => {
      subjects.push(subject["id"]);
    });
    this.setState({ subjects }, () => {
      this.retrieveData();
    });
  }

  render() {
    return (
      <div className="row" style={{ marginTop: "10vh" }}>
        <div
          className="col s12"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <NavioComponent
            data={this.state.data}
            updateCallback={this.updateCallback.bind(this)}
          ></NavioComponent>
        </div>
        <div className="col s12">
          <Gallery images={this.state.images} />
        </div>
      </div>
    );
  }
}

export default PreviewSample;
