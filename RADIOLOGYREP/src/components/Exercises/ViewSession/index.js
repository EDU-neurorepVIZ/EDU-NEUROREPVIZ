import React, { Component } from "react";

import PreviewSample from "../../PreviewSample";

class ViewExercise extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="view-sample-container">
        <h1 className="center">
          Muestra:{" "}
          <strong className="main-color">{this.props.sample.name}</strong>
        </h1>
        <h5 style={{ marginBottom: "5vh" }}>
          <b>Descripción:</b> {this.props.sample.description}
        </h5>
        <PreviewSample sample={this.props.sample} />
      </div>
    );
  }
}

export default ViewExercise;
