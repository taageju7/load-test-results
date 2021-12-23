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

    var data = {"OkPercent": 69.28515817404707, "KoPercent": 30.714841825952938};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6283823506045728, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8428220356338316, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.3877551020408163, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.0062220009955201595, 500, 1500, "Registration"], "isController": false}, {"data": [0.33260328521652566, 500, 1500, "Welcome"], "isController": false}, {"data": [0.8121134958166606, 500, 1500, "Registration-3"], "isController": false}, {"data": [0.8506041368011469, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.842761004001455, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.8944296539012901, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.9109676245907603, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.8597173868523449, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.8531284103310295, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 62937, 19331, 30.714841825952938, 549.1694869472631, 2, 9299, 631.0, 2527.800000000003, 5329.9000000000015, 6648.990000000002, 1152.8401077061162, 84510.83470451225, 906.9238429720842], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 4883, 565, 11.570755682981774, 240.99139873028852, 2, 6314, 192.0, 469.0, 599.8000000000002, 1261.7999999999993, 90.49798913949996, 2961.364941788137, 48.06290338834628], "isController": false}, {"data": ["Registration-4", 1323, 728, 55.026455026455025, 186.3907785336358, 2, 5652, 40.0, 564.4000000000005, 903.0, 1362.84, 57.97037945841731, 1038.2906039813558, 16.90563107965998], "isController": false}, {"data": ["Registration", 10045, 9939, 98.94474863115978, 896.7678446988551, 3, 9299, 640.0, 1729.7999999999993, 2575.0999999999967, 6156.079999999998, 191.0022627445761, 22942.8918631812, 272.4001797182503], "isController": false}, {"data": ["Welcome", 10045, 5969, 59.42259830761573, 1028.3499253359876, 3, 8882, 678.0, 1752.3999999999996, 4894.699999999977, 6644.619999999997, 185.55463193867183, 20545.45784338344, 192.66738391290295], "isController": false}, {"data": ["Registration-3", 5498, 740, 13.45943979628956, 253.294834485267, 2, 3013, 214.0, 511.0, 643.1500000000005, 1001.090000000002, 104.63014063600205, 3971.9012897084995, 58.6152337431252], "isController": false}, {"data": ["Welcome-0", 4883, 0, 0.0, 734.5455662502551, 2, 7817, 163.0, 2871.6000000000004, 5352.0, 6321.639999999999, 92.52136347272486, 362.94757526360917, 46.802799100460426], "isController": false}, {"data": ["Registration-2", 5498, 557, 10.130956711531466, 264.2462713714082, 2, 5521, 225.0, 520.1000000000004, 667.0500000000002, 1127.0300000000007, 104.63014063600205, 8577.206068198471, 60.395448063162505], "isController": false}, {"data": ["Welcome-1", 4883, 307, 6.287118574646733, 244.9655949211543, 2, 6309, 197.0, 476.0, 580.0, 1197.3199999999997, 90.90401370169037, 10136.109643774667, 51.32956195546951], "isController": false}, {"data": ["Registration-1", 5498, 45, 0.8184794470716624, 316.35940341942535, 2, 1849, 253.0, 590.1000000000004, 868.1000000000004, 1639.0, 104.64408070041873, 9425.459471355158, 66.7162444685002], "isController": false}, {"data": ["Welcome-2", 4883, 481, 9.850501740733156, 240.0700389105055, 3, 4787, 193.0, 475.0, 585.0, 1143.4799999999996, 91.17388950090557, 7022.090566913522, 48.72171092247512], "isController": false}, {"data": ["Registration-0", 5498, 0, 0.0, 593.2913786831589, 3, 7787, 298.5, 1114.2000000000007, 2796.550000000002, 5704.02, 104.59033233777845, 324.52940265518293, 79.53757600419465], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /You've successfully registered to our Survey app/", 4790, 24.77885262014381, 7.610785388563166], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, 0.025865190626454915, 0.007944452388896833], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 13015, 67.32709120066215, 20.679409568298457], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 112, 0.5793802700325902, 0.17795573351128907], "isController": false}, {"data": ["Assertion failed", 1409, 7.288810718534996, 2.2387466831911276], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 62937, 19331, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 13015, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 4790, "Assertion failed", 1409, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 112, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Welcome-3", 4883, 565, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 565, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-4", 1323, 728, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 728, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration", 10045, 9939, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 4790, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4519, "Assertion failed", 602, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 28, null, null], "isController": false}, {"data": ["Welcome", 10045, 5969, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5078, "Assertion failed", 807, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 84, null, null, null, null], "isController": false}, {"data": ["Registration-3", 5498, 740, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 738, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-2", 5498, 557, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 555, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-1", 4883, 307, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 307, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-1", 5498, 45, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 44, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-2", 4883, 481, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 481, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
