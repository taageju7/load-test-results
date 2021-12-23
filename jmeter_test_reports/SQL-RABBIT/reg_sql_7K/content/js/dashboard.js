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

    var data = {"OkPercent": 61.237050843049715, "KoPercent": 38.762949156950285};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.010250964414199645, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.012942638227376268, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.0, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.0, 500, 1500, "Registration"], "isController": false}, {"data": [0.005, 500, 1500, "Welcome"], "isController": false}, {"data": [0.0, 500, 1500, "Registration-3"], "isController": false}, {"data": [0.025056947608200455, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.01366742596810934, 500, 1500, "Welcome-1"], "isController": false}, {"data": [7.476635514018691E-4, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.014495754814661421, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.04355140186915888, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 46142, 17886, 38.762949156950285, 37527.85065666803, 26, 182431, 36498.5, 118956.40000000069, 127261.9, 144295.79000000004, 172.35428588504237, 9032.485917913013, 110.53613163062722], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 4829, 2517, 52.12259266928971, 24389.610685442116, 43, 104742, 4931.0, 72273.0, 82604.5, 88981.6, 22.892982772188986, 436.2316650434607, 6.582762174193365], "isController": false}, {"data": ["Registration-4", 2492, 322, 12.92134831460674, 27694.229935794454, 1840, 91886, 25504.5, 45889.300000000025, 68441.7, 87593.61, 9.385392382466037, 303.1574629546285, 5.299467740538342], "isController": false}, {"data": ["Registration", 7000, 4866, 69.51428571428572, 40912.561857142886, 3445, 182431, 4632.5, 110550.00000000001, 129852.74999999999, 157906.99999999997, 26.285452504064857, 2063.56590296866, 29.419633343753635], "isController": false}, {"data": ["Welcome", 7000, 4944, 70.62857142857143, 60278.41299999993, 224, 157069, 70582.5, 126376.3, 128704.55, 135693.66999999998, 33.01357329484894, 3152.74438039713, 32.831957190533124], "isController": false}, {"data": ["Registration-3", 2492, 314, 12.60032102728732, 27884.41252006418, 1842, 96897, 25771.0, 46257.8, 69333.9, 87918.14, 9.385675169766978, 701.9124428342893, 5.2550788856205575], "isController": false}, {"data": ["Welcome-0", 4829, 0, 0.0, 45845.9150962931, 34, 107228, 49335.0, 83261.0, 87187.5, 98670.1, 30.329675851196793, 118.97881630298585, 15.342550870039002], "isController": false}, {"data": ["Registration-2", 2492, 317, 12.720706260032102, 27790.863964687043, 1840, 92848, 25540.0, 46542.800000000076, 70070.5, 88009.36000000003, 9.386276149366841, 976.9809931556832, 5.328179203202332], "isController": false}, {"data": ["Welcome-1", 4829, 2067, 42.8038931455788, 31361.016773659096, 26, 104354, 11732.0, 79926.0, 86397.5, 89950.5, 22.79841180664076, 1577.6946519084643, 7.856991264110325], "isController": false}, {"data": ["Registration-1", 2675, 183, 6.841121495327103, 40759.374953271, 277, 95511, 39581.0, 76850.40000000001, 85474.0, 89935.12, 10.172224313707595, 39.433111059536984, 5.931514905635982], "isController": false}, {"data": ["Welcome-2", 4829, 2356, 48.788569061917585, 26816.0126320149, 43, 106836, 5679.0, 75172.0, 84361.0, 89732.4, 23.015952452445294, 1035.9902409192082, 6.986901120234402], "isController": false}, {"data": ["Registration-0", 2675, 0, 0.0, 32291.92299065421, 59, 100299, 37524.0, 65151.200000000004, 77744.39999999995, 90674.11999999997, 11.417912677511193, 4.261484139238777, 8.783672838386382], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /You've successfully registered to our Survey app/", 8, 0.044727720004472775, 0.017337783364396862], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 14755, 82.49468858324947, 31.977374192709462], "isController": false}, {"data": ["Assertion failed", 3123, 17.46058369674606, 6.768237180876425], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 46142, 17886, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 14755, "Assertion failed", 3123, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 8, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Welcome-3", 4829, 2517, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2517, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-4", 2492, 322, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 322, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration", 7000, 4866, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4508, "Assertion failed", 350, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 8, null, null, null, null], "isController": false}, {"data": ["Welcome", 7000, 4944, "Assertion failed", 2773, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2171, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-3", 2492, 314, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 314, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-2", 2492, 317, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 317, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-1", 4829, 2067, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2067, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-1", 2675, 183, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 183, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-2", 4829, 2356, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2356, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
