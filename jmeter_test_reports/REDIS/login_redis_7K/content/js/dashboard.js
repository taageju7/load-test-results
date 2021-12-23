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

    var data = {"OkPercent": 69.78625485784414, "KoPercent": 30.21374514215586};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.13445489875230107, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.22190625612865267, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.13277113159443027, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.029758081781203167, 500, 1500, "Login-0"], "isController": false}, {"data": [0.12740128068303094, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.18582744594305287, 500, 1500, "Login-1"], "isController": false}, {"data": [0.23309476801579468, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.18250857422831945, 500, 1500, "Login-2"], "isController": false}, {"data": [0.22556762092793683, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.1789563939245468, 500, 1500, "Login-3"], "isController": false}, {"data": [0.16768740813326802, 500, 1500, "Login-4"], "isController": false}, {"data": [0.16144484722941482, 500, 1500, "Login-5"], "isController": false}, {"data": [0.1461677887105127, 500, 1500, "Login-6"], "isController": false}, {"data": [0.12046424759871932, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.14655618850336613, 500, 1500, "Login-7"], "isController": false}, {"data": [0.13500533617929564, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.14060072501294665, 500, 1500, "Login-8"], "isController": false}, {"data": [0.014142857142857143, 500, 1500, "Logout"], "isController": false}, {"data": [0.20562855461855264, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.21219847028829183, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.05021428571428571, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 97780, 29543, 30.21374514215586, 15545.969145019406, 0, 166649, 5379.5, 49823.80000000006, 74235.75, 86998.79000000004, 313.60449527572695, 18732.064605356423, 236.895769923411], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 5099, 601, 11.786624828397725, 10678.04863698765, 1, 64423, 7451.0, 34258.0, 36955.0, 44165.0, 17.097828820521418, 1797.3504825425432, 9.087838722860257], "isController": false}, {"data": ["Login Welcome-0", 5099, 0, 0.0, 15148.668170229448, 3, 62678, 9599.0, 44422.0, 46520.0, 49246.0, 18.274413670508633, 46.98879999457932, 9.11936072815421], "isController": false}, {"data": ["Login", 7000, 6289, 89.84285714285714, 41467.34457142858, 1, 166649, 30223.5, 94101.5, 101605.95, 118607.82999999997, 22.603394384025215, 3654.4454084382915, 56.40892759406241], "isController": false}, {"data": ["Login-0", 4671, 0, 0.0, 25306.701562834533, 5, 77114, 23503.0, 50006.6, 54756.99999999999, 66723.64, 15.245574181419395, 6.539450518997402, 11.107289228957779], "isController": false}, {"data": ["Logout-2", 3748, 703, 18.75667022411953, 6171.751867662744, 1, 56909, 2712.5, 15744.399999999998, 24400.499999999985, 42811.67, 12.931897069276047, 1254.9478838704083, 6.330458431308784], "isController": false}, {"data": ["Login-1", 4671, 589, 12.60971954613573, 13352.310640119891, 1, 58511, 6527.0, 39532.600000000006, 46424.99999999996, 50366.84, 15.494284595941167, 68.0941832733625, 8.215135319986333], "isController": false}, {"data": ["Logout-1", 4052, 304, 7.502467917077986, 9730.118213228043, 2, 62635, 3254.0, 33309.4, 36355.35, 46549.359999999986, 13.987800373514315, 37.55410585264481, 6.544995831621681], "isController": false}, {"data": ["Login-2", 4082, 1721, 42.160705536501716, 14878.198432141156, 2, 68502, 10275.0, 39611.4, 50228.65, 62951.85, 13.497070454575514, 113.71371171814037, 4.524388269336323], "isController": false}, {"data": ["Logout-0", 4052, 0, 0.0, 16374.126850937844, 2, 59676, 7629.0, 45950.1, 47988.35, 52064.34, 13.98881447213975, 6.085852810191258, 7.83906670751916], "isController": false}, {"data": ["Login-3", 4082, 779, 19.08378245957864, 9391.638902498786, 1, 63917, 5228.5, 25468.0, 36761.85, 47946.19, 13.454585007465614, 612.7822806419769, 6.771210150432939], "isController": false}, {"data": ["Login-4", 4082, 1053, 25.796178343949045, 8706.35570798629, 1, 68516, 4642.0, 25456.4, 36408.299999999996, 47867.3, 13.453210380262473, 1482.2398272095052, 6.267950196014132], "isController": false}, {"data": ["Login-5", 3862, 1120, 29.00051786639047, 8739.33635422061, 1, 79821, 4546.0, 25476.7, 36711.8, 48637.15999999998, 12.809116960305667, 203.84059542431442, 5.728410475068324], "isController": false}, {"data": ["Login-6", 3862, 1220, 31.589849818746764, 8645.83505955464, 0, 65313, 4336.5, 25466.100000000002, 36760.25, 48137.11, 12.73058108411018, 751.6393228050708, 5.417616347440699], "isController": false}, {"data": ["Logout-4", 3748, 1102, 29.402347918890076, 5395.656883671291, 1, 62819, 2107.0, 15132.099999999997, 22687.049999999785, 42872.61, 12.932834147098912, 344.94446899100257, 5.483516125066855], "isController": false}, {"data": ["Login-7", 3862, 1270, 32.88451579492491, 8785.090885551544, 0, 82876, 4303.0, 25478.800000000003, 37104.7, 48747.61999999999, 12.808904543479631, 72.99223059054621, 5.364578669293453], "isController": false}, {"data": ["Logout-3", 3748, 948, 25.29348986125934, 5648.940234791872, 1, 78105, 2041.5, 15255.1, 24274.549999999996, 43459.81999999998, 12.931897069276047, 831.2347490660344, 5.726765800859826], "isController": false}, {"data": ["Login-8", 3862, 1819, 47.09994821336095, 8144.236147074046, 0, 86610, 1292.0, 32916.10000000001, 40652.7, 49650.16999999994, 12.810051678043797, 403.55813505242435, 4.235327482237746], "isController": false}, {"data": ["Logout", 7000, 4725, 67.5, 21440.358285714294, 2, 119843, 6810.0, 71908.60000000003, 79707.9, 94026.76, 24.037223357313323, 2488.8757688692203, 31.764409322794158], "isController": false}, {"data": ["Login Welcome-3", 5099, 1104, 21.651304177289663, 10347.724259658773, 1, 69520, 4691.0, 33529.0, 37924.0, 53018.0, 17.09725551997586, 501.00306608567905, 8.045134944967893], "isController": false}, {"data": ["Login Welcome-2", 5099, 784, 15.375563836046284, 11756.913316336553, 1, 68646, 7577.0, 35573.0, 38624.0, 52820.0, 17.097714157336526, 1238.9377831054449, 8.576746514609678], "isController": false}, {"data": ["Login Welcome", 7000, 3412, 48.74285714285714, 31045.718714285696, 1, 107898, 23870.5, 66403.7, 84253.0, 90012.99, 23.459467067935265, 3596.04201087849, 34.22367400075238], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 8, 0.027079172731273058, 0.008181632235631009], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 65, 0.2200182784415936, 0.06647576191450194], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 7, 0.023694276139863926, 0.007158928206177132], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 11, 0.037233862505500454, 0.011249744323992637], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 220, 0.7446772501100092, 0.22499488647985272], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 853, 2.88731679247199, 0.8723665371241562], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 6375, 21.57871577023322, 6.51973818776846], "isController": false}, {"data": ["Assertion failed", 6135, 20.766340588295026, 6.274289220699529], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket is closed", 3, 0.010154689774227397, 0.0030681120883616284], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 630, 2.1324848525877536, 0.6443035385559419], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 7, 0.023694276139863926, 0.007158928206177132], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to fonts.googleapis.com:443 [fonts.googleapis.com/142.250.203.106] failed: Connection timed out: connect", 95, 0.3215651761838676, 0.09715688279811822], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 2, 0.0067697931828182645, 0.0020454080589077522], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 3, 0.010154689774227397, 0.0030681120883616284], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 15084, 51.05778018481536, 15.426467580282266], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 17, 0.05754324205395525, 0.017385968500715894], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 16, 0.054158345462546116, 0.016363264471262018], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 12, 0.04061875909690959, 0.012272448353446513], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 97780, 29543, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 15084, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 6375, "Assertion failed", 6135, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 853, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 630], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 5099, 601, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 419, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 182, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 7000, 6289, "Assertion failed", 3151, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1800, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1117, "Test failed: text expected to contain /The electronic survey app/", 220, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 3748, 703, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 556, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 147, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 4671, 589, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 390, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 199, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 4052, 304, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 187, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 117, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 4082, 1721, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 853, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 630, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 100, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to fonts.googleapis.com:443 [fonts.googleapis.com/142.250.203.106] failed: Connection timed out: connect", 95, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 16], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 4082, 779, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 585, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 194, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 4082, 1053, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 819, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 231, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 1, null, null], "isController": false}, {"data": ["Login-5", 3862, 1120, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 866, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 250, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1], "isController": false}, {"data": ["Login-6", 3862, 1220, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 954, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 261, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1], "isController": false}, {"data": ["Logout-4", 3748, 1102, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 923, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 178, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-7", 3862, 1270, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 999, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 264, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1], "isController": false}, {"data": ["Logout-3", 3748, 948, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 810, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 137, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null], "isController": false}, {"data": ["Login-8", 3862, 1819, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1351, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 383, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 52, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 16, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 8], "isController": false}, {"data": ["Logout", 7000, 4725, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2115, "Assertion failed", 1473, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1136, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 1, null, null], "isController": false}, {"data": ["Login Welcome-3", 5099, 1104, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 826, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 278, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 5099, 784, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 510, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 268, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null], "isController": false}, {"data": ["Login Welcome", 7000, 3412, "Assertion failed", 1511, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1027, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 874, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
