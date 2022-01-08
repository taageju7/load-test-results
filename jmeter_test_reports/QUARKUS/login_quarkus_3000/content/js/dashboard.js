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

    var data = {"OkPercent": 92.7242478207892, "KoPercent": 7.275752179210798};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9249226731652451, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9728415079043372, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.7638333333333334, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.5614973262032086, 500, 1500, "Logout-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.7598684210526315, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9714007782101167, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.9369649805447471, 500, 1500, "Login-3"], "isController": false}, {"data": [0.9385214007782101, 500, 1500, "Login-4"], "isController": false}, {"data": [0.9373540856031128, 500, 1500, "Login-5"], "isController": false}, {"data": [0.9369649805447471, 500, 1500, "Login-6"], "isController": false}, {"data": [0.9330739299610895, 500, 1500, "Login-7"], "isController": false}, {"data": [0.9284046692607004, 500, 1500, "Login-8"], "isController": false}, {"data": [0.833, 500, 1500, "Logout"], "isController": false}, {"data": [0.9797324685853263, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.7833333333333333, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 42676, 3105, 7.275752179210798, 17.845393195238476, 0, 2267, 3.0, 81.0, 89.0, 97.0, 712.3827329482857, 45021.461308263155, 664.20882298935], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 2467, 67, 2.715849209566275, 2.2950952573976524, 1, 55, 2.0, 3.0, 3.0, 9.0, 41.313594801889, 4769.169908464723, 21.62652393073651], "isController": false}, {"data": ["Login Welcome-0", 2467, 0, 0.0, 1.3749493311714645, 0, 55, 1.0, 2.0, 3.0, 4.0, 41.25280090966858, 83.83503778615264, 20.58611451644594], "isController": false}, {"data": ["Login", 3000, 659, 21.966666666666665, 109.50566666666609, 2, 2267, 90.0, 101.0, 106.0, 1689.9699999999993, 50.52886882705653, 15784.160179935407, 240.70400399178064], "isController": false}, {"data": ["Login-0", 2570, 0, 0.0, 1.5856031128404655, 0, 223, 1.0, 2.0, 3.0, 5.0, 43.3557703662466, 8.594942758152403, 27.647771532381867], "isController": false}, {"data": ["Logout-2", 187, 82, 43.850267379679146, 2.721925133689838, 1, 18, 3.0, 3.200000000000017, 5.0, 11.840000000000032, 16.499029468854772, 356.0012324642668, 5.506368421342862], "isController": false}, {"data": ["Login-1", 2570, 0, 0.0, 1.3906614785992204, 0, 96, 1.0, 2.0, 2.0, 3.0, 43.36089083853552, 210.6221396785895, 28.413239992829425], "isController": false}, {"data": ["Logout-1", 304, 73, 24.013157894736842, 2.6513157894736845, 1, 11, 3.0, 3.0, 3.75, 6.0, 5.321383559725529, 410.8949625730815, 2.4986550213993137], "isController": false}, {"data": ["Login-2", 2570, 24, 0.933852140077821, 123.05097276264618, 3, 2183, 88.0, 99.0, 104.44999999999982, 1699.29, 43.29733645568341, 257.19830064272116, 24.67185446745961], "isController": false}, {"data": ["Logout-0", 2654, 0, 0.0, 1.640919366993217, 1, 99, 1.0, 2.0, 3.0, 4.0, 46.02285535921757, 93.52886914309744, 27.407118943676625], "isController": false}, {"data": ["Login-3", 2570, 162, 6.303501945525292, 4.552918287937753, 2, 148, 4.0, 5.0, 7.0, 27.579999999999927, 43.359427723039545, 2202.816800881951, 26.621312550614117], "isController": false}, {"data": ["Login-4", 2570, 158, 6.147859922178989, 4.7715953307392915, 1, 242, 4.0, 5.0, 7.0, 20.579999999999927, 43.3652807775378, 6206.862941931442, 26.907605692325863], "isController": false}, {"data": ["Login-5", 2570, 161, 6.264591439688716, 4.680155642023344, 2, 247, 4.0, 5.0, 7.0, 26.289999999999964, 43.362354052777214, 864.0126667742289, 26.99140451002227], "isController": false}, {"data": ["Login-6", 2570, 162, 6.303501945525292, 4.866536964980545, 2, 242, 4.0, 5.0, 7.0, 28.0, 43.362354052777214, 3454.9261076276407, 26.662785989066613], "isController": false}, {"data": ["Login-7", 2570, 172, 6.692607003891051, 4.571206225680933, 2, 173, 4.0, 5.0, 6.449999999999818, 28.289999999999964, 43.36454905930988, 288.3407681599595, 26.632432190162827], "isController": false}, {"data": ["Login-8", 2570, 184, 7.159533073929961, 3.92568093385214, 0, 232, 3.0, 4.0, 5.0, 18.289999999999964, 43.37186735296599, 2301.015901875369, 26.542953917390935], "isController": false}, {"data": ["Logout", 3000, 501, 16.7, 2.0756666666666654, 1, 99, 2.0, 4.0, 5.0, 7.0, 52.02011444425178, 585.2935140129183, 30.963042689006414], "isController": false}, {"data": ["Login Welcome-2", 2467, 50, 2.026753141467369, 2.2111876773408983, 1, 58, 2.0, 3.0, 3.0, 11.320000000000164, 41.313594801889, 1475.9721861707474, 21.70065659330308], "isController": false}, {"data": ["Login Welcome", 3000, 650, 21.666666666666668, 4.1403333333333325, 2, 210, 3.0, 4.0, 6.0, 20.0, 50.158836314997494, 6340.881427254012, 63.84099779510115], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 5, 0.1610305958132045, 0.011716187084075359], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 0.0322061191626409, 0.002343237416815072], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2596, 83.60708534621578, 6.083044334051926], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 2, 0.0644122383252818, 0.004686474833630144], "isController": false}, {"data": ["Assertion failed", 501, 16.135265700483092, 1.1739619458243509], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 42676, 3105, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2596, "Assertion failed", 501, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 5, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 2467, 67, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 67, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 659, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 430, "Assertion failed", 229, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 187, 82, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 82, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-1", 304, 73, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 73, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2570, 24, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 24, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2570, 162, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 162, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 2570, 158, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 157, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 2570, 161, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 160, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 2570, 162, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 162, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 2570, 172, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 171, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 2570, 184, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 180, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["Logout", 3000, 501, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 346, "Assertion failed", 155, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 2467, 50, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 49, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 650, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 533, "Assertion failed", 117, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
