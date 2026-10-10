PORT ?= 4380
PIPELINE_PORT ?= 4390

.PHONY: start pipeline
start:
	@node server.mjs $(PORT)

pipeline:
	@node pipeline/server.mjs $(PIPELINE_PORT)
