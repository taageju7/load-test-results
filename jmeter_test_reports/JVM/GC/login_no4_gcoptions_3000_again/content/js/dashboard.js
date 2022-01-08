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

    var data = {"OkPercent": 76.03696667458244, "KoPercent": 23.96303332541756};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04269571756510726, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.023833333333333335, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.03816666666666667, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.03245192307692308, 500, 1500, "Login-0"], "isController": false}, {"data": [0.004288939051918736, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.018372252747252748, 500, 1500, "Login-1"], "isController": false}, {"data": [0.039373601789709174, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.3379645710316082, 500, 1500, "Login-2"], "isController": false}, {"data": [0.23825503355704697, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0036470996873914554, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0020840569642236887, 500, 1500, "Login-4"], "isController": false}, {"data": [0.007583417593528817, 500, 1500, "Login-5"], "isController": false}, {"data": [0.00455005055611729, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0013544018058690745, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.006572295247724975, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0036117381489841984, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.006572295247724975, 500, 1500, "Login-8"], "isController": false}, {"data": [1.6666666666666666E-4, 500, 1500, "Logout"], "isController": false}, {"data": [0.021, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.023166666666666665, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.011666666666666667, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50532, 12109, 23.96303332541756, 30266.41162035947, 0, 145454, 32840.5, 58560.80000000005, 84120.70000000001, 126759.51000000008, 152.68125838459773, 9672.447493109144, 124.5231201033194], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 507, 16.9, 28281.15233333337, 0, 64293, 31328.5, 52477.0, 53765.299999999996, 58834.92999999991, 18.670184959298997, 1850.6280183465685, 9.3483475816665], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 25903.10133333337, 12, 55461, 24669.5, 46151.9, 48757.85, 50740.51999999999, 25.699013157894736, 66.0043013723273, 12.824409886410361], "isController": false}, {"data": ["Login", 3000, 2479, 82.63333333333334, 81108.00800000006, 0, 145454, 84339.0, 116787.20000000001, 127019.89999999998, 134150.66, 10.76090348545664, 2060.311900584048, 33.41112359637465], "isController": false}, {"data": ["Login-0", 2912, 0, 0.0, 18827.169299450554, 207, 56094, 5416.5, 45239.200000000004, 48013.75, 53973.61, 14.06308103174335, 5.208421368445962, 10.300108177546397], "isController": false}, {"data": ["Logout-2", 2215, 450, 20.31602708803612, 19194.8681715576, 1, 62309, 13181.0, 42677.600000000006, 46676.2, 53609.480000000054, 6.871818100027611, 654.2159974674713, 3.29934584421759], "isController": false}, {"data": ["Login-1", 2912, 33, 1.1332417582417582, 36503.94814560424, 1, 58671, 40099.0, 51276.3, 53405.149999999994, 55510.799999999996, 12.05881987551919, 39.695696746768924, 7.314215862244962], "isController": false}, {"data": ["Logout-1", 2235, 20, 0.8948545861297539, 29604.976286353507, 1, 55473, 33341.0, 46517.8, 47814.99999999999, 53496.92, 8.14323346486386, 21.58303428128222, 4.082468968724154], "isController": false}, {"data": ["Login-2", 2879, 634, 22.02153525529698, 17088.577631121938, 0, 65640, 129.0, 45500.0, 46793.0, 47690.2, 10.367302844796544, 564.5901039791141, 4.990128876710479], "isController": false}, {"data": ["Logout-0", 2235, 0, 0.0, 8185.402237136483, 22, 57151, 2027.0, 34556.8, 44654.799999999945, 53351.15999999999, 8.098677034905842, 3.574806659938907, 4.571323560718336], "isController": false}, {"data": ["Login-3", 2879, 916, 31.816602987148315, 25294.22091003818, 0, 63366, 33568.0, 46986.0, 50700.0, 55084.799999999996, 10.981340494026822, 563.8416727317848, 4.744574291877088], "isController": false}, {"data": ["Login-4", 2879, 943, 32.75442862104897, 25037.533865925623, 0, 64234, 33439.0, 47010.0, 50397.0, 54584.79999999997, 11.065926632022386, 585.9912363117294, 4.768846175836383], "isController": false}, {"data": ["Login-5", 989, 319, 32.25480283114257, 22881.770475227524, 0, 63414, 22362.0, 52322.0, 54027.0, 58647.900000000016, 4.613755428976623, 69.9295632560331, 1.9687602777350146], "isController": false}, {"data": ["Login-6", 989, 353, 35.69261880687563, 21597.736097067733, 0, 63423, 19959.0, 52275.0, 53823.5, 58804.80000000001, 4.662191465691174, 258.8251682251499, 1.8650496801519807], "isController": false}, {"data": ["Logout-4", 2215, 472, 21.30925507900677, 18962.539051918797, 1, 61646, 13088.0, 42101.200000000026, 46672.799999999996, 53345.600000000006, 8.134978202665629, 239.06238594618245, 3.8446358323294683], "isController": false}, {"data": ["Login-7", 989, 352, 35.591506572295245, 21564.14256825078, 0, 64980, 20329.0, 52284.0, 53836.0, 58598.70000000001, 4.662257399978315, 25.233889962004252, 1.8738735848823123], "isController": false}, {"data": ["Logout-3", 2215, 449, 20.270880361173816, 19255.388261851014, 0, 57857, 13381.0, 42838.8, 46749.399999999994, 53315.24000000002, 8.134589818358098, 556.3977629361555, 3.8445132490065888], "isController": false}, {"data": ["Login-8", 989, 461, 46.612740141557126, 18897.14155712843, 0, 86165, 12594.0, 51676.0, 53588.0, 58143.90000000002, 4.659775162314716, 147.14260063394616, 1.5548289217025848], "isController": false}, {"data": ["Logout", 3000, 1326, 44.2, 43603.91733333332, 0, 141697, 39885.5, 87093.30000000002, 116830.2, 131584.16999999998, 9.198644733009337, 1337.3045677259802, 16.98429139773407], "isController": false}, {"data": ["Login Welcome-3", 3000, 731, 24.366666666666667, 25025.73666666665, 0, 64082, 24696.0, 52417.1, 53913.8, 58374.20999999992, 19.102561653517736, 539.9214250451298, 8.67720804719288], "isController": false}, {"data": ["Login Welcome-2", 3000, 654, 21.8, 26022.05033333335, 0, 63835, 26309.5, 52302.8, 53688.9, 57665.229999999916, 18.86460245994416, 1265.1366880458945, 8.744664363351108], "isController": false}, {"data": ["Login Welcome", 3000, 1010, 33.666666666666664, 62908.59433333333, 39, 105568, 72917.0, 91305.7, 95257.8, 97420.47999999998, 18.6543962193757, 3675.2679261946587, 35.770278397431916], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 0.008258320257659593, 0.001978944035462677], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 219, 1.8085721364274507, 0.4333887437663263], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 14, 0.11561648360723428, 0.02770521649647748], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 53, 0.4376909736559584, 0.10488403387952189], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4554, 37.60839045338178, 9.012111137497032], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3359, 27.73969774547857, 6.647273015119133], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1890, 15.608225286976628, 3.7402042270244595], "isController": false}, {"data": ["Assertion failed", 2019, 16.673548600214716, 3.9954880075991452], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50532, 12109, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4554, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3359, "Assertion failed", 2019, "Test failed: text expected to contain /The electronic survey app/", 1890, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 219], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 507, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 483, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 20, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 4, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2479, "Test failed: text expected to contain /The electronic survey app/", 1890, "Assertion failed", 468, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 120, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2215, 450, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 364, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 82, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, null, null, null, null], "isController": false}, {"data": ["Login-1", 2912, 33, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 32, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2235, 20, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2879, 634, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 599, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 33, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2879, 916, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 593, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 299, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 24, null, null, null, null], "isController": false}, {"data": ["Login-4", 2879, 943, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 595, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 325, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 23, null, null, null, null], "isController": false}, {"data": ["Login-5", 989, 319, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 300, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 989, 353, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 334, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 18, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2215, 472, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 379, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 87, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, null, null, null, null], "isController": false}, {"data": ["Login-7", 989, 352, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 332, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2215, 449, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 362, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 81, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, null, null, null, null], "isController": false}, {"data": ["Login-8", 989, 461, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 401, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 53, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, null, null, null, null], "isController": false}, {"data": ["Logout", 3000, 1326, "Assertion failed", 541, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 467, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 309, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1], "isController": false}, {"data": ["Login Welcome-3", 3000, 731, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 690, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 37, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 654, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 627, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 23, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 4, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 1010, "Assertion failed", 1010, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
