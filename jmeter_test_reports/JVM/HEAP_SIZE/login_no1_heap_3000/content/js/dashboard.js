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

    var data = {"OkPercent": 76.97762586677668, "KoPercent": 23.02237413322333};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04426699668022079, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.028666666666666667, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.039, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.05855539971949509, 500, 1500, "Login-0"], "isController": false}, {"data": [0.004518072289156626, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.021213183730715287, 500, 1500, "Login-1"], "isController": false}, {"data": [0.028285835814547, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.34417868448821665, 500, 1500, "Login-2"], "isController": false}, {"data": [0.23947256486601445, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.002989799507562434, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0015828350334154062, 500, 1500, "Login-4"], "isController": false}, {"data": [0.003, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0025, 500, 1500, "Login-6"], "isController": false}, {"data": [0.00387263339070568, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0015, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0034423407917383822, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0025, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.024166666666666666, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.025833333333333333, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.005, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50907, 11720, 23.02237413322333, 23875.670497181065, 0, 111943, 24015.5, 51651.600000000006, 65546.45000000001, 92141.79000000004, 219.50998654662112, 14170.853473313691, 181.57171753186552], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 520, 17.333333333333332, 22101.94800000001, 0, 50223, 24874.0, 41489.0, 42877.6, 46590.279999999984, 21.627077100529863, 2132.7729207592906, 10.772424575568612], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 21047.561666666665, 30, 40090, 23269.5, 35381.9, 36891.85, 38392.78, 30.06132510321055, 77.20828615375365, 15.00130578880917], "isController": false}, {"data": ["Login", 3000, 2434, 81.13333333333334, 60994.215000000055, 0, 111943, 64943.0, 84481.80000000002, 89138.15, 101328.87, 13.953553272340802, 2810.2521970305675, 44.42373496504635], "isController": false}, {"data": ["Login-0", 2852, 0, 0.0, 11675.552244039258, 259, 46875, 3614.0, 32798.0, 34311.75, 42641.38999999999, 16.56242559394182, 6.144715427678763, 12.130682808062858], "isController": false}, {"data": ["Logout-2", 2324, 501, 21.55765920826162, 15017.619191049893, 0, 49688, 11715.5, 32699.5, 35344.25, 42561.75, 10.482161381985476, 982.8114913273532, 4.9543489736029045], "isController": false}, {"data": ["Login-1", 2852, 9, 0.3155680224403927, 28308.314165497904, 0, 46732, 30728.0, 40352.3, 42088.299999999996, 43883.20999999999, 14.501891551071878, 48.082290933076216, 8.867519601960705], "isController": false}, {"data": ["Logout-1", 2351, 27, 1.1484474691620588, 23469.814121650325, 0, 44680, 25012.0, 35118.8, 38018.20000000001, 42128.84, 10.536741901364262, 27.921645622221277, 5.268896163120059], "isController": false}, {"data": ["Login-2", 2843, 588, 20.68237776996131, 12961.315863524462, 0, 43854, 119.0, 33614.6, 34752.99999999999, 36277.6, 13.42056939468181, 739.1396185605578, 6.568363459396051], "isController": false}, {"data": ["Logout-0", 2351, 0, 0.0, 7428.350489153545, 23, 47005, 1821.0, 29440.000000000007, 35234.2, 42166.16, 10.876051868266076, 4.800757269976823, 6.139021464704875], "isController": false}, {"data": ["Login-3", 2843, 771, 27.11924023918396, 20766.87864931406, 0, 50207, 25455.0, 36570.799999999996, 39983.8, 43383.12, 13.31441309804803, 719.9678904449885, 6.143588311603162], "isController": false}, {"data": ["Login-4", 2843, 841, 29.58142806894126, 20101.05592683787, 0, 50209, 25090.0, 35904.399999999994, 39734.2, 43464.68, 13.40784757592907, 777.2210164871605, 6.0441776168411625], "isController": false}, {"data": ["Login-5", 1000, 240, 24.0, 20699.272999999986, 0, 50626, 22417.5, 40576.9, 42849.049999999996, 45340.9, 5.764486153704259, 96.4796249283042, 2.759522570845535], "isController": false}, {"data": ["Login-6", 1000, 279, 27.9, 19153.567000000025, 0, 50150, 18440.5, 40060.1, 42361.75, 46345.5, 5.762161040876771, 357.1281398375647, 2.584402379268321], "isController": false}, {"data": ["Logout-4", 2324, 533, 22.934595524956972, 14773.233648881262, 0, 47727, 11366.5, 32688.5, 35123.5, 42638.0, 10.482208660902353, 302.2440433603282, 4.851627196291084], "isController": false}, {"data": ["Login-7", 1000, 283, 28.3, 19079.385999999973, 0, 70422, 18124.0, 40001.7, 42353.5, 45786.880000000005, 5.763555883437846, 33.29636064766518, 2.57875786545267], "isController": false}, {"data": ["Logout-3", 2324, 510, 21.944922547332187, 14969.019363166955, 0, 47963, 11681.0, 32730.5, 35310.25, 42345.25, 10.48183044150877, 702.47133909725, 4.849835671712137], "isController": false}, {"data": ["Login-8", 1000, 426, 42.6, 14840.129, 0, 72350, 11150.0, 38421.2, 40673.049999999996, 52863.38000000001, 5.772405592306537, 194.98428462577493, 2.0708505062399705], "isController": false}, {"data": ["Logout", 3000, 1367, 45.56666666666667, 37433.52633333347, 0, 110722, 33849.5, 76542.50000000001, 88874.8, 102012.49999999997, 13.408540346297903, 2008.5167757251227, 25.70871119344948], "isController": false}, {"data": ["Login Welcome-3", 3000, 732, 24.4, 19655.835000000006, 0, 51769, 19094.0, 41034.8, 42873.0, 49589.73999999999, 21.976733964309783, 620.8786469932164, 9.97838153258417], "isController": false}, {"data": ["Login Welcome-2", 3000, 642, 21.4, 20679.682333333316, 0, 50833, 21153.0, 41437.6, 43137.299999999996, 48997.99, 22.102378215896028, 1489.5792610852636, 10.29793833160198], "isController": false}, {"data": ["Login Welcome", 3000, 1017, 33.9, 50731.341333333185, 471, 81094, 59858.5, 74073.5, 77665.95, 79065.94, 21.512161541991738, 4234.246991434575, 41.24064837206718], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 156, 1.3310580204778157, 0.30644115740467914], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 12, 0.10238907849829351, 0.023572396723436854], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 42, 0.3583617747440273, 0.08250338853202899], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4555, 38.86518771331058, 8.947688922937907], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2970, 25.341296928327644, 5.834168189050621], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1843, 15.725255972696246, 3.620327263441177], "isController": false}, {"data": ["Assertion failed", 2142, 18.27645051194539, 4.207672815133479], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50907, 11720, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4555, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2970, "Assertion failed", 2142, "Test failed: text expected to contain /The electronic survey app/", 1843, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 156], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 520, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 500, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 18, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2434, "Test failed: text expected to contain /The electronic survey app/", 1843, "Assertion failed", 434, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 156, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2324, 501, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 418, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 80, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, null, null, null, null], "isController": false}, {"data": ["Login-1", 2852, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2351, 27, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 27, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2843, 588, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 464, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 119, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2843, 771, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 443, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 310, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 18, null, null, null, null], "isController": false}, {"data": ["Login-4", 2843, 841, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 474, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 354, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-5", 1000, 240, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 227, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 13, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 1000, 279, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 265, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 13, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2324, 533, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 442, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 86, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-7", 1000, 283, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 269, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 13, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2324, 510, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 428, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 78, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, null, null, null, null], "isController": false}, {"data": ["Login-8", 1000, 426, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 380, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 42, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null], "isController": false}, {"data": ["Logout", 3000, 1367, "Assertion failed", 691, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 368, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 301, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1], "isController": false}, {"data": ["Login Welcome-3", 3000, 732, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 702, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 28, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 642, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 625, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 16, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 1017, "Assertion failed", 1017, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
