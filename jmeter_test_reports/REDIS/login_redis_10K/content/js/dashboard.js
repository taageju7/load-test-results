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

    var data = {"OkPercent": 64.81238930150178, "KoPercent": 35.18761069849822};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.08445458198758689, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13460901259111996, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.13386348575215373, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.012580054894784995, 500, 1500, "Login-0"], "isController": false}, {"data": [0.05150513311292849, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.1455474229948155, 500, 1500, "Login-1"], "isController": false}, {"data": [0.09486754966887417, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.16028417951828106, 500, 1500, "Login-2"], "isController": false}, {"data": [0.10877483443708609, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.1307399064286952, 500, 1500, "Login-3"], "isController": false}, {"data": [0.11921677352278634, 500, 1500, "Login-4"], "isController": false}, {"data": [0.12666015625, 500, 1500, "Login-5"], "isController": false}, {"data": [0.11806640625, 500, 1500, "Login-6"], "isController": false}, {"data": [0.035931790499390985, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.11884765625, 500, 1500, "Login-7"], "isController": false}, {"data": [0.04837306420741256, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.119921875, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0017, 500, 1500, "Logout"], "isController": false}, {"data": [0.12400596421471173, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.13369781312127235, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0265, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 134374, 47283, 35.18761069849822, 15405.825650795487, 0, 130346, 6005.5, 47213.700000000004, 69689.95, 75224.96, 332.554582667188, 18038.639939855122, 236.67733407877674], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 6036, 887, 14.695162359178264, 8998.215540092815, 1, 59861, 8658.0, 17371.6, 21374.499999999996, 43538.46000000001, 17.915285276283022, 1823.0446164823743, 9.208366499997032], "isController": false}, {"data": ["Login Welcome-0", 6036, 0, 0.0, 12915.209078860198, 3, 65583, 11165.5, 27188.0, 39643.0, 58928.78, 18.85678403733868, 48.48624254913355, 9.409977190507878], "isController": false}, {"data": ["Login", 10000, 9245, 92.45, 42537.96660000006, 2, 130346, 48312.5, 80054.7, 87135.59999999998, 97551.86999999998, 25.123166322898005, 3616.9990198235914, 57.84122775186602], "isController": false}, {"data": ["Login-0", 6558, 0, 0.0, 25740.14943580355, 20, 64922, 21074.0, 49311.2, 53620.0, 60527.28999999998, 16.823105989672182, 7.220403823966641, 12.18461886994287], "isController": false}, {"data": ["Logout-2", 5747, 1395, 24.27353401774839, 9621.658082477827, 2, 65535, 4868.0, 24934.2, 41921.999999999956, 48890.55999999998, 16.978244685251052, 1538.494271444192, 7.746859600817744], "isController": false}, {"data": ["Login-1", 6558, 787, 12.000609942055505, 14357.566178713067, 2, 52483, 10701.5, 39927.400000000016, 43956.0, 46934.25, 16.66031552473135, 71.43382387965856, 8.899155575985063], "isController": false}, {"data": ["Logout-1", 6040, 293, 4.8509933774834435, 12763.5660596027, 1, 58395, 9574.5, 36499.5, 45432.14999999999, 47872.770000000004, 17.874740683087357, 47.73759114471586, 8.60347322821072], "isController": false}, {"data": ["Login-2", 5771, 2230, 38.64148327846127, 13508.702131346417, 0, 90384, 7718.0, 37710.8, 50671.59999999999, 68541.87999999999, 14.647170946266634, 172.44701879325814, 5.237388059452895], "isController": false}, {"data": ["Logout-0", 6040, 0, 0.0, 15901.252483443732, 3, 60100, 9887.5, 44045.8, 48458.24999999999, 52526.0, 17.944253976553632, 7.770095002049922, 10.032182306490235], "isController": false}, {"data": ["Login-3", 5771, 1653, 28.64321608040201, 9079.890313637137, 1, 59786, 5631.0, 22591.600000000006, 42270.799999999996, 47112.479999999996, 14.548507208708433, 594.6298154233776, 6.460492962717402], "isController": false}, {"data": ["Login-4", 5771, 1951, 33.806965863801764, 8660.038121642698, 0, 63764, 4392.0, 21901.800000000003, 41202.399999999994, 46949.84, 14.547920411203739, 1412.9315122725232, 6.05021246965507], "isController": false}, {"data": ["Login-5", 5120, 1672, 32.65625, 8963.907812500014, 0, 65541, 5235.0, 22582.20000000001, 40710.8, 47227.43, 12.903128252558574, 196.41532556378732, 5.473335477554353], "isController": false}, {"data": ["Login-6", 5120, 1816, 35.46875, 8538.993359375, 0, 65502, 4612.5, 21552.20000000002, 37093.299999999996, 47060.34, 12.908170468526249, 721.0193417912418, 5.181723625229422], "isController": false}, {"data": ["Logout-4", 5747, 2068, 35.983991647816254, 8864.247259439699, 1, 65554, 3679.0, 21078.59999999999, 40890.39999999997, 49094.0, 16.97724157489247, 414.81120695592034, 6.527259488769969], "isController": false}, {"data": ["Login-7", 5120, 1865, 36.42578125, 8406.786132812475, 0, 59966, 4649.0, 20826.900000000034, 36205.849999999984, 46939.909999999996, 12.908072839851659, 71.42516047640116, 5.120865166260768], "isController": false}, {"data": ["Logout-3", 5747, 1824, 31.738298242561335, 9058.982425613332, 2, 65677, 3772.0, 22378.599999999995, 41578.2, 49026.719999999994, 16.984215643683157, 1001.4006882290402, 6.872446073748496], "isController": false}, {"data": ["Login-8", 5120, 2743, 53.57421875, 6116.849023437496, 0, 59690, 443.5, 19072.600000000013, 25702.0, 46959.479999999996, 12.948159312938296, 362.0113035992469, 3.7570525740788976], "isController": false}, {"data": ["Logout", 10000, 7106, 71.06, 27607.59989999994, 1, 116409, 13496.5, 68587.7, 74754.0, 89240.53999999992, 29.53023305259925, 3038.91431532955, 39.69230143133039], "isController": false}, {"data": ["Login Welcome-3", 6036, 1787, 29.60569913850232, 8623.594102054372, 2, 65645, 7777.5, 18297.3, 22061.199999999997, 44169.51000000004, 17.92928092771256, 476.86909425905077, 7.5801104047974786], "isController": false}, {"data": ["Login Welcome-2", 6036, 1505, 24.933730947647447, 8255.340954274363, 1, 65656, 7403.0, 17380.2, 21176.449999999997, 41462.84000000002, 17.934075337378108, 1158.181224113547, 7.980177573826531], "isController": false}, {"data": ["Login Welcome", 10000, 6456, 64.56, 19582.756199999858, 1, 96484, 13054.5, 41919.2, 62189.649999999994, 81247.93, 29.664875896991685, 3531.579535054984, 33.67653180612372], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 13, 0.02749402533680181, 0.009674490600860286], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 120, 0.25379100310893976, 0.08930299016178725], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to fonts.googleapis.com:443 [fonts.googleapis.com/172.217.168.74] failed: Connection timed out: connect", 339, 0.7169595837827549, 0.25228094720704897], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 20, 0.04229850051815663, 0.014883831693631208], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 4, 0.008459700103631326, 0.0029767663387262415], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 651, 1.3768161918659982, 0.48446872162769583], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1266, 2.677495082799315, 0.9421465462068555], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 9998, 21.1450204090265, 7.440427463646241], "isController": false}, {"data": ["Assertion failed", 9710, 20.535922001565044, 7.226100287257951], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 272, 0.5752596070469301, 0.20242011103338445], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 23, 0.04864327559588012, 0.01711640644767589], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 0.0021149250259078316, 7.441915846815604E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 24806, 52.46283019266967, 18.460416449610786], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: socket write error", 1, 0.0021149250259078316, 7.441915846815604E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 34, 0.07190745088086627, 0.025302513879173056], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 9, 0.019034325233170484, 0.006697724262134044], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 16, 0.033838800414525305, 0.011907065354904966], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 134374, 47283, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 24806, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 9998, "Assertion failed", 9710, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1266, "Test failed: text expected to contain /The electronic survey app/", 651], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 6036, 887, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 760, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 127, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 10000, 9245, "Assertion failed", 4365, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2208, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2021, "Test failed: text expected to contain /The electronic survey app/", 651, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 5747, 1395, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1145, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 246, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4, null, null, null, null], "isController": false}, {"data": ["Login-1", 6558, 787, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 532, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 255, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 6040, 293, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 248, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 45, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 5771, 2230, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1266, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to fonts.googleapis.com:443 [fonts.googleapis.com/172.217.168.74] failed: Connection timed out: connect", 339, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 336, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 272, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 9], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 5771, 1653, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1462, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 185, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, null, null, null, null], "isController": false}, {"data": ["Login-4", 5771, 1951, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1749, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 194, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1], "isController": false}, {"data": ["Login-5", 5120, 1672, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1436, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 228, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1], "isController": false}, {"data": ["Login-6", 5120, 1816, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1543, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 264, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2], "isController": false}, {"data": ["Logout-4", 5747, 2068, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1716, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 347, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 5, null, null, null, null], "isController": false}, {"data": ["Login-7", 5120, 1865, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1539, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 316, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 8, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1], "isController": false}, {"data": ["Logout-3", 5747, 1824, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1508, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 305, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["Login-8", 5120, 2743, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2173, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 410, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 89, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 30, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 16], "isController": false}, {"data": ["Logout", 10000, 7106, "Assertion failed", 2853, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2330, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1922, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 1, null, null], "isController": false}, {"data": ["Login Welcome-3", 6036, 1787, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1347, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 439, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 6036, 1505, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1183, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 321, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 10000, 6456, "Assertion failed", 2492, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2186, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1778, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
