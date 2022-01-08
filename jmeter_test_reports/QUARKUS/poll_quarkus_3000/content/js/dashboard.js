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

    var data = {"OkPercent": 86.56767864244995, "KoPercent": 13.432321357550046};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8480843165849131, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6898333333333333, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.5986666666666667, 500, 1500, "Polls"], "isController": false}, {"data": [0.998635477582846, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [1.0, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.8783068783068783, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.6516007532956686, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [0.8280373831775701, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.9997787610619469, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.8942477876106195, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.8003333333333333, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.2356687898089172, 500, 1500, "Save Poll-8"], "isController": false}, {"data": [0.8920353982300885, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.247557003257329, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [0.9376106194690266, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.952212389380531, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.9376106194690266, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.41098901098901097, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.9393805309734513, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.49521988527724664, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.9325221238938053, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.29780564263322884, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.9192477876106194, 500, 1500, "Polls-7"], "isController": false}, {"data": [0.35135135135135137, 500, 1500, "Save Poll-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 37715, 5066, 13.432321357550046, 78.56574307304832, 0, 7362, 8.0, 137.0, 201.0, 1188.9800000000032, 628.7824477751288, 43559.1435171919, 469.60723760440806], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 3000, 927, 30.9, 47.204333333333246, 2, 3596, 19.0, 134.0, 171.89999999999964, 429.8999999999978, 53.74321491911646, 2338.5514985959585, 48.44669162927035], "isController": false}, {"data": ["Polls", 3000, 972, 32.4, 296.0409999999994, 2, 7362, 134.0, 643.4000000000005, 1191.9499999999998, 3702.959999999999, 50.12866356982923, 19224.63027826108, 167.82675142240083], "isController": false}, {"data": ["Save Poll-0", 2565, 0, 0.0, 35.673684210526304, 9, 729, 18.0, 44.0, 131.39999999999964, 393.6800000000003, 46.04282970435656, 516.4309107931393, 32.553719439408354], "isController": false}, {"data": ["Show New Poll Form-0", 2424, 0, 0.0, 8.19966996699666, 0, 339, 1.0, 5.0, 11.0, 318.75, 43.525883895063835, 50.496826237632646, 22.358022391409744], "isController": false}, {"data": ["Show New Poll Form-1", 189, 22, 11.640211640211641, 109.04232804232801, 2, 532, 110.0, 150.0, 168.0, 530.2, 3.4857343095848474, 428.39695557302525, 1.6693291402316446], "isController": false}, {"data": ["Save Poll-2", 531, 185, 34.83992467043314, 40.35781544256126, 1, 477, 11.0, 118.0, 135.39999999999998, 319.91999999999405, 33.92537694863276, 937.7537490216905, 12.507574411417071], "isController": false}, {"data": ["Save Poll-1", 535, 91, 17.009345794392523, 79.00560747663546, 1, 3572, 96.0, 134.0, 152.2, 330.91999999999825, 9.74445840846584, 605.4456624068813, 4.651563040726372], "isController": false}, {"data": ["Polls-0", 2260, 0, 0.0, 13.928761061946899, 2, 676, 5.0, 14.0, 30.0, 242.0, 37.829332797696765, 415.1453299971126, 19.28409347695089], "isController": false}, {"data": ["Polls-2", 2260, 38, 1.6814159292035398, 313.06371681415936, 4, 4498, 133.0, 726.5000000000005, 1274.2999999999975, 3095.3399999999992, 37.99660384337329, 224.7850869634661, 19.700361682274416], "isController": false}, {"data": ["Show New Poll Form", 3000, 598, 19.933333333333334, 15.165000000000001, 0, 537, 1.0, 20.0, 115.0, 303.96999999999935, 53.86866818696019, 493.04901291276866, 23.983288508241905], "isController": false}, {"data": ["Save Poll-8", 157, 120, 76.43312101910828, 13.012738853503185, 2, 111, 9.0, 29.200000000000017, 40.49999999999997, 91.85999999999959, 10.2661348329301, 158.02911513846206, 1.3561913538873995], "isController": false}, {"data": ["Polls-1", 2260, 25, 1.1061946902654867, 356.00088495575295, 3, 7357, 133.0, 899.9000000000001, 1667.9499999999998, 3692.0, 37.942381304143446, 5206.761041038841, 20.33699111984588], "isController": false}, {"data": ["Save Poll-7", 307, 231, 75.2442996742671, 14.47231270358307, 3, 118, 11.0, 25.0, 34.7999999999999, 75.68000000000006, 20.0679827428422, 197.67002579994116, 2.78235410674598], "isController": false}, {"data": ["Polls-4", 2260, 141, 6.238938053097345, 9.561946902654878, 2, 462, 5.0, 14.0, 30.949999999999818, 100.38999999999987, 37.99213260262919, 5432.637084513583, 18.332717598468548], "isController": false}, {"data": ["Polls-3", 2260, 108, 4.778761061946903, 9.283185840707986, 1, 353, 4.0, 14.0, 25.949999999999818, 111.11999999999898, 37.99660384337329, 1960.1830977109569, 18.408414104137595], "isController": false}, {"data": ["Polls-6", 2260, 141, 6.238938053097345, 9.435840707964601, 2, 359, 4.0, 14.0, 27.949999999999818, 113.38999999999987, 37.99277128687904, 3029.1191450575775, 18.159088162982265], "isController": false}, {"data": ["Save Poll-4", 455, 268, 58.9010989010989, 11.61978021978022, 1, 120, 8.0, 22.0, 29.0, 65.03999999999996, 29.069767441860463, 944.7856603788654, 6.723569172469972], "isController": false}, {"data": ["Polls-5", 2260, 137, 6.061946902654867, 9.532300884955747, 1, 355, 4.0, 14.0, 27.0, 111.0, 37.99213260262919, 758.446971766466, 18.471881776804626], "isController": false}, {"data": ["Save Poll-3", 523, 264, 50.478011472275334, 10.19120458891014, 2, 111, 7.0, 21.0, 27.799999999999955, 47.07999999999993, 33.452731226813356, 1298.7992041584048, 9.274782725150313], "isController": false}, {"data": ["Polls-8", 2260, 152, 6.725663716814159, 8.088495575221254, 2, 1029, 4.0, 11.0, 25.0, 88.38999999999987, 38.007466953684705, 2025.4128293069523, 18.1756704912381], "isController": false}, {"data": ["Save Poll-6", 319, 224, 70.21943573667711, 12.943573667711597, 2, 113, 10.0, 24.0, 28.0, 53.2000000000001, 20.380782008688985, 354.28878897265525, 3.3897050896051626], "isController": false}, {"data": ["Polls-7", 2260, 182, 8.053097345132743, 8.377433628318567, 2, 528, 4.0, 12.0, 26.0, 86.38999999999987, 38.005549482889094, 250.45794072668795, 17.881973639956275], "isController": false}, {"data": ["Save Poll-5", 370, 240, 64.86486486486487, 12.762162162162163, 2, 120, 9.0, 25.0, 32.44999999999999, 65.3500000000003, 23.63915154612829, 428.17280489314464, 4.667434672885254], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 0.01973943939992104, 0.0026514649343762427], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 0.01973943939992104, 0.0026514649343762427], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4317, 85.21515988945914, 11.44637412170224], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, 0.01973943939992104, 0.0026514649343762427], "isController": false}, {"data": ["Assertion failed", 746, 14.725621792341098, 1.9779928410446772], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 37715, 5066, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4317, "Assertion failed", 746, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Save Poll", 3000, 927, "Assertion failed", 492, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 435, null, null, null, null, null, null], "isController": false}, {"data": ["Polls", 3000, 972, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 740, "Assertion failed", 232, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show New Poll Form-1", 189, 22, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 22, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-2", 531, 185, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 185, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-1", 535, 91, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 91, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-2", 2260, 38, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 38, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show New Poll Form", 3000, 598, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 576, "Assertion failed", 22, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-8", 157, 120, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 120, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-1", 2260, 25, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 24, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-7", 307, 231, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 231, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-4", 2260, 141, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 141, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-3", 2260, 108, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 108, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-6", 2260, 141, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 141, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-4", 455, 268, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 268, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-5", 2260, 137, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 137, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-3", 523, 264, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 264, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-8", 2260, 152, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 152, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-6", 319, 224, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 224, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-7", 2260, 182, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 180, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null], "isController": false}, {"data": ["Save Poll-5", 370, 240, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 240, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
