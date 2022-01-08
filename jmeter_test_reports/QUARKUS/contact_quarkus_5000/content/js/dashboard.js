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

    var data = {"OkPercent": 74.05331340308919, "KoPercent": 25.946686596910812};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7339063278525162, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8716911764705882, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.8709558823529412, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.8834558823529411, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.8727941176470588, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.8463235294117647, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.8917279411764706, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.930514705882353, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [1.0, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.5405690200210748, 500, 1500, "Send Email-2"], "isController": false}, {"data": [0.7872784150156413, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.4137, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [0.4, 500, 1500, "Send Email-4"], "isController": false}, {"data": [0.4542518837459634, 500, 1500, "Send Email-3"], "isController": false}, {"data": [0.2532188841201717, 500, 1500, "Send Email-6"], "isController": false}, {"data": [0.28095238095238095, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.4626, 500, 1500, "Send Email"], "isController": false}, {"data": [1.0, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 40140, 10415, 25.946686596910812, 43.87414050822105, 0, 4562, 6.0, 90.0, 98.0, 111.0, 668.7882170645962, 36392.19219577863, 446.79822743631183], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 2720, 349, 12.830882352941176, 12.95147058823528, 1, 319, 5.0, 23.0, 53.94999999999982, 144.57999999999993, 45.61156387295838, 291.09002087211155, 20.345526985444543], "isController": false}, {"data": ["Show Contact Page-5", 2720, 351, 12.904411764705882, 12.921691176470576, 1, 477, 6.0, 24.0, 48.94999999999982, 144.3699999999999, 45.61156387295838, 3386.4028909682397, 20.250775826290372], "isController": false}, {"data": ["Show Contact Page-4", 2720, 317, 11.654411764705882, 13.08235294117646, 1, 300, 5.0, 25.0, 54.94999999999982, 152.3699999999999, 45.606975184439975, 863.2688710387324, 20.85412867831992], "isController": false}, {"data": ["Show Contact Page-3", 2720, 346, 12.720588235294118, 12.916176470588262, 2, 330, 6.0, 23.0, 47.0, 144.94999999999982, 45.612328744151725, 6079.5344675976385, 20.488242929669813], "isController": false}, {"data": ["Show Contact Page-7", 2720, 418, 15.367647058823529, 11.21029411764706, 0, 282, 4.0, 21.0, 46.94999999999982, 138.3699999999999, 45.6720678364537, 2219.238059881622, 19.817389125598186], "isController": false}, {"data": ["Show Contact Page-2", 2720, 294, 10.808823529411764, 12.878676470588212, 1, 944, 5.0, 23.0, 46.0, 145.78999999999996, 45.6215091997786, 2211.9541431500643, 20.702810513493567], "isController": false}, {"data": ["Show Contact Page-1", 2720, 57, 2.0955882352941178, 244.06286764705854, 3, 4461, 98.0, 218.80000000000018, 680.1999999999971, 3700.79, 45.54664344680923, 268.83600173311675, 23.51540391249016], "isController": false}, {"data": ["Show Contact Page-0", 2720, 0, 0.0, 3.895955882352943, 1, 128, 2.0, 7.0, 12.949999999999818, 45.0, 45.53749309403827, 267.2214804707773, 22.81321675511878], "isController": false}, {"data": ["Send Email-2", 949, 436, 45.943097997892515, 8.031612223393038, 1, 98, 6.0, 16.0, 24.5, 45.0, 35.38272249356847, 1369.2841182632078, 9.788199428619365], "isController": false}, {"data": ["Send Email-1", 959, 204, 21.27215849843587, 47.51929092805004, 1, 130, 17.0, 99.0, 104.0, 116.39999999999998, 17.32516756092714, 517.6532994767673, 7.104914283101187], "isController": false}, {"data": ["Show Contact Page", 5000, 2798, 55.96, 139.68800000000013, 2, 4562, 88.0, 143.0, 248.0, 3160.179999999982, 83.48499774590506, 15611.772633696006, 168.1046414006278], "isController": false}, {"data": ["Send Email-4", 845, 507, 60.0, 9.220118343195262, 1, 87, 7.0, 17.0, 27.0, 57.07999999999993, 31.505163864136314, 462.55404755135896, 6.485050776443831], "isController": false}, {"data": ["Send Email-3", 929, 507, 54.57481162540366, 8.546824542518852, 2, 112, 6.0, 17.0, 22.0, 41.700000000000045, 34.637038141754594, 1422.460442318985, 8.075601324521829], "isController": false}, {"data": ["Send Email-6", 466, 348, 74.67811158798283, 10.152360515021451, 1, 82, 8.0, 20.0, 26.649999999999977, 44.63999999999987, 17.378981129260833, 67.77439898467219, 2.251986485604535], "isController": false}, {"data": ["Send Email-5", 630, 453, 71.9047619047619, 9.928571428571445, 2, 81, 8.0, 19.0, 24.0, 61.139999999999645, 23.48905708213713, 546.0366876701092, 3.3682868018530256], "isController": false}, {"data": ["Send Email-7", 441, 343, 77.77777777777777, 10.530612244897952, 2, 108, 7.0, 21.0, 28.0, 58.15999999999997, 16.446019019205668, 241.13511415019576, 1.8737326356516875], "isController": false}, {"data": ["Send Email", 5000, 2687, 53.74, 15.780400000000027, 2, 286, 4.0, 52.0, 100.0, 116.0, 88.37513477208053, 2866.4851248077844, 59.03876713372926], "isController": false}, {"data": ["Send Email-0", 3161, 0, 0.0, 5.742170199304017, 1, 286, 3.0, 8.0, 13.0, 59.38000000000011, 55.956806514427335, 332.516765273721, 37.04952618826341], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, 0.028804608737397985, 0.007473841554559043], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, 0.019203072491598656, 0.004982561036372696], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 9044, 86.83629380700913, 22.53114100647733], "isController": false}, {"data": ["Assertion failed", 1366, 13.115698511761883, 3.403089187842551], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 40140, 10415, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 9044, "Assertion failed", 1366, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 2720, 349, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 349, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-5", 2720, 351, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 351, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-4", 2720, 317, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 317, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-3", 2720, 346, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 346, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-7", 2720, 418, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 413, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-2", 2720, 294, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 294, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-1", 2720, 57, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 57, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-2", 949, 436, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 436, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-1", 959, 204, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 204, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 5000, 2798, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2280, "Assertion failed", 518, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 845, 507, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 507, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 929, 507, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 507, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-6", 466, 348, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 348, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 630, 453, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 453, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-7", 441, 343, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 343, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email", 5000, 2687, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1839, "Assertion failed", 848, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
