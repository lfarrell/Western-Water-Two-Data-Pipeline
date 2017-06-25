#!/bin/bash

echo "Processing raw data files"
php separate.php

echo "Grouping data"
node group.js

echo "Moving data into place"
cp -R ../data/states_finished/* ~/vue/western-water/static/data/drought