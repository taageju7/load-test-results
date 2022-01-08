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

    var data = {"OkPercent": 77.30015240401679, "KoPercent": 22.699847595983215};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03235975698866365, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.022166666666666668, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.03383333333333333, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.006247633472169633, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.00605831124574025, 500, 1500, "Login-1"], "isController": false}, {"data": [6.864988558352403E-4, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.3582058701942952, 500, 1500, "Login-2"], "isController": false}, {"data": [0.11967963386727688, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0016535758577924762, 500, 1500, "Login-3"], "isController": false}, {"data": [0.002066969822240595, 500, 1500, "Login-4"], "isController": false}, {"data": [0.010382513661202186, 500, 1500, "Login-5"], "isController": false}, {"data": [0.003278688524590164, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.00273224043715847, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.004918032786885246, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.023166666666666665, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.023333333333333334, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.017333333333333333, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 47899, 10873, 22.699847595983215, 35059.60195411178, 0, 175388, 31268.5, 77407.00000000001, 117215.85, 132542.13000000015, 150.1305442110773, 9777.770843242339, 123.06776226966706], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 387, 12.9, 36158.66166666673, 24, 76689, 46111.5, 59608.4, 60592.9, 63864.40999999999, 17.034517610852124, 1769.515113787029, 8.939911138374226], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 29623.317999999967, 16, 61956, 28603.5, 53904.0, 55537.899999999994, 57410.50999999999, 24.686887970902387, 63.477125026744126, 12.31933569641711], "isController": false}, {"data": ["Login", 3000, 2503, 83.43333333333334, 84219.4833333333, 4174, 175388, 97033.0, 127459.0, 137319.25, 153997.63999999984, 10.329155763668917, 1763.5325625290507, 28.59788838701625], "isController": false}, {"data": ["Login-0", 2641, 0, 0.0, 29636.220371071544, 658, 69742, 40890.0, 54043.4, 57957.700000000004, 63046.92, 11.520576508667697, 4.302852580460823, 8.437922247559348], "isController": false}, {"data": ["Logout-2", 2110, 310, 14.691943127962086, 19675.125118483393, 3, 74853, 15797.5, 36628.8, 44059.85, 59033.929999999986, 6.795972661509028, 691.606300657776, 3.4932275797318972], "isController": false}, {"data": ["Login-1", 2641, 222, 8.405906853464597, 36757.25028398336, 41, 76377, 39022.0, 58309.8, 60185.9, 63208.9, 10.191756293149025, 34.3106013162744, 5.723543153607635], "isController": false}, {"data": ["Logout-1", 2185, 75, 3.4324942791762014, 29350.87002288331, 3, 78016, 29769.0, 47750.6, 50439.99999999998, 59222.82, 7.050365747806643, 18.8342392411338, 3.4440739215521776], "isController": false}, {"data": ["Login-2", 2419, 477, 19.71889210417528, 15484.307151715593, 3, 55059, 244.0, 39291.0, 45768.0, 49911.6, 8.422203421106689, 448.26306742811187, 4.158022968043326], "isController": false}, {"data": ["Logout-0", 2185, 0, 0.0, 18287.619679633855, 20, 89827, 4103.0, 48228.0, 50996.299999999996, 59830.759999999995, 7.375154000641317, 3.255439070595582, 4.162928723018244], "isController": false}, {"data": ["Login-3", 2419, 770, 31.831335262505167, 26001.176519222805, 3, 73721, 31071.0, 49019.0, 57585.0, 61165.600000000006, 8.399947218190277, 425.0492977924963, 3.624151085325962], "isController": false}, {"data": ["Login-4", 2419, 748, 30.921868540719306, 26408.78503513851, 3, 72777, 31631.0, 49355.0, 57586.0, 61140.400000000016, 8.423112547269017, 487.1649934896287, 3.723502853986615], "isController": false}, {"data": ["Login-5", 915, 272, 29.726775956284154, 28827.688524590136, 102, 69201, 29621.0, 58644.6, 59579.0, 61585.16, 3.9720265149048672, 62.94279600143905, 1.7581736858127028], "isController": false}, {"data": ["Login-6", 915, 267, 29.18032786885246, 29135.245901639366, 522, 79278, 30594.0, 58753.2, 60025.2, 62553.840000000004, 3.9612104420104766, 242.10644180348714, 1.7451039547166542], "isController": false}, {"data": ["Logout-4", 2110, 300, 14.218009478672986, 19799.068246445484, 3, 74698, 15821.0, 36890.8, 44475.79999999999, 58942.09999999999, 6.795928884308168, 216.3216342940769, 3.5012256727486473], "isController": false}, {"data": ["Login-7", 915, 262, 28.633879781420767, 29326.155191256843, 513, 74470, 31088.0, 58830.0, 59890.2, 63076.28000000001, 3.9738550737226124, 23.682511135751668, 1.7697218505027035], "isController": false}, {"data": ["Logout-3", 2110, 297, 14.075829383886257, 19844.934123222774, 3, 74547, 15814.0, 36965.90000000001, 43720.29999999995, 58854.14, 6.796038328367823, 499.78080146851596, 3.4614646660359125], "isController": false}, {"data": ["Login-8", 915, 330, 36.0655737704918, 27588.289617486353, 0, 91452, 25466.0, 58413.0, 59716.0, 64863.480000000025, 3.9667572734721483, 149.11245330118743, 1.5850771891948132], "isController": false}, {"data": ["Logout", 3000, 1245, 41.5, 50730.05000000005, 2, 169161, 44078.5, 115456.8, 121306.4, 141365.29999999996, 9.61686413294353, 1429.7577638396692, 17.781653783074], "isController": false}, {"data": ["Login Welcome-3", 3000, 795, 26.5, 29747.636666666676, 28, 79440, 26353.5, 59736.8, 60829.0, 67528.82999999996, 17.035775127768314, 472.1105728279387, 7.520113527470188], "isController": false}, {"data": ["Login Welcome-2", 3000, 666, 22.2, 31745.63833333328, 22, 77753, 31803.5, 59556.9, 60849.149999999994, 68534.57999999993, 16.982253545045428, 1135.8991904241318, 7.831837214485862], "isController": false}, {"data": ["Login Welcome", 3000, 947, 31.566666666666666, 72899.28566666658, 66, 123309, 88660.5, 106197.1, 109060.0, 116628.09999999998, 16.95767928506424, 3409.338174456365, 32.668008649123], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 0.00919709371838499, 0.0020877262573331386], "isController": false}, {"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, 0.00919709371838499, 0.0020877262573331386], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 70, 0.6437965602869493, 0.1461408380133197], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2437, 22.413317391704222, 5.0877888891208585], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 11, 0.10116803090223489, 0.022964988830664522], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1504, 13.832428952451025, 3.13994029102904], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 5129, 47.171893681596615, 10.707947973861668], "isController": false}, {"data": ["Assertion failed", 1720, 15.819001195622183, 3.5908891626129984], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 47899, 10873, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 5129, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2437, "Assertion failed", 1720, "Test failed: text expected to contain /The electronic survey app/", 1504, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 70], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 387, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 387, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2503, "Test failed: text expected to contain /The electronic survey app/", 1504, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 581, "Assertion failed", 418, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2110, 310, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 236, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 74, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 2641, 222, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 222, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2185, 75, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 52, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 23, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2419, 477, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 447, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 30, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2419, 770, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 471, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 299, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 2419, 748, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 465, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 283, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 915, 272, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 270, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 915, 267, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 266, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2110, 300, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 226, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 74, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 915, 262, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 261, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2110, 297, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 224, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 73, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 915, 330, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 251, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 66, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 11, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1], "isController": false}, {"data": ["Logout", 3000, 1245, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 545, "Assertion failed", 355, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 345, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 3000, 795, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 795, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 666, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 666, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 947, "Assertion failed", 947, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
