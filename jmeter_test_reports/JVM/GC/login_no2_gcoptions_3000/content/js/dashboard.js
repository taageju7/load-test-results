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

    var data = {"OkPercent": 77.03666091195288, "KoPercent": 22.96333908804712};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.02825225957144308, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.012333333333333333, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.023666666666666666, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.005062849162011173, 500, 1500, "Login-0"], "isController": false}, {"data": [4.6728971962616824E-4, 500, 1500, "Logout-2"], "isController": false}, {"data": [8.729050279329608E-4, 500, 1500, "Login-1"], "isController": false}, {"data": [4.496402877697842E-4, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.3404536862003781, 500, 1500, "Login-2"], "isController": false}, {"data": [0.11825539568345324, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [7.009345794392523E-4, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [7.009345794392523E-4, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.0165, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.015666666666666666, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [3.333333333333333E-4, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 49235, 11306, 22.96333908804712, 36537.757469280165, 2, 193928, 34239.5, 75633.90000000014, 122747.55, 140028.55000000008, 150.65743372878296, 9704.65821636294, 123.38640573697755], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 373, 12.433333333333334, 37577.037666666685, 58, 80873, 50269.5, 58051.1, 58776.399999999994, 61456.60999999999, 17.70966770760158, 1849.2319377069816, 9.344034599894332], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 30304.547666666684, 94, 58309, 31054.5, 51258.1, 52483.95, 53510.59999999999, 25.50261401793684, 65.57459248948017, 12.726402112466527], "isController": false}, {"data": ["Login", 3000, 2465, 82.16666666666667, 93958.9473333335, 4214, 193928, 96570.0, 138671.9, 142749.8, 150875.61999999997, 10.299580463755776, 1806.4627594260473, 29.96450037700756], "isController": false}, {"data": ["Login-0", 2864, 0, 0.0, 30629.278980446958, 579, 103026, 39741.0, 55430.0, 57597.75, 60860.24999999999, 12.904737444465473, 4.786016056575378, 9.45171199545811], "isController": false}, {"data": ["Logout-2", 2140, 255, 11.91588785046729, 21420.961682242974, 3, 73777, 17125.0, 38547.6, 47929.34999999998, 57496.34000000002, 7.395887333678935, 776.518550468723, 3.92530199693278], "isController": false}, {"data": ["Login-1", 2864, 219, 7.646648044692737, 39213.22311452511, 153, 78314, 42381.5, 55674.5, 57976.75, 60133.75, 11.134697178225135, 36.875939149890755, 6.308030168944925], "isController": false}, {"data": ["Logout-1", 2224, 84, 3.776978417266187, 30876.589028776878, 3, 75265, 31551.0, 49598.0, 51735.25, 56936.25, 7.351045474677895, 19.647878951517477, 3.578144728665772], "isController": false}, {"data": ["Login-2", 2645, 638, 24.120982986767487, 16154.452551984867, 2, 54962, 180.0, 41751.6, 49814.2, 53040.78, 9.250871750390846, 474.3951432431476, 4.321864321713493], "isController": false}, {"data": ["Logout-0", 2224, 0, 0.0, 19369.21043165466, 25, 69319, 4905.5, 49767.5, 53134.25, 58369.75, 7.642874325578199, 3.3736124952747515, 4.314044297054881], "isController": false}, {"data": ["Login-3", 2645, 924, 34.933837429111534, 26349.25822306239, 2, 76088, 34338.0, 50645.200000000004, 54045.69999999998, 58334.96, 9.359452516259616, 456.1019256985089, 3.856240401695671], "isController": false}, {"data": ["Login-4", 2645, 950, 35.916824196597354, 25997.51077504727, 2, 75600, 34175.0, 50868.4, 53957.09999999997, 58741.0, 9.32398467270875, 488.7390047428501, 3.8261633169061993], "isController": false}, {"data": ["Login-5", 926, 285, 30.77753779697624, 29320.600431965468, 4384, 74176, 33233.0, 56115.9, 57724.799999999996, 61350.27000000002, 3.7826797385620914, 59.21024497038398, 1.649325501685049], "isController": false}, {"data": ["Login-6", 926, 273, 29.481641468682504, 30003.435205183534, 4224, 77284, 34612.0, 56557.0, 58039.6, 64335.07000000003, 3.80003447115503, 231.3145749057686, 1.6669754600770677], "isController": false}, {"data": ["Logout-4", 2140, 269, 12.570093457943925, 21221.28504672899, 3, 86367, 17019.0, 38705.9, 47300.85, 57235.270000000004, 7.395887333678935, 239.57014374891997, 3.8835192295230687], "isController": false}, {"data": ["Login-7", 926, 275, 29.697624190064793, 29844.85745140392, 4309, 83824, 34534.5, 56260.400000000016, 57987.85, 61519.69000000001, 3.722777690671748, 22.01590761299997, 1.6331948661548852], "isController": false}, {"data": ["Logout-3", 2140, 260, 12.149532710280374, 21341.86121495334, 3, 89038, 17033.0, 38481.6, 48057.29999999994, 57626.91, 7.395682856530665, 555.6358143502167, 3.85133316687287], "isController": false}, {"data": ["Login-8", 926, 317, 34.23326133909287, 29380.33801295899, 66, 95331, 32457.0, 56344.9, 58277.5, 74303.23000000004, 3.855746769875209, 148.8054009862134, 1.584874313481373], "isController": false}, {"data": ["Logout", 3000, 1158, 38.6, 54162.8786666667, 2, 173479, 50074.0, 120639.70000000001, 131850.34999999998, 143449.03999999998, 9.779696047046858, 1511.6609058993572, 18.619821803750842], "isController": false}, {"data": ["Login Welcome-3", 3000, 824, 27.466666666666665, 30650.97666666664, 40, 77175, 28421.0, 57846.3, 58700.95, 64507.73999999995, 17.77209070875098, 486.7111505799626, 7.741967014999645], "isController": false}, {"data": ["Login Welcome-2", 3000, 748, 24.933333333333334, 31823.11066666668, 67, 78340, 31618.0, 57859.5, 58922.6, 64740.99999999991, 17.70517345168258, 1144.437444855762, 7.878364167384709], "isController": false}, {"data": ["Login Welcome", 3000, 989, 32.96666666666667, 74613.36633333344, 1134, 124409, 88999.5, 104535.5, 105970.45, 116083.09999999993, 17.49832307737175, 3482.4373227383417, 33.373625424698886], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 38, 0.33610472315584644, 0.07718086726921905], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3037, 26.861843269060675, 6.1683761551741645], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 10, 0.0884486113568017, 0.02031075454453133], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1719, 15.204316292234212, 3.4914187062049353], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4823, 42.65876525738546, 9.79587691682746], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, 0.00884486113568017, 0.002031075454453133], "isController": false}, {"data": ["Assertion failed", 1678, 14.841676985671326, 3.408144612572357], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 49235, 11306, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4823, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3037, "Test failed: text expected to contain /The electronic survey app/", 1719, "Assertion failed", 1678, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 38], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 373, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 373, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2465, "Test failed: text expected to contain /The electronic survey app/", 1719, "Assertion failed", 391, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 355, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2140, 255, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 188, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 67, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 2864, 219, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 219, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2224, 84, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 56, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 28, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2645, 638, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 637, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2645, 924, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 649, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 275, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 2645, 950, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 661, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 289, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 926, 285, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 285, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 926, 273, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 273, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2140, 269, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 197, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 72, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 926, 275, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 275, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2140, 260, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 192, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 68, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 926, 317, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 268, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 38, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 10, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null], "isController": false}, {"data": ["Logout", 3000, 1158, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 485, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 375, "Assertion failed", 298, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 3000, 824, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 824, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 748, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 748, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 989, "Assertion failed", 989, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
