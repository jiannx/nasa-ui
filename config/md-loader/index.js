const { getOptions } = require('loader-utils')
const mdx = require('@mdx-js/mdx')

module.exports = async function(content) {
  const callback = this.async()
  const options = getOptions(this)

  let regex = /```jsx[\s\S]*?```/g

  let jsxList = content.match(regex);
  let mdList = content.split(regex);


  jsxList = jsxList.map(x => x.replace(/```jsx|```/g, ''));

  const jsxRes = []
  jsxList.forEach(async(x) => {
    let res = await mdx(x, options || {});
    jsxRes.push(res);
  });

  // 无效代码，为了让上面awaite执行
  await mdx(jsxRes[0], options || {});

  console.log(mdList);
  console.log(jsxList);
  console.log(jsxRes);

  const result = await mdx(content, options || {})


  console.log(result);

  const code = `
  import React from 'react'
  import { MDXTag } from '@mdx-js/tag'
  ${result}
  `

  return callback(null, code)
}