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

    var data = {"OkPercent": 70.25232826554166, "KoPercent": 29.74767173445833};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4733741940619279, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.016, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.0414, 500, 1500, "Polls"], "isController": false}, {"data": [0.627831715210356, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.7554426705370102, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.5902912621359223, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [0.34658298465829845, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.5898058252427184, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.7569945848375451, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.4280234657039711, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.3511, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.19900497512437812, 500, 1500, "Save Poll-8"], "isController": false}, {"data": [0.3564981949458484, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.43432510885341075, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [0.7053249097472925, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.7551895306859205, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.22077922077922077, 500, 1500, "Save Poll-9"], "isController": false}, {"data": [0.668095667870036, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.5119741100323625, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.6935920577617328, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.5249190938511327, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.6398916967509025, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.48802612481857766, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.6453068592057761, 500, 1500, "Polls-7"], "isController": false}, {"data": [0.4987300435413643, 500, 1500, "Save Poll-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 62815, 18686, 29.74767173445833, 747.7593090822296, 0, 12676, 507.0, 2479.0, 3688.850000000002, 5626.860000000022, 776.5868011769651, 51949.60615866776, 562.3292349726777], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 5000, 3843, 76.86, 1752.5629999999956, 3, 12676, 1300.5, 4743.500000000003, 5306.849999999999, 5985.859999999997, 66.12881893929375, 12784.818373065733, 164.84346585273113], "isController": false}, {"data": ["Polls", 5000, 3801, 76.02, 1257.008200000003, 3, 11421, 611.0, 3543.9000000000005, 4876.799999999999, 7322.919999999998, 62.012427290429, 12999.797575449744, 106.00048234041101], "isController": false}, {"data": ["Save Poll-0", 3090, 0, 0.0, 787.516828478964, 4, 4544, 631.0, 1596.9, 1854.3499999999995, 2814.0300000000097, 40.92444208992782, 14.999886183034237, 32.49290713363354], "isController": false}, {"data": ["Show New Poll Form-0", 2756, 0, 0.0, 587.3367198838898, 3, 3670, 412.0, 1285.500000000001, 1723.2500000000014, 2909.0, 36.5405778078305, 60.30622704612651, 18.591446326054385], "isController": false}, {"data": ["Save Poll-2", 3090, 470, 15.210355987055015, 616.3741100323606, 3, 3958, 423.0, 1420.0, 2097.3499999999995, 2972.1800000000003, 40.89194733011315, 1880.627282285946, 21.28930804605307], "isController": false}, {"data": ["Show New Poll Form-1", 717, 109, 15.202231520223153, 1172.4114365411433, 3, 5814, 905.0, 2474.0000000000036, 3215.1, 4568.460000000013, 9.926348432827554, 1171.8420387172582, 4.562122743382434], "isController": false}, {"data": ["Save Poll-1", 3090, 0, 0.0, 873.2427184466029, 9, 3939, 680.5, 1814.0, 2138.249999999999, 3201.8100000000013, 40.90331462458964, 1702.1129139144075, 25.005346635735467], "isController": false}, {"data": ["Polls-0", 2216, 0, 0.0, 618.2378158844765, 3, 4451, 405.0, 1591.3, 2247.0, 3584.4999999999964, 28.221030780790343, 1171.2729421236454, 14.082955790023306], "isController": false}, {"data": ["Polls-2", 2216, 31, 1.3989169675090252, 1435.8772563176851, 4, 8455, 1014.5, 2903.2, 4926.000000000002, 7362.439999999995, 27.687194672463985, 164.05176277846493, 14.396417828629257], "isController": false}, {"data": ["Show New Poll Form", 5000, 2353, 47.06, 714.4972000000007, 2, 9012, 368.0, 1916.0, 2266.0, 4817.799999999996, 66.29277541333546, 1255.8172687293663, 22.960554555639526], "isController": false}, {"data": ["Save Poll-8", 603, 415, 68.82255389718077, 332.4477611940295, 1, 3678, 39.0, 1171.0000000000005, 1641.7999999999988, 2784.2000000000053, 8.694774483792825, 158.23562451335218, 1.6940160116146614], "isController": false}, {"data": ["Polls-1", 2216, 177, 7.987364620938628, 1495.0004512635378, 3, 8236, 1100.5, 3188.7999999999997, 5020.800000000008, 7096.259999999998, 27.55636246067374, 3523.5679479696455, 13.742393651995224], "isController": false}, {"data": ["Save Poll-7", 2756, 1008, 36.574746008708274, 493.2543541364304, 3, 3635, 284.0, 1274.0, 1725.15, 2817.159999999998, 36.48060147987346, 1237.105360011814, 14.45731837465419], "isController": false}, {"data": ["Polls-4", 2216, 478, 21.57039711191336, 239.08799638989203, 2, 3432, 55.0, 686.8999999999999, 1188.15, 2121.2199999999975, 28.244771021068868, 3394.1541774076886, 11.400626895943002], "isController": false}, {"data": ["Polls-3", 2216, 368, 16.60649819494585, 229.69900722021686, 0, 3528, 45.0, 684.1999999999998, 1182.0500000000006, 2085.83, 28.248011421578624, 1291.1448407703192, 11.98554695467061], "isController": false}, {"data": ["Save Poll-9", 77, 56, 72.72727272727273, 219.80519480519482, 1, 2070, 38.0, 738.8000000000001, 1205.8999999999994, 2070.0, 1.9633340982686962, 34.29066786825263, 0.3346592212958005], "isController": false}, {"data": ["Polls-6", 2216, 549, 24.77436823104693, 251.35875451263533, 2, 3564, 57.0, 740.8999999999999, 1247.6000000000004, 2105.49, 28.25341374166486, 1827.1308070064576, 10.834461220085933], "isController": false}, {"data": ["Save Poll-4", 3090, 898, 29.06148867313916, 509.95436893203873, 2, 3403, 305.5, 1275.9, 1799.8999999999996, 2820.0, 40.90710512728862, 1146.4801862415106, 18.302392370626315], "isController": false}, {"data": ["Polls-5", 2216, 503, 22.6985559566787, 235.43095667870085, 1, 2852, 51.0, 691.0, 1192.15, 2055.83, 28.293455223308904, 483.15559983944485, 11.320080285551953], "isController": false}, {"data": ["Save Poll-3", 3090, 760, 24.59546925566343, 568.0155339805845, 3, 3590, 335.0, 1415.8000000000002, 2182.499999999998, 2858.980000000003, 40.901148938423255, 4036.0118344669945, 19.294593751654578], "isController": false}, {"data": ["Polls-8", 2216, 653, 29.467509025270758, 216.69404332129955, 0, 3596, 42.0, 707.3, 1104.7500000000005, 1973.1499999999996, 28.307189208522814, 1163.5336388382364, 10.236354471379848], "isController": false}, {"data": ["Save Poll-6", 2756, 825, 29.93468795355588, 520.9970972423807, 3, 3814, 318.5, 1288.9000000000005, 1762.15, 2853.4399999999987, 36.484464978355554, 458.1087278798038, 15.948185188280226], "isController": false}, {"data": ["Polls-7", 2216, 631, 28.474729241877256, 235.4896209386283, 0, 4031, 52.5, 775.4999999999998, 1182.15, 2170.619999999999, 28.30538134348376, 166.45830821938586, 10.360002283207091], "isController": false}, {"data": ["Save Poll-5", 2756, 758, 27.503628447024674, 553.8697387518141, 2, 3864, 328.5, 1366.0, 2116.0500000000006, 2893.0399999999954, 36.48108437243533, 2094.531860141503, 16.480102975339527], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 2, 0.010703200256876806, 0.003183952877497413], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 12, 0.06421920154126083, 0.019103717264984478], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 1, 0.005351600128438403, 0.0015919764387487066], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 2, 0.010703200256876806, 0.003183952877497413], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 10, 0.05351600128438403, 0.015919764387487066], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 0.005351600128438403, 0.0015919764387487066], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 15598, 83.47425880338221, 24.831648491602323], "isController": false}, {"data": ["Test failed: text expected to contain /Add a new Survey/", 334, 1.7874344428984266, 0.531720130542068], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, 0.005351600128438403, 0.0015919764387487066], "isController": false}, {"data": ["Assertion failed", 2725, 14.583110349994648, 4.338135795590225], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 62815, 18686, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 15598, "Assertion failed", 2725, "Test failed: text expected to contain /Add a new Survey/", 334, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 10], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Save Poll", 5000, 3843, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1910, "Assertion failed", 1599, "Test failed: text expected to contain /Add a new Survey/", 334, null, null, null, null], "isController": false}, {"data": ["Polls", 5000, 3801, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2784, "Assertion failed", 1017, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-2", 3090, 470, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 470, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show New Poll Form-1", 717, 109, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 109, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-2", 2216, 31, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 28, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 1, null, null, null, null], "isController": false}, {"data": ["Show New Poll Form", 5000, 2353, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2244, "Assertion failed", 109, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-8", 603, 415, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 414, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-1", 2216, 177, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 174, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Save Poll-7", 2756, 1008, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1008, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-4", 2216, 478, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 478, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-3", 2216, 368, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 367, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-9", 77, 56, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 55, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-6", 2216, 549, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 549, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-4", 3090, 898, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 898, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-5", 2216, 503, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 503, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-3", 3090, 760, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 760, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-8", 2216, 653, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 641, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, null, null, null, null], "isController": false}, {"data": ["Save Poll-6", 2756, 825, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 825, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-7", 2216, 631, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 623, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null], "isController": false}, {"data": ["Save Poll-5", 2756, 758, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 758, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
