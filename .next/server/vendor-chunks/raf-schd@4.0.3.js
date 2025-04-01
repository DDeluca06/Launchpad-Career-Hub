"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/raf-schd@4.0.3";
exports.ids = ["vendor-chunks/raf-schd@4.0.3"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/raf-schd@4.0.3/node_modules/raf-schd/dist/raf-schd.esm.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/raf-schd@4.0.3/node_modules/raf-schd/dist/raf-schd.esm.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar rafSchd = function rafSchd(fn) {\n  var lastArgs = [];\n  var frameId = null;\n\n  var wrapperFn = function wrapperFn() {\n    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    lastArgs = args;\n\n    if (frameId) {\n      return;\n    }\n\n    frameId = requestAnimationFrame(function () {\n      frameId = null;\n      fn.apply(void 0, lastArgs);\n    });\n  };\n\n  wrapperFn.cancel = function () {\n    if (!frameId) {\n      return;\n    }\n\n    cancelAnimationFrame(frameId);\n    frameId = null;\n  };\n\n  return wrapperFn;\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rafSchd);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vcmFmLXNjaGRANC4wLjMvbm9kZV9tb2R1bGVzL3JhZi1zY2hkL2Rpc3QvcmFmLXNjaGQuZXNtLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3RUFBd0UsYUFBYTtBQUNyRjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWUsT0FBTyxFQUFDIiwic291cmNlcyI6WyJIOlxcUHJvamVjdHNcXExhdW5jaHBhZC1DYXJlZXItSHViXFxub2RlX21vZHVsZXNcXC5wbnBtXFxyYWYtc2NoZEA0LjAuM1xcbm9kZV9tb2R1bGVzXFxyYWYtc2NoZFxcZGlzdFxccmFmLXNjaGQuZXNtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciByYWZTY2hkID0gZnVuY3Rpb24gcmFmU2NoZChmbikge1xuICB2YXIgbGFzdEFyZ3MgPSBbXTtcbiAgdmFyIGZyYW1lSWQgPSBudWxsO1xuXG4gIHZhciB3cmFwcGVyRm4gPSBmdW5jdGlvbiB3cmFwcGVyRm4oKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIGxhc3RBcmdzID0gYXJncztcblxuICAgIGlmIChmcmFtZUlkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZnJhbWVJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICBmcmFtZUlkID0gbnVsbDtcbiAgICAgIGZuLmFwcGx5KHZvaWQgMCwgbGFzdEFyZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIHdyYXBwZXJGbi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFmcmFtZUlkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoZnJhbWVJZCk7XG4gICAgZnJhbWVJZCA9IG51bGw7XG4gIH07XG5cbiAgcmV0dXJuIHdyYXBwZXJGbjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJhZlNjaGQ7XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/raf-schd@4.0.3/node_modules/raf-schd/dist/raf-schd.esm.js\n");

/***/ })

};
;