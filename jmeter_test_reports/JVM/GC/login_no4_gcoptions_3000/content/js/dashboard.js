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

    var data = {"OkPercent": 73.24233839814576, "KoPercent": 26.757661601854238};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03653004219576458, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.013333333333333334, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.017166666666666667, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.026633165829145728, 500, 1500, "Login-0"], "isController": false}, {"data": [0.004521656354117087, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.018090452261306532, 500, 1500, "Login-1"], "isController": false}, {"data": [0.029809035863996275, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.33310901749663524, 500, 1500, "Login-2"], "isController": false}, {"data": [0.22775966464834654, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0011776581426648722, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0011776581426648722, 500, 1500, "Login-4"], "isController": false}, {"data": [0.002002002002002002, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [9.519276534983341E-4, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0016658733936220848, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.009, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.008333333333333333, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50479, 13507, 26.757661601854238, 31425.60036847005, 0, 147502, 27919.5, 57418.10000000001, 86805.90000000002, 132146.61000000022, 178.12429426377597, 10694.483818185146, 140.5132882963351], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 3000, 539, 17.966666666666665, 29972.946666666696, 0, 65837, 37161.5, 52753.7, 54142.149999999994, 58892.77, 19.291115798137767, 1888.1600575839807, 9.535268228898735], "isController": false}, {"data": ["Login Welcome-0", 3000, 0, 0.0, 28606.397666666708, 42, 51719, 31534.0, 46012.4, 48061.549999999996, 49515.99, 27.017534379812496, 69.39073771377625, 13.482382878988464], "isController": false}, {"data": ["Login", 3000, 2498, 83.26666666666667, 85957.90933333304, 0, 147502, 87444.0, 114948.9, 130101.04999999997, 138642.99999999997, 11.453004504848439, 2082.0570938239675, 34.9340013159025], "isController": false}, {"data": ["Login-0", 2985, 0, 0.0, 19432.43517587943, 190, 61026, 6441.0, 46003.2, 49491.59999999999, 55585.96, 14.713711108482196, 5.438408362169249, 10.776643878282858], "isController": false}, {"data": ["Logout-2", 2101, 530, 25.226082817705855, 17500.847691575425, 0, 65985, 10492.0, 44105.799999999996, 49603.9, 52507.84, 8.481281436448922, 759.0203851557895, 3.8211740062953634], "isController": false}, {"data": ["Login-1", 2985, 13, 0.4355108877721943, 38835.01507537681, 1, 58363, 42712.0, 51025.4, 52518.5, 55186.939999999995, 12.63048325879162, 41.44505002607549, 7.716018519155175], "isController": false}, {"data": ["Logout-1", 2147, 46, 2.1425244527247322, 30122.48253376806, 0, 56360, 33014.0, 49670.4, 50377.6, 52325.28, 8.332524789940427, 22.099601984408046, 4.124776538819785], "isController": false}, {"data": ["Login-2", 2972, 779, 26.21130551816958, 16688.25403768504, 0, 53840, 112.0, 49079.50000000001, 51126.09999999999, 52486.78, 11.649922190122654, 587.3573472821911, 5.296506683172683], "isController": false}, {"data": ["Logout-0", 2147, 0, 0.0, 9415.565440149046, 19, 63031, 2064.0, 41225.200000000004, 49547.8, 53693.28, 8.513557453625499, 3.7579374697643804, 4.805504109565955], "isController": false}, {"data": ["Login-3", 2972, 1112, 37.41588156123822, 25300.323014804795, 0, 66223, 32388.0, 50298.0, 51967.4, 54371.78, 11.597550934398914, 550.8468683722357, 4.600564707466216], "isController": false}, {"data": ["Login-4", 2972, 1141, 38.39165545087483, 24847.34017496633, 0, 71655, 31861.0, 50258.0, 51897.75, 53912.77, 11.660251958741854, 560.797074049662, 4.605069409297599], "isController": false}, {"data": ["Login-5", 999, 394, 39.43943943943944, 23299.981981981982, 0, 66600, 27115.0, 50259.0, 52113.0, 58845.0, 4.519053305829986, 62.280690454743876, 1.7238406143130496], "isController": false}, {"data": ["Login-6", 999, 408, 40.84084084084084, 22809.379379379363, 0, 65749, 25312.0, 50230.0, 52051.0, 60014.0, 4.519298626567505, 231.58679239641577, 1.6631541659315456], "isController": false}, {"data": ["Logout-4", 2101, 554, 26.368396001903854, 17428.224178962406, 1, 64380, 10438.0, 43914.99999999999, 49848.2, 52633.96, 8.480494056388624, 234.58788112524974, 3.750253063886254], "isController": false}, {"data": ["Login-7", 999, 410, 41.04104104104104, 22859.903903903927, 0, 86921, 25380.0, 50013.0, 52059.0, 59172.0, 4.507349822683836, 23.14404393368917, 1.6583338808665482], "isController": false}, {"data": ["Logout-3", 2101, 565, 26.89195621132794, 17208.433603046145, 0, 64752, 10194.0, 43913.6, 49590.799999999996, 52462.38, 8.479433036290843, 533.6153428714342, 3.67469004261914], "isController": false}, {"data": ["Login-8", 999, 486, 48.648648648648646, 20756.47947947948, 0, 86900, 17820.0, 49648.0, 51716.0, 62525.0, 4.564311561095069, 138.96969104659343, 1.4648972915676741], "isController": false}, {"data": ["Logout", 3000, 1556, 51.86666666666667, 41881.71600000013, 0, 146622, 36570.0, 91851.80000000002, 124168.34999999998, 138235.88999999998, 11.547210771238207, 1489.5356334294638, 19.479708543588796], "isController": false}, {"data": ["Login Welcome-3", 3000, 762, 25.4, 26796.46033333334, 0, 67363, 28595.5, 51847.7, 53698.899999999994, 59611.619999999995, 19.29024749387535, 538.3382931205351, 8.642746726284248], "isController": false}, {"data": ["Login Welcome-2", 3000, 681, 22.7, 28164.59133333328, 0, 66302, 32294.5, 52493.1, 53911.45, 60450.66999999999, 19.232495223930353, 1275.4602488865187, 8.81259601222225], "isController": false}, {"data": ["Login Welcome", 3000, 1033, 34.43333333333333, 68521.00833333317, 2211, 108526, 81187.0, 94972.6, 96991.29999999999, 103227.68, 18.983376889636975, 3695.5091682789357, 36.060011991166405], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 193, 1.428888724365144, 0.38233720953267697], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 21, 0.15547493892055972, 0.04160145803205293], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 34, 0.2517213296809062, 0.06735474157570474], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4976, 36.840156955652624, 9.857564531785496], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4123, 30.52491300806989, 8.167752926959725], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1973, 14.607240690012587, 3.9085560332019256], "isController": false}, {"data": ["Assertion failed", 2187, 16.19160435329829, 4.332494700766656], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50479, 13507, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 4976, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4123, "Assertion failed", 2187, "Test failed: text expected to contain /The electronic survey app/", 1973, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 193], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 3000, 539, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 517, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 20, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 2498, "Test failed: text expected to contain /The electronic survey app/", 1973, "Assertion failed", 497, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 28, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2101, 530, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 446, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 83, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Login-1", 2985, 13, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2147, 46, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 28, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 18, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2972, 779, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 714, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 63, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2972, 1112, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 705, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 379, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 27, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-4", 2972, 1141, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 709, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 411, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 20, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-5", 999, 394, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 369, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 24, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Login-6", 999, 408, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 391, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 17, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2101, 554, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 466, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 85, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, null, null, null, null], "isController": false}, {"data": ["Login-7", 999, 410, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 398, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2101, 565, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 476, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 84, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Login-8", 999, 486, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 443, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 34, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 1, null, null], "isController": false}, {"data": ["Logout", 3000, 1556, "Assertion failed", 657, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 589, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 308, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 2, null, null], "isController": false}, {"data": ["Login Welcome-3", 3000, 762, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 728, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 29, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 5, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 3000, 681, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 648, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 28, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 5, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 1033, "Assertion failed", 1033, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
