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
                    flat = flattenThree(nested);
                    headers = ['county', 'year', 'month', 'none', 'D0', 'D1', 'D2', 'D3', 'D4'];
                } else {
                    nested = d3.nest()
                        .key(function(d) { return d.year; })
                        .key(function(d) { return d.month; })
                        .rollup(function(values) {
                            return valueList(values);
                        })
                        .entries(data);

                    flat = flattenTwo(nested);
                    headers = ['year', 'month', 'none', 'D0', 'D1', 'D2', 'D3', 'D4'];
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
        none: d3.mean(values, function(d) {return +d.none; }),
        "D0": d3.mean(values, function(d) {return +d['D0']; }),
        "D1": d3.mean(values, function(d) {return +d['D1']; }),
        "D2": d3.mean(values, function(d) {return +d['D2']; }),
        "D3": d3.mean(values, function(d) {return +d['D3']; }),
        "D4": d3.mean(values, function(d) {return +d['D4']; })
    };
}

function flattenTwo(nested_group) {
    var flat = [];

    nested_group.forEach(function(d) {
        d.values.forEach(function(e) {
            flat.push({
                year: d.key,
                month:e.key,
                none: text_format(e.value.none),
                "D0": text_format(e.value['D0']),
                "D1": text_format(e.value['D1']),
                "D2": text_format(e.value['D2']),
                "D3": text_format(e.value['D3']),
                "D4": text_format(e.value['D4'])
            });
        });
    });

    return _.sortByAll(flat, ['year', 'month']);
}

function flattenThree(nested_group) {
    var flat = [];

    nested_group.forEach(function(d) {
        d.values.forEach(function(e) {
            e.values.forEach(function(f) {
                flat.push({
                    county: d.key.replace(' County', ''),
                    year: e.key,
                    month: f.key,
                    none: text_format(f.value.none),
                    "D0": text_format(f.value['D0']),
                    "D1": text_format(f.value['D1']),
                    "D2": text_format(f.value['D2']),
                    "D3": text_format(f.value['D3']),
                    "D4": text_format(f.value['D4'])
                });
            })
        })
    });

    return _.sortByAll(flat, ['county', 'year', 'month']);
}