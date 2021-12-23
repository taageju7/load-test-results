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

    var data = {"OkPercent": 49.66661835048558, "KoPercent": 50.33338164951442};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.031387399139971975, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.010712931361395525, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.022089495638983693, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.001682085786375105, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0014743049705139006, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login-1"], "isController": false}, {"data": [4.1339396444811904E-4, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9547134935304991, 500, 1500, "Login-2"], "isController": false}, {"data": [0.08288548987184786, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0014743049705139006, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0012636899747262005, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.011376564277588168, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.011566173682214638, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0023, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 82788, 41670, 50.33338164951442, 33937.01572691644, 0, 231847, 31124.5, 80100.60000000003, 170974.8, 185211.77000000005, 203.6930874555587, 8139.517944040099, 106.96426127486559], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 5274, 2582, 48.95714827455442, 29752.61111111111, 65, 108051, 7677.0, 72613.0, 74950.75, 79042.5, 22.532587658772712, 1398.5234067588149, 6.929967641982218], "isController": false}, {"data": ["Login Welcome-0", 5274, 0, 0.0, 45102.78441410696, 32, 111335, 50147.0, 73516.0, 75445.5, 97302.75, 34.71701094040049, 89.26747051374463, 17.324602139203762], "isController": false}, {"data": ["Login", 10000, 9273, 92.73, 37507.17010000004, 4024, 231847, 4953.0, 171943.9, 182050.04999999996, 193976.93, 27.294140766801593, 1440.7199249701127, 24.05664252812661], "isController": false}, {"data": ["Login-0", 2378, 0, 0.0, 44239.15306980656, 743, 97000, 50510.0, 78282.5, 81047.69999999997, 85607.05, 8.308903944458226, 3.5628516183232644, 6.0732982120832], "isController": false}, {"data": ["Logout-2", 2374, 257, 10.825610783487784, 29853.962510530706, 2, 73705, 27974.0, 54806.5, 56084.5, 58590.75, 8.155385165031467, 866.5556208261193, 4.3819743153890816], "isController": false}, {"data": ["Login-1", 2378, 214, 8.999158957106813, 55396.37636669471, 2, 89663, 59393.5, 76269.2, 79091.2, 83179.94, 7.076706980287592, 32.10693917357573, 3.9060494750127965], "isController": false}, {"data": ["Logout-1", 2419, 45, 1.8602728400165358, 46081.03307151719, 2, 85736, 45192.0, 73335.0, 76149.0, 80820.20000000004, 6.616339815650556, 17.61472105265857, 3.2846753542025655], "isController": false}, {"data": ["Login-2", 2164, 11, 0.5083179297597042, 1118.8119223659903, 3, 57574, 114.0, 239.5, 500.0, 47196.09999999999, 6.525639672511798, 53.48977789096543, 3.744188007930884], "isController": false}, {"data": ["Logout-0", 2419, 0, 0.0, 30202.22199255891, 19, 88185, 31920.0, 65235.0, 73374.0, 77679.20000000006, 6.748236921978218, 2.962719604513982, 3.7988146124854936], "isController": false}, {"data": ["Login-3", 2164, 769, 35.53604436229205, 35299.981515711675, 2, 85501, 48504.5, 60148.0, 70578.5, 76232.8, 6.0387214876909425, 220.99304105542285, 2.42013658282034], "isController": false}, {"data": ["Login-4", 2164, 866, 40.0184842883549, 32873.16035120149, 2, 80253, 46000.5, 59507.0, 69957.75, 74994.09999999999, 6.0085407908839, 542.7240413128828, 2.262112830553041], "isController": false}, {"data": ["Login-5", 2121, 899, 42.38566713814239, 31888.92126355498, 2, 80287, 42753.0, 59607.2, 69407.49999999999, 75877.66000000003, 5.909905291050993, 79.5585936085043, 2.1447210610383713], "isController": false}, {"data": ["Login-6", 2121, 940, 44.31871758604432, 30704.0504479019, 2, 107057, 33307.0, 58546.0, 67433.2, 75611.52000000003, 5.919306539703449, 287.80514774370045, 2.0503100283895077], "isController": false}, {"data": ["Logout-4", 2374, 328, 13.816343723673125, 28363.665543386673, 2, 75855, 27326.0, 54810.5, 56549.5, 59617.0, 8.155133027601725, 260.6869058200649, 4.221153288761787], "isController": false}, {"data": ["Login-7", 2121, 978, 46.11032531824611, 29874.9509665252, 2, 106072, 27943.0, 58875.799999999996, 66471.99999999997, 75360.26000000007, 5.909049119493176, 30.461994015033113, 1.987119858312369], "isController": false}, {"data": ["Logout-3", 2374, 291, 12.257792754844145, 29191.549705139016, 2, 75539, 27658.0, 55007.0, 56550.25, 59534.0, 8.15572137252477, 611.9843634322481, 4.24189261626369], "isController": false}, {"data": ["Login-8", 2121, 1126, 53.088165959453086, 27216.844884488422, 0, 101528, 10263.0, 58479.6, 64704.69999999998, 75391.86000000003, 5.952113687897088, 168.38950246724374, 1.745153559481849], "isController": false}, {"data": ["Logout", 10000, 8031, 80.31, 30357.742500000026, 2, 215320, 5135.0, 115339.3, 169425.74999999997, 182160.92999999996, 26.572070097120914, 1420.6840834130496, 16.745106172027583], "isController": false}, {"data": ["Login Welcome-3", 5274, 3381, 64.10693970420932, 20260.138035646567, 43, 108439, 5854.0, 66491.5, 73701.25, 79282.75, 22.565462947116206, 338.6141386461364, 4.864406895804809], "isController": false}, {"data": ["Login Welcome-2", 5274, 3198, 60.637087599544934, 22471.82555934767, 35, 110896, 6140.0, 69334.5, 74026.75, 79212.0, 22.527005497204414, 794.381851817345, 5.256291271746419], "isController": false}, {"data": ["Login Welcome", 10000, 8481, 84.81, 47800.174899999874, 261, 194270, 17266.0, 115314.5, 117596.95, 156554.47999999998, 42.679231432400364, 2642.098725531463, 28.259590456763803], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, 0.004799616030717543, 0.002415809054452336], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 96, 0.23038156947444205, 0.11595883461371213], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3012, 7.228221742260619, 3.6382084360052183], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 43, 0.10319174466042716, 0.051939894670725226], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 43, 0.10319174466042716, 0.051939894670725226], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 32920, 79.00167986561075, 39.76421703628545], "isController": false}, {"data": ["Assertion failed", 5554, 13.328533717302616, 6.708701744214137], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 82788, 41670, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 32920, "Assertion failed", 5554, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3012, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 96, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 43], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 5274, 2582, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2582, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 10000, 9273, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 7832, "Assertion failed", 1394, "Test failed: text expected to contain /The electronic survey app/", 43, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2374, 257, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 224, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 33, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 2378, 214, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 210, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2419, 45, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 24, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 21, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2164, 11, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2164, 769, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 468, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 297, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null], "isController": false}, {"data": ["Login-4", 2164, 866, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 533, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 333, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 2121, 899, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 550, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 348, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-6", 2121, 940, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 594, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 345, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2374, 328, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 260, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 67, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-7", 2121, 978, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 620, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 354, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null], "isController": false}, {"data": ["Logout-3", 2374, 291, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 239, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 52, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 2121, 1126, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 587, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 409, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 87, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 41, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2], "isController": false}, {"data": ["Logout", 10000, 8031, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 7466, "Assertion failed", 405, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 160, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 5274, 3381, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3381, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 5274, 3198, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3198, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 10000, 8481, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4726, "Assertion failed", 3755, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
