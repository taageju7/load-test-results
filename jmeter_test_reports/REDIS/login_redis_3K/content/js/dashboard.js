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

    var data = {"OkPercent": 89.13499102966081, "KoPercent": 10.865008970339197};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.20972988380476518, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1765, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.21266666666666667, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.008166666666666666, 500, 1500, "Login"], "isController": false}, {"data": [0.06987629555332665, 500, 1500, "Login-0"], "isController": false}, {"data": [0.336283185840708, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.1994316282179873, 500, 1500, "Login-1"], "isController": false}, {"data": [0.4095203488372093, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.37173352962826645, 500, 1500, "Login-2"], "isController": false}, {"data": [0.37463662790697677, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.1847626058152374, 500, 1500, "Login-3"], "isController": false}, {"data": [0.18034596981965403, 500, 1500, "Login-4"], "isController": false}, {"data": [0.1867868973132131, 500, 1500, "Login-5"], "isController": false}, {"data": [0.17887375782112624, 500, 1500, "Login-6"], "isController": false}, {"data": [0.30420353982300885, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.17868973132131027, 500, 1500, "Login-7"], "isController": false}, {"data": [0.3797935103244838, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.17666543982333455, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0775, 500, 1500, "Logout"], "isController": false}, {"data": [0.16766666666666666, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.18083333333333335, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.11566666666666667, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 59641, 6480, 10.865008970339197, 14202.527590080548, 0, 123671, 2974.5, 48594.8, 74614.05000000002, 98624.95000000001, 279.41961901370837, 20807.349367821662, 261.5600996563534], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 9, 0.3, 12572.336333333331, 4, 65701, 12430.0, 25535.0, 29336.8, 49933.49999999971, 17.43091547168057, 2065.3723901743383, 10.471299044422688], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 9126.769333333345, 2, 29521, 9663.5, 16117.0, 28544.0, 29335.0, 28.09620139357159, 72.24345534108788, 14.020663000112386], "isController": false}, {"data": ["Login", 3000, 1411, 47.03333333333333, 61190.97033333327, 619, 123671, 69003.5, 99115.0, 100782.6, 110340.60999999997, 14.368366604084448, 4317.035160702697, 66.37117565717317], "isController": false}, {"data": ["Login-0", 2991, 0, 0.0, 24860.136743564068, 276, 76766, 16827.0, 64811.4, 69201.0, 74597.52, 14.57900739917527, 6.250179929919867, 10.677983934942825], "isController": false}, {"data": ["Logout-2", 2712, 206, 7.595870206489676, 4208.965339233031, 2, 75776, 1286.5, 10369.700000000019, 18352.6, 54996.96, 13.495693022746613, 1484.6714195918946, 7.5140101945479785], "isController": false}, {"data": ["Login-1", 2991, 274, 9.16081578067536, 15880.618856569728, 2, 67061, 7831.0, 49187.000000000015, 57995.2, 64213.16, 14.494228476724915, 66.3196523532526, 7.9847251575538625], "isController": false}, {"data": ["Logout-1", 2752, 40, 1.4534883720930232, 6191.284156976734, 1, 66886, 804.0, 16666.40000000002, 38374.9499999996, 61769.85999999997, 13.824005143815867, 36.80686107929714, 6.891360122366557], "isController": false}, {"data": ["Login-2", 2717, 120, 4.416635995583364, 3000.5465587044523, 3, 19643, 1464.0, 8519.000000000002, 10375.2, 11923.460000000001, 13.039805722732552, 75.78228954445868, 7.169168209954311], "isController": false}, {"data": ["Logout-0", 2752, 0, 0.0, 9621.325218023292, 3, 66549, 1104.5, 30527.000000000007, 46555.09999999996, 61940.449999999975, 13.85253493335481, 6.114595497926147, 7.819106632303789], "isController": false}, {"data": ["Login-3", 2717, 275, 10.121457489878543, 12318.793522267226, 2, 79403, 5990.0, 46355.800000000185, 57778.89999999999, 65980.12000000007, 13.143191613898791, 645.0504664605535, 7.336923987654978], "isController": false}, {"data": ["Login-4", 2717, 386, 14.206845785793154, 11870.287817445716, 0, 79371, 6013.0, 33680.00000000008, 57148.799999999996, 66804.52000000005, 13.134995068938178, 1723.2238121564571, 7.06508873191944], "isController": false}, {"data": ["Login-5", 2717, 396, 14.574898785425102, 11396.818917924194, 2, 78665, 5863.0, 28510.0, 56210.799999999916, 67292.44, 13.142937303787122, 244.76609606963532, 7.0719258142985675], "isController": false}, {"data": ["Login-6", 2717, 439, 16.157526683842473, 11021.693779904275, 2, 79391, 5886.0, 26511.200000000244, 56280.49999999992, 67961.58, 13.134804573251795, 942.7576504752726, 6.850577321674604], "isController": false}, {"data": ["Logout-4", 2712, 407, 15.007374631268437, 3842.5460914454356, 1, 73521, 1211.5, 8758.800000000003, 15778.89999999999, 52669.479999999996, 13.49576018153589, 425.91607697360564, 6.88896147307566], "isController": false}, {"data": ["Login-7", 2717, 469, 17.261685682738314, 10585.503864556515, 2, 83181, 5724.0, 25207.400000000107, 55216.3, 73434.82, 13.142365142016871, 84.47399306210578, 6.78548819508939], "isController": false}, {"data": ["Logout-3", 2712, 332, 12.24188790560472, 3780.0707964601816, 2, 69712, 902.0, 8704.1, 17351.75, 55041.659999999996, 13.51526447458911, 1014.3172388456708, 7.030732182725179], "isController": false}, {"data": ["Login-8", 2717, 692, 25.469267574530733, 8883.602870813405, 1, 82699, 5712.0, 21727.800000000003, 29909.499999999985, 72282.56000000001, 13.156747857246623, 569.9617064170621, 6.128637838361339], "isController": false}, {"data": ["Logout", 3000, 849, 28.3, 20004.47233333334, 3, 102645, 4718.0, 64314.8, 88401.4, 96336.68, 14.923071566076874, 2968.186615186215, 35.966492147044484], "isController": false}, {"data": ["Login Welcome-3", 3000, 33, 1.1, 12254.630333333322, 4, 70428, 10166.0, 25515.7, 28176.75, 48528.79999999995, 16.96487140627474, 615.7453092130561, 10.076785702925308], "isController": false}, {"data": ["Login Welcome-2", 3000, 56, 1.8666666666666667, 12170.662000000022, 4, 75161, 9481.0, 25764.6, 26105.95, 48182.93, 16.52264428399121, 1381.5665893544603, 9.611359868700054], "isController": false}, {"data": ["Login Welcome", 3000, 86, 2.8666666666666667, 26650.46433333333, 9, 107011, 27424.0, 47046.2, 68617.14999999998, 94579.54999999999, 16.50491846570278, 3977.226403898049, 37.55599637441958], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 101, 1.558641975308642, 0.169346590432756], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 0.015432098765432098, 0.0016766989151758018], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 41, 0.6327160493827161, 0.06874465552220788], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 0.015432098765432098, 0.0016766989151758018], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 5, 0.07716049382716049, 0.00838349457587901], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1916, 29.567901234567902, 3.212555121476836], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 12, 0.18518518518518517, 0.020120386982109623], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 1, 0.015432098765432098, 0.0016766989151758018], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 45, 0.6944444444444444, 0.07545145118291108], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2578, 39.78395061728395, 4.322529803323217], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, 0.06172839506172839, 0.006706795660703207], "isController": false}, {"data": ["Assertion failed", 1775, 27.391975308641975, 2.976140574437048], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 59641, 6480, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2578, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1916, "Assertion failed", 1775, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 101, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 45], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 9, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 1411, "Assertion failed", 1128, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 283, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2712, 206, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 165, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 41, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 2991, 274, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 274, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2752, 40, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 37, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2717, 120, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 101, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 8, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 5, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2717, 275, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 158, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 115, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null], "isController": false}, {"data": ["Login-4", 2717, 386, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 221, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 161, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1], "isController": false}, {"data": ["Login-5", 2717, 396, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 219, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 175, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 2, null, null, null, null], "isController": false}, {"data": ["Login-6", 2717, 439, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 237, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 199, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["Logout-4", 2712, 407, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 337, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 70, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 2717, 469, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 260, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 206, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["Logout-3", 2712, 332, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 280, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 52, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 2717, 692, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 348, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 259, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 37, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 36, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 12], "isController": false}, {"data": ["Logout", 3000, 849, "Assertion failed", 561, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 280, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 8, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 3000, 33, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 33, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 56, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 56, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 86, "Assertion failed", 86, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
