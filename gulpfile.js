const publicPath = "public";
const source = "sourse";
const destSprite = "../_sprite.scss";

import pkg from "gulp";
const {src, dest, parallel, series, watch, lastRun} = pkg;

import {deleteAsync} from "del";
import pug from "gulp-pug";
import notify from "gulp-notify";
import svgmin from "gulp-svgmin";
import cheerio from "gulp-cheerio";
import replace from "gulp-replace";
import svgSprite from "gulp-svg-sprite";
import npmDist from "gulp-npm-dist";
import rename from "gulp-rename";
import gulpSass from "gulp-sass";
import sassGlob from "gulp-sass-glob";
import * as dartSass from "sass";
const sass = gulpSass(dartSass);
import tabify from "gulp-tabify";
import gcmq from "postcss-sort-media-queries";
import browserSync from "browser-sync";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import nested from "postcss-nested";
import pscss from "postcss-scss";
import plumber from "gulp-plumber";
import data from "gulp-data";
import fs from "node:fs";
import {spawn} from "node:child_process";
import imagemin, {mozjpeg} from "gulp-imagemin";
import imageminPngquant from "imagemin-pngquant";
import webp from "gulp-webp";

// Content is read per-task in data() callback; no top-level cache needed.

// Paths config
const imgSource = `${source}/img/**/*.{jpg,jpeg,png}`;
const imgDest = `${publicPath}/img`;

class gs {
	static browsersync() {
		browserSync.init({
			server: {
				baseDir: "./" + publicPath,
				serveStaticOptions: {
					extensions: ["html"],
				},
			},
		});
	}

	static pugFiles() {
		return src([source + "/pug/pages/**/*.pug"])
			.pipe(
				data(function (file) {
					return JSON.parse(fs.readFileSync(source + "/pug/content.json"));
				})
			)
			.pipe(
				pug({
					pretty: true,
					cache: true,
				}).on("error", notify.onError())
			)
			.pipe(tabify(2, true))
			.pipe(dest(publicPath))
			.on("end", browserSync.reload);
	}

	static cleanLibs() {
		return deleteAsync([publicPath + "/libs"]);
	}

	static copyLibs() {
		return src(
			npmDist({
				copyUnminified: true,
				excludes: [
					"src/**/*",
					"./@babel/*",
					"animate.css/source/",
					"inputmask/inputmask/",
					"inputmask/bindings",
					"source",
					"./babel*/*",
					"./gulp*",
					"swiper/components",
					"swiper/angular",
					"swiper/react",
					"swiper/svelte",
					"swiper/cjs",
					"swiper/bundle",
					"swiper/vue",
					"swiper/modules",
					"swiper/shared",
					"swiper/types",
					"examples",
					"example",
					"node_modules",
					"core",
					"demo/**/*",
					"spec/**/*",
					"docs/**/*",
					"tests/**/*",
					"test/**/*",
					"Gruntfile.js",
					"gulpfile.js",
					"package.json",
					"package-lock.json",
					"bower.json",
					"composer.json",
					"yarn.lock",
					"webpack.config.js",
					"README",
					"LICENSE",
					"CHANGELOG",
					"*.yml",
					"*.md",
					"*.coffee",
					"*.ts",
					"*.less",
				],
			}),
			{base: "./node_modules"}
		)
			.pipe(
				rename(function (path) {
					path.dirname = path.dirname
						.replace(/\/dist/, "")
						.replace(/\\dist/, "");
				})
			)
			.pipe(dest(publicPath + "/libs"));
	}

	static ensureLibs(done) {
		const hasLibs =
			fs.existsSync(publicPath + "/libs") &&
			fs.readdirSync(publicPath + "/libs").length > 0;
		if (hasLibs) {
			done();
			return;
		}
		return gs.copyLibs();
	}

	static watchStyle(file) {
		const processors = [autoprefixer(), nested(), cssnano(), gcmq()];
		return src(source + `/sass/${file}.scss`)
			.pipe(sassGlob())
			.pipe(sass.sync().on("error", sass.logError))
			.pipe(postcss(processors, {syntax: pscss}))
			.pipe(rename({suffix: ".min", prefix: ""}))
			.pipe(dest(publicPath + "/css"))
			.pipe(browserSync.stream());
	}

	static styles() {
		const processors = [autoprefixer(), nested(), cssnano(), gcmq()];
		return src(source + `/sass/main.scss`)
			.pipe(sassGlob())
			.pipe(sass.sync().on("error", sass.logError))
			.pipe(postcss(processors, {syntax: pscss}))
			.pipe(rename({suffix: ".min", prefix: ""}))
			.pipe(dest(publicPath + "/css"))
			.pipe(browserSync.stream());
	}

	static bootstrapStyles() {
		const processors = [autoprefixer(), nested(), cssnano(), gcmq()];
		return src(source + `/sass/custom-bootstrap.scss`)
			.pipe(sass.sync().on("error", sass.logError))
			.pipe(postcss(processors, {syntax: pscss}))
			.pipe(rename({suffix: ".min", prefix: ""}))
			.pipe(dest(publicPath + "/css"))
			.pipe(browserSync.stream());
	}

	static commonJs() {
		return src([source + "/js/**/*.js"])
			.pipe(dest(publicPath + "/js"))
			.pipe(browserSync.stream());
	}

	static svg() {
		return src("./" + source + "/svg/*.svg")
			.pipe(plumber())
			.pipe(
				svgmin({
					js2svg: {
						pretty: true,
					},
				})
			)
			.pipe(
				cheerio({
					run: function ($) {
						$("[fill]").removeAttr("fill");
						$("[stroke]").removeAttr("stroke");
						$("[style]").removeAttr("style");
						$("[opacity]").removeAttr("opacity");
					},
					parserOptions: {xmlMode: true},
				})
			)
			.pipe(replace("&gt;", ">"))
			.pipe(
				svgSprite({
					shape: {
						dimension: {
							maxWidth: 500,
							maxHeight: 500,
						},
						spacing: {
							padding: 0,
						},
					},
					mode: {
						symbol: {
							sprite: "../sprite.svg",
							render: {
								scss: {
									template:
										"./" + source + "/sass/templates/_sprite_template.scss",
									dest: destSprite,
								},
							},
						},
					},
				})
			)
			.pipe(plumber.stop())
			.pipe(dest(`${source}/sass/`));
	}

	static svgCopy() {
		return src(`${source}/sass/sprite.svg`)
			.pipe(plumber())
			.pipe(dest(`${publicPath}/img/svg/`));
	}

	// sourse/img (raster, SVG excluded — that goes through the sprite pipeline)
	// → optimized same-format copy in public/img. Reads from sourse, never
	// re-compresses in place, so quality does not degrade across builds.
	// IMPORTANT: never del public/img — the shop's real images live there.
	static optimizeImages() {
		return src(imgSource, {encoding: false, since: lastRun(gs.optimizeImages)})
			.pipe(plumber())
			.pipe(
				imagemin([
					mozjpeg({quality: 80, progressive: true}),
					imageminPngquant({quality: [0.6, 0.8], strip: true}),
				])
			)
			.pipe(dest(imgDest));
	}

	// One .webp per raster source image (single size, no responsive variants).
	static makeWebp() {
		return src(imgSource, {encoding: false, since: lastRun(gs.makeWebp)})
			.pipe(plumber())
			.pipe(webp({quality: 80}))
			.pipe(dest(imgDest));
	}

	// Validate authored HTML pages. Excludes non-UTF-8 legacy exports (if any).
	// Fail-gate: exits non-zero on any html-validate error.
	static validateHtml(done) {
		const proc = spawn(
			`npx html-validate ` +
				`"${publicPath}/*.html" ` +
				`"${publicPath}/modal/**/*.html" ` +
				`"${publicPath}/parts/**/*.html"`,
			{
				stdio: "inherit",
				shell: true,
			}
		);
		proc.on("error", err => done(err));
		proc.on("close", code => {
			done(
				code === 0
					? undefined
					: new Error(`html-validate found errors (exit ${code})`)
			);
		});
	}

	static startwatch() {
		watch(
			[
				source + "/sass/**/*.css",
				source + "/sass/**/*.scss",
				`!${source}/sass/custom-bootstrap.scss`,
				source + "/sass/**/*.sass",
				`${source}/pug/blocks/**/*.scss`,
			],
			{usePolling: true},
			gs.styles
		);
		watch(
			[
				source + "/sass/**/*.css",
				source + "/sass/**/*.scss",
				`!${source}/sass/_base.scss`,
				`!${source}/sass/_root.scss`,
				`!${source}/sass/_fonts.scss`,
				source + "/sass/**/*.sass",
			],
			{usePolling: true},
			gs.bootstrapStyles
		);
		watch(
			[source + "/pug/**/*.pug", source + "/pug/content.json"],
			{usePolling: true},
			gs.pugFiles
		);
		watch(source + "/svg/*.svg", {usePolling: true}, gs.svg);
		watch(source + "/sass/*.svg", {usePolling: true}, gs.svgCopy);
		watch([source + "/js/*.js"], {usePolling: true}, gs.commonJs);
		watch(imgSource, {usePolling: true}, gs.images);
	}
}

gs.images = parallel(gs.optimizeImages, gs.makeWebp);

export const libs = series(gs.cleanLibs, gs.copyLibs);
export const sprite = series(gs.svg, gs.svgCopy);
export const styles = parallel(gs.bootstrapStyles, gs.styles);
export const images = gs.images;
export const validate = gs.validateHtml;

export const build = series(
	gs.commonJs,
	libs,
	styles,
	parallel(sprite),
	gs.images,
	gs.pugFiles,
	gs.validateHtml
);

export default series(
	gs.commonJs,
	gs.ensureLibs,
	styles,
	parallel(sprite),
	gs.images,
	gs.pugFiles,
	parallel(gs.browsersync, gs.startwatch)
);
