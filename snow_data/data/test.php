<?php
include '../scripts/stations.php';

$missing= [
"1047",
"1049",
"1172",
"925",
"1014",
"1207",
"1043",
"1157",
"1051",
"1123",
"1252",
"1137",
"1205",
"1187",
"1276",
"1050",
"1202",
"1204",
"1210",
"1213",
"1120",
"1141",
"2029",
"1173",
"1152",
"1119",
"1067",
"1203",
"1208",
"1209",
"1257",
"1188",
"938",
"1133",
"1185",
"1186",
"1211",
"1272",
"1080",
"933",
"1006",
"1155",
"1262",
"1109",
"936",
"978",
"988",
"1150",
"1033",
"934",
"1206"];

$missing_list = [];
foreach($stations as $key => $station) {
    if(array_search($station['id'], $missing)) {
       $missing_list[$key] = $station;
    }
}
print_r($missing_list);
foreach($missing_list as $station_name => $station_info) {
    $url = "https://wcc.sc.egov.usda.gov/reportGenerator/view_csv/customSingleStationReport/daily/" . $station_info['id'] . ":" . $station_info['state'] . ":SNTL|id=%22%22|name/POR_BEGIN,POR_END/WTEQ::value,PREC::value,TMAX::value,TMIN::value,TAVG::value,PRCP::value";

    $file_name = $station_info['state'] . "_" . $station_info['id'] . ".csv";

    $ch = curl_init($url);
    $fp = fopen("test_data/$file_name", "wb");

    curl_setopt($ch, CURLOPT_FILE, $fp);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

    curl_exec($ch);
    curl_close($ch);
    fclose($fp);

    echo $station_name . " downloaded\n";
}