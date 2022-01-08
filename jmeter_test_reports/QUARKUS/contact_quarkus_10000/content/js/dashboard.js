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

    var data = {"OkPercent": 66.18940224700503, "KoPercent": 33.81059775299497};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6354617119447146, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8169945725915875, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.8200474898236092, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.8152985074626866, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.8319199457259159, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.7898575305291723, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.8497286295793759, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.8790705563093623, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [0.987449118046133, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.5204003079291762, 500, 1500, "Send Email-2"], "isController": false}, {"data": [0.783532041728763, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.2681428571428571, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [0.34106529209621994, 500, 1500, "Send Email-4"], "isController": false}, {"data": [0.4231974921630094, 500, 1500, "Send Email-3"], "isController": false}, {"data": [0.30864197530864196, 500, 1500, "Send Email-6"], "isController": false}, {"data": [0.3107638888888889, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.21227197346600332, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.3117142857142857, 500, 1500, "Send Email"], "isController": false}, {"data": [0.950295691354548, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48331, 16341, 33.81059775299497, 102.77207175518767, 0, 5311, 11.0, 93.0, 110.0, 274.0, 803.4010439176834, 39546.34282392304, 485.4737992037634], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 2948, 487, 16.51967435549525, 61.111261872455906, 1, 2010, 10.0, 99.0, 213.0, 1381.8899999999908, 49.198931909212284, 306.0620540929573, 21.017020089285715], "isController": false}, {"data": ["Show Contact Page-5", 2948, 482, 16.350067842605156, 60.15400271370421, 1, 2657, 10.0, 106.09999999999991, 214.54999999999973, 1336.8099999999927, 49.189901720311695, 3512.6166901832944, 20.97548899984983], "isController": false}, {"data": ["Show Contact Page-4", 2948, 489, 16.58751696065129, 65.12042062415185, 1, 2921, 10.0, 107.0, 212.54999999999973, 1508.5099999999998, 49.18579818473038, 886.1147528718133, 21.234727198595166], "isController": false}, {"data": ["Show Contact Page-3", 2948, 438, 14.85753052917232, 65.16994572591577, 0, 2955, 10.0, 104.09999999999991, 218.09999999999945, 1480.2599999999939, 49.184156962194265, 6395.657201895083, 21.551729756164704], "isController": false}, {"data": ["Show Contact Page-7", 2948, 597, 20.25101763907734, 50.56953867028493, 0, 2520, 8.0, 88.0, 172.0, 1035.0199999999995, 49.198931909212284, 2259.7064314919894, 20.11593257155374], "isController": false}, {"data": ["Show Contact Page-2", 2948, 400, 13.568521031207599, 56.472184531886185, 1, 2562, 9.0, 104.09999999999991, 206.1999999999989, 1246.3199999999924, 49.18743951680182, 2314.9750695817484, 21.63036892665265], "isController": false}, {"data": ["Show Contact Page-1", 2948, 82, 2.7815468113975577, 402.58344640434115, 3, 5159, 106.0, 595.8999999999983, 3145.7499999999986, 4571.589999999998, 49.198931909212284, 289.2939283628171, 25.22308390353805], "isController": false}, {"data": ["Show Contact Page-0", 2948, 0, 0.0, 32.7795115332428, 1, 2699, 3.0, 28.0, 104.0, 765.6299999999969, 49.094058086863846, 288.0919873476219, 24.594972459532375], "isController": false}, {"data": ["Send Email-2", 1299, 623, 47.95996920708237, 10.64280215550424, 1, 354, 7.0, 22.0, 29.0, 48.0, 24.487718438365977, 847.6530835862537, 6.524966215101703], "isController": false}, {"data": ["Send Email-1", 1342, 290, 21.609538002980624, 48.74441132637855, 1, 506, 19.0, 102.0, 108.0, 129.56999999999994, 25.124499194967612, 774.0767431057401, 10.254198776303966], "isController": false}, {"data": ["Show Contact Page", 7000, 4791, 68.44285714285714, 224.11657142857058, 2, 5311, 32.0, 232.90000000000055, 1501.0499999999747, 4020.99, 116.53459412665646, 16382.496256846409, 175.98224291115903], "isController": false}, {"data": ["Send Email-4", 1164, 767, 65.893470790378, 13.079896907216487, 1, 313, 10.0, 26.0, 34.0, 51.34999999999991, 21.94446015496861, 280.19822950247914, 3.851533190053353], "isController": false}, {"data": ["Send Email-3", 1276, 736, 57.68025078369906, 12.446708463949843, 1, 354, 9.0, 25.0, 33.0, 50.23000000000002, 24.054140667709767, 953.7181134771995, 5.2232756152562825], "isController": false}, {"data": ["Send Email-6", 648, 448, 69.1358024691358, 14.816358024691368, 1, 194, 12.0, 29.0, 37.0, 56.52999999999997, 19.531014527699078, 90.25974125361687, 3.0849520484206403], "isController": false}, {"data": ["Send Email-5", 864, 595, 68.86574074074075, 15.035879629629633, 1, 587, 11.0, 28.0, 35.0, 57.700000000000045, 16.287136178555272, 411.23765195554023, 2.588476032319786], "isController": false}, {"data": ["Send Email-7", 603, 475, 78.77280265339967, 16.230514096185722, 2, 192, 12.0, 31.0, 39.0, 60.960000000000036, 18.182914694086783, 256.7658528047071, 1.978861984742032], "isController": false}, {"data": ["Send Email", 7000, 4641, 66.3, 76.77842857142856, 2, 2873, 9.0, 110.0, 154.94999999999982, 1763.9899999999998, 124.30522259513789, 3812.3358609191037, 71.59386001567134], "isController": false}, {"data": ["Send Email-0", 3551, 0, 0.0, 106.30554773303295, 1, 2873, 3.0, 46.0, 1075.199999999999, 1978.92, 63.15695864828813, 375.3028255613606, 41.8168144175189], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 8, 0.04895661220243559, 0.01655252322525915], "isController": false}, {"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, 0.006119576525304449, 0.002069065403157394], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 9, 0.05507618872774004, 0.018621588628416546], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 14371, 87.94443424515023, 29.734538908774905], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 21, 0.12851110703139343, 0.04345037346630527], "isController": false}, {"data": ["Assertion failed", 1931, 11.81690227036289, 3.9953652934969273], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 48331, 16341, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 14371, "Assertion failed", 1931, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 9, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 8], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 2948, 487, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 486, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-5", 2948, 482, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 481, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-4", 2948, 489, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 488, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-3", 2948, 438, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 437, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-7", 2948, 597, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 563, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 20, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 7, null, null], "isController": false}, {"data": ["Show Contact Page-2", 2948, 400, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 399, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-1", 2948, 82, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 82, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-2", 1299, 623, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 623, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-1", 1342, 290, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 290, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 7000, 4791, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4052, "Assertion failed", 739, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 1164, 767, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 767, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 1276, 736, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 736, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-6", 648, 448, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 448, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 864, 595, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 595, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-7", 603, 475, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 475, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email", 7000, 4641, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3449, "Assertion failed", 1192, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
