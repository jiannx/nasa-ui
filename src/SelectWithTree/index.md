#  树形多选组件，必须为受控组件

|        参数       |                                                说明                                               |   类型   |         默认值         |
|-------------------|---------------------------------------------------------------------------------------------------|----------|------------------------|
| className         | 样式名                                                                                            | String   | ''                     |
| list              | 可选列表，可选菜单数据，必须为如下格式[{ title, key, children: [{ titile, key }, {title, key}] }] | Array    | null                   |
| value             | 选中的key值列表 ['key1', 'key2', 'key3']                                                          | List     | []                     |
| onChange          | 选中变更事件                                                                                      | Function | (selKeyList) => {}     |
| onAddClick        | 点击选择时事件，可在该事件中获取可选菜单                                                          | Function | null                   |
| defaultShowCount  | 菜单默认显示条目数                                                                                | Number   | 20                     |
| searchPlaceholder | 搜索框 Placeholder                                                                                | String   | '请输入关键词'         |
| addButton         | 添加按钮                                                                                          | String   | '+ 添加'               |
| noListDataText    | 可选菜单length=0显示                                                                              | String   | '没有可选择的项'       |
| placeholder       | 提示文本                                                                                          | String   | '请添加'               |
| searchNoMatchText | 搜索未匹配到时显示                                                                                | String   | '没有匹配项'           |
| nodeRender        | 节点渲染事件                                                                                      | Function | record => record.title |

