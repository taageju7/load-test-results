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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.999564738292011, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.999625, 500, 1500, "Session Test"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.52, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-0"], "isController": false}, {"data": [0.835, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.95, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.999975, 500, 1500, "Session Test-5"], "isController": false}, {"data": [1.0, 500, 1500, "Login-5"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-6"], "isController": false}, {"data": [1.0, 500, 1500, "Login-6"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-8"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-1"], "isController": false}, {"data": [0.999975, 500, 1500, "Session Test-2"], "isController": false}, {"data": [0.999975, 500, 1500, "Session Test-3"], "isController": false}, {"data": [0.999975, 500, 1500, "Session Test-4"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 181500, 0, 0.0, 68.02982920110183, 2, 1521, 25.0, 105.0, 133.0, 184.0, 2056.7038346478107, 175308.72118737816, 2101.1210062834284], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Session Test", 20000, 0, 0.0, 163.46989999999988, 11, 854, 153.0, 270.0, 304.0, 384.0, 230.76035537094728, 88521.00462331978, 1060.506086304373], "isController": false}, {"data": ["Login Welcome-1", 100, 0, 0.0, 15.449999999999996, 6, 38, 14.0, 25.900000000000006, 28.94999999999999, 37.97999999999999, 1.673388108904098, 198.8602788910457, 1.008281702337723], "isController": false}, {"data": ["Login Welcome-0", 100, 0, 0.0, 11.249999999999998, 3, 60, 9.5, 17.0, 24.94999999999999, 59.74999999999987, 1.671402306535183, 4.297658469831188, 0.8340689244526158], "isController": false}, {"data": ["Login", 100, 0, 0.0, 766.4399999999999, 446, 1521, 748.0, 1035.9, 1100.9499999999998, 1518.7899999999988, 1.6676672670268828, 648.4522223750918, 9.444143048328998], "isController": false}, {"data": ["Session Test-0", 20000, 0, 0.0, 15.632849999999937, 2, 188, 14.0, 27.0, 32.0, 42.0, 230.781657473864, 82.66211329648519, 131.61766402806305], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 456.68000000000006, 183, 783, 451.5, 606.8, 647.1999999999998, 782.3599999999997, 1.6740604335816525, 0.7176880179124466, 1.2261184816271868], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 13.949999999999998, 3, 42, 12.5, 24.80000000000001, 27.0, 41.93999999999997, 1.6787536932581253, 7.906864318929627, 1.0180723081184528], "isController": false}, {"data": ["Login-2", 100, 0, 0.0, 282.8300000000001, 110, 838, 233.0, 523.6000000000003, 670.2499999999998, 837.93, 1.6732481092296367, 9.990467714677733, 0.9624444690783749], "isController": false}, {"data": ["Login-3", 100, 0, 0.0, 68.84000000000002, 5, 417, 43.5, 141.70000000000002, 216.69999999999948, 415.85999999999945, 1.6751541141785045, 90.95399765059636, 1.0404277506030555], "isController": false}, {"data": ["Login-4", 100, 0, 0.0, 62.720000000000006, 6, 266, 41.5, 147.40000000000003, 213.6999999999997, 265.8299999999999, 1.6782747335738861, 256.0794846647646, 1.0521995888226903], "isController": false}, {"data": ["Session Test-5", 20000, 0, 0.0, 69.32014999999974, 4, 544, 49.0, 157.0, 199.0, 273.0, 230.79763663220086, 19643.81477434843, 132.5283304098966], "isController": false}, {"data": ["Login-5", 100, 0, 0.0, 56.98, 5, 257, 36.0, 136.4000000000001, 190.39999999999986, 256.6199999999998, 1.6782747335738861, 35.80264800285307, 1.0571164093312075], "isController": false}, {"data": ["Session Test-6", 20000, 0, 0.0, 67.0619000000003, 3, 463, 46.0, 153.0, 196.0, 268.0, 230.80296351005148, 1660.8813747598208, 132.98217624114295], "isController": false}, {"data": ["Login-6", 100, 0, 0.0, 54.17999999999998, 5, 265, 35.0, 136.00000000000006, 158.79999999999995, 264.5499999999998, 1.6783029001074115, 142.8524226302363, 1.0440224095394737], "isController": false}, {"data": ["Session Test-7", 20000, 0, 0.0, 69.75240000000021, 4, 466, 50.0, 156.90000000000146, 200.0, 274.0, 230.80030004039006, 13202.004491590214, 133.2060325428423], "isController": false}, {"data": ["Login-7", 100, 0, 0.0, 66.31, 5, 429, 34.0, 153.70000000000002, 197.5499999999999, 427.35999999999916, 1.6752383026485518, 12.055499074430838, 1.0453879642504147], "isController": false}, {"data": ["Login-8", 100, 0, 0.0, 58.46, 5, 337, 38.5, 132.60000000000002, 157.4999999999999, 336.2499999999996, 1.6791201410460919, 96.04763978675174, 1.0494500881538074], "isController": false}, {"data": ["Session Test-1", 20000, 0, 0.0, 14.361349999999993, 2, 181, 12.0, 26.0, 30.0, 41.0, 230.7923100002308, 1278.5526599534953, 130.04605749036443], "isController": false}, {"data": ["Session Test-2", 20000, 0, 0.0, 68.09574999999953, 4, 517, 48.0, 157.0, 198.0, 269.0, 230.79763663220086, 12531.31176766828, 132.30294209287297], "isController": false}, {"data": ["Session Test-3", 20000, 0, 0.0, 69.95460000000027, 4, 508, 49.0, 159.0, 200.0, 278.0, 230.80030004039006, 35213.084731658586, 133.65681437885868], "isController": false}, {"data": ["Session Test-4", 20000, 0, 0.0, 69.82074999999992, 3, 580, 50.0, 158.0, 200.0, 271.0, 230.80030004039006, 4923.612640012838, 134.33298713288326], "isController": false}, {"data": ["Login Welcome-3", 100, 0, 0.0, 15.93, 6, 50, 14.0, 28.0, 33.89999999999998, 49.889999999999944, 1.673416111650323, 61.35913549231902, 1.0050301842431137], "isController": false}, {"data": ["Login Welcome-2", 100, 0, 0.0, 15.979999999999995, 7, 51, 15.0, 25.900000000000006, 29.0, 50.93999999999997, 1.673388108904098, 142.4929194765642, 0.9919400215867066], "isController": false}, {"data": ["Login Welcome", 100, 0, 0.0, 34.21000000000001, 13, 87, 32.0, 47.900000000000006, 61.74999999999994, 86.96999999999998, 1.67117884956048, 406.47671891189543, 3.8352248988936797], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 181500, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
