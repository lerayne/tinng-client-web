#!/bin/sh

vulcanize index-source.html > index.html -s --config vulcanize-config.json
vulcanize index-source.html > index-dev.html --config vulcanize-config.json
vulcanize skins/paper/skin-paper.html > skins/paper/skin-paper-v.html