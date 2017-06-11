<?php
$months = range(1,12);

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
        if($month < 10) { $month = "0" . $month; }

        $links = [
            'temp' =>  "http://www.ncdc.noaa.gov/cag/time-series/us/$code/00/tavg/1/$month/1895-2016.csv?base_prd=true&firstbaseyear=1901&lastbaseyear=2000",
            'precip' => "http://www.ncdc.noaa.gov/cag/time-series/us/$code/00/pcp/1/$month/1895-2016.csv?base_prd=true&firstbaseyear=1901&lastbaseyear=2000",
            'drought' => "http://www.ncdc.noaa.gov/cag/time-series/us/$code/00/pdsi/1/$month/1895-2016.csv?base_prd=true&firstbaseyear=1901&lastbaseyear=2000",
        ];

        foreach($links as $type => $link) {
            $ch = curl_init($link);
            $fp = fopen("state_data/$type/$state" . '_' . "$month.csv", "wb");

            curl_setopt($ch, CURLOPT_FILE, $fp);
            curl_setopt($ch, CURLOPT_HEADER, 0);

            curl_exec($ch);
            curl_close($ch);
            fclose($fp);
        }

        echo $month . " processed\n";
    }
    echo $state . " processed\n";
}

// Aggregate Files
function build($path, $states, $fh) {
    foreach($states as $state_file) {
        $state_name = preg_split('/_/', $state_file)[0];

        if (($handle = fopen($path . $state_file, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                if(preg_match('/^\d/', $data[0])) {
                    $year = substr($data[0], 0, 4);
                    $month = substr($data[0], 4);
                    $data[0] = $year;
                    $data[3] = $month;
                    $data[4] = $state_name;

                    fputcsv($fh, $data);
                }
            }
            fclose($handle);
        }
    }

    return $fh;
}

$types = ['state_data'];
$fields = ['drought', 'precip', 'temp'];
$headers = ['year', 'value', 'anomaly', 'month', 'state'];

// Aggregate all by type
foreach($types as $type) {
    foreach($fields as $field) {
        $values = scandir("$type/$field");

        $fh = fopen($type . '_' . $field . '_all.csv', 'wb');
        fputcsv($fh, $headers);
        build("$type/$field/", $values, $fh);
        fclose($fh);
    }
}

// Aggregate all by state
$headers[] = 'type';
$by_states = scandir('all');
$states = [];
$us = [];

foreach($by_states as $s) {
    if(preg_match('/^us/', $s)) {
        $us[] = $s;
    } elseif(preg_match('/^\./', $s)) {
        continue;
    } else {
        $states[] = $s;
    }
}

$fg = fopen('all_by_state/US.csv', 'wb');
fputcsv($fg, $headers);

foreach($us as $u) {
    $type = explode('_', $u)[2];

    if (($handle = fopen("all/$u", "r")) !== FALSE) {
        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            if(preg_match('/^\d/', $data[0])) {
                $data[5] = $type;
                fputcsv($fg, $data);
            }
        }
        fclose($handle);
    }
}
fclose($fg);

foreach($state_list as $state => $code) {
    $ft = fopen("all_by_state/$state.csv", "wb");
    fputcsv($ft, $headers);

    foreach($by_states as $state_file) {
        $type = explode('_', $state_file)[2];

        if(($handle = fopen("all/$state_file", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                if($data[4] == $state) {
                    $data[5] = $type;
                    fputcsv($ft, $data);
                }
            }
        }
    }
    fclose($ft);
}