/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************!*\
  !*** ./src/inject.js ***!
  \***********************/
(function (xhr) {
    var XHR = XMLHttpRequest.prototype;
    var open = XHR.open;
    var send = XHR.send;
    var setRequestHeader = XHR.setRequestHeader;
    XHR.open = function (method, url) {
        this._method = method;
        this._url = url;
        this._requestHeaders = {};
        this._startTime = (new Date()).toISOString();
        return open.apply(this, arguments);
    };
    XHR.setRequestHeader = function (header, value) {
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
    };
    XHR.send = function (postData) {
        this.addEventListener('load', function () {
            var endTime = (new Date()).toISOString();
            var myUrl = this._url ? this._url.toLowerCase() : this._url;
            console.log('url', myUrl)
            if (myUrl) {
                if (myUrl.indexOf('/api/interface/get') !== -1) {
                    var responseData = this.response;
                    document.dispatchEvent(new CustomEvent('senResponse', { url: myUrl, detail: responseData }));
                }
            }
        });
        return send.apply(this, arguments);
    };

})(XMLHttpRequest);
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEVBQTRFLGtDQUFrQztBQUM5RztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUEsQ0FBQyxrQiIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2luamVjdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHhocikge1xuICAgIHZhciBYSFIgPSBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGU7XG4gICAgdmFyIG9wZW4gPSBYSFIub3BlbjtcbiAgICB2YXIgc2VuZCA9IFhIUi5zZW5kO1xuICAgIHZhciBzZXRSZXF1ZXN0SGVhZGVyID0gWEhSLnNldFJlcXVlc3RIZWFkZXI7XG4gICAgWEhSLm9wZW4gPSBmdW5jdGlvbiAobWV0aG9kLCB1cmwpIHtcbiAgICAgICAgdGhpcy5fbWV0aG9kID0gbWV0aG9kO1xuICAgICAgICB0aGlzLl91cmwgPSB1cmw7XG4gICAgICAgIHRoaXMuX3JlcXVlc3RIZWFkZXJzID0ge307XG4gICAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IChuZXcgRGF0ZSgpKS50b0lTT1N0cmluZygpO1xuICAgICAgICByZXR1cm4gb3Blbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgWEhSLnNldFJlcXVlc3RIZWFkZXIgPSBmdW5jdGlvbiAoaGVhZGVyLCB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9yZXF1ZXN0SGVhZGVyc1toZWFkZXJdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiBzZXRSZXF1ZXN0SGVhZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBYSFIuc2VuZCA9IGZ1bmN0aW9uIChwb3N0RGF0YSkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZW5kVGltZSA9IChuZXcgRGF0ZSgpKS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgdmFyIG15VXJsID0gdGhpcy5fdXJsID8gdGhpcy5fdXJsLnRvTG93ZXJDYXNlKCkgOiB0aGlzLl91cmw7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndXJsJywgbXlVcmwpXG4gICAgICAgICAgICBpZiAobXlVcmwpIHtcbiAgICAgICAgICAgICAgICBpZiAobXlVcmwuaW5kZXhPZignL2FwaS9pbnRlcmZhY2UvZ2V0JykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZURhdGEgPSB0aGlzLnJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnc2VuUmVzcG9uc2UnLCB7IHVybDogbXlVcmwsIGRldGFpbDogcmVzcG9uc2VEYXRhIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc2VuZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbn0pKFhNTEh0dHBSZXF1ZXN0KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=