/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/yapiToTs.ts":
/*!******************************!*\
  !*** ./src/core/yapiToTs.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTypeDefine = void 0;
const capitalized = (word) => word.charAt(0).toUpperCase() + word.slice(1);
// 去除enum类型描述的干扰字符
const reg = /,|，|;|:|-|\.|\s/g;
const isEnumLike = (data) => {
    // 处理结果; 0 - 未知，1 - 待删除，2 已删除，3 - 等待好友通过，4 - 已重新成为好友
    // 时间类型：1-小时，2-天, 3 - 分钟， 4 - 秒
    // 类型，1客户推送，2群聊推送，3循环推送, 4 - 自动推送
    // 客服在线状态：1.在线，2.离线
    if (!data.description)
        return false;
    return data.description.replace(reg, '').split(/\d+/).length > 1;
};
const getTypeDefine = (data, spaceName) => {
    function getBoolDesc(data, name) {
        // 返回boolean类型的声明
        return `// ${data.description}
        ${name}: boolean;`;
    }
    function getNumberDesc(data, name) {
        if (isEnumLike(data)) {
            resStr = genEnum(data, name) + resStr;
            return `// ${data.description}
        ${name}: ${capitalized(name) + 'Enum'};`;
        }
        else {
            // 返回number类型的声明
            return `// ${data.description}
        ${name}: number;`;
        }
    }
    function getStringDesc(data, name) {
        // 返回string类型的声明
        return `// ${data.description}
    ${name}: string;`;
    }
    function getArrayDesc(data, name) {
        // 根据数组生成IItem类型
        if (data.items.type === 'integer') {
            return getNumberDesc(data.items, name);
        }
        else if (data.items.type === 'string') {
            return getStringDesc(data.items, name);
        }
        else if (data.items.type === 'boolean') {
            return getBoolDesc(data.items, name);
        }
        else if (data.items.type === 'array') {
            throw new Error('暂未处理数组嵌数组的情况');
        }
        else {
            resStr = genInterface(data.items, name) + resStr;
            // console.log('res', resStr)
            // 返回array类型的声明
            return `${name}: ${'I' + capitalized(name)}[]`;
        }
    }
    function getObjectDesc(data, name) {
        // 根据对象生成IName类型
        resStr = genInterface(data, name || spaceName) + resStr;
        if (!name)
            return '';
        // 返回object类型的声明
        return `// ${data.description}
    ${name}: ${'I' + capitalized(name)}`;
    }
    // 生成enum
    function genEnum(data, name) {
        const cleanStr = data.description.replace(reg, '');
        const enumValues = cleanStr.match(/\d+/g);
        const enumTextList = cleanStr.split(/\d+/).slice(-enumValues.length);
        let str = `enum ${capitalized(name) + 'Enum'} `;
        str += '{\n';
        for (let i = 0; i < enumValues.length; i++) {
            str += `${enumTextList[i]} = ${enumValues[i]},`;
            str += '\n';
        }
        str += '}\n';
        return str;
    }
    // 生成interface
    function genInterface(data, name) {
        let str = `interface ${'I' + capitalized(name)} `;
        str += '{\n';
        for (const [key, value] of Object.entries(data.properties)) {
            str += getTypeDesc(value, key);
            str += '\n';
        }
        str += '}\n';
        // console.log(str)
        return str;
    }
    function getTypeDesc(data, name = '') {
        switch (data.type) {
            case 'boolean':
                return getBoolDesc(data, name);
            case 'integer':
                return getNumberDesc(data, name);
            case 'string':
                return getStringDesc(data, name);
            case 'array':
                return getArrayDesc(data, name);
            case 'object':
                return getObjectDesc(data, name);
        }
    }
    let resStr = '';
    const res = getTypeDesc(data);
    resStr += res;
    return resStr;
};
exports.getTypeDefine = getTypeDefine;


/***/ }),

/***/ "./src/popup.tsx":
/*!***********************!*\
  !*** ./src/popup.tsx ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importStar(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
const react_dom_1 = __importDefault(__webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js"));
const yapiToTs_1 = __webpack_require__(/*! ./core/yapiToTs */ "./src/core/yapiToTs.ts");
const Popup = () => {
    const [response, setResponse] = (0, react_1.useState)('{}');
    const [reqBody, setReqBody] = (0, react_1.useState)('{}');
    (0, react_1.useEffect)(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tab = tabs[0];
            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, {
                    type: "getResponse",
                }, (msg) => {
                    // setResponse(msg)
                    const data = JSON.parse(msg).data;
                    const resBody = JSON.parse(data.res_body || '{}');
                    const reqBody = JSON.parse(data.req_body_other || '{}');
                    console.log(typeof resBody, resBody);
                    setResponse((0, yapiToTs_1.getTypeDefine)(resBody, 'response'));
                    setReqBody((0, yapiToTs_1.getTypeDefine)(reqBody, 'req'));
                });
            }
        });
    }, []);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { style: { whiteSpace: 'pre' } }, reqBody),
        react_1.default.createElement("div", { style: { whiteSpace: 'pre' } }, response)));
};
react_dom_1.default.render(react_1.default.createElement(react_1.default.StrictMode, null,
    react_1.default.createElement(Popup, null)), document.getElementById("root"));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"popup": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkchrome_extension_typescript_starter"] = self["webpackChunkchrome_extension_typescript_starter"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/popup.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO1dBQ0E7Ozs7O1dDM0JBOzs7OztXQ0FBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2NvcmUveWFwaVRvVHMudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvcG9wdXAudHN4Iiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5nZXRUeXBlRGVmaW5lID0gdm9pZCAwO1xyXG5jb25zdCBjYXBpdGFsaXplZCA9ICh3b3JkKSA9PiB3b3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgd29yZC5zbGljZSgxKTtcclxuLy8g5Y676ZmkZW51beexu+Wei+aPj+i/sOeahOW5suaJsOWtl+esplxyXG5jb25zdCByZWcgPSAvLHzvvIx8O3w6fC18XFwufFxccy9nO1xyXG5jb25zdCBpc0VudW1MaWtlID0gKGRhdGEpID0+IHtcclxuICAgIC8vIOWkhOeQhue7k+aenDsgMCAtIOacquefpe+8jDEgLSDlvoXliKDpmaTvvIwyIOW3suWIoOmZpO+8jDMgLSDnrYnlvoXlpb3lj4vpgJrov4fvvIw0IC0g5bey6YeN5paw5oiQ5Li65aW95Y+LXHJcbiAgICAvLyDml7bpl7TnsbvlnovvvJoxLeWwj+aXtu+8jDIt5aSpLCAzIC0g5YiG6ZKf77yMIDQgLSDnp5JcclxuICAgIC8vIOexu+Wei++8jDHlrqLmiLfmjqjpgIHvvIwy576k6IGK5o6o6YCB77yMM+W+queOr+aOqOmAgSwgNCAtIOiHquWKqOaOqOmAgVxyXG4gICAgLy8g5a6i5pyN5Zyo57q/54q25oCB77yaMS7lnKjnur/vvIwyLuemu+e6v1xyXG4gICAgaWYgKCFkYXRhLmRlc2NyaXB0aW9uKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIHJldHVybiBkYXRhLmRlc2NyaXB0aW9uLnJlcGxhY2UocmVnLCAnJykuc3BsaXQoL1xcZCsvKS5sZW5ndGggPiAxO1xyXG59O1xyXG5jb25zdCBnZXRUeXBlRGVmaW5lID0gKGRhdGEsIHNwYWNlTmFtZSkgPT4ge1xyXG4gICAgZnVuY3Rpb24gZ2V0Qm9vbERlc2MoZGF0YSwgbmFtZSkge1xyXG4gICAgICAgIC8vIOi/lOWbnmJvb2xlYW7nsbvlnovnmoTlo7DmmI5cclxuICAgICAgICByZXR1cm4gYC8vICR7ZGF0YS5kZXNjcmlwdGlvbn1cclxuICAgICAgICAke25hbWV9OiBib29sZWFuO2A7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBnZXROdW1iZXJEZXNjKGRhdGEsIG5hbWUpIHtcclxuICAgICAgICBpZiAoaXNFbnVtTGlrZShkYXRhKSkge1xyXG4gICAgICAgICAgICByZXNTdHIgPSBnZW5FbnVtKGRhdGEsIG5hbWUpICsgcmVzU3RyO1xyXG4gICAgICAgICAgICByZXR1cm4gYC8vICR7ZGF0YS5kZXNjcmlwdGlvbn1cclxuICAgICAgICAke25hbWV9OiAke2NhcGl0YWxpemVkKG5hbWUpICsgJ0VudW0nfTtgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8g6L+U5ZuebnVtYmVy57G75Z6L55qE5aOw5piOXHJcbiAgICAgICAgICAgIHJldHVybiBgLy8gJHtkYXRhLmRlc2NyaXB0aW9ufVxyXG4gICAgICAgICR7bmFtZX06IG51bWJlcjtgO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGdldFN0cmluZ0Rlc2MoZGF0YSwgbmFtZSkge1xyXG4gICAgICAgIC8vIOi/lOWbnnN0cmluZ+exu+Wei+eahOWjsOaYjlxyXG4gICAgICAgIHJldHVybiBgLy8gJHtkYXRhLmRlc2NyaXB0aW9ufVxyXG4gICAgJHtuYW1lfTogc3RyaW5nO2A7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBnZXRBcnJheURlc2MoZGF0YSwgbmFtZSkge1xyXG4gICAgICAgIC8vIOagueaNruaVsOe7hOeUn+aIkElJdGVt57G75Z6LXHJcbiAgICAgICAgaWYgKGRhdGEuaXRlbXMudHlwZSA9PT0gJ2ludGVnZXInKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXROdW1iZXJEZXNjKGRhdGEuaXRlbXMsIG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChkYXRhLml0ZW1zLnR5cGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdEZXNjKGRhdGEuaXRlbXMsIG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChkYXRhLml0ZW1zLnR5cGUgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0Qm9vbERlc2MoZGF0YS5pdGVtcywgbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGRhdGEuaXRlbXMudHlwZSA9PT0gJ2FycmF5Jykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ+aaguacquWkhOeQhuaVsOe7hOW1jOaVsOe7hOeahOaDheWGtScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVzU3RyID0gZ2VuSW50ZXJmYWNlKGRhdGEuaXRlbXMsIG5hbWUpICsgcmVzU3RyO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVzJywgcmVzU3RyKVxyXG4gICAgICAgICAgICAvLyDov5Tlm55hcnJheeexu+Wei+eahOWjsOaYjlxyXG4gICAgICAgICAgICByZXR1cm4gYCR7bmFtZX06ICR7J0knICsgY2FwaXRhbGl6ZWQobmFtZSl9W11gO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGdldE9iamVjdERlc2MoZGF0YSwgbmFtZSkge1xyXG4gICAgICAgIC8vIOagueaNruWvueixoeeUn+aIkElOYW1l57G75Z6LXHJcbiAgICAgICAgcmVzU3RyID0gZ2VuSW50ZXJmYWNlKGRhdGEsIG5hbWUgfHwgc3BhY2VOYW1lKSArIHJlc1N0cjtcclxuICAgICAgICBpZiAoIW5hbWUpXHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAvLyDov5Tlm55vYmplY3TnsbvlnovnmoTlo7DmmI5cclxuICAgICAgICByZXR1cm4gYC8vICR7ZGF0YS5kZXNjcmlwdGlvbn1cclxuICAgICR7bmFtZX06ICR7J0knICsgY2FwaXRhbGl6ZWQobmFtZSl9YDtcclxuICAgIH1cclxuICAgIC8vIOeUn+aIkGVudW1cclxuICAgIGZ1bmN0aW9uIGdlbkVudW0oZGF0YSwgbmFtZSkge1xyXG4gICAgICAgIGNvbnN0IGNsZWFuU3RyID0gZGF0YS5kZXNjcmlwdGlvbi5yZXBsYWNlKHJlZywgJycpO1xyXG4gICAgICAgIGNvbnN0IGVudW1WYWx1ZXMgPSBjbGVhblN0ci5tYXRjaCgvXFxkKy9nKTtcclxuICAgICAgICBjb25zdCBlbnVtVGV4dExpc3QgPSBjbGVhblN0ci5zcGxpdCgvXFxkKy8pLnNsaWNlKC1lbnVtVmFsdWVzLmxlbmd0aCk7XHJcbiAgICAgICAgbGV0IHN0ciA9IGBlbnVtICR7Y2FwaXRhbGl6ZWQobmFtZSkgKyAnRW51bSd9IGA7XHJcbiAgICAgICAgc3RyICs9ICd7XFxuJztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudW1WYWx1ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgc3RyICs9IGAke2VudW1UZXh0TGlzdFtpXX0gPSAke2VudW1WYWx1ZXNbaV19LGA7XHJcbiAgICAgICAgICAgIHN0ciArPSAnXFxuJztcclxuICAgICAgICB9XHJcbiAgICAgICAgc3RyICs9ICd9XFxuJztcclxuICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgfVxyXG4gICAgLy8g55Sf5oiQaW50ZXJmYWNlXHJcbiAgICBmdW5jdGlvbiBnZW5JbnRlcmZhY2UoZGF0YSwgbmFtZSkge1xyXG4gICAgICAgIGxldCBzdHIgPSBgaW50ZXJmYWNlICR7J0knICsgY2FwaXRhbGl6ZWQobmFtZSl9IGA7XHJcbiAgICAgICAgc3RyICs9ICd7XFxuJztcclxuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhLnByb3BlcnRpZXMpKSB7XHJcbiAgICAgICAgICAgIHN0ciArPSBnZXRUeXBlRGVzYyh2YWx1ZSwga2V5KTtcclxuICAgICAgICAgICAgc3RyICs9ICdcXG4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdHIgKz0gJ31cXG4nO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHN0cilcclxuICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZ2V0VHlwZURlc2MoZGF0YSwgbmFtZSA9ICcnKSB7XHJcbiAgICAgICAgc3dpdGNoIChkYXRhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Qm9vbERlc2MoZGF0YSwgbmFtZSk7XHJcbiAgICAgICAgICAgIGNhc2UgJ2ludGVnZXInOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldE51bWJlckRlc2MoZGF0YSwgbmFtZSk7XHJcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRGVzYyhkYXRhLCBuYW1lKTtcclxuICAgICAgICAgICAgY2FzZSAnYXJyYXknOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEFycmF5RGVzYyhkYXRhLCBuYW1lKTtcclxuICAgICAgICAgICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRPYmplY3REZXNjKGRhdGEsIG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCByZXNTdHIgPSAnJztcclxuICAgIGNvbnN0IHJlcyA9IGdldFR5cGVEZXNjKGRhdGEpO1xyXG4gICAgcmVzU3RyICs9IHJlcztcclxuICAgIHJldHVybiByZXNTdHI7XHJcbn07XHJcbmV4cG9ydHMuZ2V0VHlwZURlZmluZSA9IGdldFR5cGVEZWZpbmU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSkpO1xyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn0pO1xyXG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCByZWFjdF8xID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCJyZWFjdFwiKSk7XHJcbmNvbnN0IHJlYWN0X2RvbV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJyZWFjdC1kb21cIikpO1xyXG5jb25zdCB5YXBpVG9Uc18xID0gcmVxdWlyZShcIi4vY29yZS95YXBpVG9Uc1wiKTtcclxuY29uc3QgUG9wdXAgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBbcmVzcG9uc2UsIHNldFJlc3BvbnNlXSA9ICgwLCByZWFjdF8xLnVzZVN0YXRlKSgne30nKTtcclxuICAgIGNvbnN0IFtyZXFCb2R5LCBzZXRSZXFCb2R5XSA9ICgwLCByZWFjdF8xLnVzZVN0YXRlKSgne30nKTtcclxuICAgICgwLCByZWFjdF8xLnVzZUVmZmVjdCkoKCkgPT4ge1xyXG4gICAgICAgIGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sIGZ1bmN0aW9uICh0YWJzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhYiA9IHRhYnNbMF07XHJcbiAgICAgICAgICAgIGlmICh0YWIuaWQpIHtcclxuICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZ2V0UmVzcG9uc2VcIixcclxuICAgICAgICAgICAgICAgIH0sIChtc2cpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXRSZXNwb25zZShtc2cpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UobXNnKS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc0JvZHkgPSBKU09OLnBhcnNlKGRhdGEucmVzX2JvZHkgfHwgJ3t9Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVxQm9keSA9IEpTT04ucGFyc2UoZGF0YS5yZXFfYm9keV9vdGhlciB8fCAne30nKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0eXBlb2YgcmVzQm9keSwgcmVzQm9keSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0UmVzcG9uc2UoKDAsIHlhcGlUb1RzXzEuZ2V0VHlwZURlZmluZSkocmVzQm9keSwgJ3Jlc3BvbnNlJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFJlcUJvZHkoKDAsIHlhcGlUb1RzXzEuZ2V0VHlwZURlZmluZSkocmVxQm9keSwgJ3JlcScpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LCBbXSk7XHJcbiAgICByZXR1cm4gKHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KHJlYWN0XzEuZGVmYXVsdC5GcmFnbWVudCwgbnVsbCxcclxuICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7IHdoaXRlU3BhY2U6ICdwcmUnIH0gfSwgcmVxQm9keSksXHJcbiAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZTogeyB3aGl0ZVNwYWNlOiAncHJlJyB9IH0sIHJlc3BvbnNlKSkpO1xyXG59O1xyXG5yZWFjdF9kb21fMS5kZWZhdWx0LnJlbmRlcihyZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChyZWFjdF8xLmRlZmF1bHQuU3RyaWN0TW9kZSwgbnVsbCxcclxuICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFBvcHVwLCBudWxsKSksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSk7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcInBvcHVwXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2Nocm9tZV9leHRlbnNpb25fdHlwZXNjcmlwdF9zdGFydGVyXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2Nocm9tZV9leHRlbnNpb25fdHlwZXNjcmlwdF9zdGFydGVyXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvcG9wdXAudHN4XCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=