﻿/*!
charts.js
(c) 2018 IG PROG, www.igprog.hr
*/
angular.module('charts', [])

.factory('charts', [function () {
    return {
        'createGraph': function (series, data, labels, colors, options, datasetOverride) {
            return {
                series: series,
                data: data,
                labels: labels,
                colors: colors,
                options: options,
                datasetOverride: datasetOverride
            }
        },
        'stackedChart': function (series, data, labels, colors, title) {
            return {
                series: series, data: data, labels: labels, colors: colors, type: 'horizontalBar',
                options: {
                    title: { display: true, text: title },
                    tooltips: { mode: 'index', intersect: false },
                    responsive: true, maintainAspectRatio: true, legend: { display: true },
                    scales: {
                        xAxes: [{
                            stacked: true,
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    }
                }
            }
        },
        'guageChart': function (id, value, unit, options) {
            if (google.visualization === undefined || document.getElementById(id) == null) { return false; }
            var data = google.visualization.arrayToDataTable([
                  ['Label', 'Value'],
                  [unit, 80]
            ]);
            data.setValue(0, 1, value);
            var chart = new google.visualization.Gauge(document.getElementById(id));
            chart.draw(data, options);
        }
    }
}]);

;
