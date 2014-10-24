#!/bin/sh

vulcanize index-source.html -o index.html -s --config vulcanize-config.json
vulcanize index-source.html -o index-dev.html --config vulcanize-config.json