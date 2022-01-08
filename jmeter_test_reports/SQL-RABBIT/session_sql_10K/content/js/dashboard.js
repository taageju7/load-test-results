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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4839945355191257, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0376, 500, 1500, "Session Test"], "isController": false}, {"data": [0.82, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.79, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.105, 500, 1500, "Login"], "isController": false}, {"data": [0.4207, 500, 1500, "Session Test-0"], "isController": false}, {"data": [0.3, 500, 1500, "Login-0"], "isController": false}, {"data": [0.695, 500, 1500, "Login-1"], "isController": false}, {"data": [0.945, 500, 1500, "Login-2"], "isController": false}, {"data": [0.8, 500, 1500, "Login-3"], "isController": false}, {"data": [0.8, 500, 1500, "Login-4"], "isController": false}, {"data": [0.56125, 500, 1500, "Session Test-5"], "isController": false}, {"data": [0.785, 500, 1500, "Login-5"], "isController": false}, {"data": [0.56275, 500, 1500, "Session Test-6"], "isController": false}, {"data": [0.75, 500, 1500, "Login-6"], "isController": false}, {"data": [0.5644, 500, 1500, "Session Test-7"], "isController": false}, {"data": [0.765, 500, 1500, "Login-7"], "isController": false}, {"data": [0.765, 500, 1500, "Login-8"], "isController": false}, {"data": [0.4678, 500, 1500, "Session Test-1"], "isController": false}, {"data": [0.5725, 500, 1500, "Session Test-2"], "isController": false}, {"data": [0.56995, 500, 1500, "Session Test-3"], "isController": false}, {"data": [0.56805, 500, 1500, "Session Test-4"], "isController": false}, {"data": [0.785, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.78, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.47, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 91500, 0, 0.0, 1279.9927322404455, 11, 9602, 711.0, 2200.9000000000015, 3229.5500000000065, 4765.980000000003, 202.67306951132534, 17274.0515974971, 207.11562789335187], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Session Test", 10000, 0, 0.0, 3878.1280999999844, 124, 9602, 3881.0, 5740.0, 6308.0, 7628.959999999999, 22.264326537518727, 8540.85603282889, 102.32023504449526], "isController": false}, {"data": ["Login Welcome-1", 100, 0, 0.0, 438.34, 15, 1990, 345.5, 952.7, 1363.2999999999984, 1987.5999999999988, 1.636286284648362, 194.45121259040482, 0.9859264039336323], "isController": false}, {"data": ["Login Welcome-0", 100, 0, 0.0, 533.5999999999999, 11, 3292, 402.5, 1083.9000000000003, 1915.8499999999976, 3286.5399999999972, 1.6540408217274802, 4.253017073836382, 0.8254051366237719], "isController": false}, {"data": ["Login", 100, 0, 0.0, 3190.0099999999998, 541, 7914, 2934.5, 5524.5, 6168.749999999998, 7908.449999999997, 1.4360388304899765, 558.3863097033144, 8.132411306651733], "isController": false}, {"data": ["Session Test-0", 10000, 0, 0.0, 1259.7503000000074, 20, 6186, 1142.0, 2335.0, 2787.0, 3620.99, 22.268838323780002, 7.981116860182872, 12.700196856530782], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 1569.6699999999998, 236, 3804, 1428.5, 2922.1000000000004, 3203.7999999999984, 3803.0999999999995, 1.5306434825200514, 0.6562036023694362, 1.121076769423866], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 652.7799999999999, 13, 2703, 522.5, 1500.1000000000001, 2144.599999999996, 2701.039999999999, 1.4884939418296568, 7.010748321723081, 0.902690173707243], "isController": false}, {"data": ["Login-2", 100, 0, 0.0, 195.33000000000007, 82, 1165, 106.0, 533.8000000000002, 1009.2999999999982, 1164.84, 1.4864804602143504, 8.875333529053261, 0.8550165928381372], "isController": false}, {"data": ["Login-3", 100, 0, 0.0, 511.53999999999996, 15, 1978, 381.5, 1238.2, 1474.2999999999997, 1976.3899999999992, 1.4827555529195457, 80.50754490895882, 0.9209302066961241], "isController": false}, {"data": ["Login-4", 100, 0, 0.0, 486.0999999999999, 16, 1421, 402.5, 1004.7, 1130.6999999999998, 1420.3799999999997, 1.4670070122935188, 223.84320766584514, 0.9197446307543351], "isController": false}, {"data": ["Session Test-5", 10000, 0, 0.0, 897.7184999999986, 19, 4822, 816.0, 1607.0, 1912.949999999999, 2605.8799999999974, 22.26670615295891, 1895.2794026288072, 12.785960173769375], "isController": false}, {"data": ["Login-5", 100, 0, 0.0, 468.03999999999996, 15, 1871, 356.5, 1001.1000000000001, 1113.6, 1867.9499999999985, 1.4485825619631192, 30.902623111410485, 0.912437258267785], "isController": false}, {"data": ["Session Test-6", 10000, 0, 0.0, 894.6524000000007, 20, 4364, 810.0, 1623.0, 1950.0, 2550.99, 22.267251553140795, 160.24157880380326, 12.829764078469795], "isController": false}, {"data": ["Login-6", 100, 0, 0.0, 556.8199999999999, 19, 2137, 457.0, 1122.9000000000003, 1380.499999999999, 2136.3999999999996, 1.4430430892666455, 122.8277691996883, 0.8976742654910675], "isController": false}, {"data": ["Session Test-7", 10000, 0, 0.0, 889.9962999999992, 19, 4755, 813.0, 1611.8999999999996, 1906.8999999999978, 2583.949999999999, 22.266904477206484, 1273.6930301248951, 12.851309126981477], "isController": false}, {"data": ["Login-7", 100, 0, 0.0, 578.5199999999999, 22, 2494, 413.0, 1325.2000000000005, 1594.55, 2491.4399999999987, 1.4545242978283952, 10.467177295602973, 0.9076572522581489], "isController": false}, {"data": ["Login-8", 100, 0, 0.0, 571.1300000000001, 27, 2799, 418.0, 1268.9, 1554.4999999999982, 2794.5099999999975, 1.4777815543306387, 84.53083668297153, 0.9236134714566493], "isController": false}, {"data": ["Session Test-1", 10000, 0, 0.0, 1114.4653999999994, 18, 5884, 1017.0, 2032.8999999999996, 2393.0, 3132.0, 22.267251553140795, 123.36144341891381, 12.547074361486562], "isController": false}, {"data": ["Session Test-2", 10000, 0, 0.0, 882.9849000000021, 13, 4705, 808.0, 1603.8999999999996, 1900.0, 2585.9799999999996, 22.267350719680774, 1209.0258131479798, 12.764584836379507], "isController": false}, {"data": ["Session Test-3", 10000, 0, 0.0, 886.9544999999997, 18, 5131, 805.0, 1605.0, 1931.0, 2619.9799999999996, 22.267350719680774, 3397.323073460129, 12.895057594502635], "isController": false}, {"data": ["Session Test-4", 10000, 0, 0.0, 887.2018000000007, 20, 5089, 805.5, 1618.0, 1916.8999999999978, 2710.9199999999983, 22.26754905541057, 475.0337979643007, 12.960409411156933], "isController": false}, {"data": ["Login Welcome-3", 100, 0, 0.0, 512.2099999999998, 16, 3191, 371.0, 1113.6000000000008, 1599.1999999999978, 3180.3099999999945, 1.5997440409534474, 58.65780225163974, 0.9607837745960647], "isController": false}, {"data": ["Login Welcome-2", 100, 0, 0.0, 524.47, 21, 2084, 368.5, 1119.2, 1447.5999999999997, 2083.2799999999997, 1.6274982097519692, 138.5852870093093, 0.9647377083197708], "isController": false}, {"data": ["Login Welcome", 100, 0, 0.0, 1219.5700000000004, 35, 5858, 1047.0, 2578.1000000000004, 3212.85, 5851.159999999996, 1.5960672901969546, 388.2075191727583, 3.6628497382449643], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 91500, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
