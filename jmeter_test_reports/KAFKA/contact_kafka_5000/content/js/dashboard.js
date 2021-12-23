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

    var data = {"OkPercent": 60.068903970279976, "KoPercent": 39.931096029720024};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.06278147894485607, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.01714175654853621, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.015793528505392913, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.017719568567026195, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.015408320493066256, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.013674884437596301, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.01714175654853621, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.9568567026194145, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [0.03428351309707242, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-2"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.0, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-4"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-3"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-6"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email"], "isController": false}, {"data": [0.08623655913978495, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48183, 19240, 39.931096029720024, 20603.660938505083, 0, 122057, 21702.5, 50852.000000000015, 70828.1, 93044.3300000001, 267.1875519868688, 13311.262826243596, 180.1652484937671], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 2596, 1036, 39.907550077041606, 18184.951463790494, 48, 54129, 9118.0, 42915.40000000001, 45579.15, 49899.93000000001, 18.499515421013623, 101.24210805443319, 6.405194437318283], "isController": false}, {"data": ["Show Contact Page-5", 2596, 996, 38.366718027734976, 18676.660631741142, 89, 58399, 10233.0, 43515.40000000001, 45728.6, 51599.39000000004, 18.48765827742882, 990.2776609391245, 6.542964577190958], "isController": false}, {"data": ["Show Contact Page-4", 2596, 991, 38.17411402157165, 18726.113636363618, 15, 54816, 10798.0, 44014.8, 45784.3, 49565.16000000002, 18.414481897627965, 263.10054409748824, 6.626377229102826], "isController": false}, {"data": ["Show Contact Page-3", 2596, 874, 33.66718027734977, 20064.55392912171, 0, 78042, 16514.5, 44204.700000000004, 46133.45, 49681.26000000001, 18.7132816723734, 1912.1638682082357, 7.188415142367995], "isController": false}, {"data": ["Show Contact Page-7", 2596, 1311, 50.50077041602465, 16384.42989214175, 1, 76250, 7816.5, 41517.4, 45527.35, 50632.46000000006, 18.205789946140033, 541.5451488118197, 5.20110344330327], "isController": false}, {"data": ["Show Contact Page-2", 2596, 610, 23.49768875192604, 23179.441063174174, 28, 55072, 23868.0, 44804.3, 46366.3, 49525.44000000001, 18.450604122245913, 778.8651538623845, 8.091392923773988], "isController": false}, {"data": ["Show Contact Page-1", 2596, 0, 0.0, 217.05238828967654, 75, 5228, 115.0, 223.30000000000018, 619.1000000000013, 2603.4900000000166, 22.626445747953944, 135.09579033495157, 11.931914749897588], "isController": false}, {"data": ["Show Contact Page-0", 2596, 0, 0.0, 25353.69876733436, 11, 55560, 25432.5, 46914.6, 49544.0, 52002.420000000006, 22.6185601143126, 134.6511156805172, 11.331368494767933], "isController": false}, {"data": ["Send Email-2", 2154, 640, 29.712163416898793, 16818.33194057569, 3, 60019, 18278.5, 30190.5, 41778.25, 46714.49999999999, 12.356231177398538, 501.01521045461067, 5.403061361680769], "isController": false}, {"data": ["Send Email-1", 2325, 171, 7.354838709677419, 25201.727311827934, 2, 51695, 24457.0, 40804.400000000016, 45090.69999999999, 48190.2, 13.322178992785968, 75.52039314036706, 7.662793356530161], "isController": false}, {"data": ["Show Contact Page", 5000, 3871, 77.42, 33252.09879999999, 2439, 99686, 8917.5, 76821.8, 78586.95, 81095.97, 35.01106349606475, 4761.563634577276, 58.10832023700739], "isController": false}, {"data": ["Send Email-4", 2154, 838, 38.90436397400186, 15285.801764159698, 3, 75208, 15980.0, 28612.0, 41652.75, 47623.44999999999, 12.36162043971558, 178.59457317545582, 4.762777288176689], "isController": false}, {"data": ["Send Email-3", 2154, 815, 37.836583101207054, 15394.074744661079, 3, 59123, 16295.5, 28931.5, 41478.25, 47099.09999999999, 12.35991805959615, 1164.3134812639507, 4.82125655580612], "isController": false}, {"data": ["Send Email-6", 2101, 976, 46.45406949071871, 13840.362684435975, 3, 75591, 12133.0, 28462.999999999996, 40755.79999999995, 48443.340000000004, 12.054137477982982, 61.357559089155295, 4.027759325676862], "isController": false}, {"data": ["Send Email-5", 2101, 910, 43.3127082341742, 14375.422179914352, 3, 52939, 13918.0, 28983.399999999998, 40452.099999999984, 46832.68, 12.053860849909064, 595.5211033105089, 4.2506109671631265], "isController": false}, {"data": ["Send Email-7", 2101, 921, 43.836268443598286, 14301.852451213732, 0, 78637, 14092.0, 27900.8, 40247.8, 47666.200000000004, 12.053791694874413, 401.33149267327684, 4.231162006173194], "isController": false}, {"data": ["Send Email", 5000, 4280, 85.6, 33367.95979999997, 4025, 122057, 8890.5, 78768.50000000001, 90217.09999999999, 102126.95, 28.169014084507044, 2970.333263644366, 44.7684198943662], "isController": false}, {"data": ["Send Email-0", 2325, 0, 0.0, 18893.932043010747, 28, 54001, 22731.0, 41054.00000000001, 45294.7, 49727.659999999996, 14.300651986714232, 5.286315775310616, 11.173892035843892], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, 0.015592515592515593, 0.00622626237469647], "isController": false}, {"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 2, 0.010395010395010396, 0.00415084158313098], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 180, 0.9355509355509356, 0.3735757424817882], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3635, 18.89293139293139, 7.544154577340556], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 88, 0.4573804573804574, 0.1826370296577631], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 12430, 64.60498960498961, 25.797480439159038], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, 0.005197505197505198, 0.00207542079156549], "isController": false}, {"data": ["Assertion failed", 2848, 14.802494802494802, 5.910798414378515], "isController": false}, {"data": ["Test failed: text expected to contain /Thankyou for your feedback!/", 53, 0.27546777546777546, 0.10999730195297097], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 48183, 19240, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 12430, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3635, "Assertion failed", 2848, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 180, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 88], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 2596, 1036, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1033, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-5", 2596, 996, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 991, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-4", 2596, 991, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 988, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-3", 2596, 874, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 871, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null], "isController": false}, {"data": ["Show Contact Page-7", 2596, 1311, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1058, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 169, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 80, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1], "isController": false}, {"data": ["Show Contact Page-2", 2596, 610, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 607, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 3, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-2", 2154, 640, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 428, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 212, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-1", 2325, 171, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 168, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 5000, 3871, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2404, "Assertion failed", 1467, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 2154, 838, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 602, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 236, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 2154, 815, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 587, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 227, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-6", 2101, 976, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 707, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 267, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 2101, 910, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 652, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 258, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-7", 2101, 921, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 653, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 267, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null], "isController": false}, {"data": ["Send Email", 5000, 4280, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2843, "Assertion failed", 1381, "Test failed: text expected to contain /Thankyou for your feedback!/", 53, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
