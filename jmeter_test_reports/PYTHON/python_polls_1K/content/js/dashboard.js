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

    var data = {"OkPercent": 73.25184946928273, "KoPercent": 26.748150530717272};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2348986812479897, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05056179775280899, 500, 1500, "Login-0"], "isController": false}, {"data": [0.3052434456928839, 500, 1500, "Login-1"], "isController": false}, {"data": [0.9587155963302753, 500, 1500, "Login-2"], "isController": false}, {"data": [0.47706422018348627, 500, 1500, "Login-3"], "isController": false}, {"data": [0.41935483870967744, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.38073394495412843, 500, 1500, "Login-4"], "isController": false}, {"data": [0.147247119078105, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.32798165137614677, 500, 1500, "Login-5"], "isController": false}, {"data": [0.3304093567251462, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.28211009174311924, 500, 1500, "Login-6"], "isController": false}, {"data": [0.1497076023391813, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.6440677966101694, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [0.29912390488110135, 500, 1500, "Show New Poll Form-2"], "isController": false}, {"data": [0.05057618437900128, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.12345679012345678, 500, 1500, "Login-7"], "isController": false}, {"data": [0.1280120481927711, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.8771186440677966, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.26677577741407527, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.2717391304347826, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.3103448275862069, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.8497267759562842, 500, 1500, "Show New Poll Form-3"], "isController": false}, {"data": [0.7, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.975, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.16705069124423963, 500, 1500, "Welcome-0"], "isController": false}, {"data": [0.32989690721649484, 500, 1500, "Show New Poll Form-4"], "isController": false}, {"data": [1.0, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.9354838709677419, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.26288659793814434, 500, 1500, "Show New Poll Form-5"], "isController": false}, {"data": [1.0, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.4435483870967742, 500, 1500, "Welcome-2"], "isController": false}, {"data": [1.0, 500, 1500, "Save Poll-5"], "isController": false}, {"data": [0.033, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.001, 500, 1500, "Login"], "isController": false}, {"data": [0.025, 500, 1500, "Polls"], "isController": false}, {"data": [0.046, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.029, 500, 1500, "Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15545, 4158, 26.748150530717272, 12282.784818269556, 1, 172354, 4413.0, 31872.599999999984, 44697.49999999999, 155888.71999999986, 66.41572956899203, 3555.8927571019326, 53.930156705286336], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login-0", 267, 0, 0.0, 7172.632958801499, 732, 33760, 4781.0, 17775.600000000002, 22198.8, 30561.839999999986, 2.0649172873019186, 1.256292451161226, 1.6353983593768127], "isController": false}, {"data": ["Login-1", 267, 49, 18.352059925093634, 13080.344569288383, 12, 47710, 2880.0, 37317.00000000002, 41366.799999999996, 46653.08, 1.8608087200144963, 95.82251545882527, 1.241144878681544], "isController": false}, {"data": ["Login-2", 218, 1, 0.45871559633027525, 244.0688073394497, 78, 708, 181.0, 482.5, 546.3, 661.86, 1.6324818966743797, 9.73014993513131, 0.9346886139067988], "isController": false}, {"data": ["Login-3", 218, 49, 22.477064220183486, 2109.0183486238543, 3, 18340, 1390.0, 4605.0, 4710.9, 16032.040000000003, 1.6013163113899131, 68.13744658453187, 0.8546661406991435], "isController": false}, {"data": ["Welcome-3", 434, 76, 17.51152073732719, 2819.214285714286, 3, 24720, 1594.5, 6254.5, 10064.0, 17380.84999999996, 4.432053756522983, 210.48974305704482, 2.1992726427907643], "isController": false}, {"data": ["Login-4", 218, 62, 28.440366972477065, 2611.376146788991, 5, 22996, 1966.5, 4664.4, 6440.649999999998, 15119.900000000001, 1.6059168459203819, 176.38743987020067, 0.7979226673689483], "isController": false}, {"data": ["Save Poll-0", 781, 0, 0.0, 4741.436619718299, 3, 31954, 3408.0, 10399.800000000007, 12071.999999999998, 17780.15999999999, 3.7677593651253103, 1.1627069915816388, 3.057158622186844], "isController": false}, {"data": ["Login-5", 218, 83, 38.07339449541284, 2693.4357798165156, 2, 14865, 2939.5, 4638.2, 4949.2, 8785.980000000001, 1.601681030365815, 22.676652720837282, 0.6915945496925213], "isController": false}, {"data": ["Show New Poll Form-0", 855, 0, 0.0, 8740.270175438623, 1, 37498, 7540.0, 23676.999999999996, 27881.39999999998, 34064.439999999995, 4.145153079776016, 1.1901123100138173, 2.4377488455385063], "isController": false}, {"data": ["Login-6", 218, 87, 39.908256880733944, 2942.1376146789003, 4, 20027, 3175.5, 4694.6, 5800.899999999997, 14781.050000000001, 1.6016692626443707, 20.550036838852236, 0.6651571041011549], "isController": false}, {"data": ["Show New Poll Form-1", 855, 56, 6.549707602339181, 7695.326315789468, 3, 82057, 6461.0, 17489.399999999998, 22573.999999999996, 30561.599999999988, 4.122965641952984, 71.8985599382158, 2.4256988396624473], "isController": false}, {"data": ["Save Poll-2", 59, 0, 0.0, 1063.7796610169491, 53, 6581, 248.0, 3411.0, 3684.0, 6581.0, 0.29178886355656003, 12.876646992040099, 0.18421297063318184], "isController": false}, {"data": ["Show New Poll Form-2", 799, 0, 0.0, 7385.188986232797, 7, 41062, 4898.0, 18743.0, 25767.0, 32178.0, 3.854838087151183, 148.30760388221756, 2.164487703657513], "isController": false}, {"data": ["Save Poll-1", 781, 5, 0.6402048655569782, 18486.74519846348, 7, 169329, 5971.0, 42199.600000000006, 60334.7, 162530.13999999998, 3.4829065546428346, 50.98752584447105, 2.23080586391468], "isController": false}, {"data": ["Login-7", 81, 43, 53.08641975308642, 4294.925925925927, 25, 22824, 4009.0, 6096.199999999999, 14873.199999999993, 22824.0, 0.6607067114750889, 11.731853570365264, 0.21447637208799633], "isController": false}, {"data": ["Polls-0", 664, 0, 0.0, 34134.3388554217, 2, 169159, 15913.5, 150618.0, 162670.25, 168323.2, 3.236687659640845, 18.067624882401972, 1.7905327799929807], "isController": false}, {"data": ["Polls-2", 472, 8, 1.694915254237288, 487.3156779661019, 3, 6297, 136.0, 704.3999999999999, 3198.249999999992, 4854.799999999997, 2.3150873062585835, 263.64949185029184, 1.2895769340420835], "isController": false}, {"data": ["Polls-1", 611, 2, 0.32733224222585927, 9794.531914893612, 2, 39623, 9549.0, 21854.800000000003, 26610.2, 34811.31999999999, 3.0046717482173593, 40.39447650295058, 1.6380077068477994], "isController": false}, {"data": ["Polls-4", 368, 50, 13.58695652173913, 3179.6086956521744, 2, 22709, 2737.0, 6173.700000000002, 8171.750000000001, 17899.56, 1.8057893213078233, 83.72770442099427, 0.9483566259096419], "isController": false}, {"data": ["Polls-3", 377, 39, 10.344827586206897, 3085.1140583554384, 3, 30681, 2543.0, 5919.999999999998, 9361.699999999997, 21239.739999999878, 1.8482657188380929, 138.0863205126241, 1.0033781713445276], "isController": false}, {"data": ["Show New Poll Form-3", 183, 0, 0.0, 612.6284153005462, 13, 8284, 119.0, 2322.9999999999995, 3602.599999999999, 6668.679999999993, 1.2667866537449812, 136.60532246166758, 0.7193546223868198], "isController": false}, {"data": ["Polls-6", 5, 0, 0.0, 527.8, 417, 696, 510.0, 696.0, 696.0, 696.0, 0.531575590048905, 9.015085949128215, 0.34220178609398255], "isController": false}, {"data": ["Save Poll-4", 20, 0, 0.0, 117.89999999999996, 34, 724, 88.0, 138.20000000000002, 694.7499999999995, 724.0, 4.81811611659841, 734.0334030956396, 3.3453911708022166], "isController": false}, {"data": ["Welcome-0", 434, 0, 0.0, 11199.341013824887, 5, 38435, 4515.0, 31077.0, 32711.75, 35704.34999999999, 4.663156763726228, 11.639676453207263, 2.331578381863114], "isController": false}, {"data": ["Show New Poll Form-4", 97, 11, 11.34020618556701, 2559.041237113403, 31, 20926, 1703.0, 4711.0, 6271.0, 20926.0, 0.6912327459042678, 52.242053996768306, 0.3668694416335896], "isController": false}, {"data": ["Save Poll-3", 22, 0, 0.0, 93.95454545454544, 18, 475, 63.5, 335.99999999999983, 464.9499999999999, 475.0, 0.7291528569534668, 36.760302132357815, 0.5023930506761235], "isController": false}, {"data": ["Polls-5", 18, 0, 0.0, 540.4444444444445, 261, 1544, 530.5, 710.6000000000013, 1544.0, 1544.0, 1.1866306282549937, 28.803475632869667, 0.7631466724899466], "isController": false}, {"data": ["Welcome-1", 434, 0, 0.0, 252.55990783410186, 71, 1649, 109.0, 542.0, 1202.5, 1645.3, 4.642356691304673, 661.9079348933542, 2.5025204039064257], "isController": false}, {"data": ["Show New Poll Form-5", 97, 18, 18.556701030927837, 3155.3711340206196, 37, 14880, 2518.0, 5965.800000000002, 9984.599999999999, 14880.0, 0.6938781349700274, 32.561828420300586, 0.33995334206046035], "isController": false}, {"data": ["Save Poll-6", 20, 0, 0.0, 59.000000000000014, 13, 450, 43.0, 59.900000000000006, 430.4999999999997, 450.0, 4.84027105517909, 33.67864381655373, 3.346593659244918], "isController": false}, {"data": ["Welcome-2", 434, 59, 13.59447004608295, 2519.5599078341, 4, 21218, 1622.5, 6171.0, 8309.75, 17087.049999999963, 4.246533791254488, 313.09532463906913, 2.1965274771039422], "isController": false}, {"data": ["Save Poll-5", 20, 0, 0.0, 62.5, 16, 409, 50.0, 71.60000000000001, 392.14999999999975, 409.0, 4.839099927413502, 102.10311819501572, 3.3741380353254296], "isController": false}, {"data": ["Save Poll", 1000, 224, 22.4, 22112.530999999984, 10, 172354, 11228.0, 46058.49999999999, 63776.999999999985, 163011.32, 4.447112712071688, 107.99004576356924, 5.924031849665354], "isController": false}, {"data": ["Login", 1000, 908, 90.8, 19537.07099999999, 743, 84878, 8057.5, 54320.799999999996, 61048.95, 65597.31, 6.7440888061613995, 654.7563423940167, 8.128569888570793], "isController": false}, {"data": ["Polls", 1000, 838, 83.8, 33634.68600000003, 23, 170197, 21667.0, 86704.19999999994, 160240.3999999999, 168226.87, 4.8569388657104975, 663.4710965465343, 6.968763394526716], "isController": false}, {"data": ["Show New Poll Form", 1000, 789, 78.9, 21083.702999999983, 13, 82182, 22354.0, 48643.7, 56700.6, 71116.28, 4.820252774055471, 375.55798662409984, 7.989150025246074], "isController": false}, {"data": ["Welcome", 1000, 701, 70.1, 9158.842000000004, 106, 45965, 4438.5, 33159.4, 37630.299999999996, 41758.11, 9.76848686138517, 1144.2317943641935, 8.70176618821432], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /Actions/", 491, 11.808561808561809, 3.1585718880669025], "isController": false}, {"data": ["500/Internal Server Error", 497, 11.952861952861953, 3.1971695078803473], "isController": false}, {"data": ["403/Forbidden", 303, 7.287157287157287, 1.9491798005789642], "isController": false}, {"data": ["Test failed: text expected to contain /Save Poll/", 588, 14.141414141414142, 3.782566741717594], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 0.02405002405002405, 0.0064329366355741395], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 9, 0.21645021645021645, 0.05789642972016726], "isController": false}, {"data": ["Assertion failed", 272, 6.541606541606542, 1.7497587648761659], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1997, 48.027898027898026, 12.846574461241557], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15545, 4158, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1997, "Test failed: text expected to contain /Save Poll/", 588, "500/Internal Server Error", 497, "Test failed: text expected to contain /Actions/", 491, "403/Forbidden", 303], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Login-1", 267, 49, "500/Internal Server Error", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 218, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-3", 218, 49, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-3", 434, 76, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 76, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 218, 62, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 60, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-5", 218, 83, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 80, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 3, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-6", 218, 87, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 83, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 4, null, null, null, null, null, null], "isController": false}, {"data": ["Show New Poll Form-1", 855, 56, "500/Internal Server Error", 55, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-1", 781, 5, "500/Internal Server Error", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 81, 43, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 43, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-2", 472, 8, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-1", 611, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-4", 368, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-3", 377, 39, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 39, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show New Poll Form-4", 97, 11, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show New Poll Form-5", 97, 18, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 18, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Welcome-2", 434, 59, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 59, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll", 1000, 224, "403/Forbidden", 118, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 83, "500/Internal Server Error", 23, null, null, null, null], "isController": false}, {"data": ["Login", 1000, 908, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 381, "500/Internal Server Error", 216, "403/Forbidden", 185, "Assertion failed", 126, null, null], "isController": false}, {"data": ["Polls", 1000, 838, "Test failed: text expected to contain /Actions/", 491, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 242, "500/Internal Server Error", 94, "Assertion failed", 11, null, null], "isController": false}, {"data": ["Show New Poll Form", 1000, 789, "Test failed: text expected to contain /Save Poll/", 588, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 146, "500/Internal Server Error", 55, null, null, null, null], "isController": false}, {"data": ["Welcome", 1000, 701, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 566, "Assertion failed", 135, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
