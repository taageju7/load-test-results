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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7860655737704918, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.259, 500, 1500, "Session Test"], "isController": false}, {"data": [0.97, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.94, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.22, 500, 1500, "Login"], "isController": false}, {"data": [0.7735, 500, 1500, "Session Test-0"], "isController": false}, {"data": [0.52, 500, 1500, "Login-0"], "isController": false}, {"data": [0.88, 500, 1500, "Login-1"], "isController": false}, {"data": [0.92, 500, 1500, "Login-2"], "isController": false}, {"data": [0.95, 500, 1500, "Login-3"], "isController": false}, {"data": [0.91, 500, 1500, "Login-4"], "isController": false}, {"data": [0.8687, 500, 1500, "Session Test-5"], "isController": false}, {"data": [0.91, 500, 1500, "Login-5"], "isController": false}, {"data": [0.8645, 500, 1500, "Session Test-6"], "isController": false}, {"data": [0.92, 500, 1500, "Login-6"], "isController": false}, {"data": [0.8668, 500, 1500, "Session Test-7"], "isController": false}, {"data": [0.94, 500, 1500, "Login-7"], "isController": false}, {"data": [0.92, 500, 1500, "Login-8"], "isController": false}, {"data": [0.8172, 500, 1500, "Session Test-1"], "isController": false}, {"data": [0.8736, 500, 1500, "Session Test-2"], "isController": false}, {"data": [0.8731, 500, 1500, "Session Test-3"], "isController": false}, {"data": [0.8696, 500, 1500, "Session Test-4"], "isController": false}, {"data": [0.94, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.96, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.75, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 45750, 0, 0.0, 535.5941639344234, 14, 4840, 372.0, 1168.0, 1659.9500000000007, 2429.0, 203.83158832702162, 17372.110854310537, 208.29954123969705], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Session Test", 5000, 0, 0.0, 1611.9810000000032, 62, 4840, 1610.0, 2584.0, 2932.0, 3532.949999999999, 22.509848058525602, 8634.696090672482, 103.4485790658413], "isController": false}, {"data": ["Login Welcome-1", 50, 0, 0.0, 224.12000000000003, 19, 849, 148.5, 480.2, 660.7499999999997, 849.0, 0.8326394671107411, 98.94830479808493, 0.5016978039134056], "isController": false}, {"data": ["Login Welcome-0", 50, 0, 0.0, 250.57999999999998, 15, 1041, 183.0, 503.7, 878.4499999999998, 1041.0, 0.8358967500334359, 2.14933217074027, 0.4171320695967634], "isController": false}, {"data": ["Login", 50, 0, 0.0, 1918.7199999999993, 464, 4086, 1678.5, 3473.7999999999997, 3989.6499999999996, 4086.0, 0.7964700447616164, 309.69773215110627, 4.510478310129506], "isController": false}, {"data": ["Session Test-0", 5000, 0, 0.0, 520.9522000000002, 15, 2496, 430.0, 1086.9000000000005, 1298.9499999999998, 1702.9599999999991, 22.529321912469076, 8.074346163876035, 12.848753903205022], "isController": false}, {"data": ["Login-0", 50, 0, 0.0, 1005.8399999999999, 302, 2544, 879.0, 1837.1999999999998, 2190.4999999999986, 2544.0, 0.8167132193201678, 0.35013388992339234, 0.5981786274317636], "isController": false}, {"data": ["Login-1", 50, 0, 0.0, 326.8400000000001, 14, 1305, 174.0, 913.4999999999999, 1075.6499999999999, 1305.0, 0.8110431637171731, 3.8199816197343024, 0.49185332487144967], "isController": false}, {"data": ["Login-2", 50, 0, 0.0, 254.8799999999999, 86, 1701, 108.5, 1080.9999999999995, 1330.149999999998, 1701.0, 0.8100708001879364, 4.836692258153363, 0.46594892706122515], "isController": false}, {"data": ["Login-3", 50, 0, 0.0, 220.12000000000003, 17, 752, 192.5, 522.3999999999999, 635.1499999999992, 752.0, 0.807976342452693, 43.86980142971414, 0.5018290564452272], "isController": false}, {"data": ["Login-4", 50, 0, 0.0, 298.42, 26, 1191, 206.5, 741.5, 1007.5999999999997, 1191.0, 0.8017960230917255, 122.34201486329378, 0.5026885222899294], "isController": false}, {"data": ["Session Test-5", 5000, 0, 0.0, 378.7054, 18, 1738, 320.5, 745.0, 916.0, 1239.9699999999993, 22.517653840611036, 1916.6392364699861, 12.93005904128837], "isController": false}, {"data": ["Login-5", 50, 0, 0.0, 283.58000000000004, 23, 1175, 199.5, 645.4999999999999, 846.4499999999991, 1175.0, 0.8017445962414214, 17.1036237352479, 0.5050051411872234], "isController": false}, {"data": ["Session Test-6", 5000, 0, 0.0, 383.4947999999999, 15, 2081, 325.0, 750.0, 907.0, 1264.0, 22.522218168222953, 162.0762646999703, 12.976668671144084], "isController": false}, {"data": ["Login-6", 50, 0, 0.0, 293.8799999999999, 27, 1369, 202.0, 634.9, 758.3499999999997, 1369.0, 0.8011023167879001, 68.1875761047201, 0.49834196854872304], "isController": false}, {"data": ["Session Test-7", 5000, 0, 0.0, 378.95359999999994, 16, 2001, 316.0, 748.0, 911.0, 1260.9899999999998, 22.514510602083043, 1287.8563906312618, 12.994214615069412], "isController": false}, {"data": ["Login-7", 50, 0, 0.0, 286.3, 33, 1151, 204.0, 719.3999999999999, 910.8499999999989, 1151.0, 0.8031225404372199, 5.77950195359558, 0.5011672884173667], "isController": false}, {"data": ["Login-8", 50, 0, 0.0, 284.11999999999995, 27, 879, 263.0, 588.4, 729.1499999999997, 879.0, 0.8052696848174453, 46.06236964696977, 0.5032935530109034], "isController": false}, {"data": ["Session Test-1", 5000, 0, 0.0, 447.0744000000007, 16, 2608, 366.0, 907.0, 1113.9499999999998, 1501.9899999999998, 22.526987330822326, 124.80000699040576, 12.693429384652815], "isController": false}, {"data": ["Session Test-2", 5000, 0, 0.0, 367.3745999999995, 17, 2137, 304.0, 736.0, 903.9499999999998, 1323.9199999999983, 22.515828627525153, 1222.5168893341395, 12.90702285581764], "isController": false}, {"data": ["Session Test-3", 5000, 0, 0.0, 371.8957999999993, 17, 2158, 310.0, 736.8000000000011, 906.8499999999995, 1236.9899999999998, 22.519276500684587, 3435.4153219609107, 13.040948207915976], "isController": false}, {"data": ["Session Test-4", 5000, 0, 0.0, 373.30200000000093, 16, 1779, 314.0, 731.0, 891.0, 1236.9199999999983, 22.516031414367028, 480.33467406918726, 13.10503390914331], "isController": false}, {"data": ["Login Welcome-3", 50, 0, 0.0, 223.92, 17, 781, 161.5, 524.6, 600.4499999999995, 781.0, 0.8351846593281774, 30.623709378706135, 0.5016001616082316], "isController": false}, {"data": ["Login Welcome-2", 50, 0, 0.0, 247.81999999999996, 19, 1090, 205.0, 492.5, 720.4499999999991, 1090.0, 0.8324176738920521, 70.88231591083142, 0.4934350859887457], "isController": false}, {"data": ["Login Welcome", 50, 0, 0.0, 576.14, 45, 2132, 469.5, 1122.3, 1317.3999999999992, 2132.0, 0.8304544246611746, 201.98938601390182, 1.9058280253454691], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 45750, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
