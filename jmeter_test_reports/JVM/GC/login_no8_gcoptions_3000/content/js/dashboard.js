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

    var data = {"OkPercent": 75.45536981548652, "KoPercent": 24.544630184513483};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03533551490301214, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.016838946315438478, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.021507169056352117, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.023185483870967742, 500, 1500, "Login-0"], "isController": false}, {"data": [0.002076603599446239, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.013272849462365592, 500, 1500, "Login-1"], "isController": false}, {"data": [0.03154788924194281, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.334065562690098, 500, 1500, "Login-2"], "isController": false}, {"data": [0.19133000453926463, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0011828320378506252, 500, 1500, "Login-3"], "isController": false}, {"data": [1.6897600540723216E-4, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.0013844023996308261, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0027688047992616522, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.012170723574524842, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.011670556852284094, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [1.6666666666666666E-4, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50728, 12451, 24.544630184513483, 33725.77207853645, 0, 157546, 32734.5, 67349.80000000005, 93742.85000000002, 140056.61000000007, 164.1948535361709, 10269.560599029981, 132.85832052111994], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 2999, 533, 17.772590863621208, 30824.01267089033, 0, 68601, 37314.0, 54794.0, 56360.0, 58895.0, 18.913856496868714, 1855.5103595777018, 9.370912949117374], "isController": false}, {"data": ["Login Welcome-0", 2999, 0, 0.0, 28342.228076025345, 71, 52033, 31523.0, 46573.0, 47784.0, 49211.0, 26.923180508299595, 69.14840306330852, 13.435298085684659], "isController": false}, {"data": ["Login", 3000, 2472, 82.4, 91619.33733333326, 0, 150635, 93772.0, 126810.1, 136988.59999999998, 146958.85, 10.777449265157586, 2023.6237302536924, 33.3957403310563], "isController": false}, {"data": ["Login-0", 2976, 0, 0.0, 20683.138104838687, 331, 60393, 6624.0, 48066.8, 51250.3, 55935.08, 14.15962888069466, 5.234909338943737, 10.370431634352325], "isController": false}, {"data": ["Logout-2", 2167, 391, 18.0433779418551, 22536.47946469773, 0, 69523, 21125.0, 48407.200000000004, 54687.2, 56589.200000000004, 7.903163453613135, 773.2796830494558, 3.90274541018403], "isController": false}, {"data": ["Login-1", 2976, 17, 0.571236559139785, 41288.55443548386, 0, 60414, 45494.0, 55214.2, 56148.3, 57762.37, 12.127930101392103, 39.82127963849518, 7.398691470562466], "isController": false}, {"data": ["Logout-1", 2203, 36, 1.634135270086246, 33797.57512482965, 0, 58405, 35043.0, 53555.0, 54715.2, 55884.84, 7.863139259301563, 20.854489956695627, 3.9126426487857286], "isController": false}, {"data": ["Login-2", 2959, 720, 24.332544778641434, 18582.478877999307, 0, 58231, 116.0, 53351.0, 55172.0, 56660.8, 10.8298624581848, 567.9192095383034, 5.054806248993507], "isController": false}, {"data": ["Logout-0", 2203, 0, 0.0, 9270.137993645043, 18, 66728, 2263.0, 40113.00000000001, 50809.999999999985, 56468.880000000005, 8.053401767142267, 3.554821873777642, 4.545767794343975], "isController": false}, {"data": ["Login-3", 2959, 1050, 35.48496113551876, 27273.75025346409, 0, 70158, 34132.0, 54531.0, 55641.0, 57039.6, 10.834065612185121, 527.1012434152112, 4.428656588678969], "isController": false}, {"data": ["Login-4", 2959, 1094, 36.9719499831024, 26722.669482933434, 0, 69303, 33814.0, 54454.0, 55678.0, 57083.4, 10.839542533939968, 540.1448637467397, 4.378229093401762], "isController": false}, {"data": ["Login-5", 999, 360, 36.03603603603604, 24615.216216216206, 0, 82718, 27951.0, 52902.0, 55233.0, 58625.0, 4.32435708194635, 62.397751707666536, 1.7422748853439358], "isController": false}, {"data": ["Login-6", 999, 368, 36.83683683683684, 24211.69969969966, 0, 69425, 26980.0, 52788.0, 55083.0, 57581.0, 4.346161543213636, 237.16417955596498, 1.7076906924601276], "isController": false}, {"data": ["Logout-4", 2167, 399, 18.412551915089985, 22328.245962159705, 0, 69568, 20279.0, 47482.40000000001, 54446.6, 56761.00000000001, 7.903278748313213, 240.0528139417466, 3.8726282413654767], "isController": false}, {"data": ["Login-7", 999, 380, 38.03803803803804, 23698.008008008008, 0, 74438, 25085.0, 52801.0, 54986.0, 57718.0, 4.323889163009323, 22.880343454869678, 1.6718627254460228], "isController": false}, {"data": ["Logout-3", 2167, 394, 18.181818181818183, 22301.59944623899, 1, 68302, 20401.0, 47216.4, 54240.799999999974, 56498.16, 7.904114735502132, 554.2622395006948, 3.8334675781292744], "isController": false}, {"data": ["Login-8", 999, 465, 46.546546546546544, 21422.213213213203, 0, 88571, 17305.0, 51598.0, 54857.0, 65071.0, 4.39061051021619, 138.77564691734312, 1.466833090875529], "isController": false}, {"data": ["Logout", 3000, 1301, 43.36666666666667, 49118.479333333315, 0, 157546, 47392.0, 96137.20000000001, 131127.89999999994, 147463.63999999996, 10.289018530522373, 1503.8486053717681, 18.940780240925946], "isController": false}, {"data": ["Login Welcome-3", 2999, 771, 25.70856952317439, 27324.781927309064, 0, 72140, 28205.0, 54713.0, 56385.0, 64556.0, 18.765330129649097, 521.7000832695882, 8.37278788575612], "isController": false}, {"data": ["Login Welcome-2", 2999, 664, 22.140713571190396, 29030.5745248416, 0, 70725, 32466.0, 54777.0, 56670.0, 64267.0, 18.876356403736246, 1260.5966030013185, 8.711989076780004], "isController": false}, {"data": ["Login Welcome", 3000, 1036, 34.53333333333333, 69569.57999999986, 1114, 116071, 82899.5, 97062.8, 100212.34999999999, 106541.56, 18.554826419598847, 3621.7208753490627, 35.283017153937024], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 196, 1.5741707493374026, 0.3863743888976502], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 15, 0.12047225122480122, 0.029569468538085477], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 42, 0.3373223034294434, 0.08279451190663933], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4638, 37.25002007870854, 9.14287967197603], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3626, 29.122158862741948, 7.147926194606529], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1960, 15.741707493374026, 3.863743888976502], "isController": false}, {"data": ["Assertion failed", 1974, 15.854148261183841, 3.8913420596120485], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50728, 12451, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4638, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3626, "Assertion failed", 1974, "Test failed: text expected to contain /The electronic survey app/", 1960, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 196], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 2999, 533, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 514, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 17, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2472, "Test failed: text expected to contain /The electronic survey app/", 1960, "Assertion failed", 471, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 41, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2167, 391, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 306, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 83, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null], "isController": false}, {"data": ["Login-1", 2976, 17, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 17, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2203, 36, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 21, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 15, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2959, 720, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 692, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 25, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2959, 1050, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 707, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 324, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, null, null, null, null], "isController": false}, {"data": ["Login-4", 2959, 1094, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 722, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 351, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 20, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-5", 999, 360, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 347, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 13, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 999, 368, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 344, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 22, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2167, 399, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 309, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 88, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null], "isController": false}, {"data": ["Login-7", 999, 380, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 355, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 4, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2167, 394, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 307, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 83, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, null, null, null, null], "isController": false}, {"data": ["Login-8", 999, 465, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 416, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 42, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, null, null, null, null], "isController": false}, {"data": ["Logout", 3000, 1301, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 568, "Assertion failed", 468, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 263, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1], "isController": false}, {"data": ["Login Welcome-3", 2999, 771, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 733, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 34, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 4, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 2999, 664, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 632, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 31, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 1036, "Assertion failed", 1035, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 1, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
