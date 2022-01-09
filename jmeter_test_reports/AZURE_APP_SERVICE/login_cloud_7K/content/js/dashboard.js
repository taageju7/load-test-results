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

    var data = {"OkPercent": 99.71428571428571, "KoPercent": 0.2857142857142857};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.13476190476190475, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.205, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.115, 500, 1500, "Login-1"], "isController": false}, {"data": [0.33, 500, 1500, "Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login-2"], "isController": false}, {"data": [0.17, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.065, 500, 1500, "Login-3"], "isController": false}, {"data": [0.095, 500, 1500, "Login-4"], "isController": false}, {"data": [0.11, 500, 1500, "Login-5"], "isController": false}, {"data": [0.09, 500, 1500, "Login-6"], "isController": false}, {"data": [0.2, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.08, 500, 1500, "Login-7"], "isController": false}, {"data": [0.17, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.05, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.045, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.055, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2100, 6, 0.2857142857142857, 6231.880000000009, 79, 54412, 3626.5, 13373.70000000001, 25146.85, 43301.12999999994, 29.56455632047979, 2462.3458034608125, 38.161567440624516], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 100, 0, 0.0, 4808.809999999998, 635, 12455, 4486.0, 8843.700000000003, 10024.899999999996, 12448.129999999997, 7.473841554559043, 887.8836182735425, 5.78054932735426], "isController": false}, {"data": ["Login Welcome-0", 100, 0, 0.0, 4928.23, 3042, 14109, 4447.0, 6462.2, 8481.79999999999, 14102.069999999996, 7.035317292809906, 20.85174607781061, 3.5863629168425497], "isController": false}, {"data": ["Login", 100, 3, 3.0, 30971.090000000007, 7172, 54412, 33308.5, 47543.8, 50020.89999999999, 54390.81999999999, 1.6453051218348442, 637.0402432635038, 11.527660021347833], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 20663.71999999999, 3944, 39854, 24721.0, 30135.2, 31523.34999999999, 39843.24999999999, 2.0896894721444395, 1.0979032578258872, 1.887658947005475], "isController": false}, {"data": ["Logout-2", 100, 0, 0.0, 2451.5100000000016, 380, 8263, 2006.0, 4787.400000000001, 5826.399999999992, 8258.219999999998, 1.7506389832288787, 207.9738596775323, 1.3540098385910857], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 3620.459999999999, 446, 14264, 2696.5, 8650.500000000004, 9618.149999999998, 14238.799999999987, 1.964057743297653, 9.4159498367377, 1.526748011391535], "isController": false}, {"data": ["Logout-1", 100, 0, 0.0, 1986.2400000000002, 254, 14708, 1373.0, 4290.4, 5568.899999999997, 14662.069999999976, 1.7601915088361613, 4.826087578328522, 1.2049748512638176], "isController": false}, {"data": ["Login-2", 100, 0, 0.0, 105.58999999999997, 79, 200, 102.0, 123.0, 142.69999999999993, 199.76999999999987, 2.0018416943588098, 11.952402460263443, 1.1514499589622453], "isController": false}, {"data": ["Logout-0", 100, 0, 0.0, 3334.2799999999997, 203, 17037, 2605.0, 6976.1, 8468.69999999999, 16995.529999999977, 1.7815784785319793, 0.9586423258507036, 1.3100865179048637], "isController": false}, {"data": ["Login-3", 100, 0, 0.0, 4244.360000000001, 509, 14302, 3558.5, 8578.000000000002, 9808.449999999997, 14294.959999999995, 1.7930144158359034, 97.28503998422147, 1.4200534094169117], "isController": false}, {"data": ["Login-4", 100, 0, 0.0, 4210.3200000000015, 609, 12736, 3101.5, 8543.5, 10513.599999999997, 12735.55, 1.8089070583553417, 275.94311891755, 1.4432393229260883], "isController": false}, {"data": ["Login-5", 100, 0, 0.0, 3760.2499999999995, 350, 13600, 3230.5, 7219.100000000001, 11449.24999999998, 13584.419999999993, 1.9428416001243418, 41.37266009014785, 1.5557911250995706], "isController": false}, {"data": ["Login-6", 100, 0, 0.0, 4064.5099999999993, 444, 12326, 3908.5, 7281.600000000002, 8511.149999999998, 12307.73999999999, 1.8512347735939874, 157.50139131863452, 1.467971324373357], "isController": false}, {"data": ["Logout-4", 100, 0, 0.0, 2461.6799999999994, 422, 9698, 2125.5, 4954.500000000001, 6347.699999999998, 9674.299999999988, 1.7607183730962233, 64.49318822079408, 1.3583667136191566], "isController": false}, {"data": ["Login-7", 100, 0, 0.0, 3612.8399999999992, 381, 9557, 3368.0, 6888.8, 7734.1999999999925, 9551.729999999998, 1.877687440148713, 13.440868101845767, 1.4926148205869652], "isController": false}, {"data": ["Logout-3", 100, 0, 0.0, 2449.3700000000003, 251, 8256, 2164.5, 4657.8, 5350.249999999999, 8236.36999999999, 1.766815668121345, 150.3812042836446, 1.3492674340536053], "isController": false}, {"data": ["Login-8", 100, 3, 3.0, 4026.93, 503, 15116, 3253.0, 8190.000000000002, 10339.399999999994, 15098.74999999999, 1.8414849734826164, 102.31207789711623, 1.421665962682307], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 8639.619999999999, 1597, 22366, 8254.5, 15081.700000000003, 18631.14999999998, 22350.16999999999, 1.7212592732843348, 419.6806633733239, 6.417742095116787], "isController": false}, {"data": ["Login Welcome-3", 100, 0, 0.0, 4203.830000000002, 745, 10467, 3977.0, 7219.800000000001, 8270.949999999999, 10464.099999999999, 6.500682571670025, 238.11289247871028, 5.015175030878242], "isController": false}, {"data": ["Login Welcome-2", 100, 0, 0.0, 4932.280000000002, 980, 13057, 4864.0, 8898.9, 9820.199999999993, 13028.299999999985, 6.809669731018046, 579.5999851038474, 5.200353251617297], "isController": false}, {"data": ["Login Welcome", 100, 0, 0.0, 11393.560000000005, 4756, 19107, 12018.0, 15980.1, 16928.199999999997, 19099.679999999997, 5.233410090014654, 1274.3660214308143, 14.749630390412392], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 3, 50.0, 0.14285714285714285], "isController": false}, {"data": ["Assertion failed", 3, 50.0, 0.14285714285714285], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2100, 6, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 3, "Assertion failed", 3, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 100, 3, "Assertion failed", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 100, 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
