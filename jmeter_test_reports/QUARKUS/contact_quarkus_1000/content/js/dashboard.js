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

    var data = {"OkPercent": 99.94546941743161, "KoPercent": 0.05453058256839044};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.996637280741616, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [1.0, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [1.0, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.9815, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [1.0, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [1.0, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.998, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [1.0, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.9835, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [1.0, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [1.0, 500, 1500, "Send Email"], "isController": false}, {"data": [1.0, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11003, 6, 0.05453058256839044, 27.611924020721645, 0, 1990, 7.0, 92.0, 99.0, 128.0, 183.40778770502732, 13130.214529906072, 158.8753500466729], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 1000, 0, 0.0, 7.503, 2, 89, 7.0, 11.0, 12.0, 19.980000000000018, 16.76333523317799, 116.36111995842693, 8.5781129513528], "isController": false}, {"data": ["Show Contact Page-5", 1000, 0, 0.0, 7.816999999999992, 2, 37, 7.0, 12.0, 13.0, 19.99000000000001, 16.763616247296866, 1422.599109642432, 8.545515313563442], "isController": false}, {"data": ["Send Email-1", 3, 0, 0.0, 58.0, 3, 164, 7.0, 164.0, 164.0, 164.0, 18.29268292682927, 730.8736661585366, 9.467892530487804], "isController": false}, {"data": ["Show Contact Page", 1000, 3, 0.3, 124.4190000000001, 74, 1990, 95.0, 111.0, 134.89999999999986, 1421.3400000000006, 16.67055646317474, 6464.702913101599, 68.38200397801154], "isController": false}, {"data": ["Show Contact Page-4", 1000, 0, 0.0, 7.642000000000002, 2, 90, 7.0, 11.0, 12.0, 18.980000000000018, 16.765302529884153, 353.4957489479773, 8.677353848475196], "isController": false}, {"data": ["Show Contact Page-3", 1000, 0, 0.0, 8.267999999999994, 2, 65, 8.0, 12.0, 14.0, 22.0, 16.759402024535767, 2550.5225103646426, 8.625200065361668], "isController": false}, {"data": ["Show Contact Page-7", 1000, 2, 0.2, 5.8809999999999985, 0, 88, 5.0, 8.0, 9.0, 17.0, 16.768957306234697, 953.0758066916524, 8.58017107480632], "isController": false}, {"data": ["Show Contact Page-2", 1000, 0, 0.0, 7.627999999999995, 2, 92, 7.0, 11.0, 12.0, 20.960000000000036, 16.758278589623274, 905.7489536549806, 8.526428852728248], "isController": false}, {"data": ["Show Contact Page-1", 1000, 1, 0.1, 119.55800000000008, 72, 1763, 91.0, 106.0, 130.94999999999993, 1359.8400000000001, 16.736961906674697, 99.86412332839593, 8.817306123217515], "isController": false}, {"data": ["Show Contact Page-0", 1000, 0, 0.0, 3.0330000000000013, 1, 87, 3.0, 4.0, 4.0, 6.0, 16.693376068376068, 97.95946952624197, 8.362990159254807], "isController": false}, {"data": ["Send Email", 1000, 0, 0.0, 6.037, 2, 174, 6.0, 8.0, 9.0, 14.990000000000009, 17.228012748729434, 104.4404529890602, 11.433579281161167], "isController": false}, {"data": ["Send Email-0", 1000, 0, 0.0, 5.854000000000001, 2, 66, 6.0, 8.0, 9.0, 13.990000000000009, 17.228012748729434, 102.37544685158066, 11.406828753553278], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, 33.333333333333336, 0.018176860856130145], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, 16.666666666666668, 0.009088430428065073], "isController": false}, {"data": ["Assertion failed", 3, 50.0, 0.02726529128419522], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11003, 6, "Assertion failed", 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show Contact Page", 1000, 3, "Assertion failed", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show Contact Page-7", 1000, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Show Contact Page-1", 1000, 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
