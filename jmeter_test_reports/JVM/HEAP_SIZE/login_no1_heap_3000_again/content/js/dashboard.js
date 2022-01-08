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

    var data = {"OkPercent": 75.608372456964, "KoPercent": 24.391627543035995};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04327073552425665, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.031166666666666665, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.04016666666666667, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.035386185777475335, 500, 1500, "Login-0"], "isController": false}, {"data": [0.00263042525208242, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.0226267437904049, 500, 1500, "Login-1"], "isController": false}, {"data": [0.027596697088222513, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.3364565587734242, 500, 1500, "Login-2"], "isController": false}, {"data": [0.2194697957409822, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.004940374787052811, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0034071550255536627, 500, 1500, "Login-4"], "isController": false}, {"data": [0.010521042084168337, 500, 1500, "Login-5"], "isController": false}, {"data": [0.009018036072144289, 500, 1500, "Login-6"], "isController": false}, {"data": [6.57606313020605E-4, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.014028056112224449, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0021920210434020165, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.009018036072144289, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.025333333333333333, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.02666666666666667, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.012, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 51120, 12469, 24.391627543035995, 25798.397476525828, 0, 123487, 28224.0, 55772.500000000895, 72597.95, 108354.90000000002, 208.96864652740874, 13123.401947264747, 170.1756143844786], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 523, 17.433333333333334, 23286.932000000033, 0, 56525, 25958.0, 44116.0, 45356.399999999994, 49719.87999999993, 21.21535708981875, 2089.6830533385014, 10.554564185736915], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 22321.759000000067, 12, 42740, 24185.5, 38255.0, 39470.8, 40568.99, 29.393609829223124, 75.49335336997737, 14.668100217512713], "isController": false}, {"data": ["Login", 3000, 2419, 80.63333333333334, 68624.51300000006, 0, 123487, 72559.5, 95145.10000000002, 103551.9, 114427.89999999989, 13.088491289609047, 2628.0922455392783, 42.05106014734369], "isController": false}, {"data": ["Login-0", 2939, 0, 0.0, 13984.365090166706, 220, 47920, 3821.0, 37539.0, 39465.0, 44433.2, 16.424683409896165, 6.078462756653143, 12.029797419357543], "isController": false}, {"data": ["Logout-2", 2281, 621, 27.224901359053046, 15880.720736519086, 0, 46123, 10034.0, 37681.0, 40428.3, 44422.57999999998, 9.631218490588346, 839.5547529136969, 4.2232738700946655], "isController": false}, {"data": ["Login-1", 2939, 4, 0.13610071452875128, 31090.040489962605, 0, 48956, 34533.0, 42339.0, 44374.0, 46374.0, 14.00771162892671, 46.112816457393016, 8.58252162342181], "isController": false}, {"data": ["Logout-1", 2301, 20, 0.8691873098652759, 26575.411125597588, 0, 46566, 29241.0, 40270.8, 41181.0, 44754.66, 9.691318246717966, 25.6988627060616, 4.859832768427614], "isController": false}, {"data": ["Login-2", 2935, 662, 22.555366269165248, 14709.287904599643, 0, 46472, 104.0, 38828.2, 40462.2, 41666.359999999986, 12.869928217810928, 697.9293634222718, 6.153417300296864], "isController": false}, {"data": ["Logout-0", 2301, 0, 0.0, 7489.674489352452, 19, 49323, 1858.0, 32149.20000000001, 39363.600000000006, 44781.94, 9.97394896424376, 4.402563409998223, 5.629826661457905], "isController": false}, {"data": ["Login-3", 2935, 911, 31.039182282793867, 21872.40919931852, 0, 53671, 29150.0, 40773.6, 42513.799999999996, 45701.2, 12.87986834887548, 664.4333901878771, 5.625702825013714], "isController": false}, {"data": ["Login-4", 2935, 926, 31.550255536626917, 21825.08551959112, 0, 53382, 29061.0, 40816.6, 42679.0, 45619.03999999999, 12.873992780036758, 713.9002394751819, 5.643586210243049], "isController": false}, {"data": ["Login-5", 998, 264, 26.452905811623246, 20763.283567134262, 0, 56581, 20582.0, 43366.8, 45001.99999999999, 48798.0, 5.412558437191544, 88.03985868131258, 2.5074245570433766], "isController": false}, {"data": ["Login-6", 998, 281, 28.1563126252505, 20058.55611222447, 0, 74644, 19392.5, 42884.6, 45020.25, 50229.44, 5.4140265601944275, 334.39935154927684, 2.419627278787106], "isController": false}, {"data": ["Logout-4", 2281, 669, 29.329241560718984, 15326.912757562475, 0, 53511, 9604.0, 37176.200000000004, 40148.0, 43942.41999999999, 9.630771179463363, 256.664601486468, 4.087671393738521], "isController": false}, {"data": ["Login-7", 998, 298, 29.859719438877754, 19383.556112224465, 0, 71797, 17814.0, 43013.5, 44653.299999999996, 50068.05, 5.41411467290176, 30.864414283524926, 2.3697135415253916], "isController": false}, {"data": ["Logout-3", 2281, 608, 26.654975887768522, 15880.15519508989, 0, 47232, 9869.0, 37691.8, 40242.700000000004, 44509.73999999999, 9.630893169285853, 607.9807960383399, 4.187221696056865], "isController": false}, {"data": ["Login-8", 998, 409, 40.98196392785571, 16221.795591182356, 0, 78118, 11428.5, 41721.8, 44342.7, 50744.84, 6.879010745869492, 238.52197956587443, 2.5374106521274613], "isController": false}, {"data": ["Logout", 3000, 1514, 50.46666666666667, 39515.757999999994, 0, 120027, 34605.0, 79640.3, 102744.04999999993, 113966.82999999997, 12.470071827613726, 1714.1040742127748, 22.49909056155851], "isController": false}, {"data": ["Login Welcome-3", 3000, 715, 23.833333333333332, 21193.128666666686, 0, 55437, 20757.5, 43792.5, 45520.95, 52814.92999999998, 21.134946634259748, 601.2386303343725, 9.668102907376097], "isController": false}, {"data": ["Login Welcome-2", 3000, 635, 21.166666666666668, 22222.287333333323, 0, 56564, 23404.5, 44074.9, 45614.0, 52099.04999999998, 21.09467289193902, 1425.792058273155, 9.857605189904792], "isController": false}, {"data": ["Login Welcome", 3000, 990, 33.0, 53786.00500000004, 41, 87351, 63379.5, 78539.9, 82662.49999999999, 85076.59999999999, 21.076444263343145, 4154.266577611372, 40.493523329428335], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 162, 1.2992220707354238, 0.31690140845070425], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 11, 0.08821878258080039, 0.021517996870109544], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 49, 0.3929745769508381, 0.09585289514866979], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4138, 33.186302029032, 8.094679186228483], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3970, 31.83896062234341, 7.7660406885759], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1937, 15.534525623546395, 3.7891236306729263], "isController": false}, {"data": ["Assertion failed", 2202, 17.65979629481113, 4.307511737089202], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 51120, 12469, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4138, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3970, "Assertion failed", 2202, "Test failed: text expected to contain /The electronic survey app/", 1937, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 162], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 523, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 507, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2419, "Test failed: text expected to contain /The electronic survey app/", 1937, "Assertion failed", 417, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 64, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2281, 621, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 531, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 88, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null], "isController": false}, {"data": ["Login-1", 2939, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2301, 20, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 12, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 8, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2935, 662, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 612, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 50, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2935, 911, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 616, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 282, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 13, null, null, null, null], "isController": false}, {"data": ["Login-4", 2935, 926, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 622, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 291, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-5", 998, 264, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 253, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 11, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 998, 281, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 267, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2281, 669, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 560, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 105, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, null, null, null, null], "isController": false}, {"data": ["Login-7", 998, 298, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 278, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 20, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2281, 608, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 521, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 80, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, null, null, null, null], "isController": false}, {"data": ["Login-8", 998, 409, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 354, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 49, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null], "isController": false}, {"data": ["Logout", 3000, 1514, "Assertion failed", 795, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 500, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 217, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null], "isController": false}, {"data": ["Login Welcome-3", 3000, 715, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 683, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 27, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 5, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 635, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 603, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 31, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 990, "Assertion failed", 990, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
