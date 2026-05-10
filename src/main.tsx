import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { ApiProvider } from "./app/context/ApiContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ApiProvider>
            <App />
        </ApiProvider>
    </React.StrictMode>
);
