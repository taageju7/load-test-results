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

    var data = {"OkPercent": 76.3221412870135, "KoPercent": 23.67785871298651};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.028371621912848585, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0175, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.027833333333333335, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0051140833988985055, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-2"], "isController": false}, {"data": [1.966955153422502E-4, 500, 1500, "Login-1"], "isController": false}, {"data": [5.022601707684581E-4, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.3520671834625323, 500, 1500, "Login-2"], "isController": false}, {"data": [0.12255148166750376, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.01633333333333333, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.017, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0015, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 46402, 10987, 23.67785871298651, 35418.972436533164, 2, 169925, 33168.5, 75962.9, 112149.55, 126773.4300000001, 147.8439294203111, 9484.591499803453, 119.03619754992704], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 408, 13.6, 37476.92233333337, 43, 73998, 46544.5, 60215.0, 61627.299999999996, 64253.91999999993, 17.724630146050952, 1826.8154544742874, 9.227331675095712], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 31589.174666666706, 42, 64381, 28427.5, 56240.3, 58698.95, 59995.92, 25.069987047173356, 64.46218349141353, 12.510511114360924], "isController": false}, {"data": ["Login", 3000, 2568, 85.6, 78720.77933333343, 4329, 169925, 83412.0, 123575.6, 129495.65, 138536.3699999999, 10.717347813661046, 1620.9487134437964, 27.230548013718202], "isController": false}, {"data": ["Login-0", 2542, 0, 0.0, 28839.755704169944, 746, 70129, 34319.0, 51245.90000000001, 57200.54999999999, 62999.01000000003, 11.704576848696933, 4.386914080486233, 8.572688121604198], "isController": false}, {"data": ["Logout-2", 1930, 150, 7.772020725388601, 22082.84922279795, 3, 72343, 16994.5, 37768.7, 40217.35, 59446.8, 7.263804050417575, 797.6401560753441, 4.036565655567724], "isController": false}, {"data": ["Login-1", 2542, 220, 8.654602675059008, 36726.436270652885, 773, 71662, 37056.0, 58245.7, 60605.95, 63213.28, 10.19229843947972, 34.45240014695033, 5.70758735700911], "isController": false}, {"data": ["Logout-1", 1991, 61, 3.0637870416875943, 30089.190858864862, 5, 62315, 31407.0, 45157.2, 46661.799999999996, 58955.47999999999, 7.016740088105728, 18.745873485682818, 3.4407351321585904], "isController": false}, {"data": ["Login-2", 2322, 518, 22.3083548664944, 14090.180017226527, 2, 47914, 200.0, 38484.8, 39827.95, 44644.93, 8.560210871689002, 422.86779923987575, 4.077362197240604], "isController": false}, {"data": ["Logout-0", 1991, 0, 0.0, 18145.41687594176, 20, 64191, 4688.0, 44041.0, 48776.399999999994, 59392.47999999998, 7.260673116546385, 3.2049064928505526, 4.098309630238096], "isController": false}, {"data": ["Login-3", 2322, 858, 36.950904392764855, 24178.89836347975, 3, 64899, 30753.5, 44788.9, 56675.049999999996, 61209.54, 8.593284507292449, 405.8585849634637, 3.430348759858037], "isController": false}, {"data": ["Login-4", 2322, 852, 36.69250645994832, 24316.64900947457, 2, 74002, 30757.5, 45001.0, 56914.2, 61420.35, 8.589851249819658, 450.1827080343039, 3.4813107962259404], "isController": false}, {"data": ["Login-5", 895, 330, 36.87150837988827, 26930.608938547473, 4258, 65699, 26619.0, 58385.4, 60000.799999999996, 62145.52, 3.9456688018833406, 57.32402630565267, 1.5689380598881988], "isController": false}, {"data": ["Login-6", 895, 332, 37.09497206703911, 26971.318435754234, 1932, 66885, 26168.0, 58644.8, 60095.799999999996, 63090.119999999995, 3.95078949575566, 215.75481805952228, 1.545997280521504], "isController": false}, {"data": ["Logout-4", 1930, 162, 8.393782383419689, 21832.03316062177, 4, 74246, 16795.0, 37713.700000000004, 40171.34999999999, 58875.18000000001, 7.263257326293368, 245.6056984463968, 3.9960557784292545], "isController": false}, {"data": ["Login-7", 895, 349, 38.99441340782123, 26245.060335195536, 4256, 64361, 23374.0, 57994.399999999994, 59991.0, 62387.52, 3.8973367473132323, 21.483562771343905, 1.4836738468020065], "isController": false}, {"data": ["Logout-3", 1930, 161, 8.341968911917098, 21847.523316062176, 3, 75415, 16841.5, 37824.8, 39951.35, 58649.93000000001, 7.263202658407439, 568.5163060722538, 3.9462756740571945], "isController": false}, {"data": ["Login-8", 895, 389, 43.46368715083799, 25898.889385474875, 271, 106785, 22331.0, 57636.2, 60040.6, 64167.27999999998, 3.977265152491457, 133.53317534212258, 1.4053744184082941], "isController": false}, {"data": ["Logout", 3000, 1256, 41.86666666666667, 48110.76733333325, 2, 151049, 42869.5, 111984.8, 116259.4, 129052.29999999986, 10.369320636676287, 1510.928268199238, 18.26074156304547], "isController": false}, {"data": ["Login Welcome-3", 3000, 748, 24.933333333333334, 32871.27533333333, 80, 74929, 31831.0, 60317.7, 61739.95, 65456.68999999997, 17.744759381062792, 501.15197684013157, 8.000044546739696], "isController": false}, {"data": ["Login Welcome-2", 3000, 700, 23.333333333333332, 33633.25900000009, 69, 75814, 33958.0, 60547.9, 61970.8, 69281.72999999997, 17.639276789651625, 1163.3981561443481, 8.016339298838748], "isController": false}, {"data": ["Login Welcome", 3000, 925, 30.833333333333332, 75481.23299999998, 526, 122514, 88364.5, 105511.3, 107287.74999999999, 118073.72, 17.471114424152066, 3491.3404011877446, 33.63043934029072], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 49, 0.4459816146354783, 0.10559889659928451], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2233, 20.324019295531084, 4.812292573595966], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 20, 0.1820333120961136, 0.043101590448687555], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1427, 12.988076818057705, 3.075298478513857], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 5684, 51.733867297715484, 12.249472005517003], "isController": false}, {"data": ["Assertion failed", 1574, 14.32602166196414, 3.3920951683117107], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 46402, 10987, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 5684, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2233, "Assertion failed", 1574, "Test failed: text expected to contain /The electronic survey app/", 1427, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 49], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 408, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 408, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2568, "Test failed: text expected to contain /The electronic survey app/", 1427, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 678, "Assertion failed", 463, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 1930, 150, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 93, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 57, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 2542, 220, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 220, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 1991, 61, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 56, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2322, 518, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 513, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 5, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2322, 858, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 520, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 338, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 2322, 852, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 516, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 336, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 895, 330, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 330, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 895, 332, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 332, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 1930, 162, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 104, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 58, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 895, 349, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 349, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 1930, 161, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 101, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 60, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 895, 389, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 320, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 49, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 20, null, null, null, null], "isController": false}, {"data": ["Logout", 3000, 1256, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 689, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 381, "Assertion failed", 186, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 3000, 748, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 748, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 700, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 700, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 925, "Assertion failed", 925, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
