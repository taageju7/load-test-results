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

    var data = {"OkPercent": 73.66127760252365, "KoPercent": 26.338722397476342};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04009266561514196, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0175, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.020666666666666667, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.043922369765066395, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0024886877828054297, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.023323118828736805, 500, 1500, "Login-1"], "isController": false}, {"data": [0.03447508896797153, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.3347050754458162, 500, 1500, "Login-2"], "isController": false}, {"data": [0.25533807829181493, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0015432098765432098, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0012002743484224967, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0010070493454179255, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0020361990950226246, 500, 1500, "Logout-4"], "isController": false}, {"data": [5.035246727089627E-4, 500, 1500, "Login-7"], "isController": false}, {"data": [0.003167420814479638, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.010166666666666666, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.012333333333333333, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50720, 13359, 26.338722397476342, 27415.131742902064, 0, 129826, 25264.5, 53194.200000000026, 77781.0, 117747.12000000014, 198.01825578399144, 12024.998757841233, 157.35515528982424], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 552, 18.4, 24596.688333333324, 0, 61996, 28988.0, 45105.0, 45990.0, 48099.23999999998, 21.12571915468956, 2057.032110983085, 10.386921947509629], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 23616.617999999955, 64, 44407, 26480.0, 37738.3, 39062.0, 40735.67999999999, 28.89477486154587, 74.21216590416566, 14.419169877197206], "isController": false}, {"data": ["Login", 3000, 2472, 82.4, 75298.61433333332, 0, 127049, 77617.5, 104058.50000000001, 115650.05, 122626.59999999998, 12.686652373038326, 2416.1756287954236, 39.36110712450681], "isController": false}, {"data": ["Login-0", 2937, 0, 0.0, 16943.20326864148, 192, 51389, 5545.0, 40763.0, 43681.2, 48059.37999999999, 15.910334404134412, 5.888439580545729, 11.653076956153132], "isController": false}, {"data": ["Logout-2", 2210, 637, 28.823529411764707, 15847.726696832555, 0, 59734, 9174.0, 40040.6, 43193.04999999999, 45739.56, 9.539431087322486, 813.8520545118056, 4.091138020945742], "isController": false}, {"data": ["Login-1", 2937, 21, 0.7150153217568948, 33331.25672454886, 1, 50501, 36896.0, 44300.200000000004, 45450.0, 47153.23999999999, 13.682548112535114, 44.99624557570824, 8.334622659885955], "isController": false}, {"data": ["Logout-1", 2248, 38, 1.690391459074733, 27592.873665480394, 1, 59268, 31411.0, 43343.700000000004, 44110.55, 45628.57, 9.754488887346067, 25.874918775872395, 4.850988981723351], "isController": false}, {"data": ["Login-2", 2916, 706, 24.21124828532236, 15348.052469135797, 0, 48080, 127.0, 42557.1, 43880.05, 44973.07, 12.645218364187492, 660.7416217229652, 5.909316680922893], "isController": false}, {"data": ["Logout-0", 2248, 0, 0.0, 8497.649021352341, 21, 55730, 1951.0, 34074.1, 42032.59999999998, 46721.67, 10.09597463431284, 4.456426303427152, 5.698704432258615], "isController": false}, {"data": ["Login-3", 2916, 981, 33.641975308641975, 23241.29080932788, 0, 60783, 30118.5, 43766.6, 44657.15, 46622.32, 12.69559311407748, 634.2242779272572, 5.337704926508364], "isController": false}, {"data": ["Login-4", 2916, 992, 34.01920438957476, 23206.241769547356, 0, 60805, 30098.0, 43741.4, 44715.6, 46719.43, 12.746092247438542, 674.7241126418418, 5.387417031288247], "isController": false}, {"data": ["Login-5", 993, 336, 33.8368580060423, 21192.033232628393, 0, 60981, 23978.0, 43798.4, 45832.9, 51076.87999999991, 5.200423156285023, 77.24571222033978, 2.167277700567176], "isController": false}, {"data": ["Login-6", 993, 339, 34.13897280966767, 21211.9133937563, 0, 61044, 23979.0, 43820.2, 45731.6, 55693.399999999994, 5.231299290376622, 297.1449580340351, 2.1432732464874436], "isController": false}, {"data": ["Logout-4", 2210, 671, 30.361990950226243, 15641.485067873264, 0, 59371, 8783.5, 40160.8, 43333.649999999994, 45905.59, 9.53947226430813, 250.91260743372007, 3.989751575793481], "isController": false}, {"data": ["Login-7", 993, 366, 36.858006042296076, 20066.825780463223, 0, 73782, 20935.0, 43508.6, 45403.299999999996, 56008.579999999994, 5.2295911649928115, 27.970684599828314, 2.060567909967295], "isController": false}, {"data": ["Logout-3", 2210, 676, 30.58823529411765, 15425.494570135685, 0, 59902, 8570.5, 39674.200000000004, 43093.0, 46013.459999999985, 9.539431087322486, 571.2213307857081, 3.9250418833901675], "isController": false}, {"data": ["Login-8", 993, 458, 46.12286002014099, 17731.017119838874, 0, 82543, 15616.0, 42008.6, 45024.1, 56548.45999999997, 5.281914893617021, 168.1405938331117, 1.778590425531915], "isController": false}, {"data": ["Logout", 3000, 1600, 53.333333333333336, 40282.34066666662, 0, 129826, 34835.5, 81520.7, 111173.0, 121158.20999999998, 12.751686410527793, 1647.9793566468697, 21.967967763736755], "isController": false}, {"data": ["Login Welcome-3", 3000, 791, 26.366666666666667, 21701.161999999982, 0, 61907, 21626.0, 44457.9, 46111.149999999994, 56611.439999999944, 20.944747755421197, 577.5270724500642, 9.262426071585656], "isController": false}, {"data": ["Login Welcome-2", 3000, 676, 22.533333333333335, 23202.720333333247, 0, 60991, 24949.5, 45148.1, 46232.85, 53863.66999999995, 20.919043302419635, 1390.193932878199, 9.606062818143783], "isController": false}, {"data": ["Login Welcome", 3000, 1047, 34.9, 57365.22099999997, 1854, 93372, 67625.5, 80639.7, 82434.05, 89959.86, 20.655893470672073, 4006.6048026243316, 39.08360639635561], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 157, 1.1752376674900815, 0.30954258675078866], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 20, 0.14971180477580656, 0.03943217665615142], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 34, 0.25451006811887117, 0.06703470031545741], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4580, 34.28400329365971, 9.029968454258675], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4323, 32.36020660229059, 8.52326498422713], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1923, 14.394790029193802, 3.791403785488959], "isController": false}, {"data": ["Assertion failed", 2322, 17.381540534471142, 4.5780757097791795], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50720, 13359, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4580, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4323, "Assertion failed", 2322, "Test failed: text expected to contain /The electronic survey app/", 1923, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 157], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 552, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 535, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 3, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2472, "Test failed: text expected to contain /The electronic survey app/", 1923, "Assertion failed", 465, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 83, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2210, 637, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 563, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 70, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, null, null, null, null], "isController": false}, {"data": ["Login-1", 2937, 21, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 21, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2248, 38, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 20, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 18, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2916, 706, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 687, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 19, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2916, 981, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 675, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 291, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["Login-4", 2916, 992, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 687, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 289, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1], "isController": false}, {"data": ["Login-5", 993, 336, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 317, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 17, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["Login-6", 993, 339, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 328, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2210, 671, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 586, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 80, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, null, null, null, null], "isController": false}, {"data": ["Login-7", 993, 366, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 346, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2210, 676, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 594, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 80, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null], "isController": false}, {"data": ["Login-8", 993, 458, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 423, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 29, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, null, null, null, null], "isController": false}, {"data": ["Logout", 3000, 1600, "Assertion failed", 810, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 513, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 275, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null], "isController": false}, {"data": ["Login Welcome-3", 3000, 791, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 757, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 27, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 7, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 676, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 646, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 25, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 5, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 1047, "Assertion failed", 1047, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
