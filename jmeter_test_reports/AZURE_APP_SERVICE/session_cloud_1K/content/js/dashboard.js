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

    var data = {"OkPercent": 91.66666666666667, "KoPercent": 8.333333333333334};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Session Test"], "isController": false}, {"data": [0.75, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.25, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.5, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.5, 500, 1500, "Login-0"], "isController": false}, {"data": [0.75, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome"], "isController": false}, {"data": [0.5, 500, 1500, "Login-2"], "isController": false}, {"data": [0.75, 500, 1500, "Login-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24, 2, 8.333333333333334, 1040.9583333333335, 209, 4914, 606.0, 2812.5, 4588.5, 4914.0, 0.3804933730737523, 30.88087064612531, 0.4679684527395523], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login-4", 2, 0, 0.0, 390.0, 304, 476, 390.0, 476.0, 476.0, 476.0, 0.03597704664424097, 1.3156567047723553, 0.029688090248421506], "isController": false}, {"data": ["Session Test", 2, 2, 100.0, 327.5, 258, 397, 327.5, 397.0, 397.0, 397.0, 0.03594665516373702, 0.025661137621769296, 0.02685467890650275], "isController": false}, {"data": ["Login Welcome-1", 2, 0, 0.0, 760.5, 345, 1176, 760.5, 1176.0, 1176.0, 1176.0, 0.03525968759916787, 4.186709136225803, 0.027477764359507773], "isController": false}, {"data": ["Login Welcome-0", 2, 0, 0.0, 2080.0, 548, 3612, 2080.0, 3612.0, 3612.0, 3612.0, 0.03327344113928263, 0.09702587425966594, 0.017156618087442604], "isController": false}, {"data": ["Login", 2, 0, 0.0, 1872.0, 1731, 2013, 1872.0, 2013.0, 2013.0, 2013.0, 0.03484684810258912, 8.479082090462418, 0.1451044534271875], "isController": false}, {"data": ["Login Welcome-3", 2, 0, 0.0, 893.5, 824, 963, 893.5, 963.0, 963.0, 963.0, 0.034879665155214505, 1.2755261924485524, 0.02711348971049878], "isController": false}, {"data": ["Login-0", 2, 0, 0.0, 1000.0, 764, 1236, 1000.0, 1236.0, 1236.0, 1236.0, 0.035444025023481665, 0.013291509383805624, 0.031913467843408296], "isController": false}, {"data": ["Login Welcome-2", 2, 0, 0.0, 623.5, 479, 768, 623.5, 768.0, 768.0, 768.0, 0.03517658646404953, 2.9919335690164623, 0.027069482552413114], "isController": false}, {"data": ["Login-1", 2, 0, 0.0, 258.0, 209, 307, 258.0, 307.0, 307.0, 307.0, 0.03603733467872716, 0.09319029514577103, 0.028611672943169124], "isController": false}, {"data": ["Login Welcome", 2, 0, 0.0, 3216.0, 1518, 4914, 3216.0, 4914.0, 4914.0, 4914.0, 0.032745014571531485, 7.966184121123809, 0.09305468008120764], "isController": false}, {"data": ["Login-2", 2, 0, 0.0, 604.0, 557, 651, 604.0, 651.0, 651.0, 651.0, 0.035753870356466086, 4.245388030051128, 0.02957375799992849], "isController": false}, {"data": ["Login-3", 2, 0, 0.0, 466.5, 372, 561, 466.5, 561.0, 561.0, 561.0, 0.035811488325454804, 3.045934948431457, 0.029271695047271167], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404", 2, 100.0, 8.333333333333334], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24, 2, "404", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Session Test", 2, 2, "404", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
