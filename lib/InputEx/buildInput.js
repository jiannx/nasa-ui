var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Help workaround Chinese asynchronously input problem.
 * https://github.com/zhaoyao91/react-optimistic-input
 */

import React from 'react';

export default function (component) {
  return function (_React$Component) {
    _inherits(OptimisticInput, _React$Component);

    function OptimisticInput(props) {
      _classCallCheck(this, OptimisticInput);

      var _this = _possibleConstructorReturn(this, (OptimisticInput.__proto__ || Object.getPrototypeOf(OptimisticInput)).call(this, props));

      _this.state = {
        value: props.value
      };
      return _this;
    }

    _createClass(OptimisticInput, [{
      key: 'componentWillUpdate',
      value: function componentWillUpdate(nextProps, nextState) {
        if (nextProps.value !== this.props.value && nextProps.value !== nextState.value) {
          this.setState({ value: nextProps.value });
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return React.createElement(component, Object.assign({}, this.props, {
          value: this.state.value,
          onChange: this.onChange.bind(this)
        }));
      }
    }, {
      key: 'onChange',
      value: function onChange(e) {
        if (this.props.value === undefined) {
          this.setState({
            value: e.target.value
          });
        }
        this.props.onChange && this.props.onChange(e);
      }
    }]);

    return OptimisticInput;
  }(React.Component);
}
//# sourceMappingURL=buildInput.js.map