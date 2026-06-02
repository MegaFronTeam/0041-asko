import { test, expect } from '@playwright/test'

const PAGES = ['/', '/02-catalog.html']
const VIEWPORTS = [
	{ name: 'mobile', width: 375, height: 812 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'desktop', width: 1280, height: 900 },
]

for (const page of PAGES) {
	for (const vp of VIEWPORTS) {
		test(`${page} — no horizontal overflow at ${vp.name} (${vp.width}px)`, async ({ page: pw }) => {
			await pw.setViewportSize({ width: vp.width, height: vp.height })
			await pw.goto(page)
			const overflow = await pw.evaluate(
				() => document.documentElement.scrollWidth <= window.innerWidth + 1,
			)
			expect(overflow).toBe(true)
		})
	}
}

test('index.html — sCatalog contains product-item articles', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 })
	await page.goto('/')

	// The .sCatalog section exists and has at least one .product-item article
	const count = await page.evaluate(() => {
		return document.querySelectorAll('.sCatalog .product-item').length
	})
	expect(count).toBeGreaterThan(0)
})

test('index.html — container has positive width at desktop', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 })
	await page.goto('/')

	const width = await page.evaluate(() => {
		const el = document.querySelector('.container')
		if (!el) return 0
		return el.getBoundingClientRect().width
	})
	expect(width).toBeGreaterThan(200)
})
