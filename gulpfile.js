const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')

function buildTypeScript(project, dest) {
  let tsProject = ts.createProject(project)
  let tsResult = tsProject.src().pipe(tsProject())

  return tsResult.js.pipe(gulp.dest(dest));
}

gulp.task('client sourcemaps', () => {
  return gulp.src('./app/js/client/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/js/client'))
})

gulp.task('server sourcemaps', () => {
  return gulp.src('./app/js/server/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.mapSources((sourcePath, file) => '../../../resources/typescript/server/' + sourcePath.replace(/\.js$/, '.ts')))
    .pipe(sourcemaps.identityMap())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./app/js/server'))
})

gulp.task('client', () => buildTypeScript('./resources/typescript/client/tsconfig.json', './app/js/client').on('end', () => gulp.start('client sourcemaps')))
gulp.task('server', () => buildTypeScript('./resources/typescript/server/tsconfig.json', './app/js/server').on('end', () => gulp.start('server sourcemaps')))

gulp.task('sass', () => {
  return gulp.src('./resources/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'));
})

gulp.task('copy pug', () => gulp.src('./resources/views/**/*.pug').pipe(gulp.dest('./app/views')))
gulp.task('copy assets', () => gulp.src('./resources/assets/**/*').pipe(gulp.dest('./app/assets')))

gulp.task('build', ['client', 'server', 'sass', 'copy pug', 'copy assets'], () => {
  gulp.watch('./resources/typescript/client/**/*', ['client'])
  gulp.watch('./resources/typescript/server/**/*', ['server'])
  gulp.watch('./resources/views/**/*.pug', ['copy pug'])
  gulp.watch('./resources/assets/**/*', ['copy assets'])
})