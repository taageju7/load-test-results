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

    var data = {"OkPercent": 98.77777777777777, "KoPercent": 1.2222222222222223};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.09758333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.066, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.067, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.0645, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.074, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.0655, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.069, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.9505, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [0.0865, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.0255, 500, 1500, "Send Email-2"], "isController": false}, {"data": [0.0245, 500, 1500, "Send Email-1"], "isController": false}, {"data": [5.0E-4, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [0.021, 500, 1500, "Send Email-4"], "isController": false}, {"data": [0.0225, 500, 1500, "Send Email-3"], "isController": false}, {"data": [0.0195, 500, 1500, "Send Email-6"], "isController": false}, {"data": [0.022, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.024, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email"], "isController": false}, {"data": [0.154, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18000, 220, 1.2222222222222223, 6734.568222222235, 30, 36315, 6095.0, 12042.699999999999, 16417.600000000006, 25290.950000000008, 185.61484918793502, 15831.21555974478, 197.5781048594999], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 1000, 0, 0.0, 6002.622999999996, 57, 15591, 6181.0, 10511.8, 11448.449999999997, 13130.0, 12.323314478662182, 88.68213319654454, 7.100347209385435], "isController": false}, {"data": ["Show Contact Page-5", 1000, 0, 0.0, 6039.674999999999, 144, 18987, 6147.0, 10685.3, 11490.75, 12382.86, 12.096432761978493, 1028.5847211469838, 6.945998500042338], "isController": false}, {"data": ["Show Contact Page-4", 1000, 0, 0.0, 6027.918999999998, 84, 15492, 6129.5, 10669.899999999998, 11670.649999999998, 12984.99, 12.314209366187644, 262.6991246136417, 7.167254670163903], "isController": false}, {"data": ["Show Contact Page-3", 1000, 0, 0.0, 5982.381, 53, 16040, 6082.5, 10609.6, 11421.999999999998, 12948.94, 12.09979914333422, 1846.247379637248, 7.0070125898410085], "isController": false}, {"data": ["Show Contact Page-7", 1000, 110, 11.0, 5800.033000000001, 48, 15426, 5840.0, 10732.0, 11547.8, 13328.620000000004, 12.226134585289515, 626.0522355869156, 6.280102080582453], "isController": false}, {"data": ["Show Contact Page-2", 1000, 0, 0.0, 5996.898000000006, 55, 15098, 6194.0, 10659.699999999999, 11459.449999999997, 12824.970000000001, 12.131652695046647, 658.6989826092758, 6.95437512889881], "isController": false}, {"data": ["Show Contact Page-1", 1000, 0, 0.0, 247.41100000000012, 73, 3937, 102.0, 151.79999999999995, 996.349999999995, 3791.98, 14.61261945816407, 87.24761266329602, 7.70587354239121], "isController": false}, {"data": ["Show Contact Page-0", 1000, 0, 0.0, 5034.026000000001, 51, 12664, 5182.5, 8482.4, 9069.699999999999, 10465.86, 14.236902050113894, 84.75405751708429, 7.132354249715262], "isController": false}, {"data": ["Send Email-2", 1000, 0, 0.0, 6366.975000000004, 109, 15978, 6051.0, 10793.0, 11611.9, 13273.83, 11.099518280906608, 602.6583172852798, 6.89384143228184], "isController": false}, {"data": ["Send Email-1", 1000, 0, 0.0, 6916.427000000011, 67, 15594, 6852.5, 11201.3, 11858.0, 13442.62, 11.219944573473807, 66.72799067622606, 6.9686374499309975], "isController": false}, {"data": ["Show Contact Page", 1000, 110, 11.0, 12283.685000000016, 1314, 26670, 12424.0, 20099.8, 21582.55, 24215.75, 11.824384245190432, 4535.504122460714, 52.34356986289627], "isController": false}, {"data": ["Send Email-4", 1000, 0, 0.0, 6380.6489999999985, 64, 19874, 6038.0, 10863.3, 11895.949999999999, 13090.050000000001, 11.099395082967977, 236.78348201897998, 6.991318191908541], "isController": false}, {"data": ["Send Email-3", 1000, 0, 0.0, 6355.807000000007, 141, 14256, 6127.0, 10806.4, 11745.8, 13196.5, 11.093238671030008, 1692.6613892894782, 6.954940651173111], "isController": false}, {"data": ["Send Email-6", 1000, 0, 0.0, 6455.900000000006, 444, 20076, 6070.0, 10976.8, 11898.8, 14291.340000000002, 11.102229327648992, 79.89485147992717, 6.9280513089528375], "isController": false}, {"data": ["Send Email-5", 1000, 0, 0.0, 6370.498000000003, 66, 15676, 6025.0, 10832.1, 11629.099999999999, 13102.640000000001, 11.097547442015314, 944.5920264121629, 6.9034548052380424], "isController": false}, {"data": ["Send Email-7", 1000, 0, 0.0, 6420.936000000001, 53, 19875, 6071.5, 10895.8, 11734.0, 13571.85, 11.094592495617636, 634.6236922249096, 6.934120309761022], "isController": false}, {"data": ["Send Email", 1000, 0, 0.0, 18489.07100000001, 2485, 36315, 18567.5, 27853.9, 29937.7, 32511.910000000003, 10.936252583689674, 4200.001589174204, 56.3580125821586], "isController": false}, {"data": ["Send Email-0", 1000, 0, 0.0, 4051.314, 30, 14750, 2855.0, 9437.9, 11075.249999999998, 13215.810000000003, 11.717834544176236, 4.314085569486759, 9.177444633231778], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 110, 50.0, 0.6111111111111112], "isController": false}, {"data": ["Assertion failed", 110, 50.0, 0.6111111111111112], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18000, 220, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 110, "Assertion failed", 110, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show Contact Page-7", 1000, 110, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 110, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show Contact Page", 1000, 110, "Assertion failed", 110, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
