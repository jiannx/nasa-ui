var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 定时器

 <Interval onTrigger={()=> console.log('Interval Trigger')} />

 <Interval 
  interval={60} 
  space={2} 
  render={(time, second) => `自定义显示:${time}，秒：${second}`} 
  repeat={false}
  onTrigger={()=> console.log('Interval Trigger')}
 />
 */
import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';

var Interval = function (_Component) {
  _inherits(Interval, _Component);

  function Interval(props) {
    _classCallCheck(this, Interval);

    var _this = _possibleConstructorReturn(this, (Interval.__proto__ || Object.getPrototypeOf(Interval)).call(this, props));

    _this.setText = function (time, second) {
      var text = '';
      if (_this.props.render) {
        text = _this.props.render(time, second);
      } else {
        text = '\u6BCF' + Math.round(_this.props.interval / 60) + '\u5206\u949F\u66F4\u65B0\u4E00\u6B21\uFF0C' + time + '\u540E\u66F4\u65B0';
      }
      _this.setState({ text: text });
    };

    _this.state = {
      text: ''
    };
    return _this;
  }

  _createClass(Interval, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.lastUpdate = moment();
      var countdownSecond = this.props.interval - (moment().unix() - this.lastUpdate.unix());
      var countdown = moment({ minute: countdownSecond / 60, second: countdownSecond % 60 });
      this.setText(countdown.format(this.props.countdownFormat), countdownSecond);

      this.interval = setInterval(function () {
        var countdownSecond = _this2.props.interval - (moment().unix() - _this2.lastUpdate.unix());
        var countdown = moment({ minute: countdownSecond / 60, second: countdownSecond % 60 });
        _this2.setText(countdown.format(_this2.props.countdownFormat), countdownSecond);
        if (countdownSecond <= 0) {
          _this2.lastUpdate = moment();
          _this2.props.onTrigger && _this2.props.onTrigger();
          // 移除定时器
          if (_this2.props.repeat === false) {
            clearInterval(_this2.interval);
          }
        }
      }, this.props.space * 1000);
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
        this.state.text
      );
    }
  }]);

  return Interval;
}(Component);

Interval.defaultProps = {
  className: null,
  style: null,
  interval: 600, // 定时多久后进行校验 默认10分钟
  space: 1, // 间隔多久校验一次，默认1秒
  render: null, // 每次校验时执行函数，参数为倒计时字符串 (time, second) => time
  onTrigger: null, // 倒计时最后执行函数
  repeat: true, // 是否循环
  countdownFormat: 'mm:ss' // 倒计时格式化
};


export default Interval;
//# sourceMappingURL=Interval.js.map