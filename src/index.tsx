import ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Brak elementu #root w index.html");

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
