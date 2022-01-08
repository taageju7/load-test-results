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

    var data = {"OkPercent": 73.76282918291034, "KoPercent": 26.237170817089666};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03724441085209643, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.013166666666666667, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.021166666666666667, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.031133038448451854, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0014144271570014145, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.017182715209254847, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0386037910309755, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.3384932920536636, 500, 1500, "Login-2"], "isController": false}, {"data": [0.2297734627831715, 500, 1500, "Logout-0"], "isController": false}, {"data": [6.879944960440316E-4, 500, 1500, "Login-3"], "isController": false}, {"data": [6.879944960440316E-4, 500, 1500, "Login-4"], "isController": false}, {"data": [5.015045135406219E-4, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0011786892975011788, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0016501650165016502, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.007166666666666667, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.009333333333333334, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50276, 13191, 26.237170817089666, 30312.713581032654, 0, 157891, 30190.5, 57850.8, 82939.45000000001, 127727.65000000005, 180.4147572927021, 10930.104535421056, 143.18611417129284], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 551, 18.366666666666667, 29164.657333333325, 0, 65808, 33626.5, 53064.9, 54412.8, 57766.739999999976, 19.58863858961802, 1908.125758804685, 9.635116970698661], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 26666.417666666635, 67, 49335, 29027.0, 44218.0, 45668.149999999994, 47111.74999999999, 27.55858495852433, 70.78035003995996, 13.752379798638607], "isController": false}, {"data": ["Login", 3000, 2483, 82.76666666666667, 80593.02966666677, 0, 157891, 83055.0, 112088.5, 122332.85, 134423.93, 11.628898588251712, 2135.922492209849, 35.43161489909023], "isController": false}, {"data": ["Login-0", 2939, 0, 0.0, 17665.399795848927, 183, 59863, 5510.0, 43028.0, 46405.0, 55300.799999999996, 14.342322294771568, 5.307820536751286, 10.504630586990894], "isController": false}, {"data": ["Logout-2", 2121, 561, 26.44978783592645, 17140.440829797284, 0, 61516, 10139.0, 40834.0, 46547.399999999994, 49681.00000000002, 8.692801081989385, 765.5746419624378, 3.85237786634972], "isController": false}, {"data": ["Login-1", 2939, 32, 1.0888057162300102, 37013.22490643076, 0, 60522, 40127.0, 49951.0, 52327.0, 55156.399999999994, 12.519595147219194, 41.203697479148204, 7.597183843215393], "isController": false}, {"data": ["Logout-1", 2163, 42, 1.941747572815534, 29044.105409153995, 0, 59360, 32467.0, 46405.0, 47425.6, 52881.20000000001, 8.541810642709054, 22.641668569207226, 4.23705295438839], "isController": false}, {"data": ["Login-2", 2907, 709, 24.38940488476092, 16197.68283453733, 0, 50796, 113.0, 46119.6, 47302.99999999999, 48401.520000000004, 11.577060931899641, 599.207137034548, 5.394619144514138], "isController": false}, {"data": ["Logout-0", 2163, 0, 0.0, 8953.007397133608, 13, 59672, 2050.0, 38168.4, 47555.19999999998, 54512.6, 8.70184416336777, 3.841048400236555, 4.911783131275948], "isController": false}, {"data": ["Login-3", 2907, 1056, 36.326109391124874, 24461.664946680437, 0, 62021, 31722.0, 47440.200000000004, 48789.0, 54826.240000000005, 11.521084337349398, 554.2863902670716, 4.648641853598605], "isController": false}, {"data": ["Login-4", 2907, 1053, 36.22291021671827, 24502.733058135593, 1, 64312, 31728.0, 47262.0, 48786.6, 54996.12, 11.449164057423053, 575.8547657465391, 4.679599961107501], "isController": false}, {"data": ["Login-5", 997, 364, 36.50952858575727, 23398.50250752257, 0, 64205, 28201.0, 49979.8, 53061.09999999999, 58632.81999999999, 4.6233607241564805, 66.31638020157064, 1.8489539255091725], "isController": false}, {"data": ["Login-6", 997, 385, 38.61584754262788, 22761.197592778353, 0, 64876, 26167.0, 50004.200000000004, 53417.099999999984, 58595.32, 4.602359805749948, 244.36332550068553, 1.7574230074136308], "isController": false}, {"data": ["Logout-4", 2121, 584, 27.534181989627534, 16902.404054691197, 0, 61939, 9894.0, 40518.2, 46650.299999999996, 50343.0400000001, 8.694190755710046, 237.03413089860467, 3.7838814619747003], "isController": false}, {"data": ["Login-7", 997, 387, 38.81644934804413, 22610.427281845525, 0, 63922, 25917.0, 49809.4, 52998.09999999999, 59699.31999999999, 4.61591170043335, 24.24888168601152, 1.7623536838169933], "isController": false}, {"data": ["Logout-3", 2121, 570, 26.874115983026876, 17030.69165487976, 1, 61519, 10090.0, 41162.19999999998, 46670.299999999996, 51673.740000000005, 8.695117451727954, 547.3018322367072, 3.7690796604046244], "isController": false}, {"data": ["Login-8", 997, 471, 47.24172517552658, 20711.40320962889, 0, 84806, 21341.0, 48223.4, 52562.59999999999, 62890.54, 4.266938289886458, 133.23224420571606, 1.4069768934806146], "isController": false}, {"data": ["Logout", 3000, 1559, 51.96666666666667, 40968.33033333336, 0, 142165, 36219.5, 88055.8, 118553.34999999996, 134095.69999999998, 11.4880026958513, 1480.8806539820769, 19.438822436643665], "isController": false}, {"data": ["Login Welcome-3", 3000, 715, 23.833333333333332, 26956.19399999999, 0, 66014, 28901.0, 52866.3, 54749.85, 62252.92999999998, 19.534047845394525, 555.6728757129928, 8.935777697245047], "isController": false}, {"data": ["Login Welcome-2", 3000, 657, 21.9, 27780.950000000015, 0, 69318, 30202.0, 52862.7, 54301.94999999999, 60486.94999999995, 19.02490994875958, 1274.2978074187638, 8.807697250662702], "isController": false}, {"data": ["Login Welcome", 3000, 1012, 33.733333333333334, 65919.59733333335, 1757, 108439, 78457.5, 91243.2, 94840.64999999998, 98705.36999999998, 18.8094849963008, 3675.468291273888, 35.95054050818526], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 226, 1.713289363960276, 0.44951865701328664], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 10, 0.0758092638920476, 0.019890206062534808], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 44, 0.3335607611250095, 0.08751690667515316], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 5126, 38.8598286710636, 10.195719627655343], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3703, 28.07217041922523, 7.36534330495664], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1910, 14.479569403381094, 3.799029357944148], "isController": false}, {"data": ["Assertion failed", 2172, 16.465772117352742, 4.32015275678256], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50276, 13191, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 5126, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3703, "Assertion failed", 2172, "Test failed: text expected to contain /The electronic survey app/", 1910, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 226], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 551, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 534, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2483, "Test failed: text expected to contain /The electronic survey app/", 1910, "Assertion failed", 480, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 90, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2121, 561, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 464, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 88, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 9, null, null, null, null], "isController": false}, {"data": ["Login-1", 2939, 32, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 30, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2163, 42, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 33, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 9, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2907, 709, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 600, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 107, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2907, 1056, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 604, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 431, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 21, null, null, null, null], "isController": false}, {"data": ["Login-4", 2907, 1053, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 594, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 428, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 31, null, null, null, null], "isController": false}, {"data": ["Login-5", 997, 364, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 338, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 26, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 997, 385, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 355, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 28, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["Logout-4", 2121, 584, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 486, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 92, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-7", 997, 387, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 358, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 29, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2121, 570, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 473, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 93, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, null, null, null, null], "isController": false}, {"data": ["Login-8", 997, 471, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 424, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 43, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Logout", 3000, 1559, "Assertion failed", 680, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 473, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 401, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2], "isController": false}, {"data": ["Login Welcome-3", 3000, 715, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 691, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 22, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 657, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 633, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 23, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 1012, "Assertion failed", 1012, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
