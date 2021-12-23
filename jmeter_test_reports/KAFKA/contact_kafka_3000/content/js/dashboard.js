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

    var data = {"OkPercent": 68.34375550466795, "KoPercent": 31.656244495332043};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.07505064294521754, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.028182515337423313, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.025690184049079755, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.027415644171779142, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.0285659509202454, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.02549846625766871, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.030291411042944784, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.9702837423312883, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [0.040452453987730064, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.0039198606271777, 500, 1500, "Send Email-2"], "isController": false}, {"data": [0.006188118811881188, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.0028333333333333335, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [0.0032665505226480837, 500, 1500, "Send Email-4"], "isController": false}, {"data": [0.0039198606271777, 500, 1500, "Send Email-3"], "isController": false}, {"data": [0.002640845070422535, 500, 1500, "Send Email-6"], "isController": false}, {"data": [0.003301056338028169, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.0035211267605633804, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email"], "isController": false}, {"data": [0.11138613861386139, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 45416, 14377, 31.656244495332043, 19766.584970054693, 2, 99923, 21252.5, 48086.00000000003, 67295.1, 88337.18000000028, 248.3838858930466, 14173.956659138701, 190.18694352077705], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 2608, 985, 37.76840490797546, 15677.627300613527, 15, 49739, 7005.5, 36845.0, 40409.54999999998, 45819.43999999999, 19.435708643226565, 108.16101781063225, 6.968886121689296], "isController": false}, {"data": ["Show Contact Page-5", 2608, 937, 35.92791411042945, 16198.064800613456, 26, 54307, 8367.5, 37229.1, 40143.299999999996, 45193.60999999994, 19.231336459900305, 1068.6871137878654, 7.07547658946111], "isController": false}, {"data": ["Show Contact Page-4", 2608, 892, 34.20245398773006, 16682.87768404912, 20, 51379, 10643.5, 37404.49999999999, 40486.599999999984, 44705.88999999997, 19.11140748774393, 287.06747519245147, 7.318948176428776], "isController": false}, {"data": ["Show Contact Page-3", 2608, 791, 30.329754601226995, 17748.916794478526, 14, 49350, 13758.0, 38258.299999999996, 40779.249999999985, 45461.38, 19.684058780463875, 2109.721392120716, 7.9417594821047155], "isController": false}, {"data": ["Show Contact Page-7", 2608, 1306, 50.076687116564415, 13981.147622699376, 18, 49349, 5814.5, 35700.0, 39750.99999999999, 44932.31999999999, 19.404328772423234, 581.5693985625321, 5.591000689158724], "isController": false}, {"data": ["Show Contact Page-2", 2608, 585, 22.430981595092025, 19949.586273006124, 24, 51331, 20558.5, 38845.6, 40389.99999999999, 43782.92999999998, 19.133560764462054, 818.1932866549282, 8.507897328142768], "isController": false}, {"data": ["Show Contact Page-1", 2608, 0, 0.0, 178.20552147239218, 74, 2481, 112.0, 177.0999999999999, 386.1999999999989, 1738.6399999999994, 23.61249434133092, 140.98319375282932, 12.451901312811227], "isController": false}, {"data": ["Show Contact Page-0", 2608, 0, 0.0, 21831.104294478533, 12, 50494, 21884.5, 39641.7, 41615.899999999994, 46361.76999999999, 23.606937253340092, 140.53504833629023, 11.826522276331511], "isController": false}, {"data": ["Send Email-2", 2296, 638, 27.78745644599303, 16105.291811846702, 3, 65504, 17767.5, 30606.50000000001, 37697.75000000001, 41030.53000000001, 12.762433088942375, 518.5250002779276, 5.727956523793377], "isController": false}, {"data": ["Send Email-1", 2424, 128, 5.2805280528052805, 23312.976485148483, 4, 46596, 23619.5, 36325.0, 39317.5, 42327.0, 13.973356084232128, 80.61687733826012, 8.219128481089275], "isController": false}, {"data": ["Show Contact Page", 3000, 1832, 61.06666666666667, 44048.28500000003, 941, 84927, 53272.5, 71416.5, 72658.95, 75029.73999999999, 21.96257577088641, 5124.639033056422, 62.509994687801985], "isController": false}, {"data": ["Send Email-4", 2296, 835, 36.36759581881533, 14623.867160278747, 3, 68378, 15593.5, 28968.5, 37174.70000000001, 41254.600000000006, 12.762362148701529, 187.68013079197794, 5.117752254327308], "isController": false}, {"data": ["Send Email-3", 2296, 745, 32.44773519163763, 15326.371515679408, 3, 62432, 16945.0, 30129.500000000007, 37600.55, 41018.51, 12.76257497179004, 1316.6998196664415, 5.407042884002868], "isController": false}, {"data": ["Send Email-6", 2272, 895, 39.392605633802816, 14119.883362676046, 2, 68414, 14508.5, 28463.20000000001, 37199.5, 41090.869999999995, 12.629168264767845, 68.34797550110893, 4.776406320351193], "isController": false}, {"data": ["Send Email-5", 2272, 844, 37.147887323943664, 14427.120598591571, 3, 71656, 15004.0, 28769.4, 37552.8, 41630.7, 12.62895766631092, 688.1188956158562, 4.937724598952775], "isController": false}, {"data": ["Send Email-7", 2272, 904, 39.7887323943662, 13871.680017605653, 2, 64717, 14176.5, 27342.100000000002, 37029.85, 41503.36, 12.62923846581434, 448.4288580461367, 4.752640355753196], "isController": false}, {"data": ["Send Email", 3000, 2060, 68.66666666666667, 49668.82800000015, 2209, 99923, 57216.5, 82668.00000000001, 91211.55, 95457.76999999999, 16.645674621449615, 3313.3531612650295, 49.0983354498771], "isController": false}, {"data": ["Send Email-0", 2424, 0, 0.0, 16137.344059405934, 25, 52126, 20117.5, 35162.5, 39471.0, 44285.75, 15.193205678648658, 5.603434767620421, 11.887173289667492], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 0.006955554009876887, 0.002201867183371499], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 207, 1.4397996800445156, 0.4557865069579003], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3394, 23.607150309522154, 7.473137220362868], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 121, 0.8416220351951033, 0.2664259291879514], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, 0.006955554009876887, 0.002201867183371499], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 7857, 54.649787855602696, 17.30007045974987], "isController": false}, {"data": ["Assertion failed", 2772, 19.28079571537873, 6.103575832305795], "isController": false}, {"data": ["Test failed: text expected to contain /Thankyou for your feedback!/", 24, 0.16693329623704528, 0.05284481240091598], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 45416, 14377, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 7857, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3394, "Assertion failed", 2772, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 207, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 121], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 2608, 985, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 982, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-5", 2608, 937, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 934, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-4", 2608, 892, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 890, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-3", 2608, 791, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 791, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-7", 2608, 1306, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 992, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 194, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 118, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1], "isController": false}, {"data": ["Show Contact Page-2", 2608, 585, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 583, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-2", 2296, 638, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 416, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 222, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-1", 2424, 128, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 122, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 3000, 1832, "Assertion failed", 1440, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 392, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 2296, 835, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 585, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 247, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 2296, 745, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 528, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 217, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-6", 2272, 895, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 636, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 257, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 2272, 844, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 609, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 234, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-7", 2272, 904, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 608, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 296, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email", 3000, 2060, "Assertion failed", 1332, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 698, "Test failed: text expected to contain /Thankyou for your feedback!/", 24, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
