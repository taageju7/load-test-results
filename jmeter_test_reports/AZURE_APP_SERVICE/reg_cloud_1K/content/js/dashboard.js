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

    var data = {"OkPercent": 99.85443959243086, "KoPercent": 0.14556040756914118};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.006413755458515284, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.01001001001001001, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.25, 500, 1500, "Registration-5"], "isController": false}, {"data": [0.006012024048096192, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.0, 500, 1500, "Registration"], "isController": false}, {"data": [0.0, 500, 1500, "Welcome"], "isController": false}, {"data": [0.002004008016032064, 500, 1500, "Registration-3"], "isController": false}, {"data": [0.031031031031031032, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.003006012024048096, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.006006006006006006, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.002, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.00850850850850851, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.0015, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10992, 16, 0.14556040756914118, 29178.39556040763, 293, 180964, 22828.0, 55301.100000000006, 84717.45000000001, 123736.12, 46.02533235632786, 4094.7395165458497, 58.69327289202345], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 999, 1, 0.1001001001001001, 21558.869869869854, 439, 63943, 18223.0, 43093.0, 46884.0, 56827.0, 6.321704518848045, 231.42237338200118, 4.87709625965816], "isController": false}, {"data": ["Registration-5", 2, 0, 0.0, 9025.0, 678, 17372, 9025.0, 17372.0, 17372.0, 17372.0, 0.05480202767502398, 2.007338334018359, 0.04490127072201672], "isController": false}, {"data": ["Registration-4", 998, 1, 0.10020040080160321, 22344.43687374751, 293, 95616, 21357.0, 39720.700000000004, 44572.34999999999, 56210.65999999998, 4.376905028177971, 160.6531377116089, 3.5860870584172098], "isController": false}, {"data": ["Registration", 1000, 6, 0.6, 80599.24100000011, 8589, 180964, 82272.0, 124706.2, 130026.2, 140242.85, 4.274015694185629, 1045.1310095999734, 17.891380298710956], "isController": false}, {"data": ["Welcome", 1000, 4, 0.4, 40503.15699999996, 3286, 116935, 35800.5, 79379.3, 86301.79999999997, 95287.74, 5.965875193890944, 1458.294931895806, 16.840989850554827], "isController": false}, {"data": ["Registration-3", 998, 0, 0.0, 22366.67334669341, 611, 63948, 21248.5, 39237.3, 44187.45, 53115.8, 4.370809300451533, 372.31323740983566, 3.5470997266054405], "isController": false}, {"data": ["Welcome-0", 999, 0, 0.0, 14628.944944944948, 492, 50550, 11766.0, 32278.0, 36765.0, 43417.0, 9.378080262849098, 40.526294077094576, 4.8447309170382535], "isController": false}, {"data": ["Registration-2", 998, 0, 0.0, 22466.63326653303, 868, 67582, 20992.0, 40462.5, 45191.44999999999, 54991.079999999994, 4.380036163825641, 519.3227727730061, 3.5969329186270036], "isController": false}, {"data": ["Welcome-1", 999, 1, 0.1001001001001001, 21369.113113113104, 368, 61744, 18171.0, 43324.0, 46737.0, 54064.0, 6.558991530431357, 778.5212544522684, 5.072970011818002], "isController": false}, {"data": ["Registration-1", 1000, 2, 0.2, 26655.133000000013, 472, 81131, 25958.0, 43888.7, 51136.09999999997, 63006.19000000002, 4.335968156649858, 17.451420727391177, 3.4551611096718107], "isController": false}, {"data": ["Welcome-2", 999, 1, 0.1001001001001001, 21413.637637637617, 396, 80648, 18187.0, 42708.0, 47847.0, 55298.0, 6.040816326530613, 513.7376523526077, 4.613201530612245], "isController": false}, {"data": ["Registration-0", 1000, 0, 0.0, 27018.359999999997, 583, 69584, 24868.0, 46690.8, 52918.99999999998, 61968.630000000005, 4.95150005694225, 2.286974088800202, 4.656455448568769], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 9, 56.25, 0.08187772925764192], "isController": false}, {"data": ["Test failed: text expected to contain /You've successfully registered to our Survey app/", 3, 18.75, 0.027292576419213975], "isController": false}, {"data": ["Assertion failed", 4, 25.0, 0.036390101892285295], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10992, 16, "500", 9, "Assertion failed", 4, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 3, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Welcome-3", 999, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-4", 998, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration", 1000, 6, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 3, "500", 2, "Assertion failed", 1, null, null, null, null], "isController": false}, {"data": ["Welcome", 1000, 4, "Assertion failed", 3, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Welcome-1", 999, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-1", 1000, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-2", 999, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
