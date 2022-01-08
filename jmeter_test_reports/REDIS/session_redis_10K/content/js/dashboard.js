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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9995464480874316, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9996, 500, 1500, "Session Test"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.775, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-0"], "isController": false}, {"data": [0.925, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.945, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login-4"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-5"], "isController": false}, {"data": [1.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.99995, 500, 1500, "Session Test-6"], "isController": false}, {"data": [1.0, 500, 1500, "Login-6"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-8"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-1"], "isController": false}, {"data": [0.99995, 500, 1500, "Session Test-2"], "isController": false}, {"data": [0.99995, 500, 1500, "Session Test-3"], "isController": false}, {"data": [0.99995, 500, 1500, "Session Test-4"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 91500, 0, 0.0, 17.824349726775875, 2, 2897, 6.0, 13.0, 16.0, 18.0, 1489.160861923052, 126927.2737802918, 1521.8030086338779], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Session Test", 10000, 0, 0.0, 41.389900000000026, 10, 874, 20.0, 91.89999999999964, 114.94999999999891, 194.98999999999978, 168.11808614370736, 64494.35395765736, 772.6208138596551], "isController": false}, {"data": ["Login Welcome-1", 100, 0, 0.0, 13.590000000000002, 5, 95, 10.0, 26.0, 29.94999999999999, 94.63999999999982, 1.6743407283382168, 198.97348524487234, 1.0088556927584764], "isController": false}, {"data": ["Login Welcome-0", 100, 0, 0.0, 9.989999999999997, 3, 78, 6.0, 26.900000000000006, 35.94999999999999, 77.71999999999986, 1.672352665730149, 4.300102118034651, 0.8345431759649475], "isController": false}, {"data": ["Login", 100, 0, 0.0, 616.1700000000002, 301, 2897, 386.5, 1169.3000000000002, 1532.2499999999995, 2890.1899999999964, 1.6780212773097962, 652.4782538930093, 9.502778698358895], "isController": false}, {"data": ["Session Test-0", 10000, 0, 0.0, 8.846000000000048, 2, 199, 5.0, 20.0, 27.0, 47.0, 168.143527314916, 60.23047288790712, 95.89435542178803], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 355.52000000000015, 179, 1140, 269.5, 538.3000000000001, 703.7999999999995, 1138.259999999999, 1.6802769096347077, 0.7203530891890984, 1.2306715646738582], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 9.199999999999996, 2, 62, 6.0, 18.900000000000006, 35.89999999999998, 61.929999999999964, 1.68554476806904, 7.938850016012675, 1.0221907236043688], "isController": false}, {"data": ["Login-2", 100, 0, 0.0, 250.14999999999995, 74, 2694, 96.5, 513.3000000000001, 1017.5499999999995, 2681.5299999999934, 1.6837567981680726, 10.053211976562105, 0.9684890176962839], "isController": false}, {"data": ["Login-3", 100, 0, 0.0, 14.459999999999997, 4, 82, 8.0, 36.60000000000002, 51.94999999999999, 81.85999999999993, 1.6858005023685496, 91.53205286248925, 1.0470401557679663], "isController": false}, {"data": ["Login-4", 100, 0, 0.0, 17.220000000000006, 5, 259, 9.0, 33.0, 44.799999999999955, 257.2499999999991, 1.6859426105135382, 257.249487368075, 1.0570069882321205], "isController": false}, {"data": ["Session Test-5", 10000, 0, 0.0, 15.865799999999965, 4, 364, 9.0, 35.0, 48.0, 88.0, 168.16614815437651, 14313.79051096233, 96.56415538552089], "isController": false}, {"data": ["Login-5", 100, 0, 0.0, 14.049999999999994, 3, 69, 8.0, 32.70000000000002, 44.69999999999993, 69.0, 1.6857720836142953, 35.96258902983816, 1.0618388612609575], "isController": false}, {"data": ["Session Test-6", 10000, 0, 0.0, 14.590999999999969, 3, 780, 8.0, 33.0, 46.0, 84.0, 168.16897618727296, 1210.1616071015658, 96.89423432665143], "isController": false}, {"data": ["Login-6", 100, 0, 0.0, 17.56999999999999, 5, 91, 9.0, 45.900000000000006, 59.74999999999994, 90.92999999999996, 1.6858573427516563, 143.4954355412445, 1.0487218040359425], "isController": false}, {"data": ["Session Test-7", 10000, 0, 0.0, 15.192100000000032, 3, 348, 9.0, 33.0, 46.0, 79.98999999999978, 168.16897618727296, 9619.436792902008, 97.05846184245931], "isController": false}, {"data": ["Login-7", 100, 0, 0.0, 14.83, 4, 92, 8.0, 35.900000000000006, 43.94999999999999, 91.85999999999993, 1.6859141869678833, 12.13232582399056, 1.0520499662817162], "isController": false}, {"data": ["Login-8", 100, 0, 0.0, 14.790000000000003, 4, 80, 8.0, 34.0, 47.89999999999998, 79.8099999999999, 1.686226898691488, 96.4541546523, 1.0538918116821798], "isController": false}, {"data": ["Session Test-1", 10000, 0, 0.0, 8.004500000000002, 2, 197, 4.0, 18.0, 25.0, 43.0, 168.15200941651253, 931.5339371479317, 94.74971624348412], "isController": false}, {"data": ["Session Test-2", 10000, 0, 0.0, 14.698400000000042, 3, 708, 9.0, 33.0, 44.0, 80.0, 168.16049237392167, 9130.383582622506, 96.39668849950392], "isController": false}, {"data": ["Session Test-3", 10000, 0, 0.0, 15.91039999999998, 4, 802, 9.0, 35.0, 47.0, 84.98999999999978, 168.16049237392167, 25658.72596618713, 97.38200388450737], "isController": false}, {"data": ["Session Test-4", 10000, 0, 0.0, 14.562600000000012, 3, 551, 8.0, 33.0, 46.0, 82.0, 168.16897618727296, 3587.5148395983283, 97.87959942149872], "isController": false}, {"data": ["Login Welcome-3", 100, 0, 0.0, 13.02, 4, 160, 9.0, 23.80000000000001, 28.94999999999999, 158.95999999999947, 1.674368762976358, 61.39406635104816, 1.0056023332328712], "isController": false}, {"data": ["Login Welcome-2", 100, 0, 0.0, 13.120000000000001, 5, 137, 9.0, 23.700000000000017, 33.849999999999966, 136.2199999999996, 1.674312694638851, 142.5716501188762, 0.9924880914509594], "isController": false}, {"data": ["Login Welcome", 100, 0, 0.0, 29.52999999999998, 10, 188, 16.5, 67.0, 89.0, 187.7499999999999, 1.6721289545849776, 406.7078106188549, 3.8374053156979464], "isController": false}]}, function(index, item){
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
