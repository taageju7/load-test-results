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

    var data = {"OkPercent": 59.04571954587297, "KoPercent": 40.95428045412703};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.06925437250690396, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.004601226993865031, 500, 1500, "Login-1"], "isController": false}, {"data": [0.996875, 500, 1500, "Login-2"], "isController": false}, {"data": [0.0625, 500, 1500, "Login-3"], "isController": false}, {"data": [0.24411400247831475, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.009375, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.002330226364846871, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.09375, 500, 1500, "Login-5"], "isController": false}, {"data": [3.3288948069241014E-4, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.046875, 500, 1500, "Login-6"], "isController": false}, {"data": [0.04040404040404041, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [0.12876008804108585, 500, 1500, "Show New Poll Form-2"], "isController": false}, {"data": [0.0, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0011467889908256881, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.48484848484848486, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.12540453074433658, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.375, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [0.0, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.0014705882352941176, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.34834123222748814, 500, 1500, "Show New Poll Form-3"], "isController": false}, {"data": [0.0, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.375, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.22614622057001238, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Show New Poll Form-4"], "isController": false}, {"data": [0.0, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.5, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.7311028500619579, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.0, 500, 1500, "Show New Poll Form-5"], "isController": false}, {"data": [0.375, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.26332094175960347, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.375, 500, 1500, "Save Poll-5"], "isController": false}, {"data": [0.0, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "Polls"], "isController": false}, {"data": [0.0, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.0, 500, 1500, "Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32590, 13347, 40.95428045412703, 20525.364314206847, 3, 213231, 16472.0, 72965.1, 116373.40000000002, 162525.6900000002, 89.76675517556713, 3915.1598968174667, 58.804286085395475], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login-0", 326, 0, 0.0, 55900.6349693252, 12072, 141044, 29187.0, 113215.0, 127142.4, 137812.16000000003, 1.5523292080740168, 0.9444346646778441, 1.229432605222683], "isController": false}, {"data": ["Login-1", 326, 166, 50.920245398773005, 55013.0889570552, 982, 154483, 40696.5, 131019.40000000001, 140508.7, 151885.0500000001, 1.2853622474125184, 169.48521439132577, 0.8468072326269098], "isController": false}, {"data": ["Login-2", 160, 0, 0.0, 113.25, 78, 1406, 99.0, 117.9, 139.84999999999997, 763.6699999999856, 0.7000074375790242, 4.179536595076323, 0.4026409968105911], "isController": false}, {"data": ["Login-3", 160, 31, 19.375, 11937.300000000003, 208, 45451, 10910.5, 23116.7, 26907.25, 45302.159999999996, 0.6516807253206472, 28.764146690276515, 0.3617376926531144], "isController": false}, {"data": ["Welcome-3", 807, 56, 6.939281288723668, 4802.364312267654, 3, 16780, 5880.0, 7293.800000000003, 8845.0, 15320.11999999998, 9.309354343788574, 495.3571852793672, 5.211547723418737], "isController": false}, {"data": ["Login-4", 160, 44, 27.5, 11393.693749999997, 593, 45713, 9741.5, 22306.5, 27021.399999999998, 45667.25, 0.6514949773809087, 72.4750306915212, 0.32795837252482807], "isController": false}, {"data": ["Save Poll-0", 1356, 0, 0.0, 21129.387905604708, 2395, 80926, 17314.5, 46314.399999999994, 56848.19999999999, 61320.310000000005, 4.910285890170376, 1.5152835364197643, 3.9589830665749313], "isController": false}, {"data": ["Show New Poll Form-0", 1502, 0, 0.0, 15543.648468708412, 16, 69207, 12382.0, 31570.4, 34327.049999999996, 45265.05, 5.370096926316693, 1.5418051722042068, 3.1251871444813495], "isController": false}, {"data": ["Login-5", 160, 45, 28.125, 10988.493750000003, 253, 45398, 7559.5, 23135.700000000004, 27933.35, 45377.26, 0.6533625713083994, 10.437311552113831, 0.32743896930012617], "isController": false}, {"data": ["Show New Poll Form-1", 1502, 139, 9.254327563249001, 34888.00000000003, 829, 173172, 16811.0, 65743.0, 141544.3, 154054.88, 5.380735391052647, 130.4068685763441, 3.1324418355759036], "isController": false}, {"data": ["Login-6", 160, 65, 40.625, 10377.568750000002, 224, 45437, 4534.5, 22130.7, 24933.049999999996, 45416.26, 0.6532718713381049, 5.05334739951862, 0.2681429037322239], "isController": false}, {"data": ["Save Poll-2", 99, 0, 0.0, 25167.030303030304, 87, 47245, 23091.0, 43089.0, 46620.0, 47245.0, 0.38777908343125733, 25.226483701772423, 0.25025322537211125], "isController": false}, {"data": ["Show New Poll Form-2", 1363, 4, 0.293470286133529, 21754.921496698473, 72, 77497, 14276.0, 51598.60000000001, 58827.399999999994, 62900.83999999993, 4.895587147198057, 98.35201579302766, 2.756489661080262], "isController": false}, {"data": ["Save Poll-1", 1356, 18, 1.3274336283185841, 23940.49852507377, 2514, 72668, 16801.5, 55144.39999999998, 62119.74999999999, 63763.29, 4.169664766332724, 51.642458933722004, 2.6492582778300524], "isController": false}, {"data": ["Login-7", 11, 0, 0.0, 28992.63636363636, 6762, 45646, 29443.0, 45582.8, 45646.0, 45646.0, 0.05854240066419015, 2.004136511232158, 0.0405077655163972], "isController": false}, {"data": ["Polls-0", 1308, 0, 0.0, 22133.98853211009, 363, 88254, 14832.0, 51819.5, 58977.2, 62446.90000000014, 4.758578538374225, 8.163181692296778, 2.66744896260805], "isController": false}, {"data": ["Polls-2", 792, 11, 1.3888888888888888, 2488.376262626263, 77, 39624, 981.0, 6570.1, 7256.4, 13863.49999999999, 3.1420092990780266, 340.37112582839745, 1.7753727106871955], "isController": false}, {"data": ["Polls-1", 1236, 2, 0.16181229773462782, 14205.106796116515, 81, 49497, 9109.5, 28970.5, 32875.99999999998, 37719.91999999994, 4.524704667840552, 37.74245842515751, 2.4642127400546188], "isController": false}, {"data": ["Save Poll-7", 4, 0, 0.0, 1016.75, 722, 1775, 785.0, 1775.0, 1775.0, 1775.0, 0.13178703215603585, 4.212037098049552, 0.0911827268384291], "isController": false}, {"data": ["Polls-4", 668, 138, 20.65868263473054, 10688.53443113773, 1532, 58925, 5975.5, 29804.9, 31652.55, 37647.27999999997, 2.6585160068134424, 100.32461449279256, 1.2974428075799544], "isController": false}, {"data": ["Polls-3", 680, 101, 14.852941176470589, 11390.08676470588, 63, 50366, 6395.0, 29888.8, 31873.75, 40190.80999999998, 2.69452061308269, 232.28412676605024, 1.4040243272118844], "isController": false}, {"data": ["Show New Poll Form-3", 422, 0, 0.0, 10928.744075829383, 74, 38440, 12309.5, 23104.4, 27300.299999999985, 32852.22999999997, 2.0427723615803894, 212.097989917442, 1.1667393274825493], "isController": false}, {"data": ["Polls-6", 34, 0, 0.0, 5805.529411764706, 2637, 14788, 4563.0, 12986.5, 14098.0, 14788.0, 0.9218589013610975, 34.886809622580124, 0.5938226556992571], "isController": false}, {"data": ["Save Poll-4", 4, 0, 0.0, 1207.0, 854, 1878, 1048.0, 1878.0, 1878.0, 1878.0, 0.13098863673576316, 19.955939720666734, 0.09095011788977307], "isController": false}, {"data": ["Welcome-0", 807, 0, 0.0, 6490.5749690210605, 4, 21121, 8397.0, 10429.400000000001, 11388.599999999999, 17850.11999999992, 11.158584643464554, 27.852873387397853, 5.579292321732277], "isController": false}, {"data": ["Show New Poll Form-4", 201, 36, 17.91044776119403, 15669.820895522387, 3176, 41263, 13332.0, 30769.0, 32739.199999999993, 39796.679999999986, 2.202715586678502, 154.60984246063057, 1.082447469753756], "isController": false}, {"data": ["Polls-5", 159, 9, 5.660377358490566, 5577.157232704401, 2241, 39674, 4628.0, 7251.0, 11185.0, 36599.60000000003, 0.6787996772499648, 8.890776555902782, 0.4120092577176108], "isController": false}, {"data": ["Save Poll-3", 4, 0, 0.0, 894.0, 683, 1272, 810.5, 1272.0, 1272.0, 1272.0, 0.13168724279835392, 7.118184156378601, 0.09066358024691358], "isController": false}, {"data": ["Welcome-1", 807, 0, 0.0, 1090.6456009913243, 70, 6448, 208.0, 4199.400000000001, 4890.199999999998, 5732.239999999999, 11.047984119378466, 1575.2236554735096, 5.955553939352454], "isController": false}, {"data": ["Show New Poll Form-5", 201, 59, 29.35323383084577, 14549.835820895523, 1563, 50275, 6950.0, 31316.000000000007, 32908.69999999999, 44835.39999999998, 2.082534683009211, 85.56696739628771, 0.8850448625630718], "isController": false}, {"data": ["Save Poll-6", 4, 0, 0.0, 1130.0, 910, 1640, 985.0, 1640.0, 1640.0, 1640.0, 0.1314794727673142, 6.037206122834697, 0.09077733129540151], "isController": false}, {"data": ["Welcome-2", 807, 34, 4.2131350681536555, 4715.912019826521, 3, 17421, 5833.0, 7445.000000000001, 8962.199999999993, 13425.91999999993, 9.704651498388571, 790.1743034176727, 5.56475977755664], "isController": false}, {"data": ["Save Poll-5", 4, 0, 0.0, 991.0, 603, 1693, 834.0, 1693.0, 1693.0, 1693.0, 0.13281976358082084, 2.8024451288351706, 0.09261065546553328], "isController": false}, {"data": ["Save Poll", 3000, 1662, 55.4, 24448.924666666735, 3668, 153594, 9818.5, 72738.70000000001, 92916.24999999999, 122551.83999999982, 8.779785422044284, 88.4892394584043, 6.655671814547519], "isController": false}, {"data": ["Login", 3000, 2927, 97.56666666666666, 30277.757999999998, 3428, 213231, 4544.0, 114163.40000000001, 170343.74999999988, 202012.73999999996, 11.168775083207374, 720.8984185945213, 5.426679492918996], "isController": false}, {"data": ["Polls", 3000, 2693, 89.76666666666667, 21179.101666666647, 1690, 156026, 4600.0, 62046.3, 77091.54999999999, 91425.84, 10.551008852296427, 673.5350837805055, 9.34020502588514], "isController": false}, {"data": ["Show New Poll Form", 3000, 2824, 94.13333333333334, 39976.69000000004, 3693, 178763, 5652.0, 136379.5, 145722.19999999998, 165117.25999999995, 10.525392509428997, 471.99850547649334, 10.319013271862119], "isController": false}, {"data": ["Welcome", 3000, 2283, 76.1, 6555.304333333328, 1639, 37429, 4433.0, 15569.9, 17001.299999999996, 19777.219999999983, 34.51727589658624, 2666.751195789899, 20.170055562027546], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /Actions/", 990, 7.4173971679029, 3.0377416385394294], "isController": false}, {"data": ["500/Internal Server Error", 1123, 8.413875777328238, 3.4458422829088677], "isController": false}, {"data": ["Test failed: text expected to contain /Save Poll/", 1183, 8.863414999625384, 3.6299478367597424], "isController": false}, {"data": ["403/Forbidden", 602, 4.510376863714693, 1.8471923903037741], "isController": false}, {"data": ["Assertion failed", 188, 1.408556229864389, 0.5768640687327401], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 9261, 69.38637896156439, 28.41669223688248], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32590, 13347, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 9261, "Test failed: text expected to contain /Save Poll/", 1183, "500/Internal Server Error", 1123, "Test failed: text expected to contain /Actions/", 990, "403/Forbidden", 602], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Login-1", 326, 166, "500/Internal Server Error", 162, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 160, 31, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 31, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-3", 807, 56, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 56, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 160, 44, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 44, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-5", 160, 45, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 45, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show New Poll Form-1", 1502, 139, "500/Internal Server Error", 137, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 160, 65, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 65, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Show New Poll Form-2", 1363, 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-1", 1356, 18, "500/Internal Server Error", 18, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-2", 792, 11, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-1", 1236, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-4", 668, 138, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 138, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-3", 680, 101, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 101, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show New Poll Form-4", 201, 36, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 36, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-5", 159, 9, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show New Poll Form-5", 201, 59, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 59, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Welcome-2", 807, 34, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 34, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll", 3000, 1662, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1323, "403/Forbidden", 318, "500/Internal Server Error", 21, null, null, null, null], "isController": false}, {"data": ["Login", 3000, 2927, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1913, "500/Internal Server Error", 643, "403/Forbidden", 284, "Assertion failed", 87, null, null], "isController": false}, {"data": ["Polls", 3000, 2693, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1687, "Test failed: text expected to contain /Actions/", 990, "Assertion failed", 11, "500/Internal Server Error", 5, null, null], "isController": false}, {"data": ["Show New Poll Form", 3000, 2824, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1504, "Test failed: text expected to contain /Save Poll/", 1183, "500/Internal Server Error", 137, null, null, null, null], "isController": false}, {"data": ["Welcome", 3000, 2283, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2193, "Assertion failed", 90, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
