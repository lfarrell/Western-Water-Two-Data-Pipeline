<?php
$base = "../data";
$result_base = $base . "/states";
$all = scandir($base . "/raw-state");
$county_list = scandir($base . "/raw-county");

$states = [
    'AZ'=>"Arizona",
    'CA'=>"California",
    'CO'=>"Colorado",
    'MT'=>"Montana",
    'NV'=>"Nevada",
    'NM'=>"New Mexico",
    'OR'=>"Oregon",
    'TX'=>"Texas",
    'UT'=>"Utah",
    'WA'=>"Washington",
    'WY'=>"Wyoming"];

foreach($states as $key => $name) {
    $state = strtolower($key);
    $fh = fopen("$result_base/$state.csv", "wb");
    $fg = fopen("$result_base/$state-counties.csv", "wb");
    fputcsv($fh, ["state","none","D0","D1","D2","D3","D4","year","month"]);
    fputcsv($fg, ["county","state","none","D0","D1","D2","D3","D4","year","month"]);

    fclose($fh);
    fclose($fg);
}

foreach($all as $file) {
    if (is_dir($file)) continue;
    build($base . "/raw-state", $file, false);
    echo "$file processed\n";
}

foreach($county_list as $file) {
    if (is_dir($file)) continue;
    build($base . "/raw-county", $file, true);
    echo "$file processed\n";
}

function build($base, $file, $is_county) {
    echo "$base/$file\n";
    if (($handle = fopen("$base/$file", "r")) !== FALSE) {
        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            if(preg_match("/^\d/", $data[0])) {
                $state_name = ($is_county)? $data[3] : $data[1];

                $date = array_shift($data);
                $year = substr($date, 0, 4);
                $month = substr($date, 4, 2);


                if($is_county) {
                    $file_name = $state_name . "-counties";
                    $data = array_slice($data, 1, 8);
                } else {
                    $file_name = $state_name;
                }

                $ft = fopen("../data/states/" . strtolower($file_name) . ".csv", "a");

                $data[] = $year;
                $data[] = $month;
                fputcsv($ft, $data);
                fclose($ft);
            }
        }
    }
}
