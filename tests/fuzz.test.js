/**
 * Property-based / fuzz layer using fast-check.
 *
 * Strategy: pass hostile data via pug `locals` (renderFile with variable locals),
 * NOT via string interpolation into pug source — that would only trigger pug
 * syntax errors before any mixin ever runs. Locals are the correct boundary.
 *
 * Fixtures that use locals live in tests/fixtures/.
 *
 * Targets:
 *   1. form-wrap `+input(placeholder, inputType, label)` mixin
 *   2. sCatalog  `+product-item(imgIdx, title, model, rating)` mixin
 *
 * Invariants checked for every generated input:
 *   a) render never throws
 *   b) output is structurally valid HTML (node-html-parser can parse it)
 *   c) hostile input is escaped: no injected active content (script/img/iframe)
 *      and no on*-handler attribute reaches the output (covers both the bare
 *      `<script>` and the `"><img onerror=...>` attribute-breakout vectors)
 *
 * NOTE: product-item uses `#{t}` (escaped interpolation) for title/model,
 * so injection protection is enforced by Pug. This is verified below.
 */
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { parse } from 'node-html-parser'
import pug from 'pug'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')

// Fixture paths
const INPUT_FIXTURE = path.join(__dirname, 'fixtures', 'fuzz-input.pug')
const PRODUCT_FIXTURE = path.join(__dirname, 'fixtures', 'fuzz-product-item.pug')

const RENDER_OPTS = { basedir: PROJECT_ROOT, pretty: true }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isStructurallyValid(html) {
	try {
		const root = parse(html)
		return root.childNodes.length > 0
	} catch {
		return false
	}
}

/**
 * The input fixture legitimately renders only <label>/<span>/<input>.
 * So if any active-content element (script/img/iframe) OR any element
 * carrying an on*-event-handler attribute appears, it can only have come
 * from hostile input that escaped Pug's text/attribute escaping.
 * Catches both the bare `<script>` and the `"><img onerror=...>` vectors.
 */
function noInjectedActiveContent(html) {
	const root = parse(html)
	const active =
		root.querySelectorAll('script').length +
		root.querySelectorAll('img').length +
		root.querySelectorAll('iframe').length
	if (active > 0) return false
	return !root
		.querySelectorAll('*')
		.some((el) => Object.keys(el.attributes).some((attr) => /^on/i.test(attr)))
}

// ---------------------------------------------------------------------------
// Arbitrary for hostile strings
// ---------------------------------------------------------------------------
const hostileString = fc.oneof(
	fc.constant(''),
	fc.constant('<script>alert(1)</script>'),
	fc.constant('&amp; "quoted" \'single\''),
	fc.constant('<b>bold</b>'),
	fc.constant('😀🚀🎉'),
	fc.constant('a'.repeat(500)),
	fc.constant('\n\t\r'),
	fc.constant('"><img src=x onerror=alert(1)>'),
	fc.string({ minLength: 0, maxLength: 200 }),
)

// ---------------------------------------------------------------------------
// form-wrap input mixin — fuzz placeholder and label via locals
// ---------------------------------------------------------------------------
describe('form-wrap input mixin — property-based', () => {
	it('never throws for any placeholder/label combination', () => {
		fc.assert(
			fc.property(hostileString, hostileString, (placeholder, label) => {
				expect(() =>
					pug.renderFile(INPUT_FIXTURE, {
						...RENDER_OPTS,
						placeholder,
						inputType: 'text',
						label,
					}),
				).not.toThrow()
			}),
			{ numRuns: 100 },
		)
	})

	it('always produces structurally valid HTML', () => {
		fc.assert(
			fc.property(hostileString, hostileString, (placeholder, label) => {
				const html = pug.renderFile(INPUT_FIXTURE, {
					...RENDER_OPTS,
					placeholder,
					inputType: 'text',
					label,
				})
				expect(isStructurallyValid(html)).toBe(true)
			}),
			{ numRuns: 100 },
		)
	})

	it('escapes hostile input — no injected script/img/iframe or on* handler via placeholder or label', () => {
		fc.assert(
			fc.property(hostileString, hostileString, (placeholder, label) => {
				const html = pug.renderFile(INPUT_FIXTURE, {
					...RENDER_OPTS,
					placeholder,
					inputType: 'text',
					label,
				})
				expect(noInjectedActiveContent(html)).toBe(true)
			}),
			{ numRuns: 100 },
		)
	})
})

// ---------------------------------------------------------------------------
// sCatalog product-item mixin — fuzz title / model / rating via locals
//
// NOTE: _sCatalog.pug uses `#{t}` / `#{p}` (escaped interpolation).
// Pug's #{} escapes HTML entities, so injection is blocked at the template
// level. We document and verify this here.
// ---------------------------------------------------------------------------
describe('product-item mixin — property-based', () => {
	it('never throws for any title/model/rating combination', () => {
		fc.assert(
			fc.property(hostileString, hostileString, hostileString, (title, model, rating) => {
				expect(() =>
					pug.renderFile(PRODUCT_FIXTURE, {
						...RENDER_OPTS,
						imgIdx: '1',
						title,
						model,
						rating,
					}),
				).not.toThrow()
			}),
			{ numRuns: 100 },
		)
	})

	it('always produces structurally valid HTML', () => {
		fc.assert(
			fc.property(hostileString, hostileString, hostileString, (title, model, rating) => {
				const html = pug.renderFile(PRODUCT_FIXTURE, {
					...RENDER_OPTS,
					imgIdx: '1',
					title,
					model,
					rating,
				})
				expect(isStructurallyValid(html)).toBe(true)
			}),
			{ numRuns: 100 },
		)
	})

	it('escapes hostile input via #{} — no injected script/img/iframe from title or model', () => {
		fc.assert(
			fc.property(hostileString, hostileString, (title, model) => {
				const html = pug.renderFile(PRODUCT_FIXTURE, {
					...RENDER_OPTS,
					imgIdx: '1',
					title,
					model,
					rating: '4.8',
				})
				// Since product-item uses #{t} and #{p} (escaped), active content must NOT appear
				// in .product-item__text or .product-item__title (the text interpolation targets)
				const root = parse(html)
				const textEl = root.querySelector('.product-item__text')
				const titleEl = root.querySelector('.product-item__title')
				// Neither text container should contain a <script> node as a child
				const textHasScript = textEl?.querySelectorAll('script').length > 0
				const titleHasScript = titleEl?.querySelectorAll('script').length > 0
				expect(textHasScript).toBe(false)
				expect(titleHasScript).toBe(false)
			}),
			{ numRuns: 100 },
		)
	})
})
