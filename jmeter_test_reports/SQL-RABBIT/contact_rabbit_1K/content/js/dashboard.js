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

    var data = {"OkPercent": 98.68888888888888, "KoPercent": 1.3111111111111111};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.13577777777777778, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1105, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.1095, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.106, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.1165, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.1005, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.12, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.986, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [0.145, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.0625, 500, 1500, "Send Email-2"], "isController": false}, {"data": [0.058, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.028, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [0.0615, 500, 1500, "Send Email-4"], "isController": false}, {"data": [0.059, 500, 1500, "Send Email-3"], "isController": false}, {"data": [0.0605, 500, 1500, "Send Email-6"], "isController": false}, {"data": [0.0585, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.0565, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.005, 500, 1500, "Send Email"], "isController": false}, {"data": [0.2005, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18000, 236, 1.3111111111111111, 7282.006555555581, 4, 38593, 6371.0, 13267.9, 18584.700000000004, 27583.69000000005, 178.07677087455482, 15181.344951090721, 189.46282492827464], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 1000, 0, 0.0, 6725.460999999996, 17, 16143, 6547.5, 12537.5, 13057.3, 13884.68, 11.453835316755814, 82.4251098136461, 6.599377770396417], "isController": false}, {"data": ["Show Contact Page-5", 1000, 0, 0.0, 6757.439000000002, 14, 15517, 6510.5, 12701.0, 13217.8, 14228.36, 11.697821865568631, 995.6856970732049, 6.717108649369487], "isController": false}, {"data": ["Show Contact Page-4", 1000, 0, 0.0, 6735.676000000004, 20, 15661, 6501.5, 12626.9, 13134.55, 14140.92, 11.695906432748536, 249.50886330409358, 6.807383040935672], "isController": false}, {"data": ["Show Contact Page-3", 1000, 0, 0.0, 6681.188999999994, 19, 15017, 6438.5, 12629.3, 13135.699999999999, 13992.300000000001, 11.786892975011787, 1798.5026041666665, 6.825808138849599], "isController": false}, {"data": ["Show Contact Page-7", 1000, 118, 11.8, 6465.935, 4, 19654, 6244.5, 12699.6, 13135.9, 14074.380000000001, 11.729792499970674, 595.5222296062896, 5.970991306757534], "isController": false}, {"data": ["Show Contact Page-2", 1000, 0, 0.0, 6727.027000000003, 14, 15902, 6501.5, 12687.9, 13191.949999999999, 14279.91, 11.682925404521292, 634.3349312167767, 6.697145715287108], "isController": false}, {"data": ["Show Contact Page-1", 1000, 0, 0.0, 127.49800000000027, 75, 1815, 100.0, 129.0, 161.0, 1182.3900000000006, 13.675213675213675, 81.65064102564102, 7.211538461538462], "isController": false}, {"data": ["Show Contact Page-0", 1000, 0, 0.0, 5458.668000000011, 12, 14193, 5390.5, 10260.699999999999, 10993.849999999999, 11723.460000000001, 13.671661380290931, 81.38910915454446, 6.849181921962156], "isController": false}, {"data": ["Send Email-2", 1000, 0, 0.0, 6849.902999999992, 30, 15571, 6418.0, 12254.199999999999, 12851.3, 14041.6, 10.097032482153494, 548.2274501711447, 6.271203768212522], "isController": false}, {"data": ["Send Email-1", 1000, 0, 0.0, 7497.223000000002, 25, 16114, 7266.5, 12857.699999999999, 13488.85, 14925.740000000002, 10.21293979471991, 60.73906577133227, 6.343193075626819], "isController": false}, {"data": ["Show Contact Page", 1000, 118, 11.8, 13239.240999999985, 551, 30240, 13098.5, 23784.3, 24809.899999999998, 26249.59, 11.437329154895748, 4383.027329676724, 50.577366204693874], "isController": false}, {"data": ["Send Email-4", 1000, 0, 0.0, 6872.2810000000045, 33, 15981, 6516.0, 12370.8, 13058.649999999996, 14511.300000000001, 10.097644219603568, 215.41312302464834, 6.360332540668262], "isController": false}, {"data": ["Send Email-3", 1000, 0, 0.0, 6879.870000000002, 85, 21406, 6474.5, 12174.2, 12922.0, 14141.45, 10.098358006988063, 1540.8575620291642, 6.331197109849938], "isController": false}, {"data": ["Send Email-6", 1000, 0, 0.0, 6989.568999999992, 64, 23670, 6454.5, 12530.0, 13226.149999999998, 16318.900000000005, 10.095911155981828, 72.65309502776375, 6.300085184250379], "isController": false}, {"data": ["Send Email-5", 1000, 0, 0.0, 6904.1280000000015, 43, 22364, 6503.0, 12330.199999999999, 12921.449999999999, 14067.95, 10.098358006988063, 859.5438319229294, 6.281888721143942], "isController": false}, {"data": ["Send Email-7", 1000, 0, 0.0, 6969.584000000003, 42, 22678, 6455.5, 12391.9, 13210.449999999997, 15320.2, 10.095401544596436, 577.4687988996012, 6.309625965372772], "isController": false}, {"data": ["Send Email", 1000, 0, 0.0, 19357.904999999984, 626, 38593, 19890.0, 31371.199999999997, 33441.5, 35718.81, 10.081864741702626, 3871.879111510465, 51.9550783612937], "isController": false}, {"data": ["Send Email-0", 1000, 0, 0.0, 3837.521000000004, 28, 15625, 2429.5, 10090.299999999996, 12334.749999999996, 14287.42, 10.95866391969491, 4.034586228247052, 8.582859827729804], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 118, 50.0, 0.6555555555555556], "isController": false}, {"data": ["Assertion failed", 118, 50.0, 0.6555555555555556], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18000, 236, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 118, "Assertion failed", 118, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show Contact Page-7", 1000, 118, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 118, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show Contact Page", 1000, 118, "Assertion failed", 118, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
