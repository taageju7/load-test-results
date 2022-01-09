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

    var data = {"OkPercent": 90.46281160604822, "KoPercent": 9.537188393951778};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.06076317940335104, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05594758064516129, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.13709677419354838, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [5.36480686695279E-4, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9436542669584245, 500, 1500, "Login-2"], "isController": false}, {"data": [0.008324661810613945, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.055443548387096774, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.05241935483870968, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.01996007984031936, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19576, 1867, 9.537188393951778, 45931.55951164686, 83, 264094, 38431.0, 96678.4, 152012.05, 172517.2199999999, 51.03432094581384, 3787.1238076102754, 48.92271218813953], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 992, 109, 10.987903225806452, 41197.20362903224, 219, 161208, 35307.0, 148371.00000000003, 152807.35, 156244.71, 5.7121140580194165, 605.5358294171715, 3.0874469977571892], "isController": false}, {"data": ["Login Welcome-0", 992, 0, 0.0, 9631.331653225809, 104, 44240, 7904.0, 19091.8, 23394.5, 25943.90999999998, 17.9414371235825, 46.13262104139915, 8.98823949648225], "isController": false}, {"data": ["Login", 1002, 160, 15.968063872255488, 148172.83532934147, 24791, 264094, 156597.5, 179623.30000000002, 187539.59999999998, 206034.05000000005, 2.7747547166676356, 965.6115747096477, 14.212583409659857], "isController": false}, {"data": ["Login-0", 932, 0, 0.0, 55498.6137339056, 707, 115068, 56573.5, 83830.5, 91634.75, 102693.23, 3.7145533169924874, 1.587086777116837, 2.7290038186763916], "isController": false}, {"data": ["Logout-2", 855, 204, 23.859649122807017, 33041.378947368416, 9795, 100518, 21357.0, 69708.59999999999, 75249.0, 85305.43999999999, 3.047324413523705, 277.2850464026424, 1.402569069345342], "isController": false}, {"data": ["Login-1", 932, 18, 1.9313304721030042, 46500.83476394846, 4369, 159065, 45082.0, 62828.3, 67631.79999999999, 96168.6899999998, 3.4246701182834025, 15.601485105027505, 2.066967521440934], "isController": false}, {"data": ["Logout-1", 961, 106, 11.030176899063475, 30241.8876170655, 9590, 101886, 21298.0, 66245.60000000002, 68661.2, 76614.14, 2.927218563622075, 7.718037899256164, 1.330738859968687], "isController": false}, {"data": ["Login-2", 914, 0, 0.0, 1648.4004376367607, 83, 61285, 112.0, 167.5, 1857.75, 47793.05, 3.3979968919853376, 35.38120478902863, 1.964978865918537], "isController": false}, {"data": ["Logout-0", 961, 0, 0.0, 28719.753381893886, 153, 87153, 25253.0, 47852.6, 52578.2, 61702.68, 3.569823291889703, 1.5700106518920804, 2.021970223921902], "isController": false}, {"data": ["Login-3", 914, 5, 0.5470459518599562, 41678.75711159735, 13737, 150450, 44032.0, 61430.0, 64325.5, 80525.65000000001, 2.617351263430391, 144.7268181007093, 1.6256932204445487], "isController": false}, {"data": ["Login-4", 914, 1, 0.10940919037199125, 41445.44857768055, 8534, 157180, 43483.5, 61540.5, 62878.25, 78017.95000000001, 3.2085599042346673, 474.16390661366165, 2.018438742922036], "isController": false}, {"data": ["Login-5", 878, 4, 0.45558086560364464, 41650.90205011389, 8308, 191626, 43172.0, 61662.1, 63547.89999999999, 87070.05000000009, 3.131777194384203, 68.95154002267685, 2.0039609245698267], "isController": false}, {"data": ["Login-6", 877, 3, 0.34207525655644244, 41630.553021664826, 8165, 155797, 43885.0, 61509.600000000006, 62885.09999999997, 80957.80000000006, 2.5178647817611273, 213.59908568151022, 1.5658319271426973], "isController": false}, {"data": ["Logout-4", 855, 203, 23.742690058479532, 32851.82923976608, 9692, 177259, 21207.0, 70355.6, 74564.2, 86640.8, 3.0473135525260626, 87.50032717410674, 1.4086167914104963], "isController": false}, {"data": ["Login-7", 877, 3, 0.34207525655644244, 41627.5792474344, 8393, 151784, 44366.0, 61696.2, 62838.39999999999, 73929.62000000002, 2.4753034151848716, 17.766436459215353, 1.5459483268063787], "isController": false}, {"data": ["Logout-3", 855, 202, 23.625730994152047, 32864.708771929836, 9885, 121796, 21261.0, 69966.2, 74952.4, 89807.79999999999, 3.0473135525260626, 200.29091695068163, 1.392581779604384], "isController": false}, {"data": ["Login-8", 877, 25, 2.8506271379703536, 42460.42987457246, 777, 153053, 44309.0, 62345.6, 67824.7, 81936.10000000003, 3.085876747901111, 171.70285645373121, 1.883961072034286], "isController": false}, {"data": ["Logout", 1002, 418, 41.71656686626746, 93565.20658682646, 21043, 232965, 94078.0, 127005.70000000001, 138124.15, 163554.77000000002, 2.804169873364584, 452.21782515916885, 6.046780985447422], "isController": false}, {"data": ["Login Welcome-3", 992, 110, 11.088709677419354, 41811.36189516132, 152, 176590, 36158.5, 148693.2, 152901.0, 156648.04, 5.564031230368841, 186.17346170591964, 3.0341423532430674], "isController": false}, {"data": ["Login Welcome-2", 992, 115, 11.59274193548387, 42486.12298387098, 245, 190788, 35269.0, 148752.4, 152880.75, 155698.51999999996, 5.169709255968357, 392.1068342387056, 2.7459092949235746], "isController": false}, {"data": ["Login Welcome", 1002, 181, 18.063872255489024, 62294.61477045904, 582, 190957, 53955.0, 160977.7, 162628.0, 166837.33000000002, 5.213970527016902, 1124.7973354340554, 10.94055302821372], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 43.635)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 60.263)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 2.418)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 49.475)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 78.662)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 13.79.73.31:8082 [/13.79.73.31] failed: Connection timed out: connect", 2, 0.10712372790573112, 0.01021659174499387], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 15.882)", 2, 0.10712372790573112, 0.01021659174499387], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 13.530)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 88.895)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, 0.10712372790573112, 0.01021659174499387], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 37.045; received: 13.530)", 2, 0.10712372790573112, 0.01021659174499387], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 103.495)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 22, 1.1783610069630424, 0.11238250919493258], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 17, 0.9105516871987145, 0.08684102983244789], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 37, 1.9817889662560257, 0.1890069472823866], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 41.270)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 101.143)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Assertion failed", 477, 25.549009105516873, 2.436657131181038], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 13.543)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 37.045; received: 15.882)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1216, 65.13122656668452, 6.211687780956273], "isController": false}, {"data": ["500", 73, 3.910016068559186, 0.37290559869227624], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 19.383)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 41.283)", 2, 0.10712372790573112, 0.01021659174499387], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 42.730)", 1, 0.05356186395286556, 0.005108295872496935], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19576, 1867, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1216, "Assertion failed", 477, "500", 73, "Test failed: text expected to contain /The electronic survey app/", 37, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 22], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 992, 109, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 102, "500", 4, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 19.383)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 103.495)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 49.475)", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 1002, 160, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 42, "500", 42, "Test failed: text expected to contain /The electronic survey app/", 37, "Assertion failed", 35, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 4], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 855, 204, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 197, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 41.283)", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 13.543)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 43.635)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 60.263)", 1], "isController": false}, {"data": ["Login-1", 932, 18, "500", 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 4, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 4, null, null, null, null], "isController": false}, {"data": ["Logout-1", 961, 106, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 102, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 3, "500", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 914, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 4, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 914, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 878, 4, "500", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 877, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 855, 203, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 200, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 37.045; received: 13.530)", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 37.045; received: 15.882)", 1, null, null, null, null], "isController": false}, {"data": ["Login-7", 877, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 2, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 855, 202, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 198, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 15.882)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 13.530)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 42.730)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 41.270)", 1], "isController": false}, {"data": ["Login-8", 877, 25, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 22, "500", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, null, null, null, null], "isController": false}, {"data": ["Logout", 1002, 418, "Assertion failed", 271, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 139, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 3, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 13.79.73.31:8082 [/13.79.73.31] failed: Connection timed out: connect", 2], "isController": false}, {"data": ["Login Welcome-3", 992, 110, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 106, "500", 4, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 992, 115, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 110, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, "500", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 2.418)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 15.882)", 1], "isController": false}, {"data": ["Login Welcome", 1002, 181, "Assertion failed", 171, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 4, "500", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 3, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
