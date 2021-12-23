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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8947727272727273, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.938, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.9455, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.662, 500, 1500, "Registration"], "isController": false}, {"data": [0.795, 500, 1500, "Welcome"], "isController": false}, {"data": [0.9435, 500, 1500, "Registration-3"], "isController": false}, {"data": [0.953, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.9465, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.9425, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.9165, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.9365, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.8635, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11000, 0, 0.0, 311.1741818181824, 11, 5869, 133.0, 799.0, 1215.949999999999, 2339.99, 175.79467182331038, 15646.880693350167, 180.1645677848273], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 1000, 0, 0.0, 216.16600000000017, 12, 2409, 105.0, 544.6999999999999, 759.4999999999993, 1197.7200000000003, 16.337199803953602, 599.0359775771933, 9.81189246038229], "isController": false}, {"data": ["Registration-4", 1000, 0, 0.0, 206.9649999999999, 11, 1831, 109.0, 523.9, 665.5499999999994, 1084.93, 16.305233980107616, 597.8638869639655, 10.572925158976032], "isController": false}, {"data": ["Registration", 1000, 0, 0.0, 893.352, 53, 5869, 373.0, 2291.2999999999997, 2778.699999999998, 3726.4000000000005, 16.268627578577473, 3985.114714160213, 54.255237481291076], "isController": false}, {"data": ["Welcome", 1000, 0, 0.0, 488.482, 27, 3757, 219.0, 1265.6999999999998, 1588.249999999999, 2231.87, 16.199578810950918, 3962.078431273287, 37.28750708731573], "isController": false}, {"data": ["Registration-3", 1000, 0, 0.0, 207.46500000000003, 12, 1705, 102.5, 524.9, 689.0, 1084.97, 16.31481058504911, 1389.2443591542403, 10.451675531047085], "isController": false}, {"data": ["Welcome-0", 1000, 0, 0.0, 185.14900000000006, 11, 2736, 84.0, 482.69999999999993, 661.7999999999997, 1050.89, 16.30231003733229, 63.951542402308405, 8.24667636654114], "isController": false}, {"data": ["Registration-2", 1000, 0, 0.0, 202.963, 13, 2781, 97.5, 507.5999999999999, 676.7499999999997, 1259.93, 16.30895687911801, 1938.1061070927653, 10.607192657707612], "isController": false}, {"data": ["Welcome-1", 1000, 0, 0.0, 206.8310000000001, 13, 2139, 99.0, 530.6999999999999, 726.9499999999999, 1157.7700000000002, 16.269686320447743, 1933.4393150868802, 9.803121542691658], "isController": false}, {"data": ["Registration-1", 1000, 0, 0.0, 253.8100000000001, 13, 2458, 83.5, 678.9, 967.0, 1598.5100000000004, 16.324398445917268, 64.11790092722583, 10.218690824055633], "isController": false}, {"data": ["Welcome-2", 1000, 0, 0.0, 212.21099999999987, 13, 1989, 100.5, 558.6999999999999, 770.7999999999997, 1090.7700000000002, 16.261484673550694, 1384.7035328075453, 9.639376168794211], "isController": false}, {"data": ["Registration-0", 1000, 0, 0.0, 349.5220000000002, 21, 3085, 139.0, 912.0, 1265.249999999999, 1800.7800000000002, 16.36875531984548, 6.106313019707981, 12.596268742224842], "isController": false}]}, function(index, item){
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
