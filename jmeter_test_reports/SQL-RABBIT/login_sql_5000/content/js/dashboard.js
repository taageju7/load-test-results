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

    var data = {"OkPercent": 63.330537694529866, "KoPercent": 36.669462305470134};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04402354549125586, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.01851403678606002, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.02734753146176186, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.004871395167575994, 500, 1500, "Login-0"], "isController": false}, {"data": [6.521739130434783E-4, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9786585365853658, 500, 1500, "Login-2"], "isController": false}, {"data": [0.08077408498106857, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [8.695652173913044E-4, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [8.695652173913044E-4, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.01706195546950629, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.017303969022265248, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0092, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 64386, 23610, 36.669462305470134, 35116.95826732555, 2, 196062, 36371.5, 73065.40000000001, 149633.8, 157985.88, 175.61478539789215, 8862.78462900555, 117.86994200758527], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 4132, 1419, 34.341723136495645, 31472.40730880929, 22, 92599, 29228.0, 65557.80000000002, 68574.85, 71701.11, 18.455573967457088, 1458.2598076641773, 7.301334485224821], "isController": false}, {"data": ["Login Welcome-0", 4132, 0, 0.0, 38780.31558567278, 23, 98293, 38665.0, 67380.20000000001, 69612.3, 83358.23000000003, 26.774837355174828, 68.84584644157745, 13.36127137548275], "isController": false}, {"data": ["Login", 5000, 4147, 82.94, 63549.713799999896, 4022, 196062, 19254.0, 156759.9, 162980.34999999998, 176888.21, 14.93089979574529, 1622.0034354833954, 28.206111529902117], "isController": false}, {"data": ["Login-0", 2566, 0, 0.0, 36549.17225253308, 904, 89131, 49189.5, 73079.3, 75902.45, 81160.95999999999, 9.67484088921063, 4.147710107776823, 7.086065104402317], "isController": false}, {"data": ["Logout-2", 2300, 399, 17.347826086956523, 21239.742173913026, 2, 75957, 19394.0, 42533.4, 43893.95, 61352.499999999985, 7.1787284911249065, 708.3627956251112, 3.5750903046980094], "isController": false}, {"data": ["Login-1", 2566, 270, 10.522213561964147, 46558.437256430174, 2, 80561, 51438.5, 69075.40000000001, 71838.15000000001, 75874.79999999999, 8.361574556830032, 38.07475514655566, 4.537273323448905], "isController": false}, {"data": ["Logout-1", 2377, 77, 3.239377366428271, 38428.292806057936, 3, 80539, 39077.0, 62038.20000000003, 66342.2, 73134.27999999998, 6.880780420025763, 18.36309235736203, 3.367954038876265], "isController": false}, {"data": ["Login-2", 2296, 5, 0.21777003484320556, 175.2739547038324, 4, 3210, 120.0, 255.60000000000036, 365.3000000000002, 1189.1200000000208, 7.564226742308934, 45.11008754373481, 4.341432791507706], "isController": false}, {"data": ["Logout-0", 2377, 0, 0.0, 28895.35969709722, 17, 80953, 26359.0, 61266.00000000001, 67798.0, 74920.31999999999, 7.043881276373808, 3.1092132196493765, 3.975940798578185], "isController": false}, {"data": ["Login-3", 2296, 859, 37.41289198606272, 29553.79355400695, 2, 87841, 38788.0, 57593.90000000002, 65502.45000000001, 72731.38000000009, 7.037720465176158, 246.3477971777852, 2.7357351866099395], "isController": false}, {"data": ["Login-4", 2296, 939, 40.897212543554005, 28026.77482578398, 3, 88671, 36977.5, 56994.200000000004, 65477.15000000002, 73332.87000000001, 6.966505551054837, 636.009329762089, 2.5814161504746993], "isController": false}, {"data": ["Login-5", 2296, 970, 42.24738675958188, 27505.19468641115, 3, 105106, 36177.0, 57069.3, 65736.3, 72509.19000000012, 6.983393150434941, 94.05487355716589, 2.540375355480869], "isController": false}, {"data": ["Login-6", 2296, 1010, 43.98954703832753, 26561.530487804856, 2, 108910, 35145.5, 56627.3, 64113.0, 72209.12000000004, 7.036253869020257, 343.85965416321903, 2.451602530952162], "isController": false}, {"data": ["Logout-4", 2300, 462, 20.08695652173913, 20115.669130434773, 2, 82123, 19266.5, 42173.9, 43799.49999999999, 63026.45999999979, 7.180521430734505, 214.16511267564962, 3.4462661386121614], "isController": false}, {"data": ["Login-7", 2296, 1006, 43.815331010452965, 26618.430749128907, 2, 88301, 35185.0, 55758.3, 63123.65000000002, 73485.79000000002, 7.031297850186807, 36.80546051976787, 2.4652117179365467], "isController": false}, {"data": ["Logout-3", 2300, 451, 19.608695652173914, 20290.619130434752, 2, 79283, 19237.5, 42246.9, 43954.399999999994, 62551.35999999977, 7.179243869550017, 495.12812767758487, 3.4211846562000576], "isController": false}, {"data": ["Login-8", 2296, 1220, 53.13588850174216, 23614.572735191643, 2, 99497, 13758.0, 54232.6, 61788.50000000001, 73361.87000000001, 7.060639701337401, 199.42163756158072, 2.068066288828137], "isController": false}, {"data": ["Logout", 5000, 3277, 65.54, 45720.119599999925, 2, 190666, 5612.5, 147575.00000000003, 152540.3, 160580.84, 14.361336983027773, 1346.3700548306872, 16.804267722607904], "isController": false}, {"data": ["Login Welcome-3", 4132, 2008, 48.59632139399806, 23560.83349467563, 15, 93350, 5602.0, 62218.7, 66618.34999999999, 71563.35, 18.22367666646085, 368.9702397425663, 5.626072961964911], "isController": false}, {"data": ["Login Welcome-2", 4132, 1873, 45.32913843175218, 25425.74394966117, 15, 93790, 6558.0, 63074.9, 67470.5, 71693.97, 18.489019348141255, 884.8486103521393, 5.99181684287242], "isController": false}, {"data": ["Login Welcome", 5000, 3218, 64.36, 66969.3219999999, 282, 170900, 72349.5, 111839.7, 114755.65, 126541.90999999993, 22.032934830985358, 2736.1230250572307, 27.811614207166873], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 126, 0.5336721728081322, 0.19569471624266144], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4626, 19.59339263024142, 7.184791724909141], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 23, 0.09741634900465904, 0.035722051377628676], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 14465, 61.26641253706057, 22.466064051191253], "isController": false}, {"data": ["Assertion failed", 4370, 18.50910631088522, 6.787189761749449], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 64386, 23610, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 14465, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4626, "Assertion failed", 4370, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 126, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 23], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 4132, 1419, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1419, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 5000, 4147, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2686, "Assertion failed", 1443, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 18, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2300, 399, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 351, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 48, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 2566, 270, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 252, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 18, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2377, 77, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 40, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 37, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2296, 5, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2296, 859, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 433, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 425, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-4", 2296, 939, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 491, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 446, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Login-5", 2296, 970, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 523, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 444, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, null, null, null, null], "isController": false}, {"data": ["Login-6", 2296, 1010, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 547, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 462, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2300, 462, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 418, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 44, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 2296, 1006, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 537, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 466, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2300, 451, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 409, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 42, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 2296, 1220, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 619, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 462, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 116, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 23, null, null], "isController": false}, {"data": ["Logout", 5000, 3277, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2472, "Assertion failed", 577, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 228, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 4132, 2008, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2008, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 4132, 1873, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1873, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 5000, 3218, "Assertion failed", 2350, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 868, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
