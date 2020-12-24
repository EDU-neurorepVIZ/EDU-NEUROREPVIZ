import React, { Component } from "react";

class Parameter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.defValue,
      data: {
        sujetos: "",
        valor: this.props.const_params[this.props.defValue][0]
      }
    };

    this.props.modifyData(this.state.value, this.state.data);
  }

  shouldDisable(e) {
    let array = this.props.selectedParams;
    const index = array.indexOf(e);
    if (index !== -1) return true;

    return false;
  }

  render() {
    return (
      <div className="row">
        <div className="col s3">
          <select
            className="browser-default"
            value={this.state.value}
            onChange={e => {
              const previousState = this.state;

              // Selected params se cambian
              this.setState(
                {
                  value: e.target.value,
                  data: {
                    sujetos: "",
                    valor: this.props.const_params[e.target.value][0]
                  }
                },
                () => {
                  this.props.deleteData(previousState.value, () => {
                    this.props.modifyData(this.state.value, this.state.data);
                  });
                }
              );
            }}
          >
            {Object.keys(this.props.const_params).map(e => {
              return (
                <option value={e} key={e} disabled={this.shouldDisable(e)}>
                  {e}
                </option>
              );
            })}
          </select>
        </div>

        <div className="col s4">
          <input
            type="number"
            value={this.state.data.sujetos}
            onChange={e => {
              this.setState(
                {
                  data: {
                    sujetos: e.target.value,
                    valor: this.state.data.valor
                  }
                },
                () => {
                  this.props.modifyData(this.state.value, this.state.data);
                }
              );
            }}
          />
        </div>

        <div className="col s3">
          <select
            className="browser-default"
            value={this.state.data.valor}
            onChange={e => {
              let newData = this.state.data;
              newData.valor = e.target.value;
              this.setState({ data: newData }, () => {
                this.props.modifyData(this.state.value, this.state.data);
              });
            }}
          >
            {this.props.const_params[this.state.value].map(e => {
              return (
                <option value={e} key={e}>
                  {e}
                </option>
              );
            })}
          </select>
        </div>

        <div className="col s1">
          <i
            className="small material-icons hover center"
            onClick={() => {
              this.props.deleteParam(this.props.defKey);
              this.props.deleteData(this.state.value, () => {});
            }}
          >
            delete
          </i>
        </div>
      </div>
    );
  }
}

export default Parameter;
