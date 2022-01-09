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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9925802879291251, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.975, 500, 1500, "Session Test"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.999, 500, 1500, "Session Test-0"], "isController": false}, {"data": [0.5, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.5, 500, 1500, "Login-2"], "isController": false}, {"data": [0.5, 500, 1500, "Login-3"], "isController": false}, {"data": [0.5, 500, 1500, "Login-4"], "isController": false}, {"data": [0.994, 500, 1500, "Session Test-5"], "isController": false}, {"data": [0.5, 500, 1500, "Login-5"], "isController": false}, {"data": [0.995, 500, 1500, "Session Test-6"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.995, 500, 1500, "Session Test-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.5, 500, 1500, "Login-8"], "isController": false}, {"data": [0.998, 500, 1500, "Session Test-1"], "isController": false}, {"data": [0.996, 500, 1500, "Session Test-2"], "isController": false}, {"data": [0.996, 500, 1500, "Session Test-3"], "isController": false}, {"data": [0.996, 500, 1500, "Session Test-4"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.5, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4515, 0, 0.0, 119.46135105204873, 49, 3040, 87.0, 224.0, 268.1999999999998, 592.9200000000019, 30.54431801269128, 2603.816485898199, 31.303856346994273], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Session Test", 500, 0, 0.0, 286.7619999999997, 204, 3040, 240.0, 364.0, 489.39999999999986, 1245.5300000000032, 3.471065200488726, 1331.5936720637392, 16.006220582722424], "isController": false}, {"data": ["Login Welcome-1", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 448.44118514150944, 2.2811025943396226], "isController": false}, {"data": ["Login Welcome-0", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 13.11882174744898, 2.556002869897959], "isController": false}, {"data": ["Login", 1, 0, 0.0, 2586.0, 2586, 2586, 2586.0, 2586.0, 2586.0, 2586.0, 0.3866976024748647, 150.36343532482599, 2.1925451952822894], "isController": false}, {"data": ["Session Test-0", 500, 0, 0.0, 73.896, 57, 1089, 66.0, 80.0, 116.44999999999987, 245.28000000000065, 3.4754080129007145, 1.25158131064587, 1.9888565386326356], "isController": false}, {"data": ["Login-0", 1, 0, 0.0, 849.0, 849, 849, 849.0, 849.0, 849.0, 849.0, 1.1778563015312131, 0.5072603798586572, 0.854635968786808], "isController": false}, {"data": ["Login-1", 1, 0, 0.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 40.95618206521739, 5.290421195652174], "isController": false}, {"data": ["Login-2", 1, 0, 0.0, 1346.0, 1346, 1346, 1346.0, 1346.0, 1346.0, 1346.0, 0.7429420505200593, 4.4358864227340264, 0.42733678491827637], "isController": false}, {"data": ["Login-3", 1, 0, 0.0, 1361.0, 1361, 1361, 1361.0, 1361.0, 1361.0, 1361.0, 0.7347538574577516, 39.894120821087434, 0.4577860947832476], "isController": false}, {"data": ["Login-4", 1, 0, 0.0, 1309.0, 1309, 1309, 1309.0, 1309.0, 1309.0, 1309.0, 0.7639419404125286, 116.56605113636364, 0.48044786096256686], "isController": false}, {"data": ["Session Test-5", 500, 0, 0.0, 109.37799999999997, 64, 2441, 90.0, 133.0, 176.95, 571.7300000000021, 3.478212477043798, 296.0550725489906, 2.004048204546719], "isController": false}, {"data": ["Login-5", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 25.36623996730083, 0.7512912455410227], "isController": false}, {"data": ["Session Test-6", 500, 0, 0.0, 94.56599999999993, 59, 1110, 84.0, 111.0, 123.0, 546.820000000002, 3.4784302539949774, 25.031395550565943, 2.010967490590846], "isController": false}, {"data": ["Login-6", 1, 0, 0.0, 1593.0, 1593, 1593, 1593.0, 1593.0, 1593.0, 1593.0, 0.6277463904582549, 53.43200721908349, 0.3917284604519774], "isController": false}, {"data": ["Session Test-7", 500, 0, 0.0, 108.72599999999998, 62, 1299, 92.0, 148.80000000000007, 193.95, 514.2100000000016, 3.4778979584738985, 198.93905092512088, 2.014056141967795], "isController": false}, {"data": ["Login-7", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 38.07560350529101, 3.312045304232804], "isController": false}, {"data": ["Login-8", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 96.13642331932773, 1.053702731092437], "isController": false}, {"data": ["Session Test-1", 500, 0, 0.0, 64.41599999999994, 49, 874, 56.0, 71.0, 93.89999999999998, 210.91000000000008, 3.477607684121939, 19.26529451859477, 1.9663426260806667], "isController": false}, {"data": ["Session Test-2", 500, 0, 0.0, 99.01200000000003, 62, 1124, 88.0, 123.0, 167.64999999999992, 323.4300000000005, 3.4784786525765092, 188.8653504284616, 2.000804615593324], "isController": false}, {"data": ["Session Test-3", 500, 0, 0.0, 122.30199999999986, 71, 2095, 98.0, 165.90000000000003, 232.74999999999994, 408.63000000000034, 3.4770998205816492, 530.55176168349, 2.020385149654376], "isController": false}, {"data": ["Session Test-4", 500, 0, 0.0, 95.34400000000007, 60, 1298, 85.0, 115.90000000000003, 143.95, 330.83000000000015, 3.4779947273599934, 74.19530070742412, 2.031094577110621], "isController": false}, {"data": ["Login Welcome-3", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 208.33518288352275, 3.423517400568182], "isController": false}, {"data": ["Login Welcome-2", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 519.2216082317073, 3.626381478658536], "isController": false}, {"data": ["Login Welcome", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 417.9167337843643, 3.9565882731958766], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4515, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
