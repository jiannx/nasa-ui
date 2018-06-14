# 定时器控件

|       参数      |                  说明                  |   类型   |                                         默认值                                          |
|-----------------|----------------------------------------|----------|-----------------------------------------------------------------------------------------|
| className       | 样式名                                 | String   | ''                                                                                      |
| style           | 样式                                   | Object   | null                                                                                    |
| interval        | 定时多久后进行执行，单位秒             | number   | 600                                                                                     |
| space           | 间隔多久校验一次，单位秒               | number   | 1                                                                                       |
| render          | 每次校验时执行函数，参数为倒计时字符串 | Function | (time, second, interval) => `每${Math.round(interval / 60)}分钟更新一次，${time}后更新` |
| onTrigger       | 倒计时最后执行函数                     | Function | null                                                                                    |
| repeat          | 是否循环                               | bool     | true                                                                                    |
| countdownFormat | 倒计时格式化                           | String   | 'mm:ss'                                                                                 |                                                                                     |

## 基本使用

```jsx
import { Interval } from 'nasa-ui';

<Interval ></Interval>

<Interval interval={60}></Interval>

<Interval 
  interval={10} 
  countdownFormat="mm:ss" 
  repeat={true} 
  render={time => time} 
  onTrigger={() => console.log('Interval next repeat')}
/>

<Interval countdownFormat="mm--ss"></Interval>
```