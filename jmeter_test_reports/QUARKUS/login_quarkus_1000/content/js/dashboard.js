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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9986875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.9895, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.9895, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login-4"], "isController": false}, {"data": [1.0, 500, 1500, "Login-5"], "isController": false}, {"data": [1.0, 500, 1500, "Login-6"], "isController": false}, {"data": [1.0, 500, 1500, "Login-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-8"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 16000, 0, 0.0, 15.6644375000001, 0, 1187, 3.0, 80.0, 86.0, 97.0, 267.0895584675736, 18237.45849548243, 266.89393623236793], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 1000, 0, 0.0, 2.3990000000000076, 1, 15, 2.0, 3.0, 3.0, 6.0, 16.743967985533214, 1985.64819562815, 9.009693710965625], "isController": false}, {"data": ["Login Welcome-0", 1000, 0, 0.0, 1.3840000000000012, 1, 38, 1.0, 2.0, 2.0, 3.0, 16.719612104999165, 33.97803983447584, 8.343478306303293], "isController": false}, {"data": ["Login", 1000, 0, 0.0, 106.81299999999983, 71, 1187, 85.0, 97.0, 103.0, 1137.3100000000006, 16.83133320990356, 6516.958340740874, 97.9964927709424], "isController": false}, {"data": ["Login-0", 1000, 0, 0.0, 1.2510000000000014, 0, 18, 1.0, 2.0, 2.0, 5.980000000000018, 16.856584181781404, 3.3416861219742433, 10.74936471748365], "isController": false}, {"data": ["Login-1", 1000, 0, 0.0, 1.5250000000000004, 1, 45, 1.0, 2.0, 2.0, 4.0, 16.859141869678833, 81.89196451150637, 11.047347846244627], "isController": false}, {"data": ["Login-2", 1000, 0, 0.0, 103.04600000000005, 69, 1157, 82.0, 94.0, 99.0, 1081.4900000000005, 16.837567981680728, 100.53211976562106, 9.68489017696284], "isController": false}, {"data": ["Logout-0", 1000, 0, 0.0, 1.6529999999999998, 1, 10, 2.0, 2.0, 2.0, 4.0, 17.167087260304545, 34.88741073114625, 10.276781729069029], "isController": false}, {"data": ["Login-3", 1000, 0, 0.0, 4.115, 2, 73, 4.0, 5.0, 5.0, 10.0, 16.86056314280897, 910.365936788695, 11.048279168774236], "isController": false}, {"data": ["Login-4", 1000, 0, 0.0, 4.220000000000004, 2, 23, 4.0, 5.0, 5.0, 11.990000000000009, 16.86056314280897, 2568.4861585314447, 11.147071530939133], "isController": false}, {"data": ["Login-5", 1000, 0, 0.0, 4.028000000000003, 2, 83, 4.0, 5.0, 5.0, 13.0, 16.86226898691488, 355.5402829067179, 11.197600499123162], "isController": false}, {"data": ["Login-6", 1000, 0, 0.0, 4.115, 2, 67, 4.0, 5.0, 5.0, 11.990000000000009, 16.86113171916099, 1430.8744973275107, 11.0651176906994], "isController": false}, {"data": ["Login-7", 1000, 0, 0.0, 4.095999999999998, 2, 67, 4.0, 5.0, 5.0, 13.990000000000009, 16.861416021717503, 117.04193855700001, 11.098236717419528], "isController": false}, {"data": ["Login-8", 1000, 0, 0.0, 3.5410000000000035, 2, 17, 3.0, 4.0, 4.0, 8.0, 16.86283767832451, 960.2760288438839, 11.115640071161176], "isController": false}, {"data": ["Logout", 1000, 0, 0.0, 1.6529999999999998, 1, 10, 2.0, 2.0, 2.0, 4.0, 17.167087260304545, 34.88741073114625, 10.276781729069029], "isController": false}, {"data": ["Login Welcome-2", 1000, 0, 0.0, 2.35, 1, 16, 2.0, 3.0, 3.0, 7.0, 16.743967985533214, 609.6831936607338, 8.97699064849388], "isController": false}, {"data": ["Login Welcome", 1000, 0, 0.0, 4.441999999999996, 3, 101, 4.0, 5.0, 6.0, 11.0, 16.71877351077525, 2625.402556718439, 26.302679810409106], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 16000, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
