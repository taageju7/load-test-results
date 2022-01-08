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

    var data = {"OkPercent": 63.22947904779597, "KoPercent": 36.77052095220403};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6021668745521616, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9195046439628483, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.9656002751977985, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.1507, 500, 1500, "Login"], "isController": false}, {"data": [0.9750073507791825, 500, 1500, "Login-0"], "isController": false}, {"data": [0.6140749148694665, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.9998529844163482, 500, 1500, "Login-1"], "isController": false}, {"data": [0.7993396918561996, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.8485739488385768, 500, 1500, "Login-2"], "isController": false}, {"data": [0.9784846884899683, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.8038812114084093, 500, 1500, "Login-3"], "isController": false}, {"data": [0.7728609232578654, 500, 1500, "Login-4"], "isController": false}, {"data": [0.7627168479858865, 500, 1500, "Login-5"], "isController": false}, {"data": [0.7528668038812114, 500, 1500, "Login-6"], "isController": false}, {"data": [0.7490443987062628, 500, 1500, "Login-7"], "isController": false}, {"data": [0.7056748015289621, 500, 1500, "Login-8"], "isController": false}, {"data": [0.31525, 500, 1500, "Logout"], "isController": false}, {"data": [0.8832129342965256, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.22695, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 75362, 27711, 36.77052095220403, 328.9039834399312, 0, 8503, 96.0, 2476.600000000006, 3613.0, 4086.970000000005, 1200.4141446320484, 51992.38315471687, 775.0977184712488], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 2907, 192, 6.604747162022703, 123.62641898864814, 1, 1195, 68.0, 338.2000000000003, 430.5999999999999, 583.9200000000001, 46.5023275158767, 5158.3564524828835, 23.36959224981204], "isController": false}, {"data": ["Login Welcome-0", 2907, 0, 0.0, 145.91812865497067, 0, 8092, 9.0, 245.20000000000027, 459.7999999999997, 3362.0000000000073, 46.42212676258763, 94.34027909467271, 23.165729273127226], "isController": false}, {"data": ["Login", 10000, 7658, 76.58, 770.9553000000014, 2, 8503, 167.0, 2012.8999999999996, 3746.949999999999, 6192.939999999999, 161.2513101668951, 17160.07822263263, 270.67933098343144], "isController": false}, {"data": ["Login-0", 3401, 0, 0.0, 119.87121434872098, 0, 7832, 9.0, 237.0, 387.89999999999964, 2443.98, 54.92482356551089, 10.888417171678428, 35.025302527615835], "isController": false}, {"data": ["Logout-2", 881, 334, 37.911464245175935, 37.59818388195233, 1, 3256, 5.0, 47.80000000000007, 89.59999999999991, 423.73999999999785, 23.651006711409394, 557.8388213087248, 8.781092701342281], "isController": false}, {"data": ["Login-1", 3401, 0, 0.0, 8.030579241399613, 1, 502, 2.0, 9.0, 22.0, 165.82000000000016, 54.936357175163145, 266.84906307545066, 35.99833560989694], "isController": false}, {"data": ["Logout-1", 1363, 268, 19.662509170946443, 20.450476889214983, 1, 3384, 3.0, 20.0, 37.799999999999955, 261.1199999999958, 36.57293120103038, 2863.45584579096, 18.05754937211549], "isController": false}, {"data": ["Login-2", 3401, 41, 1.2055277859453102, 736.5701264334008, 4, 7737, 121.0, 3591.200000000007, 5093.0, 7200.0, 54.86103269724001, 325.41010174535836, 31.175394802639005], "isController": false}, {"data": ["Logout-0", 3788, 0, 0.0, 91.45089757127768, 1, 3988, 5.0, 228.0999999999999, 377.0, 1882.7500000000541, 65.9964806522989, 134.11980101311914, 38.84262583954737], "isController": false}, {"data": ["Login-3", 3401, 593, 17.436048221111438, 134.3793002058223, 2, 2650, 69.0, 364.8000000000002, 477.89999999999964, 674.0, 54.93901946530975, 2476.3255410255633, 29.723088805427672], "isController": false}, {"data": ["Login-4", 3401, 716, 21.05263157894737, 131.46456924433977, 2, 3938, 69.0, 339.0, 435.0, 631.0, 54.93901946530975, 6637.149964537396, 28.675254043494064], "isController": false}, {"data": ["Login-5", 3401, 753, 22.140546897971184, 128.77006762716877, 2, 3938, 64.0, 345.8000000000002, 449.0, 651.0, 54.941682013505215, 933.3564324708814, 28.406796226293174], "isController": false}, {"data": ["Login-6", 3401, 769, 22.61099676565716, 137.2881505439577, 2, 3939, 68.0, 348.0, 472.89999999999964, 706.96, 54.93990695270096, 3640.193462988054, 27.902074179374512], "isController": false}, {"data": ["Login-7", 3401, 777, 22.84622169950015, 136.61423110849748, 2, 3938, 68.0, 359.0, 484.0, 705.9000000000001, 54.93901946530975, 326.62706781055647, 27.899604232291413], "isController": false}, {"data": ["Login-8", 3401, 931, 27.374301675977655, 136.09379594237024, 2, 3935, 67.0, 358.0, 472.89999999999964, 726.96, 54.959438932161206, 2311.8176908268965, 26.31094386291652], "isController": false}, {"data": ["Logout", 10000, 6814, 68.14, 303.32080000000076, 1, 5629, 43.0, 1024.0, 1221.8999999999978, 3566.9699999999993, 174.22513371779013, 2621.848753936399, 56.26626214675854], "isController": false}, {"data": ["Login Welcome-2", 2907, 290, 9.975920192638458, 129.3725490196076, 1, 3983, 67.0, 343.40000000000055, 449.1999999999998, 656.7600000000002, 46.45996483937989, 1534.9048440746365, 22.42383842596292], "isController": false}, {"data": ["Login Welcome", 10000, 7575, 75.75, 680.0487000000013, 2, 8136, 97.0, 3090.5999999999985, 3703.899999999998, 4146.98, 159.53288770480034, 7049.333504623462, 68.83244298194886], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket is closed", 1, 0.0036086752553137745, 0.0013269286908521537], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 2, 0.007217350510627549, 0.0026538573817043074], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, 0.021652051531882648, 0.007961572145112922], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 0.0036086752553137745, 0.0013269286908521537], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 25557, 92.22691350005412, 33.91231655210849], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, 0.0036086752553137745, 0.0013269286908521537], "isController": false}, {"data": ["Assertion failed", 2143, 7.733391072137418, 2.843608184496165], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 75362, 27711, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 25557, "Assertion failed", 2143, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket is closed", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 2907, 192, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 192, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 10000, 7658, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6599, "Assertion failed", 1059, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 881, 334, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 334, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-1", 1363, 268, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 268, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 3401, 41, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 37, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket is closed", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 3401, 593, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 593, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 3401, 716, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 715, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 3401, 753, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 752, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 3401, 769, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 768, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 3401, 777, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 776, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 3401, 931, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 928, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null], "isController": false}, {"data": ["Logout", 10000, 6814, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6212, "Assertion failed", 602, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 2907, 290, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 290, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 10000, 7575, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 7093, "Assertion failed", 482, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
