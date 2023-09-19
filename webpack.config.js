module.exports = {
    entry: './index.js',
    output: {
      filename: 'bundle.js',
      library: 'MapModule'
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          }
        ]
      }
  };