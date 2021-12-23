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

    var data = {"OkPercent": 52.64329033290188, "KoPercent": 47.35670966709812};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.034679096554632846, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.01278772378516624, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.023804839661617155, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0028544243577545195, 500, 1500, "Login-0"], "isController": false}, {"data": [7.792207792207792E-4, 500, 1500, "Logout-2"], "isController": false}, {"data": [2.378686964795433E-4, 500, 1500, "Login-1"], "isController": false}, {"data": [5.078720162519045E-4, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9743523316062176, 500, 1500, "Login-2"], "isController": false}, {"data": [0.07719654647028949, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.001038961038961039, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [5.194805194805195E-4, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.01249262246704702, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.012000786936848317, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.004214285714285715, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 68759, 32562, 47.35670966709812, 33194.95453686072, 0, 209681, 34046.0, 69913.70000000001, 143624.45, 153175.4400000001, 191.2330763497202, 7842.499765552863, 105.6000480019107], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 5083, 2766, 54.41668306118434, 27406.3903206768, 45, 108600, 4719.0, 79998.6, 85972.40000000001, 89249.64, 22.001566902856354, 1226.2767159033606, 6.0428907531630225], "isController": false}, {"data": ["Login Welcome-0", 5083, 0, 0.0, 53325.65571512901, 27, 110183, 59462.0, 85110.6, 87183.8, 103398.23999999999, 31.88913147130417, 81.99617496478896, 15.913424005699643], "isController": false}, {"data": ["Login", 7000, 6233, 89.04285714285714, 40124.19957142848, 4017, 209681, 4811.0, 146878.7, 151854.4, 179752.74, 21.07887715832646, 1346.5625862210768, 23.19211987350415], "isController": false}, {"data": ["Login-0", 2102, 0, 0.0, 38321.78496669842, 887, 97409, 43096.0, 75274.90000000001, 80504.79999999999, 89873.58999999995, 7.968610800462498, 3.416230606838903, 5.836384863619993], "isController": false}, {"data": ["Logout-2", 1925, 245, 12.727272727272727, 21140.942337662298, 2, 64626, 18715.0, 46904.4, 49547.899999999994, 52155.5, 7.495697275070674, 779.8738786570727, 3.941629447771539], "isController": false}, {"data": ["Login-1", 2102, 172, 8.182683158896289, 49475.72835394869, 3, 94114, 50335.0, 80334.1, 85695.45, 89858.12999999999, 6.847240093164161, 31.422602336026188, 3.8126926498851734], "isController": false}, {"data": ["Logout-1", 1969, 44, 2.2346368715083798, 35744.09141696296, 3, 88319, 34507.0, 60790.0, 66170.0, 77014.69999999998, 6.018848257162857, 16.035955138717792, 2.9766530339549853], "isController": false}, {"data": ["Login-2", 1930, 22, 1.1398963730569949, 149.63056994818623, 3, 3041, 110.0, 209.9000000000001, 289.89999999999964, 1040.0700000000002, 6.363168792118902, 37.75629115041476, 3.618343915261055], "isController": false}, {"data": ["Logout-0", 1969, 0, 0.0, 25645.403758252894, 30, 90115, 21190.0, 54560.0, 63849.5, 85605.4, 5.975466899737189, 2.6324190939155847, 3.369545755263813], "isController": false}, {"data": ["Login-3", 1930, 787, 40.77720207253886, 28340.931088082893, 2, 109440, 34791.0, 52513.80000000001, 74969.14999999998, 87449.95, 5.970555571023316, 198.5955140497536, 2.196144061308016], "isController": false}, {"data": ["Login-4", 1930, 845, 43.78238341968912, 26771.767357512894, 2, 108709, 32033.0, 52069.200000000004, 70205.44999999985, 87441.65000000001, 5.963618835147654, 518.6245827108355, 2.101925787321284], "isController": false}, {"data": ["Login-5", 1930, 884, 45.803108808290155, 25770.07772020723, 2, 91017, 30283.0, 51846.70000000001, 66229.19999999998, 87393.30000000002, 5.90246557914503, 75.56257994514988, 2.014965416674312], "isController": false}, {"data": ["Login-6", 1930, 882, 45.69948186528497, 25709.34922279795, 2, 101741, 30366.5, 51408.80000000001, 65529.34999999996, 87544.46, 5.96898601463484, 283.2686584452647, 2.0162482835299285], "isController": false}, {"data": ["Logout-4", 1925, 260, 13.506493506493506, 20756.298701298685, 2, 64587, 18588.0, 46307.0, 49740.7, 51826.06, 7.4957556500475055, 240.35670199041516, 3.8938039730912104], "isController": false}, {"data": ["Login-7", 1930, 905, 46.89119170984456, 25026.703108808306, 2, 100745, 29177.5, 51092.4, 62803.849999999926, 86081.52, 5.966771574671209, 30.389148765063776, 1.9774561873179823], "isController": false}, {"data": ["Logout-3", 1925, 250, 12.987012987012987, 21039.084675324688, 2, 66984, 18676.0, 46452.200000000004, 49713.4, 52250.36, 7.495580527844622, 557.9037094119182, 3.8661445374253365], "isController": false}, {"data": ["Login-8", 1930, 1044, 54.09326424870466, 22377.92279792748, 0, 107907, 5313.5, 50549.600000000006, 60460.0, 85770.19, 5.989027357132218, 166.00324584239706, 1.7183543518196716], "isController": false}, {"data": ["Logout", 7000, 5396, 77.08571428571429, 26960.58414285713, 2, 187914, 4732.0, 96975.20000000003, 141261.65, 151859.2099999999, 20.710549362115078, 1258.1065447277597, 15.057245483990744], "isController": false}, {"data": ["Login Welcome-3", 5083, 3249, 63.91894550462325, 20285.165256738117, 41, 110800, 4628.0, 72896.40000000002, 80987.20000000001, 88593.76, 22.482694561779862, 338.8002619659088, 4.8719490871796], "isController": false}, {"data": ["Login Welcome-2", 5083, 3127, 61.51878811725359, 22100.79638009046, 41, 108878, 4635.0, 75604.20000000001, 83593.20000000003, 88478.48, 21.83006648227998, 753.9694838939913, 4.979577930932298], "isController": false}, {"data": ["Login Welcome", 7000, 5451, 77.87142857142857, 66138.33242857143, 174, 183809, 78346.0, 129277.9, 131227.0, 143272.35999999996, 30.036859517608036, 2376.4256655108734, 26.57643562779182], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, 0.006142128861863522, 0.0029087101324917464], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 74, 0.2272587678889503, 0.10762227490219463], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3960, 12.161415146489773, 5.759246062333658], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 27, 0.08291873963515754, 0.03926758678863858], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 23481, 72.11166390270868, 34.14971131051935], "isController": false}, {"data": ["Assertion failed", 5018, 15.410601314415576, 7.297953722421792], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 68759, 32562, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 23481, "Assertion failed", 5018, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3960, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 74, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 27], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 5083, 2766, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2766, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 7000, 6233, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 5064, "Assertion failed", 1163, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 1925, 245, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 231, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 14, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 2102, 172, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 166, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 1969, 44, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 23, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 21, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 1930, 22, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 22, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 1930, 787, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 433, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 354, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 1930, 845, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 487, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 358, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 1930, 884, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 508, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 376, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 1930, 882, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 504, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 378, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 1925, 260, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 243, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 16, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-7", 1930, 905, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 509, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 396, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 1925, 250, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 235, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-8", 1930, 1044, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 560, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 383, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 72, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 27, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2], "isController": false}, {"data": ["Logout", 7000, 5396, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4880, "Assertion failed", 321, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 195, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 5083, 3249, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3249, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 5083, 3127, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3127, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 7000, 5451, "Assertion failed", 3534, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1917, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
