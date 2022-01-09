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

    var data = {"OkPercent": 99.80952380952381, "KoPercent": 0.19047619047619047};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.12666666666666668, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.095, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.145, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.09, 500, 1500, "Login-1"], "isController": false}, {"data": [0.19, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.99, 500, 1500, "Login-2"], "isController": false}, {"data": [0.14, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.11, 500, 1500, "Login-3"], "isController": false}, {"data": [0.07, 500, 1500, "Login-4"], "isController": false}, {"data": [0.07, 500, 1500, "Login-5"], "isController": false}, {"data": [0.06, 500, 1500, "Login-6"], "isController": false}, {"data": [0.165, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.08, 500, 1500, "Login-7"], "isController": false}, {"data": [0.13, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.04, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.09, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.085, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2100, 4, 0.19047619047619047, 7305.696666666672, 81, 67825, 4053.0, 15601.800000000005, 31229.499999999993, 52505.08999999998, 25.10820440469643, 2092.467080976948, 32.42839491319735], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 100, 0, 0.0, 4475.959999999999, 452, 15189, 3904.5, 8700.800000000001, 11674.349999999988, 15170.30999999999, 6.051803437424352, 718.9471564088598, 4.680691721132898], "isController": false}, {"data": ["Login Welcome-0", 100, 0, 0.0, 3202.350000000001, 473, 9816, 2550.5, 6815.5, 8865.649999999994, 9815.9, 7.814942169427946, 23.165121790989375, 3.9837888793372933], "isController": false}, {"data": ["Login", 100, 2, 2.0, 38310.55999999999, 6847, 67825, 45046.5, 55776.5, 59113.84999999999, 67785.21999999999, 1.306540541953017, 506.5733024363715, 9.164539795591732], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 25211.709999999995, 4066, 45143, 29914.5, 36510.0, 39525.69999999999, 45121.06999999999, 1.7290866964069578, 0.9084459401044368, 1.5619191349379258], "isController": false}, {"data": ["Logout-2", 100, 0, 0.0, 3351.89, 417, 11943, 2493.5, 7392.0, 9114.149999999998, 11939.519999999999, 1.4294086536399893, 169.8120729641647, 1.105558255549679], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 4873.5199999999995, 387, 20812, 3213.5, 11382.800000000001, 15368.699999999984, 20796.59999999999, 1.5632816408204102, 7.494378292661955, 1.2152072129814906], "isController": false}, {"data": ["Logout-1", 100, 0, 0.0, 2399.3399999999997, 240, 7995, 1974.0, 4902.800000000001, 6724.2999999999865, 7985.879999999996, 1.4324390139089829, 3.926967208785148, 0.9806052233888641], "isController": false}, {"data": ["Login-2", 100, 0, 0.0, 129.42000000000002, 81, 2114, 105.0, 138.9, 157.79999999999995, 2094.69999999999, 1.5770383220312252, 9.416027637596594, 0.9071050504652264], "isController": false}, {"data": ["Logout-0", 100, 0, 0.0, 4212.179999999999, 267, 13078, 3699.0, 7722.1, 10527.549999999988, 13070.999999999996, 1.42789827652678, 0.7683319827795467, 1.0500072287350248], "isController": false}, {"data": ["Login-3", 100, 0, 0.0, 4265.779999999999, 459, 16019, 3686.0, 7759.600000000001, 10522.899999999996, 16015.419999999998, 1.5344483658124903, 83.25581172318552, 1.2152711178456344], "isController": false}, {"data": ["Login-4", 100, 0, 0.0, 4771.98, 528, 17301, 4168.5, 8791.700000000003, 11335.499999999993, 17282.46999999999, 1.4142071247754946, 215.73287748723678, 1.128327364200761], "isController": false}, {"data": ["Login-5", 100, 0, 0.0, 4475.629999999996, 659, 15555, 3997.0, 8838.7, 10807.84999999999, 15543.909999999994, 1.4571099680892918, 31.029042933745206, 1.166826341634003], "isController": false}, {"data": ["Login-6", 100, 0, 0.0, 4908.64, 507, 16263, 4097.0, 10323.1, 12620.799999999996, 16258.549999999997, 1.52473888846535, 129.7234147480369, 1.2090702904627584], "isController": false}, {"data": ["Logout-4", 100, 0, 0.0, 3436.94, 191, 10312, 2878.0, 7124.900000000001, 9473.699999999995, 10307.529999999997, 1.4390766883967248, 52.711805105844086, 1.1102251795248168], "isController": false}, {"data": ["Login-7", 100, 0, 0.0, 4447.339999999999, 390, 13778, 3726.5, 9037.6, 10703.049999999996, 13770.909999999996, 1.4715187545065262, 10.533430147004724, 1.1697424474299927], "isController": false}, {"data": ["Logout-3", 100, 0, 0.0, 3806.7100000000005, 218, 14903, 3328.0, 8163.000000000004, 8747.499999999996, 14855.289999999975, 1.4255167498218104, 121.33180016037062, 1.0886270491803278], "isController": false}, {"data": ["Login-8", 100, 2, 2.0, 5121.93, 866, 15814, 4340.5, 10292.500000000005, 12579.199999999999, 15800.099999999993, 1.4937412242703074, 83.79001359304515, 1.1650889802975533], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 11500.440000000002, 2031, 22549, 11932.0, 18137.0, 19378.25, 22540.869999999995, 1.391846562834913, 339.36216293390817, 5.189521657132518], "isController": false}, {"data": ["Login Welcome-3", 100, 0, 0.0, 5419.580000000002, 424, 15919, 4819.5, 11379.5, 13026.899999999996, 15907.289999999994, 5.832944470368642, 213.65437616658892, 4.500025519132058], "isController": false}, {"data": ["Login Welcome-2", 100, 0, 0.0, 4665.72, 367, 14487, 4246.0, 8847.2, 10299.599999999991, 14460.459999999986, 6.112095837662735, 520.2265009015341, 4.667635688527596], "isController": false}, {"data": ["Login Welcome", 100, 0, 0.0, 10432.010000000002, 2061, 18613, 10914.0, 15910.400000000001, 17095.449999999997, 18606.399999999998, 5.149595756733096, 1253.9585002928832, 14.51341147844894], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 2, 50.0, 0.09523809523809523], "isController": false}, {"data": ["Assertion failed", 2, 50.0, 0.09523809523809523], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2100, 4, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 2, "Assertion failed", 2, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 100, 2, "Assertion failed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 100, 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
