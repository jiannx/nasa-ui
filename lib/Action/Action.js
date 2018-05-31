var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import _ from 'lodash';

var Action = function (_Component) {
  _inherits(Action, _Component);

  function Action(props) {
    _classCallCheck(this, Action);

    var _this = _possibleConstructorReturn(this, (Action.__proto__ || Object.getPrototypeOf(Action)).call(this, props));

    _this.setAction = function () {
      _this.setState({
        view: _this.state.frame[_this.frameIndex % _this.state.frame.length]
      });
      _this.frameIndex += 1;
    };

    var frame = props.frame;
    if (_.isString(frame)) {
      frame = frame.split('');
      var str = '';
      frame = frame.map(function (x, index) {
        str += x;
        return str;
      });
    }
    _this.state = {
      frame: frame
    };
    return _this;
  }

  _createClass(Action, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.frameIndex = 0;
      this.setAction();
      this.interval = setInterval(this.setAction, this.props.timeSpace * 1000);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearInterval(this.interval);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'span',
        { className: this.props.className, style: this.props.style },
        this.state.view
      );
    }
  }]);

  return Action;
}(Component);

Action.defaultProps = {
  frame: [],
  timeSpace: 1
};
export default Action;
//# sourceMappingURL=Action.js.map