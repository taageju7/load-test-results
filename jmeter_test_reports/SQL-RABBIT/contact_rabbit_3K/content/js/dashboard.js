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

    var data = {"OkPercent": 65.97452934662238, "KoPercent": 34.02547065337763};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.07209941221569129, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.023853894893775623, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.02254938501677227, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.02329481923220276, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.021990309355199404, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.02087215803205367, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.024412970555348492, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.9772642564293701, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [0.03447633246366008, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.0012474012474012475, 500, 1500, "Send Email-2"], "isController": false}, {"data": [0.003551696921862668, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.0018333333333333333, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [0.0010395010395010396, 500, 1500, "Send Email-4"], "isController": false}, {"data": [0.002079002079002079, 500, 1500, "Send Email-3"], "isController": false}, {"data": [0.0012484394506866417, 500, 1500, "Send Email-6"], "isController": false}, {"data": [0.0014565126924677486, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.0012484394506866417, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.0, 500, 1500, "Send Email"], "isController": false}, {"data": [0.10615627466456196, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 46956, 15977, 34.02547065337763, 21366.520146519906, 0, 107507, 23109.0, 51642.9, 70337.0, 89392.71000000021, 239.8406374501992, 13014.973454539215, 177.73405576412299], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 2683, 1082, 40.327991054789415, 17158.534476332497, 23, 55985, 7321.0, 41806.2, 45022.799999999996, 50850.479999999996, 18.660972624081907, 101.7915278693071, 6.415891190984587], "isController": false}, {"data": ["Show Contact Page-5", 2683, 1071, 39.91800223630265, 17266.292582929545, 18, 54451, 7844.0, 41562.399999999994, 44747.799999999996, 50739.079999999994, 18.706771530566712, 978.1568562117393, 6.453875397423025], "isController": false}, {"data": ["Show Contact Page-4", 2683, 995, 37.08535221766679, 18102.41781587771, 25, 55667, 10076.0, 42007.8, 45097.399999999994, 50328.23999999998, 18.855990273316984, 273.2008763304788, 6.904741406573946], "isController": false}, {"data": ["Show Contact Page-3", 2683, 897, 33.4327245620574, 19280.208348863245, 24, 55608, 14258.0, 42709.4, 45135.799999999996, 49605.67999999999, 18.763549898594306, 1923.8984765652317, 7.233200857577453], "isController": false}, {"data": ["Show Contact Page-7", 2683, 1395, 51.99403652627656, 15259.069698099125, 0, 54700, 6307.0, 40001.2, 44570.799999999996, 50807.19999999998, 18.728840180098427, 541.789935342571, 5.189118617151234], "isController": false}, {"data": ["Show Contact Page-2", 2683, 603, 22.474841595229222, 22691.840849794997, 17, 57462, 24545.0, 43636.0, 45634.19999999999, 48654.08, 18.66408815181702, 797.6992344563032, 8.294449816350381], "isController": false}, {"data": ["Show Contact Page-1", 2683, 0, 0.0, 168.18412225121145, 73, 2749, 113.0, 176.5999999999999, 256.7999999999997, 2011.199999999997, 23.137887320299765, 138.1494561292117, 12.20162026656433], "isController": false}, {"data": ["Show Contact Page-0", 2683, 0, 0.0, 25042.593738352578, 12, 59534, 25546.0, 45035.799999999996, 47246.0, 52131.51999999998, 23.132700481967184, 137.7118575567109, 11.588940768798013], "isController": false}, {"data": ["Send Email-2", 2405, 756, 31.434511434511435, 16531.703534303502, 3, 50137, 17084.0, 32492.400000000023, 41892.0, 46495.340000000004, 12.464110617038259, 475.11004586099534, 5.308219510867875], "isController": false}, {"data": ["Send Email-1", 2534, 129, 5.0907655880031575, 25552.09786898183, 3, 51594, 25544.5, 39922.0, 44604.75, 47435.000000000015, 13.665460467775075, 79.30542665634387, 8.055346395694356], "isController": false}, {"data": ["Show Contact Page", 3000, 1882, 62.733333333333334, 51312.35866666671, 1250, 87273, 66335.0, 79287.5, 80420.55, 82436.92, 20.845493204369216, 4822.599397174394, 59.47587671584466], "isController": false}, {"data": ["Send Email-4", 2405, 997, 41.45530145530145, 14766.696881496922, 2, 75422, 14023.0, 31185.200000000008, 41824.69999999999, 46397.960000000014, 12.463400098463453, 169.50013097420518, 4.596233044204908], "isController": false}, {"data": ["Send Email-3", 2405, 920, 38.25363825363825, 15390.999584199588, 3, 49161, 15386.0, 32210.60000000001, 42078.4, 46439.82, 12.464110617038259, 1186.2486847172772, 4.825257493366294], "isController": false}, {"data": ["Send Email-6", 2403, 1073, 44.65251768622555, 14149.637952559278, 2, 78820, 12922.0, 29927.999999999996, 40702.39999999999, 46892.520000000004, 12.458910998890467, 64.35148096198814, 4.303074400256126], "isController": false}, {"data": ["Send Email-5", 2403, 1042, 43.36246358718269, 14365.018726591801, 2, 66066, 13450.0, 30751.599999999995, 41426.59999999999, 46899.08000000001, 12.452390205985232, 614.6011060370514, 4.387292111996373], "isController": false}, {"data": ["Send Email-7", 2403, 1056, 43.94506866416979, 14187.645859342529, 2, 58187, 13097.0, 29318.999999999993, 40068.39999999998, 46714.84, 12.453616368498517, 413.848143731602, 4.363041315118473], "isController": false}, {"data": ["Send Email", 3000, 2079, 69.3, 54940.4063333333, 3045, 107507, 63301.5, 84797.5, 94099.09999999998, 103136.94, 15.53478497268467, 3008.914908417588, 45.76991142745255], "isController": false}, {"data": ["Send Email-0", 2534, 0, 0.0, 16872.59747434886, 26, 53005, 22889.5, 36550.5, 41967.0, 47504.8, 15.166841238964539, 5.584669123148287, 11.87774717566961], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, 0.018776991925893473, 0.006388959877331971], "isController": false}, {"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, 0.006258997308631158, 0.00212965329244399], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 213, 1.3331664267384364, 0.45361615129056987], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4522, 28.30318582963009, 9.630292188431723], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 122, 0.7635976716530012, 0.2598177016781668], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 8067, 50.491331288727544, 17.17991311014567], "isController": false}, {"data": ["Assertion failed", 3047, 19.071164799399135, 6.489053582076838], "isController": false}, {"data": ["Test failed: text expected to contain /Thankyou for your feedback!/", 2, 0.012517994617262315, 0.00425930658488798], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 46956, 15977, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 8067, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4522, "Assertion failed", 3047, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 213, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 122], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 2683, 1082, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1082, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-5", 2683, 1071, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1071, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-4", 2683, 995, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 994, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-3", 2683, 897, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 897, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-7", 2683, 1395, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1066, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 203, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 122, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1], "isController": false}, {"data": ["Show Contact Page-2", 2683, 603, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 603, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-2", 2405, 756, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 553, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 202, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-1", 2534, 129, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 99, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 30, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 3000, 1882, "Assertion failed", 1565, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 317, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 2405, 997, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 771, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 224, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 2405, 920, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 707, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 212, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-6", 2403, 1073, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 832, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 239, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 2403, 1042, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 810, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 231, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Send Email-7", 2403, 1056, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 789, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 265, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null], "isController": false}, {"data": ["Send Email", 3000, 2079, "Assertion failed", 1482, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 565, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 30, "Test failed: text expected to contain /Thankyou for your feedback!/", 2, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
