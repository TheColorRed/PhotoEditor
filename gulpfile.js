const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const rimraf = require('rimraf')

function buildTypeScript(project, dest) {
  let tsProject = ts.createProject(project)
  let tsResult = tsProject.src().pipe(tsProject())
  return tsResult.js.pipe(gulp.dest(dest));
}

gulp.task('sourcemaps', () => {
  return gulp.src('./app/js/*(api|client|plugins)/**/*.js', { base: './' })
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./'))
})

gulp.task('server sourcemaps', () => {
  return gulp.src('./app/js/server/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.mapSources((sourcePath, file) => '../../../resources/typescript/server/' + sourcePath.replace(/\.js$/, '.ts')))
    .pipe(sourcemaps.identityMap())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./app/js/server'))
})

gulp.task('typescript', () => buildTypeScript('./resources/typescript/tsconfig.json', './app/js')
  .on('end', () => gulp.start(['sourcemaps', 'server sourcemaps'])))

gulp.task('sass', () => {
  return gulp.src('./resources/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'));
})

gulp.task('copy pug', () => gulp.src('./resources/views/**/*.pug').pipe(gulp.dest('./app/views')))
gulp.task('copy assets', () => gulp.src('./resources/assets/**/*').pipe(gulp.dest('./app/assets')))

gulp.task('build', ['typescript', 'sass', 'copy pug', 'copy assets'], () => {
  gulp.watch('./resources/typescript/**/*', ['typescript'])
  gulp.watch('./resources/views/**/*.pug', ['copy pug'])
  gulp.watch('./resources/assets/**/*', ['copy assets'])
  gulp.watch('./resources/sass/**/*.scss', ['sass'])
})

gulp.task('clean', () => {
  rimraf('./app', (err) => {
    if (err) return console.error(err)
    gulp.start(['typescript', 'sass', 'copy pug', 'copy assets'])
  })
})