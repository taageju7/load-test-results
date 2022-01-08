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

    var data = {"OkPercent": 38.960517734410274, "KoPercent": 61.039482265589726};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.26679375909296144, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0011, 500, 1500, "Login"], "isController": false}, {"data": [0.2321637426900585, 500, 1500, "Login-0"], "isController": false}, {"data": [0.8883040935672515, 500, 1500, "Login-1"], "isController": false}, {"data": [0.8865497076023392, 500, 1500, "Login-2"], "isController": false}, {"data": [0.4789473684210526, 500, 1500, "Login-3"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.4461988304093567, 500, 1500, "Login-4"], "isController": false}, {"data": [0.3198830409356725, 500, 1500, "Login-5"], "isController": false}, {"data": [0.2795321637426901, 500, 1500, "Login-6"], "isController": false}, {"data": [0.16287878787878787, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0094, 500, 1500, "Welcome"], "isController": false}, {"data": [0.5076023391812865, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.7543859649122807, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.7087719298245614, 500, 1500, "Welcome-2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19933, 12167, 61.039482265589726, 3423.1497015000255, 0, 16387, 4550.0, 5426.600000000002, 6334.5999999999985, 9809.119999999995, 268.31697828749884, 9661.873177514504, 127.4434766587247], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login", 5000, 4848, 96.96, 5047.927400000011, 44, 16387, 4752.0, 6281.800000000001, 7660.9, 14251.629999999992, 69.96040241223469, 2069.747515093957, 45.697656610733326], "isController": false}, {"data": ["Login-0", 855, 0, 0.0, 2904.9590643274846, 531, 11006, 1596.0, 6486.0, 7142.5999999999985, 10406.919999999995, 12.463011821640453, 7.582476918830081, 9.870607995459382], "isController": false}, {"data": ["Login-1", 855, 0, 0.0, 338.47602339181316, 8, 4738, 94.0, 903.7999999999998, 1395.1999999999998, 3961.44, 13.320869362000467, 59.644712914816544, 8.88491579516242], "isController": false}, {"data": ["Login-2", 855, 1, 0.11695906432748537, 435.46081871345086, 0, 4795, 183.0, 975.8, 1280.7999999999993, 4023.9599999999937, 13.575953889391702, 80.9895926370298, 7.79969191119262], "isController": false}, {"data": ["Login-3", 855, 356, 41.63742690058479, 2221.0807017543875, 2, 6471, 1047.0, 4830.4, 4986.199999999999, 5539.959999999986, 13.128800442233278, 429.90824775140504, 5.275317927146674], "isController": false}, {"data": ["Welcome-3", 855, 323, 37.77777777777778, 2006.9555555555555, 2, 8034, 199.0, 4811.2, 5037.999999999999, 6440.08, 12.636339451981911, 461.6089498629215, 4.729852058762673], "isController": false}, {"data": ["Login-4", 855, 379, 44.32748538011696, 2361.0058479532195, 2, 6485, 1539.0, 4857.2, 5053.599999999999, 5724.76, 13.116916987558106, 1129.2575745880827, 5.070400353619808], "isController": false}, {"data": ["Login-5", 855, 491, 57.42690058479532, 2953.7052631578913, 2, 6570, 4459.0, 4919.0, 5130.399999999998, 6045.6399999999985, 13.113496932515337, 139.4592809384586, 3.892709930981595], "isController": false}, {"data": ["Login-6", 855, 524, 61.28654970760234, 3137.5543859649115, 1, 6447, 4494.0, 4951.2, 5150.0, 6050.759999999997, 13.104251601630752, 153.9300691086427, 3.505183746896362], "isController": false}, {"data": ["Login-7", 528, 367, 69.50757575757575, 3584.7045454545455, 2, 6511, 4552.5, 4950.3, 5151.15, 6275.100000000008, 8.835045681202102, 103.35308246147217, 1.8639692655868276], "isController": false}, {"data": ["Welcome", 5000, 4673, 93.46, 4825.539800000007, 165, 12560, 4729.0, 5986.700000000002, 6591.0, 8488.99, 73.59651446907473, 3274.2732085458433, 23.514690094277135], "isController": false}, {"data": ["Welcome-0", 855, 0, 0.0, 1344.7391812865483, 7, 5874, 927.0, 3570.7999999999997, 3970.6, 4844.44, 13.48963428102616, 33.67139181865514, 6.74481714051308], "isController": false}, {"data": ["Welcome-1", 855, 0, 0.0, 805.0830409356729, 75, 11635, 233.0, 2224.7999999999993, 4251.399999999999, 6434.959999999992, 13.48155156102176, 1922.2031847455455, 7.267398888363292], "isController": false}, {"data": ["Welcome-2", 855, 205, 23.976608187134502, 1343.1239766081871, 2, 7199, 90.0, 4753.0, 5024.999999999999, 6374.799999999986, 12.606900619286346, 822.1668024043424, 5.737412682468299], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 0.008218952905399852, 0.005016806301108714], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 72, 0.5917646091887894, 0.36121005367982745], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 0.008218952905399852, 0.005016806301108714], "isController": false}, {"data": ["403/Forbidden", 390, 3.2053916331059424, 1.9565544574323985], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 7, 0.05753267033779896, 0.035117644107761], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 4, 0.03287581162159941, 0.020067225204434855], "isController": false}, {"data": ["Assertion failed", 1231, 10.117531026547217, 6.175688556664827], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 10461, 85.97846634338785, 52.48081071589826], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19933, 12167, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 10461, "Assertion failed", 1231, "403/Forbidden", 390, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 72, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 7], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login", 5000, 4848, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3749, "Assertion failed", 703, "403/Forbidden", 390, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 2], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-2", 855, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-3", 855, 356, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 356, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-3", 855, 323, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 320, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 855, 379, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 378, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 855, 491, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 489, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 855, 524, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 519, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-7", 528, 367, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 366, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome", 5000, 4673, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4081, "Assertion failed", 528, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 62, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 2, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Welcome-2", 855, 205, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 203, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
