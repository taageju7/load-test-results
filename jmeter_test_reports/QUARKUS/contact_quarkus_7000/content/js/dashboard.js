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

    var data = {"OkPercent": 64.78117972669088, "KoPercent": 35.21882027330911};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6357896557688981, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.813162705667276, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.8246800731261426, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.8316270566727605, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.8363802559414991, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.779707495429616, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.8606946983546618, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.8680073126142596, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [1.0, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.5610328638497653, 500, 1500, "Send Email-2"], "isController": false}, {"data": [0.7939163498098859, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.24771428571428572, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [0.3960749330954505, 500, 1500, "Send Email-4"], "isController": false}, {"data": [0.4814516129032258, 500, 1500, "Send Email-3"], "isController": false}, {"data": [0.3412322274881517, 500, 1500, "Send Email-6"], "isController": false}, {"data": [0.33029612756264237, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.2328767123287671, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.32457142857142857, 500, 1500, "Send Email"], "isController": false}, {"data": [0.9993974088580898, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 46248, 16288, 35.21882027330911, 67.4082554921295, 1, 5681, 7.0, 86.0, 98.0, 125.9900000000016, 768.3285431860847, 37164.35959123154, 454.37277668291995], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 2735, 508, 18.57404021937843, 21.881170018281534, 1, 791, 8.0, 44.0, 76.0, 318.5599999999995, 45.60765741728922, 279.6439350987193, 19.003429433197706], "isController": false}, {"data": ["Show Contact Page-5", 2735, 475, 17.36745886654479, 22.738939670932357, 1, 822, 7.0, 43.0, 74.0, 349.27999999999975, 45.59625227147692, 3217.827196221221, 19.20661374889552], "isController": false}, {"data": ["Show Contact Page-4", 2735, 458, 16.745886654478976, 21.359780621572227, 1, 787, 7.0, 43.0, 75.0, 284.27999999999975, 45.59625227147692, 820.1106687259307, 19.64765667980928], "isController": false}, {"data": ["Show Contact Page-3", 2735, 443, 16.19744058500914, 23.783546617915952, 2, 825, 7.0, 45.0, 78.19999999999982, 375.5599999999995, 45.5992930859134, 5840.37103415883, 19.66645357124994], "isController": false}, {"data": ["Show Contact Page-7", 2735, 598, 21.86471663619744, 21.26691042047528, 2, 811, 6.0, 40.40000000000009, 72.0, 270.27999999999975, 45.6084179632131, 2055.069627487827, 18.270546847641203], "isController": false}, {"data": ["Show Contact Page-2", 2735, 377, 13.784277879341865, 22.38683729433273, 1, 776, 7.0, 43.0, 75.0, 386.5599999999995, 45.61982919669069, 2142.0118028016163, 20.011419291683346], "isController": false}, {"data": ["Show Contact Page-1", 2735, 102, 3.729433272394881, 425.4424131627063, 4, 5497, 102.0, 872.2000000000003, 3470.9999999999927, 5017.399999999999, 45.54462040598824, 266.38177861317877, 23.121947906779237], "isController": false}, {"data": ["Show Contact Page-0", 2735, 0, 0.0, 9.667641681901273, 1, 465, 2.0, 15.0, 32.0, 186.63999999999987, 45.52187879695744, 267.12985321378636, 22.805394358241372], "isController": false}, {"data": ["Send Email-2", 1278, 561, 43.89671361502347, 10.003129890453838, 1, 384, 7.0, 21.0, 28.0, 53.0, 23.58716917057325, 866.3098337835904, 6.773449179386143], "isController": false}, {"data": ["Send Email-1", 1315, 271, 20.60836501901141, 49.12015209125478, 1, 426, 19.0, 104.0, 111.0, 137.35999999999967, 24.26512649235141, 772.3578986504253, 10.02774516542727], "isController": false}, {"data": ["Show Contact Page", 7000, 4996, 71.37142857142857, 179.80971428571402, 2, 5681, 14.0, 145.0, 308.9499999999998, 4273.9299999999985, 116.32157931469972, 15013.412958873052, 161.2514384409585], "isController": false}, {"data": ["Send Email-4", 1121, 677, 60.39250669045495, 11.95272078501339, 1, 86, 9.0, 24.0, 33.0, 60.0, 22.06215189624294, 312.20057926064237, 4.497980260179882], "isController": false}, {"data": ["Send Email-3", 1240, 643, 51.854838709677416, 10.925000000000011, 2, 128, 8.0, 22.0, 29.0, 55.58999999999992, 24.402243432057464, 1105.1263429536064, 6.0297041043491095], "isController": false}, {"data": ["Send Email-6", 633, 417, 65.87677725118483, 13.633491311216432, 1, 104, 10.0, 26.0, 37.299999999999955, 71.31999999999994, 12.47536460386283, 61.602232274832474, 2.178596613864801], "isController": false}, {"data": ["Send Email-5", 878, 588, 66.97038724373576, 12.956719817767654, 2, 95, 10.0, 25.0, 33.049999999999955, 58.42000000000007, 17.282103771356585, 456.5463134054405, 2.9141944408904807], "isController": false}, {"data": ["Send Email-7", 584, 448, 76.71232876712328, 14.476027397260282, 2, 90, 10.0, 29.5, 41.75, 73.14999999999998, 11.510791366906474, 175.44117103577412, 1.3743286192963438], "isController": false}, {"data": ["Send Email", 7000, 4726, 67.51428571428572, 19.68742857142853, 1, 869, 5.0, 62.0, 104.0, 152.0, 124.98660857765239, 4014.2336172686855, 70.90742439984109], "isController": false}, {"data": ["Send Email-0", 3319, 0, 0.0, 10.036758059656528, 1, 869, 3.0, 14.0, 28.0, 164.40000000000055, 59.27632518931276, 352.242615993133, 39.24741062339263], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 2, 0.012278978388998035, 0.004324511330219685], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 0.006139489194499017, 0.0021622556651098427], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, 0.03683693516699411, 0.012973533990659055], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 14503, 89.04101178781926, 31.359193911088045], "isController": false}, {"data": ["Assertion failed", 1776, 10.903732809430256, 3.8401660612350805], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 46248, 16288, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 14503, "Assertion failed", 1776, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 2735, 508, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 508, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-5", 2735, 475, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 474, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-4", 2735, 458, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 457, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-3", 2735, 443, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 443, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-7", 2735, 598, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 593, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-2", 2735, 377, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 377, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-1", 2735, 102, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 100, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-2", 1278, 561, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 561, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-1", 1315, 271, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 271, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 7000, 4996, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4265, "Assertion failed", 731, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 1121, 677, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 677, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 1240, 643, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 643, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-6", 633, 417, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 417, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 878, 588, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 588, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-7", 584, 448, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 448, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email", 7000, 4726, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3681, "Assertion failed", 1045, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
