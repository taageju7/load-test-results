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

    var data = {"OkPercent": 34.275129934756166, "KoPercent": 65.72487006524383};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.05400586088687383, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login-3"], "isController": false}, {"data": [0.49666666666666665, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.041530054644808745, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.08229166666666667, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.002890173410404624, 500, 1500, "Login-5"], "isController": false}, {"data": [0.03802083333333333, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.002890173410404624, 500, 1500, "Login-6"], "isController": false}, {"data": [0.06140350877192982, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [0.25315126050420167, 500, 1500, "Show New Poll Form-2"], "isController": false}, {"data": [0.0, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0593841642228739, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.4934640522875817, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.14663023679417123, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.04619565217391304, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.08378378378378379, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.4721254355400697, 500, 1500, "Show New Poll Form-3"], "isController": false}, {"data": [0.0, 500, 1500, "Polls-6"], "isController": false}, {"data": [1.0, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.46555555555555556, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Show New Poll Form-4"], "isController": false}, {"data": [0.0, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.32666666666666666, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.0, 500, 1500, "Show New Poll Form-5"], "isController": false}, {"data": [0.5355555555555556, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "Polls"], "isController": false}, {"data": [0.0042, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [3.0E-4, 500, 1500, "Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 36172, 23774, 65.72487006524383, 9269.575528032761, 1, 111900, 6269.5, 32748.800000000003, 51793.50000000001, 88906.0, 135.5746706396057, 3632.8537139718146, 51.49459577219317], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login-0", 247, 0, 0.0, 29240.955465587038, 19392, 73748, 23112.0, 41100.4, 51416.8, 62373.24000000003, 1.9168684422921711, 1.166219765183616, 1.5181448307606942], "isController": false}, {"data": ["Login-1", 247, 74, 29.959514170040485, 39819.13360323884, 4852, 80662, 47949.0, 72420.2, 74307.8, 76164.36, 2.0650792589124474, 163.58801707975218, 1.3662387627708847], "isController": false}, {"data": ["Login-2", 173, 0, 0.0, 107.19075144508675, 80, 417, 99.0, 125.6, 147.79999999999956, 379.99999999999955, 1.5059454377687633, 8.991553131365448, 0.8662127566853531], "isController": false}, {"data": ["Login-3", 173, 8, 4.624277456647399, 7706.260115606937, 1550, 33234, 6271.0, 11426.199999999999, 13661.4, 32918.02, 1.4556653147771066, 75.23926545434848, 0.9558473386777847], "isController": false}, {"data": ["Welcome-3", 450, 94, 20.88888888888889, 3633.5133333333333, 3, 33017, 1121.5, 10851.100000000002, 13095.899999999994, 23666.690000000017, 4.721435316336166, 215.60866760439617, 2.2469441821424825], "isController": false}, {"data": ["Save Poll-0", 915, 0, 0.0, 8429.712568306015, 32, 19683, 8679.0, 12733.8, 13766.999999999996, 17204.60000000001, 3.806979879175196, 1.1748101970892206, 3.0837772209462946], "isController": false}, {"data": ["Login-4", 173, 11, 6.358381502890174, 7418.289017341041, 2927, 42315, 6189.0, 11409.8, 12906.199999999997, 35250.95999999991, 1.4686531686404347, 209.78934370887984, 0.9548997994397046], "isController": false}, {"data": ["Show New Poll Form-0", 960, 0, 0.0, 9212.19687500001, 2, 30530, 7235.5, 20664.59999999999, 24628.949999999997, 27124.199999999997, 3.9945906584833035, 1.14688442733798, 2.3052442005617393], "isController": false}, {"data": ["Login-5", 173, 12, 6.936416184971098, 7122.196531791907, 1089, 15738, 6290.0, 11367.4, 12989.299999999997, 15422.759999999997, 1.455763308032784, 28.876051983582695, 0.9446453628048268], "isController": false}, {"data": ["Show New Poll Form-1", 960, 8, 0.8333333333333334, 10692.710416666667, 89, 46757, 9602.0, 17090.0, 21097.899999999972, 39610.09, 3.9796210240062346, 11.311525433301966, 2.3004917008319894], "isController": false}, {"data": ["Login-6", 173, 13, 7.514450867052023, 7702.838150289016, 1229, 41480, 6258.0, 12491.4, 13673.199999999999, 25291.0199999998, 1.4585370788790342, 21.52594468993441, 0.9323664026405423], "isController": false}, {"data": ["Save Poll-2", 57, 0, 0.0, 6446.771929824562, 334, 15060, 6522.0, 9038.400000000003, 10753.09999999999, 15060.0, 0.3674242912578803, 26.11442592573195, 0.24033532099668675], "isController": false}, {"data": ["Show New Poll Form-2", 952, 0, 0.0, 8951.676470588242, 68, 46973, 9212.0, 15800.5, 17625.74999999998, 42101.4, 3.958419958419958, 144.1331454651767, 2.1931807107588357], "isController": false}, {"data": ["Save Poll-1", 915, 61, 6.666666666666667, 16499.68852459018, 2642, 98042, 8617.0, 35789.8, 81171.3999999996, 97029.00000000001, 3.583555592109128, 100.38511978108001, 2.29037224795659], "isController": false}, {"data": ["Login-7", 45, 2, 4.444444444444445, 7328.222222222222, 3301, 14608, 6783.0, 10993.4, 11317.599999999999, 14608.0, 0.5564348600257196, 19.22911118418612, 0.3679256456190029], "isController": false}, {"data": ["Polls-0", 682, 0, 0.0, 26478.743401759515, 1, 97929, 21656.5, 64610.00000000001, 88952.5, 94299.70999999993, 2.814402145878469, 16.17997523986382, 1.566352651397916], "isController": false}, {"data": ["Polls-2", 459, 2, 0.4357298474945534, 3351.7407407407413, 75, 18170, 1211.0, 9806.0, 12554.0, 15808.8, 3.356637219914585, 395.3970329593986, 1.8841877317286315], "isController": false}, {"data": ["Polls-1", 549, 4, 0.7285974499089253, 11082.304189435337, 5, 46177, 12214.0, 16869.0, 18146.0, 30756.0, 3.9492709314956156, 19.11504848017811, 2.0827497922856133], "isController": false}, {"data": ["Polls-4", 368, 49, 13.315217391304348, 8020.695652173911, 3, 18062, 7487.0, 13374.700000000006, 14386.95, 16724.870000000003, 2.6919475655430714, 120.89251400379652, 1.4210247368401803], "isController": false}, {"data": ["Polls-3", 370, 33, 8.91891891891892, 7897.132432432435, 4, 24283, 7458.5, 13812.7, 14427.0, 16606.060000000005, 2.701676499795549, 228.82414864103848, 1.490970604664408], "isController": false}, {"data": ["Show New Poll Form-3", 287, 12, 4.181184668989547, 2711.891986062717, 78, 23713, 1262.0, 5918.6, 12708.59999999995, 21501.120000000006, 3.0776489764404364, 368.92123276194866, 1.6330008317426785], "isController": false}, {"data": ["Polls-6", 11, 1, 9.090909090909092, 6986.272727272727, 4504, 9195, 7152.0, 8889.2, 9195.0, 9195.0, 0.34177411837812643, 10.019801295246232, 0.20010656167469318], "isController": false}, {"data": ["Save Poll-4", 3, 0, 0.0, 304.3333333333333, 281, 342, 290.0, 342.0, 342.0, 342.0, 0.5350454788657035, 3.722850621990369, 0.36993378812199035], "isController": false}, {"data": ["Welcome-0", 450, 0, 0.0, 6892.075555555556, 36, 37710, 1100.5, 28694.800000000003, 29808.35, 32909.070000000014, 4.971386906471642, 12.409047786075698, 2.4856934532358204], "isController": false}, {"data": ["Show New Poll Form-4", 212, 17, 8.018867924528301, 8158.033018867917, 2521, 15475, 7505.0, 13200.100000000004, 14142.949999999999, 15094.24, 3.4906312773734647, 271.9430863478447, 1.9221883541344222], "isController": false}, {"data": ["Polls-5", 52, 8, 15.384615384615385, 7460.365384615384, 4455, 14706, 7517.5, 10188.800000000003, 11476.19999999999, 14706.0, 1.085436366293026, 16.047265894076023, 0.5908868680464233], "isController": false}, {"data": ["Save Poll-3", 7, 0, 0.0, 2054.428571428571, 257, 4509, 373.0, 4509.0, 4509.0, 4509.0, 0.061752355411270686, 1.3698288605146618, 0.0425322793897103], "isController": false}, {"data": ["Welcome-1", 450, 0, 0.0, 2421.319999999999, 71, 7168, 2106.5, 5559.900000000001, 6021.299999999999, 6679.0, 4.979528604625429, 709.9811236098816, 2.684277138430895], "isController": false}, {"data": ["Show New Poll Form-5", 209, 25, 11.961722488038278, 8316.023923444973, 3117, 18082, 7514.0, 13661.0, 14559.0, 15952.1, 6.021839974644884, 304.06833793435044, 3.189198144466534], "isController": false}, {"data": ["Welcome-2", 450, 64, 14.222222222222221, 3730.3555555555545, 4, 33164, 410.5, 11528.100000000004, 13361.05, 30279.440000000017, 4.720890464850347, 345.63938068473897, 2.4241485677342873], "isController": false}, {"data": ["Save Poll", 5000, 4146, 82.92, 9056.777200000002, 581, 111900, 4096.0, 20415.900000000038, 28870.399999999994, 59287.30999999931, 19.55569461827284, 202.8042675109023, 6.294577053103488], "isController": false}, {"data": ["Login", 5000, 4843, 96.86, 10368.701600000002, 840, 102312, 4364.5, 28386.000000000073, 62013.09999999998, 88933.88999999997, 33.676610247118965, 827.0988697392925, 8.188237570384116], "isController": false}, {"data": ["Polls", 5000, 4816, 96.32, 9592.076799999986, 868, 97929, 4148.0, 31938.800000000007, 46299.45, 84211.04999999997, 20.633446817290828, 550.4419305491076, 5.730718205148046], "isController": false}, {"data": ["Show New Poll Form", 5000, 4763, 95.26, 9429.860000000015, 421, 79841, 4095.0, 26393.800000000003, 39883.69999999991, 64458.10999999998, 20.709850847654195, 456.79397659165556, 8.350729608045363], "isController": false}, {"data": ["Welcome", 5000, 4708, 94.16, 5176.118200000011, 907, 53215, 4419.0, 4855.0, 5558.899999999996, 39783.12999999998, 52.311651897343616, 1374.0389164360595, 9.550084646791726], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 0.004206275763439051, 0.0027645692801061593], "isController": false}, {"data": ["Test failed: text expected to contain /Actions/", 483, 2.031631193741062, 1.335286962291275], "isController": false}, {"data": ["500/Internal Server Error", 571, 2.4017834609236983, 1.578569058940617], "isController": false}, {"data": ["403/Forbidden", 479, 2.0148060906873053, 1.3242286851708505], "isController": false}, {"data": ["Test failed: text expected to contain /Save Poll/", 715, 3.0074871708589215, 1.976667035275904], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 26, 0.10936316984941533, 0.07187880128276014], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 21314, 89.65256162193994, 58.92402963618268], "isController": false}, {"data": ["Assertion failed", 185, 0.7781610162362245, 0.5114453168196395], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 36172, 23774, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 21314, "Test failed: text expected to contain /Save Poll/", 715, "500/Internal Server Error", 571, "Test failed: text expected to contain /Actions/", 483, "403/Forbidden", 479], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Login-1", 247, 74, "500/Internal Server Error", 72, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 173, 8, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-3", 450, 94, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 94, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-4", 173, 11, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-5", 173, 12, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show New Poll Form-1", 960, 8, "500/Internal Server Error", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 173, 13, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-1", 915, 61, "500/Internal Server Error", 61, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 45, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-2", 459, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-1", 549, 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-4", 368, 49, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-3", 370, 33, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 33, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show New Poll Form-3", 287, 12, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-6", 11, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show New Poll Form-4", 212, 17, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 17, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-5", 52, 8, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show New Poll Form-5", 209, 25, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 25, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-2", 450, 64, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 64, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll", 5000, 4146, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3739, "403/Forbidden", 302, "500/Internal Server Error", 101, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 4, null, null], "isController": false}, {"data": ["Login", 5000, 4843, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4367, "500/Internal Server Error", 275, "403/Forbidden", 177, "Assertion failed", 16, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 8], "isController": false}, {"data": ["Polls", 5000, 4816, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4270, "Test failed: text expected to contain /Actions/", 483, "500/Internal Server Error", 46, "Assertion failed", 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 6], "isController": false}, {"data": ["Show New Poll Form", 5000, 4763, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4034, "Test failed: text expected to contain /Save Poll/", 715, "500/Internal Server Error", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1], "isController": false}, {"data": ["Welcome", 5000, 4708, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4547, "Assertion failed", 158, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 3, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
