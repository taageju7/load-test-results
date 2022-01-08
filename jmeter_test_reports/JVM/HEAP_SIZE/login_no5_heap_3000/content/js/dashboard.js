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

    var data = {"OkPercent": 74.20058716178687, "KoPercent": 25.799412838213122};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.037580338014758394, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.02385719052385719, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.029863196529863197, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.029772031303164342, 500, 1500, "Login-0"], "isController": false}, {"data": [0.003234750462107209, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.016502211636611093, 500, 1500, "Login-1"], "isController": false}, {"data": [0.029505220154335, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.33339088397790057, 500, 1500, "Login-2"], "isController": false}, {"data": [0.20517476168860643, 500, 1500, "Logout-0"], "isController": false}, {"data": [5.179558011049724E-4, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0016173752310536045, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0016173752310536045, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.01701701701701702, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.016016016016016016, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [1.6666666666666666E-4, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50412, 13006, 25.799412838213122, 31043.54292628748, 0, 148540, 31253.5, 59668.80000000003, 85442.25000000001, 129121.49000000008, 176.57072005492003, 10795.93345619269, 140.70975221405155], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 2997, 520, 17.350684017350684, 29684.86119452784, 0, 68190, 33154.0, 55553.200000000004, 57436.5, 60256.28, 19.01010446994348, 1874.3083851480785, 9.466925829590938], "isController": false}, {"data": ["Login Welcome-0", 2997, 0, 0.0, 26359.160160160172, 53, 51178, 27264.0, 44848.0, 46483.7, 48102.12, 27.178250145095763, 69.80351355625181, 13.562583812640561], "isController": false}, {"data": ["Login", 3000, 2484, 82.8, 82653.49366666666, 0, 148540, 84759.0, 115800.5, 124024.15, 139589.95, 11.40949041412647, 2096.1674414918953, 34.67335965994013], "isController": false}, {"data": ["Login-0", 2939, 0, 0.0, 18398.366110922107, 227, 63093, 5840.0, 46137.0, 49159.0, 58104.6, 14.1043114370177, 5.220234021072484, 10.329125220154912], "isController": false}, {"data": ["Logout-2", 2164, 540, 24.953789279112755, 18291.5328096118, 1, 66279, 11848.0, 40618.5, 49415.5, 56830.999999999985, 8.270748533318045, 742.812978493044, 3.7398896883181414], "isController": false}, {"data": ["Login-1", 2939, 43, 1.4630826811840763, 37761.56958149029, 0, 61224, 40969.0, 52238.0, 55758.0, 59366.0, 12.310875793777123, 40.44767887605139, 7.442331385193438], "isController": false}, {"data": ["Logout-1", 2203, 39, 1.7703132092601, 30859.58874262369, 1, 61059, 33260.0, 49675.6, 50588.99999999999, 55406.16, 8.391070347107691, 22.241942687046976, 4.16955708822622], "isController": false}, {"data": ["Login-2", 2896, 700, 24.171270718232044, 17145.22030386736, 0, 53952, 117.5, 48795.6, 49888.35, 51320.270000000004, 11.241886897922425, 586.2425677410057, 5.255327680526226], "isController": false}, {"data": ["Logout-0", 2203, 0, 0.0, 10091.4439400817, 28, 62831, 2218.0, 39401.0, 49496.79999999998, 58022.68, 8.695000078937813, 3.838027378593644, 4.907919966431695], "isController": false}, {"data": ["Login-3", 2896, 1052, 36.32596685082873, 25056.579765193386, 0, 65033, 32103.5, 49869.6, 51109.05, 57981.600000000006, 11.248742479151373, 539.4816141894477, 4.537589798641294], "isController": false}, {"data": ["Login-4", 2896, 1058, 36.533149171270715, 25012.81733425418, 0, 95202, 31971.5, 49765.6, 51112.65, 58316.72, 11.205869151356621, 565.450599048217, 4.557077538055844], "isController": false}, {"data": ["Login-5", 990, 360, 36.36363636363637, 22817.2080808081, 0, 66372, 23318.5, 51102.5, 56562.69999999999, 61328.31000000002, 4.547960308710033, 65.34775997163267, 1.8229794738836824], "isController": false}, {"data": ["Login-6", 990, 372, 37.57575757575758, 22337.471717171724, 0, 68181, 22650.5, 51780.299999999996, 56662.24999999999, 59964.83000000003, 4.547897630958779, 245.38277761555796, 1.7660517960750266], "isController": false}, {"data": ["Logout-4", 2164, 562, 25.970425138632162, 17983.160813308692, 0, 66564, 11801.5, 40523.5, 49411.0, 55691.449999999975, 8.271760195403134, 229.93911808663944, 3.677717360662505], "isController": false}, {"data": ["Login-7", 990, 390, 39.39393939393939, 21473.762626262625, 0, 67103, 20793.5, 50649.6, 55781.5, 63432.48, 4.540263885640384, 23.709859402301774, 1.717109743681466], "isController": false}, {"data": ["Logout-3", 2164, 548, 25.32347504621072, 18295.535120147888, 1, 65015, 11816.0, 41252.5, 49612.5, 56371.799999999974, 8.270464047941173, 531.1893842572157, 3.661025151535998], "isController": false}, {"data": ["Login-8", 990, 458, 46.26262626262626, 19937.832323232316, 0, 90706, 15402.0, 50545.8, 56301.24999999999, 63911.36, 4.02434116657114, 127.80967895970781, 1.3516095332170748], "isController": false}, {"data": ["Logout", 3000, 1471, 49.03333333333333, 44576.030333333285, 0, 147372, 39726.0, 95727.8, 122351.0, 139333.11999999994, 11.18030477510817, 1498.7360869259378, 19.51616823470441], "isController": false}, {"data": ["Login Welcome-3", 2997, 745, 24.858191524858192, 26537.888555221878, 0, 115949, 26396.0, 55438.0, 57380.1, 64065.56, 18.882546403054477, 530.4749914155925, 8.521525795750955], "isController": false}, {"data": ["Login Welcome-2", 2997, 648, 21.62162162162162, 27986.849849849856, 0, 67638, 29483.0, 55467.0, 57611.7, 63013.02, 19.271824682339627, 1295.2833196754914, 8.953809382475308], "isController": false}, {"data": ["Login Welcome", 3000, 1016, 33.86666666666667, 66063.54866666663, 1233, 125894, 77172.5, 93987.3, 96940.24999999999, 101063.54999999999, 18.710124048122438, 3672.3100651989353, 35.755089689708186], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 0.007688759034291865, 0.001983654685392367], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 169, 1.2994002767953252, 0.33523764183131], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 13, 0.09995386744579425, 0.02578751091010077], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 35, 0.2691065662002153, 0.06942791398873284], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4773, 36.69844687067507, 9.467983813377767], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3987, 30.655082269721667, 7.908831230659366], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1906, 14.654774719360296, 3.780845830357851], "isController": false}, {"data": ["Assertion failed", 2122, 16.31554667076734, 4.209315242402602], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50412, 13006, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4773, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3987, "Assertion failed", 2122, "Test failed: text expected to contain /The electronic survey app/", 1906, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 169], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 2997, 520, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 501, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2484, "Test failed: text expected to contain /The electronic survey app/", 1906, "Assertion failed", 474, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 104, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2164, 540, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 460, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 75, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, null, null, null, null], "isController": false}, {"data": ["Login-1", 2939, 43, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 43, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2203, 39, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 31, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null], "isController": false}, {"data": ["Login-2", 2896, 700, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 666, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 34, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2896, 1052, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 702, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 336, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, null, null, null, null], "isController": false}, {"data": ["Login-4", 2896, 1058, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 683, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 357, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 16, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null], "isController": false}, {"data": ["Login-5", 990, 360, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 343, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1, null, null], "isController": false}, {"data": ["Login-6", 990, 372, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 349, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1, null, null], "isController": false}, {"data": ["Logout-4", 2164, 562, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 473, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 86, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-7", 990, 390, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 367, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1, null, null], "isController": false}, {"data": ["Logout-3", 2164, 548, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 469, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 78, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null], "isController": false}, {"data": ["Login-8", 990, 458, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 416, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 35, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null], "isController": false}, {"data": ["Logout", 3000, 1471, "Assertion failed", 635, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 524, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 307, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1], "isController": false}, {"data": ["Login Welcome-3", 2997, 745, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 716, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 27, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 2997, 648, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 627, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 18, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 3, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 1016, "Assertion failed", 1013, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 3, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
