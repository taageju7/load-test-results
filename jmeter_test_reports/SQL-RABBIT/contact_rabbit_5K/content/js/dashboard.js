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

    var data = {"OkPercent": 56.41625425301577, "KoPercent": 43.58374574698423};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.06023816888339004, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.016210374639769452, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.013688760806916427, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.015309798270893371, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.015489913544668587, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.011347262247838616, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.017831412103746398, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.9391210374639769, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [0.02989913544668588, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-2"], "isController": false}, {"data": [5.731753916698509E-4, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.0, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-4"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-3"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-6"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email"], "isController": false}, {"data": [0.06687046236148261, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 51728, 22545, 43.58374574698423, 20546.776987318262, 0, 119229, 22234.5, 53454.000000000015, 72094.75, 98717.59000000007, 281.30778099236477, 12882.730889659038, 179.4742626465598], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 2776, 1291, 46.50576368876081, 16708.70569164266, 28, 56901, 6282.0, 42303.00000000001, 46519.65, 50876.03, 19.942958540773148, 103.44666080267534, 6.1467936404879415], "isController": false}, {"data": ["Show Contact Page-5", 2776, 1274, 45.893371757925074, 16804.027737752207, 28, 77350, 6316.0, 41908.90000000001, 46325.6, 51368.97000000001, 19.76813740849403, 936.4931033385436, 6.141770604865127], "isController": false}, {"data": ["Show Contact Page-4", 2776, 1195, 43.04755043227666, 17763.818804034632, 29, 57375, 7394.0, 43354.100000000006, 46839.45, 52031.94, 19.940093523061122, 266.9491257914802, 6.609763220368202], "isController": false}, {"data": ["Show Contact Page-3", 2776, 1075, 38.72478386167147, 19128.547550432235, 25, 56806, 10832.5, 44280.0, 46607.950000000004, 50942.86, 19.947400945633273, 1887.2259918572963, 7.078250131587457], "isController": false}, {"data": ["Show Contact Page-7", 2776, 1565, 56.37608069164265, 14817.898775216154, 0, 63949, 5680.0, 39167.10000000001, 46124.950000000004, 52034.9, 19.872432726517815, 527.7330928732882, 5.003377152518773], "isController": false}, {"data": ["Show Contact Page-2", 2776, 791, 28.49423631123919, 22444.71181556189, 22, 55918, 23817.0, 45487.6, 47182.45, 50393.19, 20.03825748005919, 794.403518289602, 8.213705866297326], "isController": false}, {"data": ["Show Contact Page-1", 2776, 0, 0.0, 265.94920749279567, 75, 5068, 123.0, 385.3000000000002, 897.7000000000016, 3302.46, 25.201768481448195, 150.47227782770923, 13.289995097638696], "isController": false}, {"data": ["Show Contact Page-0", 2776, 0, 0.0, 26159.943443804037, 14, 53563, 28343.0, 45709.0, 47778.8, 50445.17, 25.183021418268577, 149.9176743806301, 12.616103503488066], "isController": false}, {"data": ["Send Email-2", 2449, 948, 38.70967741935484, 15247.683135973848, 2, 54033, 15225.0, 30196.0, 39872.0, 47110.5, 13.830376000993935, 498.8003283143629, 5.2758993944622015], "isController": false}, {"data": ["Send Email-1", 2617, 168, 6.419564386702331, 26677.002292701534, 3, 56582, 27125.0, 38589.4, 44714.3, 48028.50000000001, 14.837956138162522, 82.95079301490598, 8.616619807849318], "isController": false}, {"data": ["Show Contact Page", 5000, 3921, 78.42, 35524.6256, 3100, 101207, 14803.0, 77179.9, 79136.8, 81874.78, 35.55681979803727, 4755.505730481528, 59.129317653516566], "isController": false}, {"data": ["Send Email-4", 2449, 1195, 48.79542670477746, 13455.261331155558, 2, 71929, 10485.0, 29840.0, 40155.0, 47530.0, 13.83318835504242, 173.8858511749596, 4.4676804909115555], "isController": false}, {"data": ["Send Email-3", 2449, 1094, 44.67129440587995, 14117.208248264575, 2, 51401, 14171.0, 29958.0, 39332.0, 46775.5, 13.829282616552222, 1159.7941970411603, 4.802035216954283], "isController": false}, {"data": ["Send Email-6", 2313, 1240, 53.61003026372676, 12446.047989623847, 3, 65184, 4894.0, 29624.199999999997, 37174.39999999995, 47362.3, 13.060712833717306, 62.06708795123831, 3.7808711006318605], "isController": false}, {"data": ["Send Email-5", 2313, 1195, 51.66450497189797, 12912.627756160817, 2, 64069, 5336.0, 29957.0, 39337.09999999999, 47111.74, 13.059606687331675, 555.0674535054994, 3.9267725289507713], "isController": false}, {"data": ["Send Email-7", 2313, 1213, 52.442715088629484, 12607.715088629442, 2, 71827, 5459.0, 29367.79999999999, 35473.2, 47980.38000000001, 13.061450368747389, 373.4226910318291, 3.882294478389031], "isController": false}, {"data": ["Send Email", 5000, 4380, 87.6, 38772.5742, 4161, 119229, 39054.5, 80801.30000000002, 95932.64999999998, 105248.43, 27.706664006826923, 2893.128183452403, 45.36388828569173], "isController": false}, {"data": ["Send Email-0", 2617, 0, 0.0, 21634.431792128387, 38, 56065, 26121.0, 42737.600000000006, 46136.4, 49835.34000000001, 15.892583865717686, 5.90511689619416, 12.380177937577429], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 4, 0.01774229319139499, 0.007732755954222085], "isController": false}, {"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 3, 0.01330671989354624, 0.005799566965666564], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 160, 0.7096917276557995, 0.30931023816888337], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5642, 25.02550454646263, 10.907052273430251], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 101, 0.44799290308272344, 0.19525208784410764], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 13101, 58.11044577511643, 25.326708939065885], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 8, 0.03548458638278998, 0.01546551190844417], "isController": false}, {"data": ["Assertion failed", 3390, 15.036593479707252, 6.553510671203217], "isController": false}, {"data": ["Test failed: text expected to contain /Thankyou for your feedback!/", 136, 0.6032379685074296, 0.2629137024435509], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 51728, 22545, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 13101, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5642, "Assertion failed", 3390, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 160, "Test failed: text expected to contain /Thankyou for your feedback!/", 136], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 2776, 1291, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1282, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 4, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, null, null], "isController": false}, {"data": ["Show Contact Page-5", 2776, 1274, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1266, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 2, null, null], "isController": false}, {"data": ["Show Contact Page-4", 2776, 1195, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1187, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 5, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["Show Contact Page-3", 2776, 1075, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1066, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1], "isController": false}, {"data": ["Show Contact Page-7", 2776, 1565, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1339, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 134, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 85, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 3], "isController": false}, {"data": ["Show Contact Page-2", 2776, 791, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 786, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-2", 2449, 948, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 761, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 186, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-1", 2617, 168, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 145, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 23, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 5000, 3921, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2224, "Assertion failed", 1697, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 2449, 1195, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 993, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 197, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 2449, 1094, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 900, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 194, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-6", 2313, 1240, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1004, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 234, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 2313, 1195, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 981, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 212, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Send Email-7", 2313, 1213, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 957, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 255, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email", 5000, 4380, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2528, "Assertion failed", 1693, "Test failed: text expected to contain /Thankyou for your feedback!/", 136, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 23, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
