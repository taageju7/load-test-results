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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9999, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9998, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.99995, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.99995, 500, 1500, "Registration"], "isController": false}, {"data": [0.99975, 500, 1500, "Welcome"], "isController": false}, {"data": [0.99995, 500, 1500, "Registration-3"], "isController": false}, {"data": [1.0, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.99995, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.99975, 500, 1500, "Welcome-1"], "isController": false}, {"data": [1.0, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.9998, 500, 1500, "Welcome-2"], "isController": false}, {"data": [1.0, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 110000, 0, 0.0, 5.447845454545388, 2, 606, 4.0, 11.0, 12.0, 18.0, 275.1348160598693, 24488.806155641265, 281.92525274884696], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 10000, 0, 0.0, 4.708500000000004, 2, 584, 4.0, 4.0, 4.0, 7.0, 25.0197030161252, 917.3972550258328, 15.026481791911129], "isController": false}, {"data": ["Registration-4", 10000, 0, 0.0, 3.576700000000012, 2, 595, 3.0, 4.0, 4.0, 6.0, 25.059579149427766, 918.8593928941058, 16.249570854707066], "isController": false}, {"data": ["Registration", 10000, 0, 0.0, 12.881900000000055, 9, 606, 12.0, 14.0, 14.0, 21.0, 25.057820921777, 6138.089422592632, 83.54238342475261], "isController": false}, {"data": ["Welcome", 10000, 0, 0.0, 8.84799999999998, 6, 588, 8.0, 8.0, 9.0, 15.0, 25.01300676351703, 6117.6587215977315, 57.57388373204066], "isController": false}, {"data": ["Registration-3", 10000, 0, 0.0, 4.178900000000034, 3, 597, 4.0, 5.0, 5.0, 6.0, 25.059579149427766, 2133.8818979624057, 16.053792892602164], "isController": false}, {"data": ["Welcome-0", 10000, 0, 0.0, 2.905299999999994, 2, 42, 3.0, 3.0, 4.0, 4.0, 25.013319592683104, 98.12353984746878, 12.65322221582993], "isController": false}, {"data": ["Registration-2", 10000, 0, 0.0, 4.183199999999987, 3, 593, 4.0, 5.0, 5.0, 6.0, 25.060207147672283, 2978.0776831963794, 16.298923789404043], "isController": false}, {"data": ["Welcome-1", 10000, 0, 0.0, 5.297999999999992, 3, 572, 4.0, 5.0, 5.0, 8.0, 25.019390027271136, 2973.2271025669893, 15.0751598113538], "isController": false}, {"data": ["Registration-1", 10000, 0, 0.0, 3.439699999999998, 2, 126, 3.0, 4.0, 4.0, 6.0, 25.059013977918, 98.42515060467402, 15.686355429536558], "isController": false}, {"data": ["Welcome-2", 10000, 0, 0.0, 5.370399999999987, 3, 580, 4.0, 5.0, 5.0, 9.0, 25.019452624415482, 2130.4650303110666, 14.830866936543162], "isController": false}, {"data": ["Registration-0", 10000, 0, 0.0, 4.535699999999965, 3, 252, 4.0, 5.0, 5.0, 8.0, 25.058260455559175, 9.347905755882428, 19.25864353371589], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 110000, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
