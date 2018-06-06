# 数据获取组件

参数 | 说明 | 类型 | 默认值   
  -  |  -   |  -   |   - 
api | Api请求接口，必须为Promise对象 | Promise | 必填，null
history | 请求参数, 变更此数组，强制刷新 | array[Object] | []
params | 请求参数, 优先级高于history | Object | []
cacheKey | 定义该字段时，将进行本地缓存，当history中最后一个对象+params+cacheKey这几个都未变更时，接口不发起 | String | null
onResponse | 返回接口处理 | 响应的数据将解构作为component组件的props | Function | res => ({ data: res }), 默认会添加data属性
component | 被包元素 | React Element | null
onLoadingChange | 加载状态变更事件 | Function | null