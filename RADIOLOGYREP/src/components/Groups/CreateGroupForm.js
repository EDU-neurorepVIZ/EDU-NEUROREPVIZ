import React, { Component } from "react";
import MultiSelect from "@kenshooui/react-multi-select";

import axios from "axios";

import "@kenshooui/react-multi-select/dist/style.css";

import Loading from "../Loading";

import API from "../../API.js";

class CreateGroupForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      selectedStudents: [],
      teachers: [],
      selectedTeachers: [],
      groupName: this.props.selectedGroup ? this.props.selectedGroup.name : "",
      shouldSend: true
    };
  }

  componentDidMount() {
    this.props.addHistory({
      value: "Mis Grupos",
      action: () => {
        this.props.return();
      }
    });
    axios.get(API+"/user/all").then(res => {
      const allUsers = res.data;

      let newStudents = [];
      let newTeachers = [];

      allUsers.forEach((user, i) => 
      {
        if (user.role === "estudiantes") 
        {
          newStudents.push({ id: i, label: user.email });
        } 
        else if (user.role === "profesor") 
        {
          if (user.email !== this.props.userAuth.email) 
          {
            newTeachers.push({ id: i, label: user.email });
          }          
        }
      });
      this.setState({ students: newStudents, teachers: newTeachers }, () => {
        // EDITAR GRUPOS
        if (this.props.selectedGroup) {
          axios
            .get(API+"/group/" + this.props.selectedGroup._id)
            .then(res => {
              const { members } = res.data;
              let newSelectedStudents = [];
              members.forEach(member => {
                this.state.students.forEach(student => {
                  if (student["label"] === member["email"]) {
                    newSelectedStudents.push(student);
                  }
                });
              });

              const { ownerEmails } = res.data;
              let newSelectedTeachers = [];
              ownerEmails.forEach(owner => {
                this.state.teachers.forEach(teacher => {
                  if (teacher["label"] === owner["email"]) {
                    newSelectedTeachers.push(teacher);
                  }
                });
              });

              this.setState({
                selectedStudents: newSelectedStudents,
                selectedTeachers: newSelectedTeachers
              });
            });
        }
      });
    });
  }

  render() {
    const {
      students,
      selectedStudents,
      teachers,
      selectedTeachers
    } = this.state;
    return (
      <div>
        <h2 className="center">
          {this.props.selectedGroup
            ? "Editando grupo: " + this.props.selectedGroup.name
            : "Crear Grupo"}
        </h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (this.state.shouldSend) {
              this.setState({ shouldSend: false }, () => {
                this.props.deleteHistory(-1);
                if (this.props.selectedGroup) {
                  this.props.editGroup(
                    this.state.groupName,
                    selectedTeachers,
                    selectedStudents
                  );
                } else {
                  this.props.createGroup(
                    this.state.groupName,
                    selectedTeachers,
                    selectedStudents
                  );
                }
              });
            }
          }}
        >
          <label>
            <h5>Nombre de Grupo: </h5>
            <input
              disabled={this.props.selectedGroup}
              required
              type="text"
              placeholder={"Nombre de Grupo"}
              value={this.state.groupName}
              onChange={e => {
                this.setState({ groupName: e.target.value });
              }}
            />
          </label>

          <label>
            <h5>Profesores asistentes: </h5>
            <MultiSelect
              items={teachers}
              selectedItems={selectedTeachers}
              onChange={selectedTeachers => {
                this.setState({ selectedTeachers });
              }}
            />
          </label>

          <label>
            <h5>Estudiantes: </h5>
            <MultiSelect
              items={students}
              selectedItems={selectedStudents}
              onChange={selectedStudents => {
                this.setState({ selectedStudents });
              }}
            />
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "5vh",
              marginTop: "5vh"
            }}
          >
            {this.state.shouldSend ? (
              <input
                style={{ fontSize: "1.3rem" }}
                className="btn light blue"
                type="submit"
                value={this.props.selectedGroup ? "EDITAR" : "CREAR"}
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

export default CreateGroupForm;
