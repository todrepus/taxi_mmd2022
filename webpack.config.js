const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");



/*
entry : 모듈 진입점
index.js <-  (a.js, b.js, c.js) 인 경우, index.js만 추가하면, a.js, b.js, c.js의 변경에 대해서도 반응함.

새로운 웹페이지를 등록하려면,
plugins = [...., new CopyWebpackPlugin([{from:"", to:""}])] 로 등록하면됨.
*/
module.exports = {
  entry: {
    "session": "./src/js/session.js",
    "user": "./src/js/user.js",
    "admin": "./src/js/admin.js",
    "reserv": "./src/js/reserv.js",
    "map" : "./src/js/map.js",
    "call" : "./src/js/call.js",
    "payment" : "./src/js/payment.js",
    "entry" : "./src/js/entry.js"
  },
  mode: 'development',
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, 'dist')   
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [   
    new webpack.DefinePlugin({
      DEPLOYED_ADDRESS: JSON.stringify(fs.readFileSync('deployedAddress', 'utf8').replace(/\n|\r/g, "")),
      DEPLOYED_ABI: fs.existsSync('deployedABI') && fs.readFileSync('deployedABI', 'utf8'),
    }),

    new CopyWebpackPlugin([{ from: "./src"}]),
   
  ],
  devServer: { 
    static: {
    // https://webpack.js.org/configuration/dev-server/#directory
    directory: path.join(__dirname, 'dist'),
    }, 
  compress: true
  },
  node: {
    fs:"empty"
  }
}