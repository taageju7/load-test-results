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

    var data = {"OkPercent": 95.52013581061964, "KoPercent": 4.479864189380364};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0705460718664529, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.036646586345381524, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.1397139713971397, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.0265, 500, 1500, "Registration"], "isController": false}, {"data": [0.0055, 500, 1500, "Welcome"], "isController": false}, {"data": [0.13091309130913092, 500, 1500, "Registration-3"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.1276127612761276, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.0356425702811245, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.11469344608879492, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.03263052208835342, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.0613107822410148, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10603, 475, 4.479864189380364, 17349.392719041804, 56, 149794, 12580.0, 37069.800000000025, 60596.39999999998, 95263.56, 61.09126526849504, 5188.204744351737, 60.53938029355842], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 996, 57, 5.72289156626506, 15522.640562249002, 247, 96118, 12405.0, 23845.9, 77366.15, 81266.98, 6.5897422325729105, 229.9750413926454, 3.762993610398031], "isController": false}, {"data": ["Registration-4", 909, 22, 2.42024202420242, 10595.640264026406, 102, 101785, 8398.0, 17209.0, 22434.5, 78360.0, 5.54508354226525, 198.69095743240976, 3.5191850397123146], "isController": false}, {"data": ["Registration", 1000, 126, 12.6, 43430.20800000002, 451, 149794, 41175.0, 79329.2, 98155.29999999999, 119719.48, 5.931374002787745, 1296.1738583031822, 18.06571406328776], "isController": false}, {"data": ["Welcome", 1000, 93, 9.3, 29475.571, 993, 115423, 26031.0, 51469.399999999994, 93639.05, 105975.96, 6.03216349575939, 1397.9615422715167, 13.355887419847628], "isController": false}, {"data": ["Registration-3", 909, 15, 1.6501650165016502, 10081.332233223313, 140, 92698, 8224.0, 17246.0, 21052.0, 77847.7, 5.803152471606689, 486.20485065381223, 3.667444530097868], "isController": false}, {"data": ["Welcome-0", 996, 0, 0.0, 9094.849397590358, 149, 29928, 8811.5, 15654.800000000001, 18865.64999999999, 25928.589999999997, 11.80584365554436, 46.31257223078291, 5.995154981331121], "isController": false}, {"data": ["Registration-2", 909, 21, 2.31023102310231, 10638.331133113306, 181, 89728, 8221.0, 17267.0, 23482.5, 78242.4, 5.80763873803652, 675.3028642771917, 3.717398917376915], "isController": false}, {"data": ["Welcome-1", 996, 52, 5.220883534136546, 15213.242971887546, 359, 101719, 12514.0, 22496.500000000004, 77101.2, 81232.76999999997, 6.079955071817943, 686.2319775553666, 3.5015432139979366], "isController": false}, {"data": ["Registration-1", 946, 37, 3.9112050739957716, 12810.24947145877, 56, 89046, 10202.5, 18080.100000000013, 30733.39999999997, 78377.45999999999, 6.040791305347313, 23.35752392011277, 3.6486553093191656], "isController": false}, {"data": ["Welcome-2", 996, 52, 5.220883534136546, 15342.842369477916, 329, 103312, 12424.5, 23483.700000000015, 77232.5, 81127.35999999999, 6.188257222739981, 501.16564368786896, 3.510091449207829], "isController": false}, {"data": ["Registration-0", 946, 0, 0.0, 16398.355179704035, 108, 47212, 17102.0, 26679.700000000004, 30219.399999999998, 39828.91999999999, 5.877930421707334, 2.2044908926252478, 4.533517911843471], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 22.303)", 1, 0.21052631578947367, 0.00943129303027445], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 8, 1.6842105263157894, 0.0754503442421956], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 314, 66.10526315789474, 2.9614260115061777], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 99.115)", 1, 0.21052631578947367, 0.00943129303027445], "isController": false}, {"data": ["500", 21, 4.421052631578948, 0.19805715363576346], "isController": false}, {"data": ["Test failed: text expected to contain /You've successfully registered to our Survey app/", 2, 0.42105263157894735, 0.0188625860605489], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 13.530)", 1, 0.21052631578947367, 0.00943129303027445], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 4, 0.8421052631578947, 0.0377251721210978], "isController": false}, {"data": ["Assertion failed", 123, 25.894736842105264, 1.1600490427237575], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10603, 475, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 314, "Assertion failed", 123, "500", 21, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 8, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 4], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Welcome-3", 996, 57, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 53, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 3, "500", 1, null, null, null, null], "isController": false}, {"data": ["Registration-4", 909, 22, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 22, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration", 1000, 126, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 73, "Assertion failed", 33, "500", 16, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 2], "isController": false}, {"data": ["Welcome", 1000, 93, "Assertion failed", 89, "500", 2, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, null, null], "isController": false}, {"data": ["Registration-3", 909, 15, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-2", 909, 21, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 21, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-1", 996, 52, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 47, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 22.303)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 99.115)", 1, "500", 1], "isController": false}, {"data": ["Registration-1", 946, 37, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 34, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 2, "500", 1, null, null, null, null], "isController": false}, {"data": ["Welcome-2", 996, 52, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 48, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 13.530)", 1, "Assertion failed", 1, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
