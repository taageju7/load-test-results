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

    var data = {"OkPercent": 99.9988911988912, "KoPercent": 0.0011088011088011087};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9946888426888427, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9571823899371069, 500, 1500, "Session Test"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.58, 500, 1500, "Login"], "isController": false}, {"data": [0.9992201257861635, 500, 1500, "Session Test-0"], "isController": false}, {"data": [0.825, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.985, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.999748427672956, 500, 1500, "Session Test-5"], "isController": false}, {"data": [1.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.9998490566037735, 500, 1500, "Session Test-6"], "isController": false}, {"data": [1.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.999874213836478, 500, 1500, "Session Test-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-7"], "isController": false}, {"data": [1.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.9993710691823899, 500, 1500, "Session Test-1"], "isController": false}, {"data": [0.9998993710691824, 500, 1500, "Session Test-2"], "isController": false}, {"data": [0.999874213836478, 500, 1500, "Session Test-3"], "isController": false}, {"data": [0.9998490566037735, 500, 1500, "Session Test-4"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 180375, 2, 0.0011088011088011087, 110.44785585585521, 2, 1151, 46.0, 143.0, 239.0, 328.9900000000016, 1448.167060070331, 123440.84109289445, 1479.4358458479855], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Session Test", 19875, 1, 0.005031446540880503, 338.01222641509816, 15, 926, 363.0, 495.0, 519.0, 575.0, 161.49739572753052, 61952.58450903522, 742.1894203208416], "isController": false}, {"data": ["Login Welcome-1", 100, 0, 0.0, 50.61, 4, 131, 51.0, 94.70000000000002, 102.0, 130.7899999999999, 1.6675282229151729, 198.16390812336374, 1.0047508921275992], "isController": false}, {"data": ["Login Welcome-0", 100, 0, 0.0, 36.97000000000001, 2, 129, 31.5, 72.0, 78.84999999999997, 128.82999999999993, 1.669198284064164, 4.291991290957953, 0.8329690655828006], "isController": false}, {"data": ["Login", 100, 0, 0.0, 736.1599999999999, 395, 1151, 721.0, 1025.5, 1083.9999999999995, 1150.87, 1.6495389538623955, 641.4032473236231, 9.341480852976593], "isController": false}, {"data": ["Session Test-0", 19875, 0, 0.0, 143.70666666666662, 3, 650, 157.0, 218.0, 232.0, 268.2400000000016, 161.51051951534654, 57.84875574682871, 92.11146816109607], "isController": false}, {"data": ["Login-0", 100, 0, 0.0, 444.62, 165, 757, 427.5, 662.8, 700.2999999999998, 756.7099999999998, 1.6609088493223492, 0.7120497898950305, 1.2164859736247675], "isController": false}, {"data": ["Login-1", 100, 0, 0.0, 78.52999999999996, 4, 253, 78.0, 161.60000000000002, 178.84999999999997, 252.67999999999984, 1.6611295681063123, 7.823855377906976, 1.0073842400332225], "isController": false}, {"data": ["Login-2", 100, 0, 0.0, 203.77999999999997, 105, 838, 179.0, 282.20000000000016, 328.95, 837.7299999999999, 1.6564518800728838, 9.890182416763293, 0.952783356799735], "isController": false}, {"data": ["Login-3", 100, 0, 0.0, 55.72000000000001, 4, 167, 53.0, 109.80000000000001, 140.29999999999984, 166.85999999999993, 1.6567537566891435, 89.9549337091403, 1.0289994035686476], "isController": false}, {"data": ["Login-4", 100, 0, 0.0, 55.95999999999998, 4, 175, 55.0, 107.80000000000001, 121.74999999999994, 174.7799999999999, 1.6565341991485414, 252.76220606871306, 1.0385692928255503], "isController": false}, {"data": ["Session Test-5", 19875, 1, 0.005031446540880503, 68.24000000000031, 4, 516, 71.0, 110.0, 123.0, 151.0, 161.5131445288692, 13746.842168834564, 92.73920960139775], "isController": false}, {"data": ["Login-5", 100, 0, 0.0, 54.06, 4, 163, 50.0, 105.9, 115.84999999999997, 162.65999999999983, 1.6569184630424336, 35.34705451675973, 1.0436644615843453], "isController": false}, {"data": ["Session Test-6", 19875, 0, 0.0, 67.40347169811292, 2, 514, 70.0, 110.0, 122.0, 153.0, 161.51576962772137, 1162.2863185730946, 93.06084382847229], "isController": false}, {"data": ["Login-6", 100, 0, 0.0, 56.39, 5, 211, 50.5, 105.0, 130.69999999999993, 210.42999999999972, 1.6573853089366217, 141.07197610050386, 1.0310101970631134], "isController": false}, {"data": ["Session Test-7", 19875, 0, 0.0, 67.49745911949641, 3, 517, 70.0, 110.0, 122.0, 151.0, 161.51576962772137, 9238.868054123528, 93.21857407224935], "isController": false}, {"data": ["Login-7", 100, 0, 0.0, 55.50999999999999, 4, 221, 51.0, 106.9, 113.0, 220.09999999999954, 1.657742486282181, 11.929594122474015, 1.034470164779603], "isController": false}, {"data": ["Login-8", 100, 0, 0.0, 61.69999999999999, 4, 211, 55.0, 126.50000000000003, 162.5499999999999, 210.8099999999999, 1.6545881730037395, 94.64438246632913, 1.034117608127337], "isController": false}, {"data": ["Session Test-1", 19875, 0, 0.0, 104.59038993710669, 3, 576, 112.0, 167.0, 181.0, 215.0, 161.51183201144195, 894.7422740332654, 91.00813190488476], "isController": false}, {"data": ["Session Test-2", 19875, 0, 0.0, 67.14681761006266, 3, 524, 70.0, 109.0, 121.0, 148.0, 161.5131445288692, 8769.464698838934, 92.58614827973264], "isController": false}, {"data": ["Session Test-3", 19875, 0, 0.0, 68.13645283018876, 4, 510, 71.0, 110.0, 122.0, 149.0, 161.5131445288692, 24643.205805775364, 93.53251436095648], "isController": false}, {"data": ["Session Test-4", 19875, 0, 0.0, 67.09031446540892, 3, 522, 70.0, 109.0, 121.0, 148.0, 161.51445706762885, 3445.556723953508, 94.00646134014335], "isController": false}, {"data": ["Login Welcome-3", 100, 0, 0.0, 52.01999999999999, 5, 116, 58.0, 91.0, 102.84999999999997, 115.99, 1.6679454248256997, 61.1585418612603, 1.0017445666677787], "isController": false}, {"data": ["Login Welcome-2", 100, 0, 0.0, 50.68, 5, 190, 52.0, 93.9, 114.0, 189.33999999999966, 1.6678063343284577, 142.01761828916426, 0.9886312938841542], "isController": false}, {"data": ["Login Welcome", 100, 0, 0.0, 102.62999999999997, 11, 248, 95.5, 178.40000000000003, 194.44999999999987, 247.73999999999987, 1.665556295802798, 405.1091589981679, 3.822321577281812], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 50.0, 5.544005544005544E-4], "isController": false}, {"data": ["Assertion failed", 1, 50.0, 5.544005544005544E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 180375, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Assertion failed", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Session Test", 19875, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Session Test-5", 19875, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
