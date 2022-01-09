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

    var data = {"OkPercent": 99.53420403689834, "KoPercent": 0.4657959631016531};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0019940938289645933, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0030181086519114686, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.0, 500, 1500, "Registration-5"], "isController": false}, {"data": [5.031868500503186E-4, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.0, 500, 1500, "Registration"], "isController": false}, {"data": [0.0, 500, 1500, "Welcome"], "isController": false}, {"data": [3.354579000335458E-4, 500, 1500, "Registration-3"], "isController": false}, {"data": [0.011569416498993963, 500, 1500, "Welcome-0"], "isController": false}, {"data": [6.709158000670916E-4, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.0030181086519114686, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.0, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.002850435949027498, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32847, 153, 0.4657959631016531, 107744.03823789103, 117, 570972, 103548.0, 261057.9, 326242.95000000007, 368915.99, 51.23249981283222, 4547.822221574771, 65.23314610219205], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 2982, 11, 0.3688799463447351, 84577.68846411823, 405, 335431, 92287.0, 138355.80000000002, 149552.4, 159577.69, 8.474190944949019, 310.03372816624136, 6.526621848820093], "isController": false}, {"data": ["Registration-5", 4, 0, 0.0, 77462.5, 4871, 112933, 96023.0, 112933.0, 112933.0, 112933.0, 0.022830659292363713, 0.8362620788456818, 0.01870597963505191], "isController": false}, {"data": ["Registration-4", 2981, 4, 0.13418316001341832, 88420.4018785642, 478, 174827, 85840.0, 111697.2, 118705.80000000002, 148882.18, 4.73984891632203, 173.75122332145588, 3.880873346677574], "isController": false}, {"data": ["Registration", 3000, 56, 1.8666666666666667, 290098.37733333383, 117, 570972, 287784.5, 363036.7, 372117.3, 388301.0499999999, 4.70021997029461, 1143.0303039093687, 19.573576460044997], "isController": false}, {"data": ["Welcome", 3000, 41, 1.3666666666666667, 133422.77033333312, 2123, 454425, 136929.5, 231718.0, 250004.44999999998, 270010.39999999997, 5.958280122581684, 1446.7698561391885, 16.728453307441296], "isController": false}, {"data": ["Registration-3", 2981, 6, 0.20127474002012746, 88546.76853404887, 631, 306362, 85911.0, 111853.0, 119951.70000000001, 151178.13999999998, 4.735895578348013, 402.8364482525761, 3.84462296230189], "isController": false}, {"data": ["Welcome-0", 2982, 0, 0.0, 43747.659624413245, 453, 128933, 40036.5, 88636.7, 95031.5, 103682.92000000001, 15.865415309966162, 68.55999646360053, 8.196098338839942], "isController": false}, {"data": ["Registration-2", 2981, 5, 0.1677289500167729, 88475.0801744378, 360, 175564, 86690.0, 111844.20000000001, 120103.90000000002, 149766.3399999999, 4.736979265982736, 561.1128229684103, 3.8849606693466114], "isController": false}, {"data": ["Welcome-1", 2982, 10, 0.335345405767941, 84304.43058350107, 452, 375425, 91772.5, 137195.5, 149323.65, 159998.71000000002, 6.413510095578936, 760.0820464900173, 4.963557707611042], "isController": false}, {"data": ["Registration-1", 2986, 5, 0.16744809109176156, 95080.03315472184, 4592, 195056, 95870.0, 135159.30000000002, 148133.05000000002, 161943.06000000003, 4.716526639845962, 18.872150176790772, 3.752984602973023], "isController": false}, {"data": ["Welcome-2", 2982, 15, 0.5030181086519114, 84510.2598926895, 449, 394508, 91727.5, 136957.6, 149397.5, 162445.09000000003, 5.939316201865049, 503.7942739661467, 4.532600014340401], "isController": false}, {"data": ["Registration-0", 2986, 0, 0.0, 102790.08975217697, 1905, 185844, 108686.5, 141245.80000000002, 150024.65, 163296.16, 4.985241281671141, 2.3103214090736066, 4.677651680682441], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLProtocolException/Non HTTP response message: Illegal packet size: 61003", 1, 0.6535947712418301, 0.003044418059487929], "isController": false}, {"data": ["500", 28, 18.30065359477124, 0.08524370566566201], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Unsupported or unrecognized SSL message", 1, 0.6535947712418301, 0.003044418059487929], "isController": false}, {"data": ["Test failed: text expected to contain /You've successfully registered to our Survey app/", 24, 15.686274509803921, 0.07306603342771029], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 2, 1.3071895424836601, 0.006088836118975858], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 55, 35.947712418300654, 0.1674429932718361], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLProtocolException/Non HTTP response message: Illegal packet size: 35284", 1, 0.6535947712418301, 0.003044418059487929], "isController": false}, {"data": ["Assertion failed", 36, 23.529411764705884, 0.10959905014156544], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 5, 3.2679738562091503, 0.015222090297439645], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32847, 153, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 55, "Assertion failed", 36, "500", 28, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 24, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 5], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Welcome-3", 2982, 11, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 9, "500", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-4", 2981, 4, "500", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 1, null, null, null, null], "isController": false}, {"data": ["Registration", 3000, 56, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 24, "Assertion failed", 13, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 10, "500", 8, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Unsupported or unrecognized SSL message", 1], "isController": false}, {"data": ["Welcome", 3000, 41, "Assertion failed", 23, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 14, "500", 4, null, null, null, null], "isController": false}, {"data": ["Registration-3", 2981, 6, "500", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: javax.net.ssl.SSLProtocolException/Non HTTP response message: Illegal packet size: 35284", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-2", 2981, 5, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 2, "Non HTTP response code: javax.net.ssl.SSLProtocolException/Non HTTP response message: Illegal packet size: 61003", 1, "500", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, null, null], "isController": false}, {"data": ["Welcome-1", 2982, 10, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 6, "500", 4, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-1", 2986, 5, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 4, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-2", 2982, 15, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 9, "500", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 1, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
