var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { Tabs } from 'antd';
import _ from 'lodash';
import TestDynamicView from './TestDynamicView.jsx';
import TestCopyTextToClipboard from './TestCopyTextToClipboard.jsx';
import TestModalEx from './TestModalEx.jsx';
import TestFormEx from './TestFormEx.jsx';
import TestDynamicFormEx2 from './TestDynamicFormEx2.jsx';

var TabPane = Tabs.TabPane;

var Test = function (_Component) {
  _inherits(Test, _Component);

  function Test(props) {
    _classCallCheck(this, Test);

    var _this = _possibleConstructorReturn(this, (Test.__proto__ || Object.getPrototypeOf(Test)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(Test, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { style: { padding: '20px', overflow: 'auto' } },
        React.createElement(
          'h1',
          null,
          'Components Test'
        ),
        React.createElement('br', null),
        React.createElement(
          Tabs,
          {
            defaultActiveKey: 'TestDynamicFormEx2',
            tabPosition: 'left',
            style: { minHeight: 800 }
          },
          React.createElement(
            TabPane,
            { tab: 'DynamicView', key: '1' },
            React.createElement(TestDynamicView, null)
          ),
          React.createElement(
            TabPane,
            { tab: 'CopyTextToClipboard', key: '2' },
            React.createElement(TestCopyTextToClipboard, null)
          ),
          React.createElement(
            TabPane,
            { tab: 'ModalEx', key: 'ModalEx' },
            React.createElement(TestModalEx, null)
          ),
          React.createElement(
            TabPane,
            { tab: 'FormEx2', key: 'FormEx2' },
            React.createElement(TestFormEx, null)
          ),
          React.createElement(
            TabPane,
            { tab: 'TestDynamicFormEx2', key: 'TestDynamicFormEx2' },
            React.createElement(TestDynamicFormEx2, null)
          )
        )
      );
    }
  }]);

  return Test;
}(Component);

Test.defaultProps = {};
export default Test;
//# sourceMappingURL=index.js.map