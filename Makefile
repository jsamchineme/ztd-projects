PORT ?= 4380
PIPELINE_PORT ?= 4390

.PHONY: start pipeline
start:
	@node server.mjs $(PORT)

pipeline: pipeline/node_modules
	@node pipeline/server.mjs $(PIPELINE_PORT)

# Playwright, axe-core and the Playwright MCP for the browser audit. Uses your installed Chrome, so no browser download.
pipeline/node_modules: pipeline/package.json
	@PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm --prefix pipeline install --no-audit --no-fund
	@touch pipeline/node_modules
