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

    var data = {"OkPercent": 75.59758391919992, "KoPercent": 24.40241608080008};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0345281711060501, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.014166666666666666, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.022, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.023721399730820995, 500, 1500, "Login-0"], "isController": false}, {"data": [0.001413760603204524, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.01430013458950202, 500, 1500, "Login-1"], "isController": false}, {"data": [0.03647276084949215, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.3288715689596747, 500, 1500, "Login-2"], "isController": false}, {"data": [0.18167128347183747, 500, 1500, "Logout-0"], "isController": false}, {"data": [3.3886818027787193E-4, 500, 1500, "Login-3"], "isController": false}, {"data": [6.777363605557439E-4, 500, 1500, "Login-4"], "isController": false}, {"data": [0.001, 500, 1500, "Login-5"], "isController": false}, {"data": [5.0E-4, 500, 1500, "Login-6"], "isController": false}, {"data": [4.71253534401508E-4, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.003063147973609802, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.010166666666666666, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.011166666666666667, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50495, 12322, 24.40241608080008, 33916.68143380528, 0, 168281, 29487.5, 60822.70000000002, 97222.6, 148677.85000000003, 166.14132294490798, 10432.386811956698, 134.63436832695572], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 538, 17.933333333333334, 30877.071000000004, 0, 77559, 36218.5, 55642.6, 56850.25, 59852.139999999985, 18.51966170751281, 1813.3785324807857, 9.157671287579479], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 28092.364666666665, 46, 50249, 31061.0, 45465.7, 46591.1, 48275.95999999998, 27.35603884557516, 70.26013883189714, 13.651304541102448], "isController": false}, {"data": ["Login", 3000, 2481, 82.7, 94941.54133333311, 0, 161149, 97269.0, 130343.6, 149112.05, 154080.34999999998, 10.809096935981323, 2042.4480414591922, 33.56386453589341], "isController": false}, {"data": ["Login-0", 2972, 0, 0.0, 22219.520861372795, 206, 64410, 7137.5, 51117.50000000001, 55993.35, 60231.0, 13.56891749988586, 5.0170424713509565, 9.938171996986714], "isController": false}, {"data": ["Logout-2", 2122, 347, 16.352497643732328, 21150.07163053726, 0, 63577, 17393.5, 49742.700000000004, 54918.049999999996, 57365.93, 7.622208572649849, 760.7846038828993, 3.8416607791660833], "isController": false}, {"data": ["Login-1", 2972, 21, 0.7065948855989233, 42619.99259757747, 0, 64571, 47099.5, 56623.8, 57709.35, 59170.35, 11.7004649478164, 38.43881670829938, 7.128063891939986], "isController": false}, {"data": ["Logout-1", 2166, 44, 2.0313942751615883, 32355.501385041538, 0, 66708, 34041.5, 54965.7, 56750.6, 57575.27, 7.795741495227538, 20.678293732274227, 3.8634398934294065], "isController": false}, {"data": ["Login-2", 2951, 693, 23.483564893256524, 19501.550660792996, 0, 59060, 125.0, 54941.6, 56654.0, 57533.28, 10.838505894883756, 577.562171884756, 5.1176652541594745], "isController": false}, {"data": ["Logout-0", 2166, 0, 0.0, 9522.114035087712, 22, 73962, 2203.5, 44171.799999999996, 53229.90000000001, 57736.86, 8.067670097102566, 3.56112000379918, 4.553821597778597], "isController": false}, {"data": ["Login-3", 2951, 1041, 35.276177566926464, 28302.032531345256, 0, 72820, 33349.0, 55569.4, 56879.4, 58334.6, 10.822963313418494, 530.8022212678931, 4.4401088943780005], "isController": false}, {"data": ["Login-4", 2951, 1052, 35.64893256523212, 28153.106065740423, 0, 76262, 33364.0, 55579.8, 56894.4, 57923.0, 10.80667369777934, 545.4373962327244, 4.457286562701412], "isController": false}, {"data": ["Login-5", 1000, 363, 36.3, 25087.122999999978, 0, 86659, 29742.5, 53713.9, 56330.65, 63923.020000000004, 4.266284407583748, 61.37330511852805, 1.711784124142477], "isController": false}, {"data": ["Login-6", 1000, 374, 37.4, 24691.308000000026, 0, 76228, 28037.5, 53451.6, 56289.55, 66004.71, 4.259488009541253, 230.45315960834006, 1.6587128492780168], "isController": false}, {"data": ["Logout-4", 2122, 365, 17.200754005655043, 20980.941093308127, 0, 59149, 17360.5, 49952.0, 54944.8, 57281.0, 7.622181193830416, 234.67354473743524, 3.790363049258615], "isController": false}, {"data": ["Login-7", 1000, 381, 38.1, 24384.242, 0, 84255, 26927.0, 53587.9, 56097.45, 69648.52000000002, 4.257801356535512, 22.506650652454834, 1.6446630921537237], "isController": false}, {"data": ["Logout-3", 2122, 362, 17.05937794533459, 20972.858623939675, 1, 60504, 17162.5, 49923.700000000004, 54796.35, 57338.86, 7.622235951665973, 541.559536735666, 3.7474721260362935], "isController": false}, {"data": ["Login-8", 1000, 472, 47.2, 21880.569999999992, 0, 93805, 18305.0, 52247.2, 56274.1, 76088.26000000001, 4.277672261861985, 133.67165209317199, 1.4116318464144553], "isController": false}, {"data": ["Logout", 3000, 1275, 42.5, 45969.9383333334, 0, 168281, 42399.0, 98679.0, 136395.24999999988, 151750.63, 10.478189648247174, 1524.7195535734554, 19.084473909744364], "isController": false}, {"data": ["Login Welcome-3", 3000, 792, 26.4, 26783.78333333337, 0, 79032, 26386.0, 54944.4, 56600.45, 68030.4099999996, 18.27440851831096, 503.70118044112905, 8.077859640359641], "isController": false}, {"data": ["Login Welcome-2", 3000, 683, 22.766666666666666, 28614.346666666668, 0, 79967, 31031.0, 55336.200000000004, 56727.899999999994, 65878.84, 18.218697241689238, 1207.2387130426137, 8.340860011705512], "isController": false}, {"data": ["Login Welcome", 3000, 1038, 34.6, 69759.29866666651, 1663, 120252, 81500.5, 99495.5, 101333.19999999998, 111927.43, 18.01790980234353, 3501.0903064208323, 34.11433738573642], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 0.008115565654926148, 0.0019803940984255866], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 17, 0.13796461613374453, 0.033666699673234976], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 228, 1.8503489693231618, 0.4515298544410338], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 43, 0.3489693231618244, 0.08515694623230023], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4664, 37.850998214575554, 9.236558075056937], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3502, 28.420710923551372, 6.935340132686405], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1951, 15.833468592760916, 3.86374888602832], "isController": false}, {"data": ["Assertion failed", 1916, 15.5494237948385, 3.794435092583424], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50495, 12322, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4664, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3502, "Test failed: text expected to contain /The electronic survey app/", 1951, "Assertion failed", 1916, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 228], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 538, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 514, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 3, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2481, "Test failed: text expected to contain /The electronic survey app/", 1951, "Assertion failed", 481, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 48, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2122, 347, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 269, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 74, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-1", 2972, 21, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 20, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2166, 44, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 25, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 19, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2951, 693, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 685, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 8, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2951, 1041, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 694, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 335, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, null, null, null, null], "isController": false}, {"data": ["Login-4", 2951, 1052, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 700, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 332, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 20, null, null, null, null], "isController": false}, {"data": ["Login-5", 1000, 363, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 333, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 29, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Login-6", 1000, 374, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 344, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 30, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2122, 365, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 279, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 79, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, null, null, null, null], "isController": false}, {"data": ["Login-7", 1000, 381, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 361, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2122, 362, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 279, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 82, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null], "isController": false}, {"data": ["Login-8", 1000, 472, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 419, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 43, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1], "isController": false}, {"data": ["Logout", 3000, 1275, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 577, "Assertion failed", 397, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 298, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1], "isController": false}, {"data": ["Login Welcome-3", 3000, 792, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 751, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 35, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 6, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 683, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 641, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 39, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 3, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 1038, "Assertion failed", 1038, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
