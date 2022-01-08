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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6702107728337237, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11407142857142857, 500, 1500, "Session Test"], "isController": false}, {"data": [0.8857142857142857, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.8785714285714286, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.17142857142857143, 500, 1500, "Login"], "isController": false}, {"data": [0.6123571428571428, 500, 1500, "Session Test-0"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "Login-0"], "isController": false}, {"data": [0.8, 500, 1500, "Login-1"], "isController": false}, {"data": [0.9714285714285714, 500, 1500, "Login-2"], "isController": false}, {"data": [0.8714285714285714, 500, 1500, "Login-3"], "isController": false}, {"data": [0.9071428571428571, 500, 1500, "Login-4"], "isController": false}, {"data": [0.7642857142857142, 500, 1500, "Session Test-5"], "isController": false}, {"data": [0.9071428571428571, 500, 1500, "Login-5"], "isController": false}, {"data": [0.7562857142857143, 500, 1500, "Session Test-6"], "isController": false}, {"data": [0.85, 500, 1500, "Login-6"], "isController": false}, {"data": [0.7695714285714286, 500, 1500, "Session Test-7"], "isController": false}, {"data": [0.8714285714285714, 500, 1500, "Login-7"], "isController": false}, {"data": [0.8714285714285714, 500, 1500, "Login-8"], "isController": false}, {"data": [0.6757142857142857, 500, 1500, "Session Test-1"], "isController": false}, {"data": [0.7805714285714286, 500, 1500, "Session Test-2"], "isController": false}, {"data": [0.7688571428571429, 500, 1500, "Session Test-3"], "isController": false}, {"data": [0.7721428571428571, 500, 1500, "Session Test-4"], "isController": false}, {"data": [0.9142857142857143, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.9214285714285714, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 64050, 0, 0.0, 779.2815456674507, 11, 7250, 494.5, 1548.0, 2240.9500000000007, 3423.950000000008, 210.9218321384938, 17977.80610756396, 215.54520196053573], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Session Test", 7000, 0, 0.0, 2408.6407142857106, 77, 7250, 2387.0, 3725.9000000000005, 4154.95, 4987.859999999997, 23.211857943429386, 8904.694245298562, 106.6748080876745], "isController": false}, {"data": ["Login Welcome-1", 70, 0, 0.0, 321.34285714285716, 15, 1076, 285.0, 744.5999999999999, 956.9, 1076.0, 1.1463007238070284, 136.2228406048374, 0.6906909634657583], "isController": false}, {"data": ["Login Welcome-0", 70, 0, 0.0, 341.0571428571428, 11, 1578, 257.5, 776.4, 1142.8000000000004, 1578.0, 1.1524720525527254, 2.9633387835657485, 0.5751105652875418], "isController": false}, {"data": ["Login", 70, 0, 0.0, 2283.8714285714286, 456, 4817, 2191.0, 3953.2, 4420.700000000001, 4817.0, 1.0818663740475714, 420.67063882277483, 6.126702249122915], "isController": false}, {"data": ["Session Test-0", 7000, 0, 0.0, 812.7697142857118, 13, 4376, 712.0, 1588.9000000000005, 1873.749999999999, 2520.99, 23.2163230650853, 8.320693911021783, 13.240559248056462], "isController": false}, {"data": ["Login-0", 70, 0, 0.0, 1156.285714285714, 229, 3594, 951.0, 2077.4, 2144.65, 3594.0, 1.1126299392821948, 0.47699662436023776, 0.8149145063102012], "isController": false}, {"data": ["Login-1", 70, 0, 0.0, 479.78571428571416, 13, 1989, 369.5, 1092.1999999999998, 1294.3500000000006, 1989.0, 1.106981892939037, 5.213841474262671, 0.6713239799952558], "isController": false}, {"data": ["Login-2", 70, 0, 0.0, 159.25714285714284, 78, 1426, 107.0, 132.9, 713.0500000000013, 1426.0, 1.1053911505542746, 6.599962396961754, 0.6358158082778006], "isController": false}, {"data": ["Login-3", 70, 0, 0.0, 360.7714285714286, 26, 1576, 275.5, 798.8, 1016.2500000000002, 1576.0, 1.1047979797979797, 59.98599890506629, 0.6861831202651515], "isController": false}, {"data": ["Login-4", 70, 0, 0.0, 308.52857142857147, 18, 985, 264.5, 613.5, 722.3500000000001, 985.0, 1.0953930896344517, 167.14051179308024, 0.6867601206497246], "isController": false}, {"data": ["Session Test-5", 7000, 0, 0.0, 532.6762857142849, 18, 3146, 459.5, 1018.9000000000005, 1240.0, 1698.9599999999991, 23.214783173925156, 1975.9769582654164, 13.330363775652335], "isController": false}, {"data": ["Login-5", 70, 0, 0.0, 314.6142857142857, 11, 1597, 262.5, 605.5, 805.0000000000002, 1597.0, 1.098780353807274, 23.44028987199209, 0.6921028595758708], "isController": false}, {"data": ["Session Test-6", 7000, 0, 0.0, 540.3035714285691, 18, 2829, 473.0, 1039.0, 1253.0, 1728.9899999999998, 23.214860163631602, 167.06084428300903, 13.375749508342425], "isController": false}, {"data": ["Login-6", 70, 0, 0.0, 362.5571428571428, 19, 1114, 335.5, 673.4, 802.9, 1114.0, 1.0882407810459547, 92.62799460543499, 0.6769622827405012], "isController": false}, {"data": ["Session Test-7", 7000, 0, 0.0, 524.7924285714255, 18, 3431, 457.5, 1008.9000000000005, 1231.8999999999996, 1658.8999999999978, 23.216015070510355, 1327.9832683008528, 13.399086822921502], "isController": false}, {"data": ["Login-7", 70, 0, 0.0, 356.71428571428584, 18, 1770, 312.5, 687.5, 838.1500000000001, 1770.0, 1.1051119320514036, 7.952704909459758, 0.6896157466609832], "isController": false}, {"data": ["Login-8", 70, 0, 0.0, 379.8571428571429, 21, 2087, 279.0, 789.5999999999999, 1026.7500000000005, 2087.0, 1.0919925744504937, 62.46325493736643, 0.6824953590315587], "isController": false}, {"data": ["Session Test-1", 7000, 0, 0.0, 677.8445714285701, 13, 4093, 592.0, 1309.9000000000005, 1585.9499999999998, 2192.899999999998, 23.215707084107187, 128.6159241095118, 13.081506823759618], "isController": false}, {"data": ["Session Test-2", 7000, 0, 0.0, 510.79271428571514, 17, 2894, 436.0, 1011.9000000000005, 1238.9499999999998, 1673.9599999999991, 23.215014144576475, 1260.4800502190503, 13.30782549108046], "isController": false}, {"data": ["Session Test-3", 7000, 0, 0.0, 521.3035714285724, 15, 3458, 450.0, 1026.9000000000005, 1228.0, 1683.0, 23.214629196044225, 3542.2032890569553, 13.443628040287331], "isController": false}, {"data": ["Session Test-4", 7000, 0, 0.0, 519.4535714285736, 15, 2673, 450.0, 995.9000000000005, 1230.0, 1708.8699999999972, 23.214860163631602, 495.24279323684794, 13.511774079613705], "isController": false}, {"data": ["Login Welcome-3", 70, 0, 0.0, 311.4285714285715, 16, 1178, 208.0, 708.7, 1000.1500000000003, 1178.0, 1.1460942744404605, 42.023829807046845, 0.6883281042782062], "isController": false}, {"data": ["Login Welcome-2", 70, 0, 0.0, 279.2714285714286, 18, 843, 213.5, 644.2999999999998, 717.6500000000002, 843.0, 1.1466199282543532, 97.637374281315, 0.6796858363773363], "isController": false}, {"data": ["Login Welcome", 70, 0, 0.0, 769.5571428571428, 37, 2654, 694.0, 1480.1, 1886.2500000000002, 2654.0, 1.1441647597254005, 278.29237879004575, 2.6257687356979407], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 64050, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
