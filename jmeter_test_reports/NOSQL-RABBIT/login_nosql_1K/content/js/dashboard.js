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

    var data = {"OkPercent": 99.98095238095237, "KoPercent": 0.01904761904761905};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9668095238095238, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.998, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.9995, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.706, 500, 1500, "Login"], "isController": false}, {"data": [0.841, 500, 1500, "Login-0"], "isController": false}, {"data": [0.9845, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.9885, 500, 1500, "Login-1"], "isController": false}, {"data": [0.997, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9395, 500, 1500, "Login-2"], "isController": false}, {"data": [0.9885, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.9975, 500, 1500, "Login-3"], "isController": false}, {"data": [0.997, 500, 1500, "Login-4"], "isController": false}, {"data": [0.9965, 500, 1500, "Login-5"], "isController": false}, {"data": [0.997, 500, 1500, "Login-6"], "isController": false}, {"data": [0.9855, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.996, 500, 1500, "Login-7"], "isController": false}, {"data": [0.9855, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.9955, 500, 1500, "Login-8"], "isController": false}, {"data": [0.939, 500, 1500, "Logout"], "isController": false}, {"data": [0.9965, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.996, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.9785, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 21000, 4, 0.01904761904761905, 134.25028571428612, 0, 5327, 19.0, 339.0, 484.0, 1447.9700000000048, 330.8910423067833, 27597.674684127076, 341.0687423678405], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 1000, 0, 0.0, 45.73799999999998, 4, 1913, 14.0, 138.89999999999998, 201.8499999999998, 318.97, 16.160832606095866, 1920.5034755890624, 9.737532927696435], "isController": false}, {"data": ["Login Welcome-0", 1000, 0, 0.0, 26.25499999999999, 2, 1207, 7.0, 75.79999999999995, 122.94999999999993, 226.99, 16.661112962345886, 42.84053752915695, 8.31428586304565], "isController": false}, {"data": ["Login", 1000, 2, 0.2, 909.5629999999999, 368, 5327, 483.0, 2216.899999999999, 3087.1499999999987, 5103.64, 16.034634811192173, 6233.684273656097, 90.7853933245811], "isController": false}, {"data": ["Login-0", 1000, 0, 0.0, 514.505, 245, 3003, 343.0, 933.4999999999999, 1317.0999999999988, 2175.55, 16.080014150412453, 6.8936779414365885, 11.77735411407162], "isController": false}, {"data": ["Logout-2", 1000, 0, 0.0, 63.323999999999984, 4, 2094, 13.0, 129.79999999999995, 213.5499999999994, 1207.7500000000002, 17.416141279738063, 2069.6804845605907, 10.493905439060923], "isController": false}, {"data": ["Login-1", 1000, 0, 0.0, 64.85799999999998, 3, 2129, 13.0, 173.89999999999998, 303.7999999999997, 677.3500000000006, 16.235084016559785, 76.4666115350272, 9.845690599886355], "isController": false}, {"data": ["Logout-1", 1000, 0, 0.0, 29.739000000000015, 1, 1712, 6.0, 77.0, 122.89999999999986, 265.62000000000035, 17.395539783599485, 46.17292688654629, 8.799696882719271], "isController": false}, {"data": ["Login-2", 1000, 0, 0.0, 304.2820000000004, 79, 4304, 122.0, 298.0, 1710.2499999999895, 3970.1100000000006, 16.217706491947908, 96.83111083180616, 9.328348753669255], "isController": false}, {"data": ["Logout-0", 1000, 0, 0.0, 72.28900000000004, 2, 2019, 16.0, 217.89999999999998, 305.94999999999993, 617.4800000000005, 17.37861040631191, 7.671027249661117, 9.809410952000277], "isController": false}, {"data": ["Login-3", 1000, 0, 0.0, 43.61000000000001, 4, 883, 14.0, 115.0, 207.79999999999973, 437.96000000000004, 16.228233881306696, 881.1265386394249, 10.079254637217831], "isController": false}, {"data": ["Login-4", 1000, 0, 0.0, 44.508999999999986, 4, 886, 15.0, 111.0, 216.8499999999998, 411.99, 16.228760609552246, 2476.2648036725686, 10.174672179035687], "isController": false}, {"data": ["Login-5", 1000, 1, 0.1, 43.75900000000001, 0, 850, 13.0, 121.79999999999995, 201.0, 436.7500000000002, 16.22849724115547, 345.88344515782217, 10.21182943342259], "isController": false}, {"data": ["Login-6", 1000, 0, 0.0, 46.27099999999998, 4, 952, 15.0, 114.0, 196.94999999999993, 440.93000000000006, 16.23271216154795, 1381.6828046880073, 10.097888327056685], "isController": false}, {"data": ["Logout-4", 1000, 0, 0.0, 59.31599999999996, 3, 2092, 12.0, 116.89999999999998, 214.79999999999973, 963.0300000000018, 17.416444606997928, 638.6086383388194, 10.460071712210668], "isController": false}, {"data": ["Login-7", 1000, 0, 0.0, 43.390000000000015, 3, 934, 13.0, 108.89999999999998, 189.74999999999966, 448.94000000000005, 16.228233881306696, 116.7830619837393, 10.126798291166972], "isController": false}, {"data": ["Logout-3", 1000, 0, 0.0, 62.183, 4, 2104, 13.0, 121.89999999999998, 219.89999999999986, 1295.7700000000002, 17.416444606997928, 1483.0510780779211, 10.324005738718498], "isController": false}, {"data": ["Login-8", 1000, 1, 0.1, 43.67799999999998, 4, 2013, 14.0, 96.89999999999998, 168.94999999999993, 405.96000000000004, 16.254612246224866, 928.8969766167244, 10.14897352123665], "isController": false}, {"data": ["Logout", 1000, 0, 0.0, 195.66200000000018, 10, 2943, 46.0, 509.9, 822.9499999999999, 2293.5700000000006, 17.37559077008618, 4235.33418690923, 49.80210831074506], "isController": false}, {"data": ["Login Welcome-3", 1000, 0, 0.0, 43.66599999999997, 4, 1519, 12.0, 118.89999999999998, 198.0, 409.8100000000002, 16.168671581942828, 592.856554577351, 9.710676780170742], "isController": false}, {"data": ["Login Welcome-2", 1000, 0, 0.0, 46.357, 4, 1758, 13.0, 127.89999999999998, 197.0, 373.99, 16.168410160228945, 1376.7780198548078, 9.584204069588838], "isController": false}, {"data": ["Login Welcome", 1000, 0, 0.0, 116.30199999999996, 8, 2522, 29.0, 265.69999999999993, 389.8499999999998, 2313.88, 16.085704634291503, 3912.486352284974, 36.91543544002445], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 25.0, 0.004761904761904762], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 25.0, 0.004761904761904762], "isController": false}, {"data": ["Assertion failed", 2, 50.0, 0.009523809523809525], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 21000, 4, "Assertion failed", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 1000, 2, "Assertion failed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-5", 1000, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 1000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
