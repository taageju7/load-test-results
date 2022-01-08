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

    var data = {"OkPercent": 50.884501986924754, "KoPercent": 49.115498013075246};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.37668247660556337, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.004166666666666667, 500, 1500, "Login"], "isController": false}, {"data": [0.3369434416365824, 500, 1500, "Login-0"], "isController": false}, {"data": [0.99338146811071, 500, 1500, "Login-1"], "isController": false}, {"data": [0.97352587244284, 500, 1500, "Login-2"], "isController": false}, {"data": [0.5373044524669074, 500, 1500, "Login-3"], "isController": false}, {"data": [0.6155234657039711, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.4759326113116727, 500, 1500, "Login-4"], "isController": false}, {"data": [0.4109506618531889, 500, 1500, "Login-5"], "isController": false}, {"data": [0.315884476534296, 500, 1500, "Login-6"], "isController": false}, {"data": [0.15726681127982647, 500, 1500, "Login-7"], "isController": false}, {"data": [0.03816666666666667, 500, 1500, "Welcome"], "isController": false}, {"data": [0.5252707581227437, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.944043321299639, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.7033694344163658, 500, 1500, "Welcome-2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15602, 7663, 49.115498013075246, 2680.5528137418232, 1, 10495, 2759.0, 5000.0, 5612.0, 7085.849999999997, 220.66019856872117, 9994.855098709799, 134.71457735199274], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login", 3000, 2777, 92.56666666666666, 4585.565000000006, 58, 10495, 4676.0, 5965.9, 6612.95, 9119.919999999998, 44.003754987092236, 2138.1005567162565, 48.230722459149845], "isController": false}, {"data": ["Login-0", 831, 0, 0.0, 1507.808664259928, 485, 5829, 1143.0, 2780.800000000001, 4307.0, 4656.0, 12.618248629606573, 7.676922750239155, 9.993554334580987], "isController": false}, {"data": ["Login-1", 831, 0, 0.0, 78.06859205776169, 8, 1044, 44.0, 206.80000000000007, 275.79999999999995, 510.0, 13.43899086277998, 60.17360654867793, 8.96370191335813], "isController": false}, {"data": ["Login-2", 831, 0, 0.0, 230.4320096269555, 80, 1179, 186.0, 399.6000000000005, 511.79999999999995, 936.279999999999, 13.46643115266817, 80.40406256583319, 7.745828075118702], "isController": false}, {"data": ["Login-3", 831, 298, 35.860409145607704, 1910.9049338146822, 2, 5677, 561.0, 4733.0, 4838.0, 5231.119999999998, 13.040203370680727, 465.55402045966326, 5.758371901774786], "isController": false}, {"data": ["Welcome-3", 831, 251, 30.204572803850784, 1630.3766546329755, 2, 6107, 123.0, 4718.0, 4869.599999999999, 5261.159999999998, 12.278550214985446, 498.8365632711033, 5.155310362150741], "isController": false}, {"data": ["Login-4", 831, 350, 42.1179302045728, 2190.903730445248, 2, 5915, 1144.0, 4753.0, 4822.2, 5370.2799999999925, 13.062546174764607, 1167.7067911043825, 5.249785213661443], "isController": false}, {"data": ["Login-5", 831, 383, 46.08904933814681, 2454.7184115523464, 2, 5912, 2466.0, 4779.8, 4900.8, 5486.36, 13.027324460330151, 165.44521721515466, 4.897004185674646], "isController": false}, {"data": ["Login-6", 831, 459, 55.234657039711195, 2853.6077015643805, 1, 5915, 4399.0, 4804.200000000001, 4948.0, 5475.0, 13.001846230872735, 151.34613259614483, 4.021945015958945], "isController": false}, {"data": ["Login-7", 461, 305, 66.16052060737528, 3472.0151843817757, 2, 5895, 4517.0, 4852.0, 4954.0, 5575.04, 7.749983188756641, 106.1296584218025, 1.8146785007312891], "isController": false}, {"data": ["Welcome", 3000, 2630, 87.66666666666667, 4513.987, 151, 9464, 4638.0, 5475.8, 6432.999999999996, 7629.859999999997, 44.25105096246036, 3150.899612918541, 23.366297869496275], "isController": false}, {"data": ["Welcome-0", 831, 0, 0.0, 1106.4705174488577, 5, 4852, 800.0, 2610.0, 2885.3999999999996, 4239.5199999999995, 13.209136716949342, 32.97124360207277, 6.604568358474671], "isController": false}, {"data": ["Welcome-1", 831, 0, 0.0, 276.9121540312873, 71, 2329, 174.0, 402.20000000000095, 1012.599999999998, 1984.04, 13.198017914999046, 1881.776410677133, 7.114556532304174], "isController": false}, {"data": ["Welcome-2", 831, 210, 25.270758122743683, 1310.6149217809875, 2, 5575, 61.0, 4658.200000000001, 4806.4, 5216.039999999999, 12.410579608417091, 796.2029469526127, 5.5519194815110735], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 0.013049719431032232, 0.006409434687860531], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 0.013049719431032232, 0.006409434687860531], "isController": false}, {"data": ["403/Forbidden", 330, 4.306407412240636, 2.115113446993975], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 5, 0.06524859715516117, 0.032047173439302655], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 17, 0.22184523032754797, 0.10896038969362902], "isController": false}, {"data": ["Assertion failed", 1069, 13.950150071773457, 6.851685681322907], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 6240, 81.43024924964114, 39.99487245224971], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15602, 7663, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 6240, "Assertion failed", 1069, "403/Forbidden", 330, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 17, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 5], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login", 3000, 2777, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1833, "Assertion failed", 608, "403/Forbidden", 330, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 6, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 831, 298, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 297, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-3", 831, 251, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 249, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 1, null, null, null, null], "isController": false}, {"data": ["Login-4", 831, 350, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 347, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 1, null, null], "isController": false}, {"data": ["Login-5", 831, 383, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 379, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 2, null, null, null, null], "isController": false}, {"data": ["Login-6", 831, 459, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 455, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null], "isController": false}, {"data": ["Login-7", 461, 305, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 303, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome", 3000, 2630, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2167, "Assertion failed", 461, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Welcome-2", 831, 210, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 210, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
