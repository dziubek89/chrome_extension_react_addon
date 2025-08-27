import ReactDOM from "react-dom/client";
import ContentScript from "./ContentScript";

const CONTAINER_ID = "my-react-content-script-root";

function injectCSS() {
  const style = document.createElement("style");
  style.textContent = `
    .ProseMirror {
      min-height: 290px;
      max-height: 290px;
      margin-right: 8px;
      padding: 8px;
      border-radius: 6px;
      background: #f5f5f5;
      overflow: auto;
    }

.ProseMirror ol > li > p {
    /* Twoja klasa lub style */
    margin-left: 5px;
    padding: 2px 0px;
    margin-top: 0px;
    margin-bottom: 0px;
  }  
  
.ProseMirror ul > li > p {
    /* Twoja klasa lub style */
    margin-left: 5px;
    padding: 2px 0px;
    margin-top: 0px;
    margin-bottom: 0px;
} 

  `;
  document.head.appendChild(style);
}

function init() {
  // Wstrzykujemy CSS zanim utworzymy React root
  injectCSS();

  let container = document.getElementById(CONTAINER_ID);

  if (!container) {
    container = document.createElement("div");
    container.id = CONTAINER_ID;
    document.body.appendChild(container);
  }

  const root = ReactDOM.createRoot(container);
  root.render(<ContentScript />);
}

init();
