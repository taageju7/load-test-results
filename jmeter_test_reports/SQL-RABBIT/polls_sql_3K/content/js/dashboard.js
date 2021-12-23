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

    var data = {"OkPercent": 61.92760282416228, "KoPercent": 38.07239717583772};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.15079009301804325, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.0065, 500, 1500, "Polls"], "isController": false}, {"data": [0.016986062717770034, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.046511627906976744, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.027678571428571427, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [1.0, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.009146341463414634, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.05429864253393665, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.9380438565958928, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.016666666666666666, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.0, 500, 1500, "Save Poll-8"], "isController": false}, {"data": [0.9324747650539505, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.0030211480362537764, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [0.0558649495301079, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.056387051862164986, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.056387051862164986, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.0035810205908683975, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.056387051862164986, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.0013428827215756492, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.05673512008353637, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.004531722054380665, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.05708318830490776, 500, 1500, "Polls-7"], "isController": false}, {"data": [0.003524672708962739, 500, 1500, "Save Poll-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 44615, 16986, 38.07239717583772, 59088.91088199024, 2, 408407, 41086.5, 256856.9, 273592.10000000003, 315644.80000000005, 95.31408892421018, 6157.78769517397, 59.38523287219815], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 3000, 2252, 75.06666666666666, 53207.90233333338, 4031, 408407, 4097.0, 114794.3, 229623.04999999993, 336063.77999999997, 6.497669502538423, 885.8755610500721, 11.05261196838234], "isController": false}, {"data": ["Polls", 3000, 1945, 64.83333333333333, 190767.30433333296, 624, 327709, 192601.0, 311657.1, 315488.8, 317605.94, 8.522751485089445, 2916.4454663090305, 23.48656408203574], "isController": false}, {"data": ["Save Poll-0", 1148, 0, 0.0, 28291.50696864104, 159, 286156, 10231.0, 54434.30000000022, 186959.49999999997, 266609.79, 2.6222558252682218, 0.9593328887243, 2.0826437622347194], "isController": false}, {"data": ["Show New Poll Form-0", 1075, 0, 0.0, 41660.06790697682, 93, 282895, 7826.0, 193945.7999999999, 252415.8, 277769.24, 2.926014033979869, 4.829066130298807, 1.4887239372104606], "isController": false}, {"data": ["Save Poll-2", 1120, 119, 10.625, 45185.58839285721, 3, 316324, 40152.0, 68869.2, 72037.5, 265876.19999999995, 2.4331534537744295, 133.72961478713708, 1.3654389255400732], "isController": false}, {"data": ["Show New Poll Form-1", 27, 0, 0.0, 131.14814814814818, 78, 200, 125.0, 195.4, 198.79999999999998, 200.0, 3.273124015032125, 454.0832127379076, 1.7740076448660442], "isController": false}, {"data": ["Save Poll-1", 1148, 28, 2.4390243902439024, 52549.584494773524, 162, 287270, 47722.5, 73355.3, 174452.99999999994, 272383.22, 2.4946922597174566, 99.12730633063472, 1.4905355031868173], "isController": false}, {"data": ["Polls-0", 2873, 0, 0.0, 125346.35816219979, 7, 284770, 122290.0, 246658.39999999997, 262909.79999999993, 277854.9, 8.347909971582819, 358.2722179928986, 4.165802729959785], "isController": false}, {"data": ["Polls-2", 2873, 0, 0.0, 305.57744517925465, 75, 6167, 104.0, 307.5999999999999, 1403.099999999998, 4780.639999999997, 8.354610011573737, 49.8828961042596, 4.405751373290838], "isController": false}, {"data": ["Show New Poll Form", 3000, 1925, 64.16666666666667, 18168.998666666663, 93, 284289, 4094.0, 21765.800000000007, 124119.69999999981, 266995.1599999998, 8.16562055994382, 29.444443605672657, 1.5354795575390452], "isController": false}, {"data": ["Save Poll-8", 27, 3, 11.11111111111111, 57861.51851851851, 27465, 74295, 61690.0, 70479.2, 73010.59999999999, 74295.0, 0.26045183570312347, 13.32094139773407, 0.14469546427951305], "isController": false}, {"data": ["Polls-1", 2873, 0, 0.0, 323.12669683257917, 71, 6310, 103.0, 340.0, 1506.4999999999905, 4978.459999999983, 8.354051264157253, 1158.9722299081507, 4.52783051914773], "isController": false}, {"data": ["Save Poll-7", 993, 139, 13.997985901309164, 47675.94561933533, 3, 357354, 42398.0, 69226.8, 80479.89999999943, 272349.22, 2.158446961545735, 104.46509738076374, 1.1656796370472533], "isController": false}, {"data": ["Polls-4", 2873, 1650, 57.43125652627915, 61586.33275321965, 4, 261725, 4100.0, 246557.2, 255859.3, 261037.75999999998, 8.247073480190375, 549.307312455686, 1.8067636883694163], "isController": false}, {"data": ["Polls-3", 2873, 1647, 57.32683605986774, 61672.58753915764, 3, 261720, 4100.0, 246393.2, 255841.5, 261031.41999999998, 8.247357573043514, 204.69614725161043, 1.7906365094846048], "isController": false}, {"data": ["Polls-6", 2873, 1648, 57.36164288200487, 61789.136442742776, 3, 261735, 4099.0, 246509.4, 255878.49999999997, 261064.69999999998, 8.247712716635231, 312.94624722612167, 1.7926872690827038], "isController": false}, {"data": ["Save Poll-4", 1117, 143, 12.802148612354522, 46422.769919427, 3, 311201, 41558.0, 68885.2, 71821.9, 271129.5999999998, 2.4273849002316554, 58.76679174947193, 1.3546168834996501], "isController": false}, {"data": ["Polls-5", 2873, 1647, 57.32683605986774, 61739.83049077626, 2, 261724, 4099.0, 246560.6, 255872.3, 261043.94, 8.170706042284044, 87.8615104830258, 1.8046390193161974], "isController": false}, {"data": ["Save Poll-3", 1117, 127, 11.369740376007162, 46312.22381378699, 3, 283100, 41560.0, 68675.2, 71205.39999999997, 261111.74, 2.427379625223017, 305.0707147316898, 1.35761259635089], "isController": false}, {"data": ["Polls-8", 2873, 1704, 59.31082492168465, 60344.432300731045, 2, 261668, 4097.0, 245940.6, 255703.89999999997, 261115.0, 8.257716639313399, 206.1587779691349, 1.7226545995524796], "isController": false}, {"data": ["Save Poll-6", 993, 135, 13.595166163141993, 47081.93554884194, 3, 288467, 42247.0, 69030.4, 95985.4999999998, 266403.29999999993, 2.157963820965064, 18.75597368745599, 1.1715668504268117], "isController": false}, {"data": ["Polls-7", 2873, 1727, 60.111381830838845, 59504.44030630006, 2, 297660, 4099.0, 245838.0, 255291.4, 261202.88, 8.250626048199967, 37.84266345727221, 1.6840974782893376], "isController": false}, {"data": ["Save Poll-5", 993, 147, 14.803625377643504, 47434.04531722053, 3, 330984, 42268.0, 69308.6, 108221.09999999947, 272516.9799999998, 2.157387149967737, 153.88065538442444, 1.1574841020337665], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 163, 0.9596137995996703, 0.3653479771377339], "isController": false}, {"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 2, 0.011774402449075709, 0.004482797265493668], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 126, 0.7417873542917697, 0.2824162277261011], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 10, 0.058872012245378545, 0.02241398632746834], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 498, 2.9318262098198518, 1.1162165191079234], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 219, 1.28929706817379, 0.49086630057155667], "isController": false}, {"data": ["Test failed: text expected to contain /Add a new Survey/", 124, 0.730012951842694, 0.2779334304606074], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 13781, 81.13152007535618, 30.88871455788412], "isController": false}, {"data": ["Assertion failed", 2063, 12.145296126221595, 4.624005379356719], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 44615, 16986, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 13781, "Assertion failed", 2063, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 498, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 219, "500", 163], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Save Poll", 3000, 2252, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1870, "Assertion failed", 245, "Test failed: text expected to contain /Add a new Survey/", 124, "500", 9, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 4], "isController": false}, {"data": ["Polls", 3000, 1945, "Assertion failed", 1818, "500", 127, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-2", 1120, 119, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 69, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 47, "500", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-1", 1148, 28, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 22, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 4, "500", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show New Poll Form", 3000, 1925, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1918, "500", 5, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 2, null, null, null, null], "isController": false}, {"data": ["Save Poll-8", 27, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-7", 993, 139, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 88, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 50, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Polls-4", 2873, 1650, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1650, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-3", 2873, 1647, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1647, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-6", 2873, 1648, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1648, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-4", 1117, 143, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 94, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 44, "500", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["Polls-5", 2873, 1647, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1646, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-3", 1117, 127, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 76, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 48, "500", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["Polls-8", 2873, 1704, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1527, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 126, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 50, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, null, null], "isController": false}, {"data": ["Save Poll-6", 993, 135, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 79, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 50, "500", 6, null, null, null, null], "isController": false}, {"data": ["Polls-7", 2873, 1727, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1565, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 93, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 68, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, null, null], "isController": false}, {"data": ["Save Poll-5", 993, 147, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 92, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 49, "500", 6, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
