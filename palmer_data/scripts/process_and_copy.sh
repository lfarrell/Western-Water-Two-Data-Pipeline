#!/bin/bash

php process.php
node group_main.js
cp -R ../data/state_data/all/* ~/vue/western-water/static/data/palmer