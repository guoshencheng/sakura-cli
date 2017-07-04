var gulp = require("gulp");
var path = require("path");
var qiniu = require("gulp-qiniu");
var wantu = require("gulp-wantu");

gulp.task("qiniu", function() {
  gulp.src(path.resolve(__dirname, "./public/dist/**")).pipe(qiniu({
    accessKey: "<accessKey>",
    secretKey: "<secretKey>",
    bucket: "<bucket>",
    private: false
  }, {
    dir: 'node_fiat/',
    version: false
  }));
});

gulp.task("wantu", function() {
  gulp.src(path.resolve(__dirname, "./public/dist/**")).pipe(wantu({
    AK: "<AK>",
    SK: "<SK>",
    namespace: "<namespace>"
  }, {
    dir: "/node_fiat"
  }))
})

gulp.task('upload', ['qiniu', 'wantu']);

module.exports = gulp;
