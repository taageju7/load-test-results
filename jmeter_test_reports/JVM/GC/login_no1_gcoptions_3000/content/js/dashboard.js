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

    var data = {"OkPercent": 75.95949041514287, "KoPercent": 24.04050958485713};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03388859864164289, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.025, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.034333333333333334, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.015218188485515219, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.004033736707004034, 500, 1500, "Login-1"], "isController": false}, {"data": [6.050826946349334E-4, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.357702861622893, 500, 1500, "Login-2"], "isController": false}, {"data": [0.13412666397741024, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.001960015680125441, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0011760094080752645, 500, 1500, "Login-4"], "isController": false}, {"data": [0.004329004329004329, 500, 1500, "Login-5"], "isController": false}, {"data": [0.003787878787878788, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.004329004329004329, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0027056277056277055, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.023666666666666666, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.0255, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.013333333333333334, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 49766, 11964, 24.04050958485713, 29153.243821082477, 1, 133009, 29600.0, 60433.700000000135, 98043.20000000001, 111827.95000000001, 185.84450842659913, 11793.633423564976, 150.86340899160888], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 371, 12.366666666666667, 30184.44599999995, 42, 60495, 34908.0, 49317.4, 50635.7, 53031.94, 20.12342366514623, 2102.830419803964, 10.625672090907566], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 24048.192666666655, 20, 43163, 27885.5, 37445.90000000001, 40373.75, 41879.97, 28.831183808407175, 74.13330758548446, 14.387436451265689], "isController": false}, {"data": ["Login", 3000, 2482, 82.73333333333333, 72675.78766666664, 4017, 133009, 78152.5, 108312.9, 115313.8, 124615.39999999992, 12.36521911168266, 2263.3279874691384, 36.12407392881137], "isController": false}, {"data": ["Login-0", 2727, 0, 0.0, 21129.59149248257, 474, 55906, 10915.0, 42960.200000000004, 46928.399999999994, 51998.03999999999, 14.605303326495745, 5.439477132015447, 10.697243647335752], "isController": false}, {"data": ["Logout-2", 2335, 614, 26.295503211991434, 14578.27451820126, 2, 53351, 10635.0, 31822.2, 36307.399999999994, 49370.31999999998, 9.16984436790908, 809.4655686273018, 4.072313065015571], "isController": false}, {"data": ["Login-1", 2727, 176, 6.453978731206454, 32058.78547854788, 78, 55529, 34682.0, 45699.600000000006, 49398.6, 51962.03999999998, 12.71583580857701, 42.43243455418802, 7.295259801498669], "isController": false}, {"data": ["Logout-1", 2479, 144, 5.808793868495361, 24781.567970956083, 2, 52797, 29412.0, 35851.0, 37722.0, 48571.39999999996, 9.669052401661565, 25.909589399243327, 4.607062194063616], "isController": false}, {"data": ["Login-2", 2551, 455, 17.836142689141514, 15202.467659741285, 2, 43513, 4018.0, 36157.0, 37721.6, 39658.28, 10.687726501455893, 611.6813666220646, 5.420274760667826], "isController": false}, {"data": ["Logout-0", 2479, 0, 0.0, 16337.50463896729, 21, 54223, 4096.0, 39202.0, 41850.0, 49858.999999999985, 9.97657778028187, 4.403723785827545, 5.631310504885666], "isController": false}, {"data": ["Login-3", 2551, 754, 29.55703645629165, 23461.30105840841, 1, 59986, 30118.0, 39246.4, 44828.0, 51161.200000000004, 10.65691906005222, 561.5786920691907, 4.754618146214099], "isController": false}, {"data": ["Login-4", 2551, 742, 29.086632693061546, 23590.545276362245, 1, 62737, 30148.0, 39094.8, 44535.4, 50748.96, 10.67154157968935, 609.3806008533364, 4.847136167259995], "isController": false}, {"data": ["Login-5", 924, 272, 29.437229437229437, 23594.08116883117, 135, 59363, 27607.0, 46108.0, 50056.5, 52373.25, 4.63315816920053, 73.66880926205424, 2.0592662849993983], "isController": false}, {"data": ["Login-6", 924, 273, 29.545454545454547, 23552.051948051936, 437, 60332, 27535.5, 45988.5, 49968.75, 53877.0, 4.6365292266931615, 281.98922224135293, 2.0320832439521896], "isController": false}, {"data": ["Logout-4", 2335, 685, 29.336188436830835, 13891.43897216273, 1, 59216, 10433.0, 31678.600000000002, 35979.39999999999, 48707.47999999979, 9.170384567047883, 244.63707162939275, 3.8918829209933077], "isController": false}, {"data": ["Login-7", 924, 258, 27.92207792207792, 24202.35606060605, 119, 83525, 28014.5, 46909.5, 50041.25, 54889.0, 4.525374420859821, 27.107575135173523, 2.0354370579923793], "isController": false}, {"data": ["Logout-3", 2335, 667, 28.565310492505354, 14066.393147751636, 1, 55088, 10453.0, 31855.4, 36368.2, 49222.87999999999, 9.171285040396858, 564.7135490823315, 3.883542723066469], "isController": false}, {"data": ["Login-8", 924, 315, 34.09090909090909, 23064.805194805194, 222, 72137, 24840.0, 46029.5, 50204.0, 55858.25, 4.661510753257761, 180.25328538920337, 1.920224600063566], "isController": false}, {"data": ["Logout", 3000, 1482, 49.4, 47358.2319999999, 1, 128728, 41670.0, 97248.8, 102692.09999999998, 118276.44999999998, 11.55098991983613, 1622.1216677800537, 21.550849593357025], "isController": false}, {"data": ["Login Welcome-3", 3000, 753, 25.1, 25088.404333333347, 45, 61337, 27508.5, 48880.1, 50731.549999999996, 55236.989999999954, 20.180412891247755, 568.8038564769035, 9.077934074374912], "isController": false}, {"data": ["Login Welcome-2", 3000, 626, 20.866666666666667, 26758.48666666665, 51, 60429, 29291.5, 49031.700000000004, 50822.75, 54633.289999999986, 20.05240361477996, 1363.2509494604233, 9.406209164115555], "isController": false}, {"data": ["Login Welcome", 3000, 895, 29.833333333333332, 60050.117000000115, 239, 92799, 73096.5, 82976.9, 84767.8, 89343.81999999999, 19.955300127713922, 4055.6811856025834, 38.8323904454023], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 66, 0.551654964894684, 0.13262066471084677], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3263, 27.27348712805082, 6.556685287143833], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 8, 0.06686726847208292, 0.016075232086163245], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1627, 13.599130725509863, 3.26930032552345], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4882, 40.805750585088596, 9.809910380581119], "isController": false}, {"data": ["Assertion failed", 2118, 17.703109327983952, 4.2559176948117186], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 49766, 11964, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4882, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3263, "Assertion failed", 2118, "Test failed: text expected to contain /The electronic survey app/", 1627, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 66], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 371, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 371, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2482, "Test failed: text expected to contain /The electronic survey app/", 1627, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 449, "Assertion failed", 406, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2335, 614, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 552, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 62, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 2727, 176, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 176, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2479, 144, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 74, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 70, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2551, 455, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 350, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 104, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2551, 754, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 397, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 357, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 2551, 742, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 379, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 362, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-5", 924, 272, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 272, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 924, 273, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 272, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2335, 685, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 610, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 73, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Login-7", 924, 258, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 256, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2335, 667, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 599, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 66, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Login-8", 924, 315, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 250, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 57, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 8, null, null, null, null], "isController": false}, {"data": ["Logout", 3000, 1482, "Assertion failed", 817, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 363, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 302, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 3000, 753, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 753, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 626, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 626, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 895, "Assertion failed", 895, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
