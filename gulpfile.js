var path = require('path');
var gulp = require('gulp');
var del = require('del');
var merge = require('merge2');
var ts = require('gulp-typescript');


gulp.task('clean', function () {
    return del([
    'server/',
    './app.js'
  ]);    
   
});


gulp.task('upgrade', function () {
    return del([
    'node_modules/phoenix-mongodb',
    'node_modules/phoenix-utils',
    'node_modules/phoenix-json-schema-tools'
  ]);    
   
});



gulp.task('ts', ['clean'], function () {
    var tsProject = ts.createProject(path.resolve('./src/tsconfig.json'));
    var tsResult = gulp.src(path.resolve('./src/**/*.ts')).pipe(ts(tsProject));
    return tsResult.js.pipe(gulp.dest(path.resolve('./')));
  
});


gulp.task('default', ['ts']);