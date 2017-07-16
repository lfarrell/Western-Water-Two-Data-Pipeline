var fs = require('fs');
var d3 = require('d3');
var _ = require('lodash');
var stringify = require('csv-stringify');

var base = '../data/state_data/all';
var text_format = d3.format(".01f");

var files = ['ALL_drought_all.csv', 'ALL_precip_all.csv', 'ALL_temp_all.csv'];

files.forEach(function(file) {
    fs.readFile(base + '/' + file, 'utf8', function(e, rows) {
        var data = d3.csvParse(rows);

        var nested = d3.nest()
            .key(function(d) { return d.type; })
            .key(function(d) { return d.year; })
            .key(function(d) { return d.month; })
            .rollup(function(values) {
                return valueList(values);
            })
            .entries(data);

        var flat = flattenThree(nested);

        var options = {header: true,
            columns: ['year', 'month', 'value', 'anomaly']
        };

        var file_name = file.substring(4);
        stringify(flat, options, function(e, output){
            fs.writeFile('../data/state_data/all/munged_' + file_name, output, function(err) {
                console.log(err)
            });
        });
    });
});

function valueList(values) {
    return {
        "value": d3.mean(values, function(d) {return +d.value; }),
        "anomaly": d3.mean(values, function(d) {return +d.anomaly; })
    };
}

function flattenThree(nested_group) {
    var flat = [];

    nested_group.forEach(function(d) {
        d.values.forEach(function(e) {
            e.values.forEach(function(g) {
                flat.push({
                    year: e.key,
                    month: g.key,
                    value: text_format(g.value.value),
                    anomaly: text_format(g.value.anomaly)
                });
            });
        });
    });

    return _.sortByAll(flat, ['year', 'month']);
}