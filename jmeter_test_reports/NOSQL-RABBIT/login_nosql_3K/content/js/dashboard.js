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

    var data = {"OkPercent": 86.31036407209218, "KoPercent": 13.689635927907817};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1528183579002659, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.21522264411460132, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.3334483948912668, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [3.333333333333333E-4, 500, 1500, "Login"], "isController": false}, {"data": [0.03937007874015748, 500, 1500, "Login-0"], "isController": false}, {"data": [0.09880868955851436, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "Login-1"], "isController": false}, {"data": [0.12871114215857493, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.46293103448275863, 500, 1500, "Login-2"], "isController": false}, {"data": [0.28309465595529165, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.1260344827586207, 500, 1500, "Login-3"], "isController": false}, {"data": [0.12862068965517243, 500, 1500, "Login-4"], "isController": false}, {"data": [0.12847705146036162, 500, 1500, "Login-5"], "isController": false}, {"data": [0.12482614742698192, 500, 1500, "Login-6"], "isController": false}, {"data": [0.09898388227049755, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.12917246175243394, 500, 1500, "Login-7"], "isController": false}, {"data": [0.09407848633496846, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.103442280945758, 500, 1500, "Login-8"], "isController": false}, {"data": [0.019, 500, 1500, "Logout"], "isController": false}, {"data": [0.21884708318950638, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.21798412150500518, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.13683333333333333, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60922, 8340, 13.689635927907817, 11903.677095302184, 1, 89446, 7722.0, 35999.50000000001, 59725.600000000035, 70397.96, 295.4983096227815, 21343.571883814155, 269.56185890867596], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 2897, 12, 0.41422160856057993, 8878.492578529507, 2, 36560, 8016.0, 19120.2, 23629.7, 36486.02, 15.7007056375126, 1858.2626235763275, 9.421101896400815], "isController": false}, {"data": ["Login Welcome-0", 2897, 0, 0.0, 7919.315843976527, 3, 40144, 4577.0, 14623.000000000407, 36231.2, 38090.06, 17.568649330487094, 45.17407586637942, 8.767167781131745], "isController": false}, {"data": ["Login", 3000, 1731, 57.7, 41539.362, 2, 89446, 46206.5, 70277.5, 70741.75, 73556.47999999998, 14.728046619176899, 4396.012818616741, 67.41849637076385], "isController": false}, {"data": ["Login-0", 2921, 0, 0.0, 14175.469017459796, 339, 43090, 10452.0, 36553.0, 38872.0, 39981.12, 15.012051784126593, 6.436433062168191, 10.985037012982007], "isController": false}, {"data": ["Logout-2", 2854, 360, 12.613875262789067, 6025.3265592151365, 1, 38507, 4059.0, 16480.5, 18215.25, 25600.69999999983, 14.813200045674899, 1543.1293663645895, 7.799676236985249], "isController": false}, {"data": ["Login-1", 2921, 21, 0.7189318726463539, 13202.301609038019, 3, 39204, 12147.0, 31418.200000000008, 35747.8, 38447.36, 14.710622267883403, 68.8293952532307, 8.857640829908744], "isController": false}, {"data": ["Logout-1", 2863, 9, 0.31435557107928747, 10346.358016067063, 2, 38668, 7628.0, 23393.8, 32186.799999999996, 37698.520000000004, 14.864773653577567, 39.466580665604894, 7.497520401421577], "isController": false}, {"data": ["Login-2", 2900, 267, 9.206896551724139, 3454.9251724137916, 2, 37923, 799.0, 10294.5, 17999.9, 22511.989999999998, 14.594132152382869, 94.45114346912585, 7.629552409918977], "isController": false}, {"data": ["Logout-0", 2863, 0, 0.0, 8583.819769472573, 32, 39415, 2841.0, 27921.199999999957, 37001.799999999996, 38171.840000000004, 14.856828536734715, 6.541194066349776, 8.376952780401233], "isController": false}, {"data": ["Login-3", 2900, 430, 14.827586206896552, 10258.193448275886, 2, 40227, 7359.5, 20882.5, 37764.75, 38462.979999999996, 14.34947401755584, 672.5965665095027, 7.593102263505823], "isController": false}, {"data": ["Login-4", 2900, 506, 17.448275862068964, 9927.81551724137, 2, 38801, 6561.5, 21185.700000000026, 37814.9, 38578.99, 14.356719935048218, 1802.8086338962157, 7.432706356190221], "isController": false}, {"data": ["Login-5", 2876, 581, 20.201668984700973, 9501.723922114037, 1, 40125, 5401.5, 20488.7, 37770.45, 38515.46, 14.22910039036023, 249.64731444901815, 7.1520577015129545], "isController": false}, {"data": ["Login-6", 2876, 655, 22.774687065368568, 8946.006954102915, 1, 40149, 4789.5, 19801.600000000006, 37536.8, 38473.99, 14.231776052414107, 943.8503116989677, 6.83688466651079], "isController": false}, {"data": ["Logout-4", 2854, 483, 16.923615977575334, 5725.392431674833, 2, 38867, 3736.0, 16498.0, 18219.75, 26348.749999999894, 14.813353818045924, 457.70921340066127, 7.39105000317911], "isController": false}, {"data": ["Login-7", 2876, 686, 23.85257301808067, 8563.796940194721, 1, 40017, 4267.5, 19382.4, 37385.9, 38504.3, 14.22994522757522, 86.73832290063777, 6.761753945272106], "isController": false}, {"data": ["Logout-3", 2854, 430, 15.066573230553608, 5934.4302733006325, 1, 38643, 3824.0, 16677.5, 18463.75, 24102.249999999927, 14.812969393104236, 1077.0758905979944, 7.457778949908911], "isController": false}, {"data": ["Login-8", 2876, 1131, 39.325452016689844, 6356.876912378291, 1, 40137, 1548.0, 18055.3, 30282.950000000183, 38486.75, 14.236707538623753, 508.5738168382109, 5.3987862167286265], "isController": false}, {"data": ["Logout", 3000, 895, 29.833333333333332, 25531.7303333333, 1, 82109, 15369.0, 67210.5, 68468.8, 69844.98, 15.550890288469015, 3121.6389423450746, 38.4725836589301], "isController": false}, {"data": ["Login Welcome-3", 2897, 12, 0.41422160856057993, 9420.810148429417, 4, 36560, 8215.0, 20129.2, 20597.2, 36453.06, 15.715610912503594, 574.0265673484043, 9.399478296440254], "isController": false}, {"data": ["Login Welcome-2", 2897, 2, 0.06903693476009665, 9769.434932688999, 5, 36574, 8220.0, 20238.600000000002, 23943.0, 36458.06, 15.720471885479864, 1337.7388853258863, 9.312244828917095], "isController": false}, {"data": ["Login Welcome", 3000, 129, 4.3, 23519.30800000003, 2, 69063, 17779.5, 53376.0, 61332.999999999825, 65387.829999999994, 16.248537631613154, 3807.1122663087926, 35.924247286494214], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 164, 1.9664268585131894, 0.2691966777190506], "isController": false}, {"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, 0.011990407673860911, 0.0016414431568234791], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 71, 0.8513189448441247, 0.11654246413446702], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 0.011990407673860911, 0.0016414431568234791], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5632, 67.52997601918466, 9.244607859229834], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 6, 0.07194244604316546, 0.009848658940940875], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 24, 0.28776978417266186, 0.0393946357637635], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 56, 0.6714628297362111, 0.09192081678211483], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 3, 0.03597122302158273, 0.004924329470470438], "isController": false}, {"data": ["Assertion failed", 2382, 28.56115107913669, 3.9099175995535274], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60922, 8340, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5632, "Assertion failed", 2382, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 164, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 71, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 56], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 2897, 12, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 3000, 1731, "Assertion failed", 1607, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 100, "Test failed: text expected to contain /The electronic survey app/", 24, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 2854, 360, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 359, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 2921, 21, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 21, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 2863, 9, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 2900, 267, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 164, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 56, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 40, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 6, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 2900, 430, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 430, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 2900, 506, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 506, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-5", 2876, 581, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 580, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 2876, 655, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 653, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 2854, 483, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 483, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-7", 2876, 686, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 685, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-3", 2854, 430, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 430, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 2876, 1131, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1063, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 64, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 3, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, null, null], "isController": false}, {"data": ["Logout", 3000, 895, "Assertion failed", 749, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 146, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 2897, 12, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 2897, 2, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 3000, 129, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 103, "Assertion failed", 26, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
