<?php
date_default_timezone_set('America/New_York');

// $months = range(1,12);
$months = [date("m", strtotime("first day of previous month"))];

$state_list = array(
    'AZ' => 2,
    'CA' => 4,
    'CO' => 5,
    'ID' => 10,
    'MT' => 24,
    'NV' => 26,
    'NM' => 29,
    'OR' => 35,
    'TX' => 41,
    'UT' => 42,
    'WA' => 45,
    'WY' => 48
);

foreach($state_list as $state => $code) {
    foreach($months as $month) {
        if($month < 10 && substr($month, 0, 1) != "0") { $month = "0" . $month; }

        $links = [
            'temp' =>  "https://www.ncdc.noaa.gov/cag/time-series/us/$code/00/tavg/1/$month/1895-2018.csv?base_prd=true&begbaseyear=1901&endbaseyear=2000",
            'precip' => "https://www.ncdc.noaa.gov/cag/time-series/us/$code/00/pcp/1/$month/1895-2018.csv?base_prd=true&begbaseyear=1901&endbaseyear=2000",
            'drought' => "https://www.ncdc.noaa.gov/cag/time-series/us/$code/00/pdsi/1/$month/1895-2018.csv?base_prd=true&begbaseyear=1901&endbaseyear=2000",
        ];

        foreach($links as $type => $link) {
            $ch = curl_init($link);
            $fp = fopen("../data/state_data/$type/$state" . '_' . "$month.csv", "wb");

            curl_setopt($ch, CURLOPT_FILE, $fp);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

            curl_exec($ch);
            curl_close($ch);
            fclose($fp);
        }

        echo $month . " processed\n";
    }
    echo $state . " processed\n";
}

$types = ['state_data'];
$fields = ['drought', 'precip', 'temp'];
$headers = ['year', 'value', 'anomaly', 'month', 'type', 'state'];

foreach($fields as $field) {
    $fg = fopen('../data/state_data/all/ALL_' . $field . '_all.csv', 'wb');
    fputcsv($fg, $headers);
    fclose($fg);
}

// Aggregate all by type
foreach($state_list as $state_name => $state) {
    foreach($types as $type) {
        foreach($fields as $field) {
            $values = scandir("../data/$type/$field");

            $fh = fopen('../data/state_data/all/' . $state_name . '_' . $field . '_all.csv', 'wb');
            fputcsv($fh, $headers);

            $fg = fopen('../data/state_data/all/ALL_' . $field . '_all.csv', 'a');

            foreach($values as $value) {
                if(preg_match('/' . $state_name . '/', $value)) {
                    if (($handle = fopen("../data/$type/$field/$value", "r")) !== FALSE) {
                        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                            $year = substr($data[0], 0, 4);
                            if(preg_match('/^\d/', $data[0]) && $year >= 2000) {
                                $month = substr($data[0], 4);
                                $data[0] = $year;
                                $data[3] = $month;
                                $data[4] = $field;
                                $data[5] = $state_name;

                                fputcsv($fh, $data);
                                fputcsv($fg, $data);
                            }
                        }
                        fclose($handle);
                    }
                }
            }

            fclose($fh);
            fclose($fg);
        }
    }
}