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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.939672131147541, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.643, 500, 1500, "Session Test"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.4, 500, 1500, "Login"], "isController": false}, {"data": [0.9591666666666666, 500, 1500, "Session Test-0"], "isController": false}, {"data": [0.6833333333333333, 500, 1500, "Login-0"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Login-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "Login-2"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Login-3"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Login-4"], "isController": false}, {"data": [0.9793333333333333, 500, 1500, "Session Test-5"], "isController": false}, {"data": [1.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.9808333333333333, 500, 1500, "Session Test-6"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Login-6"], "isController": false}, {"data": [0.9795, 500, 1500, "Session Test-7"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Login-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.9731666666666666, 500, 1500, "Session Test-1"], "isController": false}, {"data": [0.9801666666666666, 500, 1500, "Session Test-2"], "isController": false}, {"data": [0.9823333333333333, 500, 1500, "Session Test-3"], "isController": false}, {"data": [0.9826666666666667, 500, 1500, "Session Test-4"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 27450, 0, 0.0, 255.30932604736014, 13, 2868, 206.0, 635.9000000000015, 906.0, 1358.9900000000016, 207.1026006654444, 17652.24927888968, 211.64225359883207], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Session Test", 3000, 0, 0.0, 726.7620000000004, 57, 2405, 689.0, 1243.8000000000002, 1431.8999999999996, 1726.9599999999991, 23.085091647813844, 8856.049642145008, 106.09222782676946], "isController": false}, {"data": ["Login Welcome-1", 30, 0, 0.0, 139.5666666666667, 18, 430, 116.0, 279.00000000000006, 388.19999999999993, 430.0, 0.5027062352330043, 59.74005767506745, 0.3029001436901989], "isController": false}, {"data": ["Login Welcome-0", 30, 0, 0.0, 123.6666666666667, 13, 340, 90.0, 271.70000000000005, 309.74999999999994, 340.0, 0.5023863350916855, 1.2917804885707107, 0.25070255589047974], "isController": false}, {"data": ["Login", 30, 0, 0.0, 1285.9333333333332, 472, 2868, 1177.5, 2566.9000000000015, 2814.1, 2868.0, 0.4938921997958579, 192.04400116476245, 2.7969539713048635], "isController": false}, {"data": ["Session Test-0", 3000, 0, 0.0, 225.22333333333364, 14, 1291, 172.0, 467.0, 583.8999999999996, 857.9899999999998, 23.093977090774725, 8.27531923814894, 13.170783809582462], "isController": false}, {"data": ["Login-0", 30, 0, 0.0, 673.3666666666667, 244, 1306, 693.5, 1137.0000000000002, 1245.5, 1306.0, 0.49857076381041016, 0.21374273956325202, 0.3651641336502028], "isController": false}, {"data": ["Login-1", 30, 0, 0.0, 182.13333333333333, 14, 1165, 123.0, 387.70000000000016, 743.1499999999994, 1165.0, 0.4974216975344465, 2.342836764852183, 0.3016590568055579], "isController": false}, {"data": ["Login-2", 30, 0, 0.0, 269.4999999999999, 90, 1654, 113.5, 1132.6000000000015, 1589.1, 1654.0, 0.4966805185344613, 2.9655319241403286, 0.2856883060710915], "isController": false}, {"data": ["Login-3", 30, 0, 0.0, 158.66666666666669, 16, 557, 108.0, 333.80000000000007, 492.6499999999999, 557.0, 0.49642573471008733, 26.953881273580222, 0.3083269211675933], "isController": false}, {"data": ["Login-4", 30, 0, 0.0, 169.86666666666667, 16, 843, 143.0, 349.9000000000002, 588.8999999999996, 843.0, 0.49629433562731606, 75.72705181519653, 0.3111532846413446], "isController": false}, {"data": ["Session Test-5", 3000, 0, 0.0, 195.4656666666674, 16, 1236, 158.5, 388.0, 474.89999999999964, 737.9499999999989, 23.093799314883952, 1965.6781563329932, 13.26089257534352], "isController": false}, {"data": ["Login-5", 30, 0, 0.0, 149.39999999999998, 21, 404, 136.5, 331.90000000000015, 379.79999999999995, 404.0, 0.4965489845573266, 10.592883366850389, 0.31276767093698793], "isController": false}, {"data": ["Session Test-6", 3000, 0, 0.0, 196.49033333333307, 14, 1233, 157.0, 380.0, 469.89999999999964, 740.9499999999989, 23.0943326507675, 166.19174935720775, 13.306304945266433], "isController": false}, {"data": ["Login-6", 30, 0, 0.0, 153.3, 16, 693, 108.0, 287.9000000000001, 513.1499999999997, 693.0, 0.4971084856418499, 42.3124761802184, 0.30923643100962733], "isController": false}, {"data": ["Session Test-7", 3000, 0, 0.0, 190.98999999999975, 16, 1161, 153.0, 369.9000000000001, 463.84999999999945, 710.9799999999996, 23.096999699739, 1321.1732692407631, 13.330397287642334], "isController": false}, {"data": ["Login-7", 30, 0, 0.0, 171.9, 24, 554, 143.5, 322.8, 495.1499999999999, 554.0, 0.4968779502128294, 3.5756773585140036, 0.3100634865097636], "isController": false}, {"data": ["Login-8", 30, 0, 0.0, 182.53333333333336, 21, 447, 163.0, 399.6, 429.95, 447.0, 0.4973474801061008, 28.448858691147215, 0.310842175066313], "isController": false}, {"data": ["Session Test-1", 3000, 0, 0.0, 196.10499999999985, 14, 1345, 152.0, 405.9000000000001, 510.0, 768.9199999999983, 23.095043803599747, 127.94570066513727, 13.013515893239312], "isController": false}, {"data": ["Session Test-2", 3000, 0, 0.0, 182.5000000000005, 15, 1085, 143.0, 366.0, 458.0, 715.9399999999987, 23.096821877309683, 1254.0607325517947, 13.240072697246859], "isController": false}, {"data": ["Session Test-3", 3000, 0, 0.0, 190.24400000000009, 16, 1053, 157.0, 377.0, 462.89999999999964, 681.9799999999996, 23.096821877309683, 3524.2259196384575, 13.37540563793422], "isController": false}, {"data": ["Session Test-4", 3000, 0, 0.0, 190.05833333333322, 15, 1328, 154.0, 373.0, 456.9499999999998, 688.9499999999989, 23.09539939644023, 492.69259157325865, 13.442244179959353], "isController": false}, {"data": ["Login Welcome-3", 30, 0, 0.0, 123.66666666666667, 17, 267, 111.5, 236.60000000000002, 251.04999999999998, 267.0, 0.5033641504052081, 18.456849370375345, 0.30231343017500295], "isController": false}, {"data": ["Login Welcome-2", 30, 0, 0.0, 132.99999999999994, 18, 370, 121.0, 294.3, 336.44999999999993, 370.0, 0.5026978115888602, 42.80589685478736, 0.29798590979925604], "isController": false}, {"data": ["Login Welcome", 30, 0, 0.0, 307.66666666666663, 42, 644, 284.0, 590.9000000000001, 632.4499999999999, 644.0, 0.5005673096175666, 121.7517548534172, 1.1487628687512514], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 27450, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
