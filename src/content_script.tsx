var response: any = null
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type === 'getResponse') {
    sendResponse(response);
  }
});

const func = () => {
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('js/inject.js');
  s.onload = function () {
    // @ts-ignore
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);


  document.addEventListener('senResponse', function (e) {
    // @ts-ignore
    response = e.detail
    console.log('received', 'senResponse');
  });

}

func()