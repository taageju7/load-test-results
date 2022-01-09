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

    var data = {"OkPercent": 99.61904761904762, "KoPercent": 0.38095238095238093};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.15047619047619049, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.055, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.005, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.27, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.135, 500, 1500, "Login-1"], "isController": false}, {"data": [0.32, 500, 1500, "Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login-2"], "isController": false}, {"data": [0.235, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.12, 500, 1500, "Login-3"], "isController": false}, {"data": [0.055, 500, 1500, "Login-4"], "isController": false}, {"data": [0.085, 500, 1500, "Login-5"], "isController": false}, {"data": [0.1, 500, 1500, "Login-6"], "isController": false}, {"data": [0.265, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.095, 500, 1500, "Login-7"], "isController": false}, {"data": [0.245, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.045, 500, 1500, "Login-8"], "isController": false}, {"data": [0.015, 500, 1500, "Logout"], "isController": false}, {"data": [0.08, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.035, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2100, 8, 0.38095238095238093, 5296.399047619055, 81, 42583, 2876.0, 10651.300000000001, 24855.44999999999, 36965.86999999997, 38.427052645062126, 3198.521080269081, 49.572041574411244], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 100, 0, 0.0, 3360.9, 533, 7477, 3190.0, 5603.100000000001, 6317.499999999996, 7473.859999999999, 9.9601593625498, 1183.2552602091635, 7.703560756972112], "isController": false}, {"data": ["Login Welcome-0", 100, 0, 0.0, 3624.349999999999, 1239, 6779, 3472.5, 5151.500000000001, 5811.349999999996, 6778.12, 13.599891200870392, 40.30986502107983, 6.932757037943697], "isController": false}, {"data": ["Login", 100, 4, 4.0, 29641.450000000004, 7196, 42583, 31660.0, 38349.0, 40738.549999999996, 42573.06, 2.0451988955925966, 790.7803871817159, 14.313196645873811], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 20864.300000000003, 3151, 36854, 21508.0, 29867.400000000005, 31049.949999999993, 36824.419999999984, 2.3166380947968306, 1.2171399365241162, 2.092666247741278], "isController": false}, {"data": ["Logout-2", 100, 0, 0.0, 1810.67, 228, 7406, 1620.0, 3246.2000000000016, 3831.899999999998, 7385.929999999989, 2.479543763947434, 294.56689344160674, 1.9177721299280932], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 3010.2799999999993, 322, 8746, 2791.0, 5491.9000000000015, 6687.199999999995, 8740.349999999997, 2.3671440407148774, 11.348144011125578, 1.8400846253994556], "isController": false}, {"data": ["Logout-1", 100, 0, 0.0, 1575.6700000000005, 165, 6114, 1335.5, 2718.9, 3294.3499999999995, 6105.629999999996, 2.4499595756670014, 6.717219732280667, 1.6771695923267267], "isController": false}, {"data": ["Login-2", 100, 0, 0.0, 117.21999999999998, 81, 185, 111.5, 145.8, 165.84999999999997, 184.91999999999996, 2.5218136884047007, 15.057000870025721, 1.4505354125687193], "isController": false}, {"data": ["Logout-0", 100, 0, 0.0, 2150.48, 259, 7505, 1969.0, 3796.2, 5641.699999999992, 7492.479999999994, 2.4318474745263976, 1.308542928187544, 1.7882628401546654], "isController": false}, {"data": ["Login-3", 100, 0, 0.0, 3372.14, 351, 11863, 2615.5, 6907.3, 7551.799999999999, 11841.979999999989, 2.419023198432473, 131.25090713369943, 1.9158474745397809], "isController": false}, {"data": ["Login-4", 100, 0, 0.0, 3343.380000000002, 342, 9966, 2838.0, 5978.800000000002, 7687.549999999998, 9953.199999999993, 2.4174442779093943, 368.77357008170964, 1.9287616943866943], "isController": false}, {"data": ["Login-5", 100, 0, 0.0, 3369.39, 594, 9868, 3134.5, 6191.8, 6495.849999999999, 9857.419999999995, 2.322286988226005, 49.452919985601824, 1.8596438772903556], "isController": false}, {"data": ["Login-6", 100, 0, 0.0, 3290.67, 381, 9461, 2707.5, 6432.300000000002, 7264.95, 9459.24, 2.397334164409177, 203.96303685301945, 1.9010110756838394], "isController": false}, {"data": ["Logout-4", 100, 0, 0.0, 1868.5300000000002, 205, 6885, 1553.0, 3357.1000000000004, 4644.25, 6883.4, 2.484286885449532, 90.99671142523539, 1.9165885151417286], "isController": false}, {"data": ["Login-7", 100, 0, 0.0, 3349.6500000000005, 408, 11009, 2865.5, 6370.9000000000015, 8197.949999999986, 10998.979999999994, 2.3943493355680596, 17.139238896204954, 1.903320663234766], "isController": false}, {"data": ["Logout-3", 100, 0, 0.0, 1854.3600000000004, 268, 5676, 1699.5, 3274.3000000000006, 3940.3999999999996, 5671.939999999998, 2.4905979925780177, 211.98539964758038, 1.901999638863291], "isController": false}, {"data": ["Login-8", 100, 4, 4.0, 3122.4500000000003, 792, 8895, 2597.0, 5954.400000000003, 6508.65, 8891.769999999999, 2.356101123860236, 129.64455637560965, 1.8002085149494618], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 6293.669999999998, 890, 13322, 6115.0, 9323.2, 10919.899999999989, 13310.999999999995, 2.3952669525018564, 584.018409310702, 8.930790258449303], "isController": false}, {"data": ["Login Welcome-3", 100, 0, 0.0, 3166.9699999999993, 697, 7619, 2920.0, 5792.6, 6059.949999999999, 7615.3899999999985, 11.122233344455568, 407.39524246468693, 8.580629240351463], "isController": false}, {"data": ["Login Welcome-2", 100, 0, 0.0, 3635.0900000000015, 433, 8069, 3260.0, 6225.500000000001, 7078.999999999999, 8065.3899999999985, 10.01903616872057, 852.7628274972448, 7.651256136659653], "isController": false}, {"data": ["Login Welcome", 100, 0, 0.0, 8402.76, 4036, 12487, 8683.5, 10738.9, 11264.699999999999, 12484.239999999998, 7.9687624511913295, 1940.441282671926, 22.458836361463067], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 4, 50.0, 0.19047619047619047], "isController": false}, {"data": ["Assertion failed", 4, 50.0, 0.19047619047619047], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2100, 8, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 4, "Assertion failed", 4, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 100, 4, "Assertion failed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 100, 4, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
