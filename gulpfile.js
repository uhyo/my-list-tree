'use strict';
const path = require('path');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const gulpChanged = require('gulp-changed');
const merge2 = require('merge2');
// TypeScript
const gulpTS = require('gulp-typescript');
const gulpTSlint = require('gulp-tslint');
const typescript = require('typescript');
// Rollup
const rollup = require('rollup');
const rollupStream = require('rollup-stream');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const del = require('del');
const rollupPluginNodeResolve = require('rollup-plugin-node-resolve');
const gulpUglify = require('gulp-uglify');
const gulpClone = require('gulp-clone');
const gulpRename = require('gulp-rename');

const LIB_DIR = "lib/";
const TS_DIST_LIB = "dist-es2015/";
const DIST_DECLARATION = "dist-typing/";
const DIST_LIB = "dist/";
const BUNDLE_MODULE_NAME = "MyListTree";
const BUNDLE_NAME = "my-list-tree.js";

const PRODUCTION = process.env.NODE_ENV === 'production';

{
  const tsProj = gulpTS.createProject('tsconfig.json', {
    typescript,
  });
  gulp.task('tsc', ()=>{
    const rs = gulp.src(path.join(LIB_DIR, '**', '*.ts{,x}'))
    .pipe(sourcemaps.init())
    .pipe(tsProj());

    if (DIST_DECLARATION){
      return merge2(
        rs.js.pipe(sourcemaps.write()).pipe(gulp.dest(TS_DIST_LIB)),
        rs.dts.pipe(gulp.dest(DIST_DECLARATION))
      );
    }else{
      return rs.js.pipe(sourcemaps.write()).pipe(gulp.dest(TS_DIST_LIB));
    }
  });
  gulp.task('watch-tsc', ['tsc'], ()=>{
    gulp.watch(path.join(LIB_DIR, '**', '*.ts{,x}'), ['tsc']);
  });
  gulp.task('tslint', ()=>{
    return gulp.src(path.join(LIB_DIR, '**', '*.ts{,x}'))
    .pipe(gulpTSlint({
      formatter: 'verbose',
    }))
    .pipe(gulpTSlint.report());
  });
  gulp.task('watch-tslint', ['tslint'], ()=>{
    gulp.watch(path.join(LIB_DIR, '**', '*.ts{,x}'), ['tslint']);
  });
}
{
  let rollupCache;
  function runRollup(){
    const result = rollupStream({
      input: path.join(TS_DIST_LIB, 'index.js'),
      format: 'umd',
      name: BUNDLE_MODULE_NAME,
      sourcemap: 'inline',
      rollup,
      cache: rollupCache,
      plugins: [
        rollupPluginNodeResolve(),
      ],
    })
    .on('bundle', bundle=> rollupCache = bundle)
    .pipe(source(BUNDLE_NAME));

    if (PRODUCTION){
      const min = result.pipe(gulpClone())
      .pipe(gulpRename(path=>{
        path.extname = '.min' + path.extname;
      }))
      .pipe(buffer())
      .pipe(gulpUglify())
      .pipe(gulp.dest(DIST_LIB));
      const normal = result
      .pipe(gulp.dest(DIST_LIB));
      return merge2(min, normal);
    }
    return result.pipe(gulp.dest(DIST_LIB));
  }
  gulp.task('bundle-main', ()=>{
    return runRollup();
  });
  gulp.task('bundle', ['tsc'], ()=>{
    return runRollup();
  });
  gulp.task('watch-bundle', ['bundle'], ()=>{
    gulp.watch(path.join(TS_DIST_LIB, '**', '*.js'), ['bundle-main']);
  });
}
{
  gulp.task('clean', ()=>{
    const del_target = [DIST_LIB, TS_DIST_LIB];
    if (DIST_DECLARATION){
      del_target.push(DIST_DECLARATION);
    }
    return del(del_target);
  });
}
gulp.task('default', ['tsc', 'tslint', 'bundle']);
gulp.task('watch', ['watch-tsc', 'watch-tslint', 'watch-bundle']);
