const webpack = require('webpack');
const writeFilePlugin = require('write-file-webpack-plugin');
const webpackMerge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const path = require('path');
const sass = require('sass');

const utils = require('./utils.js');
const commonConfig = require('./webpack.common.js');

const ENV = 'development';

module.exports = (options) => webpackMerge(commonConfig({
  env: ENV
}), {
  devtool: 'eval-source-map',

  devServer: {
    disableHostCheck: true,
    contentBase: './build/resources/main/static/',
    proxy: [
      {
        context: [
          '/api',
          '/management',
          '/swagger-resources',
          '/v2/api-docs',
          '/h2-console',
          '/auth',
          '/showTei',
          '/showTeiAsHtml',
          '/loading',
        ],
        target: `http${options.tls ? 's' : ''}://localhost:8081`,
        secure: false,
        changeOrigin: options.tls,
        headers: {
          Connection: 'keep-alive'
        }
      },
      {
        context: ['/repositories/dhPLUS'], // GraphDB
        target: `http${options.tls ? 's' : ''}://localhost:7200`,
        secure: false,
        changeOrigin: options.tls,
        logLevel: 'debug',
        headers: {
                   Connection: 'keep-alive'
            }
      }, 
      {
        context: ['/services/rest/api'],
        target: `http${options.tls ? 's' : ''}://localhost:8081`,
        pathRewrite: {'^/services/rest' : ''},
        secure: false,
        changeOrigin: options.tls
      },
      {
        context: ['/services/rdf/api'],
        target: `http${options.tls ? 's' : ''}://localhost:8081`,
        pathRewrite: {'^/services/rdf' : ''},
        secure: false,
        changeOrigin: options.tls
      },
      {
        context: ['/services/xq/api'],
        target: `http${options.tls ? 's' : ''}://localhost:8081`,
        pathRewrite: {
          '^/services/xq/api': ''
        },
        secure: false,
        changeOrigin: options.tls
      },
      {
        context: ['/services/**'],
        target: `http${options.tls ? 's' : ''}://localhost:8081`,
        secure: false,
        changeOrigin: options.tls
      }
    ],
    stats: options.stats,
    watchOptions: {
      ignored: /node_modules/
    },
    https: options.tls,
    historyApiFallback: true
  },

  entry: {
    polyfills: './src/app/polyfills',
    global: './src/content/scss/global.scss',
    main: './src/app/app.main'
  },
  output: {
    path: utils.root('build/resources/main/static/'),
    filename: 'app/[name].bundle.js',
    chunkFilename: 'app/[id].chunk.js'
  },
  module: {
    rules: [{
        test: /\.(j|t)s$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.([cm]?ts|tsx)$/,
        use: [
          'angular2-template-loader',
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve('build/cache-loader')
            }
          },
          {
            loader: 'thread-loader',
            options: {
              // There should be 1 cpu for the fork-ts-checker-webpack-plugin.
              // The value may need to be adjusted (e.g. to 1) in some CI environments,
              // as cpus() may report more cores than what are available to the build.
              workers: require('os').cpus().length - 1
            }
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: true
            }
          }
        ],
        exclude: /(node_modules)/
      },
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', {
          loader: 'sass-loader',
          options: {
            implementation: sass
          }
        }],
        exclude: /(vendor\.scss|global\.scss)/
      },
      {
        test: /(vendor\.scss|global\.scss)/,
        use: ['style-loader', 'css-loader', 'postcss-loader', {
          loader: 'sass-loader',
          options: {
            implementation: sass
          }
        }]
      }
    ]
  },
  stats: process.env.JHI_DISABLE_WEBPACK_LOGS ? 'none' : options.stats,
  plugins: [
    process.env.JHI_DISABLE_WEBPACK_LOGS ?
    null :
    new SimpleProgressWebpackPlugin({
      format: options.stats === 'minimal' ? 'compact' : 'expanded'
    }),
    new FriendlyErrorsWebpackPlugin(),
    new BrowserSyncPlugin({
      https: options.tls,
      host: 'localhost',
      port: 9000,
      proxy: {
        target: `http${options.tls ? 's' : ''}://localhost:9066`,
        proxyOptions: {
          changeOrigin: false //pass the Host header to the backend unchanged  https://github.com/Browsersync/browser-sync/issues/430
        }
      },
      socket: {
        clients: {
          heartbeatTimeout: 60000
        }
      }
    }, {
      reload: false
    }), 
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)/,
      path.resolve(__dirname, './src/')
    ),
    new writeFilePlugin(),
    new webpack.WatchIgnorePlugin([
      utils.root('src/test'),
    ]),
    new WebpackNotifierPlugin({
      title: 'JHipster',
      contentImage: path.join(__dirname, 'logo-jhipster.png')
    }) 
  ].filter(Boolean),
  mode: 'development'
});
