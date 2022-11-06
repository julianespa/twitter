"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var configuration = require('../../config.js');

var debug = configuration.debugMode;

var APIInvoker =
/*#__PURE__*/
function () {
  function APIInvoker() {
    _classCallCheck(this, APIInvoker);
  }

  _createClass(APIInvoker, [{
    key: "getAPIHeader",
    value: function getAPIHeader() {
      return {
        'Content-Type': 'application/json',
        authorization: window.localStorage.getItem('token')
      };
    }
  }, {
    key: "invokeGET",
    value: function invokeGET(url, okCallback, failCallback) {
      var params = {
        method: 'get',
        headers: this.getAPIHeader()
      };
      this.invoke(url, okCallback, failCallback, params);
    }
  }, {
    key: "invokePUT",
    value: function invokePUT(url, body, okCallback, failCallback) {
      var params = {
        method: 'put',
        headers: this.getAPIHeader(),
        body: JSON.stringify(body)
      };
      this.invoke(url, okCallback, failCallback, params);
    }
  }, {
    key: "invokePOST",
    value: function invokePOST(url, body, okCallback, failCallback) {
      var params = {
        method: 'post',
        headers: this.getAPIHeader(),
        body: JSON.stringify(body)
      };
      this.invoke(url, okCallback, failCallback, params);
    }
  }, {
    key: "invoke",
    value: function invoke(url, okCallback, failCallback, params) {
      if (debug) {
        console.log('invoke =>' + params.method + ':' + url);
        console.log(params.body);
      }

      fetch("".concat(configuration.api.host).concat(url)).then(function (response) {
        if (debug) {
          console.log('Invoke Response =>');
          console.log(response);
        }

        return response.json();
      }).then(function (responseData) {
        if (responseData.ok) {
          okCallback(responseData);
        } else {
          failCallback(responseData);
        }
      });
    }
  }]);

  return APIInvoker;
}();

var _default = new APIInvoker();

exports["default"] = _default;