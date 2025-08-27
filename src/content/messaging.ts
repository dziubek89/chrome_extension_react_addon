export const sendMessage = async <T = any>(msg: any): Promise<T> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (response) => {
      resolve(response);
    });
  });
};

export const getNotesForUrl = async (url: string) => {
  const res = await sendMessage<{ notes: string[] }>({
    type: "GET_NOTES",
    url,
  });
  return res.notes || [];
};

export const sendNote = async (note: string, userId: string, url: string) => {
  await sendMessage({
    type: "SEND_NOTE",
    payload: { note, userId, url },
  });
};
