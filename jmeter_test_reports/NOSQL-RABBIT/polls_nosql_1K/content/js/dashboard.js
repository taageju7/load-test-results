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

    var data = {"OkPercent": 99.89047619047619, "KoPercent": 0.10952380952380952};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9940238095238095, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.979, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.966, 500, 1500, "Polls"], "isController": false}, {"data": [1.0, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [1.0, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [1.0, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [1.0, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [1.0, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.9725, 500, 1500, "Polls-2"], "isController": false}, {"data": [1.0, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.972, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.998, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [1.0, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.999, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.999, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.999, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [1.0, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.999, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.997, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.999, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.997, 500, 1500, "Polls-7"], "isController": false}, {"data": [0.998, 500, 1500, "Save Poll-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 21000, 23, 0.10952380952380952, 35.29942857142854, 0, 2742, 7.0, 94.0, 108.0, 128.0, 345.32658028020785, 32522.906213514605, 338.97792838995593], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 1000, 4, 0.4, 64.8399999999999, 20, 982, 37.5, 53.0, 210.0499999999987, 723.96, 17.297147700344212, 7295.8226273448445, 89.23098502931866], "isController": false}, {"data": ["Polls", 1000, 4, 0.4, 180.76800000000006, 89, 2742, 117.0, 137.0, 346.249999999999, 2323.820000000001, 16.45548790521639, 9304.717823736013, 76.34462548337996], "isController": false}, {"data": ["Save Poll-0", 1000, 0, 0.0, 13.865999999999975, 3, 445, 6.0, 10.0, 39.94999999999993, 263.9200000000001, 17.30552911655274, 6.202274595483257, 13.891743099420266], "isController": false}, {"data": ["Show New Poll Form-0", 1000, 0, 0.0, 6.29199999999999, 1, 307, 3.0, 5.0, 14.0, 92.98000000000002, 17.300140131135063, 28.551989083611577, 8.802122078438837], "isController": false}, {"data": ["Save Poll-2", 1000, 0, 0.0, 13.947999999999997, 3, 395, 7.0, 15.0, 31.899999999999864, 184.99, 17.348461191492316, 941.9502869001769, 10.775020818153429], "isController": false}, {"data": ["Save Poll-1", 1000, 0, 0.0, 25.223000000000024, 8, 384, 17.0, 25.0, 44.64999999999952, 262.99, 17.325317486442938, 765.0094774900813, 10.591453854016875], "isController": false}, {"data": ["Polls-0", 1000, 0, 0.0, 15.329000000000002, 3, 156, 14.0, 19.0, 20.0, 113.92000000000007, 16.755189920077743, 726.1067555616759, 8.361232469882546], "isController": false}, {"data": ["Polls-2", 1000, 0, 0.0, 154.89099999999993, 72, 2467, 98.0, 117.0, 230.64999999999952, 2101.2200000000007, 16.825103053756205, 100.45769538150921, 8.872612938504249], "isController": false}, {"data": ["Show New Poll Form", 1000, 0, 0.0, 6.29199999999999, 1, 307, 3.0, 5.0, 14.0, 92.98000000000002, 17.300140131135063, 28.551989083611577, 8.802122078438837], "isController": false}, {"data": ["Polls-1", 1000, 0, 0.0, 152.11000000000013, 70, 2391, 94.0, 113.0, 244.84999999999843, 2021.97, 16.546429280561256, 2295.511858619035, 8.968035401085446], "isController": false}, {"data": ["Save Poll-7", 1000, 2, 0.2, 15.020999999999972, 3, 517, 8.0, 16.0, 29.899999999999864, 213.92000000000007, 17.349665151462574, 990.5170017230387, 10.821853638224782], "isController": false}, {"data": ["Polls-4", 1000, 0, 0.0, 7.356000000000008, 3, 412, 6.0, 9.0, 10.0, 27.980000000000018, 16.8503353216729, 2571.107756841236, 8.671998744650018], "isController": false}, {"data": ["Polls-3", 1000, 1, 0.1, 5.293000000000002, 0, 161, 4.0, 6.0, 8.0, 51.99000000000001, 16.849199663016005, 913.9556128896377, 8.564115811920809], "isController": false}, {"data": ["Polls-6", 1000, 1, 0.1, 7.378999999999993, 0, 251, 5.0, 8.0, 11.0, 77.91000000000008, 16.8503353216729, 1432.846921417408, 8.58113199499545], "isController": false}, {"data": ["Save Poll-4", 1000, 1, 0.1, 13.87500000000003, 3, 408, 7.0, 15.0, 27.0, 188.99, 17.348461191492316, 369.771607508414, 10.916570030316436], "isController": false}, {"data": ["Polls-5", 1000, 0, 0.0, 4.939999999999993, 1, 257, 3.0, 6.0, 7.0, 27.980000000000018, 16.851187166135855, 359.4865074650759, 8.721805857472658], "isController": false}, {"data": ["Save Poll-3", 1000, 1, 0.1, 15.181999999999983, 4, 397, 9.0, 17.0, 30.949999999999932, 202.92000000000007, 17.34816022760786, 2644.4681257372968, 10.86560678443176], "isController": false}, {"data": ["Polls-8", 1000, 3, 0.3, 5.434, 0, 427, 4.0, 6.0, 7.0, 29.99000000000001, 16.865112827604815, 961.8942492863949, 8.62072429862212], "isController": false}, {"data": ["Save Poll-6", 1000, 1, 0.1, 13.44800000000001, 3, 402, 7.0, 16.0, 26.899999999999864, 186.92000000000007, 17.34816022760786, 124.76437674565862, 10.814832920953108], "isController": false}, {"data": ["Polls-7", 1000, 3, 0.3, 4.155999999999995, 0, 284, 3.0, 5.0, 6.0, 17.99000000000001, 16.861700333861666, 121.06177204878091, 8.60256287306512], "isController": false}, {"data": ["Save Poll-5", 1000, 2, 0.2, 15.644999999999985, 4, 581, 9.0, 17.0, 35.74999999999966, 194.96000000000004, 17.34816022760786, 1473.7409843779817, 10.770191903179917], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 8, 34.78260869565217, 0.0380952380952381], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, 17.391304347826086, 0.01904761904761905], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 3, 13.043478260869565, 0.014285714285714285], "isController": false}, {"data": ["Assertion failed", 8, 34.78260869565217, 0.0380952380952381], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 21000, 23, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 8, "Assertion failed", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 3, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Save Poll", 1000, 4, "Assertion failed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls", 1000, 4, "Assertion failed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-7", 1000, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-3", 1000, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-6", 1000, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-4", 1000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-3", 1000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-8", 1000, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-6", 1000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-7", 1000, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-5", 1000, 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 2, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
