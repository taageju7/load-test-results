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

    var data = {"OkPercent": 98.030402504924, "KoPercent": 1.9695974950760062};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.048861168627847076, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.006625891946992864, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.046381243628950054, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "Login-0"], "isController": false}, {"data": [0.015625, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login-1"], "isController": false}, {"data": [0.009538152610441768, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9046306504961411, 500, 1500, "Login-2"], "isController": false}, {"data": [0.014056224899598393, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.019153225806451613, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.016129032258064516, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.005988023952095809, 500, 1500, "Logout"], "isController": false}, {"data": [0.00764525993883792, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.00764525993883792, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19801, 390, 1.9695974950760062, 46259.82763496746, 18, 268373, 32873.0, 86757.59999999998, 146838.39999999985, 208552.98, 54.85968543161033, 4542.340600554214, 56.45274969852939], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 981, 19, 1.9367991845056065, 40112.97247706413, 520, 232143, 43868.0, 66100.8, 69001.29999999999, 93397.21999999971, 4.013024945388499, 469.75416706721916, 2.464576509026238], "isController": false}, {"data": ["Login Welcome-0", 981, 0, 0.0, 15514.809378185526, 172, 57373, 13489.0, 31836.8, 33448.7, 43094.05999999998, 12.689994178901753, 32.629643235398746, 6.35738966189121], "isController": false}, {"data": ["Login", 1002, 197, 19.660678642714572, 182134.91317365287, 29920, 268373, 188982.5, 215966.2, 224124.94999999998, 240789.06, 2.8167747086240533, 956.5248527395383, 14.185495055358619], "isController": false}, {"data": ["Login-0", 933, 0, 0.0, 76214.98285101818, 6571, 133443, 79755.0, 104133.6, 110355.4, 119632.75999999997, 3.1128638347279494, 1.3177194633646288, 2.286742474951956], "isController": false}, {"data": ["Logout-2", 992, 1, 0.10080645161290322, 16259.90725806451, 138, 87851, 14090.5, 28575.100000000017, 32486.849999999995, 43282.5999999999, 6.154724309299714, 731.4577696899216, 3.7314191560365315], "isController": false}, {"data": ["Login-1", 933, 26, 2.7867095391211145, 60151.207931404155, 13035, 129535, 62469.0, 79114.8, 86488.09999999999, 104673.43999999997, 2.7127218805879014, 11.994266494759184, 1.6438085139633942], "isController": false}, {"data": ["Logout-1", 996, 4, 0.40160642570281124, 22120.76104417669, 49, 88039, 17611.0, 33736.0, 41204.65, 78364.88999999997, 4.152491494896938, 11.018321604942132, 2.10069889590004], "isController": false}, {"data": ["Login-2", 907, 2, 0.2205071664829107, 4632.877618522603, 84, 92886, 113.0, 265.2000000000071, 41056.59999999988, 84418.75999999997, 2.8132579822705814, 43.72735624895317, 1.6330301533489247], "isController": false}, {"data": ["Logout-0", 996, 0, 0.0, 29678.292168674747, 76, 132439, 29337.5, 47426.70000000002, 65156.7, 79039.59999999998, 3.25730768476064, 1.442874016021637, 1.8449594308214563], "isController": false}, {"data": ["Login-3", 907, 4, 0.4410143329658214, 46110.151047409076, 17667, 123575, 34021.0, 77691.2, 81031.8, 96326.76, 2.7980873052599105, 159.09451883772945, 1.7540104889711554], "isController": false}, {"data": ["Login-4", 907, 6, 0.6615214994487321, 46295.104740904106, 17534, 199554, 34462.0, 77630.6, 80348.39999999998, 94815.67999999986, 2.788032669472118, 395.11410638961297, 1.75869444683526], "isController": false}, {"data": ["Login-5", 829, 2, 0.24125452352231605, 45232.975874547614, 18993, 116183, 34025.0, 76205.0, 79050.0, 93214.50000000004, 2.8986723451273284, 61.69356841229506, 1.831485358688849], "isController": false}, {"data": ["Login-6", 829, 2, 0.24125452352231605, 45626.88057901089, 18380, 121649, 34102.0, 76583.0, 79504.5, 94992.60000000003, 2.557465856751062, 217.65816270064076, 1.599961673682473], "isController": false}, {"data": ["Logout-4", 992, 1, 0.10080645161290322, 16255.038306451623, 92, 92318, 14027.5, 28957.500000000007, 33378.24999999999, 44159.32999999996, 6.158659994785006, 225.60641163960352, 3.707092460220147], "isController": false}, {"data": ["Login-7", 829, 0, 0.0, 45386.99758745475, 18287, 126715, 33899.0, 75941.0, 78918.0, 91632.90000000001, 2.675660846270535, 20.016826893982184, 1.6831590358018915], "isController": false}, {"data": ["Logout-3", 992, 1, 0.10080645161290322, 16359.461693548386, 128, 88545, 14070.5, 28706.500000000004, 33653.49999999999, 45522.34999999998, 6.156213928434013, 523.6964734808053, 3.6575731574023504], "isController": false}, {"data": ["Login-8", 829, 13, 1.5681544028950543, 46634.42581423403, 18, 203367, 35975.0, 77637.0, 81145.0, 99373.30000000006, 2.688590516961795, 152.68104000454045, 1.6798496586560292], "isController": false}, {"data": ["Logout", 1002, 15, 1.4970059880239521, 70437.8283433134, 54, 205707, 64708.0, 110831.90000000001, 149656.3499999999, 184644.44000000006, 3.219515016370688, 776.6495282683541, 9.179948563468145], "isController": false}, {"data": ["Login Welcome-3", 981, 12, 1.2232415902140672, 40610.30886850156, 475, 223847, 44613.0, 66154.0, 72078.39999999998, 157482.53999999908, 3.8054525423991805, 145.07622603166166, 2.3777714148835476], "isController": false}, {"data": ["Login Welcome-2", 981, 17, 1.7329255861365953, 40099.22222222225, 497, 225908, 43509.0, 66087.6, 69198.3, 114887.45999999982, 4.0284330996760005, 341.03362763788454, 2.454140674084979], "isController": false}, {"data": ["Login Welcome", 1002, 68, 6.786427145708583, 62114.733532934195, 2095, 238501, 62470.0, 104039.0, 115363.09999999989, 210967.07000000015, 3.860156024270442, 916.1953960199364, 8.908947468217278], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 6, 1.5384615384615385, 0.03030149992424625], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.658; received: 83.738)", 1, 0.2564102564102564, 0.005050249987374375], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 11, 2.8205128205128207, 0.05555274986111813], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 13, 3.3333333333333335, 0.06565324983586687], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 78, 20.0, 0.39391949901520124], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 41.270)", 1, 0.2564102564102564, 0.005050249987374375], "isController": false}, {"data": ["Assertion failed", 75, 19.23076923076923, 0.3787687490530781], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 1, 0.2564102564102564, 0.005050249987374375], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 21, 5.384615384615385, 0.10605524973486187], "isController": false}, {"data": ["500", 178, 45.64102564102564, 0.8989444977526387], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 116.820)", 1, 0.2564102564102564, 0.005050249987374375], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, 0.2564102564102564, 0.005050249987374375], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 155.758; received: 136.183)", 1, 0.2564102564102564, 0.005050249987374375], "isController": false}, {"data": ["Test failed: text expected to contain /You have been logged out./", 2, 0.5128205128205128, 0.01010049997474875], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19801, 390, "500", 178, "Test failed: text expected to contain /The electronic survey app/", 78, "Assertion failed", 75, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 21, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 13], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 981, 19, "500", 18, "Assertion failed", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 1002, 197, "500", 84, "Test failed: text expected to contain /The electronic survey app/", 78, "Assertion failed", 24, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 7, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 4], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 992, 1, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 933, 26, "500", 21, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, null, null, null, null], "isController": false}, {"data": ["Logout-1", 996, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 907, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 121.200; received: 116.820)", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 907, 4, "500", 2, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-4", 907, 6, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 3, "500", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 155.758; received: 136.183)", 1, null, null, null, null], "isController": false}, {"data": ["Login-5", 829, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 829, 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.658; received: 83.738)", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 992, 1, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-3", 992, 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 41.270)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 829, 13, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 10, "500", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null], "isController": false}, {"data": ["Logout", 1002, 15, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 8, "Assertion failed", 3, "500", 2, "Test failed: text expected to contain /You have been logged out./", 2, null, null], "isController": false}, {"data": ["Login Welcome-3", 981, 12, "500", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 981, 17, "500", 17, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 1002, 68, "Assertion failed", 47, "500", 16, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 5, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
