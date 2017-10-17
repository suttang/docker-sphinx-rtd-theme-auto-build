const gulp = require('gulp')
const { spawn } = require('child_process')
const browsersync = require('browser-sync').create()

const buildCommand = process.env.BUILD
                || `docker run --rm -t -v ${__dirname}/documents:/documents suttang/sphinx-rtd-theme`

gulp.task('browser-sync', () => {
    browsersync.init({
        server: {
            baseDir: './documents/build',
        }
    })
})

gulp.task('html', (cb) => {
    const [command, ...options] = buildCommand.split(' ')
    const build = spawn(...[command, options])

    build.stdout.on('data', (data) => {
        process.stdout.write(`${data}`);
    })
    build.stderr.on('data', (data) => {
        process.stdout.write(`${data}`);
    })
    build.on('close', (code) => {
        browsersync.reload()
        cb()
    })
})

gulp.task('watch', () => {
    gulp.watch('documents/source/**/*', ['html'])
})

gulp.task('default', ['browser-sync', 'html', 'watch'])
