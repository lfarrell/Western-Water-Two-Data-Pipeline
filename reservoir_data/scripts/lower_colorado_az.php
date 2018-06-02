<?php
include 'functions.php';
include 'simple_html_dom.php';

date_default_timezone_set('America/Phoenix');

$bureau_reservoirs = array(
    'Apache Lake (Horse Mesa Dam)' => array('capacity' => 245138, 'state' => 'AZ', 'alias' => 'Horse Mesa'),
    'Roosevelt Lake (Roosevelt Dam)' => array('capacity' => 1381580, 'state' => 'AZ', 'alias' => 'Roosevelt'),
    'Canyon Lake (Mormon Flat Dam)' => array('capacity' => 57852, 'state' => 'AZ', 'alias' => 'Mormon Flat'),
    'Saguaro Lake (Stewart Mountain Dam)' => array('capacity' => 69765, 'state' => 'AZ', 'alias' => 'Stewart Mountain'),
 //   'Bartlett' => array('capacity' => 178490, 'state' => 'AZ'),
 //   'Horseshoe' => array('capacity' => 131500, 'state' => 'AZ')
);

$path = "https://streamflow.watershedconnection.com/Dwr?reportDate=";
$last_month = date("d/m/Y", strtotime("first day of previous month"));
$date_bits = preg_split('/\//', $last_month);
$days = cal_days_in_month(CAL_GREGORIAN, $date_bits[1], $date_bits[2]);
$month = $date_bits[1];
$year = $date_bits[2];

$fd = fopen("../data/lower_all_az_daily.csv", "wb");

for($i=1; $i<=$days; $i++) {
    $month = preg_replace('/^0/', '', $month);
    $full_date = $year . '-' . $month . '-' . $i;
    $url = $path . $full_date;

    $lc_html = file_get_html($url);

    $table = $lc_html->find('table', 0);
    $rows = $table->find('tr');

    foreach($rows as $key => $row) {
        if($key < 2) continue;
        $reservoir = $row->find('td', 0);
        $res_name_bits = $reservoir->plaintext;
        $res_name = trim(implode(' ', preg_split('/\s+/', $res_name_bits)));

        if(array_key_exists($res_name, $bureau_reservoirs)) {
            $res_full_name = $bureau_reservoirs[$res_name]['alias'];
            $current_level = $row->find('td', 3);
            $curr_level = str_ireplace(',', '', trim($current_level->plaintext));
            $cap = $bureau_reservoirs[$res_name]['capacity'];
            $pct_cap = round(($curr_level / $cap) * 100, 1);

            fputcsv($fd, array($res_full_name, $curr_level, $cap, $pct_cap, $month . '/' . $i . '/' . $year, 'AZ'));
        }
    }

    echo $month . ' ' . $i . ' ' . $year . " processed\n";
}
fclose($fd);

if (($handle = fopen("../data/lower_all_az_daily.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        $file = file_name($data[0]);
        $fh = fopen('../data/lc_az/' . $file . '.csv', 'a');
        fputcsv($fh, $data);
        fclose($fh);
    }
    fclose($handle);
}

aggregate('../data/lc_az', '../data/az_month', false, true);
aggregate('../data/lc_az', '../data/lc_az_month', false, true);

function file_name($data) {
    return preg_replace('/\s+/', '_', strtolower($data));
}