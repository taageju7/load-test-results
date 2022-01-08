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

    var data = {"OkPercent": 71.92951083510803, "KoPercent": 28.070489164891974};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7036805228163152, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9449404761904762, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.9994419642857143, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.2690714285714286, 500, 1500, "Login"], "isController": false}, {"data": [0.9886513157894737, 500, 1500, "Login-0"], "isController": false}, {"data": [0.6536796536796536, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.999671052631579, 500, 1500, "Login-1"], "isController": false}, {"data": [0.7931034482758621, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.8294407894736842, 500, 1500, "Login-2"], "isController": false}, {"data": [0.9998521147589471, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.859703947368421, 500, 1500, "Login-3"], "isController": false}, {"data": [0.8425986842105263, 500, 1500, "Login-4"], "isController": false}, {"data": [0.8394736842105263, 500, 1500, "Login-5"], "isController": false}, {"data": [0.8253289473684211, 500, 1500, "Login-6"], "isController": false}, {"data": [0.8289473684210527, 500, 1500, "Login-7"], "isController": false}, {"data": [0.797203947368421, 500, 1500, "Login-8"], "isController": false}, {"data": [0.41864285714285715, 500, 1500, "Logout"], "isController": false}, {"data": [0.9328497023809523, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.3362142857142857, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 61513, 17267, 28.070489164891974, 100.37031196657752, 0, 8338, 4.0, 81.0, 114.0, 414.9900000000016, 1023.2043647493263, 50460.41679553648, 747.234897669999], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 2688, 146, 5.431547619047619, 28.195312500000107, 1, 1082, 4.0, 92.0, 144.0, 270.0, 46.7356341823872, 5247.843769016778, 23.78187347865774], "isController": false}, {"data": ["Login Welcome-0", 2688, 0, 0.0, 9.731770833333313, 0, 1070, 2.0, 15.0, 41.54999999999973, 175.11000000000013, 46.76409185803758, 95.03522964509395, 23.336377870563677], "isController": false}, {"data": ["Login", 7000, 4674, 66.77142857142857, 349.32342857142936, 2, 8338, 25.0, 318.90000000000055, 2528.4499999999907, 6991.299999999963, 117.90665161953208, 16964.403096918217, 263.6535507798683], "isController": false}, {"data": ["Login-0", 3040, 0, 0.0, 34.72894736842087, 0, 1244, 1.0, 24.0, 77.94999999999982, 1184.5900000000001, 53.4204930852092, 10.590195406540497, 34.065998031876575], "isController": false}, {"data": ["Logout-2", 693, 240, 34.63203463203463, 3.611832611832611, 1, 60, 3.0, 6.0, 10.0, 24.059999999999945, 22.964509394572026, 567.1252500869867, 8.933878657586904], "isController": false}, {"data": ["Login-1", 3040, 0, 0.0, 4.823026315789474, 1, 1142, 2.0, 3.0, 6.0, 60.36000000000058, 53.48158052144541, 259.7825991344428, 35.045059111220574], "isController": false}, {"data": ["Logout-1", 1015, 210, 20.689655172413794, 3.2315270935960596, 1, 28, 3.0, 5.0, 7.0, 17.840000000000032, 33.63934643555497, 2702.513843347115, 16.318882724207075], "isController": false}, {"data": ["Login-2", 3040, 96, 3.1578947368421053, 707.746381578947, 3, 7700, 101.0, 3370.9, 5057.199999999997, 6626.950000000001, 53.38484502590218, 313.35538609074547, 29.737026955834576], "isController": false}, {"data": ["Logout-0", 3381, 0, 0.0, 19.81484767820167, 1, 522, 2.0, 35.0, 130.59999999999854, 356.5399999999995, 64.7044188850401, 131.49403876930512, 38.090516333990394], "isController": false}, {"data": ["Login-3", 3040, 421, 13.848684210526315, 40.207236842105274, 2, 1107, 8.0, 110.0, 201.0, 422.59000000000015, 53.44679055538951, 2507.7435831436032, 30.1721396791874], "isController": false}, {"data": ["Login-4", 3040, 470, 15.460526315789474, 41.910526315789376, 2, 1320, 8.0, 120.0, 199.0, 446.1800000000003, 53.44960967719249, 6904.827428858394, 29.873959633676773], "isController": false}, {"data": ["Login-5", 3040, 481, 15.822368421052632, 41.815460526315775, 2, 1304, 8.0, 121.90000000000009, 202.89999999999964, 435.1800000000003, 53.44679055538951, 970.4464122852899, 29.87633287329243], "isController": false}, {"data": ["Login-6", 3040, 525, 17.269736842105264, 41.214144736842165, 2, 1106, 8.0, 122.90000000000009, 199.94999999999982, 423.1800000000003, 53.44679055538951, 3776.154101524728, 29.01718999982419], "isController": false}, {"data": ["Login-7", 3040, 516, 16.973684210526315, 40.72434210526308, 2, 1075, 8.0, 123.90000000000009, 207.94999999999982, 409.1800000000003, 53.44303218887893, 331.4159519320359, 29.20564470052564], "isController": false}, {"data": ["Login-8", 3040, 609, 20.032894736842106, 40.146710526315765, 0, 1249, 7.0, 111.0, 220.94999999999982, 419.3600000000006, 53.47217336241469, 2462.64845976175, 28.186621760228313], "isController": false}, {"data": ["Logout", 7000, 4069, 58.128571428571426, 21.080142857142842, 1, 715, 4.0, 44.900000000000546, 127.0, 344.9899999999998, 128.15583749839803, 2095.1230088644934, 50.38961305518939], "isController": false}, {"data": ["Login Welcome-2", 2688, 176, 6.5476190476190474, 30.96837797619048, 1, 1181, 4.0, 95.0, 152.09999999999945, 321.880000000001, 46.84640722215445, 1602.0056880566062, 23.471402865159728], "isController": false}, {"data": ["Login Welcome", 7000, 4634, 66.2, 43.3718571428572, 1, 1195, 5.0, 138.0, 255.0, 589.9699999999993, 116.71140603898161, 6833.112979767245, 67.62517428555947], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, 0.01737418196559912, 0.004877017866142116], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 4, 0.02316557595413216, 0.006502690488189488], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 10, 0.0579139398853304, 0.01625672622047372], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 0.00579139398853304, 0.001625672622047372], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 15763, 91.2897434412463, 25.625477541332728], "isController": false}, {"data": ["Assertion failed", 1486, 8.606011466960098, 2.415749516362395], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 61513, 17267, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 15763, "Assertion failed", 1486, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 10, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 4, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 2688, 146, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 146, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 7000, 4674, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3960, "Assertion failed", 714, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 693, 240, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 240, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-1", 1015, 210, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 210, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 3040, 96, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 91, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 4, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 3040, 421, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 421, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 3040, 470, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 470, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 3040, 481, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 480, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 3040, 525, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 524, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 3040, 516, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 516, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 3040, 609, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 598, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 8, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, null, null, null, null], "isController": false}, {"data": ["Logout", 7000, 4069, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3619, "Assertion failed", 450, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 2688, 176, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 176, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 7000, 4634, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4312, "Assertion failed", 322, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
