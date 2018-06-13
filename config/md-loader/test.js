const path = require('path')
const webpack = require('webpack')

const testFixture = (fixture, options = {}) => {
  const fileName = `./${fixture}`

  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js'
    },
    node: {
      fs: 'empty'
    },
    module: {
      rules: [{
        test: /\.md?$/,
        use: [
          {
            loader: path.resolve(__dirname, '../md-loader')
          }
        ]
      }]
    }
  })

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err)

      const module = stats.toJson().modules.find(m => m.name === fileName)

      resolve(module)
    })
  })
}

// test('it loads markdown and returns a component', async() => {
testFixture('test.md')
// })