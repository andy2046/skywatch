const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const env = process.env.NODE_ENV || 'development'

module.exports = {
  entry: __dirname + '/src/index.js',
  target: 'web',
  output: {
    path: __dirname + '/dist',
    filename: 'skywatch.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /jquery[\\\/]src[\\\/]selector\.js$/,
        use: {
          loader: "amd-define-factory-patcher-loader"
        }
      },
      {
        test: /\.js$/,
        include: __dirname + '/src',
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env)
      }
    }),
    new UglifyJSPlugin({
       sourceMap: true,
       uglifyOptions: { ecma: 8 }
    })
  ]
}
