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

    var data = {"OkPercent": 72.31191231679394, "KoPercent": 27.688087683206064};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.08374304078477864, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13770120724346077, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.198943661971831, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.014626091059212079, 500, 1500, "Login-0"], "isController": false}, {"data": [0.049661105318039626, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.07513564519933946, 500, 1500, "Login-1"], "isController": false}, {"data": [0.08572159672466735, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.23892288861689107, 500, 1500, "Login-2"], "isController": false}, {"data": [0.15813715455475946, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.06842105263157895, 500, 1500, "Login-3"], "isController": false}, {"data": [0.06597307221542227, 500, 1500, "Login-4"], "isController": false}, {"data": [0.06911647651897054, 500, 1500, "Login-5"], "isController": false}, {"data": [0.06832050941894402, 500, 1500, "Login-6"], "isController": false}, {"data": [0.051876955161626694, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0704430883523481, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0512252346193952, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.08079066065269302, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0012, 500, 1500, "Logout"], "isController": false}, {"data": [0.1340543259557344, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.13468309859154928, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0519, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 86037, 23822, 27.688087683206064, 13784.117461092235, 0, 115090, 4289.5, 44232.30000000001, 65269.40000000001, 73497.57000000007, 310.8823455019133, 18678.39431714452, 243.73500457089588], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3976, 368, 9.25553319919517, 10450.225603621757, 1, 48311, 6366.5, 28409.9, 33419.15, 34272.520000000004, 15.343057806591032, 1657.8011003644267, 8.389136904761905], "isController": false}, {"data": ["Login Welcome-0", 3976, 0, 0.0, 12050.752766599604, 3, 54693, 9090.0, 30083.900000000005, 33172.0, 34032.38, 17.59245329770006, 45.23528274691822, 8.779046518676495], "isController": false}, {"data": ["Login", 5000, 4016, 80.32, 44453.20059999998, 1, 115090, 52275.0, 75671.90000000001, 86237.75, 96312.33999999998, 18.372626256687635, 3868.8884822350483, 61.21867797356363], "isController": false}, {"data": ["Login-0", 4239, 0, 0.0, 17286.41825902337, 305, 49927, 16841.0, 35346.0, 43911.0, 49480.6, 15.99477783144168, 6.862958195531348, 11.617115631508845], "isController": false}, {"data": ["Logout-2", 3836, 948, 24.713242961418143, 8164.479927007328, 2, 48762, 2477.0, 23967.400000000005, 33827.75, 45457.26000000001, 15.52081310286787, 1398.5238508969178, 7.040739352706027], "isController": false}, {"data": ["Login-1", 4239, 154, 3.6329322953526777, 15745.085633404096, 2, 48621, 14879.0, 33754.0, 40625.0, 45114.6, 15.986212410339183, 71.60277739345354, 9.348378262343212], "isController": false}, {"data": ["Logout-1", 3908, 72, 1.842374616171955, 13429.300409416548, 2, 47894, 8819.5, 35006.299999999996, 38701.1, 43696.46, 15.764421137555464, 41.92785807029044, 7.827918578559903], "isController": false}, {"data": ["Login-2", 4085, 1364, 33.39045287637699, 8906.371603427193, 2, 54425, 4326.0, 23759.2, 27389.399999999998, 34064.56, 15.32028202820282, 146.51021010304157, 5.916831917566757], "isController": false}, {"data": ["Logout-0", 3908, 0, 0.0, 11665.1003070624, 51, 48302, 6455.0, 26616.1, 33689.7, 42770.11, 15.708342544767572, 6.846025590620416, 8.810663574974376], "isController": false}, {"data": ["Login-3", 4085, 1197, 29.302325581395348, 8548.430599755196, 2, 48301, 3626.0, 24446.0, 29798.7, 41483.43999999997, 15.231284349622294, 611.717631423426, 6.697870486543525], "isController": false}, {"data": ["Login-4", 4085, 1354, 33.145654834761324, 8050.461199510388, 2, 49132, 2891.0, 24407.4, 28631.79999999996, 44192.799999999996, 15.244755766697391, 1521.0028924160138, 6.398508668239034], "isController": false}, {"data": ["Login-5", 3769, 1208, 32.050941894401696, 7819.308835234807, 2, 48098, 2851.0, 24183.0, 27424.0, 40129.90000000016, 14.064639875810236, 215.51053340748462, 6.019657966215385], "isController": false}, {"data": ["Login-6", 3769, 1269, 33.66940833112231, 7579.565136641036, 2, 49136, 2617.0, 24142.0, 27501.5, 40414.9, 14.052212039639988, 804.9471421083072, 5.798264748484419], "isController": false}, {"data": ["Logout-4", 3836, 1236, 32.22106360792492, 7116.2617309697525, 2, 48338, 2144.0, 22084.100000000013, 33419.94999999999, 44704.67, 15.520122348409753, 398.6202693794176, 6.317788008318397], "isController": false}, {"data": ["Login-7", 3769, 1320, 35.02255240116742, 7451.038737065519, 1, 49756, 2375.0, 24222.0, 27599.5, 40322.5, 14.055985261540528, 78.40571501061005, 5.699343625532367], "isController": false}, {"data": ["Logout-3", 3836, 1135, 29.588112617309697, 7489.240354535955, 2, 48084, 2162.0, 22517.500000000004, 33636.34999999999, 45177.44000000002, 15.520436320086745, 942.4173101378976, 6.4779657332050755], "isController": false}, {"data": ["Login-8", 3769, 1661, 44.07004510480233, 6546.479172194212, 0, 54568, 1037.0, 20675.0, 27189.0, 33829.8, 14.062908100444012, 465.8243789294243, 4.915861348457147], "isController": false}, {"data": ["Logout", 5000, 2920, 58.4, 28469.660399999982, 1, 112916, 15464.0, 66859.9, 75139.25, 89752.29999999996, 19.902160976638847, 2753.9959185643374, 35.96415723428625], "isController": false}, {"data": ["Login Welcome-3", 3976, 769, 19.341046277665995, 9387.16524144867, 1, 54764, 4096.0, 29878.6, 33498.3, 34669.380000000005, 15.327383820666526, 460.8207552198782, 7.424988344721575], "isController": false}, {"data": ["Login Welcome-2", 3976, 691, 17.379275653923543, 9633.115442655928, 1, 54843, 4728.5, 29849.9, 33492.15, 34868.6, 15.302960907400921, 1083.4810310555135, 7.494681844620677], "isController": false}, {"data": ["Login Welcome", 5000, 2140, 42.8, 23164.433399999994, 1, 114727, 18579.0, 54420.60000000045, 68154.0, 85879.92, 19.230029614245606, 3243.7028901833105, 30.88888107668936], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, 0.004197800352615229, 0.001162290642398038], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 80, 0.33582402820921836, 0.09298325139184305], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 1, 0.004197800352615229, 0.001162290642398038], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, 0.004197800352615229, 0.001162290642398038], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 316, 1.3265049114264125, 0.36728384299778005], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 834, 3.5009654940811017, 0.9693503957599637], "isController": false}, {"data": ["Assertion failed", 5657, 23.746956594744354, 6.575078164045701], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket is closed", 4, 0.016791201410460917, 0.004649162569592152], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 286, 1.2005709008479557, 0.33241512372583887], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 4, 0.016791201410460917, 0.004649162569592152], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 1, 0.004197800352615229, 0.001162290642398038], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: socket write error", 1, 0.004197800352615229, 0.001162290642398038], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 16603, 69.69607925447066, 19.297511535734625], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 12, 0.050373604231382756, 0.013947487708776457], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 21, 0.08815380740491982, 0.0244081034903588], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 86037, 23822, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 16603, "Assertion failed", 5657, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 834, "Test failed: text expected to contain /The electronic survey app/", 316, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 286], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3976, 368, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 368, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 5000, 4016, "Assertion failed", 2785, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 915, "Test failed: text expected to contain /The electronic survey app/", 316, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 3836, 948, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 947, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 4239, 154, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 154, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 3908, 72, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 72, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 4085, 1364, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 834, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 286, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 225, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket is closed", 4], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 4085, 1197, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1194, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null], "isController": false}, {"data": ["Login-4", 4085, 1354, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1352, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 3769, 1208, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1207, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 3769, 1269, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1269, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 3836, 1236, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1233, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 1, null, null, null, null], "isController": false}, {"data": ["Login-7", 3769, 1320, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1317, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 3836, 1135, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1135, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 3769, 1661, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1567, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 69, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 21, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1], "isController": false}, {"data": ["Logout", 5000, 2920, "Assertion failed", 1756, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1164, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 3976, 769, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 769, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3976, 691, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 691, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 5000, 2140, "Assertion failed", 1116, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1024, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
