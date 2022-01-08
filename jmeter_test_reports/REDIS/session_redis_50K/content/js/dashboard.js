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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9808571428571429, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.88104, 500, 1500, "Session Test"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.975, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.265, 500, 1500, "Login"], "isController": false}, {"data": [0.97902, 500, 1500, "Session Test-0"], "isController": false}, {"data": [0.635, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.64, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login-3"], "isController": false}, {"data": [0.98, 500, 1500, "Login-4"], "isController": false}, {"data": [0.99513, 500, 1500, "Session Test-5"], "isController": false}, {"data": [0.99, 500, 1500, "Login-5"], "isController": false}, {"data": [0.99479, 500, 1500, "Session Test-6"], "isController": false}, {"data": [0.995, 500, 1500, "Login-6"], "isController": false}, {"data": [0.99508, 500, 1500, "Session Test-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.99, 500, 1500, "Login-8"], "isController": false}, {"data": [0.99999, 500, 1500, "Session Test-1"], "isController": false}, {"data": [0.99522, 500, 1500, "Session Test-2"], "isController": false}, {"data": [0.99486, 500, 1500, "Session Test-3"], "isController": false}, {"data": [0.99521, 500, 1500, "Session Test-4"], "isController": false}, {"data": [0.985, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.99, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.955, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 451500, 0, 0.0, 154.16182281284384, 2, 4236, 28.0, 176.0, 269.0, 431.9900000000016, 1988.0409320675626, 169474.01777355102, 2030.5841892954013], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Session Test", 50000, 0, 0.0, 398.28420000000216, 12, 3724, 383.0, 660.0, 748.0, 913.0, 223.19635029328, 85623.68234378069, 1025.7441645314216], "isController": false}, {"data": ["Login Welcome-1", 100, 0, 0.0, 35.37, 5, 233, 26.5, 67.80000000000001, 98.84999999999997, 232.95999999999998, 3.3800912624640866, 401.6796148808518, 2.036637020449552], "isController": false}, {"data": ["Login Welcome-0", 100, 0, 0.0, 88.98999999999998, 4, 3078, 23.0, 126.2000000000001, 436.3999999999994, 3053.2099999999873, 3.316859597333245, 8.528604804471126, 1.6551906779661016], "isController": false}, {"data": ["Login", 100, 0, 0.0, 1570.8799999999997, 480, 4236, 1475.0, 2328.7000000000007, 2717.5499999999997, 4232.399999999998, 3.2460155159541664, 1262.173826159639, 18.382464821306847], "isController": false}, {"data": ["Session Test-0", 50000, 0, 0.0, 92.3340199999995, 2, 896, 101.0, 509.0, 607.0, 745.0, 223.20631406021212, 79.94078772437814, 127.29735098746472], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 764.4000000000003, 190, 2093, 627.0, 1415.1000000000004, 1577.8, 2092.6699999999996, 3.283425269240872, 1.407640325387444, 2.4048524921197796], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 32.54, 4, 228, 25.0, 65.60000000000002, 77.84999999999997, 227.15999999999957, 3.3472803347280333, 15.765559623430962, 2.0299424686192467], "isController": false}, {"data": ["Login-2", 100, 0, 0.0, 752.1100000000002, 124, 2848, 678.0, 1275.2000000000003, 1574.1499999999987, 2839.4199999999955, 3.3185106524191945, 19.813841922745073, 1.9087917717528373], "isController": false}, {"data": ["Login-3", 100, 0, 0.0, 122.14, 5, 437, 84.5, 302.6, 345.79999999999995, 436.7499999999999, 3.329338127580237, 180.76940483919296, 2.067831102676788], "isController": false}, {"data": ["Login-4", 100, 0, 0.0, 130.41000000000003, 5, 725, 62.5, 342.80000000000007, 425.8499999999995, 723.4799999999992, 3.3304469459801505, 508.17611715679743, 2.0880341204289614], "isController": false}, {"data": ["Session Test-5", 50000, 0, 0.0, 141.81745999999947, 4, 2894, 56.0, 254.0, 308.0, 461.0, 223.2471748070028, 19002.11701109985, 128.19271365870864], "isController": false}, {"data": ["Login-5", 100, 0, 0.0, 141.73, 5, 715, 102.5, 378.70000000000016, 420.29999999999984, 713.4699999999992, 3.3250207813798838, 70.93269430590192, 2.0943734413965087], "isController": false}, {"data": ["Session Test-6", 50000, 0, 0.0, 140.4426400000002, 3, 3166, 54.0, 256.0, 313.0, 468.9900000000016, 223.24817159747462, 1606.5031172072433, 128.6293176196387], "isController": false}, {"data": ["Login-6", 100, 0, 0.0, 129.33, 5, 726, 94.0, 280.40000000000003, 359.39999999999964, 723.0199999999985, 3.32944897619444, 283.3933327784252, 2.0711513650740803], "isController": false}, {"data": ["Session Test-7", 50000, 0, 0.0, 143.6091599999998, 4, 2885, 56.0, 260.0, 311.0, 465.9900000000016, 223.25215884837607, 12770.23136789807, 128.84963464784204], "isController": false}, {"data": ["Login-7", 100, 0, 0.0, 115.33999999999997, 4, 435, 91.5, 249.40000000000003, 297.84999999999974, 434.3999999999997, 3.34817691766833, 24.094448931931563, 2.0893408695215454], "isController": false}, {"data": ["Login-8", 100, 0, 0.0, 125.48999999999998, 6, 652, 83.5, 292.8, 343.84999999999997, 650.9499999999995, 3.348625389277702, 191.54529643706258, 2.0928908682985634], "isController": false}, {"data": ["Session Test-1", 50000, 0, 0.0, 41.35847999999991, 3, 639, 18.0, 62.0, 69.0, 80.9900000000016, 223.21926828723858, 1236.585306731177, 125.77882597825844], "isController": false}, {"data": ["Session Test-2", 50000, 0, 0.0, 141.4326600000002, 3, 3157, 55.0, 255.0, 307.0, 464.9900000000016, 223.24617802543222, 12121.29073423017, 127.97412744231319], "isController": false}, {"data": ["Session Test-3", 50000, 0, 0.0, 142.21243999999908, 4, 3440, 56.0, 255.0, 306.0, 465.9900000000016, 223.24916839684772, 34064.4074722892, 129.28394224544013], "isController": false}, {"data": ["Session Test-4", 50000, 0, 0.0, 141.91920000000076, 3, 3132, 55.0, 256.0, 310.0, 462.9900000000016, 223.2471748070028, 4762.477201754332, 129.93683221188834], "isController": false}, {"data": ["Login Welcome-3", 100, 0, 0.0, 77.76000000000003, 6, 3095, 26.5, 82.50000000000003, 115.69999999999993, 3078.3999999999915, 3.3848965914091322, 124.11397687269404, 2.0329212926920084], "isController": false}, {"data": ["Login Welcome-2", 100, 0, 0.0, 64.46999999999998, 6, 2887, 24.0, 72.80000000000001, 140.69999999999948, 2860.3999999999864, 3.3848965914091322, 288.2318781098738, 2.0064767880716246], "isController": false}, {"data": ["Login Welcome", 100, 0, 0.0, 184.53999999999988, 20, 3783, 69.0, 244.50000000000009, 680.4499999999985, 3776.3899999999967, 3.3114775812967747, 805.4425427594542, 7.599582339890059], "isController": false}]}, function(index, item){
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
