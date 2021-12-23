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

    var data = {"OkPercent": 85.65110647743325, "KoPercent": 14.348893522566758};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.855308737472254, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9159974640743872, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.8859269027882442, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.5864285714285714, 500, 1500, "Registration"], "isController": false}, {"data": [0.5801428571428572, 500, 1500, "Welcome"], "isController": false}, {"data": [0.8965712132629993, 500, 1500, "Registration-3"], "isController": false}, {"data": [0.999894336432798, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.8980783722682742, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.9323753169907016, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.9990580256217031, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.9261411665257819, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.9995290128108515, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 59468, 8533, 14.348893522566758, 16.20320172193441, 2, 1590, 5.0, 15.0, 20.0, 33.0, 994.8141456723209, 75419.62066285883, 897.0673261902373], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 4732, 396, 8.368554522400677, 11.645815722738813, 2, 1242, 4.0, 19.0, 37.0, 158.67000000000007, 79.4372912085145, 2686.131641982407, 43.71637302959593], "isController": false}, {"data": ["Registration-4", 5308, 602, 11.341371514694801, 11.323285606631465, 2, 957, 4.0, 18.0, 36.0, 130.8199999999997, 91.02445381898, 2985.711480894382, 52.32957565936139], "isController": false}, {"data": ["Registration", 7000, 2853, 40.75714285714286, 38.639142857143185, 2, 1590, 12.0, 65.0, 184.0, 591.9299999999985, 119.83633780151679, 20124.98471952947, 283.4548348077483], "isController": false}, {"data": ["Welcome", 7000, 2931, 41.871428571428574, 19.9164285714286, 2, 1256, 7.0, 30.0, 62.0, 294.9899999999998, 117.1391278155226, 18131.980645504576, 171.60878956583218], "isController": false}, {"data": ["Registration-3", 5308, 546, 10.286360211002261, 11.568198944988708, 2, 918, 4.0, 18.0, 38.0, 121.90999999999985, 91.02445381898, 6977.8220804073635, 52.3143027403368], "isController": false}, {"data": ["Welcome-0", 4732, 0, 0.0, 8.288672865595933, 2, 906, 3.0, 15.0, 29.0, 90.67000000000007, 79.19532727485733, 310.6715133428729, 40.06169875817978], "isController": false}, {"data": ["Registration-2", 5308, 537, 10.116804822908817, 12.19235116804825, 2, 961, 4.0, 19.0, 38.0, 142.0, 91.02445381898, 9746.492152131135, 53.2121561181706], "isController": false}, {"data": ["Welcome-1", 4732, 319, 6.741335587489433, 11.278106508875778, 3, 1056, 4.0, 18.0, 39.0, 135.67000000000007, 79.43595769682726, 8817.368779639499, 44.63664399550949], "isController": false}, {"data": ["Registration-1", 5308, 0, 0.0, 12.816691785983421, 2, 941, 3.0, 22.0, 54.0, 177.63999999999942, 90.97920915962497, 342.9670493889584, 56.80623371698404], "isController": false}, {"data": ["Welcome-2", 4732, 349, 7.375316990701606, 11.629966187658498, 3, 945, 5.0, 18.0, 37.0, 149.67000000000007, 79.42395810604408, 6279.452671951317, 43.608082991700094], "isController": false}, {"data": ["Registration-0", 5308, 0, 0.0, 18.217030896759596, 3, 878, 5.0, 41.0, 91.55000000000018, 225.45999999999913, 90.89196732820767, 34.50414925769277, 69.1447520505488], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 0.011719207781553966, 0.0016815766462635368], "isController": false}, {"data": ["Test failed: text expected to contain /You've successfully registered to our Survey app/", 576, 6.750263682175085, 0.9685881482477972], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6708, 78.61244579866401, 11.280016143135803], "isController": false}, {"data": ["Assertion failed", 1248, 14.625571311379352, 2.098607654536894], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 59468, 8533, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6708, "Assertion failed", 1248, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 576, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Welcome-3", 4732, 396, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 396, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-4", 5308, 602, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 601, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Registration", 7000, 2853, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1692, "Assertion failed", 585, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 576, null, null, null, null], "isController": false}, {"data": ["Welcome", 7000, 2931, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2268, "Assertion failed", 663, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-3", 5308, 546, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 546, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-2", 5308, 537, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 537, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-1", 4732, 319, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 319, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Welcome-2", 4732, 349, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 349, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
