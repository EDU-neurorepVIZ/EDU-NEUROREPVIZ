import React from "react";
import ReactDOM from "react-dom";

import "materialize-css/dist/css/materialize.css";
import "materialize-css/dist/js/materialize.js";

import Routes from "./routes.js";
import Firebase, { FirebaseContext } from "./components/Firebase";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <Routes />
  </FirebaseContext.Provider>,
  document.getElementById("app")
);
registerServiceWorker();
