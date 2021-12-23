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

    var data = {"OkPercent": 76.13890857547838, "KoPercent": 23.861091424521614};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.14251594613749113, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.21131959397108582, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.22331590279913874, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [2.0E-4, 500, 1500, "Login"], "isController": false}, {"data": [0.018802647412755717, 500, 1500, "Login-0"], "isController": false}, {"data": [0.13844653883652908, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.17117930204572804, 500, 1500, "Login-1"], "isController": false}, {"data": [0.20933926302414232, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.35449121644017234, 500, 1500, "Login-2"], "isController": false}, {"data": [0.31019695044472684, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.11982101425256877, 500, 1500, "Login-3"], "isController": false}, {"data": [0.11700364600596619, 500, 1500, "Login-4"], "isController": false}, {"data": [0.13197879858657244, 500, 1500, "Login-5"], "isController": false}, {"data": [0.12402826855123675, 500, 1500, "Login-6"], "isController": false}, {"data": [0.1319467013324667, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.12791519434628976, 500, 1500, "Login-7"], "isController": false}, {"data": [0.14965875853103672, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.1549469964664311, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0163, 500, 1500, "Logout"], "isController": false}, {"data": [0.20916641033528144, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.228237465395263, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0537, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 70550, 16834, 23.861091424521614, 13310.473465627052, 0, 117377, 6952.5, 37600.00000000006, 50086.10000000003, 78297.23000000013, 326.72171460591943, 20850.670490636854, 264.07641490647563], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3251, 153, 4.706244232543833, 12175.171947093204, 5, 65788, 7323.0, 31655.2, 33405.79999999999, 49236.36, 16.335944605520353, 1851.5657387040285, 9.379807021918607], "isController": false}, {"data": ["Login Welcome-0", 3251, 0, 0.0, 13261.267609966146, 3, 52700, 10560.0, 32749.0, 33305.6, 44876.96, 18.003400211544104, 46.29194605175355, 8.984118660252967], "isController": false}, {"data": ["Login", 5000, 3718, 74.36, 34747.83159999996, 1236, 117377, 20745.0, 80422.90000000001, 84885.3, 95978.41999999997, 23.43984398439844, 4217.058261307087, 64.64829832592633], "isController": false}, {"data": ["Login-0", 3324, 0, 0.0, 20723.10198555954, 407, 58839, 20824.0, 41791.0, 46341.75, 49437.0, 15.894951774792824, 6.818705939506893, 11.568457169943049], "isController": false}, {"data": ["Logout-2", 3077, 561, 18.23204419889503, 4784.701982450419, 1, 49446, 2586.0, 12728.2, 15835.299999999997, 31085.719999999954, 15.903205966415653, 1552.893894222942, 7.835253129473907], "isController": false}, {"data": ["Login-1", 3324, 307, 9.235860409145607, 12721.964500601698, 2, 50742, 8416.0, 32656.5, 38310.0, 41985.0, 15.826310527067562, 70.40302836201971, 8.715700584440318], "isController": false}, {"data": ["Logout-1", 3148, 71, 2.255400254129606, 8090.906607369723, 2, 43206, 5040.0, 18740.5, 25466.949999999997, 39390.96999999994, 16.29079166623542, 43.44774259106646, 8.054985545674246], "isController": false}, {"data": ["Login-2", 3017, 689, 22.837255551872722, 5825.871395425905, 3, 28058, 1528.0, 17728.800000000003, 22894.3, 26783.920000000002, 14.25049123337364, 142.50416046474692, 6.370350700479897], "isController": false}, {"data": ["Logout-0", 3148, 0, 0.0, 11785.79447268105, 3, 54037, 7169.5, 37063.0, 39055.2, 41591.02, 16.299986019707035, 7.094396952619752, 9.136167972572737], "isController": false}, {"data": ["Login-3", 3017, 560, 18.561484918793504, 10341.8011269473, 2, 57114, 5855.0, 25287.4, 36995.299999999974, 43545.58, 14.19931756677256, 646.0270739572303, 7.18913622190846], "isController": false}, {"data": ["Login-4", 3017, 662, 21.942326814716605, 10047.686443486898, 2, 59655, 5554.0, 25151.400000000012, 35734.599999999955, 47642.16000000018, 14.200854781315309, 1671.4158291858278, 6.954944160916348], "isController": false}, {"data": ["Login-5", 2830, 623, 22.014134275618375, 10076.71837455828, 1, 62807, 5630.0, 23539.3, 34767.799999999996, 47908.16000000002, 13.321157575643463, 229.59225063428482, 6.543613221307734], "isController": false}, {"data": ["Login-6", 2830, 660, 23.32155477031802, 9768.714487632506, 1, 62746, 5607.0, 23439.2, 32607.45, 46111.080000000075, 13.321533812218155, 877.921661261168, 6.354289619206545], "isController": false}, {"data": ["Logout-4", 3077, 880, 28.599285017874553, 4145.460188495277, 1, 46355, 2160.0, 12629.400000000003, 15587.699999999999, 25993.179999999997, 15.903616948697008, 428.21358100953336, 6.819831219505576], "isController": false}, {"data": ["Login-7", 2830, 671, 23.710247349823323, 9838.606360424019, 2, 62835, 5621.5, 23457.0, 32957.89999999999, 50036.40000000004, 13.32002899342, 81.72742728699721, 6.341212082925417], "isController": false}, {"data": ["Logout-3", 3077, 728, 23.65940851478713, 4207.733831654193, 1, 53722, 1863.0, 12878.0, 15699.299999999997, 30564.23999999988, 15.915133082994547, 1044.3823002009435, 7.2020234236802905], "isController": false}, {"data": ["Login-8", 2830, 1071, 37.84452296819788, 7867.975618374551, 0, 62366, 4742.5, 18498.500000000004, 26307.24999999999, 49721.810000000005, 13.389287623661662, 489.8645238360664, 5.201359746029343], "isController": false}, {"data": ["Logout", 5000, 3108, 62.16, 18065.080800000018, 2, 104388, 5106.0, 58432.600000000006, 66322.9, 79863.46999999999, 25.828314030973317, 3099.7090258819076, 38.99501344040891], "isController": false}, {"data": ["Login Welcome-3", 3251, 169, 5.198400492156259, 12274.121808674261, 5, 69821, 6301.0, 31675.6, 33274.2, 49494.88, 16.343500052785835, 570.5571008809579, 9.305418136081883], "isController": false}, {"data": ["Login Welcome-2", 3251, 160, 4.92156259612427, 11623.290679790845, 5, 61902, 5852.0, 31838.6, 33099.399999999994, 49252.96, 16.351473694799317, 1326.1561376181974, 9.215686024104718], "isController": false}, {"data": ["Login Welcome", 5000, 2043, 40.86, 23014.497199999965, 11, 108986, 8419.0, 60637.600000000006, 68532.9, 97586.94, 25.097881738781247, 3808.9674682433365, 36.00170547949503], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 3, 0.017821076393014137, 0.004252303330970942], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 52, 0.3088986574789117, 0.073706591070163], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 5, 0.029701793988356897, 0.007087172218284904], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 13, 0.07722466436972793, 0.01842664776754075], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 187, 1.110847095164548, 0.26506024096385544], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 255, 1.5147914934062017, 0.3614457831325301], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 8558, 50.83759059047166, 12.130403968816442], "isController": false}, {"data": ["Assertion failed", 3027, 17.981466080551264, 4.290574060949681], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 357, 2.1207080907686824, 0.5060240963855421], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, 0.017821076393014137, 0.004252303330970942], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4342, 25.79303789948913, 6.1545003543586105], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 11, 0.06534394677438517, 0.01559177888022679], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 4, 0.023761435190685517, 0.005669737774627924], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 17, 0.10098609956041345, 0.024096385542168676], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 70550, 16834, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 8558, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4342, "Assertion failed", 3027, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 357, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 255], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3251, 153, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 153, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 5000, 3718, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1982, "Assertion failed", 1548, "Test failed: text expected to contain /The electronic survey app/", 187, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 3077, 561, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 504, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 57, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 3324, 307, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 306, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 3148, 71, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 65, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 3017, 689, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 357, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 255, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 60, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 13, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 4], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 3017, 560, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 320, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 237, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 3, null, null, null, null], "isController": false}, {"data": ["Login-4", 3017, 662, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 401, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 259, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Login-5", 2830, 623, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 330, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 291, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 2, null, null, null, null], "isController": false}, {"data": ["Login-6", 2830, 660, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 335, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 323, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Logout-4", 3077, 880, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 808, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 71, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-7", 2830, 671, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 350, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 321, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 3077, 728, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 671, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 57, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 2830, 1071, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 586, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 407, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 44, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 17, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 11], "isController": false}, {"data": ["Logout", 5000, 3108, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1775, "Assertion failed", 1185, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 148, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 3251, 169, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 166, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3251, 160, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 160, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 5000, 2043, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1749, "Assertion failed", 294, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
