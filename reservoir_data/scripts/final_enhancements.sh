#!/bin/bash

echo "Merging totals"
php merge_all.php

echo "Merging state totals"
php state_all.php

echo "Enhancing reservoirs"
node set_reservoirs.js

echo "Copying files"
cp -R ../data/states_all/* ~/vue/western-water/static/data/states_all
cp -R ../data/stations_enhanced/* ~/vue/western-water/static/data/stations_enhanced