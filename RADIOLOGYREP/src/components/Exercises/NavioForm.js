import React, { Component } from "react";
import NavioComponent from "../../NavioComponent";

import Gallery from "../Repository/Gallery";

class NavioForm extends Component {
  constructor(props) {
    super(props);
    this.state = { data: this.props.csvData, images: [] };

    this.props.continue();
  }

  componentDidMount() {
    this.setState({ images: this.convert(this.state.data.slice(0, 51)) });
  }

  fetchData() {
    return this.state.data;
  }

  convert(data) {
    return data.map(image => {
      return {
        src: image.imagen,
        thumbnail: image.imagen,
        directory: image.link,
        thumbnailWidth: 160,
        thumbnailHeight: 87,
        caption: image.Title
      };
    });
  }

  updateCallback(filteredData) {
    this.setState({
      data: filteredData,
      images: this.convert(filteredData.slice(0, 51))
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
            data={this.props.csvData}
            updateCallback={this.updateCallback.bind(this)}
          ></NavioComponent>
        </div>
        <div>
          <Gallery images={this.state.images} />
        </div>
      </div>
    );
  }
}

export default NavioForm;
