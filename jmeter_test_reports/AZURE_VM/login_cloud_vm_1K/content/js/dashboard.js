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

    var data = {"OkPercent": 96.6268301515857, "KoPercent": 3.3731698484142996};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.052770448548812667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.030735455543358946, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.075192096597146, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [5.307855626326964E-4, 500, 1500, "Login-0"], "isController": false}, {"data": [0.024672708962739175, 500, 1500, "Logout-2"], "isController": false}, {"data": [5.307855626326964E-4, 500, 1500, "Login-1"], "isController": false}, {"data": [0.007035175879396985, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.8456043956043956, 500, 1500, "Login-2"], "isController": false}, {"data": [0.009045226130653266, 500, 1500, "Logout-0"], "isController": false}, {"data": [5.494505494505495E-4, 500, 1500, "Login-3"], "isController": false}, {"data": [5.494505494505495E-4, 500, 1500, "Login-4"], "isController": false}, {"data": [6.41025641025641E-4, 500, 1500, "Login-5"], "isController": false}, {"data": [6.459948320413437E-4, 500, 1500, "Login-6"], "isController": false}, {"data": [0.02769385699899295, 500, 1500, "Logout-4"], "isController": false}, {"data": [6.459948320413437E-4, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0256797583081571, 500, 1500, "Logout-3"], "isController": false}, {"data": [6.459948320413437E-4, 500, 1500, "Login-8"], "isController": false}, {"data": [0.002, 500, 1500, "Logout"], "isController": false}, {"data": [0.03238199780461032, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.026344676180021953, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.001, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19329, 652, 3.3731698484142996, 39220.828030420846, 76, 259676, 32722.0, 75647.0, 133127.5, 170579.70000000004, 59.292866082603254, 4844.998664652813, 60.300544544613054], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 911, 35, 3.841931942919868, 32045.900109769485, 341, 178172, 32424.0, 48844.0, 59824.399999999994, 152292.04, 4.126298243945302, 474.1956013210609, 2.474229036729037], "isController": false}, {"data": ["Login Welcome-0", 911, 0, 0.0, 17754.052689352375, 193, 61757, 18593.0, 34425.8, 36060.2, 44713.119999999995, 8.131024634059264, 20.90721470847465, 4.07345277077383], "isController": false}, {"data": ["Login", 1000, 285, 28.5, 136780.20100000023, 3875, 259676, 145255.0, 174223.2, 185819.79999999993, 211645.94, 3.1047897591614584, 1029.5500032939879, 15.19149676189833], "isController": false}, {"data": ["Login-0", 942, 0, 0.0, 52059.219745222916, 1430, 123656, 53133.5, 78375.40000000001, 85102.34999999999, 96221.87999999998, 2.9500649828539216, 1.2529323023503438, 2.1484894911764245], "isController": false}, {"data": ["Logout-2", 993, 2, 0.2014098690835851, 17030.70795568981, 111, 81942, 15647.0, 33179.6, 38135.8, 56491.73999999994, 3.192207541710869, 378.99752391945543, 1.9353310749991963], "isController": false}, {"data": ["Login-1", 942, 32, 3.397027600849257, 43665.32484076434, 620, 155502, 42099.0, 56944.700000000004, 66509.99999999996, 150717.34, 2.9950305385014038, 12.773742775720857, 1.7960595238473742], "isController": false}, {"data": ["Logout-1", 995, 2, 0.20100502512562815, 22590.196984924612, 76, 122971, 16451.0, 42791.0, 52519.6, 63412.159999999945, 3.18026509667047, 8.431095396566272, 1.6151438001211376], "isController": false}, {"data": ["Login-2", 910, 0, 0.0, 4447.461538461537, 83, 71720, 111.0, 16736.7, 32598.49999999998, 58436.92999999997, 2.9954804454378174, 66.11437838843152, 1.75675232931522], "isController": false}, {"data": ["Logout-0", 995, 0, 0.0, 27130.066331658254, 99, 107365, 26871.0, 48109.2, 53023.6, 63301.51999999996, 3.1655335435205187, 1.4012320228713777, 1.7929779836346689], "isController": false}, {"data": ["Login-3", 910, 2, 0.21978021978021978, 37283.64615384618, 508, 151851, 33998.5, 55027.899999999994, 57117.149999999994, 74676.48999999998, 2.881251286272896, 170.03241716897273, 1.8017776786138333], "isController": false}, {"data": ["Login-4", 910, 6, 0.6593406593406593, 37487.93846153846, 747, 153545, 34339.5, 54089.5, 56973.549999999996, 75955.98999999996, 2.894043041734645, 389.48814147974645, 1.825224844882473], "isController": false}, {"data": ["Login-5", 780, 2, 0.2564102564102564, 38913.78076923077, 952, 152570, 35598.5, 54874.1, 57536.4, 73062.77999999993, 2.5182248451937417, 54.6066268711137, 1.5976849028788476], "isController": false}, {"data": ["Login-6", 774, 3, 0.3875968992248062, 39332.51937984497, 883, 179462, 35606.0, 54599.0, 56559.25, 85264.0, 2.565275319665122, 219.61183367367147, 1.632643599696078], "isController": false}, {"data": ["Logout-4", 993, 1, 0.10070493454179255, 16826.649546827786, 78, 65840, 15566.0, 33182.600000000006, 38753.29999999999, 55639.86, 3.192546224404171, 116.94564272096247, 1.9236338090404037], "isController": false}, {"data": ["Login-7", 774, 7, 0.9043927648578811, 39390.46511627902, 597, 169609, 35372.0, 55120.0, 60911.0, 82619.25, 2.458391563969, 18.31525536780587, 1.5430456739931395], "isController": false}, {"data": ["Logout-3", 993, 0, 0.0, 17123.846928499504, 88, 140704, 15603.0, 33146.4, 38527.69999999996, 55882.55999999997, 3.1914073045624587, 272.2640387623012, 1.9056226106627712], "isController": false}, {"data": ["Login-8", 774, 43, 5.555555555555555, 38792.78811369511, 155, 154294, 35646.0, 55908.0, 59404.25, 79517.75, 2.585343042287394, 140.039137524843, 1.5329336879551072], "isController": false}, {"data": ["Logout", 1000, 13, 1.3, 68993.40399999998, 365, 226253, 61436.5, 130110.1, 140217.3, 159766.77000000002, 3.178750687404836, 769.4776365203885, 9.101741056386269], "isController": false}, {"data": ["Login Welcome-3", 911, 34, 3.7321624588364433, 32757.46322722281, 218, 209824, 32558.0, 49153.8, 64840.999999999985, 153503.8, 3.273422397251906, 120.04308086965777, 1.9736035403985597], "isController": false}, {"data": ["Login Welcome-2", 911, 30, 3.293084522502744, 32048.197585071346, 316, 202992, 32568.0, 48232.4, 57593.19999999998, 153267.68, 2.97418887242003, 246.66166058640653, 1.7473563672453982], "isController": false}, {"data": ["Login Welcome", 1000, 155, 15.5, 64252.25800000007, 1374, 251296, 61445.5, 151509.3, 153417.85, 185155.88, 3.247185501966171, 701.9150904371604, 6.793546508017301], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 10, 1.5337423312883436, 0.05173573387138496], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 182, 27.914110429447852, 0.9415903564592064], "isController": false}, {"data": ["500", 133, 20.39877300613497, 0.6880852604894201], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 41, 6.288343558282208, 0.21211650887267836], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 14, 2.147239263803681, 0.07243002741993895], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 13.530)", 1, 0.15337423312883436, 0.0051735733871384965], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, 0.15337423312883436, 0.0051735733871384965], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 136, 20.858895705521473, 0.7036059806508356], "isController": false}, {"data": ["Assertion failed", 131, 20.0920245398773, 0.677738113715143], "isController": false}, {"data": ["Test failed: text expected to contain /You have been logged out./", 3, 0.4601226993865031, 0.01552072016141549], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19329, 652, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 182, "Test failed: text expected to contain /The electronic survey app/", 136, "500", 133, "Assertion failed", 131, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 41], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 911, 35, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 18, "500", 11, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 5, "Assertion failed", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 1000, 285, "Test failed: text expected to contain /The electronic survey app/", 136, "500", 62, "Assertion failed", 59, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 24, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 3], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 993, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 942, 32, "500", 17, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 11, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 3, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, null, null], "isController": false}, {"data": ["Logout-1", 995, 2, "500", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 910, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 910, 6, "500", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 780, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 774, 3, "500", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 993, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 774, 7, "500", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 774, 43, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 40, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, "500", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null], "isController": false}, {"data": ["Logout", 1000, 13, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 3, "500", 3, "Assertion failed", 3, "Test failed: text expected to contain /You have been logged out./", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 1], "isController": false}, {"data": ["Login Welcome-3", 911, 34, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 23, "500", 9, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, "Assertion failed", 1, null, null], "isController": false}, {"data": ["Login Welcome-2", 911, 30, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 21, "500", 5, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.694; received: 13.530)", 1, "Assertion failed", 1], "isController": false}, {"data": ["Login Welcome", 1000, 155, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 73, "Assertion failed", 66, "500", 10, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 6, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
