import { src, dest, watch, series, parallel } from 'gulp';
import browserSync from "browser-sync";
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import yargs from 'yargs';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import imagemin from 'gulp-imagemin';
import del from 'del';
import rsync from "gulp-rsync"

const proxy = 'http://awtheme.local/'

const PRODUCTION = yargs.argv.prod;

export const styles = () => {
  const plugins = [
    require('tailwindcss'), 
    require("rfs")({
      baseValue: 16, // Default: 20 (which is 1.25rem)
      unit: "rem", // Default: rem
      breakpoint: 1280, // Default: 1200
      breakpointUnit: "px", // Default: px
      factor: 10, // Default: 10
      remValue: 16, // Default: 16
      twoDimensional: false, // Default: false
      class: false, // Default: false
      safariIframeResizeBugFix: false, // Default: false
      unitPrecision: 5, // Default: 5
      functionName: "rfs", // Default: rfs
      enableRfs: true, // Default: true
      mode: "min-media-query", // Default: min-media-query
    }), 
    require('postcss-import'),       
    require('autoprefixer'),       
  ]

  return src('src/css/bundle.css')
    .pipe(postcss(plugins))
    .pipe(dest('dist/css'))
    .pipe(server.stream());
}




export const scripts = () => {
  return src(['src/js/bundle.js'])
    .pipe(named())
    .pipe(webpack({
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: []
              }
            }
          }
        ]
      },
      mode: PRODUCTION ? 'production' : 'development',
      devtool: !PRODUCTION ? 'inline-source-map' : false,
      output: {
        filename: '[name].js'
      },
      externals: {
        jquery: 'jQuery'
      },
    }))
    .pipe(dest('dist/js'));
}


export const clean = () => {
  return del(['dist']);
}

export const copy = () => {
  return src(['src/**/*', '!src/{images,js,css}', '!src/{images,js,css}/**/*'])
    .pipe(dest('dist'));
}

export const images = () => {
  return src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(dest('dist/images'));
}

export const watchForChanges = () => {
  watch('src/css/**/*.css', series(styles, reload));
  watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', series(images, reload));
  watch(['src/**/*', '!src/{images,js,scss}', '!src/{images,js,scss}/**/*'], series(copy, reload));
  watch(['src/js/**/*.js', 'components/**/*.js'], series(scripts, reload));
  watch("**/*.php", series(styles, reload));
}

const server = browserSync.create();
export const serve = done => {
  server.init({
    proxy: proxy
  });
  done();
};
export const reload = done => {
  server.reload();
  done();
};

export const bundled = () => {
  return src([
      "**/*",
      "!node_modules{,/**}",
      "!bundled{,/**}",
      "!src{,/**}",
      "!.babelrc",
      "!.gitignore",
      "!gulpfile.babel.js",
      "!package.json",
      "!package-lock.json",
    ])

    .pipe(dest('bundled'));
  };


export const deploy = () => {
  return src('bundled/')
    .pipe(rsync({
      root: 'bundled/',
      hostname: 'promikl_evplus@promikl.beget.tech',
      destination: 'wp-content/themes/ev-theme/',      
      
      include: [],
      exclude: [ 
      '**/Thumbs.db',
      '**/*.DS_Store',
      "!node_modules{,/**}",
      "!bundled{,/**}" ],
      recursive: true,
      archive: true,
      silent: false,
      compress: true
    }))
};



export const dev = series(clean, parallel(styles, images, copy, scripts), serve, watchForChanges);
export const build = series(clean, parallel(styles, images, copy, scripts), bundled, deploy);
export default dev;

