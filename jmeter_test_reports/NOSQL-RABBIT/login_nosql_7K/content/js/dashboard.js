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

    var data = {"OkPercent": 73.13320825515947, "KoPercent": 26.866791744840526};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.10119136960600375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15628427286685675, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.23470059223513928, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.009701797385620915, 500, 1500, "Login-0"], "isController": false}, {"data": [0.11584499898559546, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.0803717320261438, 500, 1500, "Login-1"], "isController": false}, {"data": [0.13175074183976263, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.20698869475847892, 500, 1500, "Login-2"], "isController": false}, {"data": [0.12265084075173097, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.10236382322713258, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0974306269270298, 500, 1500, "Login-4"], "isController": false}, {"data": [0.10165929203539822, 500, 1500, "Login-5"], "isController": false}, {"data": [0.09435840707964602, 500, 1500, "Login-6"], "isController": false}, {"data": [0.12061270034489754, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.09469026548672567, 500, 1500, "Login-7"], "isController": false}, {"data": [0.12680056806654494, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.08528761061946903, 500, 1500, "Login-8"], "isController": false}, {"data": [0.007214285714285714, 500, 1500, "Logout"], "isController": false}, {"data": [0.16220662425970608, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.15792937047598157, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.04264285714285714, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 106600, 28640, 26.866791744840526, 11282.276313320817, 0, 120877, 1987.0, 10761.800000000003, 13875.600000000006, 22617.0, 323.62263051160306, 19958.03253222375, 256.58403230837655], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 4559, 610, 13.380127220881773, 8369.625795130523, 1, 45776, 5278.0, 21111.0, 32156.0, 36339.99999999998, 14.161903578528827, 1462.5612960421067, 7.391360455431474], "isController": false}, {"data": ["Login Welcome-0", 4559, 0, 0.0, 7868.29809168677, 3, 46251, 6455.0, 17852.0, 20359.0, 34200.8, 14.564238867573723, 37.4488681038297, 7.267896544267747], "isController": false}, {"data": ["Login", 7000, 5830, 83.28571428571429, 31415.575285714356, 1, 120877, 21843.0, 84462.70000000001, 92345.6, 103494.78, 21.356569280710744, 4163.567649102223, 63.61253484267073], "isController": false}, {"data": ["Login-0", 4896, 0, 0.0, 14881.286151960809, 77, 73286, 8241.0, 45249.0, 45584.0, 45726.03, 15.05062987623808, 6.457548125472638, 10.93641206863161], "isController": false}, {"data": ["Logout-2", 4929, 857, 17.386893893284643, 6754.913775613705, 2, 47057, 4454.0, 16092.0, 21170.5, 45332.899999999994, 16.512839411045412, 1628.556687114734, 8.219699031809578], "isController": false}, {"data": ["Login-1", 4896, 31, 0.6331699346405228, 11268.917075163392, 3, 45730, 7896.0, 22826.2, 33670.649999999994, 45400.18, 15.017437527030468, 68.19572445103229, 9.054757256817812], "isController": false}, {"data": ["Logout-1", 5055, 126, 2.492581602373887, 7732.40969337286, 2, 45580, 5944.0, 17299.800000000003, 21589.39999999992, 34139.679999999935, 16.92860515661053, 45.05641900348953, 8.350257403543788], "isController": false}, {"data": ["Login-2", 4865, 1399, 28.756423432682425, 9486.569167523117, 2, 63644, 4988.0, 26835.4, 31193.6, 47667.740000000005, 14.883866072739734, 151.56825186660203, 6.149866372176196], "isController": false}, {"data": ["Logout-0", 5055, 0, 0.0, 10349.639762611274, 4, 47071, 6306.0, 27945.4, 36331.399999999994, 45563.0, 16.82235526285138, 7.325071840275814, 9.431298108441794], "isController": false}, {"data": ["Login-3", 4865, 1002, 20.596094552929085, 8327.784583761551, 2, 63039, 3419.0, 23596.2, 33888.1, 45299.04, 14.902969872413424, 664.5181065148801, 7.358652491231295], "isController": false}, {"data": ["Login-4", 4865, 1237, 25.42651593011305, 7935.350256937312, 0, 46597, 2899.0, 23056.000000000036, 33900.1, 45304.36, 14.904933180556492, 1656.7707493606429, 6.9777476279250745], "isController": false}, {"data": ["Login-5", 4520, 1199, 26.52654867256637, 7835.952212389367, 0, 62773, 2772.0, 22797.000000000007, 34005.149999999994, 45309.43, 13.844094666654415, 226.4666243322981, 6.407000518579265], "isController": false}, {"data": ["Login-6", 4520, 1295, 28.650442477876105, 7731.188938053117, 0, 73355, 2564.5, 22654.7, 34553.0, 45357.38, 13.846681697872757, 851.1557615033529, 6.145772344048684], "isController": false}, {"data": ["Logout-4", 4929, 1397, 28.342462974234124, 5831.3154798133255, 1, 47566, 2307.0, 15745.0, 20142.5, 45301.7, 16.512839411045412, 446.0983204544883, 7.106549628134474], "isController": false}, {"data": ["Login-7", 4520, 1363, 30.154867256637168, 7361.44225663718, 0, 62940, 2472.5, 21324.600000000002, 33882.0, 45303.37, 13.847742235920187, 80.37352283728598, 6.0355384295909715], "isController": false}, {"data": ["Logout-3", 4929, 1126, 22.844390342868735, 6250.30026374517, 0, 47162, 3068.0, 16001.0, 20894.0, 45337.299999999996, 16.512784090909093, 1094.6056536090518, 7.552253238946251], "isController": false}, {"data": ["Login-8", 4520, 1988, 43.982300884955755, 6691.282079646032, 0, 62787, 955.5, 22615.900000000005, 33107.95, 45241.0, 13.85156151840082, 459.3927142740035, 4.849578783820641], "isController": false}, {"data": ["Logout", 7000, 4026, 57.51428571428571, 19567.932571428515, 2, 101614, 12404.5, 54270.40000000007, 71087.54999999999, 87417.25999999976, 23.29443163250705, 3216.139957728926, 40.454475531071445], "isController": false}, {"data": ["Login Welcome-3", 4559, 754, 16.538714630401405, 9027.814432989673, 1, 45851, 4393.0, 27806.0, 33916.0, 45272.6, 14.161155754076109, 439.41670907759124, 7.09837481304572], "isController": false}, {"data": ["Login Welcome-2", 4559, 658, 14.43298969072165, 8540.896907216511, 2, 45679, 5319.0, 26865.0, 28047.0, 36410.799999999996, 14.1606719097494, 1037.046883104958, 7.182554883669102], "isController": false}, {"data": ["Login Welcome", 7000, 3742, 53.457142857142856, 17178.01985714296, 2, 103934, 5997.5, 55841.0, 57193.95, 100150.84, 21.73278608108192, 2992.602900012302, 28.724885534191884], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 2, 0.006983240223463687, 0.001876172607879925], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 57, 0.19902234636871508, 0.05347091932457786], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 2, 0.006983240223463687, 0.001876172607879925], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 4, 0.013966480446927373, 0.00375234521575985], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 1, 0.0034916201117318434, 9.380863039399625E-4], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 345, 1.204608938547486, 0.3236397748592871], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 703, 2.454608938547486, 0.6594746716697936], "isController": false}, {"data": ["Assertion failed", 6606, 23.06564245810056, 6.196998123827392], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket is closed", 2, 0.006983240223463687, 0.001876172607879925], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 385, 1.3442737430167597, 0.3611632270168856], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 30, 0.10474860335195531, 0.028142589118198873], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 6, 0.02094972067039106, 0.005628517823639775], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: socket write error", 5, 0.017458100558659217, 0.004690431519699813], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 20375, 71.14175977653632, 19.113508442776734], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, 0.0034916201117318434, 9.380863039399625E-4], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 42, 0.14664804469273743, 0.039399624765478425], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 74, 0.25837988826815644, 0.06941838649155722], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 106600, 28640, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 20375, "Assertion failed", 6606, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 703, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 385, "Test failed: text expected to contain /The electronic survey app/", 345], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 4559, 610, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 610, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 7000, 5830, "Assertion failed", 3350, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2134, "Test failed: text expected to contain /The electronic survey app/", 345, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 4929, 857, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 856, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 4896, 31, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 30, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 5055, 126, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 126, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 4865, 1399, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 703, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 385, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 256, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 42, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: socket write error", 5], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 4865, 1002, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1000, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 1, null, null, null, null], "isController": false}, {"data": ["Login-4", 4865, 1237, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1233, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 1, null, null], "isController": false}, {"data": ["Login-5", 4520, 1199, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1197, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 4520, 1295, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1294, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 4929, 1397, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1390, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null], "isController": false}, {"data": ["Login-7", 4520, 1363, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1360, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null], "isController": false}, {"data": ["Logout-3", 4929, 1126, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1120, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 5, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-8", 4520, 1988, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1852, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 70, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 48, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 16, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1], "isController": false}, {"data": ["Logout", 7000, 4026, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2071, "Assertion failed", 1955, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 4559, 754, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 750, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 4559, 658, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 655, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 7000, 3742, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2441, "Assertion failed", 1301, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
