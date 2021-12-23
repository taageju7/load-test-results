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

    var data = {"OkPercent": 50.246203643125234, "KoPercent": 49.753796356874766};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.05921800213491271, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.01396103896103896, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.01396103896103896, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.01461038961038961, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.014448051948051948, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.010876623376623377, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.014448051948051948, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.9452922077922078, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [0.02775974025974026, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [8.326394671107411E-4, 500, 1500, "Send Email-2"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.0, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [2.0815986677768527E-4, 500, 1500, "Send Email-4"], "isController": false}, {"data": [2.0815986677768527E-4, 500, 1500, "Send Email-3"], "isController": false}, {"data": [2.1331058020477816E-4, 500, 1500, "Send Email-6"], "isController": false}, {"data": [2.1331058020477816E-4, 500, 1500, "Send Email-5"], "isController": false}, {"data": [2.1331058020477816E-4, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email"], "isController": false}, {"data": [0.07090699461952345, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 58082, 28898, 49.753796356874766, 17911.60121896621, 0, 111166, 16819.0, 49597.50000000002, 66988.45000000001, 93065.26000000013, 335.50720033272296, 13593.439741980857, 190.9011612269448], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 3080, 1621, 52.62987012987013, 14159.612987012988, 65, 52190, 5162.0, 36950.1, 42159.59999999999, 47434.56000000001, 22.540818641549755, 110.97069316219144, 6.152141492121691], "isController": false}, {"data": ["Show Contact Page-5", 3080, 1549, 50.29220779220779, 14760.953571428583, 33, 53989, 5783.0, 36904.100000000006, 41776.65, 47037.36, 22.535376150548018, 986.0818515340335, 6.432305385442732], "isController": false}, {"data": ["Show Contact Page-4", 3080, 1498, 48.63636363636363, 15388.66558441556, 34, 54245, 6015.5, 37807.9, 42608.7, 47722.91000000001, 22.285573708811484, 275.38362260185886, 6.662326074844797], "isController": false}, {"data": ["Show Contact Page-3", 3080, 1330, 43.18181818181818, 17135.411688311713, 20, 55848, 7394.0, 39961.0, 43341.85, 47805.99, 22.402280959515878, 1970.0263302377152, 7.37113403819298], "isController": false}, {"data": ["Show Contact Page-7", 3080, 1861, 60.422077922077925, 12770.269155844171, 0, 55385, 5052.5, 33856.3, 41066.24999999999, 47843.05, 22.62958745086514, 551.2725340155579, 5.169126375316852], "isController": false}, {"data": ["Show Contact Page-2", 3080, 946, 30.714285714285715, 20825.06428571429, 42, 53828, 21686.5, 40752.9, 43398.45, 47008.9, 22.319002311610955, 859.3538268393249, 8.864548497634042], "isController": false}, {"data": ["Show Contact Page-1", 3080, 0, 0.0, 243.0103896103896, 73, 4522, 98.0, 210.0, 991.7999999999993, 3572.260000000003, 27.63100054723735, 164.97650131426676, 14.571035444832196], "isController": false}, {"data": ["Show Contact Page-0", 3080, 0, 0.0, 25550.962662337675, 25, 55378, 27860.5, 43280.8, 45272.6, 49275.310000000005, 27.606977036014555, 164.34778516752417, 13.830448456519012], "isController": false}, {"data": ["Send Email-2", 2402, 956, 39.800166527893424, 13596.763114071617, 2, 60881, 13991.5, 29049.400000000012, 36593.549999999996, 44581.009999999995, 14.651969964071565, 503.0477242210422, 5.482265100312925], "isController": false}, {"data": ["Send Email-1", 2602, 200, 7.686395080707149, 24672.642198309008, 3, 49599, 25376.5, 37240.9, 41158.49999999999, 45601.839999999946, 15.595126073588377, 88.2524834691364, 8.938133626915677], "isController": false}, {"data": ["Show Contact Page", 7000, 5901, 84.3, 28053.235, 3245, 84162, 5772.0, 72620.8, 74954.75, 78698.91, 50.57693836116269, 5057.739840809087, 63.206969355342736], "isController": false}, {"data": ["Send Email-4", 2402, 1266, 52.706078268109906, 11506.125728559517, 3, 49217, 4616.5, 28181.4, 36529.95, 44442.67999999997, 14.638219036997764, 170.1702723260264, 4.363271799260776], "isController": false}, {"data": ["Send Email-3", 2402, 1175, 48.917568692756035, 12167.395920066625, 2, 59338, 9249.0, 28641.7, 36567.049999999996, 44762.23999999996, 14.636613470315462, 1150.6821138123137, 4.689397081360559], "isController": false}, {"data": ["Send Email-6", 2344, 1357, 57.89249146757679, 10675.215443686027, 2, 51992, 4280.5, 27874.5, 34841.75, 44384.800000000025, 14.287804164431657, 65.14377141037207, 3.7542737407501097], "isController": false}, {"data": ["Send Email-5", 2344, 1324, 56.484641638225256, 10909.849402730368, 3, 65387, 4269.5, 28185.5, 36632.75, 44517.65, 14.284582523325188, 550.3712904991377, 3.8667811469715345], "isController": false}, {"data": ["Send Email-7", 2344, 1357, 57.89249146757679, 10525.901877133108, 2, 70800, 4366.0, 27569.5, 33532.25, 44684.000000000015, 14.284843683344507, 365.9468567649613, 3.7593698580047534], "isController": false}, {"data": ["Send Email", 7000, 6557, 93.67142857142858, 26924.07485714287, 4, 111166, 4894.0, 71886.70000000001, 81307.5, 98527.56, 41.353316831390714, 2883.4749088288595, 45.93812353048035], "isController": false}, {"data": ["Send Email-0", 2602, 0, 0.0, 20884.8351268255, 36, 51404, 24748.5, 39015.00000000001, 42026.55, 46669.28, 16.84055194553033, 6.224647348357366, 13.159146189032283], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 4, 0.01384178835905599, 0.006886815192314314], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 107, 0.3702678386047477, 0.1842223063944079], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5974, 20.67271091425012, 10.285458489721428], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 116, 0.4014118624126237, 0.1997176405771151], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 18757, 64.9076060627033, 32.2939981405599], "isController": false}, {"data": ["Assertion failed", 3882, 13.43345560246384, 6.683654144141042], "isController": false}, {"data": ["Test failed: text expected to contain /Thankyou for your feedback!/", 58, 0.20070593120631186, 0.09985882028855755], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 58082, 28898, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 18757, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5974, "Assertion failed", 3882, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 116, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 107], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 3080, 1621, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1618, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-5", 3080, 1549, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1547, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-4", 3080, 1498, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1497, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-3", 3080, 1330, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1329, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-7", 3080, 1861, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1648, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 110, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 100, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, null, null], "isController": false}, {"data": ["Show Contact Page-2", 3080, 946, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 946, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-2", 2402, 956, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 724, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 232, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-1", 2602, 200, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 174, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 26, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 7000, 5901, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3920, "Assertion failed", 1981, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 2402, 1266, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1033, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 231, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 2402, 1175, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 951, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 223, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-6", 2344, 1357, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1079, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 275, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 2344, 1324, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1070, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 253, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-7", 2344, 1357, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1060, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 297, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email", 7000, 6557, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4567, "Assertion failed", 1901, "Test failed: text expected to contain /Thankyou for your feedback!/", 58, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 31, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
