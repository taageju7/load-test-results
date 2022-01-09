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

    var data = {"OkPercent": 99.61904761904762, "KoPercent": 0.38095238095238093};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.13476190476190475, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.205, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.105, 500, 1500, "Login-1"], "isController": false}, {"data": [0.325, 500, 1500, "Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login-2"], "isController": false}, {"data": [0.22, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.095, 500, 1500, "Login-3"], "isController": false}, {"data": [0.05, 500, 1500, "Login-4"], "isController": false}, {"data": [0.065, 500, 1500, "Login-5"], "isController": false}, {"data": [0.08, 500, 1500, "Login-6"], "isController": false}, {"data": [0.225, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.095, 500, 1500, "Login-7"], "isController": false}, {"data": [0.23, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.03, 500, 1500, "Login-8"], "isController": false}, {"data": [0.005, 500, 1500, "Logout"], "isController": false}, {"data": [0.035, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.035, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2100, 8, 0.38095238095238093, 6316.071428571426, 80, 55878, 3266.5, 12989.2, 30215.39999999997, 47985.97, 29.805413230764866, 2480.8896350344894, 38.449870133556644], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 100, 0, 0.0, 4833.110000000001, 691, 15043, 4388.5, 8415.800000000001, 9890.699999999999, 15004.08999999998, 6.067224851352991, 720.7792023116127, 4.6926192209683295], "isController": false}, {"data": ["Login Welcome-0", 100, 0, 0.0, 3595.5299999999997, 1742, 12396, 3110.5, 5694.6, 6709.449999999997, 12360.179999999982, 8.067118425298483, 23.91207345111326, 4.112339666021297], "isController": false}, {"data": ["Login", 100, 4, 4.0, 34801.340000000004, 6027, 55878, 40987.0, 50687.700000000004, 52355.24999999999, 55877.1, 1.530596626565035, 591.8083245802338, 10.711784828726238], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 24332.75999999999, 3472, 42438, 28638.5, 36034.700000000004, 36559.95, 42385.81999999997, 1.9228180821812448, 1.0102305939585057, 1.7369206308766127], "isController": false}, {"data": ["Logout-2", 100, 0, 0.0, 2231.3199999999997, 320, 5272, 1890.5, 4208.8, 4594.749999999996, 5270.919999999999, 1.6858857643806056, 200.2812531610358, 1.3039272708881247], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 3988.8699999999985, 547, 18960, 2959.0, 8551.000000000002, 9852.399999999996, 18913.719999999976, 1.7122114923635368, 8.208348582716937, 1.330976902266968], "isController": false}, {"data": ["Logout-1", 100, 0, 0.0, 1767.1299999999999, 284, 8333, 1165.5, 3236.1000000000004, 5572.149999999995, 8327.789999999997, 1.6748174448985063, 4.5922545712048635, 1.1465303016346218], "isController": false}, {"data": ["Login-2", 100, 0, 0.0, 107.34, 80, 162, 107.0, 121.0, 129.69999999999993, 161.88999999999993, 1.7252385142245916, 10.300886988251126, 0.9923491063264496], "isController": false}, {"data": ["Logout-0", 100, 0, 0.0, 2570.4100000000003, 274, 13065, 1895.0, 5007.7, 7426.949999999981, 13027.479999999981, 1.6734721199544815, 0.9004718145458197, 1.2305903382087153], "isController": false}, {"data": ["Login-3", 100, 0, 0.0, 3550.7000000000003, 291, 14100, 2889.5, 7677.000000000001, 9419.6, 14092.469999999996, 1.6780775943079607, 91.0488194724124, 1.3290243447106995], "isController": false}, {"data": ["Login-4", 100, 0, 0.0, 3987.0799999999995, 373, 12322, 2916.5, 8784.700000000004, 10595.65, 12320.429999999998, 1.6678619677435493, 254.4271311106293, 1.3307062769985156], "isController": false}, {"data": ["Login-5", 100, 0, 0.0, 4152.93, 485, 14371, 3277.5, 8559.1, 9257.949999999997, 14365.369999999997, 1.6625933130496948, 35.40479471129067, 1.331373551465576], "isController": false}, {"data": ["Login-6", 100, 0, 0.0, 3433.470000000001, 278, 10867, 2834.0, 7376.600000000006, 8463.749999999996, 10854.859999999993, 1.6848915772270054, 143.3490616206972, 1.336066367879227], "isController": false}, {"data": ["Logout-4", 100, 0, 0.0, 2196.459999999999, 235, 11634, 1709.0, 4117.500000000001, 4599.349999999999, 11589.889999999978, 1.6825669240994061, 61.630586122188014, 1.2980740918345026], "isController": false}, {"data": ["Login-7", 100, 0, 0.0, 3513.6999999999994, 453, 11336, 2853.0, 7030.4, 8210.8, 11316.71999999999, 1.639881928501148, 11.738607945227944, 1.3035780173827485], "isController": false}, {"data": ["Logout-3", 100, 0, 0.0, 2151.4499999999994, 290, 11079, 1684.5, 4662.000000000002, 5175.899999999999, 11038.89999999998, 1.685260709831811, 143.43971453790152, 1.28698620614109], "isController": false}, {"data": ["Login-8", 100, 4, 4.0, 3681.0399999999995, 670, 11535, 3017.5, 7205.4000000000015, 9659.699999999997, 11527.349999999997, 1.6344943691668983, 89.93811651084488, 1.2488558539415833], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 7393.4, 1337, 20949, 7203.5, 11886.800000000003, 14589.35, 20929.76999999999, 1.6490493230652528, 402.0745394772101, 6.148506167444468], "isController": false}, {"data": ["Login Welcome-3", 100, 0, 0.0, 4763.470000000002, 764, 13871, 3671.0, 9555.7, 11620.3, 13868.22, 6.569438969911969, 240.6313641440021, 5.06821951780318], "isController": false}, {"data": ["Login Welcome-2", 100, 0, 0.0, 5024.330000000002, 638, 14986, 4784.0, 8587.800000000001, 9995.349999999993, 14960.349999999988, 6.0437567992264, 514.4098743654056, 4.615447086909223], "isController": false}, {"data": ["Login Welcome", 100, 0, 0.0, 10561.66, 3568, 18771, 10570.5, 16553.600000000002, 17191.7, 18770.39, 5.326799126404943, 1297.1082555398712, 15.012834256645181], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 4, 50.0, 0.19047619047619047], "isController": false}, {"data": ["Assertion failed", 4, 50.0, 0.19047619047619047], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2100, 8, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 4, "Assertion failed", 4, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 100, 4, "Assertion failed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 100, 4, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
