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

    var data = {"OkPercent": 99.99779249448123, "KoPercent": 0.002207505518763797};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.996948123620309, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9824242424242424, 500, 1500, "Session Test"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.995, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.495, 500, 1500, "Login"], "isController": false}, {"data": [0.9985858585858586, 500, 1500, "Session Test-0"], "isController": false}, {"data": [0.84, 500, 1500, "Login-0"], "isController": false}, {"data": [0.995, 500, 1500, "Login-1"], "isController": false}, {"data": [0.955, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.9998484848484849, 500, 1500, "Session Test-5"], "isController": false}, {"data": [1.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.99989898989899, 500, 1500, "Session Test-6"], "isController": false}, {"data": [1.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.9996969696969698, 500, 1500, "Session Test-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.99, 500, 1500, "Login-8"], "isController": false}, {"data": [0.9996969696969698, 500, 1500, "Session Test-1"], "isController": false}, {"data": [0.99989898989899, 500, 1500, "Session Test-2"], "isController": false}, {"data": [0.9997979797979798, 500, 1500, "Session Test-3"], "isController": false}, {"data": [0.9997474747474747, 500, 1500, "Session Test-4"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.985, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 90600, 2, 0.002207505518763797, 78.92033112582814, 2, 2690, 33.0, 124.0, 193.0, 298.0, 1209.9843743739734, 103130.32091379864, 1236.4981694979767], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Session Test", 9900, 0, 0.0, 252.02171717171737, 12, 1284, 247.0, 389.0, 460.0, 663.9599999999991, 136.54984069185252, 52384.001290176166, 627.5425295857988], "isController": false}, {"data": ["Login Welcome-1", 100, 0, 0.0, 57.420000000000016, 8, 290, 43.0, 127.80000000000001, 183.5999999999999, 289.7399999999999, 1.6841821611425492, 200.14301074929264, 1.0147855404540556], "isController": false}, {"data": ["Login Welcome-0", 100, 0, 0.0, 45.129999999999995, 4, 528, 27.0, 79.0, 106.49999999999989, 526.5699999999993, 1.6705367434556724, 4.295432856951939, 0.8336369881893053], "isController": false}, {"data": ["Login", 100, 1, 1.0, 833.7500000000001, 465, 2690, 751.5, 1138.5, 1275.0, 2680.129999999995, 1.6732201121057475, 649.6994576413871, 9.465131661507572], "isController": false}, {"data": ["Session Test-0", 9900, 0, 0.0, 102.14828282828265, 3, 870, 93.0, 183.0, 232.0, 364.9899999999998, 136.5667935772223, 48.92188534596921, 77.8857494620096], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 442.57999999999987, 197, 1015, 402.5, 649.6000000000001, 740.9499999999996, 1012.5499999999988, 1.6823404720647366, 0.7212377609730657, 1.2321829629380394], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 76.07, 5, 599, 56.0, 157.9, 194.5999999999999, 596.6699999999988, 1.6887898132198467, 7.954134051913399, 1.0241586660249267], "isController": false}, {"data": ["Login-2", 100, 0, 0.0, 311.0400000000001, 137, 2260, 263.5, 459.3000000000002, 835.0999999999982, 2246.509999999993, 1.6835016835016834, 10.051688762626263, 0.9683422769360269], "isController": false}, {"data": ["Login-3", 100, 0, 0.0, 44.85, 8, 143, 39.5, 83.40000000000003, 115.5499999999999, 142.89999999999995, 1.6883906260552441, 91.67268595512257, 1.0486488654014992], "isController": false}, {"data": ["Login-4", 100, 0, 0.0, 50.47, 8, 338, 42.5, 91.80000000000001, 126.64999999999992, 336.34999999999917, 1.6874504311435852, 257.47955812001146, 1.057952321088068], "isController": false}, {"data": ["Session Test-5", 9900, 0, 0.0, 46.93666666666651, 4, 713, 39.0, 84.0, 112.0, 208.95999999999913, 136.67614656100727, 11633.464170831377, 78.48200603307839], "isController": false}, {"data": ["Login-5", 100, 0, 0.0, 47.53, 7, 187, 38.0, 91.80000000000001, 125.59999999999991, 186.6499999999998, 1.688219603606037, 36.01480199294324, 1.0633805120370057], "isController": false}, {"data": ["Session Test-6", 9900, 0, 0.0, 45.74434343434334, 3, 674, 37.0, 82.0, 109.0, 199.98999999999978, 136.67614656100727, 983.5383817078306, 78.74895163183037], "isController": false}, {"data": ["Login-6", 100, 0, 0.0, 53.33, 9, 339, 39.0, 98.60000000000008, 131.69999999999993, 338.5999999999998, 1.688191103232886, 143.69407866970542, 1.0501735671478012], "isController": false}, {"data": ["Session Test-7", 9900, 0, 0.0, 46.62101010101, 3, 707, 38.0, 83.0, 110.0, 207.0, 136.67237285327738, 7817.7933041754095, 78.88024644168645], "isController": false}, {"data": ["Login-7", 100, 0, 0.0, 46.93999999999999, 6, 220, 38.0, 84.80000000000001, 124.29999999999984, 219.68999999999983, 1.6879916275615272, 12.147275687012593, 1.0533463379021641], "isController": false}, {"data": ["Login-8", 100, 1, 1.0, 50.15, 5, 210, 38.0, 113.60000000000002, 153.49999999999966, 209.69999999999985, 1.6856868331001467, 95.50454648176087, 1.0430187279807157], "isController": false}, {"data": ["Session Test-1", 9900, 0, 0.0, 67.96212121212119, 3, 765, 57.0, 124.0, 161.0, 283.9899999999998, 136.60448173087536, 756.7703275704755, 76.97342378780772], "isController": false}, {"data": ["Session Test-2", 9900, 0, 0.0, 45.51424242424256, 2, 716, 37.0, 80.0, 105.0, 205.97999999999956, 136.67048607755706, 7420.619463939354, 78.3452884057871], "isController": false}, {"data": ["Session Test-3", 9900, 0, 0.0, 46.115353535353606, 4, 720, 38.0, 82.0, 107.0, 202.0, 136.70634372669778, 20859.308653407992, 79.16685725579275], "isController": false}, {"data": ["Session Test-4", 9900, 0, 0.0, 45.962323232323314, 3, 708, 38.0, 83.0, 109.0, 197.0, 136.69690567913509, 2916.130348136987, 79.5618708835591], "isController": false}, {"data": ["Login Welcome-3", 100, 0, 0.0, 57.17000000000001, 7, 262, 40.0, 140.00000000000006, 173.39999999999986, 261.6399999999998, 1.68358671313366, 61.73206085745071, 1.0111385044699228], "isController": false}, {"data": ["Login Welcome-2", 100, 0, 0.0, 52.76999999999998, 6, 295, 38.0, 107.9, 151.24999999999983, 294.4299999999997, 1.68503353216729, 143.48455456138578, 0.9988431191655714], "isController": false}, {"data": ["Login Welcome", 100, 0, 0.0, 129.04000000000002, 20, 656, 103.0, 231.80000000000007, 317.39999999999986, 655.9399999999999, 1.6673614005835766, 405.54821019174653, 3.8264641517298874], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 50.0, 0.0011037527593818985], "isController": false}, {"data": ["Assertion failed", 1, 50.0, 0.0011037527593818985], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 90600, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Assertion failed", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 100, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 100, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
