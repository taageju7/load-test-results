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

    var data = {"OkPercent": 66.43830692699198, "KoPercent": 33.56169307300802};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.05225076918653133, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0759726603575184, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.15168243953732913, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.005217650566487776, 500, 1500, "Login-0"], "isController": false}, {"data": [0.04169313850063532, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.02653548002385212, 500, 1500, "Login-1"], "isController": false}, {"data": [0.05174583202264863, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.2888036809815951, 500, 1500, "Login-2"], "isController": false}, {"data": [0.1359704309531299, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0276840490797546, 500, 1500, "Login-3"], "isController": false}, {"data": [0.025076687116564418, 500, 1500, "Login-4"], "isController": false}, {"data": [0.029487652045705862, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0269074824917066, 500, 1500, "Login-6"], "isController": false}, {"data": [0.03883418043202033, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.029579800958348692, 500, 1500, "Login-7"], "isController": false}, {"data": [0.040898983481575606, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.023129377073350534, 500, 1500, "Login-8"], "isController": false}, {"data": [0.001, 500, 1500, "Logout"], "isController": false}, {"data": [0.07457062740974413, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.07623554153522608, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.0109, 500, 1500, "Login Welcome"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 139108, 46687, 33.56169307300802, 11835.429357046292, 0, 90439, 2365.0, 33257.9, 61015.15000000001, 80681.89000000001, 339.6597737522311, 18742.761637706597, 247.51178062225463], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 5706, 840, 14.721345951629864, 10376.6384507536, 1, 37885, 8005.5, 27870.3, 31803.949999999997, 34124.92000000001, 14.46607849102525, 1471.52578061619, 7.433209304647095], "isController": false}, {"data": ["Login Welcome-0", 5706, 0, 0.0, 10539.441114616167, 4, 33882, 9143.5, 24949.3, 27504.25, 30376.86, 15.568512642254351, 40.03114627642159, 7.7690526954999735], "isController": false}, {"data": ["Login", 10000, 9171, 91.71, 29190.619299999977, 2, 90439, 28587.0, 65267.9, 72634.64999999997, 82006.22999999998, 24.83540336420374, 3822.355316215997, 61.603502571861235], "isController": false}, {"data": ["Login-0", 6708, 0, 0.0, 13172.489862850365, 6, 35562, 11329.5, 27775.1, 29976.0, 32513.1, 16.82581965671114, 7.226811862416065, 12.09849613593095], "isController": false}, {"data": ["Logout-2", 6296, 1403, 22.283989834815756, 8535.4539390089, 2, 37820, 4905.0, 21465.500000000004, 27476.15, 33083.15, 17.24737769182092, 1602.8069182211725, 8.076417807349037], "isController": false}, {"data": ["Login-1", 6708, 188, 2.802623732856291, 13935.122689326163, 2, 38518, 11544.5, 31954.800000000003, 33297.0, 35764.46, 17.14741459524126, 73.6566017258612, 10.12118026353797], "isController": false}, {"data": ["Logout-1", 6358, 62, 0.9751494180559924, 11318.960994023315, 2, 37411, 9680.5, 27006.800000000003, 32301.0, 34951.869999999995, 17.34476192554683, 46.08590374073155, 8.689505692699269], "isController": false}, {"data": ["Login-2", 6520, 1520, 23.312883435582823, 7301.780521472374, 1, 57850, 1877.0, 20222.400000000016, 33171.8, 44496.03999999999, 16.68932011498225, 301.03138932430653, 7.50391225932311], "isController": false}, {"data": ["Logout-0", 6358, 0, 0.0, 10497.364737338763, 2, 38017, 9517.5, 23022.100000000006, 27785.499999999993, 31097.92, 17.346938775510203, 7.480859886568264, 9.67969218937575], "isController": false}, {"data": ["Login-3", 6520, 2011, 30.84355828220859, 7958.724693251523, 1, 37674, 4776.5, 20060.00000000003, 24628.899999999994, 34307.79, 16.645179407972837, 688.0467408708404, 7.181055816877497], "isController": false}, {"data": ["Login-4", 6520, 2316, 35.52147239263804, 7443.432822085905, 2, 37648, 3917.5, 19773.4, 23896.149999999998, 34294.7, 16.645136913909923, 1483.609633045894, 6.760172169943784], "isController": false}, {"data": ["Login-5", 5426, 2016, 37.15444157758938, 6960.848322889789, 2, 37801, 3434.0, 19625.900000000005, 24399.099999999988, 34288.46, 13.850740782339667, 198.97569625036377, 5.482862428461664], "isController": false}, {"data": ["Login-6", 5426, 2167, 39.937338739402875, 6753.9214891264155, 2, 37698, 3116.5, 19450.3, 24355.54999999999, 34169.67999999999, 13.851058995913094, 722.3956157870738, 5.175198661449333], "isController": false}, {"data": ["Logout-4", 6296, 2087, 33.14803049555273, 7554.274459974614, 1, 37791, 3596.5, 20575.7, 27204.199999999997, 32835.12999999998, 17.247661183174216, 437.5408672284849, 6.9249968110934566], "isController": false}, {"data": ["Login-7", 5426, 2225, 41.006266126059714, 6649.926833763358, 1, 41690, 2806.0, 19600.6, 25859.549999999996, 34300.38, 13.852049087209704, 73.46776535746379, 5.099420295670788], "isController": false}, {"data": ["Logout-3", 6296, 1836, 29.161372299872934, 7909.021283354507, 1, 37823, 4346.0, 20885.600000000006, 27027.949999999997, 32995.24999999998, 17.24756668502097, 1053.3679312816237, 7.2424700270109605], "isController": false}, {"data": ["Login-8", 5426, 3095, 57.04017692591228, 5340.678953188333, 0, 37520, 50.0, 18022.4, 22184.749999999993, 31888.439999999944, 14.038228689109895, 365.5851043359136, 3.7692488797358967], "isController": false}, {"data": ["Logout", 10000, 6747, 67.47, 21410.380500000043, 1, 87342, 15362.0, 59550.2, 64592.59999999999, 77760.46999999999, 27.25798318182438, 3156.2780352616082, 40.48611205756886], "isController": false}, {"data": ["Login Welcome-3", 5706, 1446, 25.341745531019978, 9115.072029442688, 2, 37670, 6071.0, 26102.9, 31564.0, 33396.23, 14.458270936746965, 405.25147645526573, 6.482900405546138], "isController": false}, {"data": ["Login Welcome-2", 5706, 1170, 20.50473186119874, 9643.92709428672, 1, 37734, 7103.0, 26249.4, 31615.65, 33624.58, 14.457794692220764, 986.3298719280987, 6.812900813599347], "isController": false}, {"data": ["Login Welcome", 10000, 6387, 63.87, 15485.767400000066, 1, 67893, 6443.5, 48159.799999999996, 58314.85, 61371.899999999994, 25.232899663897776, 2914.088132092022, 27.823559501069877], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 129, 0.2763081800072825, 0.09273370330965869], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 1, 0.002141923876025446, 7.18865917129137E-4], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 16, 0.03427078201640714, 0.011501854674066192], "isController": false}, {"data": ["Test failed: text expected to contain /The electronic survey app/", 1094, 2.343264720371838, 0.786439313339276], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 710, 1.5207659519780667, 0.5103948011616873], "isController": false}, {"data": ["Assertion failed", 9733, 20.847345085355666, 6.996721971417891], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket is closed", 2, 0.004283847752050892, 0.001437731834258274], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 263, 0.5633259793946923, 0.18906173620496305], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 12, 0.025703086512305354, 0.008626391005549645], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Couldn't kickstart handshaking", 2, 0.004283847752050892, 0.001437731834258274], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 34673, 74.2669265534303, 24.92523794461857], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 15, 0.03212885814038169, 0.010782988756937057], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 37, 0.0792511834129415, 0.026598038933778073], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 139108, 46687, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 34673, "Assertion failed", 9733, "Test failed: text expected to contain /The electronic survey app/", 1094, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 710, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 263], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 5706, 840, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 839, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 10000, 9171, "Assertion failed", 4597, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3480, "Test failed: text expected to contain /The electronic survey app/", 1094, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-2", 6296, 1403, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1403, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-1", 6708, 188, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 188, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-1", 6358, 62, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 62, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-2", 6520, 1520, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 710, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 512, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 263, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 16, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 15], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 6520, 2011, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2010, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-4", 6520, 2316, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2312, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 2, null, null, null, null], "isController": false}, {"data": ["Login-5", 5426, 2016, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2015, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login-6", 5426, 2167, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2163, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, null, null, null, null, null, null], "isController": false}, {"data": ["Logout-4", 6296, 2087, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2085, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:8082 failed to respond", 1, null, null, null, null], "isController": false}, {"data": ["Login-7", 5426, 2225, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2219, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null], "isController": false}, {"data": ["Logout-3", 6296, 1836, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1836, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 5426, 3095, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2936, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 115, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 32, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 12, null, null], "isController": false}, {"data": ["Logout", 10000, 6747, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3704, "Assertion failed", 3043, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-3", 5706, 1446, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1445, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome-2", 5706, 1170, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1170, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login Welcome", 10000, 6387, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4294, "Assertion failed", 2093, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
