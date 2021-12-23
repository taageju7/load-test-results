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

    var data = {"OkPercent": 47.11827415428523, "KoPercent": 52.88172584571477};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.05511625954839251, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.010814249363867684, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.013199745547073791, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.01383587786259542, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.01431297709923664, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.009064885496183206, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.014631043256997456, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.8845419847328244, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [0.02655852417302799, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.023658051689860835, 500, 1500, "Send Email-2"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.0, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [7.952286282306163E-4, 500, 1500, "Send Email-4"], "isController": false}, {"data": [5.964214711729623E-4, 500, 1500, "Send Email-3"], "isController": false}, {"data": [6.216328222130128E-4, 500, 1500, "Send Email-6"], "isController": false}, {"data": [4.144218814753419E-4, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-8"], "isController": false}, {"data": [6.216328222130128E-4, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email"], "isController": false}, {"data": [0.04058908045977012, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 59565, 31499, 52.88172584571477, 20729.27793167107, 0, 142571, 17214.0, 61032.600000000035, 72251.9, 98491.06000000014, 314.68420635549563, 11545.336634819849, 168.17164139062788], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 3144, 1722, 54.770992366412216, 17235.962468193415, 37, 70878, 6219.5, 48749.0, 53388.25, 58750.15000000005, 21.29922566746381, 102.88760846710272, 5.5505105056533734], "isController": false}, {"data": ["Show Contact Page-5", 3144, 1693, 53.848600508905854, 17415.109732824396, 67, 68890, 6264.0, 48706.0, 53334.25, 58401.45000000001, 21.154480187860397, 863.7859418840541, 5.606148567497191], "isController": false}, {"data": ["Show Contact Page-4", 3144, 1641, 52.19465648854962, 18143.219783714983, 31, 68960, 6423.5, 49332.0, 53585.75, 57889.25000000001, 20.958183624085912, 245.21456187338762, 5.831447732863151], "isController": false}, {"data": ["Show Contact Page-3", 3144, 1478, 47.01017811704835, 20103.083969465624, 31, 65177, 8599.0, 50656.5, 54406.0, 58241.3, 21.42331489002153, 1761.1478619272807, 6.574063091968982], "isController": false}, {"data": ["Show Contact Page-7", 3144, 1967, 62.56361323155216, 15057.00159033075, 0, 67216, 5622.5, 45026.5, 52301.0, 58923.20000000004, 20.788838562502065, 482.37558941795874, 4.491709663355043], "isController": false}, {"data": ["Show Contact Page-2", 3144, 1059, 33.68320610687023, 25050.915394402018, 22, 68495, 25178.0, 52569.5, 54942.25, 57938.500000000015, 21.3031222896791, 787.7167422980302, 8.098506348503225], "isController": false}, {"data": ["Show Contact Page-1", 3144, 79, 2.5127226463104324, 607.9373409669224, 74, 15082, 125.0, 1253.0, 2926.25, 10101.2, 26.287185833012828, 155.12622071537265, 13.514059913295764], "isController": false}, {"data": ["Show Contact Page-0", 3144, 0, 0.0, 30959.96596692108, 11, 68537, 31446.0, 53373.5, 56126.5, 62171.75000000002, 26.280593821051227, 156.45166009094555, 13.165961552928982], "isController": false}, {"data": ["Send Email-2", 2515, 1179, 46.87872763419483, 12966.215506958264, 2, 62621, 12579.0, 28821.200000000004, 42163.79999999993, 54140.880000000005, 14.153385557356383, 424.06877036483655, 4.661116281458221], "isController": false}, {"data": ["Send Email-1", 2784, 269, 9.66235632183908, 27327.072198275804, 2, 62647, 27128.0, 41830.5, 50466.25, 56847.15, 15.159187807308427, 84.15465700738085, 8.500115368280053], "isController": false}, {"data": ["Show Contact Page", 7000, 5933, 84.75714285714285, 34389.955714285745, 2692, 105561, 6938.0, 85912.0, 88418.9, 93068.56, 46.19547284366132, 4460.653618250099, 56.47711055566555], "isController": false}, {"data": ["Send Email-4", 2515, 1572, 62.50497017892644, 10378.492644135184, 2, 70197, 33.0, 28326.800000000003, 34770.39999999998, 53757.20000000001, 14.163268983848804, 156.2726965593534, 3.347970735110265], "isController": false}, {"data": ["Send Email-3", 2515, 1483, 58.9662027833002, 11189.867196819117, 2, 67745, 41.0, 28832.600000000002, 36301.199999999866, 54192.080000000016, 14.16055763881851, 886.3860206633644, 3.6448524050426228], "isController": false}, {"data": ["Send Email-6", 2413, 1625, 67.34355573974305, 9399.556154164924, 2, 84990, 28.0, 28282.0, 31189.89999999999, 52915.72, 13.582887700534759, 63.39388588868562, 2.76778646566282], "isController": false}, {"data": ["Send Email-5", 2413, 1572, 65.14711976792374, 9876.040198922516, 2, 64019, 29.0, 28417.8, 32058.5, 53404.38000000002, 13.584493523017075, 421.5477785246919, 2.945817942523462], "isController": false}, {"data": ["Send Email-8", 61, 55, 90.1639344262295, 1902.8524590163938, 2, 21082, 6.0, 11639.200000000003, 15801.9, 21082.0, 1.5373758758001916, 12.230560504246686, 0.09451081203689703], "isController": false}, {"data": ["Send Email-7", 2413, 1555, 64.44260256941567, 9959.737670949009, 2, 71296, 29.0, 28207.6, 31203.399999999998, 53953.96000000002, 13.57692653943104, 296.0396183880705, 3.017190638574113], "isController": false}, {"data": ["Send Email", 7000, 6617, 94.52857142857142, 33581.99457142859, 4029, 142571, 10868.0, 79951.8, 92322.69999999998, 111933.54999999999, 37.604486752476525, 2298.661024258923, 39.52880507882169], "isController": false}, {"data": ["Send Email-0", 2784, 0, 0.0, 25432.362787356316, 23, 66502, 27004.5, 48547.5, 52542.0, 58081.850000000006, 16.30950567669217, 6.044054457653282, 12.724747022153158], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, 0.006349407917711674, 0.003357676487870394], "isController": false}, {"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 2, 0.006349407917711674, 0.003357676487870394], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 85, 0.26984983650274613, 0.14270125073449172], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 7839, 24.886504333470903, 13.160412994208007], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 75, 0.23810279691418776, 0.12591286829513976], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 19208, 60.97971364170291, 32.24712498950726], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 79, 0.2508016127496111, 0.13262822127088056], "isController": false}, {"data": ["Assertion failed", 4107, 13.038509159020922, 6.8949886678418535], "isController": false}, {"data": ["Test failed: text expected to contain /Thankyou for your feedback!/", 102, 0.32381980380329534, 0.1712415008813901], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 59565, 31499, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 19208, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 7839, "Assertion failed", 4107, "Test failed: text expected to contain /Thankyou for your feedback!/", 102, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 85], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 3144, 1722, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1715, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 3, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-5", 3144, 1693, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1690, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-4", 3144, 1641, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1637, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-3", 3144, 1478, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1473, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-7", 3144, 1967, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1833, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 67, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 63, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 2], "isController": false}, {"data": ["Show Contact Page-2", 3144, 1059, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1058, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-1", 3144, 79, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 79, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-2", 2515, 1179, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 982, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 196, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-1", 2784, 269, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 201, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 68, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 7000, 5933, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3856, "Assertion failed", 2077, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 2515, 1572, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1350, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 221, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 2515, 1483, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1282, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 198, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, null, null, null, null], "isController": false}, {"data": ["Send Email-6", 2413, 1625, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1380, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 243, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 2413, 1572, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1344, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 226, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Send Email-8", 61, 55, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 54, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-7", 2413, 1555, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1311, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 244, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email", 7000, 6617, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4417, "Assertion failed", 2030, "Test failed: text expected to contain /Thankyou for your feedback!/", 102, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 68, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
