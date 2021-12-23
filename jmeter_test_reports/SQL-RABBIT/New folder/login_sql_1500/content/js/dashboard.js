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

    var data = {"OkPercent": 99.55238095238096, "KoPercent": 0.44761904761904764};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.13553968253968254, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.19366666666666665, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.17866666666666667, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.09966666666666667, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.06333333333333334, 500, 1500, "Login-1"], "isController": false}, {"data": [0.08433333333333333, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.7966666666666666, 500, 1500, "Login-2"], "isController": false}, {"data": [0.43733333333333335, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.05433333333333333, 500, 1500, "Login-3"], "isController": false}, {"data": [0.05266666666666667, 500, 1500, "Login-4"], "isController": false}, {"data": [0.051666666666666666, 500, 1500, "Login-5"], "isController": false}, {"data": [0.044, 500, 1500, "Login-6"], "isController": false}, {"data": [0.099, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.04533333333333334, 500, 1500, "Login-7"], "isController": false}, {"data": [0.099, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.050333333333333334, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.192, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.19333333333333333, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.111, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 31500, 141, 0.44761904761904764, 6076.601206349176, 0, 38227, 6700.5, 15433.900000000001, 21264.700000000004, 29196.980000000003, 328.9336285034042, 27359.317750700942, 340.6678380576208], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 1500, 0, 0.0, 5062.804666666668, 9, 13084, 4600.5, 9506.7, 10309.95, 12239.82, 20.326855841938368, 2415.5808208492563, 12.307275998048622], "isController": false}, {"data": ["Login Welcome-0", 1500, 0, 0.0, 4297.217333333336, 7, 13017, 3546.0, 8754.9, 8927.9, 13004.0, 23.68957185047142, 60.91273699442505, 11.891054620256163], "isController": false}, {"data": ["Login", 1500, 70, 4.666666666666667, 20407.82133333336, 6436, 38227, 21480.5, 29696.2, 31739.800000000003, 35453.17, 16.48768370027589, 6370.287152333144, 93.76663796206734], "isController": false}, {"data": ["Login-0", 1500, 0, 0.0, 7448.6693333333305, 3177, 19263, 5867.0, 16246.100000000148, 18190.7, 18745.760000000002, 17.753160062491123, 7.6109738939781275, 13.540251961724186], "isController": false}, {"data": ["Logout-2", 1500, 0, 0.0, 3680.1433333333393, 450, 15593, 2701.5, 8671.2, 10062.95, 14753.54, 19.611688566385567, 2330.5925487840755, 11.87426456167876], "isController": false}, {"data": ["Login-1", 1500, 0, 0.0, 6067.902666666671, 270, 15513, 5408.5, 11002.7, 12230.150000000001, 14845.86, 18.02169812454195, 84.88149419400958, 10.98197229464275], "isController": false}, {"data": ["Logout-1", 1500, 0, 0.0, 4199.518000000009, 791, 15817, 3504.5, 8938.9, 10957.100000000006, 14829.2, 19.402154932674524, 51.49907920606382, 9.87160421867522], "isController": false}, {"data": ["Login-2", 1500, 0, 0.0, 935.0919999999995, 77, 9587, 111.0, 3594.1000000000035, 5750.050000000001, 8431.98, 18.100857980668284, 109.73645150780148, 10.464558520073851], "isController": false}, {"data": ["Logout-0", 1500, 0, 0.0, 2764.2193333333307, 31, 15725, 1213.5, 8303.500000000011, 11350.9, 13506.99, 19.55441995072286, 8.631443181373763, 11.094841788447248], "isController": false}, {"data": ["Login-3", 1500, 0, 0.0, 5726.699333333328, 528, 15761, 3967.5, 12113.000000000004, 12872.95, 15272.89, 17.63150161622098, 957.3182210549514, 11.002470246841023], "isController": false}, {"data": ["Login-4", 1500, 0, 0.0, 5735.010666666668, 456, 15738, 3973.0, 12118.5, 12870.850000000002, 15317.82, 17.645398080180687, 2692.422376791008, 11.114532970426314], "isController": false}, {"data": ["Login-5", 1500, 1, 0.06666666666666667, 5732.797333333337, 1, 15608, 3977.0, 12107.600000000002, 12973.850000000002, 15338.99, 17.639173075566216, 376.0754727849609, 11.154847685740492], "isController": false}, {"data": ["Login-6", 1500, 0, 0.0, 5825.31466666667, 661, 15731, 3969.5, 12452.600000000002, 13466.400000000001, 15317.85, 17.646851213515134, 1502.0503435253702, 11.029282008446959], "isController": false}, {"data": ["Logout-4", 1500, 0, 0.0, 3688.0739999999983, 463, 15631, 2835.5, 8664.1, 9966.400000000001, 14754.900000000001, 19.61297071129707, 719.148643844796, 11.836734276935147], "isController": false}, {"data": ["Login-7", 1500, 0, 0.0, 5852.26200000001, 454, 15742, 3976.0, 12477.600000000002, 13653.65, 15385.560000000001, 17.634196233335686, 126.90077347993228, 11.055814435353037], "isController": false}, {"data": ["Logout-3", 1500, 0, 0.0, 3693.8199999999983, 388, 15590, 2844.5, 8715.8, 10155.700000000003, 14778.0, 19.610406589096616, 1669.87208295202, 11.681980487645445], "isController": false}, {"data": ["Login-8", 1500, 70, 4.666666666666667, 5981.004666666668, 0, 19514, 3966.0, 13523.9, 14921.85, 15454.720000000001, 17.774617845716318, 971.390525943536, 10.640353751925584], "isController": false}, {"data": ["Logout", 1500, 0, 0.0, 10746.130000000017, 2882, 33657, 7081.5, 23881.9, 24825.95, 31821.380000000005, 19.074262461851475, 4649.388729495168, 54.9502678344354], "isController": false}, {"data": ["Login Welcome-3", 1500, 0, 0.0, 5131.021333333333, 8, 13027, 4682.0, 9577.9, 11225.85, 13003.430000000004, 20.281507321624144, 743.6618705127165, 12.24020656715207], "isController": false}, {"data": ["Login Welcome-2", 1500, 0, 0.0, 5107.130000000008, 8, 13102, 4639.0, 9576.6, 11026.85, 12478.2, 20.289463005545787, 1727.6953283511427, 12.086496516975517], "isController": false}, {"data": ["Login Welcome", 1500, 0, 0.0, 9525.973333333344, 19, 24399, 8165.0, 18153.6, 19336.85, 24229.98, 20.077364778948215, 4883.368026043689, 46.31126524206609], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 6, 4.25531914893617, 0.01904761904761905], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 0.7092198581560284, 0.0031746031746031746], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 61, 43.262411347517734, 0.19365079365079366], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 3, 2.127659574468085, 0.009523809523809525], "isController": false}, {"data": ["Assertion failed", 70, 49.645390070921984, 0.2222222222222222], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 31500, 141, "Assertion failed", 70, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 61, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 6, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 1500, 70, "Assertion failed", 70, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-5", 1500, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 1500, 70, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 61, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 6, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 3, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
