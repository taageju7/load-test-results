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

    var data = {"OkPercent": 75.63297389106134, "KoPercent": 24.367026108938656};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03558873484220089, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.013666666666666667, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.0185, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.026901987662782727, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0015765765765765765, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.016278272789581907, 500, 1500, "Login-1"], "isController": false}, {"data": [0.03534904401956425, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.33621883656509693, 500, 1500, "Login-2"], "isController": false}, {"data": [0.1956425077812361, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.001038781163434903, 500, 1500, "Login-3"], "isController": false}, {"data": [3.4626038781163435E-4, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0015090543259557343, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0013513513513513514, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0011261261261261261, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.009833333333333333, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.014833333333333334, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [1.6666666666666666E-4, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50634, 12338, 24.367026108938656, 31865.409092704434, 0, 149477, 31889.5, 64312.30000000004, 88416.85, 131813.26000000013, 173.73909283996198, 10908.042585640293, 140.92120868961388], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 563, 18.766666666666666, 28995.05600000001, 0, 65374, 33425.5, 53820.9, 55604.9, 57551.60999999999, 19.325040743627568, 1873.4271354371324, 9.458884013118482], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 26928.56433333334, 56, 50357, 29084.0, 45372.8, 46975.5, 48596.99, 27.293073018068014, 70.09841995851453, 13.6198831174148], "isController": false}, {"data": ["Login", 3000, 2469, 82.3, 84136.15466666693, 0, 143190, 87599.0, 119307.1, 129711.24999999999, 139526.87, 11.2990520095364, 2136.9202571169903, 34.86951080872023], "isController": false}, {"data": ["Login-0", 2918, 0, 0.0, 18527.761137765563, 182, 59231, 5635.5, 45876.399999999994, 48726.24999999999, 55741.62999999999, 14.597590747188537, 5.405467092888302, 10.69159478553848], "isController": false}, {"data": ["Logout-2", 2220, 447, 20.135135135135137, 20419.67702702708, 1, 59314, 16829.0, 44110.5, 47847.399999999994, 52267.32, 8.593925410921255, 819.9524804253509, 4.135543073421931], "isController": false}, {"data": ["Login-1", 2918, 30, 1.0281014393420151, 38008.52535983564, 0, 60041, 42605.0, 50904.2, 53113.45, 56283.7, 12.24635400272794, 40.33849248504879, 7.435777003986989], "isController": false}, {"data": ["Logout-1", 2249, 29, 1.2894619831036016, 31860.191196087188, 0, 56481, 36227.0, 48513.0, 49368.5, 52724.0, 8.54275556095782, 22.642592576985457, 4.265709753327458], "isController": false}, {"data": ["Login-2", 2888, 651, 22.541551246537395, 17894.183864265906, 1, 58553, 114.0, 47099.3, 49417.299999999996, 50953.520000000004, 11.078292224481185, 595.7509285753673, 5.294333068011815], "isController": false}, {"data": ["Logout-0", 2249, 0, 0.0, 9612.457092040933, 20, 64167, 2233.0, 40365.0, 48533.5, 54884.0, 8.797286883867208, 3.88317741358201, 4.965656073120358], "isController": false}, {"data": ["Login-3", 2888, 957, 33.137119113573405, 26762.08483379501, 0, 67798, 35498.0, 49491.7, 50894.0, 55592.0, 11.096723623187849, 558.8086292467638, 4.701317471768291], "isController": false}, {"data": ["Login-4", 2888, 979, 33.898891966759, 26504.860803324147, 0, 65607, 35267.0, 49488.7, 50832.1, 55587.68000000001, 11.081565386224018, 577.0477209322348, 4.694348336901843], "isController": false}, {"data": ["Login-5", 994, 336, 33.80281690140845, 24563.57847082491, 0, 88411, 28176.5, 51308.5, 54582.0, 58170.49999999992, 4.543065426540826, 67.49699883166892, 1.8942978158778767], "isController": false}, {"data": ["Login-6", 994, 380, 38.22937625754527, 22688.827967806876, 0, 67018, 23608.0, 51176.0, 54361.75, 57318.149999999994, 4.535437094765084, 242.22934064771425, 1.742772146187997], "isController": false}, {"data": ["Logout-4", 2220, 472, 21.26126126126126, 20057.73108108106, 1, 57944, 16209.0, 43762.6, 48001.69999999999, 52488.18999999999, 8.594158295104814, 252.67158072508371, 4.064124107194704], "isController": false}, {"data": ["Login-7", 994, 379, 38.12877263581489, 22831.583501006055, 0, 67415, 24519.0, 50787.5, 54250.25, 56647.69999999999, 4.544519373642702, 24.00603372528289, 1.7545978468967882], "isController": false}, {"data": ["Logout-3", 2220, 467, 21.036036036036037, 20109.58648648653, 0, 57475, 16519.5, 43769.200000000004, 47546.89999999999, 51853.1, 8.594790472945768, 582.4104328222272, 4.023027208851473], "isController": false}, {"data": ["Login-8", 994, 447, 44.969818913480886, 21260.655935613664, 0, 87464, 19933.5, 50033.0, 53439.0, 61639.19999999983, 4.576385116159152, 148.6136977689547, 1.5739956353993056], "isController": false}, {"data": ["Logout", 3000, 1340, 44.666666666666664, 47565.39199999997, 0, 149477, 43979.0, 92939.70000000001, 125587.94999999998, 139899.86, 10.921044488694898, 1587.8934761320572, 20.20291556621975], "isController": false}, {"data": ["Login Welcome-3", 3000, 756, 25.2, 26267.334666666633, 0, 67424, 26674.0, 53398.700000000004, 55447.6, 62718.499999999985, 19.1477954504838, 535.6593159410185, 8.601922717901912], "isController": false}, {"data": ["Login Welcome-2", 3000, 615, 20.5, 28239.44100000004, 0, 67759, 31764.0, 53641.4, 55472.75, 61522.99, 19.15904562407398, 1305.5362731624878, 9.028793800372323], "isController": false}, {"data": ["Login Welcome", 3000, 1021, 34.03333333333333, 66006.45933333336, 1166, 103548, 78667.0, 92765.2, 97036.7, 99719.97, 18.913721905242255, 3700.060422938404, 36.105901081234435], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 143, 1.159020911006646, 0.28241892799304813], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 13, 0.10536553736424056, 0.025674447999368015], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 42, 0.3404117360998541, 0.08294821661334281], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4873, 39.49586642891879, 9.62396808468618], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3329, 26.981682606581295, 6.5746336453766245], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1894, 15.350948289836278, 3.740569577754078], "isController": false}, {"data": ["Assertion failed", 2044, 16.5667044901929, 4.036813208516017], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50634, 12338, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4873, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3329, "Assertion failed", 2044, "Test failed: text expected to contain /The electronic survey app/", 1894, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 143], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 563, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 547, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2469, "Test failed: text expected to contain /The electronic survey app/", 1894, "Assertion failed", 463, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 112, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2220, 447, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 348, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 95, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-1", 2918, 30, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 30, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2249, 29, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 25, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2888, 651, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 595, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 55, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2888, 957, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 600, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 341, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 16, null, null, null, null], "isController": false}, {"data": ["Login-4", 2888, 979, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 602, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 358, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, null, null, null, null], "isController": false}, {"data": ["Login-5", 994, 336, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 324, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 12, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 994, 380, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 369, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2220, 472, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 367, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 103, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null], "isController": false}, {"data": ["Login-7", 994, 379, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 364, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 15, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2220, 467, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 362, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 103, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null], "isController": false}, {"data": ["Login-8", 994, 447, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 399, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 42, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, null, null, null, null], "isController": false}, {"data": ["Logout", 3000, 1340, "Assertion failed", 560, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 451, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 323, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 3], "isController": false}, {"data": ["Login Welcome-3", 3000, 756, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 731, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 22, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 3, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 615, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 594, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 1021, "Assertion failed", 1021, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
