import React, { Component } from "react";

class Loading extends Component {
  render() {
    return (
      <ul className="scenario-list center-it">
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </ul>
    );
  }
}

export default Loading;
