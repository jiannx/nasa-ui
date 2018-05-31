var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import _ from 'lodash';
import './CollapseEx.scss';

var CollapseEx = function (_Component) {
  _inherits(CollapseEx, _Component);

  function CollapseEx(props) {
    _classCallCheck(this, CollapseEx);

    var _this = _possibleConstructorReturn(this, (CollapseEx.__proto__ || Object.getPrototypeOf(CollapseEx)).call(this, props));

    _this.state = {
      active: props.active
    };
    return _this;
  }

  _createClass(CollapseEx, [{
    key: 'collapse',
    value: function collapse() {
      this.setState({ active: true });
    }
  }, {
    key: 'render',
    value: function render() {
      var style = {
        maxHeight: 200,
        overflow: 'auto'
      };
      style = Object.assign({}, style, this.props.style);

      var length = this.props.rows.length;
      var chunks = _.chunk(this.props.rows, this.props.num);
      return React.createElement(
        'div',
        { style: style },
        React.createElement(
          'div',
          null,
          !this.state.active && chunks[0] && chunks[0].map(function (row, index) {
            return React.createElement(
              'div',
              { key: index },
              row
            );
          }),
          this.state.active && this.props.rows.map(function (row, index) {
            return React.createElement(
              'div',
              { key: index },
              row
            );
          })
        ),
        !this.state.active && length > this.props.num && React.createElement(
          'a',
          { onClick: this.collapse.bind(this) },
          this.props.message
        )
      );
    }
  }]);

  return CollapseEx;
}(Component);

CollapseEx.defaultProps = {
  num: 5,
  rows: [],
  message: '查看全部域名'
};
export default CollapseEx;
//# sourceMappingURL=CollapseEx.js.map