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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9985245901639345, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9995, 500, 1500, "Session Test"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.95, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-0"], "isController": false}, {"data": [0.85, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.75, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.9995, 500, 1500, "Session Test-5"], "isController": false}, {"data": [1.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.9995, 500, 1500, "Session Test-6"], "isController": false}, {"data": [1.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.9995, 500, 1500, "Session Test-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-8"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-1"], "isController": false}, {"data": [0.9995, 500, 1500, "Session Test-2"], "isController": false}, {"data": [0.9995, 500, 1500, "Session Test-3"], "isController": false}, {"data": [0.9995, 500, 1500, "Session Test-4"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.95, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9150, 0, 0.0, 44.29136612021846, 11, 3507, 29.0, 85.0, 111.0, 178.0, 132.60677381487224, 11302.61696275235, 135.5134911994029], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Session Test", 1000, 0, 0.0, 102.9150000000001, 40, 719, 94.0, 160.89999999999998, 180.0, 234.96000000000004, 15.401438494355373, 5908.381189092123, 70.78043901800427], "isController": false}, {"data": ["Login Welcome-1", 10, 0, 0.0, 41.3, 22, 101, 34.5, 96.50000000000001, 101.0, 101.0, 0.17116839546746088, 20.341123902382666, 0.10313564453459313], "isController": false}, {"data": ["Login Welcome-0", 10, 0, 0.0, 147.0, 21, 1216, 24.0, 1100.9000000000003, 1216.0, 1216.0, 0.16763054228480428, 0.43102657991786103, 0.08365156944095214], "isController": false}, {"data": ["Login", 10, 0, 0.0, 1172.5, 377, 3507, 594.5, 3399.9000000000005, 3507.0, 3507.0, 0.17096939647803042, 66.47937948794666, 0.9682143849375962], "isController": false}, {"data": ["Session Test-0", 1000, 0, 0.0, 25.66700000000002, 12, 259, 23.0, 38.0, 44.0, 59.0, 15.412595172775191, 5.519485132625381, 8.78999568447335], "isController": false}, {"data": ["Login-0", 10, 0, 0.0, 463.0, 261, 968, 433.0, 932.7, 968.0, 968.0, 0.17135317603111772, 0.07346098073990301, 0.1255028144759163], "isController": false}, {"data": ["Login-1", 10, 0, 0.0, 28.2, 12, 70, 21.0, 67.70000000000002, 70.0, 70.0, 0.17419478460814886, 0.8204506310206073, 0.10563961058755901], "isController": false}, {"data": ["Login-2", 10, 0, 0.0, 678.5, 91, 3132, 116.5, 3003.9000000000005, 3132.0, 3132.0, 0.17409773847037727, 1.0394859111405144, 0.10014020308501193], "isController": false}, {"data": ["Login-3", 10, 0, 0.0, 40.8, 12, 81, 35.0, 80.2, 81.0, 81.0, 0.1742889012827663, 9.463172482832544, 0.10824974728109314], "isController": false}, {"data": ["Login-4", 10, 0, 0.0, 47.9, 13, 113, 32.5, 112.2, 113.0, 113.0, 0.17438007881979561, 26.607777514996688, 0.10932813535381719], "isController": false}, {"data": ["Session Test-5", 1000, 0, 0.0, 37.96499999999999, 12, 620, 31.0, 67.89999999999998, 81.0, 113.95000000000005, 15.441630636195184, 1314.3446716723286, 8.866873841877702], "isController": false}, {"data": ["Login-5", 10, 0, 0.0, 43.1, 15, 85, 36.5, 83.60000000000001, 85.0, 85.0, 0.17424942062067644, 3.717264251424489, 0.10975671513704717], "isController": false}, {"data": ["Session Test-6", 1000, 0, 0.0, 36.94999999999998, 11, 591, 29.0, 67.0, 83.0, 115.0, 15.441392195920384, 111.11766063390776, 8.896895894133817], "isController": false}, {"data": ["Login-6", 10, 0, 0.0, 44.0, 14, 167, 29.0, 156.60000000000002, 167.0, 167.0, 0.17434055684373856, 14.839377865722902, 0.10845208467720846], "isController": false}, {"data": ["Session Test-7", 1000, 0, 0.0, 38.470999999999975, 12, 640, 31.0, 67.0, 83.94999999999993, 126.99000000000001, 15.442346001204502, 883.3163517795373, 8.91252586592955], "isController": false}, {"data": ["Login-7", 10, 0, 0.0, 47.8, 12, 112, 42.0, 108.70000000000002, 112.0, 112.0, 0.17427675148135238, 1.2541458805332868, 0.10875277753572674], "isController": false}, {"data": ["Login-8", 10, 0, 0.0, 46.2, 19, 99, 42.5, 96.4, 99.0, 99.0, 0.17460234316344525, 9.987458641069962, 0.10912646447715328], "isController": false}, {"data": ["Session Test-1", 1000, 0, 0.0, 23.346000000000025, 11, 94, 21.0, 34.0, 40.94999999999993, 55.0, 15.422102957959348, 85.43861605421641, 8.689993561272015], "isController": false}, {"data": ["Session Test-2", 1000, 0, 0.0, 35.93900000000002, 12, 543, 29.0, 64.0, 82.94999999999993, 121.98000000000002, 15.441869083833907, 838.4257822754366, 8.85193081270557], "isController": false}, {"data": ["Session Test-3", 1000, 0, 0.0, 37.95400000000001, 13, 664, 30.0, 71.0, 85.0, 118.99000000000001, 15.441153763009172, 2356.085219968886, 8.941996270961367], "isController": false}, {"data": ["Session Test-4", 1000, 0, 0.0, 35.157000000000004, 12, 542, 28.0, 61.0, 77.0, 115.0, 15.441630636195184, 329.41292850525014, 8.987511581222977], "isController": false}, {"data": ["Login Welcome-3", 10, 0, 0.0, 44.9, 22, 98, 32.0, 96.0, 98.0, 98.0, 0.17117718550471592, 6.2765525235796575, 0.10280661043496124], "isController": false}, {"data": ["Login Welcome-2", 10, 0, 0.0, 40.0, 19, 100, 32.0, 95.30000000000001, 100.0, 100.0, 0.17122408095474548, 14.580131799736316, 0.10149708705032276], "isController": false}, {"data": ["Login Welcome", 10, 0, 0.0, 205.00000000000003, 55, 1391, 71.5, 1262.5000000000005, 1391.0, 1391.0, 0.167470525187567, 40.733443706876336, 0.38433177167068594], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9150, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
