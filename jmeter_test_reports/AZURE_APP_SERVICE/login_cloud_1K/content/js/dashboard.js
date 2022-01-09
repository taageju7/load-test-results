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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.15976190476190477, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.24, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.255, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.06, 500, 1500, "Login-1"], "isController": false}, {"data": [0.295, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.995, 500, 1500, "Login-2"], "isController": false}, {"data": [0.185, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.09, 500, 1500, "Login-3"], "isController": false}, {"data": [0.045, 500, 1500, "Login-4"], "isController": false}, {"data": [0.055, 500, 1500, "Login-5"], "isController": false}, {"data": [0.065, 500, 1500, "Login-6"], "isController": false}, {"data": [0.26, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.1, 500, 1500, "Login-7"], "isController": false}, {"data": [0.25, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.035, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.16, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.135, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2100, 6, 0.2857142857142857, 5565.61333333334, 83, 53911, 2878.5, 10565.800000000001, 27367.449999999943, 43333.12999999998, 32.34102844470455, 2693.591826141946, 41.745403675711884], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 100, 0, 0.0, 3508.37, 333, 11512, 2789.5, 7207.2, 8770.999999999998, 11509.529999999999, 6.290890790135883, 747.3504537304982, 4.865610845495722], "isController": false}, {"data": ["Login Welcome-0", 100, 0, 0.0, 2094.1600000000003, 343, 9614, 1686.0, 3686.4, 5469.649999999995, 9609.689999999999, 6.919457514530861, 20.51166415115555, 3.527301584555771], "isController": false}, {"data": ["Login", 100, 3, 3.0, 31448.13, 7990, 53911, 37374.5, 45547.3, 47287.95, 53867.66999999998, 1.7243163085836466, 667.6323399295617, 12.081243722410939], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 21153.520000000004, 2957, 44456, 25460.5, 31372.4, 33772.75, 44412.82999999998, 2.0671834625322996, 1.086078811369509, 1.867328811369509], "isController": false}, {"data": ["Logout-2", 100, 0, 0.0, 2099.9099999999985, 257, 11426, 1619.0, 3632.6000000000004, 5113.049999999995, 11366.559999999969, 1.9774178877222122, 234.91492777481167, 1.5294091475351486], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 3752.5299999999997, 883, 13133, 3098.0, 6616.000000000003, 10031.949999999997, 13121.429999999995, 1.9392246979657533, 9.296915905520972, 1.5074441988093161], "isController": false}, {"data": ["Logout-1", 100, 0, 0.0, 1605.4500000000005, 272, 5416, 1343.5, 2831.0, 3982.849999999994, 5413.259999999998, 1.9528580076942605, 5.3544925498467, 1.3368686165953874], "isController": false}, {"data": ["Login-2", 100, 0, 0.0, 114.88, 83, 901, 105.0, 125.9, 132.95, 893.7199999999963, 1.9849146486701073, 11.851336095672885, 1.14171360162763], "isController": false}, {"data": ["Logout-0", 100, 0, 0.0, 2573.7799999999993, 482, 8190, 2001.5, 5021.2, 6365.199999999997, 8186.339999999998, 1.9157822138779264, 1.0308554686003295, 1.4087734443848423], "isController": false}, {"data": ["Login-3", 100, 0, 0.0, 3663.5199999999995, 370, 11404, 3008.5, 6949.6, 8718.699999999997, 11388.799999999992, 1.8666816001194677, 101.28206025648205, 1.4783972438446176], "isController": false}, {"data": ["Login-4", 100, 0, 0.0, 4133.769999999999, 517, 11115, 3454.5, 8686.300000000001, 9743.649999999998, 11110.759999999998, 1.8764190419004372, 286.2418610324058, 1.4971038644850168], "isController": false}, {"data": ["Login-5", 100, 0, 0.0, 3775.9699999999993, 602, 11710, 3191.0, 7316.700000000001, 8849.65, 11692.669999999991, 1.9407677677289135, 41.328497991305355, 1.554130439001669], "isController": false}, {"data": ["Login-6", 100, 0, 0.0, 4021.67, 892, 15460, 3160.0, 7964.9000000000015, 10300.549999999992, 15432.349999999986, 1.8909310944709175, 160.87871863418047, 1.4994492663187353], "isController": false}, {"data": ["Logout-4", 100, 0, 0.0, 2109.970000000001, 195, 9427, 1566.0, 4221.3, 5020.15, 9416.349999999995, 1.983812093318521, 72.66486718378034, 1.5304800329312807], "isController": false}, {"data": ["Login-7", 100, 0, 0.0, 3904.36, 433, 10469, 3303.0, 7621.3, 8879.349999999997, 10461.979999999996, 1.8609844607797525, 13.321304782730063, 1.4793372569089047], "isController": false}, {"data": ["Logout-3", 100, 0, 0.0, 2194.7300000000005, 367, 12318, 1673.0, 4065.2000000000007, 5281.249999999996, 12305.259999999993, 1.9762064740524092, 168.20334732322834, 1.509173303426742], "isController": false}, {"data": ["Login-8", 100, 3, 3.0, 4261.950000000001, 681, 15004, 3473.0, 8519.800000000001, 9149.349999999999, 14961.409999999978, 1.9093443311566807, 106.08231332579142, 1.4740548447225723], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 7217.419999999997, 1770, 20779, 6653.0, 12831.400000000001, 13537.699999999999, 20743.81999999998, 1.89175384498969, 461.25111731711473, 7.053433769697888], "isController": false}, {"data": ["Login Welcome-3", 100, 0, 0.0, 2961.359999999999, 421, 10051, 2521.5, 5996.4000000000015, 7265.999999999998, 10033.15999999999, 6.20462865297512, 227.2687612458894, 4.786774058447602], "isController": false}, {"data": ["Login Welcome-2", 100, 0, 0.0, 3241.57, 463, 9559, 2315.0, 6805.700000000001, 8519.149999999998, 9555.999999999998, 5.806863712908658, 494.2468951425585, 4.4345384995064165], "isController": false}, {"data": ["Login Welcome", 100, 0, 0.0, 7040.859999999999, 1914, 14956, 7039.5, 11498.300000000001, 13338.35, 14947.129999999996, 5.088540606554041, 1239.091888309714, 14.341336123549766], "isController": false}]}, function(index, item){
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
