var fs = require('fs');
var d3 = require('d3');
var _ = require('lodash');
var stringify = require('csv-stringify');

var base = '../data/states';
var text_format = d3.format(".01f");

fs.readdir(base, function(err, files) {
    files.forEach(function(file) {
        if(/csv$/.test(file)) {
            fs.readFile(base + '/' + file, 'utf8', function(e, rows) {
                var data = d3.csvParse(rows);
                var file_base = file.split('.')[0];
                var nested, flat, headers;

                if(/counties/.test(file)) {
                    nested = d3.nest()
                        .key(function(d) { return d.county; })
                        .key(function(d) { return d.year; })
                        .key(function(d) { return d.month; })
                        .rollup(function(values) {
                            return valueList(values);
                        })
                        .entries(data);
                    flat = flattenThree(nested, false);
                    headers = ['county', 'year', 'month', 'D0', 'D1', 'D2', 'D3', 'D4'];
                } else {
                    nested = d3.nest()
                        .key(function(d) { return d.state; })
                        .key(function(d) { return d.year; })
                        .key(function(d) { return d.month; })
                        .rollup(function(values) {
                            return valueList(values);
                        })
                        .entries(data);

                    flat = flattenThree(nested, true);

                    headers = ['state', 'year', 'month', 'D0', 'D1', 'D2', 'D3', 'D4'];
                }

                var options = {header: true,
                    columns: headers
                };

                stringify(flat, options, function(e, output){
                    fs.writeFile('../data/states_finished/' + file_base + '.csv', output, function(err) {
                        console.log(err)
                    });
                });
            });
        }
    });
});

function valueList(values) {
    return {
        "D0": d3.mean(values, function(d) {return +d['D0']; }),
        "D1": d3.mean(values, function(d) {return +d['D1']; }),
        "D2": d3.mean(values, function(d) {return +d['D2']; }),
        "D3": d3.mean(values, function(d) {return +d['D3']; }),
        "D4": d3.mean(values, function(d) {return +d['D4']; })
    };
}

function flattenThree(nested_group, is_state) {
    var flat = [];
    var field = (is_state) ? 'state' : 'county';
    var key_type;

    nested_group.forEach(function(d) {
        if(is_state) {
            key_type = d.key;
        } else {
            key_type = d.key.replace(' County', '');
        }

        d.values.forEach(function(e) {
            e.values.forEach(function(f) {
                var row = {
                    year: e.key,
                    month: f.key,
                    "D0": text_format(f.value['D0']),
                    "D1": text_format(f.value['D1']),
                    "D2": text_format(f.value['D2']),
                    "D3": text_format(f.value['D3']),
                    "D4": text_format(f.value['D4'])
                };

                row[field] = key_type;
                flat.push(row);
            })
        })
    });

    if(is_state) {
        return _.sortByAll(flat, ['state', 'year', 'month']);
    } else {
        return _.sortByAll(flat, ['county', 'year', 'month']);
    }
}