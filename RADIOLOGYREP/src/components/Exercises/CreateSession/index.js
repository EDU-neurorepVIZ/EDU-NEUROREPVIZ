import React, { Component } from "react";

import ContentPage from "./ContentPage";
import Loading from "../../Loading";

class CreateSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterForm: true,
      page: 0,
      shouldContinue: false,
      shouldSend: true
    };
    this.contentPageRef = React.createRef();
  }

  render() {
    return (
      <div className="session-form-content">
        <div className="form-content">
          <h1 className="center" style={{ marginTop: "0" }}>
            Crear Muestra
          </h1>
          <ContentPage
            changeSendButton={() => {
              this.setState({ shouldSend: false });
            }}
            userAuth={this.props.userAuth}
            csvData={this.props.csvData}
            ref={this.contentPageRef}
            page={this.state.page}
            continue={() => {
              this.setState({ shouldContinue: true });
            }}
          />
        </div>
        <div className="rayita">
          {this.state.page !== 0 ? (
            <button
              onClick={() => {
                this.setState({
                  page: this.state.page - 1,
                  shouldContinue: true
                });
              }}
            >
              <i className="small material-icons">arrow_back</i>
            </button>
          ) : null}
          {this.state.page !== 2 ? (
            <button
              className="boton-adelante"
              disabled={!this.state.shouldContinue}
              onClick={() => {
                this.setState({
                  page: this.state.page + 1,
                  shouldContinue: false
                });

                // We're in the navio or filter component
                if (this.state.page === 1) {
                  //Fetch data
                  this.contentPageRef.current.fetchData();
                }
              }}
            >
              <i className="small material-icons">arrow_forward</i>
            </button>
          ) : null}

          {this.state.page === 2 ? (
            <button
              disabled={!this.state.shouldSend}
              className="boton-adelante"
              onClick={() => {
                this.contentPageRef.current.createSession(() => {
                  this.props.returnHome();
                });
              }}
            >
              Terminar
            </button>
          ) : null}
        </div>
      </div>
    );
  }
}

export default CreateSession;
