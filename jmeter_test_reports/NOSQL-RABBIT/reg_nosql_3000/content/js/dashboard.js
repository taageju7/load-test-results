/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.95454545454545, "KoPercent": 0.045454545454545456};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9992878787878788, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9998333333333334, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.9993333333333333, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.9958333333333333, 500, 1500, "Registration"], "isController": false}, {"data": [0.9995, 500, 1500, "Welcome"], "isController": false}, {"data": [0.999, 500, 1500, "Registration-3"], "isController": false}, {"data": [1.0, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.999, 500, 1500, "Registration-2"], "isController": false}, {"data": [1.0, 500, 1500, "Welcome-1"], "isController": false}, {"data": [1.0, 500, 1500, "Registration-1"], "isController": false}, {"data": [1.0, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.9996666666666667, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 33000, 15, 0.045454545454545456, 7.034333333333325, 0, 747, 4.0, 8.0, 11.0, 12.0, 552.1164463777815, 49119.50481402668, 565.6679380332943], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 3000, 0, 0.0, 4.960333333333318, 2, 510, 4.0, 5.0, 6.0, 25.0, 50.31615316237022, 1844.9419949096825, 30.219174018415714], "isController": false}, {"data": ["Registration-4", 3000, 2, 0.06666666666666667, 4.950000000000012, 0, 486, 3.0, 4.0, 5.0, 34.0, 51.12910097997444, 1873.5572006817215, 33.131923732424376], "isController": false}, {"data": ["Registration", 3000, 7, 0.23333333333333334, 19.172999999999952, 9, 747, 12.0, 15.0, 18.0, 233.85999999999694, 51.08208891688945, 12501.474513097235, 170.26874100742393], "isController": false}, {"data": ["Welcome", 3000, 0, 0.0, 10.80666666666665, 6, 603, 8.0, 10.0, 12.0, 74.96999999999935, 50.20248334950969, 12278.478273829445, 115.55395825663508], "isController": false}, {"data": ["Registration-3", 3000, 3, 0.1, 5.463666666666672, 0, 452, 4.0, 5.0, 6.0, 34.98999999999978, 51.12997238981491, 4349.568181418729, 32.722383423662954], "isController": false}, {"data": ["Welcome-0", 3000, 0, 0.0, 3.776666666666672, 2, 486, 3.0, 4.0, 4.0, 21.979999999999563, 50.205843960236976, 196.9500734260468, 25.397096847073], "isController": false}, {"data": ["Registration-2", 3000, 3, 0.1, 5.64666666666665, 0, 474, 4.0, 5.0, 6.0, 34.0, 51.12735824939926, 6069.826690238509, 33.21950173193926], "isController": false}, {"data": ["Welcome-1", 3000, 0, 0.0, 5.419666666666667, 3, 397, 4.0, 5.0, 7.0, 31.969999999999345, 50.31699708161417, 5979.5166580708465, 30.317956249371036], "isController": false}, {"data": ["Registration-1", 3000, 0, 0.0, 4.603666666666661, 2, 294, 3.0, 4.0, 5.0, 44.0, 51.10645474523432, 200.73257908723872, 31.991442862983593], "isController": false}, {"data": ["Welcome-2", 3000, 0, 0.0, 5.268000000000005, 3, 113, 4.0, 6.0, 7.0, 26.98999999999978, 50.31530927143432, 4284.466510968738, 29.82557883570374], "isController": false}, {"data": ["Registration-0", 3000, 0, 0.0, 7.309333333333329, 3, 601, 4.0, 5.0, 6.0, 80.0, 51.08817819556555, 19.058285225298864, 39.313949627056296], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 8, 53.333333333333336, 0.024242424242424242], "isController": false}, {"data": ["Assertion failed", 7, 46.666666666666664, 0.021212121212121213], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 33000, 15, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 8, "Assertion failed", 7, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Registration-4", 3000, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration", 3000, 7, "Assertion failed", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-3", 3000, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-2", 3000, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
