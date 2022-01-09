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

    var data = {"OkPercent": 92.01227066249778, "KoPercent": 7.987729337502213};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.08698601852398088, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.036072144288577156, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.028056112224448898, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.03406813627254509, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.03557114228456914, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.04008016032064128, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.03657314629258517, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.9909819639278558, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [0.06613226452905811, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.036004645760743324, 500, 1500, "Send Email-2"], "isController": false}, {"data": [0.020509977827051, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.002, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [0.03426248548199768, 500, 1500, "Send Email-4"], "isController": false}, {"data": [0.030197444831591175, 500, 1500, "Send Email-3"], "isController": false}, {"data": [0.037209302325581395, 500, 1500, "Send Email-6"], "isController": false}, {"data": [0.031395348837209305, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.029651162790697676, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.0055, 500, 1500, "Send Email"], "isController": false}, {"data": [0.01385809312638581, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 16951, 1354, 7.987729337502213, 21988.99799421852, 3, 164157, 17995.0, 48798.20000000001, 75391.6, 112242.03999999992, 68.24101546302522, 5383.51115779829, 68.18141896329091], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 998, 16, 1.6032064128256514, 17191.601202404814, 202, 112151, 17633.0, 25620.1, 29874.949999999986, 90878.08999999998, 4.584479836097955, 32.614888872013545, 2.6105666977504813], "isController": false}, {"data": ["Show Contact Page-5", 998, 12, 1.2024048096192386, 17318.03006012023, 301, 97447, 17867.0, 26404.100000000002, 31392.399999999998, 85619.43, 4.564121795282217, 384.6471443011932, 2.611559521658999], "isController": false}, {"data": ["Show Contact Page-4", 998, 12, 1.2024048096192386, 17113.987975951903, 242, 108095, 17958.5, 26012.5, 29985.55, 84324.29999999999, 4.5016599307159355, 94.99001007432476, 2.5999232197468607], "isController": false}, {"data": ["Show Contact Page-3", 998, 10, 1.002004008016032, 16926.97795591183, 287, 97801, 17801.5, 26107.100000000002, 30007.949999999993, 52560.12999999995, 4.5848378768249765, 692.6658879433809, 2.642686497353841], "isController": false}, {"data": ["Show Contact Page-7", 998, 132, 13.226452905811623, 15890.404809619256, 3, 102892, 15378.5, 26540.300000000003, 30409.249999999996, 46338.52999999964, 4.4254851183085595, 221.21784781685676, 2.2238371045664977], "isController": false}, {"data": ["Show Contact Page-2", 998, 8, 0.8016032064128257, 16756.730460921837, 155, 105519, 17579.5, 25937.4, 30030.449999999986, 44055.729999999945, 4.605636597735947, 249.00175574031687, 2.644138139101301], "isController": false}, {"data": ["Show Contact Page-1", 998, 0, 0.0, 135.86172344689362, 81, 1222, 115.0, 144.0, 167.04999999999995, 1105.06, 6.929929936880699, 41.37655433016464, 3.654455240151931], "isController": false}, {"data": ["Show Contact Page-0", 998, 0, 0.0, 12938.826653306616, 129, 49067, 13663.0, 22433.5, 24349.95, 33504.24, 6.85920081375689, 40.83367984439649, 3.449695721762499], "isController": false}, {"data": ["Send Email-2", 861, 110, 12.775842044134727, 22532.859465737507, 177, 100348, 16846.0, 60786.4, 81543.19999999998, 87583.26, 3.9510274506924628, 189.37336628628657, 2.159051082287833], "isController": false}, {"data": ["Send Email-1", 902, 41, 4.545454545454546, 19398.38359201774, 60, 90794, 18591.5, 28751.700000000008, 39439.399999999936, 84243.90000000001, 4.254094920082441, 24.605233506539136, 2.532915661507044], "isController": false}, {"data": ["Show Contact Page", 1000, 164, 16.4, 37398.19399999998, 720, 132554, 36642.5, 55888.6, 66479.44999999998, 121766.85, 4.398504508467121, 1666.0998408978448, 19.327737553606774], "isController": false}, {"data": ["Send Email-4", 861, 104, 12.07897793263647, 21778.45760743323, 120, 96488, 16838.0, 60534.4, 80522.59999999999, 86249.54, 4.025433634110991, 76.61874970779373, 2.2392360340011224], "isController": false}, {"data": ["Send Email-3", 861, 113, 13.124274099883856, 22532.944250871074, 204, 100199, 16871.0, 60798.4, 82702.2, 89964.86, 3.9510637126232124, 524.5483423085042, 2.161679055805907], "isController": false}, {"data": ["Send Email-6", 860, 107, 12.44186046511628, 21932.503488372087, 72, 96844, 16776.0, 60715.5, 79813.7, 88139.99, 3.983288714324092, 26.163992915477856, 2.1861137373669535], "isController": false}, {"data": ["Send Email-5", 860, 113, 13.13953488372093, 22844.398837209304, 233, 113604, 17160.5, 60779.1, 82530.59999999999, 92974.22999999997, 3.643558315998187, 270.40478714840725, 1.9775604735354804], "isController": false}, {"data": ["Send Email-7", 860, 117, 13.604651162790697, 23527.674418604645, 223, 105506, 17144.5, 60841.2, 83099.49999999999, 92177.53999999998, 3.874938609257499, 192.63807337686256, 2.0988928123268105], "isController": false}, {"data": ["Send Email", 1000, 295, 29.5, 68538.909, 510, 164157, 63208.0, 124396.49999999996, 139322.49999999997, 153017.6, 4.07229131543154, 1180.7358644723633, 16.607269275427385], "isController": false}, {"data": ["Send Email-0", 902, 0, 0.0, 21022.54878048781, 132, 61396, 21771.0, 32376.8, 36034.95, 43581.36, 4.243887061790431, 1.5708825738328134, 3.3316549806860793], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 9, 0.6646971935007385, 0.05309421273081234], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 122, 9.010339734121123, 0.7197215503510117], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 7, 0.51698670605613, 0.041295498790631824], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 155.758; received: 38.363)", 1, 0.07385524372230429, 0.00589935697009026], "isController": false}, {"data": ["Assertion failed", 317, 23.412112259970456, 1.8700961595186125], "isController": false}, {"data": ["Test failed: text expected to contain /Thankyou for your feedback!/", 1, 0.07385524372230429, 0.00589935697009026], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 13.79.73.31:8082 [/13.79.73.31] failed: Connection timed out: connect", 19, 1.4032496307237814, 0.11208778243171494], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 155.758; received: 69.023)", 1, 0.07385524372230429, 0.00589935697009026], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.658; received: 41.270)", 1, 0.07385524372230429, 0.00589935697009026], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 155.758; received: 81.595)", 1, 0.07385524372230429, 0.00589935697009026], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 840, 62.0384047267356, 4.955459854875818], "isController": false}, {"data": ["500", 23, 1.6986706056129985, 0.13568521031207598], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.658; received: 18.802)", 1, 0.07385524372230429, 0.00589935697009026], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 3, 0.22156573116691286, 0.017698070910270782], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 58.072; received: 39.810)", 1, 0.07385524372230429, 0.00589935697009026], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.658; received: 958)", 1, 0.07385524372230429, 0.00589935697009026], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 6, 0.4431314623338257, 0.035396141820541564], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 16951, 1354, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 840, "Assertion failed", 317, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 122, "500", 23, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 13.79.73.31:8082 [/13.79.73.31] failed: Connection timed out: connect", 19], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 998, 16, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 15, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-5", 998, 12, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 9, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, "500", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.658; received: 958)", 1, null, null], "isController": false}, {"data": ["Show Contact Page-4", 998, 12, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 11, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-3", 998, 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 8, "500", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-7", 998, 132, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 121, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 58.072; received: 39.810)", 1, null, null], "isController": false}, {"data": ["Show Contact Page-2", 998, 8, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 6, "500", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-2", 861, 110, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 109, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-1", 902, 41, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 37, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 3, "500", 1, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 1000, 164, "Assertion failed", 162, "500", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 861, 104, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 103, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 861, 113, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 106, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 155.758; received: 69.023)", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 155.758; received: 81.595)", 1, "500", 1], "isController": false}, {"data": ["Send Email-6", 860, 107, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 106, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 860, 113, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 108, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.658; received: 41.270)", 1, "500", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 86.658; received: 18.802)", 1], "isController": false}, {"data": ["Send Email-7", 860, 117, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 115, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email", 1000, 295, "Assertion failed", 155, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 100, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 13.79.73.31:8082 [/13.79.73.31] failed: Connection timed out: connect", 19, "500", 11, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 6], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
