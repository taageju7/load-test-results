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

    var data = {"OkPercent": 99.95001428163381, "KoPercent": 0.04998571836618109};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9942159383033419, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.992, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.976, 500, 1500, "Polls"], "isController": false}, {"data": [0.992, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [1.0, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [1.0, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [1.0, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.9995, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.9825, 500, 1500, "Polls-2"], "isController": false}, {"data": [1.0, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.981, 500, 1500, "Polls-1"], "isController": false}, {"data": [1.0, 500, 1500, "Polls-4"], "isController": false}, {"data": [1.0, 500, 1500, "Polls-3"], "isController": false}, {"data": [1.0, 500, 1500, "Polls-6"], "isController": false}, {"data": [1.0, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.998, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.998, 500, 1500, "Polls-7"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14004, 7, 0.04998571836618109, 36.34690088546116, 0, 1922, 4.0, 95.0, 104.0, 395.8000000000029, 233.71941653593245, 18168.9384998039, 196.10772743582896], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 1000, 0, 0.0, 37.264000000000024, 9, 1544, 12.0, 22.0, 49.34999999999911, 1177.940000000001, 17.31152081710378, 196.11839863022593, 12.278568066735913], "isController": false}, {"data": ["Polls", 1000, 3, 0.3, 142.59000000000023, 81, 1922, 99.5, 118.0, 321.89999999999986, 1478.3700000000015, 16.693654741832628, 8878.258066686978, 77.66302266789643], "isController": false}, {"data": ["Save Poll-0", 1000, 0, 0.0, 37.21199999999998, 9, 1544, 12.0, 22.0, 41.74999999999966, 1177.940000000001, 17.31152081710378, 193.90641229550766, 12.239786202717909], "isController": false}, {"data": ["Show New Poll Form-0", 1000, 0, 0.0, 2.9429999999999965, 0, 241, 1.0, 2.0, 3.0, 58.930000000000064, 17.307625739901003, 20.07955017480702, 8.89044056561321], "isController": false}, {"data": ["Save Poll-2", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 9491.048177083334, 93.42447916666667], "isController": false}, {"data": ["Save Poll-1", 3, 0, 0.0, 16.0, 7, 31, 10.0, 31.0, 31.0, 31.0, 4.716981132075471, 111.36651189072327, 2.6410180817610063], "isController": false}, {"data": ["Polls-0", 1000, 0, 0.0, 8.033, 3, 1202, 4.0, 10.0, 13.0, 77.95000000000005, 16.71877351077525, 184.44302777510742, 8.522656027953788], "isController": false}, {"data": ["Polls-2", 1000, 0, 0.0, 126.7530000000002, 71, 1730, 93.0, 111.89999999999998, 247.6999999999996, 1255.4300000000005, 16.732481092296364, 99.90467714677732, 8.823769326015661], "isController": false}, {"data": ["Show New Poll Form", 1000, 0, 0.0, 2.9429999999999965, 0, 241, 1.0, 2.0, 3.0, 58.930000000000064, 17.307625739901003, 20.07955017480702, 8.89044056561321], "isController": false}, {"data": ["Polls-1", 1000, 0, 0.0, 126.25799999999997, 64, 1775, 87.0, 107.0, 225.79999999999973, 1295.88, 16.733321062231223, 2321.457294472984, 9.069329286658522], "isController": false}, {"data": ["Polls-4", 1000, 0, 0.0, 4.897000000000002, 1, 210, 3.0, 7.0, 10.0, 58.97000000000003, 16.756874507766813, 2552.6905518457697, 8.623899282805771], "isController": false}, {"data": ["Polls-3", 1000, 0, 0.0, 4.232000000000001, 1, 117, 3.0, 7.0, 9.0, 28.0, 16.756874507766813, 905.6730660472209, 8.525714471236824], "isController": false}, {"data": ["Polls-6", 1000, 0, 0.0, 4.581999999999997, 1, 147, 3.0, 7.0, 10.0, 44.950000000000045, 16.759121151686802, 1422.2176454691717, 8.543223868340345], "isController": false}, {"data": ["Polls-5", 1000, 0, 0.0, 4.245999999999995, 1, 151, 3.0, 6.0, 10.0, 32.97000000000003, 16.758840288252053, 353.35949283559574, 8.674009133567957], "isController": false}, {"data": ["Polls-8", 1000, 2, 0.2, 3.2819999999999965, 0, 61, 3.0, 4.0, 7.0, 31.88000000000011, 16.775427354011843, 953.443536532687, 8.583481603646979], "isController": false}, {"data": ["Polls-7", 1000, 2, 0.2, 3.712999999999993, 0, 109, 3.0, 5.0, 7.0, 30.920000000000073, 16.762492247347335, 116.18310914373, 8.560526216537875], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, 42.857142857142854, 0.021422450728363324], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, 14.285714285714286, 0.007140816909454442], "isController": false}, {"data": ["Assertion failed", 3, 42.857142857142854, 0.021422450728363324], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14004, 7, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "Assertion failed", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Polls", 1000, 3, "Assertion failed", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-8", 1000, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-7", 1000, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
