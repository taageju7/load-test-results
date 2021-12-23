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

    var data = {"OkPercent": 40.07800398318212, "KoPercent": 59.92199601681788};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04853120159327285, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.006212857914640735, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.006482982171799027, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.005672609400324149, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.006212857914640735, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.0025661804430037816, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.004321988114532685, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.8631820637493247, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [0.016072393300918423, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.006657323055360897, 500, 1500, "Send Email-2"], "isController": false}, {"data": [1.591849729385546E-4, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.0, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [7.00770847932726E-4, 500, 1500, "Send Email-4"], "isController": false}, {"data": [0.0012263489838822705, 500, 1500, "Send Email-3"], "isController": false}, {"data": [7.665772326561902E-4, 500, 1500, "Send Email-6"], "isController": false}, {"data": [0.0013415101571483327, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.029411764705882353, 500, 1500, "Send Email-8"], "isController": false}, {"data": [5.749329244921426E-4, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email"], "isController": false}, {"data": [0.033428844317096466, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 72304, 43326, 59.92199601681788, 19298.700307036826, 0, 137908, 1761.5, 54386.10000000007, 71127.5, 85149.86000000002, 370.50284138948814, 11237.462217758619, 169.32775373300674], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 3702, 2220, 59.967585089141004, 16711.259049162618, 2, 74709, 6560.5, 45828.7, 55473.45, 62041.78999999996, 23.126514905419924, 106.44057842056274, 5.334258219533222], "isController": false}, {"data": ["Show Contact Page-5", 3702, 2195, 59.29227444624527, 16822.4540788763, 3, 78871, 6521.0, 45881.50000000001, 54510.399999999994, 60936.899999999965, 23.039725166325404, 837.5329692177415, 5.385567848007518], "isController": false}, {"data": ["Show Contact Page-4", 3702, 2101, 56.753106428957324, 17865.202052944413, 2, 74404, 6872.5, 48503.40000000001, 55590.45, 62051.79999999999, 23.365459261924148, 253.63600477746957, 5.881329920347895], "isController": false}, {"data": ["Show Contact Page-3", 3702, 1841, 49.729875742841706, 20233.530524041063, 2, 88415, 9202.0, 51050.100000000006, 55947.5, 60591.519999999975, 23.494916415978064, 1835.7406083006485, 6.839724355587499], "isController": false}, {"data": ["Show Contact Page-7", 3702, 2476, 66.8827660723933, 14863.877633711507, 0, 83524, 5921.0, 41536.90000000001, 53934.5, 61109.03999999997, 23.132873425314937, 482.33077993776243, 4.421515599223905], "isController": false}, {"data": ["Show Contact Page-2", 3702, 1393, 37.62830902215019, 24603.839005942817, 3, 85051, 25532.5, 53230.20000000001, 56331.7, 60014.64, 23.42845208938505, 818.7222122843532, 8.376628574468556], "isController": false}, {"data": ["Show Contact Page-1", 3702, 19, 0.5132360886007563, 565.5696920583472, 2, 8957, 177.0, 1462.0000000000027, 3236.2999999999984, 5331.099999999994, 28.66634144075081, 170.678905469603, 15.039430012544429], "isController": false}, {"data": ["Show Contact Page-0", 3702, 0, 0.0, 35054.29659643432, 65, 72471, 35370.5, 57363.600000000006, 59376.0, 66964.86999999997, 28.612281176334196, 170.3324863778645, 14.334082269003362], "isController": false}, {"data": ["Send Email-2", 2854, 1629, 57.07778556412053, 9824.775753328686, 2, 65276, 107.0, 25005.5, 27840.25, 55033.19999999997, 16.397115854184023, 434.55544426510295, 4.3815902749849185], "isController": false}, {"data": ["Send Email-1", 3141, 287, 9.137217446673034, 26551.40719516074, 3, 66748, 26230.0, 34607.200000000004, 52767.99999999998, 58927.619999999995, 16.936266580394694, 91.86684460260972, 9.544963789361587], "isController": false}, {"data": ["Show Contact Page", 10000, 8899, 88.99, 30771.137500000026, 4142, 103375, 6638.5, 87330.8, 89651.99999999997, 95505.94, 62.04320688927769, 4647.413175136728, 59.29343257144276], "isController": false}, {"data": ["Send Email-4", 2854, 2212, 77.5052557813595, 5955.890679747713, 2, 78567, 19.0, 23161.5, 27230.25, 54843.8, 16.403618681962914, 121.04607419921719, 2.3296818781396205], "isController": false}, {"data": ["Send Email-3", 2854, 2006, 70.28731604765241, 7363.943938332178, 2, 68926, 23.0, 24176.0, 27403.75, 54925.14999999996, 16.403712963761244, 741.8365246105985, 3.0607658346983935], "isController": false}, {"data": ["Send Email-6", 2609, 2091, 80.14564967420468, 5413.573016481416, 2, 72518, 19.0, 21609.0, 26769.5, 52492.4, 14.99502847848452, 55.9969359945342, 1.8577424622537946], "isController": false}, {"data": ["Send Email-5", 2609, 2031, 77.84591797623611, 5890.65542353393, 2, 69838, 20.0, 23583.0, 27329.5, 54027.0, 14.995459404779695, 310.3711750244991, 2.0669429760153117], "isController": false}, {"data": ["Send Email-8", 17, 16, 94.11764705882354, 91.58823529411765, 3, 1461, 6.0, 301.799999999999, 1461.0, 1461.0, 0.9293172251680971, 5.3844665650795385, 0.034166074454709455], "isController": false}, {"data": ["Send Email-7", 2609, 2015, 77.23265619011116, 6016.141050210804, 2, 85051, 18.0, 22507.0, 27000.0, 54944.30000000002, 14.990892845856388, 223.24770664728885, 2.1330976821287186], "isController": false}, {"data": ["Send Email", 10000, 9895, 98.95, 26699.82079999988, 3, 137908, 7512.5, 74139.29999999999, 83882.54999999999, 111358.59999999999, 52.64487870619946, 1924.6142508206021, 36.66949207891994], "isController": false}, {"data": ["Send Email-0", 3141, 0, 0.0, 26381.09169054438, 34, 68046, 26103.0, 48002.600000000006, 54914.29999999997, 61405.77999999999, 17.853082939250633, 6.664721564233584, 13.86879608387425], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 8, 0.018464663250703964, 0.011064394777605666], "isController": false}, {"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 6, 0.013848497438027975, 0.00829829608320425], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 92, 0.2123436273830956, 0.12724053994246515], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 10905, 25.169644093615844, 15.082153131223722], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 137, 0.3162073581683054, 0.189477760566497], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 26812, 61.88431888473434, 37.08231909714539], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 9, 0.02077274615704196, 0.012447444124806374], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 7, 0.01615658034436597, 0.009681345430404957], "isController": false}, {"data": ["Assertion failed", 5105, 11.782763236855468, 7.060466917459615], "isController": false}, {"data": ["Test failed: text expected to contain /Thankyou for your feedback!/", 245, 0.5654803120528089, 0.3388470900641735], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 72304, 43326, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 26812, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 10905, "Assertion failed", 5105, "Test failed: text expected to contain /Thankyou for your feedback!/", 245, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 137], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 3702, 2220, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2172, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 27, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2], "isController": false}, {"data": ["Show Contact Page-5", 3702, 2195, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2148, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 32, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1], "isController": false}, {"data": ["Show Contact Page-4", 3702, 2101, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2053, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 29, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1], "isController": false}, {"data": ["Show Contact Page-3", 3702, 1841, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1813, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 16, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 5, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1], "isController": false}, {"data": ["Show Contact Page-7", 3702, 2476, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2256, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 97, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 68, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 39, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 6], "isController": false}, {"data": ["Show Contact Page-2", 3702, 1393, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1365, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1], "isController": false}, {"data": ["Show Contact Page-1", 3702, 19, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 19, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-2", 2854, 1629, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1422, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 207, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-1", 3141, 287, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 236, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 51, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 10000, 8899, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 6298, "Assertion failed", 2601, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 2854, 2212, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1975, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 237, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 2854, 2006, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1780, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 226, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-6", 2609, 2091, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1845, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 245, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 2609, 2031, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1793, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 238, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-8", 17, 16, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-7", 2609, 2015, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1760, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 254, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email", 10000, 9895, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 7064, "Assertion failed", 2504, "Test failed: text expected to contain /Thankyou for your feedback!/", 245, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 82, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
