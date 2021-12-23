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

    var data = {"OkPercent": 99.24761904761905, "KoPercent": 0.7523809523809524};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1128095238095238, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1225, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.1445, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.056, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0445, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.0735, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0435, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9775, 500, 1500, "Login-2"], "isController": false}, {"data": [0.212, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0575, 500, 1500, "Login-3"], "isController": false}, {"data": [0.055, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0575, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0505, 500, 1500, "Login-6"], "isController": false}, {"data": [0.042, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.054, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0435, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0515, 500, 1500, "Login-8"], "isController": false}, {"data": [0.005, 500, 1500, "Logout"], "isController": false}, {"data": [0.1125, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.1215, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0445, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 21000, 158, 0.7523809523809524, 7988.441666666671, 11, 41692, 7827.0, 14317.600000000006, 22472.550000000007, 32122.970000000005, 174.6187490645424, 14493.552504765637, 179.1894987610384], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 1000, 0, 0.0, 6384.201999999996, 15, 16840, 6128.5, 12320.8, 12888.099999999999, 14304.34, 11.44990095835671, 1360.6708962123728, 6.899012589166103], "isController": false}, {"data": ["Login Welcome-0", 1000, 0, 0.0, 5181.272000000003, 11, 12993, 4813.0, 10349.0, 10960.349999999999, 12117.97, 13.88946761670625, 35.71383616678473, 6.931169875133686], "isController": false}, {"data": ["Login", 1000, 79, 7.9, 21831.446000000014, 2305, 41692, 23979.5, 33939.399999999994, 37144.899999999994, 39497.16, 8.692704213353734, 3342.625661528373, 48.79832871895618], "isController": false}, {"data": ["Login-0", 1000, 0, 0.0, 4847.369999999998, 386, 18287, 3677.0, 11181.899999999998, 13740.099999999997, 16127.93, 10.104786637430152, 4.332032552570153, 7.400966775461536], "isController": false}, {"data": ["Logout-2", 1000, 0, 0.0, 6673.961999999997, 50, 15637, 6557.5, 11794.4, 12773.95, 13795.93, 8.705114254624592, 1034.4889145810664, 5.2451713819368875], "isController": false}, {"data": ["Login-1", 1000, 0, 0.0, 7971.76899999999, 40, 16954, 8904.5, 13207.2, 13823.249999999996, 15471.61, 9.227305442264749, 43.46024819144814, 5.595856132467198], "isController": false}, {"data": ["Logout-1", 1000, 0, 0.0, 7208.298999999999, 32, 16076, 7626.5, 12026.099999999999, 12741.849999999999, 13934.6, 8.72356759020169, 23.154938193523623, 4.412898448949682], "isController": false}, {"data": ["Login-2", 1000, 0, 0.0, 179.39100000000028, 74, 3261, 106.0, 186.89999999999998, 228.94999999999993, 2897.86, 9.226794611551947, 55.09045142092637, 5.3072090099649385], "isController": false}, {"data": ["Logout-0", 1000, 0, 0.0, 3855.0970000000025, 27, 15774, 2390.5, 10009.9, 11639.099999999999, 13957.940000000002, 8.85959316748175, 3.9106797965837408, 5.000825049613722], "isController": false}, {"data": ["Login-3", 1000, 0, 0.0, 7804.6480000000065, 50, 16814, 8899.5, 12381.9, 13140.85, 14441.93, 8.76439551964101, 475.87072900050833, 5.4435112797770335], "isController": false}, {"data": ["Login-4", 1000, 0, 0.0, 7855.076000000004, 24, 17062, 8965.0, 12420.9, 13122.0, 14411.070000000002, 8.891180837727058, 1356.6604808128318, 5.574353611153097], "isController": false}, {"data": ["Login-5", 1000, 0, 0.0, 7865.058000000002, 19, 17302, 8956.5, 12560.699999999999, 13238.849999999995, 14514.41, 8.831659733813776, 188.40586609879094, 5.5629106721776225], "isController": false}, {"data": ["Login-6", 1000, 0, 0.0, 7873.301999999994, 43, 17766, 8914.0, 12516.9, 13163.5, 14512.440000000002, 8.835092989353713, 752.0182665547554, 5.496049056853823], "isController": false}, {"data": ["Logout-4", 1000, 0, 0.0, 6712.167000000006, 44, 17068, 6546.0, 11888.8, 12770.8, 14922.710000000003, 8.707388218903741, 319.27373579607297, 5.229534916626758], "isController": false}, {"data": ["Login-7", 1000, 0, 0.0, 7873.437999999999, 73, 15553, 8992.0, 12370.8, 13024.65, 14220.920000000002, 8.783024170882518, 63.205180776595, 5.4808129347596966], "isController": false}, {"data": ["Logout-3", 1000, 0, 0.0, 6689.3319999999985, 38, 15411, 6679.0, 11708.199999999999, 12757.499999999998, 13965.92, 8.704962699234834, 741.2479760961725, 5.160070662534711], "isController": false}, {"data": ["Login-8", 1000, 79, 7.9, 7495.502999999999, 49, 17947, 8637.5, 12485.3, 13214.8, 14536.98, 8.832829862031197, 467.2177886706812, 5.084397689331708], "isController": false}, {"data": ["Logout", 1000, 0, 0.0, 18342.573999999986, 829, 38185, 18041.5, 29870.6, 33647.2, 36852.9, 8.677467220867573, 2115.149583264637, 24.871451458248366], "isController": false}, {"data": ["Login Welcome-3", 1000, 0, 0.0, 6455.738000000003, 15, 15557, 6399.5, 12295.4, 12857.699999999999, 14008.220000000001, 11.749638698610019, 430.82391036788124, 7.056667773090978], "isController": false}, {"data": ["Login Welcome-2", 1000, 0, 0.0, 6416.078999999998, 15, 15500, 5955.0, 12383.0, 13102.4, 14189.79, 11.613187936220372, 988.8901711783902, 6.883989333286881], "isController": false}, {"data": ["Login Welcome", 1000, 0, 0.0, 12241.55199999999, 34, 28419, 11769.0, 23192.3, 24580.85, 26016.91, 11.416958750528035, 2776.9187804690087, 26.201028382559453], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 79, 50.0, 0.3761904761904762], "isController": false}, {"data": ["Assertion failed", 79, 50.0, 0.3761904761904762], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 21000, 158, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 79, "Assertion failed", 79, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 1000, 79, "Assertion failed", 79, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 1000, 79, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 79, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
