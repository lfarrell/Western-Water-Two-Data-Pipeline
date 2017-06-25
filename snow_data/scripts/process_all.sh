#!/bin/bash

echo "Downloading data"
php download.php

echo "Processing raw data"
php process.php

echo "Adding row averages and medians"
node add_avg.js

echo "Merging all files"
php merge_all.php

echo "Grouping data"
node munge.js

echo "Moving data into place"
cp -R ../data/state_data/all/* ~/vue/western-water/static/data/snow