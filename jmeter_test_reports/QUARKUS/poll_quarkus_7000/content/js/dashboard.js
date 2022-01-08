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

    var data = {"OkPercent": 63.79315476190476, "KoPercent": 36.20684523809524};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4234300595238095, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.20764285714285713, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.02807142857142857, 500, 1500, "Polls"], "isController": false}, {"data": [0.6267131821579865, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.7990932275432133, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.1047008547008547, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.3622892181911088, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [0.35147679324894515, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.7290843806104129, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.22333931777378815, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.35728571428571426, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.1149025069637883, 500, 1500, "Save Poll-8"], "isController": false}, {"data": [0.16481149012567325, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.10580747812251393, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [0.7416517055655296, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.7829443447037702, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.7247755834829444, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.26941176470588235, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.7276481149012567, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.38738019169329074, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.7123877917414722, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.2055167055167055, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.6994614003590665, 500, 1500, "Polls-7"], "isController": false}, {"data": [0.22046979865771812, 500, 1500, "Save Poll-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 67200, 24331, 36.20684523809524, 1598.8873214285718, 0, 33199, 229.5, 7973.0, 10543.95, 17929.99, 749.6067910805716, 40238.03351182276, 436.3423779518556], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 7000, 4794, 68.48571428571428, 2178.0098571428566, 2, 28723, 582.5, 6705.900000000001, 10077.499999999998, 17272.52999999999, 88.10240016110153, 4982.482605184039, 77.6617863902244], "isController": false}, {"data": ["Polls", 7000, 5373, 76.75714285714285, 3493.604000000001, 2, 33199, 1120.0, 12329.20000000001, 14780.9, 19283.729999999996, 78.1319760692919, 14551.702865054218, 125.11012379383762], "isController": false}, {"data": ["Save Poll-0", 4013, 0, 0.0, 1556.244704709692, 12, 17432, 307.0, 5446.2, 6790.9, 10631.540000000005, 50.51293347598968, 566.5739908505885, 35.71422249669583], "isController": false}, {"data": ["Show New Poll Form-0", 3529, 0, 0.0, 957.0586568432985, 0, 14262, 16.0, 3302.0, 8083.5, 9936.099999999999, 44.43017575666012, 51.54594609268772, 22.822531687503147], "isController": false}, {"data": ["Show New Poll Form-1", 936, 186, 19.871794871794872, 3411.920940170937, 2, 19218, 2612.0, 8266.500000000013, 9659.849999999999, 14577.08, 14.153939210645698, 1581.0438335239303, 6.146894610993498], "isController": false}, {"data": ["Save Poll-2", 1957, 714, 36.484414920797136, 1191.3888605007674, 2, 19275, 52.0, 4231.8, 5925.2, 11444.620000000004, 31.01868729295779, 665.5638501083752, 11.17877785163494], "isController": false}, {"data": ["Save Poll-1", 2370, 427, 18.0168776371308, 1887.5075949367124, 1, 15876, 843.5, 5280.700000000001, 6908.049999999998, 11661.9, 30.903235060176552, 1629.289191467219, 14.597477111884054], "isController": false}, {"data": ["Polls-0", 2785, 0, 0.0, 1417.9210053859965, 4, 17187, 66.0, 5308.4, 9550.899999999994, 12460.14, 36.43475758130773, 372.7594944186792, 18.573186970158822], "isController": false}, {"data": ["Polls-2", 2785, 422, 15.152603231597846, 4613.656732495511, 3, 24982, 2701.0, 11846.0, 12685.3, 15857.619999999995, 31.79550410430295, 175.4994448630567, 14.226499083809982], "isController": false}, {"data": ["Show New Poll Form", 7000, 3657, 52.24285714285714, 1349.7364285714275, 0, 28118, 125.5, 4068.7000000000016, 7481.749999999999, 16057.69999999995, 88.13013043259305, 1475.6717807715793, 27.940300492269728], "isController": false}, {"data": ["Save Poll-8", 718, 578, 80.50139275766017, 456.5849582172701, 0, 10440, 42.0, 1340.9000000000024, 3144.0499999999965, 6025.159999999982, 18.588034276542317, 245.00243312644005, 2.031650464700857], "isController": false}, {"data": ["Polls-1", 2785, 192, 6.8940754039497305, 5047.457809694797, 2, 24762, 3204.0, 12607.600000000002, 14356.099999999999, 16205.119999999999, 34.47507520146566, 4459.6881798692175, 17.397048168395578], "isController": false}, {"data": ["Save Poll-7", 1257, 1043, 82.97533810660302, 336.88066825775684, 0, 10272, 25.0, 1034.0000000000005, 1955.199999999999, 5062.52, 28.64826674567541, 166.96612476354352, 2.730577986473551], "isController": false}, {"data": ["Polls-4", 2785, 424, 15.224416517055655, 330.3572710951523, 2, 10274, 133.0, 751.0000000000005, 1122.6999999999998, 3103.7999999999975, 37.41670249355116, 4846.866138618974, 16.324765704770797], "isController": false}, {"data": ["Polls-3", 2785, 311, 11.166965888689408, 315.0172351885094, 2, 7359, 130.0, 783.0, 1098.5999999999985, 2268.319999999995, 37.38756880118137, 1805.1153835665862, 16.898162714793934], "isController": false}, {"data": ["Polls-6", 2785, 459, 16.481149012567325, 331.3529622980251, 2, 8851, 132.0, 779.8000000000002, 1141.0, 3169.6799999999985, 37.41821064370071, 2668.8777145207177, 15.930817876768463], "isController": false}, {"data": ["Save Poll-4", 1700, 1135, 66.76470588235294, 274.5335294117646, 2, 10512, 27.5, 596.2000000000016, 1300.699999999999, 5051.97, 37.8349505920057, 1192.6167380360878, 7.074079477043087], "isController": false}, {"data": ["Polls-5", 2785, 449, 16.122082585278278, 321.7407540394975, 2, 10274, 141.0, 749.4000000000005, 1104.3999999999996, 2649.2799999999997, 37.427765085337995, 677.5078928193456, 16.24865609461094], "isController": false}, {"data": ["Save Poll-3", 1878, 1014, 53.99361022364217, 274.7545260915869, 2, 10553, 27.0, 695.5000000000007, 1362.5499999999995, 4731.490000000006, 41.798352993545514, 1381.4730248789783, 10.748708059759625], "isController": false}, {"data": ["Polls-8", 2785, 560, 20.107719928186714, 300.2980251346494, 0, 10179, 93.0, 695.4000000000001, 976.3999999999996, 3722.8599999999683, 37.68606224627875, 1734.095311971414, 15.436360897327468], "isController": false}, {"data": ["Save Poll-6", 1287, 932, 72.41647241647242, 290.21289821289844, 2, 10261, 35.0, 722.0000000000005, 1442.5999999999908, 4982.0, 29.127531967862396, 517.9525052690392, 4.485844319339142], "isController": false}, {"data": ["Polls-7", 2785, 592, 21.25673249551167, 320.1802513464989, 1, 10414, 107.0, 697.4000000000001, 1041.5999999999985, 4248.28, 37.689632306172435, 226.68458848436254, 15.186813619016686], "isController": false}, {"data": ["Save Poll-5", 1490, 1069, 71.74496644295301, 246.80536912751614, 0, 10498, 30.0, 510.50000000000045, 1157.3000000000006, 3762.6699999999537, 33.52382666606669, 476.37319021959235, 5.328863782736354], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 13, 0.05342978093789816, 0.019345238095238096], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 2, 0.008219966298138178, 0.002976190476190476], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 301, 1.2371049278697956, 0.4479166666666667], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 142, 0.5836176071678106, 0.2113095238095238], "isController": false}, {"data": ["Assertion failed", 3151, 12.950556902716698, 4.688988095238095], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket is closed", 6, 0.02465989889441453, 0.008928571428571428], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 75, 0.30824873618018167, 0.11160714285714286], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 7, 0.028769882043483623, 0.010416666666666666], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 10, 0.04109983149069089, 0.01488095238095238], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 7, 0.028769882043483623, 0.010416666666666666], "isController": false}, {"data": ["500/Internal Server Error", 117, 0.4808680284410834, 0.17410714285714285], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 10, 0.04109983149069089, 0.01488095238095238], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 20490, 84.21355472442563, 30.491071428571427], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 67200, 24331, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 20490, "Assertion failed", 3151, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 301, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 142, "500/Internal Server Error", 117], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Save Poll", 7000, 4794, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2863, "Assertion failed", 1807, "500/Internal Server Error", 105, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 19, null, null], "isController": false}, {"data": ["Polls", 7000, 5373, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4134, "Assertion failed", 1158, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 69, "500/Internal Server Error", 12, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show New Poll Form-1", 936, 186, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 186, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-2", 1957, 714, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 708, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 4, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, null, null], "isController": false}, {"data": ["Save Poll-1", 2370, 427, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 423, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 4, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-2", 2785, 422, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 293, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 67, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 52, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket is closed", 2], "isController": false}, {"data": ["Show New Poll Form", 7000, 3657, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3418, "Assertion failed", 186, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 53, null, null, null, null], "isController": false}, {"data": ["Save Poll-8", 718, 578, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 576, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, null, null, null, null], "isController": false}, {"data": ["Polls-1", 2785, 192, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 161, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 8, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 7, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 7, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 5], "isController": false}, {"data": ["Save Poll-7", 1257, 1043, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1041, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-4", 2785, 424, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 423, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-3", 2785, 311, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 311, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-6", 2785, 459, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 459, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-4", 1700, 1135, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1135, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-5", 2785, 449, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 449, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-3", 1878, 1014, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1014, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-8", 2785, 560, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 553, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, null, null, null, null], "isController": false}, {"data": ["Save Poll-6", 1287, 932, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 932, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-7", 2785, 592, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 584, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 7, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null], "isController": false}, {"data": ["Save Poll-5", 1490, 1069, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1068, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
