import React, { Component } from "react";

import StudentSection from "./StudentSection";

import TeacherSection from "./TeacherSection";

class index extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.addHistory({
      value: this.props.group.name,
      action: () => {
        this.props.return();
      }
    });
  }

  render() {
    if (this.props.userAuth) {
      if (this.props.userAuth.role === "profesor") {
        return (
          <TeacherSection
            deleteHistory={this.props.deleteHistory}
            return={this.props.return}
            challenge={this.props.challenge}
            userAuth={this.props.userAuth}
          />
        );
      } else {
        return (
          <StudentSection
            deleteHistory={this.props.deleteHistory}
            return={this.props.return}
            challenge={this.props.challenge}
            userAuth={this.props.userAuth}
          />
        );
      }
    } else return null;
  }
}

export default index;
