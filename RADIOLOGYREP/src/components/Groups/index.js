import React, { Component } from "react";

import CreateGroupForm from "./CreateGroupForm";

import GroupSection from "./GroupSection";

import BreadCrumb from "./BreadCrumb";

import axios from "axios";

import Loading from "../Loading";

import API from "../../API.js";

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "home",
      groups: null,
      selectedGroup: null,
      history: []
    };
  }

  init() {
    axios.get(API+"/group/all").then(res => {
      let foundGroups = [];

      const allGroups = res.data;
      allGroups.forEach(group => {
        if (this.props.userAuth.role === "profesor") {
          const { ownerEmails } = group;
          ownerEmails.forEach(owner => {
            if (owner.email === this.props.userAuth.email) {
              foundGroups.push(group);
            }
          });
        } else {
          // Es un estudiante
          const { members } = group;
          members.forEach(member => {
            if (member.email === this.props.userAuth.email) {
              foundGroups.push(group);
            }
          });
        }
      });
      this.setState({ groups: foundGroups.reverse() });
    });
  }

  componentDidMount() {
    this.init();
  }

  addHistory(e) {
    let temp = this.state.history;
    temp.push(e);
    this.setState({ history: temp });
  }

  deleteHistory(i) {
    let newHistory = this.state.history;

    if (i === -1) {
      newHistory.length = this.state.history.length - 1;
    } else {
      newHistory.length = i;
    }

    this.setState({ history: newHistory });
  }

  render() {
    if (this.props.userAuth)
      return (
        <div className="group-page">
          <div className="col s12">
            <BreadCrumb
              history={this.state.history}
              deleteHistory={this.deleteHistory.bind(this)}
            />
          </div>
          {this.renderContent()}
        </div>
      );
    else return null;
  }

  renderContent() {
    if (this.state.page === "home") {
      return this.renderHomePage();
    } else if (this.state.page === "view-group") {
      return this.renderGroupPage();
    } else if (this.state.page === "create-group") {
      return this.renderCreateGroup();
    } else if (this.state.page === "edit-group") {
      return this.renderEditGroup();
    }
  }

  renderHomePage() {
    return (
      <div className="col s12">
        <div className="group-page-tab">
          <h1>Grupos</h1>
          {this.props.userAuth.role === "profesor" ? (
            <button
              className="btn light blue"
              onClick={() => {
                this.setState({ page: "create-group" });
              }}
            >
              Crear Grupo
            </button>
          ) : null}
        </div>

        {this.state.groups ? (
          this.state.groups.length ? (
            this.renderGroupList()
          ) : (
            <div
              style={{
                height: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <h4>No hay grupos.</h4>
            </div>
          )
        ) : (
          <Loading />
        )}
      </div>
    );
  }

  renderGroupList() {
    return (
      <ul className="group-list">
        {this.state.groups.map(group => {
          return (
            <li className="card hoverable group-list-item" key={group._id}>
              <h5
                onClick={() => {
                  this.setState({
                    page: "view-group",
                    selectedGroup: group
                  });
                }}
              >
                {group.name}
              </h5>
              {this.props.userAuth.role === "profesor" ? (
                <button
                  className="btn light blue"
                  onClick={() => {
                    this.setState({
                      page: "edit-group",
                      selectedGroup: group
                    });
                  }}
                >
                  Editar
                </button>
              ) : null}
              &nbsp;
              {this.props.userAuth.role === "profesor" ? (
                <button
                  className="btn light red"
                  onClick={() => {
                    this.setState({
                      selectedGroup: group
                    });
                    this.renderDeleteGroup(group);
                  }}
                >
                  Eliminar
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  renderGroupPage() {
    return (
      <GroupSection
        return={() => {
          this.setState({ page: "home" });
        }}
        deleteHistory={this.deleteHistory.bind(this)}
        addHistory={this.addHistory.bind(this)}
        userAuth={this.props.userAuth}
        selectedGroup={this.state.selectedGroup}
      />
    );
  }

  renderCreateGroup() {
    return (
      <CreateGroupForm
        return={() => {
          this.setState({ page: "home" });
        }}
        addHistory={this.addHistory.bind(this)}
        deleteHistory={this.deleteHistory.bind(this)}
        userAuth={this.props.userAuth}
        createGroup={(name, teachers, students) => {
          let newTeachers = [];
          let newStudents = [];
          teachers.forEach(teacher => {
            newTeachers.push(teacher["label"]);
          });

          students.forEach(student => {
            newStudents.push(student["label"]);
          });

          axios
            .post(API+"/group", {
              ownerEmails:
                this.props.userAuth.email +
                (newTeachers.length > 1 ? "" : ",") +
                newTeachers.join(","),
              name: name,
              members: newStudents.join(",")
            })
            .then(res => {
              this.setState({ page: "home", selectedGroup: null }, () => {
                this.init();
              });
            });
        }}
      />
    );
  }

  renderEditGroup() {
    return (
      <CreateGroupForm
        return={() => {
          this.setState({ page: "home" });
        }}
        deleteHistory={this.deleteHistory.bind(this)}
        addHistory={this.addHistory.bind(this)}
        userAuth={this.props.userAuth}
        selectedGroup={this.state.selectedGroup}
        editGroup={(name, teachers, students) => {
          let newTeachers = [];
          let newStudents = [];
          teachers.forEach(teacher => {
            newTeachers.push(teacher["label"]);
          });

          students.forEach(student => {
            newStudents.push(student["label"]);
          });

          axios
            .put(
              API+"/group/update/" +
                this.state.selectedGroup._id,
              {
                ownerEmails:
                  this.props.userAuth.email +
                  (newTeachers.length > 1 ? "" : ",") +
                  newTeachers.join(","),
                name: name,
                members: newStudents.join(",")
              }
            )
            .then(res => {
              this.setState({ page: "home", selectedGroup: null }, () => {
                this.init();
              });
            });
        }}
      />
    );
  }


renderDeleteGroup(group) {
  if (window.confirm('¿Está seguro de eliminar el grupo?')) {
  axios.delete(
    API+"/group/" +
              group._id,
    )
    .then(res => {
      this.setState({ page: "home", selectedGroup: null }, () => {
        this.init();
      });
    });
}

}

}

export default index;
