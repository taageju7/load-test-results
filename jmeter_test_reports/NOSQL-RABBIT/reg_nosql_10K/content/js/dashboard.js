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

    var data = {"OkPercent": 77.68816025950116, "KoPercent": 22.31183974049884};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7650535513376876, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8894694533762058, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.8586823199579464, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.40325, 500, 1500, "Registration"], "isController": false}, {"data": [0.40095, 500, 1500, "Welcome"], "isController": false}, {"data": [0.8713860171718941, 500, 1500, "Registration-3"], "isController": false}, {"data": [0.9574959807073955, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.8853162782547749, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.9100683279742765, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.9937795689504118, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.9009244372990354, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.966882775538812, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 68439, 15270, 22.31183974049884, 81.09252034658617, 2, 3923, 14.0, 404.0, 912.9500000000007, 2408.9900000000016, 1104.9241201162415, 76183.15114362186, 910.1197983936067], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 4976, 531, 10.671221864951768, 38.86495176848868, 2, 2504, 12.0, 80.0, 141.0, 447.0, 80.87637746643696, 2671.3148963446347, 43.3898594445844], "isController": false}, {"data": ["Registration-4", 5707, 779, 13.649903627124583, 41.790257578412366, 2, 2494, 12.0, 87.0, 200.0, 493.84000000000015, 94.4039170926174, 3022.2596253752913, 52.85924602583825], "isController": false}, {"data": ["Registration", 10000, 5791, 57.91, 153.4625, 2, 3923, 29.0, 416.0, 726.8999999999978, 2107.0, 165.17186132170522, 20633.737301122757, 290.6078408372975], "isController": false}, {"data": ["Welcome", 10000, 5923, 59.23, 111.61649999999996, 2, 3730, 19.0, 238.0, 439.8999999999978, 2216.99, 162.06667422977813, 18177.92749390224, 171.6632845799637], "isController": false}, {"data": ["Registration-3", 5707, 713, 12.493429122130717, 39.21762747503069, 2, 2393, 12.0, 85.0, 191.59999999999945, 450.6800000000003, 94.4039170926174, 7064.819903349503, 52.921794617306006], "isController": false}, {"data": ["Welcome-0", 4976, 0, 0.0, 118.37680868167199, 2, 2942, 12.0, 196.0, 679.2999999999993, 2245.3799999999974, 81.0146366877778, 317.808394116019, 40.98201348073135], "isController": false}, {"data": ["Registration-2", 5707, 625, 10.951463115472228, 42.73488698090059, 2, 2518, 12.0, 86.0, 202.59999999999945, 482.7600000000002, 94.40547872692385, 10013.576047421922, 54.67619195808245], "isController": false}, {"data": ["Welcome-1", 4976, 436, 8.762057877813504, 37.24557877813499, 2, 2812, 12.0, 88.0, 148.0, 346.06999999999607, 80.8947847574457, 8789.24697873992, 44.47144205602159], "isController": false}, {"data": ["Registration-1", 5707, 0, 0.0, 49.217277028210965, 2, 723, 12.0, 133.0, 249.0, 559.9200000000001, 94.36177248677248, 353.02916834594083, 58.89120757895172], "isController": false}, {"data": ["Welcome-2", 4976, 472, 9.485530546623794, 39.83842443729899, 2, 2496, 13.0, 83.0, 151.0, 401.22999999999956, 80.8369614659822, 6250.315388629866, 43.372726663525896], "isController": false}, {"data": ["Registration-0", 5707, 0, 0.0, 130.7189416506045, 3, 3253, 27.0, 302.0, 504.0, 2248.76, 94.29940515532056, 35.90942302131526, 71.58730778564937], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 0.006548788474132285, 0.0014611551892926547], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, 0.03274394237066143, 0.007305775946463274], "isController": false}, {"data": ["Test failed: text expected to contain /You've successfully registered to our Survey app/", 731, 4.7871643745907, 1.0681044433729305], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 12867, 84.26326129666012, 18.80068382062859], "isController": false}, {"data": ["Assertion failed", 1666, 10.910281597904389, 2.434284545361563], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 68439, 15270, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 12867, "Assertion failed", 1666, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 731, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Welcome-3", 4976, 531, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 531, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-4", 5707, 779, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 778, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Registration", 10000, 5791, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4293, "Assertion failed", 767, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 731, null, null, null, null], "isController": false}, {"data": ["Welcome", 10000, 5923, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5024, "Assertion failed", 899, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-3", 5707, 713, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 711, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-2", 5707, 625, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 623, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-1", 4976, 436, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 435, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Welcome-2", 4976, 472, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 472, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
