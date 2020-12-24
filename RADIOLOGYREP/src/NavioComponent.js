import React, { Component } from "react";
import PropTypes from "prop-types";

import * as d3 from "d3";
import * as d3ScaleChromatic from "d3-scale-chromatic";
import navio from "navio";

import "./NavioComponent.css";

class NavioComponent extends Component {
  componentDidMount() {
    this.nn = navio(d3.select(this.target), 590)
      .updateCallback(this.props.updateCallback)
      .addSequentialAttrib("Edad")
      .addCategoricalAttrib("Rango edad presentación del tumor")
      .addCategoricalAttrib("Diagnóstico")
      .addCategoricalAttrib("Sexo")     
      .addCategoricalAttrib("Tipo Estudio")
      .addCategoricalAttrib("Localización")   
      .addCategoricalAttrib("Número de lesiones")   
      .addCategoricalAttrib("Margenes") 
      .addCategoricalAttrib("Caracteristicas principales")
      .addCategoricalAttrib("Caracteristicas secundarias")
      .addCategoricalAttrib("Comportamiento de la imagen")
      .addCategoricalAttrib("Difusión")
      .addCategoricalAttrib("Edema vasogenico")
      .addCategoricalAttrib("Realce con el medio de contraste")
      .addCategoricalAttrib("Efectos tumorales")
      .addCategoricalAttrib("Sintomas HEC")
      .addCategoricalAttrib("Sindrome motor")
      .addCategoricalAttrib("Sindrome sensitivo")
      .addCategoricalAttrib("Sindrome cerebeloso")
      .addCategoricalAttrib("Alteracion de organos de los sentidos")
      .addCategoricalAttrib("Afasia o alteracion del lenguaje")
      .addCategoricalAttrib("Sindrome convulsivo")
      .addCategoricalAttrib("Alteracion del comportamiento")
      .addCategoricalAttrib("Lipotimia")
      .addCategoricalAttrib("Cefalea")
      .addCategoricalAttrib("Tipo de tratamiento mixto")
      .addCategoricalAttrib("Tipo de tumor")
      .addCategoricalAttrib("Lugar de metastasis");

    if (this.props.data) {
      this.nn.data(this.props.data);
    }
  }

  componentWillUpdate(newProps) {
    if (newProps.data.length !== this.props.data.length)
      this.nn.data(newProps.data);
  }

  render() {
    return (
      <div
        className="NavioComponent"
        ref={target => (this.target = target)}
      ></div>
    );
  }
}

NavioComponent.propTypes = {
  data: PropTypes.array.isRequired,
  updateCallback: PropTypes.func.isRequired
};

export default NavioComponent;
