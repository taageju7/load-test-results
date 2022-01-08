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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.950420819490587, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.55376, 500, 1500, "Session Test"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.545, 500, 1500, "Login"], "isController": false}, {"data": [0.99993, 500, 1500, "Session Test-0"], "isController": false}, {"data": [0.805, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.97, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.99999, 500, 1500, "Session Test-5"], "isController": false}, {"data": [1.0, 500, 1500, "Login-5"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-6"], "isController": false}, {"data": [1.0, 500, 1500, "Login-6"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.99999, 500, 1500, "Session Test-1"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-2"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-3"], "isController": false}, {"data": [1.0, 500, 1500, "Session Test-4"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.995, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 451500, 0, 0.0, 212.07710077519255, 3, 1249, 81.0, 225.0, 378.0, 472.0, 1399.201695776673, 119277.39341885172, 1429.1440358446653], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Session Test", 50000, 0, 0.0, 589.7171399999995, 18, 1249, 623.0, 697.0, 723.0, 793.0, 155.67885320729573, 59722.28968103155, 715.4537921811853], "isController": false}, {"data": ["Login Welcome-1", 100, 0, 0.0, 79.97000000000003, 6, 266, 72.5, 170.90000000000006, 188.39999999999986, 265.87999999999994, 3.330114222917846, 395.74049772719707, 2.006523901894835], "isController": false}, {"data": ["Login Welcome-0", 100, 0, 0.0, 57.03999999999998, 3, 245, 43.5, 129.70000000000002, 169.0999999999998, 244.28999999999962, 3.3370040377748857, 8.580401983848901, 1.6652432258818033], "isController": false}, {"data": ["Login", 100, 0, 0.0, 821.1699999999997, 419, 1240, 850.0, 1101.5, 1178.55, 1239.93, 3.2436991144701417, 1261.2731214927503, 18.36934684063706], "isController": false}, {"data": ["Session Test-0", 50000, 0, 0.0, 209.85427999999982, 3, 810, 219.0, 258.0, 271.0, 301.0, 155.68418528908998, 55.75772843053994, 88.78863692268412], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 449.25, 172, 787, 449.0, 630.6000000000001, 647.0, 786.1399999999995, 3.3021827427929864, 1.4156818594591023, 2.4185908760690817], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 109.33999999999999, 4, 284, 109.5, 217.60000000000002, 233.89999999999998, 283.86999999999995, 3.3005478909498978, 15.545451638722028, 2.001601797148327], "isController": false}, {"data": ["Login-2", 100, 0, 0.0, 227.18, 117, 859, 189.0, 300.6, 550.3999999999999, 858.91, 3.277291646183594, 19.567735473404777, 1.8850827925802116], "isController": false}, {"data": ["Login-3", 100, 0, 0.0, 78.10999999999999, 5, 255, 68.5, 165.0, 204.5999999999999, 254.7499999999999, 3.2790110502672394, 178.03685096075023, 2.0365732695019183], "isController": false}, {"data": ["Login-4", 100, 0, 0.0, 83.97999999999998, 5, 286, 79.5, 168.60000000000002, 192.84999999999997, 285.6999999999998, 3.280624630929729, 500.5739811610131, 2.0567978643133653], "isController": false}, {"data": ["Session Test-5", 50000, 0, 0.0, 150.92256000000086, 4, 535, 158.0, 194.0, 205.0, 226.0, 155.68757862222722, 13251.649403468447, 89.39872678698202], "isController": false}, {"data": ["Login-5", 100, 0, 0.0, 78.71000000000001, 4, 362, 66.0, 177.60000000000008, 206.74999999999994, 360.91999999999945, 3.280624630929729, 69.98559088150384, 2.0664090692867925], "isController": false}, {"data": ["Session Test-6", 50000, 0, 0.0, 150.29121999999987, 3, 442, 157.0, 194.0, 205.0, 228.0, 155.6890329531407, 1120.3428970673635, 89.70364203354787], "isController": false}, {"data": ["Login-6", 100, 0, 0.0, 83.50999999999999, 5, 284, 78.0, 173.8, 207.79999999999995, 283.6399999999998, 3.2826707809473787, 279.41170436266947, 2.042052038538555], "isController": false}, {"data": ["Session Test-7", 50000, 0, 0.0, 151.00652000000014, 3, 413, 158.0, 194.0, 205.0, 230.0, 155.68757862222722, 8905.474025133035, 89.85484273997683], "isController": false}, {"data": ["Login-7", 100, 0, 0.0, 77.02999999999997, 5, 256, 66.0, 169.0, 179.84999999999997, 255.45999999999972, 3.282886313646958, 23.62459887232855, 2.0485980023636783], "isController": false}, {"data": ["Login-8", 100, 0, 0.0, 85.57999999999997, 5, 325, 70.5, 175.10000000000005, 197.95, 324.93999999999994, 3.2639206214504863, 186.70008445394606, 2.0399503884065537], "isController": false}, {"data": ["Session Test-1", 50000, 0, 0.0, 208.01547999999985, 3, 502, 218.0, 262.0, 275.0, 306.0, 155.6846700419103, 862.4593839372732, 87.72466270916236], "isController": false}, {"data": ["Session Test-2", 50000, 0, 0.0, 149.69986000000074, 3, 485, 156.0, 193.0, 203.0, 227.0, 155.68709385129392, 8453.130071993604, 89.24641024483353], "isController": false}, {"data": ["Session Test-3", 50000, 0, 0.0, 150.63187999999886, 4, 445, 157.0, 194.0, 204.0, 226.0, 155.68709385129392, 23755.470157265372, 90.15863931036846], "isController": false}, {"data": ["Session Test-4", 50000, 0, 0.0, 149.88230000000019, 3, 428, 156.0, 194.0, 205.0, 228.0, 155.68757862222722, 3321.246148070369, 90.61503599496818], "isController": false}, {"data": ["Login Welcome-3", 100, 0, 0.0, 66.99999999999999, 4, 209, 59.5, 147.70000000000007, 172.74999999999994, 208.7499999999999, 3.330114222917846, 122.1052721952113, 2.0000197725531987], "isController": false}, {"data": ["Login Welcome-2", 100, 0, 0.0, 71.25, 5, 254, 60.5, 140.9, 177.89999999999998, 253.5899999999998, 3.3210454651124173, 282.7948050546312, 1.968627536448474], "isController": false}, {"data": ["Login Welcome", 100, 0, 0.0, 148.37, 12, 511, 134.0, 310.30000000000007, 335.9, 510.13999999999953, 3.313342831582784, 805.8962229962559, 7.6038629435737715], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 451500, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
