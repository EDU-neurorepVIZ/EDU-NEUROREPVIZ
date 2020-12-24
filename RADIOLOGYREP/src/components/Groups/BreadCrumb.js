import React, { Component } from "react";

class BreadCrumb extends Component {
  render() {
    return (
      <div style={{ display: "flex", height: "2rem", marginTop: "1rem" }}>
        {this.props.history.map((h, index) => {
          return (
            <div key={h.value}>
              <button
                className="button-like-link"
                onClick={() => {
                  this.props.deleteHistory(index);
                  h.action();
                }}
              >
                {h.value}
              </button>{" "}
              &nbsp;
              {index === this.props.history.length - 1 ? "" : <i>></i>}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  }
}

export default BreadCrumb;
