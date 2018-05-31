var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * https://github.com/chjj/marked
 */
import React, { Component } from 'react';
import axios from 'axios';
import marked from 'marked';

var MarkdownParser = function (_Component) {
  _inherits(MarkdownParser, _Component);

  function MarkdownParser(props) {
    _classCallCheck(this, MarkdownParser);

    var _this = _possibleConstructorReturn(this, (MarkdownParser.__proto__ || Object.getPrototypeOf(MarkdownParser)).call(this, props));

    _this.state = {
      html: ''
    };
    return _this;
  }

  _createClass(MarkdownParser, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.props.src) {
        axios(this.props.src).then(function (res) {
          var html = marked(res.data, _this2.props.options);
          _this2.setState({ html: html });
        });
      } else if (this.props.value) {
        var html = marked(this.props.value);
        this.setState({ html: html });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('div', { dangerouslySetInnerHTML: { __html: this.state.html } });
    }
  }]);

  return MarkdownParser;
}(Component);

MarkdownParser.defaultProps = {
  src: null,
  value: null,
  options: {}
};
export default MarkdownParser;
//# sourceMappingURL=index.js.map