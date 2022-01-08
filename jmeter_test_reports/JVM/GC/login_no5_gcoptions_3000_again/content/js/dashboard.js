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

    var data = {"OkPercent": 76.09346562555041, "KoPercent": 23.9065343744496};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04394410849527388, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03383333333333333, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.044, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.034232715008431704, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0013198416190057193, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.01973018549747049, 500, 1500, "Login-1"], "isController": false}, {"data": [0.03732638888888889, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.32528891910265123, 500, 1500, "Login-2"], "isController": false}, {"data": [0.2228732638888889, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.004588715159755268, 500, 1500, "Login-3"], "isController": false}, {"data": [0.004418762746430999, 500, 1500, "Login-4"], "isController": false}, {"data": [0.01174668028600613, 500, 1500, "Login-5"], "isController": false}, {"data": [0.009193054136874362, 500, 1500, "Login-6"], "isController": false}, {"data": [6.599208095028596E-4, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.009193054136874362, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0017597888253409592, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.012257405515832482, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.029666666666666668, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.029833333333333333, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0135, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 51099, 12216, 23.9065343744496, 29350.507700737842, 0, 140284, 30529.0, 60672.20000000014, 82806.8, 123964.82000000004, 185.51165551517704, 11750.26284144819, 151.5156773009704], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 505, 16.833333333333332, 27044.248666666645, 0, 61035, 30410.5, 49997.5, 51273.1, 54963.99999999991, 19.7100001971, 1955.2263670424982, 9.876910792128484], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 25436.82966666669, 10, 48902, 26397.5, 44152.3, 44857.8, 46533.73999999999, 27.544162473833047, 70.7433079161923, 13.74518264075067], "isController": false}, {"data": ["Login", 3000, 2471, 82.36666666666666, 78606.8466666665, 0, 140284, 82724.0, 110636.6, 120093.24999999994, 130214.54999999999, 11.686839450095249, 2289.6806965246747, 36.95386623170523], "isController": false}, {"data": ["Login-0", 2965, 0, 0.0, 16379.475548060718, 346, 55187, 4699.0, 42866.200000000004, 45303.4, 49857.34, 15.060623453936842, 5.5696568120749115, 11.030730068801397], "isController": false}, {"data": ["Logout-2", 2273, 501, 22.041355037395512, 18985.524417069955, 0, 57185, 13861.0, 42467.20000000001, 47008.2, 50214.03999999998, 8.434669348344793, 786.0675290741902, 3.9620281010304916], "isController": false}, {"data": ["Login-1", 2965, 23, 0.7757166947723441, 35627.918718381094, 1, 55565, 40353.0, 48958.4, 50376.1, 52353.34, 12.756034916687819, 41.73271922283911, 7.766549604143453], "isController": false}, {"data": ["Logout-1", 2304, 31, 1.3454861111111112, 29381.14973958339, 1, 53390, 32040.0, 47134.5, 48054.5, 50254.099999999984, 8.624336049649823, 22.87849819718062, 4.304001704560342], "isController": false}, {"data": ["Login-2", 2942, 637, 21.651937457511895, 17428.42046227059, 0, 53475, 120.5, 45105.3, 47183.25, 48613.03000000001, 11.521396039177446, 646.7913666507083, 5.582940246954193], "isController": false}, {"data": ["Logout-0", 2304, 0, 0.0, 7678.299479166685, 22, 57647, 2032.5, 33324.0, 43980.25, 51540.19999999998, 8.925458475699045, 3.939753155289032, 5.038002928666063], "isController": false}, {"data": ["Login-3", 2942, 935, 31.78110129163834, 24737.46193065939, 0, 57738, 31368.5, 47117.200000000004, 48548.25, 51256.06000000001, 11.482095814225778, 592.5534732047029, 4.965240511269392], "isController": false}, {"data": ["Login-4", 2942, 966, 32.83480625424881, 24372.836505778425, 0, 60772, 31350.5, 47073.0, 48405.25, 51581.99, 11.499599351144292, 595.4946433064769, 4.952174069712901], "isController": false}, {"data": ["Login-5", 979, 335, 34.21859039836568, 20661.250255362615, 0, 59460, 15815.0, 48798.0, 50683.0, 54648.20000000003, 4.855139306295315, 71.77040850089516, 2.011706545511352], "isController": false}, {"data": ["Login-6", 979, 331, 33.810010214504594, 20773.210418794657, 0, 58558, 16433.0, 48875.0, 50639.0, 55650.00000000001, 4.841477466606663, 276.32031311816615, 1.9934700016319586], "isController": false}, {"data": ["Logout-4", 2273, 537, 23.625164980202374, 18677.177298724153, 1, 57390, 12481.0, 42652.0, 47066.2, 50091.49999999992, 8.435264079802867, 241.20387051934583, 3.8692262695573434], "isController": false}, {"data": ["Login-7", 979, 341, 34.831460674157306, 20339.13278855977, 0, 58636, 15638.0, 48694.0, 50264.0, 53572.200000000026, 4.856969925483464, 26.4731594970754, 1.9751691908605618], "isController": false}, {"data": ["Logout-3", 2273, 524, 23.053233611966565, 18745.129784425822, 0, 56037, 12736.0, 42537.4, 46798.399999999994, 50009.799999999996, 8.43488845017738, 557.5428932852554, 3.847321253794401], "isController": false}, {"data": ["Login-8", 979, 439, 44.84167517875383, 17851.976506639432, 0, 80538, 10721.0, 48142.0, 50521.0, 58956.000000000044, 4.856777163721512, 158.11975766343872, 1.6743230773810114], "isController": false}, {"data": ["Logout", 3000, 1340, 44.666666666666664, 44060.470333333345, 0, 139747, 39183.5, 86996.90000000001, 117773.04999999997, 132406.81999999998, 11.038989711661587, 1603.6463895949241, 20.596530474280993], "isController": false}, {"data": ["Login Welcome-3", 3000, 732, 24.4, 23934.169666666643, 0, 61217, 23320.5, 49743.8, 51203.35, 56442.37999999999, 19.585697218178137, 553.3205050416849, 8.892748109980218], "isController": false}, {"data": ["Login Welcome-2", 3000, 602, 20.066666666666666, 25841.759999999955, 0, 60382, 27468.5, 49964.9, 51255.59999999999, 55604.359999999986, 19.633764839853924, 1344.985438035429, 9.30294050396602], "isController": false}, {"data": ["Login Welcome", 3000, 966, 32.2, 61165.45933333325, 31, 98283, 72590.0, 90074.0, 93009.3, 95816.70999999999, 19.56896101862965, 3884.889268728311, 37.72898869444046], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 209, 1.7108709888670597, 0.40900996105598936], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 13, 0.10641781270464964, 0.025440810974774457], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 60, 0.4911591355599214, 0.11741912757588212], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4446, 36.39489194499018, 8.700757353372865], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 0.008185985592665358, 0.001956985459598035], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3495, 28.610019646365423, 6.839664181295133], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1963, 16.069089718402097, 3.841562457190943], "isController": false}, {"data": ["Assertion failed", 2029, 16.60936476751801, 3.9707234975244132], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 51099, 12216, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4446, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3495, "Assertion failed", 2029, "Test failed: text expected to contain /The electronic survey app/", 1963, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 209], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 505, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 481, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 23, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2471, "Test failed: text expected to contain /The electronic survey app/", 1963, "Assertion failed", 450, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 57, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2273, 501, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 399, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 96, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-1", 2965, 23, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 23, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2304, 31, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 17, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 14, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2942, 637, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 579, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 54, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2942, 935, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 592, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 319, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 23, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-4", 2942, 966, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 591, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 352, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null], "isController": false}, {"data": ["Login-5", 979, 335, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 311, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 24, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 979, 331, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 322, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2273, 537, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 429, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 105, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, null, null, null, null], "isController": false}, {"data": ["Login-7", 979, 341, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 321, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 20, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2273, 524, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 422, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 94, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-8", 979, 439, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 372, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 60, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null], "isController": false}, {"data": ["Logout", 3000, 1340, "Assertion failed", 613, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 466, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 255, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1], "isController": false}, {"data": ["Login Welcome-3", 3000, 732, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 704, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 28, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 602, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 566, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 33, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 3, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 966, "Assertion failed", 966, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
