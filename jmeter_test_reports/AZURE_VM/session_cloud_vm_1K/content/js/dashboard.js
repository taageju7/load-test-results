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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9945182724252492, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.976, 500, 1500, "Session Test"], "isController": false}, {"data": [0.5, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.75, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [0.9985, 500, 1500, "Session Test-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.75, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.9965, 500, 1500, "Session Test-5"], "isController": false}, {"data": [0.75, 500, 1500, "Login-5"], "isController": false}, {"data": [0.999, 500, 1500, "Session Test-6"], "isController": false}, {"data": [1.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.9965, 500, 1500, "Session Test-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.999, 500, 1500, "Session Test-1"], "isController": false}, {"data": [0.9965, 500, 1500, "Session Test-2"], "isController": false}, {"data": [0.9955, 500, 1500, "Session Test-3"], "isController": false}, {"data": [0.999, 500, 1500, "Session Test-4"], "isController": false}, {"data": [0.75, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.5, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.5, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9030, 0, 0.0, 116.59346622369846, 48, 4989, 86.0, 224.0, 267.0, 497.83000000000357, 43.68650217706821, 3724.150688271045, 44.77284409772618], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Session Test", 1000, 0, 0.0, 286.22500000000014, 198, 4989, 244.5, 360.9, 464.99999999999864, 908.8700000000001, 4.9487556353954805, 1898.4754807329477, 22.820336045251423], "isController": false}, {"data": ["Login Welcome-1", 2, 0, 0.0, 969.5, 224, 1715, 969.5, 1715.0, 1715.0, 1715.0, 0.033753565220326395, 4.011169529390917, 0.020403766475959022], "isController": false}, {"data": ["Login Welcome-0", 2, 0, 0.0, 428.5, 110, 747, 428.5, 747.0, 747.0, 747.0, 0.03343195760827775, 0.08596322693612825, 0.01674862720024071], "isController": false}, {"data": ["Login", 2, 0, 0.0, 1083.0, 680, 1486, 1083.0, 1486.0, 1486.0, 1486.0, 0.034683684794672584, 13.48639857623474, 0.19665378312291898], "isController": false}, {"data": ["Session Test-0", 1000, 0, 0.0, 75.22199999999997, 52, 690, 66.0, 96.0, 108.94999999999993, 283.83000000000015, 4.952677169644051, 1.783302342987752, 2.834246895909584], "isController": false}, {"data": ["Login-0", 2, 0, 0.0, 375.5, 279, 472, 375.5, 472.0, 472.0, 472.0, 0.03492656689310724, 0.01504161718736357, 0.02534222578279168], "isController": false}, {"data": ["Login-1", 2, 0, 0.0, 67.5, 56, 79, 67.5, 79.0, 79.0, 79.0, 0.03516792685071215, 0.16563956171971164, 0.02139611174608757], "isController": false}, {"data": ["Login-2", 2, 0, 0.0, 560.0, 174, 946, 560.0, 946.0, 946.0, 946.0, 0.035100651117078226, 0.20957556731427368, 0.02018972998824128], "isController": false}, {"data": ["Login-3", 2, 0, 0.0, 99.5, 90, 109, 99.5, 109.0, 109.0, 109.0, 0.03515247385534757, 1.9086351502768257, 0.021901638984093506], "isController": false}, {"data": ["Login-4", 2, 0, 0.0, 207.0, 155, 259, 207.0, 259.0, 259.0, 259.0, 0.0351123595505618, 5.357618010445927, 0.022082382373595506], "isController": false}, {"data": ["Session Test-5", 1000, 0, 0.0, 103.60399999999994, 61, 2116, 89.0, 136.0, 174.94999999999993, 372.84000000000015, 4.951941408629254, 421.4940632025567, 2.8531693663000577], "isController": false}, {"data": ["Login-5", 2, 0, 0.0, 349.5, 90, 609, 349.5, 609.0, 609.0, 609.0, 0.03515185601799775, 0.7498948190558211, 0.022210205901996623], "isController": false}, {"data": ["Session Test-6", 1000, 0, 0.0, 90.00199999999997, 50, 641, 83.0, 112.0, 134.0, 283.5600000000004, 4.951769762513122, 35.63296422532038, 2.8627418939528986], "isController": false}, {"data": ["Login-6", 2, 0, 0.0, 226.5, 202, 251, 226.5, 251.0, 251.0, 251.0, 0.035052666631614, 2.983584398058082, 0.021873685525001314], "isController": false}, {"data": ["Session Test-7", 1000, 0, 0.0, 106.21300000000005, 55, 2070, 91.0, 147.0, 201.0, 383.93000000000006, 4.951818803046359, 283.2488567875199, 2.8676060060610262], "isController": false}, {"data": ["Login-7", 2, 0, 0.0, 139.0, 109, 169, 139.0, 169.0, 169.0, 169.0, 0.03510188321603454, 0.2526032982607017, 0.02197295619284975], "isController": false}, {"data": ["Login-8", 2, 0, 0.0, 167.0, 105, 229, 167.0, 229.0, 229.0, 229.0, 0.0350809492904878, 2.006671409903352, 0.021994110785637858], "isController": false}, {"data": ["Session Test-1", 1000, 0, 0.0, 66.42800000000013, 48, 698, 58.0, 85.0, 96.0, 205.0, 4.952750757770866, 27.43745082073271, 2.800432313231769], "isController": false}, {"data": ["Session Test-2", 1000, 0, 0.0, 97.49299999999994, 57, 1277, 85.0, 120.0, 154.8499999999998, 376.41000000000054, 4.952235686800806, 268.88482364933964, 2.848502753443042], "isController": false}, {"data": ["Session Test-3", 1000, 0, 0.0, 121.34299999999985, 63, 4867, 94.0, 160.0, 214.0, 397.9200000000001, 4.952113066645538, 755.6165763782968, 2.8774485104043896], "isController": false}, {"data": ["Session Test-4", 1000, 0, 0.0, 90.66100000000003, 51, 729, 84.0, 116.89999999999998, 144.0, 267.85000000000014, 4.95189236566754, 105.63721589291285, 2.8918277682316296], "isController": false}, {"data": ["Login Welcome-3", 2, 0, 0.0, 759.0, 189, 1329, 759.0, 1329.0, 1329.0, 1329.0, 0.033773514809686246, 1.238373203671181, 0.020349861950758216], "isController": false}, {"data": ["Login Welcome-2", 2, 0, 0.0, 939.5, 283, 1596, 939.5, 1596.0, 1596.0, 1596.0, 0.03371998920960345, 2.871336112422444, 0.020054173270164555], "isController": false}, {"data": ["Login Welcome", 2, 0, 0.0, 1453.0, 395, 2511, 1453.0, 2511.0, 2511.0, 2511.0, 0.03327344113928263, 8.09301720444866, 0.07661989668596526], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9030, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
