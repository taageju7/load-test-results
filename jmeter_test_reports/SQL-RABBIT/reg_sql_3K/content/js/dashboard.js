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

    var data = {"OkPercent": 98.40055843879935, "KoPercent": 1.5994415612006434};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03550942365473914, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.036166666666666666, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.014247401944351324, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.005, 500, 1500, "Registration"], "isController": false}, {"data": [0.02033333333333333, 500, 1500, "Welcome"], "isController": false}, {"data": [0.014917867918203152, 500, 1500, "Registration-3"], "isController": false}, {"data": [0.05466666666666667, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.014415018437814281, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.0385, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.017666666666666667, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.03883333333333333, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.1355, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32949, 527, 1.5994415612006434, 34503.072961242775, 11, 136595, 42757.0, 83280.5, 94324.25000000001, 109515.57000000007, 145.92633928571428, 12737.272820505155, 147.41207304454986], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 3000, 0, 0.0, 32561.002999999986, 14, 58729, 39271.0, 51980.200000000004, 53823.35, 55784.78, 18.62821802466376, 683.0407247773928, 11.187845786297084], "isController": false}, {"data": ["Registration-4", 2983, 119, 3.989272544418371, 27594.198122695216, 26, 60321, 24867.0, 48638.799999999996, 53508.2, 55934.079999999994, 13.272052607693608, 468.7563479734314, 8.26277596348072], "isController": false}, {"data": ["Registration", 3000, 163, 5.433333333333334, 75553.96933333343, 301, 136595, 79993.5, 104891.5, 112705.09999999999, 128680.73, 13.339143271291496, 3131.36320555731, 43.29423464859139], "isController": false}, {"data": ["Welcome", 3000, 0, 0.0, 54910.58899999989, 31, 104412, 61588.5, 92660.2, 96264.85, 100441.73, 18.294356191115043, 4474.417200887276, 42.10917728755678], "isController": false}, {"data": ["Registration-3", 2983, 117, 3.922225947033188, 27585.7717063359, 28, 65377, 24828.0, 48513.6, 53265.6, 55666.64, 13.27299748155663, 1087.3950350221032, 8.169506589778502], "isController": false}, {"data": ["Welcome-0", 3000, 0, 0.0, 21449.443000000014, 11, 46928, 21239.0, 39888.8, 41554.149999999994, 43593.62999999999, 28.384899233607722, 111.34974630996311, 14.358767385750781], "isController": false}, {"data": ["Registration-2", 2983, 111, 3.72108615487764, 27705.343278578603, 29, 61262, 24984.0, 48552.4, 53206.999999999985, 55996.87999999999, 13.275301175329213, 1520.3137803358766, 8.312847959306284], "isController": false}, {"data": ["Welcome-1", 3000, 0, 0.0, 32571.22833333332, 14, 58949, 39158.5, 51994.6, 53916.75, 55771.89, 18.577231744773606, 2207.6608923728077, 11.193507799341127], "isController": false}, {"data": ["Registration-1", 3000, 17, 0.5666666666666667, 32743.807333333203, 29, 65030, 32702.5, 50838.4, 53486.549999999996, 56541.89, 13.956863985708171, 54.76471253367093, 8.687161945854346], "isController": false}, {"data": ["Welcome-2", 3000, 0, 0.0, 32606.51233333335, 16, 58496, 39401.5, 51967.8, 53919.85, 56050.25999999998, 18.307753333536752, 1558.94810514753, 10.852349876422664], "isController": false}, {"data": ["Registration-0", 3000, 0, 0.0, 14135.068333333335, 61, 61975, 3393.0, 46442.5, 51373.9, 55441.619999999995, 15.836984638124902, 5.9079376286755, 12.187054584807052], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 381, 72.29601518026566, 1.156332513885095], "isController": false}, {"data": ["Assertion failed", 146, 27.703984819734345, 0.4431090473155483], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32949, 527, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 381, "Assertion failed", 146, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Registration-4", 2983, 119, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 119, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration", 3000, 163, "Assertion failed", 146, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 17, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-3", 2983, 117, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 117, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-2", 2983, 111, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 111, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-1", 3000, 17, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 17, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
