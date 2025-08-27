chrome.runtime.onMessage.addListener(
  (
    msg: { type: string },
    //@ts-ignore
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (msg.type === "HELLO_FROM_CONTENT") {
      sendResponse({ msg: "Cześć z background!" });
    }
  }
);

//@ts-ignore
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);

  if (message.type === "SET_TOKEN") {
    chrome.storage.local.set({ authToken: message.token }, () => {
      console.log("Token zapisany w chrome.storage.local");
      sendResponse({ success: true });
    });
    return true;
  }
});

// const uri = "http://localhost:3000/api/notes"
const uri = "https://chrome-extension-next.vercel.app/api/notes";

//@ts-ignore
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_NOTES") {
    (async () => {
      try {
        const pageUrl = message.url;

        const res = await fetch(`${uri}?url=${encodeURIComponent(pageUrl)}`, {
          method: "GET",
          credentials: "include", // jeśli używasz cookies/sesji
        });

        const data = await res.json();
        sendResponse({ notes: data });
      } catch (err) {
        console.error("Błąd pobierania notatek:", err);
        sendResponse({ notes: [] });
      }
    })();

    return true; // pozwala używać sendResponse po async
  }

  if (message.type === "UPDATE_NOTE") {
    (async () => {
      try {
        const { id, title, content } = message;
        const res = await fetch(uri, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, title, content }),
        });

        const data = await res.json();
        sendResponse({ notes: data });
      } catch (err) {
        console.error("Błąd pobierania notatek:", err);
        sendResponse({ notes: [] });
      }
    })();

    return true; // pozwala używać sendResponse po async
  }

  if (message.type === "ADD_NOTE") {
    console.log(message);

    (async () => {
      try {
        const { note, url, category, title } = message;

        console.log(note);

        const res = await fetch(uri, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ note, url, category, title }),
        });

        const data = await res.json();

        console.log(data);
        sendResponse({ notes: data });
      } catch (err) {
        console.error("Błąd pobierania notatek:", err);
        sendResponse({ notes: [] });
      }
    })();

    return true; // pozwala używać sendResponse po async
  }
});
