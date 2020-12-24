import React, { Component } from "react";

import NavioComponent from "../../../NavioComponent";
import Gallery from "../../Repository/Gallery";

import Parameter from "./Parameter";

class FilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //this determines selected params
      params: [],
      //filters
      data: {},
      // list of all parameters read from csv
      const_params: {},
      // actual data being used for navio
      navio_data: this.props.csvData,
      keyCounter: 0,
      images: []
    };

    this.props.continue();
  }

  fetchData() {
    return this.state.navio_data;
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
      images: this.convert(filteredData.slice(0, 151))
    });
  }

  componentDidMount() {
    this.setState({ images: this.convert(this.state.navio_data.slice(0, 51)) });
    // Load CSV Parameter File
    const Papa = require("papaparse/papaparse.min.js");
    Papa.parse("./PARAMETERS2.csv", {
      header: false,
      download: true,
      skipEmptyLines: true,
      complete: result => {
        const { data } = result;
        let params = {};
        data.forEach(element => {
          let key = element[0];
          let values = element;
          values.shift();
          params[key] = values;
        });
        this.setState({ const_params: params });
      }
    });
  }

  modifyData(name, actualData) {
    let tempData = this.state.data;
    tempData[name] = actualData;
    this.setState({ data: tempData });

    this.filterNavio();
  }

  deleteData(name, callback) {
    let tempData = this.state.data;
    delete tempData[name];
    this.setState({ data: tempData });
    callback();

    this.filterNavio();
  }

  filterNavio() {
    const filters = Object.entries(this.state.data);
    let nav_data = this.props.csvData;
    filters.forEach(filter => {
      nav_data = this.filterParam(nav_data, filter);
    });
    this.setState({
      navio_data: nav_data,
      images: this.convert(nav_data.slice(0, 151))
    });
  }

  // Helper method, filters one individual parameter
  filterParam(nav_data, filter) {
    let new_data = [];
    const key = filter[0];
    const { sujetos } = filter[1];
    const { valor } = filter[1];

    let counter = 0;
    let limit = sujetos ? sujetos : 9999999999999;

    nav_data.forEach(e => {
      if (counter < limit && e[key] === valor) {
        new_data.push(e);
        counter++;
      }
    });

    return new_data;
  }

  renderParameters() {
    return (
      <div>
        {this.state.params.map(e => {
          return (
            <Parameter
              key={e.key}
              defKey={e.key}
              defValue={e.defValue}
              deleteParam={this.deleteParam.bind(this)}
              selectedParams={Object.keys(this.state.data)}
              modifyData={this.modifyData.bind(this)}
              deleteData={this.deleteData.bind(this)}
              const_params={this.state.const_params}
            />
          );
        })}
      </div>
    );
  }

  addParam() {
    let defValue = "";

    let selectedParams = Object.keys(this.state.data);

    if (!selectedParams.length) {
      defValue = Object.keys(this.state.const_params)[0];
    } else {
      const session_params_arr = Object.keys(this.state.const_params);
      for (let i = 0; i < session_params_arr.length; i++) {
        const currentParam = session_params_arr[i];
        const index = selectedParams.indexOf(currentParam);
        if (index === -1) {
          defValue = currentParam;
          break;
        }
      }
    }

    const tempArray = this.state.params;
    tempArray.push({ key: this.state.keyCounter, defValue: defValue });

    let tempKeyCounter = this.state.keyCounter;
    tempKeyCounter++;

    this.setState({
      params: tempArray,
      keyCounter: tempKeyCounter
    });
  }

  deleteParam(key) {
    let array = this.state.params;
    let index = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i]["key"] === key) {
        index = i;
        break;
      }
    }
    if (index !== -1) array.splice(index, 1);
    this.setState({ params: array });
  }

  render() {
    return (
      <div className="form-session">
        <div className="form-container">
          <div className="row">
            <div className="col s3 center">Parametro</div>
            <div className="col s3 center">#Sujetos</div>
            <div className="col s4 center">Valor</div>
            <div className="col s1 center">
              {this.state.params.length !==
              Object.keys(this.state.const_params).length ? (
                <i
                  className="small material-icons hover"
                  onClick={this.addParam.bind(this)}
                >
                  add
                </i>
              ) : null}
            </div>
            {this.renderParameters()}
          </div>
          <div className="navio-disabled">
            <NavioComponent
              data={this.state.navio_data}
              updateCallback={this.updateCallback.bind(this)}
            />
          </div>
        </div>
        <Gallery images={this.state.images} />
      </div>
    );
  }
}

export default FilterForm;
