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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Welcome-3"], "isController": false}, {"data": [1.0, 500, 1500, "Registration-4"], "isController": false}, {"data": [1.0, 500, 1500, "Registration"], "isController": false}, {"data": [1.0, 500, 1500, "Welcome"], "isController": false}, {"data": [1.0, 500, 1500, "Registration-3"], "isController": false}, {"data": [1.0, 500, 1500, "Welcome-0"], "isController": false}, {"data": [1.0, 500, 1500, "Registration-2"], "isController": false}, {"data": [1.0, 500, 1500, "Welcome-1"], "isController": false}, {"data": [1.0, 500, 1500, "Registration-1"], "isController": false}, {"data": [1.0, 500, 1500, "Welcome-2"], "isController": false}, {"data": [1.0, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11000, 0, 0.0, 9.314727272727264, 2, 408, 6.0, 16.0, 21.0, 46.0, 184.51112937584918, 16422.70267918547, 189.09769864300452], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 1000, 0, 0.0, 6.456999999999994, 3, 78, 5.0, 10.0, 12.0, 37.960000000000036, 16.86596616687187, 618.4242496753302, 10.129462102174024], "isController": false}, {"data": ["Registration-4", 1000, 0, 0.0, 6.362999999999997, 3, 212, 4.0, 10.0, 11.0, 24.99000000000001, 17.07971101128969, 626.2616302157168, 11.075125108883158], "isController": false}, {"data": ["Registration", 1000, 0, 0.0, 23.608999999999988, 12, 276, 17.0, 33.0, 37.0, 233.92000000000007, 17.063099341364367, 4179.726158584445, 56.904769776132134], "isController": false}, {"data": ["Welcome", 1000, 0, 0.0, 16.292999999999992, 7, 408, 10.0, 22.0, 24.0, 132.82000000000016, 16.77796047112513, 4103.538498078924, 38.61880159222845], "isController": false}, {"data": ["Registration-3", 1000, 0, 0.0, 6.980000000000007, 3, 229, 5.0, 11.0, 13.0, 23.960000000000036, 17.07650273224044, 1454.1042307035518, 10.93963456284153], "isController": false}, {"data": ["Welcome-0", 1000, 0, 0.0, 5.421, 2, 125, 4.0, 7.0, 8.0, 17.99000000000001, 16.77993120228207, 65.82517933551472, 8.488285510529407], "isController": false}, {"data": ["Registration-2", 1000, 0, 0.0, 7.626999999999981, 3, 220, 5.0, 11.0, 13.0, 32.97000000000003, 17.07650273224044, 2029.318887679303, 11.106397284836065], "isController": false}, {"data": ["Welcome-1", 1000, 0, 0.0, 7.733999999999986, 4, 106, 6.0, 12.0, 14.0, 54.86000000000013, 16.86084742619164, 2003.6910766072604, 10.15931920113305], "isController": false}, {"data": ["Registration-1", 1000, 0, 0.0, 5.8799999999999955, 3, 80, 5.0, 8.0, 10.0, 21.99000000000001, 17.07212974818609, 67.05479086641058, 10.686753094323516], "isController": false}, {"data": ["Welcome-2", 1000, 0, 0.0, 7.620999999999999, 4, 103, 6.0, 12.0, 14.0, 36.98000000000002, 16.863406408094434, 1435.95857925801, 9.996179384485666], "isController": false}, {"data": ["Registration-0", 1000, 0, 0.0, 8.477000000000007, 4, 196, 6.0, 11.0, 12.0, 93.91000000000008, 17.065720088059116, 6.366313548475178, 13.13260491151424], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11000, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
