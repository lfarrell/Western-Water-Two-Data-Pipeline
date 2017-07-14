#!/bin/bash

BASE_PATH="../data/lc_month"

php lower_colorado.php

echo "Copying Lower Colorado files into place"
cp -R $BASE_PATH/* ../data/az_month/
cp -R $BASE_PATH/lake_m* ../data/nv_month/