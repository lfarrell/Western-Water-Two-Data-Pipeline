A project to view the water resources of the American West. Data is pulled from a number of sources to make the visualization.
The scripts should be run in the following order by hand or as a cron job to properly amalgamate the disparate data sources.

###Reservoir Data
####(Run on the first day of the month)

From the `reservoir_data/scripts` run the following

1. `sh texas_all.sh`
2. `php pacific_northwest.php`
3. `php daily_upper_colorado.php`
4. `php usgs_az.php`
5. `php lower_colorado_az.php`
6. `sh final_enhancements.sh`

####(Run on the 15th of the month) Sites below should be updated by then

1. `sh usda_all.sh`
2. `php lower_colorado.php`
3. `php california_monthly.php`
4. `sh final_enhancements.sh`

###Drought Data (US Drought Monitor)

1. Download data for states and counties from [I'm an inline-style link](http://droughtmonitor.unl.edu/MapsAndData/MapsandDataServices/StatisticalData/BasicStatistics.aspx)
2. Run `sh process_all.sh` from the `drought_data/scripts directory`

###Palmer Data (NOAA)

1. Run `sh process_and_copy.sh` from the `palmer_data/scripts directory`

###Snow Data

1. Run `sh process_all.sh` from the `snow_data/scripts directory`