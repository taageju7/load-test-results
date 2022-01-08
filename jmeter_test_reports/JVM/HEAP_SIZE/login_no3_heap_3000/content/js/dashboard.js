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

    var data = {"OkPercent": 73.98437188534066, "KoPercent": 26.015628114659332};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0369872024877407, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.015833333333333335, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.0265, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.02610169491525424, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0026278069756330625, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.019491525423728815, 500, 1500, "Login-1"], "isController": false}, {"data": [0.03353658536585366, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.34066689584049503, 500, 1500, "Login-2"], "isController": false}, {"data": [0.20356472795497185, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.002062564455139223, 500, 1500, "Login-3"], "isController": false}, {"data": [3.4376074252320387E-4, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0016722408026755853, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.002150023889154324, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.010166666666666666, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.015333333333333332, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [1.6666666666666666E-4, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50166, 13051, 26.015628114659332, 31415.51088386581, 0, 148061, 31656.0, 60909.8, 85499.85, 131212.48000000024, 173.6538761098707, 10573.151614991693, 138.07391322455302], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 508, 16.933333333333334, 30917.48266666673, 0, 66049, 36808.0, 56233.8, 57442.95, 60385.649999999994, 18.799466095162895, 1862.6982890821316, 9.409304129929376], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 27382.159333333326, 84, 52611, 29302.5, 46347.4, 48235.25, 50030.899999999994, 26.772567042969968, 68.76157355762794, 13.360138436482083], "isController": false}, {"data": ["Login", 3000, 2475, 82.5, 83463.02166666675, 0, 147347, 85769.0, 115856.7, 128196.84999999999, 139499.30999999997, 11.365100050764113, 2076.0531037851465, 34.57842419217816], "isController": false}, {"data": ["Login-0", 2950, 0, 0.0, 18731.838305084733, 237, 63353, 6218.0, 45065.50000000001, 48266.45, 58184.179999999964, 14.402257492835487, 5.328377573488129, 10.548528437135365], "isController": false}, {"data": ["Logout-2", 2093, 529, 25.274725274725274, 18096.721452460573, 0, 65866, 12293.0, 42090.00000000003, 48349.0, 55776.85999999998, 8.208100646294787, 734.0968203169119, 3.6956888598465834], "isController": false}, {"data": ["Login-1", 2950, 41, 1.3898305084745763, 38328.705084745605, 0, 61126, 42117.5, 52453.5, 55860.649999999994, 58480.39, 12.373434445963744, 40.702352807249156, 7.4855796731211255], "isController": false}, {"data": ["Logout-1", 2132, 39, 1.829268292682927, 30933.196998123814, 1, 59122, 34068.0, 48618.7, 49575.35, 56344.580000000016, 8.10393717548141, 21.482348243608456, 4.024462608141188], "isController": false}, {"data": ["Login-2", 2909, 742, 25.507047095221726, 16342.715366105203, 0, 51710, 111.0, 47180.0, 48782.5, 50062.6, 11.224249626694345, 565.881021392488, 5.148247169581087], "isController": false}, {"data": ["Logout-0", 2132, 0, 0.0, 9719.64587242026, 20, 65342, 2149.0, 39778.9, 49476.399999999994, 58438.98000000001, 8.321558770033022, 3.673188050834888, 4.697129852616295], "isController": false}, {"data": ["Login-3", 2909, 1055, 36.26675833619801, 25011.215194224846, 0, 67539, 32630.0, 49056.0, 51175.5, 57920.60000000001, 11.230142644816338, 539.1131348985175, 4.5343474337444745], "isController": false}, {"data": ["Login-4", 2909, 1094, 37.6074252320385, 24560.848745273353, 0, 67572, 32542.0, 48898.0, 50970.5, 57506.8, 11.204578894255583, 562.1651583672283, 4.47833193227951], "isController": false}, {"data": ["Login-5", 999, 360, 36.03603603603604, 23455.592592592602, 0, 65060, 24922.0, 52695.0, 56220.0, 59656.0, 4.5066584864123564, 65.04787249714668, 1.815723759371955], "isController": false}, {"data": ["Login-6", 999, 379, 37.93793793793794, 22710.77877877876, 0, 67010, 23572.0, 52782.0, 56260.0, 59024.0, 4.466621061526699, 239.65067915889816, 1.7244268898188762], "isController": false}, {"data": ["Logout-4", 2093, 541, 25.84806497849976, 18012.905876731926, 1, 65864, 12104.0, 42263.20000000002, 48291.4, 55692.2, 8.208293788678596, 228.5052192510079, 3.6555315782042936], "isController": false}, {"data": ["Login-7", 999, 375, 37.53753753753754, 22850.254254254236, 0, 66367, 23605.0, 52482.0, 55951.0, 59834.0, 4.497892879011634, 23.89528016013894, 1.7531905098512408], "isController": false}, {"data": ["Logout-3", 2093, 525, 25.08361204013378, 18035.95556617295, 0, 66498, 12225.0, 41625.00000000001, 48298.1, 56212.779999999984, 8.20813283606088, 528.791901601429, 3.645104140930464], "isController": false}, {"data": ["Login-8", 999, 466, 46.646646646646644, 20555.539539539535, 0, 85679, 17348.0, 52300.0, 55837.0, 62961.0, 4.507695570365624, 142.22818654228388, 1.5031292160941427], "isController": false}, {"data": ["Logout", 3000, 1527, 50.9, 42848.076000000125, 0, 148061, 38535.0, 92378.50000000001, 120848.24999999999, 141350.78999999998, 10.983700188919643, 1423.846184462778, 18.548273190709985], "isController": false}, {"data": ["Login Welcome-3", 3000, 745, 24.833333333333332, 27413.46100000003, 0, 67808, 27538.0, 56089.0, 57635.849999999984, 63895.99, 18.928997331011377, 531.9578348204427, 8.545314688665316], "isController": false}, {"data": ["Login Welcome-2", 3000, 643, 21.433333333333334, 28797.298333333358, 0, 67480, 31285.5, 56126.6, 57696.75, 63793.10999999998, 19.11522017547772, 1287.7561626175584, 8.902384892524674], "isController": false}, {"data": ["Login Welcome", 3000, 1007, 33.56666666666667, 67990.05566666684, 1193, 105727, 80482.0, 96337.8, 99745.04999999999, 103596.78, 18.604420410289485, 3667.3363753337167, 35.65900539218118], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 188, 1.4405026434755956, 0.37475581070844793], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 10, 0.07662248103593594, 0.019933819718534466], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 42, 0.32181442035093094, 0.08372204281784476], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4820, 36.932035859321125, 9.608101104333612], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3980, 30.495747452302506, 7.933660247976717], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1910, 14.634893877863766, 3.8073595662400828], "isController": false}, {"data": ["Assertion failed", 2101, 16.098383265650142, 4.188095522864091], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50166, 13051, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4820, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3980, "Assertion failed", 2101, "Test failed: text expected to contain /The electronic survey app/", 1910, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 188], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 508, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 488, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2475, "Test failed: text expected to contain /The electronic survey app/", 1910, "Assertion failed", 474, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 89, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2093, 529, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 435, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 89, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, null, null, null, null], "isController": false}, {"data": ["Login-1", 2950, 41, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 41, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2132, 39, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 30, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 9, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2909, 742, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 690, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 51, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2909, 1055, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 685, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 354, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 16, null, null, null, null], "isController": false}, {"data": ["Login-4", 2909, 1094, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 703, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 379, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-5", 999, 360, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 336, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 24, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 999, 379, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 358, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 21, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2093, 541, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 447, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 90, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, null, null, null, null], "isController": false}, {"data": ["Login-7", 999, 375, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 359, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 16, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2093, 525, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 429, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 87, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 9, null, null, null, null], "isController": false}, {"data": ["Login-8", 999, 466, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 417, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 41, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Logout", 3000, 1527, "Assertion failed", 620, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 582, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 324, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login Welcome-3", 3000, 745, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 711, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 29, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 643, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 617, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 24, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 1007, "Assertion failed", 1007, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
