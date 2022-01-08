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

    var data = {"OkPercent": 74.78308577002012, "KoPercent": 25.216914229979885};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03552923008148254, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.017666666666666667, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.019833333333333335, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.02538787023977433, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0019464720194647203, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.019217207334273626, 500, 1500, "Login-1"], "isController": false}, {"data": [0.03157644824311491, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.3601321585903084, 500, 1500, "Login-2"], "isController": false}, {"data": [0.18067426400759734, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0014684287812041115, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0012848751835535977, 500, 1500, "Login-4"], "isController": false}, {"data": [0.001002004008016032, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [9.732360097323601E-4, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [9.732360097323601E-4, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.0115, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.010166666666666666, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 49213, 12410, 25.216914229979885, 32438.476296913654, 0, 151617, 31953.0, 65490.800000000076, 88113.9, 127694.87000000002, 166.56569314654922, 10316.566089116817, 133.32762492723137], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 555, 18.5, 31591.720999999932, 0, 67577, 37213.5, 58280.5, 59393.399999999994, 61310.73999999999, 18.235419262681212, 1773.4720653796767, 8.95485522786676], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 29728.883666666643, 169, 56386, 30259.5, 50946.7, 53000.75, 54313.78999999999, 25.840906154442482, 66.36873358025755, 12.895217817304793], "isController": false}, {"data": ["Login", 3000, 2502, 83.4, 80049.3493333334, 0, 146526, 85378.5, 115668.90000000001, 121276.95, 137770.74, 11.127390070658928, 1961.3216593778398, 32.53981012152037], "isController": false}, {"data": ["Login-0", 2836, 0, 0.0, 18057.019040902698, 226, 64843, 5980.0, 45694.50000000001, 49482.45, 57917.18000000001, 13.400683264739097, 4.974054191021164, 9.814953563041332], "isController": false}, {"data": ["Logout-2", 2055, 397, 19.31873479318735, 19594.32068126522, 1, 65562, 15106.0, 40906.40000000001, 49619.19999999998, 55106.68000000001, 8.061384204394338, 776.8105843179598, 3.9189301920413935], "isController": false}, {"data": ["Login-1", 2836, 112, 3.9492242595204514, 37906.54724964744, 0, 62756, 41839.5, 55594.5, 58430.8, 60801.63, 11.77980569135746, 39.076814744538964, 6.938696191812287], "isController": false}, {"data": ["Logout-1", 2106, 51, 2.421652421652422, 30848.527540360807, 0, 63599, 32154.5, 50377.6, 51524.649999999994, 58442.03999999999, 7.902201810076996, 20.93402068371306, 3.90059966539466], "isController": false}, {"data": ["Login-2", 2724, 588, 21.58590308370044, 16870.926578560964, 0, 53894, 114.0, 49388.0, 50299.75, 51197.25, 10.370505733473433, 543.2704542307209, 5.003233942181765], "isController": false}, {"data": ["Logout-0", 2106, 0, 0.0, 10036.79487179489, 25, 67711, 2269.0, 38817.09999999999, 50437.349999999984, 59149.589999999975, 8.168964915342992, 3.6058321696631173, 4.610997774480712], "isController": false}, {"data": ["Login-3", 2724, 941, 34.544787077826726, 26127.252569750337, 0, 66709, 32288.5, 50449.0, 54354.75, 59527.75, 10.352258000767678, 511.4923708093593, 4.294023224173511], "isController": false}, {"data": ["Login-4", 2724, 957, 35.13215859030837, 25935.864170337736, 0, 67627, 32226.0, 50493.0, 54372.0, 59791.25, 10.3509598577313, 529.3501294285597, 4.303036497678254], "isController": false}, {"data": ["Login-5", 998, 387, 38.77755511022044, 24175.08016032066, 1, 67862, 26422.0, 55610.1, 58584.7, 60739.93, 4.485554536792334, 62.37147536484458, 1.7297628608556712], "isController": false}, {"data": ["Login-6", 998, 396, 39.67935871743487, 23753.51603206411, 0, 67633, 25128.5, 55443.3, 58447.49999999999, 61512.229999999996, 4.4847079547395, 234.15747705968528, 1.6828274696226195], "isController": false}, {"data": ["Logout-4", 2055, 430, 20.92457420924574, 19216.82579075421, 1, 66579, 14280.0, 40580.00000000001, 49504.39999999998, 56229.72000000003, 8.061415827834832, 237.95633317012724, 3.8284944509116654], "isController": false}, {"data": ["Login-7", 998, 404, 40.480961923847694, 23570.461923847717, 0, 76668, 24765.0, 55597.5, 58579.94999999999, 62006.709999999985, 4.4856553416604115, 23.185049330129402, 1.666029574199841], "isController": false}, {"data": ["Logout-3", 2055, 409, 19.902676399026763, 19561.527980535262, 1, 67566, 14816.0, 40289.00000000001, 49568.79999999999, 55718.48, 8.06094150227707, 553.8130131863078, 3.8273000283407796], "isController": false}, {"data": ["Login-8", 998, 488, 48.897795591182366, 21807.310621242486, 0, 92262, 17394.0, 55543.3, 58583.49999999999, 67498.04, 4.545102629146039, 137.7562606525843, 1.4516547725854712], "isController": false}, {"data": ["Logout", 3000, 1429, 47.63333333333333, 43216.616666666734, 0, 151617, 37841.5, 93753.30000000003, 120750.49999999997, 138763.90999999995, 10.98261452121292, 1495.001201509469, 18.95945690627986], "isController": false}, {"data": ["Login Welcome-3", 3000, 725, 24.166666666666668, 29486.536333333283, 0, 68706, 31219.0, 58288.9, 59421.65, 63496.769999999975, 18.634813558690343, 527.973032852788, 8.487120286556845], "isController": false}, {"data": ["Login Welcome-2", 3000, 625, 20.833333333333332, 30889.579666666603, 0, 69155, 34716.5, 58237.9, 59295.95, 62993.58999999999, 18.16134539246667, 1232.5223358535984, 8.522737484184495], "isController": false}, {"data": ["Login Welcome", 3000, 1014, 33.8, 71945.85833333345, 2014, 110696, 85515.5, 99573.7, 103517.29999999999, 106752.75, 17.949132159460092, 3518.395587607844, 34.36928689406721], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 200, 1.6116035455278002, 0.40639668380306015], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 8, 0.064464141821112, 0.016255867352122408], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 35, 0.28203062046736505, 0.07111941966553553], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 5426, 43.72280419016922, 11.025542031577022], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3017, 24.311039484286866, 6.130493975169163], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1726, 13.908138597904916, 3.507203381220409], "isController": false}, {"data": ["Assertion failed", 1998, 16.099919419822722, 4.059902871192571], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 49213, 12410, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 5426, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3017, "Assertion failed", 1998, "Test failed: text expected to contain /The electronic survey app/", 1726, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 200], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 555, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 538, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2502, "Test failed: text expected to contain /The electronic survey app/", 1726, "Assertion failed", 500, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 274, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2055, 397, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 313, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 77, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, null, null, null, null], "isController": false}, {"data": ["Login-1", 2836, 112, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 110, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2106, 51, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 47, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2724, 588, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 555, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 31, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2724, 941, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 532, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 391, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 18, null, null, null, null], "isController": false}, {"data": ["Login-4", 2724, 957, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 529, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 408, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-5", 998, 387, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 371, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 16, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 998, 396, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 367, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 28, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2055, 430, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 345, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 82, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["Login-7", 998, 404, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 377, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 27, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2055, 409, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 330, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 74, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, null, null, null, null], "isController": false}, {"data": ["Login-8", 998, 488, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 448, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 34, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Logout", 3000, 1429, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 535, "Assertion failed", 484, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 409, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null], "isController": false}, {"data": ["Login Welcome-3", 3000, 725, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 691, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 33, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 625, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 605, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 20, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 1014, "Assertion failed", 1014, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
