#!/bin/sh

vulcanize index-source.html -o index.html -s --config vulcanize-config.json
vulcanize index-source.html -o index-dev.html --config vulcanize-config.json
vulcanize skins/paper/skin-paper.html -s -o skins/paper/skin-paper-v.html
vulcanize skins/paper/skin-paper.html -o skins/paper/skin-paper-dv.html