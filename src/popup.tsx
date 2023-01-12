import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getTypeDefine } from "./core/yapiToTs";

const Popup = () => {

  const [response, setResponse] = useState<string>('{}')
  const [reqBody, setReqBody] = useState<string>('{}')

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            type: "getResponse",
          },
          (msg) => {
            // setResponse(msg)
            const data = JSON.parse(msg).data
            const resBody = JSON.parse(data.res_body || '{}')
            const reqBody = JSON.parse(data.req_body_other || '{}')
            console.log(typeof resBody, resBody);
            setResponse(getTypeDefine(resBody, 'response'))
            setReqBody(getTypeDefine(reqBody, 'req'))
          }
        );
      }
    });
  }, []);

  return (
    <>
      <div style={{ whiteSpace: 'pre' }}>
        {reqBody}
      </div>
      <div style={{ whiteSpace: 'pre' }}>
        {response}
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
