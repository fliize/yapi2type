import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getTypeDefine } from "./core/yapiToTs";

const Popup = () => {

  const [response, setResponse] = useState<string>('{}')

  useEffect(() => {
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   setCurrentURL(tabs[0].url);
    // });
    console.log('???????????????');
    
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
            const resBody = JSON.parse(data.res_body)
            console.log(typeof resBody, resBody);
            
            const res = getTypeDefine(resBody)
            console.log('msg', msg);
            console.log('res', res);
            
            setResponse(res)
          }
        );
      }
    });
  }, []);

  const changeBackground = () => {
    
  };

  return (
    <>
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
