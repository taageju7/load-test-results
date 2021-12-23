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

    var data = {"OkPercent": 45.958237165917815, "KoPercent": 54.041762834082185};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.14991191292353495, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.4285714285714287E-4, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.0, 500, 1500, "Polls"], "isController": false}, {"data": [0.009551800146950772, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.0338855421686747, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.05265486725663717, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [1.0, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.005143277002204262, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.08577270770555316, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.8630004304778304, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.0064285714285714285, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.0, 500, 1500, "Save Poll-8"], "isController": false}, {"data": [0.8459965561773569, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.0010626992561105207, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [0.08512699095996556, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.08598794662074903, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.08544984933275936, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.0026642984014209592, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.08544984933275936, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.0026642984014209592, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.08265174343521309, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.001594048884165781, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.08265174343521309, 500, 1500, "Polls-7"], "isController": false}, {"data": [0.0037194473963868225, 500, 1500, "Save Poll-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 73223, 39571, 54.041762834082185, 51983.564972754706, 0, 550487, 23370.0, 437018.4, 477126.5, 505768.76, 110.20440107219883, 5476.595668458838, 51.25293232281027], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 7000, 6140, 87.71428571428571, 34865.649, 1, 550487, 4088.0, 111088.10000000002, 143552.34999999983, 497323.85, 10.633029836281722, 661.973924025198, 8.281728427006529], "isController": false}, {"data": ["Polls", 7000, 6079, 86.84285714285714, 183120.14999999997, 1, 513927, 137802.5, 477380.20000000007, 498131.3, 509685.7, 12.79214050887135, 2504.6737248919976, 19.946154011546735], "isController": false}, {"data": ["Save Poll-0", 1361, 0, 0.0, 75981.18956649522, 142, 491484, 16237.0, 265358.9999999997, 467619.3, 483254.13999999996, 2.177481545003952, 0.7972519419943556, 1.724414004378162], "isController": false}, {"data": ["Show New Poll Form-0", 1328, 0, 0.0, 64741.22364457821, 25, 486622, 12543.5, 246118.70000000007, 408235.25, 479854.13, 2.3568288583755272, 3.8896882525924226, 1.1991287453258297], "isController": false}, {"data": ["Save Poll-2", 1130, 71, 6.283185840707965, 38175.94159292038, 81, 484718, 35770.5, 60610.9, 61845.65, 191142.0600000001, 1.7169494821801916, 101.78221261465956, 1.003783046054511], "isController": false}, {"data": ["Show New Poll Form-1", 99, 0, 0.0, 162.71717171717165, 79, 330, 159.0, 232.0, 249.0, 330.0, 15.686895896054507, 2176.2655853866268, 8.502175021787355], "isController": false}, {"data": ["Save Poll-1", 1361, 231, 16.972814107274065, 45077.39162380604, 13, 489676, 31541.0, 64655.799999999996, 128041.29999999999, 480420.51999999967, 2.0835884874464177, 67.98868042664957, 1.0594357585731782], "isController": false}, {"data": ["Polls-0", 4646, 0, 0.0, 198056.0852346102, 3, 491193, 179782.0, 427594.70000000007, 459550.14999999997, 482543.55, 8.572461842765625, 350.546950174526, 4.277859376614487], "isController": false}, {"data": ["Polls-2", 4646, 135, 2.90572535514421, 962.5535944898845, 75, 17872, 104.0, 3393.3, 7648.899999999976, 11568.229999999978, 8.57168686591011, 50.49016422686004, 4.388880157356688], "isController": false}, {"data": ["Show New Poll Form", 7000, 5672, 81.02857142857142, 16533.607714285747, 1, 489820, 4089.0, 12100.700000000033, 29311.149999999987, 408470.6499999999, 12.423043681196305, 55.755226635138754, 1.309705619341969], "isController": false}, {"data": ["Save Poll-8", 55, 5, 9.090909090909092, 51256.600000000006, 6956, 63308, 52581.0, 62145.4, 62908.6, 63308.0, 0.5551798277933115, 29.00622377090757, 0.31544308397347254], "isController": false}, {"data": ["Polls-1", 4646, 181, 3.8958243650452, 1101.3037021093419, 1, 17914, 101.0, 3142.200000000006, 7986.65, 15424.71, 8.571512910772137, 1143.8454790965595, 4.464704991600987], "isController": false}, {"data": ["Save Poll-7", 941, 69, 7.332624867162593, 41465.00743889475, 8, 389933, 41686.0, 60850.8, 62139.4, 184720.40000000052, 1.429804355357284, 71.91041154168161, 0.8280197423351243], "isController": false}, {"data": ["Polls-4", 4646, 3365, 72.42789496340939, 31782.208781747748, 3, 476390, 4082.0, 54908.500000000306, 278157.1999999992, 453069.59, 8.502321393604776, 375.41448402177554, 1.2064743703094034], "isController": false}, {"data": ["Polls-3", 4646, 3292, 70.85665088247956, 38922.40206629365, 2, 476537, 4082.0, 101290.20000000008, 358777.6, 455492.99, 8.502368072381762, 151.92802163416667, 1.2607156018728634], "isController": false}, {"data": ["Polls-6", 4646, 3393, 73.03056392595781, 28983.079207920844, 2, 476353, 4082.0, 40052.60000000033, 249513.99999999997, 448429.64999999997, 8.501994656516487, 213.02370277273266, 1.1688619992771656], "isController": false}, {"data": ["Save Poll-4", 1126, 71, 6.30550621669627, 39985.34547069263, 32, 484333, 38989.5, 60725.8, 61802.7, 130366.64000000097, 1.7109731729739175, 49.78617732210285, 1.0166426591311417], "isController": false}, {"data": ["Polls-5", 4646, 3390, 72.96599225139906, 29465.61020232465, 2, 476454, 4082.0, 41495.5, 251952.65, 449938.81, 8.502383632087989, 66.87967018606972, 1.1896714613815003], "isController": false}, {"data": ["Save Poll-3", 1126, 66, 5.86145648312611, 40712.681172291326, 48, 484739, 39359.0, 60704.3, 61785.14999999999, 218005.700000001, 1.710874384442287, 218.87108969621724, 1.0131192518191334], "isController": false}, {"data": ["Polls-8", 4646, 3629, 78.11020232458029, 14114.59728798966, 0, 469246, 4080.0, 16890.10000000001, 65225.299999999435, 250869.1199999997, 8.495403047081282, 125.36691539019243, 0.9534218094010796], "isController": false}, {"data": ["Save Poll-6", 941, 72, 7.651434643995749, 41393.6992561105, 2, 482953, 41532.0, 60769.4, 61851.0, 157407.34000000186, 1.4298195631528965, 16.321094491927827, 0.8257048314339981], "isController": false}, {"data": ["Polls-7", 4646, 3639, 78.32544123977615, 13904.853852776563, 0, 476335, 4081.0, 16334.5, 61798.85, 252479.12, 8.495403047081282, 32.30966648948863, 0.9422487789915228], "isController": false}, {"data": ["Save Poll-5", 941, 71, 7.545164718384697, 41687.29436769394, 61, 484328, 41781.0, 60734.4, 61785.9, 172155.0800000005, 1.4297891478851732, 107.48996471964888, 0.824863744588909], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, 0.005054206363245811, 0.002731382215970392], "isController": false}, {"data": ["500", 303, 0.7657122640317404, 0.4138044057195144], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 144, 0.36390285815369844, 0.1966595195498682], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 19, 0.048014960450835205, 0.025948131051718722], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1107, 2.7975032220565565, 1.5118200565396118], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 220, 0.5559626999570393, 0.3004520437567431], "isController": false}, {"data": ["Test failed: text expected to contain /Add a new Survey/", 185, 0.4675140886002375, 0.25265285497726125], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 33515, 84.69586313209169, 45.77113748412384], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 270, 0.6823178590381845, 0.3687365991560029], "isController": false}, {"data": ["Assertion failed", 3806, 9.618154709256778, 5.197820356991656], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 73223, 39571, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 33515, "Assertion failed", 3806, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1107, "500", 303, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 270], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Save Poll", 7000, 6140, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 5520, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 318, "Test failed: text expected to contain /Add a new Survey/", 185, "Assertion failed", 81, "500", 31], "isController": false}, {"data": ["Polls", 7000, 6079, "Assertion failed", 3725, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1870, "500", 248, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 236, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-2", 1130, 71, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 71, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-1", 1361, 231, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 223, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 5, "500", 2, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-2", 4646, 135, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 135, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show New Poll Form", 7000, 5672, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 5272, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 374, "500", 17, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 9, null, null], "isController": false}, {"data": ["Save Poll-8", 55, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-1", 4646, 181, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 135, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 46, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-7", 941, 69, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 65, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-4", 4646, 3365, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3350, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 15, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-3", 4646, 3292, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3283, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 9, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-6", 4646, 3393, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3367, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 26, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-4", 1126, 71, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 69, "500", 1, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1, null, null, null, null], "isController": false}, {"data": ["Polls-5", 4646, 3390, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3373, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 17, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-3", 1126, 66, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 64, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-8", 4646, 3629, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3413, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 125, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 63, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 27, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1], "isController": false}, {"data": ["Save Poll-6", 941, 72, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 67, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3, "500", 2, null, null, null, null], "isController": false}, {"data": ["Polls-7", 4646, 3639, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3441, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 95, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 76, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 26, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1], "isController": false}, {"data": ["Save Poll-5", 941, 71, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 67, "500", 2, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
