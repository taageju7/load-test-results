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

    var data = {"OkPercent": 72.40967452971036, "KoPercent": 27.59032547028964};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7037462388313389, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.18733333333333332, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.205, 500, 1500, "Polls"], "isController": false}, {"data": [0.9825174825174825, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.9922538730634682, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.8354458041958042, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [0.8309222423146474, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.982298951048951, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.9770671834625323, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.8410852713178295, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.6313333333333333, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.49175824175824173, 500, 1500, "Save Poll-8"], "isController": false}, {"data": [0.8259043927648578, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.5977011494252874, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [0.7684108527131783, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.8065245478036176, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.3548387096774194, 500, 1500, "Save Poll-9"], "isController": false}, {"data": [0.7483850129198967, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.7270541958041958, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.7596899224806202, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.7716346153846154, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.6976744186046512, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.6729135432283858, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.6989664082687338, 500, 1500, "Polls-7"], "isController": false}, {"data": [0.7128935532233883, 500, 1500, "Save Poll-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 43537, 12012, 27.59032547028964, 103.34014746078057, 0, 5947, 19.0, 199.0, 315.0, 1097.9700000000048, 690.176122762797, 48042.3144418238, 520.5749230156465], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 3000, 2323, 77.43333333333334, 198.29, 2, 2751, 75.0, 475.9000000000001, 951.9499999999998, 1775.7999999999956, 51.26890540886952, 12245.706446130265, 157.9511530163206], "isController": false}, {"data": ["Polls", 3000, 2234, 74.46666666666667, 300.2373333333333, 2, 5947, 130.5, 347.0, 1768.199999999997, 4349.619999999992, 47.87819786463238, 11660.056363486292, 94.17013430333232], "isController": false}, {"data": ["Save Poll-0", 2288, 0, 0.0, 72.81381118881119, 3, 1458, 17.0, 182.0, 363.5499999999997, 920.4400000000005, 39.20560667591974, 14.421026400169639, 31.07307449900615], "isController": false}, {"data": ["Show New Poll Form-0", 2001, 0, 0.0, 44.79310344827588, 1, 1460, 9.0, 86.79999999999995, 181.89999999999986, 1154.2800000000034, 34.360189573459714, 56.707734745260666, 17.482088640402843], "isController": false}, {"data": ["Save Poll-2", 2288, 362, 15.821678321678322, 68.1241258741258, 2, 1030, 20.0, 171.0, 241.09999999999945, 546.1100000000001, 39.40275888198116, 1738.9907281136445, 20.30868907361324], "isController": false}, {"data": ["Show New Poll Form-1", 553, 77, 13.924050632911392, 168.69077757685346, 2, 1263, 126.0, 242.0, 765.6999999999991, 956.7200000000012, 9.961092297715973, 1193.2644206737698, 4.647097796130845], "isController": false}, {"data": ["Save Poll-1", 2288, 0, 0.0, 85.64903846153838, 3, 1900, 30.0, 199.0, 361.29999999999836, 815.2200000000003, 39.15729664048193, 1587.102820126517, 23.937956735294623], "isController": false}, {"data": ["Polls-0", 1548, 0, 0.0, 81.9618863049095, 3, 1372, 22.0, 130.10000000000014, 455.59999999999945, 1070.08, 25.190802427950725, 1081.7081076284358, 12.570800820979317], "isController": false}, {"data": ["Polls-2", 1548, 78, 5.038759689922481, 423.54328165374676, 4, 5040, 148.0, 802.1000000000001, 3049.7999999999993, 4289.26, 24.764037753959368, 143.83159631958887, 12.401140817469205], "isController": false}, {"data": ["Show New Poll Form", 3000, 1076, 35.86666666666667, 64.93333333333321, 1, 2245, 9.0, 156.9000000000001, 229.0, 1010.9799999999996, 51.51452709664125, 1236.471450085643, 21.91213674209252], "isController": false}, {"data": ["Save Poll-8", 546, 276, 50.54945054945055, 26.093406593406577, 2, 1232, 12.0, 42.0, 82.94999999999993, 270.38999999999555, 9.886110557859096, 267.19060496976226, 3.0549648961596265], "isController": false}, {"data": ["Polls-1", 1548, 100, 6.459948320413437, 438.2842377260973, 3, 5787, 144.0, 862.700000000001, 2889.2999999999997, 4499.0599999999995, 24.764830101746977, 3218.0592446666824, 12.55526792570551], "isController": false}, {"data": ["Save Poll-7", 2001, 789, 39.430284857571216, 44.032983508245884, 2, 1529, 14.0, 78.59999999999991, 200.6999999999996, 595.6200000000003, 34.45959909072122, 1024.1888248206844, 13.039315839834332], "isController": false}, {"data": ["Polls-4", 1548, 353, 22.80361757105943, 20.418604651162795, 3, 1304, 8.0, 27.0, 49.0, 346.51, 25.00201889687475, 2959.7050896390215, 9.933051486917549], "isController": false}, {"data": ["Polls-3", 1548, 295, 19.05684754521964, 16.582041343669243, 2, 579, 6.0, 23.100000000000136, 45.09999999999991, 261.15999999999985, 25.089954293494117, 1115.0146175726927, 10.332793531597458], "isController": false}, {"data": ["Save Poll-9", 62, 40, 64.51612903225806, 17.564516129032256, 2, 168, 10.0, 32.10000000000001, 47.049999999999926, 168.0, 1.2263628451618007, 26.93385490841839, 0.2719756309834639], "isController": false}, {"data": ["Polls-6", 1548, 385, 24.870801033591732, 20.591731266149853, 2, 1514, 8.0, 30.0, 51.549999999999955, 312.66999999999985, 25.006865580020353, 1615.18819955717, 9.577200165985493], "isController": false}, {"data": ["Save Poll-4", 2288, 613, 26.791958041958043, 40.590909090909086, 3, 1102, 14.0, 76.09999999999991, 175.0, 502.1100000000001, 39.4047947092863, 1435.2029993304802, 18.198719166566203], "isController": false}, {"data": ["Polls-5", 1548, 368, 23.772609819121445, 17.22674418604651, 1, 632, 6.0, 25.0, 46.0, 283.51, 24.99596318424027, 421.811357076538, 9.861814750524786], "isController": false}, {"data": ["Save Poll-3", 2288, 509, 22.246503496503497, 45.9187062937064, 3, 980, 15.0, 102.0, 223.09999999999945, 532.2200000000003, 39.40208031962527, 3779.6099508335055, 19.16324799157884], "isController": false}, {"data": ["Polls-8", 1548, 463, 29.90956072351421, 18.514857881136933, 0, 1202, 6.0, 25.0, 39.549999999999955, 341.0, 25.113562621674237, 1026.2262006458875, 9.024568690176833], "isController": false}, {"data": ["Save Poll-6", 2001, 647, 32.33383308345827, 40.68315842078962, 2, 1173, 14.0, 78.0, 188.0, 477.7800000000002, 34.45959909072122, 583.7409743479627, 14.543630420369222], "isController": false}, {"data": ["Polls-7", 1548, 462, 29.844961240310077, 18.85012919896639, 0, 627, 7.0, 30.0, 51.0, 356.53, 25.110303659486114, 146.09880642924344, 9.014510811380742], "isController": false}, {"data": ["Save Poll-5", 2001, 562, 28.085957021489257, 44.95552223888065, 3, 1493, 15.0, 89.0, 213.29999999999905, 539.6400000000003, 34.461379488504264, 1859.182479360415, 15.457051095754759], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, 0.024975024975024976, 0.006890690676895514], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 1, 0.008325008325008326, 0.0022968968922985047], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, 0.016650016650016652, 0.004593793784597009], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 2, 0.016650016650016652, 0.004593793784597009], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 9534, 79.37062937062937, 21.898614971173945], "isController": false}, {"data": ["Test failed: text expected to contain /Add a new Survey/", 287, 2.3892773892773893, 0.6592094080896709], "isController": false}, {"data": ["Assertion failed", 2183, 18.173493173493174, 5.014125915887636], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 43537, 12012, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 9534, "Assertion failed", 2183, "Test failed: text expected to contain /Add a new Survey/", 287, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Save Poll", 3000, 2323, "Assertion failed", 1324, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 712, "Test failed: text expected to contain /Add a new Survey/", 287, null, null, null, null], "isController": false}, {"data": ["Polls", 3000, 2234, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1452, "Assertion failed", 782, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-2", 2288, 362, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 362, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show New Poll Form-1", 553, 77, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 77, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-2", 1548, 78, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 76, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Show New Poll Form", 3000, 1076, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 999, "Assertion failed", 77, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-8", 546, 276, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 275, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-1", 1548, 100, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 99, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-7", 2001, 789, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 789, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-4", 1548, 353, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 353, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-3", 1548, 295, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 295, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-9", 62, 40, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 40, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-6", 1548, 385, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 385, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-4", 2288, 613, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 613, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-5", 1548, 368, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 368, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-3", 2288, 509, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 509, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-8", 1548, 463, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 460, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Save Poll-6", 2001, 647, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 647, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-7", 1548, 462, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 461, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-5", 2001, 562, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 562, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
