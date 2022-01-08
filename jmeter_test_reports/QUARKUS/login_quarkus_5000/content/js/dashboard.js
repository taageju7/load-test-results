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

    var data = {"OkPercent": 78.99501878877916, "KoPercent": 21.004981211220834};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7822948527484052, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9284172661870503, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.4242, 500, 1500, "Login"], "isController": false}, {"data": [0.9938388625592417, 500, 1500, "Login-0"], "isController": false}, {"data": [0.5912208504801097, 500, 1500, "Logout-2"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.7873263888888888, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9088467614533965, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.8282780410742496, 500, 1500, "Login-3"], "isController": false}, {"data": [0.8186413902053713, 500, 1500, "Login-4"], "isController": false}, {"data": [0.806477093206951, 500, 1500, "Login-5"], "isController": false}, {"data": [0.8080568720379147, 500, 1500, "Login-6"], "isController": false}, {"data": [0.8151658767772512, 500, 1500, "Login-7"], "isController": false}, {"data": [0.7778830963665087, 500, 1500, "Login-8"], "isController": false}, {"data": [0.5932, 500, 1500, "Logout"], "isController": false}, {"data": [0.9194244604316547, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.4713, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 57215, 12018, 21.004981211220834, 38.93038538844665, 0, 5194, 4.0, 15.0, 88.0, 100.0, 954.314974814024, 51223.34828446601, 767.9556931147213], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 2780, 199, 7.158273381294964, 5.983453237410068, 1, 399, 2.0, 7.0, 20.0, 82.76000000000022, 46.533427069733186, 5131.9255480859365, 23.24662389420341], "isController": false}, {"data": ["Login Welcome-0", 2780, 0, 0.0, 2.8129496402877643, 0, 324, 1.0, 4.0, 7.0, 38.38000000000011, 46.490626620064546, 94.47948632456479, 23.19991230747362], "isController": false}, {"data": ["Login", 5000, 2671, 53.42, 193.47180000000012, 2, 5194, 88.0, 115.0, 484.7999999999993, 3964.99, 84.22045546422315, 17078.99404982482, 269.3866934838633], "isController": false}, {"data": ["Login-0", 3165, 0, 0.0, 13.66729857819908, 0, 1089, 1.0, 4.0, 6.0, 848.0200000000004, 53.39068825910931, 10.584286832616396, 34.04699163398279], "isController": false}, {"data": ["Logout-2", 729, 298, 40.87791495198903, 3.311385459533603, 1, 44, 3.0, 5.0, 7.0, 14.700000000000045, 27.636666919402533, 624.1099945977709, 9.736007515732808], "isController": false}, {"data": ["Login-1", 3165, 0, 0.0, 1.88056872037914, 0, 246, 1.0, 2.0, 3.0, 11.340000000000146, 53.42764057462145, 259.5205900568038, 35.009713696846674], "isController": false}, {"data": ["Logout-1", 1152, 245, 21.26736111111111, 2.9244791666666647, 1, 28, 3.0, 4.0, 6.0, 10.0, 43.67110201296486, 3403.649387296713, 21.1580767371773], "isController": false}, {"data": ["Login-2", 3165, 80, 2.527646129541864, 284.20916271722035, 3, 4731, 91.0, 159.0, 2113.399999999994, 3797.7800000000025, 53.37088125189707, 314.2942125160197, 29.922726705043676], "isController": false}, {"data": ["Logout-0", 3509, 0, 0.0, 2.4212026218295835, 1, 313, 2.0, 3.0, 5.0, 20.90000000000009, 62.41551049448594, 126.84245833889186, 36.76045627112238], "isController": false}, {"data": ["Login-3", 3165, 543, 17.156398104265403, 10.051184834123239, 2, 1039, 4.0, 12.0, 32.69999999999982, 125.02000000000044, 53.42764057462145, 2415.891211738677, 29.003307839852127], "isController": false}, {"data": ["Login-4", 3165, 574, 18.135860979462876, 10.846129541864116, 2, 326, 5.0, 13.0, 36.0, 162.34000000000015, 53.42944443506592, 6688.162938835736, 28.917654796622042], "isController": false}, {"data": ["Login-5", 3165, 612, 19.33649289099526, 10.171248025276444, 2, 1001, 4.0, 14.0, 36.0, 118.68000000000029, 53.439367845203115, 935.5475840160993, 28.625123467733765], "isController": false}, {"data": ["Login-6", 3165, 607, 19.178515007898895, 11.12511848341232, 2, 1128, 5.0, 14.0, 34.69999999999982, 162.34000000000015, 53.426738690074274, 3690.8290659552245, 28.33706110735989], "isController": false}, {"data": ["Login-7", 3165, 585, 18.48341232227488, 9.769352290679324, 2, 305, 5.0, 13.0, 33.0, 112.34000000000015, 53.44387970483444, 327.90302624385777, 28.675031872139954], "isController": false}, {"data": ["Login-8", 3165, 703, 22.21169036334913, 9.026856240126376, 0, 318, 4.0, 12.0, 28.0, 121.70000000000073, 53.49717724214867, 2400.4389067570823, 27.431465985345323], "isController": false}, {"data": ["Logout", 5000, 2034, 40.68, 3.8766000000000047, 1, 313, 3.0, 7.0, 9.0, 27.0, 88.93157604539067, 2081.8781904202906, 51.25336897822066], "isController": false}, {"data": ["Login Welcome-2", 2780, 224, 8.057553956834532, 5.933453237410079, 1, 380, 2.0, 6.0, 19.0, 91.33000000000038, 46.53498493471711, 1567.5846637512554, 22.938658666722464], "isController": false}, {"data": ["Login Welcome", 5000, 2643, 52.86, 8.733600000000006, 2, 527, 4.0, 10.0, 20.0, 119.0, 83.57011532675915, 6875.380962205416, 69.30370098090422], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 4, 0.03328340822100183, 0.006991173643275365], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, 0.016641704110500914, 0.0034955868216376825], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 2, 0.016641704110500914, 0.0034955868216376825], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 8, 0.06656681644200366, 0.01398234728655073], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 0.008320852055250457, 0.0017477934108188413], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 10199, 84.86437011149941, 17.82574499694136], "isController": false}, {"data": ["Assertion failed", 1802, 14.994175403561325, 3.149523726295552], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 57215, 12018, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 10199, "Assertion failed", 1802, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 8, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 4, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 2780, 199, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 199, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 5000, 2671, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1835, "Assertion failed", 836, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 729, 298, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 298, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-1", 1152, 245, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 245, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 3165, 80, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 73, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 4, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 3165, 543, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 543, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 3165, 574, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 572, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 3165, 612, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 611, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 3165, 607, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 605, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 3165, 585, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 585, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 3165, 703, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 698, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, null, null, null, null], "isController": false}, {"data": ["Logout", 5000, 2034, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1491, "Assertion failed", 543, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 2780, 224, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 224, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 5000, 2643, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2220, "Assertion failed", 423, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
