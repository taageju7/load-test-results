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

    var data = {"OkPercent": 94.6562841192345, "KoPercent": 5.343715880765507};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9459242321240962, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9767691208005719, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.9649505860721673, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.807, 500, 1500, "Registration"], "isController": false}, {"data": [0.8068, 500, 1500, "Welcome"], "isController": false}, {"data": [0.9660997471845553, 500, 1500, "Registration-3"], "isController": false}, {"data": [0.9998808672861568, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.9723052171914502, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.9768882535144151, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.9995403355550448, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.9821300929235168, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.9996552516662837, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48543, 2594, 5.343715880765507, 8.704427002863575, 1, 1158, 4.0, 11.0, 13.0, 23.0, 811.7965784236667, 68292.17070489531, 793.4917107568106], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 4197, 97, 2.3111746485584943, 5.820347867524421, 2, 518, 4.0, 6.0, 10.0, 40.099999999997635, 70.34392598551891, 2523.884256393093, 41.2711575447506], "isController": false}, {"data": ["Registration-4", 4351, 152, 3.493449781659389, 6.6129625373477685, 2, 543, 4.0, 6.0, 9.0, 95.95999999999913, 74.1302347769789, 2629.8623308760266, 46.38956388216853], "isController": false}, {"data": ["Registration", 5000, 942, 18.84, 22.94120000000007, 1, 1158, 12.0, 16.0, 36.0, 453.97999999999956, 85.10058889607517, 17631.5044108699, 242.10939693999558], "isController": false}, {"data": ["Welcome", 5000, 964, 19.28, 11.299199999999981, 1, 606, 7.0, 11.0, 21.0, 147.90999999999804, 83.64141253617491, 16857.08033378674, 158.90724846936214], "isController": false}, {"data": ["Registration-3", 4351, 147, 3.378533670420593, 7.245460813606084, 2, 558, 4.0, 6.0, 11.0, 94.43999999999869, 74.1125570620699, 6104.108252788164, 45.87428459494447], "isController": false}, {"data": ["Welcome-0", 4197, 0, 0.0, 4.144388849177989, 1, 511, 2.0, 4.0, 7.0, 35.0, 70.22152322312944, 275.46861209698335, 35.522215849200244], "isController": false}, {"data": ["Registration-2", 4351, 120, 2.757986669731096, 6.5794070328659835, 2, 521, 4.0, 6.0, 10.0, 73.39999999999782, 74.12897180339041, 8571.576965004473, 46.883086027344746], "isController": false}, {"data": ["Welcome-1", 4197, 97, 2.3111746485584943, 6.173218965928021, 2, 350, 4.0, 6.0, 10.0, 45.039999999999054, 70.34274700410626, 8170.312745511397, 41.40467872705941], "isController": false}, {"data": ["Registration-1", 4351, 0, 0.0, 7.750172374166846, 2, 779, 3.0, 4.0, 8.0, 165.91999999999825, 74.09614958873316, 287.2113867909266, 46.34403644458541], "isController": false}, {"data": ["Welcome-2", 4197, 75, 1.7869907076483202, 6.29640219204194, 2, 305, 4.0, 6.0, 10.0, 41.0, 70.35689738990496, 5887.240206512037, 40.96042293556066], "isController": false}, {"data": ["Registration-0", 4351, 0, 0.0, 7.937025971041155, 2, 581, 4.0, 6.0, 13.0, 128.31999999999607, 74.0721824991488, 27.791133331205312, 56.788356262768126], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, 0.07710100231303008, 0.0041200585048307686], "isController": false}, {"data": ["Test failed: text expected to contain /You've successfully registered to our Survey app/", 154, 5.936777178103315, 0.3172445048719692], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2138, 82.42097147262915, 4.404342541664092], "isController": false}, {"data": ["Assertion failed", 300, 11.56515034695451, 0.6180087757246153], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 48543, 2594, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2138, "Assertion failed", 300, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 154, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Welcome-3", 4197, 97, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 97, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-4", 4351, 152, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 151, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Registration", 5000, 942, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 649, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 154, "Assertion failed", 139, null, null, null, null], "isController": false}, {"data": ["Welcome", 5000, 964, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 803, "Assertion failed", 161, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-3", 4351, 147, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 146, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-2", 4351, 120, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 120, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-1", 4197, 97, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 97, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Welcome-2", 4197, 75, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 75, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
