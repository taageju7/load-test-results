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

    var data = {"OkPercent": 70.37870675903062, "KoPercent": 29.621293240969383};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.011254124691331045, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.012792947753171361, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.0, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.0, 500, 1500, "Registration"], "isController": false}, {"data": [0.0056, 500, 1500, "Welcome"], "isController": false}, {"data": [0.0, 500, 1500, "Registration-3"], "isController": false}, {"data": [0.026230918082132876, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.012470436465276284, 500, 1500, "Welcome-1"], "isController": false}, {"data": [7.014590347923681E-4, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.014298000430015051, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.050084175084175085, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 45761, 13555, 29.621293240969383, 36552.695548611446, 3, 155719, 35323.5, 101145.40000000001, 106113.0, 130919.3300000001, 180.465508810121, 10917.09189953322, 135.42282862461155], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 4651, 2130, 45.79660288110084, 22231.413889486084, 25, 79239, 6881.0, 58899.4, 63769.19999999999, 69435.47999999998, 25.68704988291433, 544.3792114338714, 8.362110350138625], "isController": false}, {"data": ["Registration-4", 3343, 869, 25.99461561471732, 24260.599760693985, 3, 72706, 27259.0, 40655.6, 51280.399999999994, 66096.95999999999, 13.37735094037615, 372.4665373962085, 6.419505302120848], "isController": false}, {"data": ["Registration", 5000, 2618, 52.36, 63509.480600000046, 4017, 155719, 69004.0, 108290.20000000007, 127184.44999999997, 144454.81999999995, 19.833084758671028, 2496.144614889837, 38.394024328749246], "isController": false}, {"data": ["Welcome", 5000, 2810, 56.2, 71092.89480000005, 244, 123240, 76456.0, 106410.0, 108907.9, 112357.79, 27.579055362195735, 4177.171110499967, 41.3158057807079], "isController": false}, {"data": ["Registration-3", 3343, 836, 25.007478312892612, 24654.93778043676, 3, 76649, 27498.0, 41101.6, 52827.199999999975, 66072.43999999999, 13.374353886283986, 863.1573531941622, 6.425318356030662], "isController": false}, {"data": ["Welcome-0", 4651, 0, 0.0, 35685.03870135445, 23, 82190, 36140.0, 63950.8, 65916.59999999999, 72529.55999999985, 33.149683185676714, 130.0412864813119, 16.76907801775443], "isController": false}, {"data": ["Registration-2", 3343, 826, 24.708345797188155, 24856.646724499005, 3, 75691, 27539.0, 41207.2, 55672.79999999994, 66281.28, 13.377083291650829, 1205.9004101245973, 6.550622048878574], "isController": false}, {"data": ["Welcome-1", 4651, 1254, 26.961943668028383, 32067.15996559874, 26, 79647, 35122.0, 63303.0, 65707.0, 68703.27999999998, 25.80834900922797, 2260.0917852676416, 11.357811008709138], "isController": false}, {"data": ["Registration-1", 3564, 221, 6.200897867564534, 34373.6857463525, 1009, 74581, 33855.0, 58006.0, 64274.25, 68008.34999999999, 15.075504420286789, 58.38785852042003, 8.849880272883972], "isController": false}, {"data": ["Welcome-2", 4651, 1991, 42.807998279939795, 23821.897011395395, 37, 80073, 9269.0, 59891.8, 64588.6, 69475.91999999995, 25.879433334446187, 1292.2199912240983, 8.773619469112722], "isController": false}, {"data": ["Registration-0", 3564, 0, 0.0, 28405.82800224467, 50, 81664, 37647.0, 56303.0, 63359.75, 71979.44999999981, 17.07509881422925, 6.37996504072344, 13.126230499161577], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /You've successfully registered to our Survey app/", 30, 0.2213205459240133, 0.0655580079106663], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1335, 9.848764293618592, 2.9173313520246498], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 8798, 64.90593876798229, 19.225978453268066], "isController": false}, {"data": ["Assertion failed", 3392, 25.023976392475102, 7.412425427766002], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 45761, 13555, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 8798, "Assertion failed", 3392, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1335, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 30, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Welcome-3", 4651, 2130, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2130, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-4", 3343, 869, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 457, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 412, null, null, null, null, null, null], "isController": false}, {"data": ["Registration", 5000, 2618, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1657, "Assertion failed", 931, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 30, null, null, null, null], "isController": false}, {"data": ["Welcome", 5000, 2810, "Assertion failed", 2461, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 349, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-3", 3343, 836, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 443, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 393, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-2", 3343, 826, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 435, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 391, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-1", 4651, 1254, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1254, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-1", 3564, 221, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 221, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-2", 4651, 1991, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1991, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
