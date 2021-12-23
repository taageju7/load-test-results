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

    var data = {"OkPercent": 99.97619047619048, "KoPercent": 0.023809523809523808};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9785952380952381, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9975, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.9995, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.7325, 500, 1500, "Login"], "isController": false}, {"data": [0.924, 500, 1500, "Login-0"], "isController": false}, {"data": [0.997, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.9985, 500, 1500, "Login-1"], "isController": false}, {"data": [0.9985, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9465, 500, 1500, "Login-2"], "isController": false}, {"data": [0.9975, 500, 1500, "Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-3"], "isController": false}, {"data": [0.9985, 500, 1500, "Login-4"], "isController": false}, {"data": [0.9985, 500, 1500, "Login-5"], "isController": false}, {"data": [0.9985, 500, 1500, "Login-6"], "isController": false}, {"data": [0.9995, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.9985, 500, 1500, "Login-7"], "isController": false}, {"data": [0.998, 500, 1500, "Logout-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.9895, 500, 1500, "Logout"], "isController": false}, {"data": [0.9935, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.998, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.9865, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 21000, 5, 0.023809523809523808, 83.91604761904763, 1, 4753, 6.0, 298.0, 435.0, 704.0, 335.2383384949395, 27954.55334854211, 345.5114666976629], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 1000, 0, 0.0, 21.18700000000003, 4, 1582, 6.0, 19.0, 91.89999999999986, 247.99, 16.2348204428859, 1929.2959617913502, 9.782113489512307], "isController": false}, {"data": ["Login Welcome-0", 1000, 0, 0.0, 10.313999999999998, 2, 672, 3.0, 12.0, 31.949999999999932, 128.99, 16.692540103827596, 42.921345794314526, 8.329968743218656], "isController": false}, {"data": ["Login", 1000, 1, 0.1, 712.3539999999994, 354, 4753, 486.0, 1054.1999999999996, 2266.85, 4608.99, 16.214025131738953, 6300.528143367451, 91.78162684941225], "isController": false}, {"data": ["Login-0", 1000, 0, 0.0, 420.0050000000003, 243, 2276, 342.5, 590.0, 956.7999999999984, 1651.99, 16.23824756832243, 6.961514338372603, 11.893247730704903], "isController": false}, {"data": ["Logout-2", 1000, 0, 0.0, 16.85400000000002, 4, 684, 6.0, 20.0, 39.94999999999993, 324.18000000000075, 17.509761692143368, 2080.8060454640963, 10.55031539458248], "isController": false}, {"data": ["Login-1", 1000, 0, 0.0, 12.787999999999993, 2, 666, 3.0, 9.0, 19.949999999999932, 337.9000000000001, 16.327596904287628, 76.90234362244064, 9.901794606994741], "isController": false}, {"data": ["Logout-1", 1000, 0, 0.0, 7.620000000000004, 1, 648, 2.0, 8.899999999999977, 21.949999999999932, 116.93000000000006, 17.48618591312863, 46.41352862488634, 8.845551077149052], "isController": false}, {"data": ["Login-2", 1000, 1, 0.1, 274.1399999999997, 77, 4257, 132.0, 306.9, 841.4499999999979, 3476.3400000000006, 16.306297492091446, 97.32935969246323, 9.369926575799823], "isController": false}, {"data": ["Logout-0", 1000, 0, 0.0, 11.540000000000003, 2, 688, 3.0, 12.0, 29.0, 180.94000000000005, 17.478239591708324, 7.715004194777502, 9.865646957038487], "isController": false}, {"data": ["Login-3", 1000, 0, 0.0, 18.21300000000002, 3, 418, 6.0, 20.0, 70.54999999999939, 301.98, 16.328396714726583, 886.564969670003, 10.141465147037213], "isController": false}, {"data": ["Login-4", 1000, 1, 0.1, 21.529999999999983, 4, 522, 7.0, 22.899999999999977, 77.69999999999959, 413.8800000000001, 16.327330318219666, 2488.857840741179, 10.22623429514915], "isController": false}, {"data": ["Login-5", 1000, 1, 0.1, 17.784, 3, 563, 6.0, 19.0, 52.899999999999864, 303.99, 16.328396714726583, 348.02957072645034, 10.274691469841452], "isController": false}, {"data": ["Login-6", 1000, 1, 0.1, 18.90400000000001, 4, 565, 7.0, 22.0, 56.74999999999966, 317.8700000000001, 16.327063740856843, 1388.3681182701885, 10.146425061838753], "isController": false}, {"data": ["Logout-4", 1000, 0, 0.0, 14.414, 3, 572, 5.0, 18.0, 37.0, 285.7500000000002, 17.509761692143368, 642.0302951708078, 10.516116641277513], "isController": false}, {"data": ["Login-7", 1000, 0, 0.0, 20.238, 3, 639, 6.0, 21.0, 73.89999999999986, 413.7800000000002, 16.328663335619346, 117.50578136736227, 10.1894686244734], "isController": false}, {"data": ["Logout-3", 1000, 0, 0.0, 15.103999999999992, 4, 646, 6.0, 20.0, 37.94999999999993, 300.7700000000011, 17.51006828926633, 1491.0233540535808, 10.379503370688147], "isController": false}, {"data": ["Login-8", 1000, 0, 0.0, 15.167999999999992, 3, 427, 5.0, 16.0, 34.94999999999993, 354.74000000000024, 16.42386716376238, 939.4644484865406, 10.264916977351486], "isController": false}, {"data": ["Logout", 1000, 0, 0.0, 42.01899999999995, 9, 1002, 13.0, 54.0, 156.89999999999986, 715.94, 17.475796022508828, 4259.759412900633, 50.08931770123379], "isController": false}, {"data": ["Login Welcome-3", 1000, 0, 0.0, 25.923000000000002, 3, 1684, 5.0, 17.899999999999977, 86.44999999999925, 446.82000000000016, 16.321734021022394, 598.468893835281, 9.802603928641378], "isController": false}, {"data": ["Login Welcome-2", 1000, 0, 0.0, 17.648000000000017, 4, 1544, 6.0, 19.0, 45.94999999999993, 235.94000000000005, 16.347615700250117, 1392.037791600595, 9.690432353566232], "isController": false}, {"data": ["Login Welcome", 1000, 0, 0.0, 48.49000000000005, 7, 2134, 11.0, 39.799999999999955, 221.79999999999973, 794.900000000001, 16.157699143641945, 3929.997399620294, 37.08065721441267], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, 60.0, 0.014285714285714285], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 20.0, 0.004761904761904762], "isController": false}, {"data": ["Assertion failed", 1, 20.0, 0.004761904761904762], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 21000, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "Assertion failed", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 1000, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-2", 1000, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-4", 1000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 1000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 1000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
