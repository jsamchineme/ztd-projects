PORT ?= 4380
PIPELINE_PORT ?= 4390

.PHONY: start pipeline nurseries
start:
	@node server.mjs $(PORT)

pipeline: pipeline/node_modules
	@node pipeline/server.mjs $(PIPELINE_PORT)

# The nursery project: its own board, stages, templates and cards.
NURSERY_PORT ?= 4391
nurseries: pipeline/node_modules
	@PIPELINE_CONFIG=pipeline/nursery.config.json PIPELINE_DATA=pipeline/data-nursery/cards.json node pipeline/server.mjs $(NURSERY_PORT)

# Playwright, axe-core and the Playwright MCP for the browser audit. Uses your installed Chrome, so no browser download.
pipeline/node_modules: pipeline/package.json
	@PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm --prefix pipeline install --no-audit --no-fund
	@touch pipeline/node_modules
