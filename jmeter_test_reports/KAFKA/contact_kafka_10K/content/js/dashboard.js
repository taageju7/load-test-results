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

    var data = {"OkPercent": 41.63112647822519, "KoPercent": 58.36887352177481};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.048184423307188314, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.007349149045899948, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.008380608561113976, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.008251676121712223, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.008122743682310469, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.004512635379061372, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.009541000515729758, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.7298865394533265, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [0.021015987622485816, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.12464936886395511, 500, 1500, "Send Email-2"], "isController": false}, {"data": [4.6482801363495507E-4, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.0, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [7.012622720897616E-4, 500, 1500, "Send Email-4"], "isController": false}, {"data": [8.765778401122019E-4, 500, 1500, "Send Email-3"], "isController": false}, {"data": [5.681818181818182E-4, 500, 1500, "Send Email-6"], "isController": false}, {"data": [3.787878787878788E-4, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-8"], "isController": false}, {"data": [3.787878787878788E-4, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email"], "isController": false}, {"data": [0.03889061047412457, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 74329, 43385, 58.36887352177481, 22223.075354168697, 0, 159127, 2891.5, 55170.40000000011, 75189.00000000001, 93929.85000000002, 334.62237988907293, 10535.03246069693, 158.66313742808202], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 3878, 2262, 58.329035585353274, 19789.364363073713, 2, 78680, 15161.5, 49217.49999999998, 61883.149999999965, 71530.84, 19.56806943182965, 91.03046216665405, 4.698222575436472], "isController": false}, {"data": ["Show Contact Page-5", 3878, 2226, 57.40072202166065, 20326.48323878289, 3, 82000, 16410.5, 51542.5, 62854.15, 72471.56, 19.528555098423315, 739.848025451516, 4.776939259042909], "isController": false}, {"data": ["Show Contact Page-4", 3878, 2149, 55.415162454873645, 20922.458741619434, 2, 83907, 16731.0, 52104.9, 62976.74999999999, 72152.56, 19.66172504005354, 217.86629302903629, 5.102172175718429], "isController": false}, {"data": ["Show Contact Page-3", 3878, 1985, 51.18617844249613, 22559.96673543059, 2, 86375, 18184.0, 55537.4, 63187.25, 71528.19, 19.429344422455472, 1475.3060005104087, 5.492318233485308], "isController": false}, {"data": ["Show Contact Page-7", 3878, 2395, 61.758638473439916, 17845.30221763806, 0, 82500, 11192.5, 42211.899999999994, 60263.84999999994, 71534.07, 19.654749475434098, 463.7486721529629, 4.337988367370987], "isController": false}, {"data": ["Show Contact Page-2", 3878, 1515, 39.066529138731305, 27711.825683341936, 2, 82612, 23419.0, 61355.799999999996, 64398.1, 72948.36, 19.412129828003927, 663.7146327281852, 6.780586313710129], "isController": false}, {"data": ["Show Contact Page-1", 3878, 508, 13.099535843218154, 3212.2194430118657, 18, 36912, 175.0, 14612.599999999999, 20572.3, 25973.57, 22.821430252812956, 127.58757339505556, 10.458243712042748], "isController": false}, {"data": ["Show Contact Page-0", 3878, 0, 0.0, 35717.814595152144, 38, 86434, 36619.5, 63333.0, 65112.15, 74685.42, 22.800096421243246, 135.7318240077137, 11.422313929782995], "isController": false}, {"data": ["Send Email-2", 2852, 1565, 54.873772791023846, 9420.902524544204, 2, 75218, 101.0, 32508.400000000005, 38167.09999999999, 63771.7, 13.420039714283025, 280.42799701819376, 3.689145228286545], "isController": false}, {"data": ["Send Email-1", 3227, 375, 11.620700340873876, 29710.15959095135, 2, 76894, 31048.0, 43932.0, 56878.799999999996, 67516.87999999999, 14.919714643697612, 80.2563652310429, 8.180132610695775], "isController": false}, {"data": ["Show Contact Page", 10000, 8936, 89.36, 34996.58450000004, 2, 143001, 10549.5, 96608.0, 101072.84999999999, 123076.99999999996, 49.99250112483127, 3937.5557972944684, 49.55602850978603], "isController": false}, {"data": ["Send Email-4", 2852, 1972, 69.14446002805049, 8485.799438990187, 2, 80843, 32.0, 28694.500000000015, 34766.799999999996, 63155.61999999997, 13.420102862359247, 167.7436025706179, 2.6103931906035753], "isController": false}, {"data": ["Send Email-3", 2852, 1906, 66.83029453015428, 9364.65252454418, 2, 83957, 34.0, 29701.800000000025, 37995.9, 64065.00999999998, 13.432048528691459, 639.4253341233846, 2.7927568137504237], "isController": false}, {"data": ["Send Email-6", 2640, 1851, 70.11363636363636, 8368.033712121192, 2, 80974, 32.0, 28598.4, 35278.2, 62876.290000000066, 12.424406428689084, 73.99977774166412, 2.316510025707697], "isController": false}, {"data": ["Send Email-5", 2640, 1840, 69.6969696969697, 8462.592045454541, 3, 82506, 32.0, 28717.800000000003, 35176.45, 63158.870000000024, 12.422243344218481, 319.875137191679, 2.344499922360979], "isController": false}, {"data": ["Send Email-8", 375, 337, 89.86666666666666, 2633.0666666666675, 0, 28642, 10.0, 15213.400000000021, 23193.6, 27872.760000000006, 6.638225558053495, 53.886297291825244, 0.4204209520100547], "isController": false}, {"data": ["Send Email-7", 2640, 1866, 70.68181818181819, 8205.055303030302, 2, 71284, 30.0, 28563.500000000004, 34814.24999999998, 59169.09000000001, 12.428149759204597, 213.2030343412963, 2.2769632225038956], "isController": false}, {"data": ["Send Email", 10000, 9697, 96.97, 31011.7924, 1, 159127, 16624.0, 88750.0, 98830.65, 127068.45999999999, 45.81019918274605, 1830.723511970205, 35.31540465294193], "isController": false}, {"data": ["Send Email-0", 3227, 0, 0.0, 30729.99566160522, 30, 81889, 33243.0, 51248.4, 60712.99999999999, 67731.4, 15.164616208798954, 5.6485585067763795, 11.795843174924107], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 71, 0.16365103146248702, 0.09552126357141896], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 250, 0.5762360262763628, 0.3363424773641513], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 20378, 46.970150973838884, 27.4159480149067], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 441, 1.016480350351504, 0.5933081300703629], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 2, 0.004609888210210902, 0.0026907398189132104], "isController": false}, {"data": ["Assertion failed", 5151, 11.872767085398179, 6.930000403610973], "isController": false}, {"data": ["Test failed: text expected to contain /Thankyou for your feedback!/", 212, 0.48864815028235564, 0.28521842080480025], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 9, 0.02074449694594906, 0.012108329185109446], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 66, 0.15212631093695977, 0.08879441402413593], "isController": false}, {"data": ["Non HTTP response code: java.io.IOException/Non HTTP response message: Socket Closed", 1, 0.002304944105105451, 0.0013453699094566052], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 16737, 38.57784948714993, 22.517456174575198], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 51, 0.11755214936037801, 0.06861386538228686], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 16, 0.036879105681687216, 0.021525918551305683], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 74329, 43385, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 20378, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 16737, "Assertion failed", 5151, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 441, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 250], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 3878, 2262, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1938, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 300, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 15, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2], "isController": false}, {"data": ["Show Contact Page-5", 3878, 2226, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1890, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 314, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 16, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2], "isController": false}, {"data": ["Show Contact Page-4", 3878, 2149, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1816, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 316, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 13, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2], "isController": false}, {"data": ["Show Contact Page-3", 3878, 1985, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1673, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 295, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 4, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1], "isController": false}, {"data": ["Show Contact Page-7", 3878, 2395, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1729, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 384, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 165, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 62, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 37], "isController": false}, {"data": ["Show Contact Page-2", 3878, 1515, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1285, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 223, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2], "isController": false}, {"data": ["Show Contact Page-1", 3878, 508, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 441, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 66, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-2", 2852, 1565, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1430, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 134, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-1", 3227, 375, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 277, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 98, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 10000, 8936, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4391, "Assertion failed", 2814, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1731, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 2852, 1972, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1814, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 155, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 2852, 1906, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1759, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 144, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null], "isController": false}, {"data": ["Send Email-6", 2640, 1851, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1689, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 160, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 2640, 1840, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1671, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 163, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null], "isController": false}, {"data": ["Send Email-8", 375, 337, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 323, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 13, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-7", 2640, 1866, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1699, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 165, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Send Email", 10000, 9697, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4637, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2511, "Assertion failed", 2337, "Test failed: text expected to contain /Thankyou for your feedback!/", 212, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
