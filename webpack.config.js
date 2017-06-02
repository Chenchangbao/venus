var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var WebpackDevServer = require("webpack-dev-server");
var nodeEnvironment = process.env.NODE_ENV;
var config = {};

// entry
config.entry = {
  vendor: [
    'jquery/dist/jquery',
    'babel-polyfill',
    'admin-lte/bootstrap/js/bootstrap',
    'admin-lte/dist/js/app'
  ],
  ng: [
    'angular',
    'angular-sanitize',
    'ui-router',
    'ui-router/release/ng1/stateEvents',
    'angular-file-upload'
  ],
  app: [
    'main.js'
  ]
};
// config.entry.app.unshift("webpack-dev-server/client?http://localhost:8888/", "webpack/hot/dev-server");

// output
config.output = {
  filename: '[name].bundle.js',
  path: path.join(__dirname, "www"),
  publicPath: ''
};

// module
config.module = {
  loaders: [
    // {test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/},
    {
      test: /\.less$/,
      loader: 'style!css!less'
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    },
    {
      test: /\.(eot(\?.*)?|woff(\?.*)?|ttf(\?.*)?|svg(\?.*)?|woff2(\?.*)?)$/,
      loader: "file?limit=1024&name=fonts/[name].[ext]"
    },
    {
      test: /\.(md|markdown)$/,
      loader: "html!markdown"
    },
    {
      test: /\.html/,
      exclude: /(node_modules)/,
      loader: 'html-loader'
    },
    {
      test: /\.(png|jpg)$/,
      loader: 'url?name=images/[name].[ext]'
    },
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
        plugins: ['transform-decorators-legacy'],
        presets: ['es2015']
      }
    }
    // {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
  ]
};

// plugins
config.plugins = [
  //new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'INCLUDE_ALL_MODULES': function includeAllModulesGlobalFn(modulesArray, application) {
      modulesArray.forEach(function executeModuleIncludesFn(moduleFn) {
        moduleFn(application);
      });
    },
    ENVIRONMENT: JSON.stringify(nodeEnvironment)
  }),
  new CopyWebpackPlugin([{
    from: './src',
    to: './'
  }], {
    ignore: ['*.js', 'index.html']
  }),
  new CopyWebpackPlugin([{
    from: './src/lib',
    to: './lib'
  }]),
  new ngAnnotatePlugin({
    add: true
  }),
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"
  }),
  new webpack.ProvidePlugin({
    echarts: "echarts",
    "window.echarts": "echarts"
  }),
  new ExtractTextPlugin('[name].css', {
    allChunks: true
  }),
  new HtmlWebpackPlugin({
    template: path.resolve('src', 'index.html'),
    filename: 'index.html',
    inject: 'body'
  }),
];

if ('test' !== nodeEnvironment) {
  config.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'ng',
      fileName: 'angular.js',
      minChunks: 3
    })
  );
}

// resolve
config.resolve = {
  root: [
    path.resolve('./src')
  ],
  extensions: ['', '.js', '.json', '.coffee'],
  modulesDirectories: ['node_modules', 'src']
};

// devtool
switch (nodeEnvironment) {
  case 'production':
    config.plugins.push(
      // new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin()
    );
    config.devtool = false;
    break;
  case 'development':
    config.plugins.push(
      // new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin()
    );
    config.devtool = 'eval';
    // config.devtool = 'cheap-module-eval-source-map';
    config.cache = true;

    // webpack-dev-server 1.14.x版本 服务器配置
    config.devServer = {
      port: 80,
      historyApiFallback: true,
      stats: {
        chunkModules: false,
        colors: true
      },
      proxy: [{
        path: /\/venus\//,
        target: 'http://mysit.cnsuning.com:8080/',
        secure: false
      }],
      contentBase: './src'
    };
    // end 1.14.x

    // webpack-dev-server 1.15.x版本 服务器配置
    // var compiler = webpack(config);
    // var server = new WebpackDevServer(compiler, {
    //   // contentBase: path.join(__dirname, 'src'),
    //   contentBase: './src',
    //   hot: true,
    //   historyApiFallback: true,
    //   stats: {
    //     chunkModules: false,
    //     colors: true
    //   },
    //   // compress: true,
    //   proxy: {
    //     "/blog/": "http://10.24.74.21:8080/"
    //     // proxy('**', {...}) matches any path, all requests will be proxied.
    //     // proxy('**/*.html', {...}) matches any path which ends with .html
    //     // proxy('/*.html', {...}) matches paths directly under path-absolute
    //     // proxy('/api/**/*.html', {...}) matches requests ending with .html in the path of /api
    //     // proxy(['/api/**', '/ajax/**'], {...}) combine multiple patterns
    //     // proxy(['/api/**', '!**/bad.json'], {...}) exclusion
    //   },
    //   setup: function (app) {
    //     // Here you can access the Express app object and add your own custom middleware to it.
    //     // For example, to define custom handlers for some paths:
    //     // app.get('/some/path', function(req, res) {
    //     //   res.json({ custom: 'response' });
    //     // });
    //   },
    // });
    // server.listen(8888, "localhost", function () {});
    // end 1.15.x
    break;
  case 'test':
    config.entry = {};
    config.devtool = 'eval';
    config.cache = true;
    break;
  default:
    console.warn('Unknown or Undefigned Node Environment. Please refer to package.json for available build commands.');
}

module.exports = config;