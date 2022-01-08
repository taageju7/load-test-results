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

    var data = {"OkPercent": 90.58486556407651, "KoPercent": 9.415134435923497};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6644645662016077, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1285, 500, 1500, "Login"], "isController": false}, {"data": [0.41750629722921917, 500, 1500, "Login-0"], "isController": false}, {"data": [0.9785894206549118, 500, 1500, "Login-1"], "isController": false}, {"data": [0.9685138539042821, 500, 1500, "Login-2"], "isController": false}, {"data": [0.7965994962216625, 500, 1500, "Login-3"], "isController": false}, {"data": [0.8192695214105793, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.7638539042821159, 500, 1500, "Login-4"], "isController": false}, {"data": [0.707808564231738, 500, 1500, "Login-5"], "isController": false}, {"data": [0.6423173803526449, 500, 1500, "Login-6"], "isController": false}, {"data": [0.5, 500, 1500, "Login-7"], "isController": false}, {"data": [0.276, 500, 1500, "Welcome"], "isController": false}, {"data": [0.6064231738035264, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.9389168765743073, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.8520151133501259, 500, 1500, "Welcome-2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10823, 1019, 9.415134435923497, 994.0874064492257, 1, 9650, 221.0, 3387.4000000000015, 4610.0, 5670.120000000008, 162.36123612361237, 12302.3166769802, 163.98207203532854], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login", 1000, 354, 35.4, 2615.9539999999997, 3, 9650, 1988.0, 5440.8, 6489.199999999995, 9192.350000000002, 15.351079180866416, 2889.6468784060207, 58.32629042610758], "isController": false}, {"data": ["Login-0", 794, 0, 0.0, 1180.05919395466, 283, 4384, 720.0, 3310.5, 4077.25, 4322.349999999999, 12.234772023360094, 7.443616182180994, 9.68984385834476], "isController": false}, {"data": ["Login-1", 794, 0, 0.0, 80.41687657430724, 8, 2803, 23.5, 146.0, 311.75, 950.0999999999999, 12.543047613029604, 56.16198565013744, 8.36611476533127], "isController": false}, {"data": ["Login-2", 794, 0, 0.0, 215.30478589420676, 78, 2360, 150.0, 343.0, 574.75, 1234.2999999999643, 12.53908594169483, 74.86715961672088, 7.212423456697514], "isController": false}, {"data": ["Login-3", 794, 47, 5.919395465994962, 604.2972292191433, 2, 4991, 41.5, 2015.0, 4479.25, 4805.599999999999, 12.553359683794465, 640.5278223814229, 8.131098690711463], "isController": false}, {"data": ["Welcome-3", 794, 47, 5.919395465994962, 578.625944584383, 2, 5162, 72.5, 1908.0, 4353.5, 4800.1, 12.052216150576806, 647.9549405642836, 6.82099556010929], "isController": false}, {"data": ["Login-4", 794, 57, 7.178841309823677, 706.4622166246845, 3, 5058, 84.5, 2316.5, 4490.0, 4745.05, 12.55296275216594, 1777.7301014197178, 8.090267279097894], "isController": false}, {"data": ["Login-5", 794, 76, 9.571788413098236, 867.6120906801012, 2, 5246, 120.5, 3006.5, 4531.5, 4782.599999999999, 12.542849470009319, 242.76992327575314, 7.908578088716175], "isController": false}, {"data": ["Login-6", 794, 86, 10.831234256926953, 1024.513853904282, 2, 4995, 289.0, 4313.0, 4581.25, 4792.949999999997, 12.508664692167118, 124.46213369521551, 7.710745252142543], "isController": false}, {"data": ["Login-7", 89, 15, 16.853932584269664, 1473.011235955056, 1, 5247, 796.0, 4573.0, 4658.5, 5247.0, 1.6568311707653072, 48.55635567534486, 0.953219680222276], "isController": false}, {"data": ["Welcome", 1000, 295, 29.5, 2548.503000000001, 114, 8976, 2148.5, 4835.8, 5436.149999999999, 6627.59, 15.157716035347795, 3370.9949287966288, 26.140310240552953], "isController": false}, {"data": ["Welcome-0", 794, 0, 0.0, 876.8073047858944, 4, 4027, 684.0, 2151.5, 2515.25, 3193.0499999999975, 12.81761534239499, 31.993969546056242, 6.408807671197494], "isController": false}, {"data": ["Welcome-1", 794, 0, 0.0, 251.02896725440812, 79, 3062, 150.0, 571.0, 884.25, 2041.299999999997, 12.789330412512284, 1823.5076618699966, 6.894248425494903], "isController": false}, {"data": ["Welcome-2", 794, 42, 5.289672544080605, 495.79471032745676, 2, 5018, 51.0, 1639.0, 4310.75, 4728.449999999999, 12.074760101586143, 972.4948187550374, 6.8459916814939845], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 0.09813542688910697, 0.009239582370876836], "isController": false}, {"data": ["403/Forbidden", 176, 17.271835132482828, 1.6261664972743233], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, 0.19627085377821393, 0.01847916474175367], "isController": false}, {"data": ["Assertion failed", 237, 23.25809617271835, 2.18978102189781], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 603, 59.1756624141315, 5.571468169638733], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10823, 1019, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 603, "Assertion failed", 237, "403/Forbidden", 176, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login", 1000, 354, "403/Forbidden", 176, "Assertion failed", 148, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 30, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 794, 47, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 47, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-3", 794, 47, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 47, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 794, 57, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 57, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 794, 76, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 75, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 794, 86, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 84, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 89, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome", 1000, 295, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 206, "Assertion failed", 89, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Welcome-2", 794, 42, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 42, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
