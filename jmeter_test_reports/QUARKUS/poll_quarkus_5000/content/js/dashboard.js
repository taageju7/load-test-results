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

    var data = {"OkPercent": 72.62463481292998, "KoPercent": 27.37536518707002};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5998020921685043, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4086, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.0909, 500, 1500, "Polls"], "isController": false}, {"data": [0.8918391839183918, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.949733688415446, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.5062111801242236, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.5286650286650286, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [0.5996047430830039, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.9115179252479023, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.36727688787185353, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.5382, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.13333333333333333, 500, 1500, "Save Poll-8"], "isController": false}, {"data": [0.2829900839054157, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.13687150837988826, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [0.8688024408848207, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.9101830663615561, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.8565980167810832, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.3381424706943192, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.8668954996186118, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.429225645295587, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.8321891685736079, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.2594033722438392, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.8289473684210527, 500, 1500, "Polls-7"], "isController": false}, {"data": [0.2961618257261411, 500, 1500, "Save Poll-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 53055, 14524, 27.37536518707002, 581.5521628498759, 0, 27979, 41.0, 1178.0, 3779.0, 6717.840000000026, 742.2667431481456, 44053.96601846135, 476.4209006918309], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 5000, 2826, 56.52, 473.0040000000008, 2, 9780, 102.5, 1156.0, 2208.0, 6996.959999999999, 76.66712666942668, 3908.433156328105, 65.37206736261251], "isController": false}, {"data": ["Polls", 5000, 2937, 58.74, 1844.1879999999976, 2, 27979, 394.5, 5942.300000000004, 7161.699999999999, 10634.719999999994, 73.24504863471229, 18489.482282823854, 161.14820540475216], "isController": false}, {"data": ["Save Poll-0", 3333, 0, 0.0, 388.4554455445548, 10, 6243, 98.0, 836.5999999999999, 1632.0999999999954, 5044.879999999997, 53.73726299496969, 602.7407390939394, 37.99392422691216], "isController": false}, {"data": ["Show New Poll Form-0", 3004, 0, 0.0, 211.39247669773627, 0, 5647, 3.0, 111.5, 1110.5, 4829.849999999996, 48.41257050765511, 56.16614625302176, 24.868175866236907], "isController": false}, {"data": ["Show New Poll Form-1", 483, 78, 16.149068322981368, 891.3995859213261, 3, 5835, 382.0, 2507.400000000001, 3167.599999999999, 4298.199999999999, 7.921279212792127, 924.9425673944239, 3.5999481088560885], "isController": false}, {"data": ["Save Poll-2", 1221, 457, 37.42833742833743, 293.47665847665854, 2, 6046, 33.0, 1023.3999999999994, 1621.0, 3731.5799999999954, 38.89897734875275, 961.7146992676575, 13.789259125410176], "isController": false}, {"data": ["Save Poll-1", 1265, 273, 21.58102766798419, 522.9691699604746, 1, 6530, 140.0, 1720.0000000000036, 2546.1000000000004, 3930.939999999984, 19.674935842600515, 1158.6705292742438, 8.889080605023718], "isController": false}, {"data": ["Polls-0", 2622, 0, 0.0, 392.66094584286816, 2, 7219, 9.0, 567.8000000000011, 4257.85, 5704.869999999997, 40.498586719799825, 431.06810895579446, 20.64478737083546], "isController": false}, {"data": ["Polls-2", 2622, 99, 3.7757437070938216, 2190.841342486656, 6, 25251, 1394.0, 5552.600000000002, 6452.799999999997, 12296.319999999998, 38.59855733843663, 225.75047095815543, 19.586166366112174], "isController": false}, {"data": ["Show New Poll Form", 5000, 2074, 41.48, 246.82999999999996, 0, 9516, 11.0, 320.0, 1247.5999999999985, 5457.879999999997, 80.58017727639002, 1044.2925627014504, 28.40575581688155], "isController": false}, {"data": ["Save Poll-8", 390, 334, 85.64102564102564, 77.72307692307695, 3, 5167, 19.0, 90.80000000000007, 168.0, 1560.4999999999186, 14.108964619057955, 146.55467958631792, 1.1356133781926054], "isController": false}, {"data": ["Polls-1", 2622, 99, 3.7757437070938216, 2473.3146453089203, 3, 27973, 1958.5, 5493.600000000002, 6919.749999999996, 9763.199999999999, 38.55768947972118, 5151.252071400474, 20.108912812306993], "isController": false}, {"data": ["Save Poll-7", 716, 607, 84.77653631284916, 98.86033519553072, 3, 5155, 21.0, 105.60000000000014, 220.49999999999977, 3968.900000000075, 23.99544220650826, 168.35608259115588, 2.0458426367338047], "isController": false}, {"data": ["Polls-4", 2622, 333, 12.700228832951945, 59.24599542334102, 2, 5161, 14.0, 147.0, 226.69999999999982, 410.8499999999999, 40.658096729674824, 5418.076735349246, 18.26715057509808], "isController": false}, {"data": ["Polls-3", 2622, 231, 8.810068649885583, 50.1243325705568, 2, 2573, 13.0, 147.0, 228.0, 421.8499999999999, 40.56311881188119, 2008.4256918123453, 18.819842952312808], "isController": false}, {"data": ["Polls-6", 2622, 366, 13.958810068649885, 59.34973302822279, 2, 4868, 16.0, 146.0, 229.0, 431.53999999999996, 40.585094032969586, 2978.005191403529, 17.800963547713025], "isController": false}, {"data": ["Save Poll-4", 1109, 713, 64.2921550946799, 114.01082055906221, 2, 5519, 23.0, 96.0, 236.5, 4454.70000000001, 35.33309969095485, 985.8276316627903, 7.095673815990697], "isController": false}, {"data": ["Polls-5", 2622, 341, 13.005339435545386, 58.33295194508004, 2, 5181, 15.0, 140.70000000000027, 223.0, 393.53999999999996, 40.562491298092546, 757.6450789263006, 18.26388365162977], "isController": false}, {"data": ["Save Poll-3", 1201, 670, 55.78684429641965, 84.52706078268116, 2, 5216, 20.0, 87.79999999999995, 170.49999999999932, 1259.8600000000001, 38.26303045749968, 1278.7435995145438, 9.463801602125015], "isController": false}, {"data": ["Polls-8", 2622, 431, 16.437833714721588, 48.73874904652935, 0, 4884, 11.0, 117.0, 198.0, 400.0, 40.626597871054706, 1950.4362036665814, 17.4052190100172], "isController": false}, {"data": ["Save Poll-6", 771, 556, 72.11413748378729, 117.50583657587548, 2, 5215, 25.0, 94.80000000000007, 215.39999999999975, 4815.799999999999, 25.060945880058508, 408.851055887372, 3.903107478059483], "isController": false}, {"data": ["Polls-7", 2622, 438, 16.704805491990847, 56.18077803203671, 0, 5178, 13.0, 127.70000000000027, 204.0, 392.92999999999984, 40.69027592414414, 252.808113516093, 17.34370635339396], "isController": false}, {"data": ["Save Poll-5", 964, 661, 68.56846473029046, 108.82157676348547, 2, 5132, 23.0, 101.0, 206.75, 4427.400000000002, 30.800690139945043, 510.9456874241166, 5.43814700619848], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 10, 0.06885155604516661, 0.018848364904344547], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 4, 0.027540622418066648, 0.007539345961737819], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 14, 0.09639217846323327, 0.026387710866082367], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 10, 0.06885155604516661, 0.018848364904344547], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 12664, 87.19361057559901, 23.869569314861934], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, 0.006885155604516662, 0.0018848364904344547], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 8, 0.055081244836133296, 0.015078691923475638], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 1, 0.006885155604516662, 0.0018848364904344547], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, 0.006885155604516662, 0.0018848364904344547], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 15, 0.10327733406774993, 0.02827254735651682], "isController": false}, {"data": ["Assertion failed", 1796, 12.365739465711926, 3.385166336820281], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 53055, 14524, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 12664, "Assertion failed", 1796, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 14, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 10], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Save Poll", 5000, 2826, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1667, "Assertion failed", 1159, null, null, null, null, null, null], "isController": false}, {"data": ["Polls", 5000, 2937, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2369, "Assertion failed", 559, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 9, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show New Poll Form-1", 483, 78, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 78, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-2", 1221, 457, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 457, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-1", 1265, 273, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 273, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-2", 2622, 99, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 80, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 10, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1], "isController": false}, {"data": ["Show New Poll Form", 5000, 2074, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1993, "Assertion failed", 78, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3, null, null, null, null], "isController": false}, {"data": ["Save Poll-8", 390, 334, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 334, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-1", 2622, 99, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 88, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 5, null, null, null, null], "isController": false}, {"data": ["Save Poll-7", 716, 607, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 607, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-4", 2622, 333, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 333, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-3", 2622, 231, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 231, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-6", 2622, 366, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 366, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-4", 1109, 713, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 712, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-5", 2622, 341, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 341, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-3", 1201, 670, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 670, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-8", 2622, 431, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 420, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 7, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null], "isController": false}, {"data": ["Save Poll-6", 771, 556, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 555, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-7", 2622, 438, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 430, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 7, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null], "isController": false}, {"data": ["Save Poll-5", 964, 661, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 660, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
