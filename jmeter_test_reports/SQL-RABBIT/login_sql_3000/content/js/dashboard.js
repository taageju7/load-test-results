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

    var data = {"OkPercent": 78.38821240723395, "KoPercent": 21.61178759276605};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04931911521002954, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0175, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.027166666666666665, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.003816793893129771, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-2"], "isController": false}, {"data": [5.725190839694657E-4, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9676616915422885, 500, 1500, "Login-2"], "isController": false}, {"data": [0.07055335968379446, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.012333333333333333, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.014166666666666666, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [1.6666666666666666E-4, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 55516, 11998, 21.61178759276605, 41371.795824627145, 0, 217957, 34688.5, 78822.30000000002, 161444.75000000003, 169997.88, 139.50776746360023, 8902.45960486233, 115.10043882808299], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 373, 12.433333333333334, 39434.239666666675, 54, 78352, 51038.0, 61214.9, 62125.85, 67617.11999999997, 16.87270109447588, 1761.8364304992351, 8.90243145289423], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 30651.264333333318, 55, 56890, 34072.5, 50140.4, 51301.0, 53001.48999999999, 25.757927002034876, 66.2310759730057, 12.853809275429514], "isController": false}, {"data": ["Login", 3000, 1934, 64.46666666666667, 116341.64966666678, 4294, 217957, 136274.5, 174652.80000000002, 182025.55, 191738.8399999999, 8.411702360323682, 1769.2309724883007, 29.557114779956876], "isController": false}, {"data": ["Login-0", 2620, 0, 0.0, 42512.42404580153, 874, 97111, 53871.5, 78703.50000000001, 83079.15, 87069.91, 10.032970946507417, 4.301244380387456, 7.348367392461486], "isController": false}, {"data": ["Logout-2", 2444, 236, 9.656301145662848, 24922.57815057283, 2, 86413, 21301.0, 43081.5, 49027.0, 79182.90000000002, 6.986250464511334, 751.8459077444759, 3.8030078895463513], "isController": false}, {"data": ["Login-1", 2620, 208, 7.938931297709924, 49677.68206106868, 227, 90329, 54289.5, 77009.6, 79814.85, 83511.29, 8.743709201585883, 40.16434137259548, 4.881613160116672], "isController": false}, {"data": ["Logout-1", 2530, 86, 3.399209486166008, 38620.600000000035, 3, 83989, 38922.0, 69459.7, 76988.35, 80370.01000000001, 6.888346170705742, 18.394116649581935, 3.366087861808341], "isController": false}, {"data": ["Login-2", 2412, 12, 0.4975124378109453, 203.8424543946927, 3, 5635, 129.0, 298.0, 414.09999999999945, 1826.659999999998, 8.145566542389366, 48.50610988726394, 4.661981783919598], "isController": false}, {"data": ["Logout-0", 2530, 0, 0.0, 32730.4988142293, 31, 88558, 33946.0, 70576.6, 78116.54999999999, 82496.67, 7.095221802803314, 3.1318752488936505, 4.004920119160465], "isController": false}, {"data": ["Login-3", 2412, 701, 29.06301824212272, 33967.02902155891, 2, 85874, 40631.0, 61613.70000000001, 76413.75, 80554.09999999999, 7.121661721068249, 279.88165625876553, 3.1376984698170864], "isController": false}, {"data": ["Login-4", 2412, 805, 33.37479270315091, 32306.033167495858, 2, 85409, 40123.5, 62049.700000000026, 76117.44999999998, 81058.92999999998, 7.013177329875205, 719.2360323883329, 2.929466021199451], "isController": false}, {"data": ["Login-5", 2412, 857, 35.530679933665006, 31235.393449419546, 2, 103060, 39761.0, 61542.3, 76055.54999999999, 80671.35999999999, 7.125574964770944, 104.78664287966876, 2.8935617932032294], "isController": false}, {"data": ["Login-6", 2412, 863, 35.77943615257048, 31295.713101160836, 3, 87178, 39890.0, 61599.200000000004, 76214.04999999999, 81206.31999999999, 7.053745328209717, 392.3350396288814, 2.817950536232329], "isController": false}, {"data": ["Logout-4", 2444, 316, 12.92962356792144, 23514.151800327305, 0, 85317, 20728.0, 42751.5, 47373.5, 78678.35000000006, 6.985052445054159, 225.39102132991798, 3.6527104947269144], "isController": false}, {"data": ["Login-7", 2412, 883, 36.608623548922054, 30802.298092869016, 2, 103881, 39648.0, 61436.00000000003, 75927.09999999999, 80860.63999999998, 6.937234137404404, 38.44865333135359, 2.7442105903192218], "isController": false}, {"data": ["Logout-3", 2444, 293, 11.988543371522095, 23933.14034369893, 0, 85835, 20965.0, 43086.0, 48356.25, 78928.40000000001, 6.986030796847711, 525.7723525428337, 3.644671905415603], "isController": false}, {"data": ["Login-8", 2412, 1113, 46.14427860696517, 27966.79684908789, 0, 84270, 33566.5, 61918.00000000003, 76279.79999999999, 81007.14, 6.981166479981244, 223.6443446663324, 2.3498484809016476], "isController": false}, {"data": ["Logout", 3000, 950, 31.666666666666668, 83120.38466666672, 2, 198984, 69995.5, 164154.9, 168533.1, 185321.1499999999, 8.036582523647645, 1433.0585559843407, 17.540900868252283], "isController": false}, {"data": ["Login Welcome-3", 3000, 762, 25.4, 32894.96133333324, 51, 83502, 34485.5, 61228.9, 62463.85, 70720.74999999997, 16.443491939948366, 461.8084055705069, 7.367294596805577], "isController": false}, {"data": ["Login Welcome-2", 3000, 658, 21.933333333333334, 34617.792333333346, 62, 77165, 40196.0, 61141.7, 62178.399999999994, 70328.11999999998, 16.79571373385512, 1127.1069763621324, 7.772358681564465], "isController": false}, {"data": ["Login Welcome", 3000, 948, 31.6, 77923.01333333322, 1113, 128083, 94436.0, 107903.6, 112631.94999999997, 119371.36999999998, 16.295934164425976, 3294.745028042587, 31.572433517681088], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 7, 0.058343057176196034, 0.012608977592045536], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 143, 1.1918653108851476, 0.2575833993803588], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 0.00833472245374229, 0.0018012825131493624], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4244, 35.37256209368228, 7.644642985805894], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 8, 0.06667777962993832, 0.014410260105194899], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4907, 40.89848308051342, 8.83889329202392], "isController": false}, {"data": ["Assertion failed", 2688, 22.403733955659277, 4.841847395345486], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 55516, 11998, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4907, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4244, "Assertion failed", 2688, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 143, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 8], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 373, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 373, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 1934, "Assertion failed", 1346, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 588, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2444, 236, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 178, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 58, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 2620, 208, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 208, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2530, 86, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 52, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 34, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2412, 12, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 11, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2412, 701, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 422, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 275, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, null, null, null, null], "isController": false}, {"data": ["Login-4", 2412, 805, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 530, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 270, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, null, null, null, null], "isController": false}, {"data": ["Login-5", 2412, 857, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 567, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 286, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, null, null, null, null], "isController": false}, {"data": ["Login-6", 2412, 863, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 579, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 279, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2444, 316, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 247, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 67, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["Login-7", 2412, 883, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 591, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 288, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2444, 293, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 229, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 63, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null], "isController": false}, {"data": ["Login-8", 2412, 1113, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 702, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 278, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 120, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 8, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 5], "isController": false}, {"data": ["Logout", 3000, 950, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 402, "Assertion failed", 394, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 154, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 3000, 762, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 762, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 658, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 658, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 948, "Assertion failed", 948, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
