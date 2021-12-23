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

    var data = {"OkPercent": 99.45714285714286, "KoPercent": 0.5428571428571428};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.22485714285714287, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.262, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.2835, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.004, 500, 1500, "Login-0"], "isController": false}, {"data": [0.268, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.137, 500, 1500, "Login-1"], "isController": false}, {"data": [0.2005, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9105, 500, 1500, "Login-2"], "isController": false}, {"data": [0.5505, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.1435, 500, 1500, "Login-3"], "isController": false}, {"data": [0.1425, 500, 1500, "Login-4"], "isController": false}, {"data": [0.1445, 500, 1500, "Login-5"], "isController": false}, {"data": [0.142, 500, 1500, "Login-6"], "isController": false}, {"data": [0.2675, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.144, 500, 1500, "Login-7"], "isController": false}, {"data": [0.267, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.139, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0115, 500, 1500, "Logout"], "isController": false}, {"data": [0.2585, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.264, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.182, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 21000, 114, 0.5428571428571428, 4365.04347619047, 4, 25055, 3536.0, 10691.800000000003, 12818.0, 20576.99, 351.0883739592737, 29183.682403732822, 363.4100673023874], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 1000, 0, 0.0, 3657.433000000001, 6, 12861, 3186.0, 8358.599999999991, 10473.39999999999, 12816.9, 20.993408069866064, 2494.7918306776673, 12.710852542301717], "isController": false}, {"data": ["Login Welcome-0", 1000, 0, 0.0, 2895.9000000000015, 4, 8070, 2813.0, 6011.3, 6787.999999999998, 7886.8, 28.503021320259947, 73.2895069689887, 14.307180623646104], "isController": false}, {"data": ["Login", 1000, 57, 5.7, 14577.018999999995, 4460, 25055, 15076.5, 21482.2, 22306.549999999996, 23103.7, 17.307026652821047, 6677.34332746517, 98.32130292164244], "isController": false}, {"data": ["Login-0", 1000, 0, 0.0, 5262.201999999987, 1249, 13867, 4962.0, 6924.9, 9131.699999999997, 12154.34, 18.766655406673426, 8.045470433134406, 14.3132401099726], "isController": false}, {"data": ["Logout-2", 1000, 0, 0.0, 2671.3750000000014, 6, 12559, 1637.5, 5861.099999999997, 7842.499999999999, 11995.75, 19.48785906380325, 2315.8770328272985, 11.799289667537124], "isController": false}, {"data": ["Login-1", 1000, 0, 0.0, 4442.065000000001, 7, 12811, 3785.5, 8982.2, 10340.0, 12337.69, 18.17620008361052, 85.60919238598979, 11.07612192595016], "isController": false}, {"data": ["Logout-1", 1000, 0, 0.0, 3196.2489999999975, 55, 12857, 2868.5, 6759.699999999999, 10052.249999999995, 12309.82, 19.408807716941947, 51.516737670554896, 9.874989082545659], "isController": false}, {"data": ["Login-2", 1000, 0, 0.0, 405.1059999999994, 78, 5598, 104.0, 628.8999999999993, 2006.6999999999996, 5213.9, 18.20598248584485, 110.37376882043439, 10.525333624629052], "isController": false}, {"data": ["Logout-0", 1000, 0, 0.0, 1586.2190000000003, 24, 12680, 595.0, 4135.099999999999, 6167.849999999999, 7957.040000000001, 19.320684725066656, 8.528270991923954, 10.962224438734108], "isController": false}, {"data": ["Login-3", 1000, 0, 0.0, 4299.576999999994, 12, 12856, 3632.5, 9690.1, 11702.5, 12368.98, 17.883968810358397, 971.0261541866372, 11.16001569318263], "isController": false}, {"data": ["Login-4", 1000, 0, 0.0, 4309.397000000006, 12, 12852, 3638.5, 9695.0, 11701.599999999999, 12369.99, 17.767354263276655, 2711.0310562247923, 11.191351074036564], "isController": false}, {"data": ["Login-5", 1000, 0, 0.0, 4314.410999999997, 6, 13098, 3633.0, 9681.8, 11747.349999999999, 12381.87, 17.820864668353707, 380.1726451954949, 11.277265922942581], "isController": false}, {"data": ["Login-6", 1000, 0, 0.0, 4325.371000000006, 18, 12854, 3643.0, 9692.4, 11783.749999999995, 12371.97, 17.885568135071807, 1522.3692564969326, 11.178480084419881], "isController": false}, {"data": ["Logout-4", 1000, 0, 0.0, 2668.608, 6, 12549, 1601.0, 5817.8, 7828.9, 11969.91, 19.48785906380325, 714.5611760435748, 11.761227442803134], "isController": false}, {"data": ["Login-7", 1000, 0, 0.0, 4334.255999999999, 6, 12933, 3645.0, 9678.0, 11706.75, 12377.91, 17.822135091783995, 128.2532358314026, 11.173643289966138], "isController": false}, {"data": ["Logout-3", 1000, 0, 0.0, 2667.483999999998, 7, 12558, 1622.0, 5762.299999999999, 7842.199999999999, 11971.75, 19.48747929455325, 1659.404535710806, 11.608752314138167], "isController": false}, {"data": ["Login-8", 1000, 57, 5.7, 4323.4760000000015, 5, 13228, 3634.0, 9711.1, 11699.199999999999, 12554.92, 17.83262300051715, 964.5377219882929, 10.559368284902902], "isController": false}, {"data": ["Logout", 1000, 0, 0.0, 7511.775000000003, 998, 23416, 5392.5, 16706.1, 18831.34999999999, 21524.93, 19.281940534495394, 4700.010665323358, 55.548559156993555], "isController": false}, {"data": ["Login Welcome-3", 1000, 0, 0.0, 3755.9500000000053, 5, 12861, 3220.0, 8679.2, 10478.9, 12817.95, 20.99428955324152, 769.7974510308196, 12.670381781155527], "isController": false}, {"data": ["Login Welcome-2", 1000, 0, 0.0, 3716.4919999999975, 6, 12863, 3174.0, 8670.9, 10468.29999999999, 12817.99, 20.993408069866064, 1787.637900449259, 12.505838791619432], "isController": false}, {"data": ["Login Welcome", 1000, 0, 0.0, 6745.5480000000025, 12, 17876, 6213.0, 14903.7, 15766.099999999999, 17865.99, 20.92882107950859, 5090.465646648249, 48.27526893535087], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 51, 44.73684210526316, 0.24285714285714285], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 6, 5.2631578947368425, 0.02857142857142857], "isController": false}, {"data": ["Assertion failed", 57, 50.0, 0.2714285714285714], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 21000, 114, "Assertion failed", 57, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 51, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 6, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 1000, 57, "Assertion failed", 57, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 1000, 57, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 51, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 6, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
