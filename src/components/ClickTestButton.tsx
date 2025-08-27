import React from "react";
import { sendMessageAsync } from "../utils/handleMessage";

export const ClickTestButton: React.FC = () => {
  const handleClick = async () => {
    const currentUrl = window.location.href.split("?")[0];
    console.log(currentUrl);

    try {
      const response = await sendMessageAsync({
        type: "GET_NOTES",
        url: currentUrl,
      });

      console.log(response);

      if (response?.notes?.notes?.length > 0) {
        console.log("Notatki dla tej strony:", response.notes.notes);
      } else {
        console.log("Brak notatek dla tej strony");
      }
    } catch (err) {
      console.error("Błąd podczas pobierania notatek:", err);
    }
  };

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-[99999]">
      <button
        onClick={handleClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-lg"
      >
        Get notes button!
      </button>
    </div>
  );
};
