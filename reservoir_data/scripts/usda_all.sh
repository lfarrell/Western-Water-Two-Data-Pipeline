#!/bin/bash

BASE_PATH="../data/usda_month"

php usda_reservoirs.php

echo "Copying USDA reservoirs to states"
cp -R $BASE_PATH/CO* ../data/co_month/
cp -R $BASE_PATH/ID* ../data/id_month/
cp -R $BASE_PATH/NM* ../data/nm_month/
cp -R $BASE_PATH/NV* ../data/nv_month/
cp -R $BASE_PATH/OR* ../data/or_month/
cp -R $BASE_PATH/UT* ../data/utah_month/
cp -R $BASE_PATH/WA* ../data/wa_month/
cp -R $BASE_PATH/WY* ../data/wy_month/