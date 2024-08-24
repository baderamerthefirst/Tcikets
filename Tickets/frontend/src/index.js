import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import { MessageProvider } from "./components/MessageContext/MessageContext";
import { SelectedFileRequestProvider } from "./components/SelectedFileRequestContext/SelectedFileRequestContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
  <AuthProvider>
    <MessageProvider>
      <SelectedFileRequestProvider>
      {/* <React.StrictMode> */}
        <App />
      {/* </React.StrictMode> */}
      </SelectedFileRequestProvider>
    </MessageProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
