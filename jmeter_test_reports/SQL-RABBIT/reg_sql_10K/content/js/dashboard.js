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

    var data = {"OkPercent": 54.92975369105923, "KoPercent": 45.07024630894077};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.008266900225217174, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.011073613161780215, 500, 1500, "Welcome-3"], "isController": false}, {"data": [1.5114873035066505E-4, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.0, 500, 1500, "Registration"], "isController": false}, {"data": [0.00125, 500, 1500, "Welcome"], "isController": false}, {"data": [1.5114873035066505E-4, 500, 1500, "Registration-3"], "isController": false}, {"data": [0.028896857203121705, 500, 1500, "Welcome-0"], "isController": false}, {"data": [1.5114873035066505E-4, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.012550094916684244, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.0, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.012444631934191099, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.03981297818078776, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 55946, 25215, 45.07024630894077, 32918.34821077467, 3, 170506, 36764.0, 108407.00000000001, 112869.9, 140588.88, 227.29248682665627, 10777.893533330489, 134.34015907041086], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 4741, 2371, 50.01054629824932, 23404.67812697737, 32, 95419, 8112.0, 63050.8, 66982.6, 70630.77999999998, 24.617062152759747, 486.6521770260008, 7.390771441274209], "isController": false}, {"data": ["Registration-4", 3308, 1089, 32.92019347037485, 23880.20012091896, 3, 74254, 28210.5, 42400.99999999999, 50795.84999999988, 68723.88999999997, 13.645795090318828, 347.61246121127056, 5.935519957181574], "isController": false}, {"data": ["Registration", 10000, 7907, 79.07, 36180.44500000003, 4017, 170506, 4843.0, 111030.0, 117400.54999999997, 144886.27, 40.88023318085006, 2371.830276865212, 37.252751239693076], "isController": false}, {"data": ["Welcome", 10000, 8028, 80.28, 42052.21980000001, 450, 146192, 8371.5, 108605.0, 110903.84999999999, 117918.52999999998, 51.85807482083035, 3953.820576814125, 38.482084574686], "isController": false}, {"data": ["Registration-3", 3308, 1073, 32.43651753325272, 24143.70374848844, 3, 74466, 28349.5, 42880.7, 54847.84999999988, 68979.38, 13.646470605221797, 796.8982974333971, 5.906582215035044], "isController": false}, {"data": ["Welcome-0", 4741, 0, 0.0, 35531.52161991139, 24, 97417, 36258.0, 63497.600000000006, 68446.7, 88610.62, 31.92549595291646, 125.23898168248574, 16.14981142930735], "isController": false}, {"data": ["Registration-2", 3308, 1060, 32.04353083434099, 24273.404171704944, 3, 73630, 28514.0, 43155.1, 54866.34999999999, 69336.11, 13.646470605221797, 1113.6983880673824, 6.031501256151843], "isController": false}, {"data": ["Welcome-1", 4741, 1376, 29.02341278211348, 35311.69563383246, 23, 91199, 40873.0, 66781.8, 68938.0, 71635.48, 24.618851777999335, 2097.07464621922, 10.528539097875644], "isController": false}, {"data": ["Registration-1", 3529, 221, 6.26239727968263, 36775.6752621138, 3, 75731, 36461.0, 59790.0, 65445.0, 70392.9, 14.499780181853293, 55.909439963195865, 8.504021953053417], "isController": false}, {"data": ["Welcome-2", 4741, 2090, 44.08352668213457, 26700.741404766864, 22, 92526, 9845.0, 65406.6, 67454.5, 70888.9, 24.622431809211207, 1203.6153911135145, 8.161302027611297], "isController": false}, {"data": ["Registration-0", 3529, 0, 0.0, 33143.92774156978, 73, 78084, 40756.0, 62031.0, 67163.0, 70872.5, 16.554241056769463, 6.19482127318485, 12.713150805899296], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /You've successfully registered to our Survey app/", 68, 0.2696807455879437, 0.12154577628427413], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 0.00396589331746976, 0.001787437886533443], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2338, 9.2722585762443, 4.17902977871519], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 18892, 74.92365655363871, 33.76827655238981], "isController": false}, {"data": ["Assertion failed", 3916, 15.53043823121158, 6.999606763664962], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 55946, 25215, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 18892, "Assertion failed", 3916, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2338, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 68, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Welcome-3", 4741, 2371, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2371, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-4", 3308, 1089, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 775, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 313, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Registration", 10000, 7907, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 6681, "Assertion failed", 1147, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 68, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 11, null, null], "isController": false}, {"data": ["Welcome", 10000, 8028, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 5259, "Assertion failed", 2769, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-3", 3308, 1073, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 774, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 299, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-2", 3308, 1060, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 767, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 293, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-1", 4741, 1376, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1376, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-1", 3529, 221, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 210, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 11, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-2", 4741, 2090, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2090, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
