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

    var data = {"OkPercent": 97.56686895931671, "KoPercent": 2.4331310406832998};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0668408631153068, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.015182186234817813, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.006578947368421052, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.0075910931174089065, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.0075910931174089065, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.011133603238866396, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.015182186234817813, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.9913967611336032, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [0.038461538461538464, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.015182186234817813, 500, 1500, "Send Email-2"], "isController": false}, {"data": [0.024, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.0, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [0.012651821862348178, 500, 1500, "Send Email-4"], "isController": false}, {"data": [0.010121457489878543, 500, 1500, "Send Email-3"], "isController": false}, {"data": [0.012295081967213115, 500, 1500, "Send Email-6"], "isController": false}, {"data": [0.0117827868852459, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.011270491803278689, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.001, 500, 1500, "Send Email"], "isController": false}, {"data": [0.0125, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 17796, 433, 2.4331310406832998, 45368.30568667101, 73, 261797, 37163.5, 87378.40000000002, 120913.09999999974, 195029.79999999993, 46.514545597114406, 3924.0436175965133, 55.42537274726209], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 988, 15, 1.5182186234817814, 40084.64574898781, 485, 204221, 33244.0, 82175.9, 88153.0, 152085.5, 4.21865259310498, 30.70118970513198, 2.7692496706846343], "isController": false}, {"data": ["Show Contact Page-5", 988, 7, 0.708502024291498, 39386.572874493926, 529, 172431, 33205.5, 81737.40000000001, 88993.2, 104883.11000000006, 4.5124663734476975, 380.9938598001132, 2.962202563439431], "isController": false}, {"data": ["Show Contact Page-4", 988, 16, 1.6194331983805668, 39876.396761133605, 448, 178396, 32714.5, 83372.7, 91119.19999999998, 152581.53, 4.5124663734476975, 94.61574367061507, 2.978874896379979], "isController": false}, {"data": ["Show Contact Page-3", 988, 15, 1.5182186234817814, 40632.74898785428, 506, 171881, 33597.5, 82748.3, 91861.54999999999, 153568.45, 4.507073093959701, 676.9947506697314, 2.956207503843329], "isController": false}, {"data": ["Show Contact Page-7", 988, 134, 13.562753036437247, 37729.01417004049, 270, 173120, 31564.5, 79007.80000000002, 86708.84999999999, 111830.60000000005, 4.22925290333075, 210.33575513888474, 2.430422529332951], "isController": false}, {"data": ["Show Contact Page-2", 988, 7, 0.708502024291498, 39311.92813765183, 290, 174830, 32914.0, 81895.6, 89890.7, 105143.36000000004, 4.3801315812807005, 235.77189341910722, 2.8710843984412406], "isController": false}, {"data": ["Show Contact Page-1", 988, 0, 0.0, 115.68927125506062, 73, 1033, 100.0, 120.0, 143.0, 787.8400000000006, 7.716700251495697, 46.07412630629364, 4.069353648249684], "isController": false}, {"data": ["Show Contact Page-0", 988, 0, 0.0, 21718.727732793534, 165, 69014, 20410.0, 43397.6, 48067.45, 59946.1, 7.69764162336094, 47.02860101401625, 3.939027549454231], "isController": false}, {"data": ["Send Email-2", 988, 0, 0.0, 42037.822874493955, 177, 107762, 41903.5, 70774.5, 77909.45, 91382.43000000001, 2.607293560671035, 143.34439786494852, 1.8469119701955734], "isController": false}, {"data": ["Send Email-1", 1000, 12, 1.2, 42755.223999999966, 89, 181727, 39243.5, 78204.7, 89732.0, 148836.05000000002, 2.7698299047455492, 16.343797909401633, 1.9391649490836016], "isController": false}, {"data": ["Show Contact Page", 1000, 182, 18.2, 75439.13600000007, 1589, 219173, 64138.5, 148222.3, 168458.14999999997, 190214.79, 4.26121231490359, 1593.7879264541386, 20.623718307233407], "isController": false}, {"data": ["Send Email-4", 988, 3, 0.30364372469635625, 42384.81072874491, 169, 168902, 41767.5, 71167.6, 80277.35, 97936.89000000001, 2.6086772844408768, 56.31164470848427, 1.8743473356110854], "isController": false}, {"data": ["Send Email-3", 988, 6, 0.6072874493927125, 42231.67408906887, 410, 167149, 42132.5, 70824.2, 79102.5, 93049.9, 2.6077271071649153, 393.22576001932697, 1.8563512993435811], "isController": false}, {"data": ["Send Email-6", 976, 1, 0.10245901639344263, 42047.36270491799, 223, 166099, 41781.0, 71112.20000000001, 80610.9, 96652.17, 2.5733239118742026, 18.867101707430734, 1.8352400362796486], "isController": false}, {"data": ["Send Email-5", 976, 1, 0.10245901639344263, 42116.95184426225, 215, 147868, 41707.5, 70907.90000000001, 80120.45, 97968.81, 2.5768228513495317, 218.85249805451193, 1.8250552871731778], "isController": false}, {"data": ["Send Email-7", 976, 1, 0.10245901639344263, 43688.524590163914, 491, 149111, 43242.5, 73026.8, 81094.2, 105639.73000000003, 2.57706779325368, 147.0055469832992, 1.8327710368671197], "isController": false}, {"data": ["Send Email", 1000, 33, 3.3, 138676.73599999992, 909, 261797, 162223.5, 202009.4, 209327.19999999998, 227995.45, 2.628749582686004, 990.1118865648552, 15.149435069392418], "isController": false}, {"data": ["Send Email-0", 1000, 0, 0.0, 44834.98999999998, 159, 117481, 40865.0, 84623.3, 90175.3, 100966.06000000001, 3.420007729217468, 1.350071430067682, 2.9698358524540267], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 102, 23.556581986143186, 0.5731625084288604], "isController": false}, {"data": ["500", 11, 2.540415704387991, 0.0618116430658575], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 129, 29.792147806004618, 0.724881995954147], "isController": false}, {"data": ["Assertion failed", 179, 41.339491916859124, 1.0058440098898629], "isController": false}, {"data": ["Test failed: text expected to contain /Thankyou for your feedback!/", 12, 2.771362586605081, 0.06743088334457181], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 17796, 433, "Assertion failed", 179, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 129, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 102, "Test failed: text expected to contain /Thankyou for your feedback!/", 12, "500", 11], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 988, 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-5", 988, 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-4", 988, 16, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 13, "500", 3, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-3", 988, 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-7", 988, 134, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 128, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "500", 1, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-2", 988, 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-1", 1000, 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 11, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 1000, 182, "Assertion failed", 170, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 11, "500", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 988, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 988, 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "500", 3, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-6", 976, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 976, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-7", 976, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email", 1000, 33, "Test failed: text expected to contain /Thankyou for your feedback!/", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 11, "Assertion failed", 9, "500", 1, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
