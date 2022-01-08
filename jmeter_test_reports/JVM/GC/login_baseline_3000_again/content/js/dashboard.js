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

    var data = {"OkPercent": 77.33533426527424, "KoPercent": 22.664665734725762};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.028071293479154675, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.02, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.026, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.004030780505679736, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-2"], "isController": false}, {"data": [3.6643459142543056E-4, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.33129680725266064, 500, 1500, "Login-2"], "isController": false}, {"data": [0.12052772808586762, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.017166666666666667, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.0165, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0015, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48644, 11025, 22.664665734725762, 38429.16752322992, 2, 179432, 35622.0, 83526.90000000008, 130538.9, 142983.5300000001, 140.9603291894868, 9115.167711570713, 115.58442521335014], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 460, 15.333333333333334, 37878.7793333334, 72, 77445, 49460.0, 60469.8, 61348.8, 63810.729999999996, 17.529098303183282, 1771.4299617573504, 8.942464934499602], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 31013.14900000005, 102, 58252, 33216.5, 50558.5, 52254.6, 54148.759999999995, 25.426314540461743, 65.378404477574, 12.688326884937451], "isController": false}, {"data": ["Login", 3000, 2474, 82.46666666666667, 97256.0059999998, 4070, 172083, 106677.0, 141911.5, 148069.19999999998, 156568.66999999998, 9.794894900777715, 1669.535837530854, 27.592273139010782], "isController": false}, {"data": ["Login-0", 2729, 0, 0.0, 35031.90509344081, 250, 71619, 43729.0, 59722.0, 61615.0, 64710.899999999994, 11.473473111543685, 4.272810438590222, 8.403422689118909], "isController": false}, {"data": ["Logout-2", 2149, 251, 11.679851093531875, 22293.841321544904, 2, 72427, 19896.0, 39314.0, 41831.0, 57947.0, 6.9205377988889785, 728.4992496326786, 3.682856905643668], "isController": false}, {"data": ["Login-1", 2729, 192, 7.0355441553682665, 41126.443385855724, 1217, 71852, 43922.0, 58491.0, 60310.5, 62886.399999999994, 9.887896113683631, 32.951636997769874, 5.637754183514859], "isController": false}, {"data": ["Logout-1", 2236, 87, 3.89087656529517, 32591.014758497306, 2, 74574, 32014.5, 53735.5, 55817.8, 59785.86, 6.930690000402947, 18.523618923054155, 3.36954214942828], "isController": false}, {"data": ["Login-2", 2537, 626, 24.67481277098936, 15615.129680725264, 2, 63562, 219.0, 40336.600000000006, 44483.39999999998, 57579.44, 8.433418542883452, 417.3626701091907, 3.9031335909010827], "isController": false}, {"data": ["Logout-0", 2236, 0, 0.0, 20598.217799642218, 22, 73606, 5919.0, 52269.6, 56357.55, 60807.08, 7.2076718510758315, 3.1815114030139413, 4.068392900314287], "isController": false}, {"data": ["Login-3", 2537, 898, 35.39613716988569, 26716.552621206127, 2, 100117, 34966.0, 53612.4, 57778.299999999996, 62299.13999999998, 8.438664183076105, 403.20289372255854, 3.4488403905002665], "isController": false}, {"data": ["Login-4", 2537, 903, 35.59322033898305, 26640.305873078487, 2, 81246, 34786.0, 53783.80000000001, 57695.5, 61728.09999999999, 8.471124051714927, 465.73760624382277, 3.4900122772030935], "isController": false}, {"data": ["Login-5", 914, 247, 27.024070021881837, 32197.008752735223, 3534, 76654, 38791.0, 58327.0, 60836.5, 70180.0500000001, 3.680734536082474, 60.16042257092663, 1.6918968908565561], "isController": false}, {"data": ["Login-6", 914, 242, 26.477024070021884, 32420.159737417966, 1937, 96156, 38783.5, 58485.0, 60693.75, 70425.70000000008, 3.685469010205604, 233.44748200360078, 1.685603082245636], "isController": false}, {"data": ["Logout-4", 2149, 270, 12.563983248022335, 21920.879013494618, 2, 67686, 19845.0, 39132.0, 41656.0, 57318.5, 6.9207829598665445, 224.18878645065118, 3.634299827262217], "isController": false}, {"data": ["Login-7", 914, 242, 26.477024070021884, 32456.56892778995, 2121, 108039, 38809.5, 58544.5, 60548.75, 70690.45000000001, 3.6901411862552336, 22.33539709391288, 1.6930389967983785], "isController": false}, {"data": ["Logout-3", 2149, 254, 11.81945090739879, 22300.617961842734, 2, 79726, 19869.0, 39677.0, 42411.0, 58287.0, 6.920849824965943, 521.8391455435556, 3.617603447422152], "isController": false}, {"data": ["Login-8", 914, 302, 33.04157549234136, 31178.921225382932, 1733, 73735, 37566.0, 57214.0, 60185.0, 65007.35, 3.679238067635184, 144.38495097536037, 1.5397249024840896], "isController": false}, {"data": ["Logout", 3000, 1166, 38.86666666666667, 57619.699666666595, 2, 179432, 51350.0, 128674.4, 134490.19999999998, 148807.99999999985, 9.10777226926218, 1417.232410923141, 17.440275071799604], "isController": false}, {"data": ["Login Welcome-3", 3000, 786, 26.2, 32723.51866666665, 56, 80723, 33964.0, 60441.8, 61700.899999999994, 73163.23999999999, 17.25863794829312, 480.03620538642093, 7.649587896085741], "isController": false}, {"data": ["Login Welcome-2", 3000, 654, 21.8, 34842.45033333327, 91, 78686, 40571.0, 60477.6, 61623.65, 71824.63999999998, 17.23444591256391, 1158.4395039531512, 7.9890072061526975], "isController": false}, {"data": ["Login Welcome", 3000, 971, 32.36666666666667, 77811.34433333328, 507, 124566, 92736.5, 106896.7, 108414.25, 119980.0, 17.068050316612336, 3390.715062856651, 32.70160656579449], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 50, 0.45351473922902497, 0.10278759970397171], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2990, 27.120181405895693, 6.1466984622975085], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1623, 14.72108843537415, 3.336485486390922], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4687, 42.512471655328795, 9.635309596250309], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, 0.009070294784580499, 0.0020557519940794344], "isController": false}, {"data": ["Assertion failed", 1674, 15.183673469387756, 3.441328838088973], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 48644, 11025, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4687, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2990, "Assertion failed", 1674, "Test failed: text expected to contain /The electronic survey app/", 1623, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 50], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 460, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 460, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2474, "Test failed: text expected to contain /The electronic survey app/", 1623, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 463, "Assertion failed", 388, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2149, 251, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 194, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 57, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 2729, 192, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 192, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2236, 87, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 53, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 34, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2537, 626, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 624, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2537, 898, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 654, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 242, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Login-4", 2537, 903, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 654, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 247, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Login-5", 914, 247, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 246, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 914, 242, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 242, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2149, 270, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 204, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 66, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 914, 242, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 241, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2149, 254, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 195, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 59, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 914, 302, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 257, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 45, null, null, null, null, null, null], "isController": false}, {"data": ["Logout", 3000, 1166, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 431, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 420, "Assertion failed", 315, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 3000, 786, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 786, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 654, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 654, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 971, "Assertion failed", 971, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
