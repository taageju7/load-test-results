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

    var data = {"OkPercent": 76.60178344974737, "KoPercent": 23.398216550252624};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.02898609070230882, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.016166666666666666, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.026333333333333334, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.011192724728926198, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-2"], "isController": false}, {"data": [5.246589716684155E-4, 500, 1500, "Login-1"], "isController": false}, {"data": [2.1579628830384117E-4, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.321003717472119, 500, 1500, "Login-2"], "isController": false}, {"data": [0.1335779024600777, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.014833333333333334, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.0195, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [8.333333333333334E-4, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 49679, 11624, 23.398216550252624, 35980.75750317001, 2, 163851, 33997.5, 70954.50000000003, 122579.25000000003, 142624.57000000007, 153.75544716252352, 9830.087168140908, 125.53471802035878], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 388, 12.933333333333334, 35412.015000000014, 60, 75665, 42388.0, 57559.6, 58817.85, 62605.81999999999, 18.166294257634384, 1886.3798587267852, 9.530231930592645], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 27066.239000000038, 36, 54938, 29370.0, 45076.8, 45963.5, 48554.88, 26.12330198537095, 67.17056067136886, 13.036139955590386], "isController": false}, {"data": ["Login", 3000, 2508, 83.6, 96381.81033333366, 4314, 163851, 98689.0, 139343.5, 147611.35, 155498.06999999998, 10.355540214014496, 1842.352200956809, 30.2888224887815], "isController": false}, {"data": ["Login-0", 2859, 0, 0.0, 28772.33613151453, 325, 65503, 37289.0, 55050.0, 57680.0, 61005.600000000006, 12.91672125814919, 4.791161460145205, 9.46048920274599], "isController": false}, {"data": ["Logout-2", 2211, 364, 16.463138851198554, 20210.043419267306, 2, 70133, 15763.0, 37332.2, 50810.6, 56545.76000000001, 7.8558865853008575, 783.2791035715237, 3.9541993939757325], "isController": false}, {"data": ["Login-1", 2859, 169, 5.911157747464149, 41276.26722630302, 370, 67739, 44535.0, 55688.0, 57413.0, 60783.8, 11.173730204636765, 36.72022399611323, 6.450599344681633], "isController": false}, {"data": ["Logout-1", 2317, 106, 4.574881312041433, 31620.46050927924, 3, 61132, 34143.0, 51552.8, 54032.899999999994, 57121.26000000001, 7.869709938183547, 21.04509767084437, 3.7988420559914404], "isController": false}, {"data": ["Login-2", 2690, 639, 23.7546468401487, 18448.5182156134, 2, 59859, 250.0, 52688.8, 54486.25, 57052.96000000001, 9.46213562863404, 503.4921922541516, 4.452565219264767], "isController": false}, {"data": ["Logout-0", 2317, 0, 0.0, 19178.86275356069, 29, 63050, 4396.0, 52130.0, 54839.7, 58538.08000000001, 8.108202687569989, 3.5790113425601904, 4.576700345132279], "isController": false}, {"data": ["Login-3", 2690, 936, 34.795539033457246, 27863.13754646841, 2, 71005, 35037.5, 54153.6, 55859.2, 58840.07000000002, 9.538026231345004, 468.6657472502828, 3.940003731885728], "isController": false}, {"data": ["Login-4", 2690, 933, 34.68401486988848, 27865.362453531543, 2, 73110, 35069.0, 54262.8, 55544.6, 58122.130000000005, 9.615212767858738, 501.9022661876933, 4.023675562525692], "isController": false}, {"data": ["Login-5", 906, 286, 31.567328918322296, 28575.538631346575, 3411, 71354, 32691.5, 54605.40000000001, 56735.4, 60600.66999999999, 3.664307381193124, 56.822548028311424, 1.5794836956521738], "isController": false}, {"data": ["Login-6", 906, 284, 31.346578366445915, 28575.082781456942, 2787, 70060, 33211.5, 54308.8, 56177.149999999994, 59743.189999999995, 3.6460806645042374, 216.35039769594667, 1.5571409832948335], "isController": false}, {"data": ["Logout-4", 2211, 386, 17.458163726820445, 19898.729534147446, 3, 69402, 15624.0, 37267.2, 51280.60000000002, 56964.08000000001, 7.855635379138332, 241.36224788842048, 3.8943107432742115], "isController": false}, {"data": ["Login-7", 906, 284, 31.346578366445915, 28760.243929359793, 4305, 75061, 33353.0, 54582.8, 56575.7, 63097.73999999995, 3.672923338873799, 21.458815801475655, 1.573529728483399], "isController": false}, {"data": ["Logout-3", 2211, 383, 17.32247851650837, 19910.452736318402, 3, 61895, 15678.0, 36982.0, 51038.8, 56607.56000000002, 7.855998237641281, 556.6609549437094, 3.850149209781091], "isController": false}, {"data": ["Login-8", 906, 327, 36.09271523178808, 27997.789183222965, 683, 95975, 30717.5, 53673.5, 56513.5, 69721.98999999986, 3.7187538480482702, 139.76705759630383, 1.485346632188154], "isController": false}, {"data": ["Logout", 3000, 1246, 41.53333333333333, 55991.11466666663, 2, 158224, 51899.5, 119550.3, 128937.79999999999, 147988.78999999995, 9.881357830317324, 1495.466071482978, 18.836640723298927], "isController": false}, {"data": ["Login Welcome-3", 3000, 739, 24.633333333333333, 29667.18499999997, 53, 76074, 29423.0, 56861.9, 58853.049999999996, 67774.92, 17.785049887064933, 504.0926919747926, 8.05025346475003], "isController": false}, {"data": ["Login Welcome-2", 3000, 709, 23.633333333333333, 30111.845333333324, 45, 79664, 31233.0, 56629.200000000004, 58556.399999999994, 67533.49999999993, 18.15519056898367, 1192.944116384984, 8.218515542734293], "isController": false}, {"data": ["Login Welcome", 3000, 937, 31.233333333333334, 70062.16900000018, 1046, 116391, 81991.0, 99950.7, 101796.4, 110046.09999999998, 17.608217168011738, 3529.7893147010273, 33.965494314013206], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, 0.008602890571231933, 0.0020129229654381126], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 38, 0.3269098417068135, 0.07649107268664829], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3331, 28.65622849277357, 6.705046397874353], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 9, 0.0774260151410874, 0.018116306688943012], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1784, 15.34755677907777, 3.591054570341593], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4653, 40.02924982794219, 9.366130558183539], "isController": false}, {"data": ["Assertion failed", 1808, 15.554026152787337, 3.639364721512108], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 49679, 11624, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4653, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3331, "Assertion failed", 1808, "Test failed: text expected to contain /The electronic survey app/", 1784, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 38], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 388, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 388, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2508, "Test failed: text expected to contain /The electronic survey app/", 1784, "Assertion failed", 414, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 310, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2211, 364, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 301, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 63, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 2859, 169, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 169, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2317, 106, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 55, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 51, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2690, 639, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 601, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 38, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2690, 936, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 630, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 305, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-4", 2690, 933, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 627, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 305, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-5", 906, 286, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 285, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 906, 284, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 283, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2211, 386, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 322, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 63, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-7", 906, 284, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 283, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2211, 383, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 315, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 68, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 906, 327, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 285, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 32, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 9, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, null, null], "isController": false}, {"data": ["Logout", 3000, 1246, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 480, "Assertion failed", 457, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 309, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 3000, 739, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 739, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 709, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 709, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 937, "Assertion failed", 937, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
