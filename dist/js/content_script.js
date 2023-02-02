/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!********************************!*\
  !*** ./src/content_script.tsx ***!
  \********************************/

var response = null;
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
        response = e.detail;
        console.log('received', 'senResponse');
    });
};
func();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudF9zY3JpcHQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29udGVudF9zY3JpcHQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG52YXIgcmVzcG9uc2UgPSBudWxsO1xyXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKG1zZywgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcclxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2dldFJlc3BvbnNlJykge1xyXG4gICAgICAgIHNlbmRSZXNwb25zZShyZXNwb25zZSk7XHJcbiAgICB9XHJcbn0pO1xyXG5jb25zdCBmdW5jID0gKCkgPT4ge1xyXG4gICAgdmFyIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgIHMuc3JjID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKCdqcy9pbmplY3QuanMnKTtcclxuICAgIHMub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLnJlbW92ZSgpO1xyXG4gICAgfTtcclxuICAgIChkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuYXBwZW5kQ2hpbGQocyk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzZW5SZXNwb25zZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHJlc3BvbnNlID0gZS5kZXRhaWw7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3JlY2VpdmVkJywgJ3NlblJlc3BvbnNlJyk7XHJcbiAgICB9KTtcclxufTtcclxuZnVuYygpO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=