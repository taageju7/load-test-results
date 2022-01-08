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

    var data = {"OkPercent": 81.96324214449055, "KoPercent": 18.036757855509443};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.21272973659693403, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.01235, 500, 1500, "Registration"], "isController": false}, {"data": [0.0705, 500, 1500, "Welcome"], "isController": false}, {"data": [0.08825, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.45885, 500, 1500, "Welcome-1"], "isController": false}, {"data": [1.0, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.37365, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.01861060880048222, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 59035, 10648, 18.036757855509443, 15029.747336325927, 0, 89001, 24927.0, 76373.5, 83420.95, 88336.96, 317.5785809963904, 16465.332695806952, 221.8268198836953], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Registration", 10000, 3364, 33.64, 36340.867999999966, 260, 89001, 28839.0, 78968.79999999999, 83894.95, 88375.98, 54.02631081336611, 903.8360949360464, 42.450224040357654], "isController": false}, {"data": ["Welcome", 10000, 3642, 36.42, 14079.152200000028, 3, 35613, 15907.5, 24998.8, 26780.899999999998, 29008.97, 102.18262077985776, 13979.699656139514, 141.48435184924998], "isController": false}, {"data": ["Welcome-0", 10000, 0, 0.0, 11234.696899999977, 0, 30999, 11658.0, 20818.199999999997, 23098.49999999999, 27691.779999999995, 102.20873066977381, 243.44442783552572, 51.70324461615511], "isController": false}, {"data": ["Welcome-1", 10000, 1004, 10.04, 1879.010899999999, 1, 12890, 596.0, 6044.9, 8365.899999999976, 11016.669999999993, 102.30074372640689, 10940.207223343623, 49.519913798835816], "isController": false}, {"data": ["Registration-1", 2399, 0, 0.0, 24.985827428095018, 1, 328, 4.0, 82.0, 104.0, 175.0, 28.191689386105104, 1653.2547500580226, 16.478401966602426], "isController": false}, {"data": ["Welcome-2", 10000, 2638, 26.38, 1579.205800000005, 1, 12891, 229.0, 5494.399999999998, 7937.599999999991, 10771.99, 102.3059767151597, 2812.1331971065315, 40.38026891765392], "isController": false}, {"data": ["Registration-0", 6636, 0, 0.0, 35577.43444846298, 260, 88986, 27351.0, 79460.90000000001, 83857.05, 88440.0, 35.85476550680787, 89.46184166981845, 23.14453125], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 3364, 31.592787377911346, 5.6983145591598205], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3641, 34.19421487603306, 6.167527737782671], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, 0.009391435011269721, 0.0016939103921402557], "isController": false}, {"data": ["Assertion failed", 3642, 34.203606311044325, 6.169221648174812], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 59035, 10648, "Assertion failed", 3642, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3641, "500/Internal Server Error", 3364, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Registration", 10000, 3364, "500/Internal Server Error", 3364, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome", 10000, 3642, "Assertion failed", 3642, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Welcome-1", 10000, 1004, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1003, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Welcome-2", 10000, 2638, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2638, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
