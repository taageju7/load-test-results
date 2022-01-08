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

    var data = {"OkPercent": 75.00986037706082, "KoPercent": 24.990139622939182};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03682850832215824, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.024508169389796598, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.03434478159386462, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.024196335983408226, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0013256738842244808, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.016418942274455582, 500, 1500, "Login-1"], "isController": false}, {"data": [0.02613240418118467, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.3372863620509243, 500, 1500, "Login-2"], "isController": false}, {"data": [0.17073170731707318, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.002441576560865016, 500, 1500, "Login-3"], "isController": false}, {"data": [3.487966515521451E-4, 500, 1500, "Login-4"], "isController": false}, {"data": [0.002028397565922921, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0015212981744421906, 500, 1500, "Login-6"], "isController": false}, {"data": [8.837825894829872E-4, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.002535496957403651, 500, 1500, "Login-7"], "isController": false}, {"data": [2.209456473707468E-4, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.002535496957403651, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.01567189063021007, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.023674558186062022, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.004833333333333334, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50708, 12672, 24.990139622939182, 27883.942553443056, 0, 134890, 28890.0, 54058.90000000012, 76513.9, 114907.78000000003, 194.56978850108973, 12066.646040204987, 157.0470823812621], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 2999, 504, 16.805601867289095, 26949.837945982, 0, 60972, 30540.0, 50823.0, 52088.0, 54318.0, 20.07765950324697, 1992.3227163461538, 10.064503989673295], "isController": false}, {"data": ["Login Welcome-0", 2999, 0, 0.0, 24378.5931977326, 38, 46459, 26568.0, 41710.0, 43325.0, 45034.0, 28.22907057738286, 72.50239806495793, 14.086967836955703], "isController": false}, {"data": ["Login", 3000, 2447, 81.56666666666666, 72875.67966666674, 0, 134890, 76751.0, 102599.3, 109391.09999999995, 122299.79999999997, 12.38441215323646, 2401.9806714479955, 38.72877798748142], "isController": false}, {"data": ["Login-0", 2893, 0, 0.0, 14949.064293121302, 176, 54587, 4227.0, 39672.6, 41899.999999999985, 48809.85999999996, 15.363781200212426, 5.69275777515932, 11.252769433749336], "isController": false}, {"data": ["Logout-2", 2263, 634, 28.015908086610693, 16189.189129474167, 0, 54418, 9377.0, 39170.8, 42020.6, 51657.76, 9.077526003120775, 782.9439743934945, 3.9372159825930515], "isController": false}, {"data": ["Login-1", 2893, 26, 0.8987210508123056, 33944.44452125822, 0, 54606, 37028.0, 47920.4, 50997.299999999996, 53041.72, 13.168975296222284, 43.38321439301175, 8.006467344423555], "isController": false}, {"data": ["Logout-1", 2296, 33, 1.4372822299651569, 27678.594512195115, 0, 53964, 30647.0, 41504.4, 42630.750000000015, 50947.93000000003, 9.171673271123609, 24.311060309943436, 4.57289309418142], "isController": false}, {"data": ["Login-2", 2867, 646, 22.532263690268575, 15218.75130798743, 0, 50880, 106.0, 40674.4, 41684.4, 42595.64, 11.959985983413706, 643.5499944465535, 5.716660548315507], "isController": false}, {"data": ["Logout-0", 2296, 0, 0.0, 7673.569686411164, 13, 55069, 2068.0, 32390.500000000015, 42129.75, 51295.70000000004, 9.435474259976903, 4.164877310067931, 5.325882931901027], "isController": false}, {"data": ["Login-3", 2867, 893, 31.147540983606557, 23483.071852110228, 0, 59660, 30588.0, 42223.2, 47566.2, 52427.72, 11.92491504485881, 614.6688265389151, 5.200772811027323], "isController": false}, {"data": ["Login-4", 2867, 914, 31.88001395186606, 23236.86989884898, 0, 59363, 30547.0, 42160.600000000006, 47027.4, 52385.16, 11.965326844984956, 652.4966643247436, 5.221429756394793], "isController": false}, {"data": ["Login-5", 986, 289, 29.310344827586206, 22690.564908722128, 0, 60240, 23792.0, 48909.700000000004, 51703.15, 53774.56, 4.962454452116844, 78.01019645041069, 2.209592335436253], "isController": false}, {"data": ["Login-6", 986, 312, 31.643002028397564, 21785.835699797186, 0, 61359, 21796.0, 48609.4, 51566.399999999994, 57561.54, 4.978440223373424, 293.11265507923343, 2.1169751210528442], "isController": false}, {"data": ["Logout-4", 2263, 674, 29.783473265576667, 15811.67918692002, 0, 60739, 9081.0, 38946.40000000001, 41830.99999999997, 51857.6, 9.077307533403129, 240.52960043225514, 3.82799667347565], "isController": false}, {"data": ["Login-7", 986, 318, 32.251521298174445, 21553.803245436105, 0, 76634, 20931.5, 48407.5, 51436.25, 56180.02, 4.961255912247157, 27.679576645365803, 2.0974522303008953], "isController": false}, {"data": ["Logout-3", 2263, 668, 29.51833848873177, 15901.39151568718, 0, 59338, 9181.0, 39380.6, 41964.99999999999, 51651.52000000001, 9.07821789327578, 551.6218103507931, 3.7928482770741905], "isController": false}, {"data": ["Login-8", 986, 415, 42.089249492900606, 19042.395537525335, 0, 72991, 15173.5, 47360.700000000004, 51391.0, 59411.61, 4.996326230712712, 170.19861018299173, 1.8083812612430008], "isController": false}, {"data": ["Logout", 3000, 1521, 50.7, 40559.05333333329, 0, 130962, 35055.0, 85061.0, 104471.05, 123267.3099999999, 11.856442197868212, 1586.204134866289, 21.03366423716639], "isController": false}, {"data": ["Login Welcome-3", 2999, 685, 22.84094698232744, 24702.690230076736, 0, 61245, 26484.0, 50372.0, 52217.0, 58856.0, 20.049069747230636, 577.1679905554107, 9.290867674635487], "isController": false}, {"data": ["Login Welcome-2", 2999, 686, 22.874291430476827, 24448.684228076054, 0, 61383, 25959.0, 50380.0, 52078.0, 57413.0, 20.04357589691493, 1326.3150529097104, 9.163536337335588], "isController": false}, {"data": ["Login Welcome", 3000, 1007, 33.56666666666667, 59938.56766666672, 371, 112703, 71669.0, 85492.4, 89947.6, 92025.94, 19.951716845234532, 3924.375537241542, 38.31226478796313], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 157, 1.23895202020202, 0.3096158397097105], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 9, 0.07102272727272728, 0.01774867870947385], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 50, 0.39457070707070707, 0.09860377060818806], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4705, 37.129103535353536, 9.278614814230496], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3647, 28.779987373737374, 7.192159028161237], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1881, 14.84375, 3.709473850280035], "isController": false}, {"data": ["Assertion failed", 2223, 17.542613636363637, 4.383923641240041], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50708, 12672, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4705, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3647, "Assertion failed", 2223, "Test failed: text expected to contain /The electronic survey app/", 1881, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 157], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 2999, 504, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 489, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 15, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2447, "Test failed: text expected to contain /The electronic survey app/", 1881, "Assertion failed", 433, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 130, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2263, 634, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 547, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 86, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null], "isController": false}, {"data": ["Login-1", 2893, 26, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 26, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2296, 33, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 27, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2867, 646, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 525, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 116, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2867, 893, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 514, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 363, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 16, null, null, null, null], "isController": false}, {"data": ["Login-4", 2867, 914, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 517, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 379, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 16, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null], "isController": false}, {"data": ["Login-5", 986, 289, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 273, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 16, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 986, 312, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 290, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2263, 674, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 578, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 92, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, null, null, null, null], "isController": false}, {"data": ["Login-7", 986, 318, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 302, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2263, 668, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 581, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 83, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, null, null, null, null], "isController": false}, {"data": ["Login-8", 986, 415, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 360, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 50, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Logout", 3000, 1521, "Assertion failed", 784, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 379, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 355, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1], "isController": false}, {"data": ["Login Welcome-3", 2999, 685, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 668, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 17, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 2999, 686, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 665, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 1007, "Assertion failed", 1006, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 1, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
