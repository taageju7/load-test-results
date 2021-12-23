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

    var data = {"OkPercent": 56.41028725400568, "KoPercent": 43.58971274599432};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.24898354424289082, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0015714285714285715, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.005071428571428571, 500, 1500, "Polls"], "isController": false}, {"data": [0.1560319042871386, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.339356295878035, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.3451872329731088, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [0.29958027282266525, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.19641076769690927, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.46832412523020256, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.2532228360957643, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.10814285714285714, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.09407569939659902, 500, 1500, "Save Poll-8"], "isController": false}, {"data": [0.19502762430939227, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.1368452030606239, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [0.5808471454880295, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.6226519337016575, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.05166051660516605, 500, 1500, "Save Poll-9"], "isController": false}, {"data": [0.5659300184162063, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.18735863282231716, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.5734806629834254, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.23196783111334507, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.5384898710865562, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.17863449087698646, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.5449355432780847, 500, 1500, "Polls-7"], "isController": false}, {"data": [0.18172454384932313, 500, 1500, "Save Poll-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 83132, 36237, 43.58971274599432, 3048.8577322811707, 0, 39638, 366.0, 8770.700000000004, 15328.850000000002, 19644.0, 669.0596529633326, 36289.39421152426, 399.03906853612017], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 7000, 6666, 95.22857142857143, 6528.2121428571445, 1, 27705, 4671.0, 17282.0, 18715.95, 20358.869999999995, 66.74294431731502, 8847.734566811476, 123.15784631841153], "isController": false}, {"data": ["Polls", 7000, 6447, 92.1, 6011.946714285718, 1, 39638, 213.0, 20218.300000000003, 29228.9, 37516.649999999994, 56.91519635742743, 9039.174273886596, 75.13538797615661], "isController": false}, {"data": ["Save Poll-0", 4012, 0, 0.0, 3338.597706879362, 10, 9409, 3170.5, 6568.500000000002, 7285.0, 7914.87, 38.4066780903878, 14.183121048166301, 30.379543935655413], "isController": false}, {"data": ["Show New Poll Form-0", 3542, 0, 0.0, 2368.415866741955, 3, 10074, 2268.0, 4857.500000000002, 6362.7, 7736.120000000003, 33.939556543569495, 56.013525936164505, 17.268075155468466], "isController": false}, {"data": ["Save Poll-2", 3979, 1009, 25.35813018346318, 2116.0000000000027, 1, 21547, 376.0, 6775.0, 8613.0, 12251.8, 38.12069477576907, 1380.5409085370381, 17.109552014174305], "isController": false}, {"data": ["Show New Poll Form-1", 1906, 373, 19.5697796432319, 3488.076075550894, 1, 27716, 1134.0, 10269.099999999999, 14878.249999999995, 20194.58, 19.43153087023897, 2178.5221123187853, 8.47070001873318], "isController": false}, {"data": ["Save Poll-1", 4012, 33, 0.8225324027916251, 3765.7604685942115, 3, 10984, 3495.0, 7346.9000000000015, 9891.75, 10684.74, 38.37251563785221, 1544.7522837331665, 23.265246756460776], "isController": false}, {"data": ["Polls-0", 2715, 0, 0.0, 1992.566850828731, 5, 10433, 1199.0, 5325.0, 7505.5999999999985, 8797.84, 22.149704262696307, 666.3384264098511, 11.053221560779114], "isController": false}, {"data": ["Polls-2", 2715, 1002, 36.9060773480663, 10297.800368324126, 1, 36834, 7024.0, 25239.600000000002, 30711.6, 34734.600000000006, 22.56557731307557, 110.92631039045098, 7.508060804464909], "isController": false}, {"data": ["Show New Poll Form", 7000, 3831, 54.72857142857143, 2322.476857142856, 1, 32712, 287.0, 7087.800000000007, 9632.599999999999, 18186.85, 67.00744739915379, 2182.9672752378765, 25.204419455253387], "isController": false}, {"data": ["Save Poll-8", 1823, 1364, 74.82172243554581, 806.8145913329679, 0, 9449, 34.0, 3154.2000000000016, 5625.4, 8078.76, 18.537160753688617, 274.19193457465195, 2.916530027556613], "isController": false}, {"data": ["Polls-1", 2715, 1078, 39.705340699815835, 10292.772744014708, 1, 36935, 6365.0, 27454.4, 31193.199999999997, 35212.200000000004, 22.554142402618442, 1913.876138869967, 7.370521037552855], "isController": false}, {"data": ["Save Poll-7", 3398, 2270, 66.80400235432607, 1013.2719246615643, 0, 10288, 81.0, 4060.2, 6332.3499999999985, 8465.40999999999, 32.56598493415883, 413.23385103194306, 6.748494059798547], "isController": false}, {"data": ["Polls-4", 2715, 645, 23.756906077348066, 703.3337016574583, 2, 9699, 70.0, 2406.2000000000003, 4550.2, 6537.040000000001, 22.609550140737163, 2644.1569045657343, 8.871623270973169], "isController": false}, {"data": ["Polls-3", 2715, 484, 17.826887661141804, 747.2335174953957, 2, 11862, 73.0, 2540.600000000002, 4642.4, 6473.68, 22.625942747614484, 1019.9039950232301, 9.459630804929372], "isController": false}, {"data": ["Save Poll-9", 271, 218, 80.44280442804428, 801.8745387453879, 0, 9089, 35.0, 3162.800000000002, 6319.2, 7917.199999999992, 3.7307782320791865, 49.45697053666075, 0.45602224700229904], "isController": false}, {"data": ["Polls-6", 2715, 727, 26.777163904235728, 642.1635359116033, 0, 11983, 60.0, 2210.8000000000006, 4308.999999999997, 6465.4000000000015, 22.618779835545226, 1424.2825654585613, 8.442795418759841], "isController": false}, {"data": ["Save Poll-4", 3979, 2038, 51.218899220909776, 1426.58557426489, 0, 10419, 170.0, 4982.0, 6854.0, 8834.2, 38.14371716706929, 1554.8116251791432, 11.71892787000556], "isController": false}, {"data": ["Polls-5", 2715, 720, 26.519337016574585, 632.6099447513802, 2, 12042, 55.0, 2214.4, 4282.599999999995, 6463.0, 22.60879702879603, 370.15699458356926, 8.598574016746332], "isController": false}, {"data": ["Save Poll-3", 3979, 1684, 42.32219150540337, 1644.9705956270448, 2, 12404, 244.0, 5734.0, 7711.0, 9076.8, 38.132750656469824, 2005.2263023977919, 13.644275640058076], "isController": false}, {"data": ["Polls-8", 2715, 919, 33.848987108655614, 505.4685082872938, 0, 8633, 31.0, 1549.0, 3679.2, 6717.0, 22.689665546808406, 878.2658914494851, 7.6952713671463675], "isController": false}, {"data": ["Save Poll-6", 3398, 1964, 57.798705120659214, 1223.949970570927, 1, 10500, 135.0, 4620.4, 6400.399999999998, 8668.169999999996, 32.56255210679137, 676.370240164394, 8.568965584362692], "isController": false}, {"data": ["Polls-7", 2715, 901, 33.18600368324125, 481.0493554327816, 0, 8166, 35.0, 1505.0000000000005, 3412.399999999996, 6235.520000000026, 22.684926012884034, 128.3998585717061, 7.755970459463749], "isController": false}, {"data": ["Save Poll-5", 3398, 1864, 54.85579752795762, 1341.0494408475563, 0, 10575, 161.0, 4910.5, 6954.3499999999985, 8879.01, 32.57535087046553, 937.7421933418494, 9.207700291553225], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 15, 0.04139415514529349, 0.018043593321464657], "isController": false}, {"data": ["Test failed: text expected to contain /Add a new Survey/", 581, 1.6033336092943677, 0.6988885146513978], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1620, 4.470568755691696, 1.9487080787181832], "isController": false}, {"data": ["Assertion failed", 5599, 15.451058310566548, 6.7350719337920415], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket is closed", 1, 0.0027596103430195655, 0.0012029062214309772], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 108, 0.2980379170461131, 0.12991387191454554], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 47, 0.1297016861219196, 0.05653659240725593], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 2, 0.005519220686039131, 0.0024058124428619544], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 16, 0.04415376548831305, 0.019246499542895635], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 28239, 77.92863647652952, 33.96886878698937], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, 0.005519220686039131, 0.0024058124428619544], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 4, 0.011038441372078262, 0.004811624885723909], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 3, 0.008278831029058697, 0.0036087186642929318], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 83132, 36237, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 28239, "Assertion failed", 5599, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1620, "Test failed: text expected to contain /Add a new Survey/", 581, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 108], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Save Poll", 7000, 6666, "Assertion failed", 3064, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3021, "Test failed: text expected to contain /Add a new Survey/", 581, null, null, null, null], "isController": false}, {"data": ["Polls", 7000, 6447, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4285, "Assertion failed", 2162, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-2", 3979, 1009, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 969, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 36, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket is closed", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 1], "isController": false}, {"data": ["Show New Poll Form-1", 1906, 373, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 371, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-1", 4012, 33, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 33, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-2", 2715, 1002, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 880, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 72, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 46, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1], "isController": false}, {"data": ["Show New Poll Form", 7000, 3831, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3458, "Assertion failed", 373, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-8", 1823, 1364, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1346, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 2, null, null], "isController": false}, {"data": ["Polls-1", 2715, 1078, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 736, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 325, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 14, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1], "isController": false}, {"data": ["Save Poll-7", 3398, 2270, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2267, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Polls-4", 2715, 645, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 645, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-3", 2715, 484, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 484, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-9", 271, 218, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 215, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null], "isController": false}, {"data": ["Polls-6", 2715, 727, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 726, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-4", 3979, 2038, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2036, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-5", 2715, 720, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 720, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-3", 3979, 1684, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1682, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-8", 2715, 919, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 900, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, null, null, null, null], "isController": false}, {"data": ["Save Poll-6", 3398, 1964, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1964, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-7", 2715, 901, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 884, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 13, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1], "isController": false}, {"data": ["Save Poll-5", 3398, 1864, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1862, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
