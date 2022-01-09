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

    var data = {"OkPercent": 96.85296822315317, "KoPercent": 3.1470317768468377};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.15295800551752325, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.016, 500, 1500, "Polls"], "isController": false}, {"data": [0.009240246406570842, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.036093418259023353, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.10970464135021098, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [1.0, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.006160164271047228, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.06111111111111111, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.9377777777777778, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.034, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.11363636363636363, 500, 1500, "Save Poll-8"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.023529411764705882, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [0.14333333333333334, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.15333333333333332, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.14777777777777779, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.029535864978902954, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.15555555555555556, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.026371308016877638, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.16555555555555557, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.023529411764705882, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.16444444444444445, 500, 1500, "Polls-7"], "isController": false}, {"data": [0.023255813953488372, 500, 1500, "Save Poll-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9787, 308, 3.1470317768468377, 23438.039950955328, 57, 188048, 19251.0, 47151.600000000006, 76685.60000000012, 117449.60000000044, 45.07562498848584, 4076.0062060590953, 44.26510024225788], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 500, 115, 23.0, 96099.36200000004, 16377, 188048, 93570.0, 129518.90000000002, 144084.1, 177668.63000000006, 2.362167524920867, 897.7700677203903, 11.567875776562575], "isController": false}, {"data": ["Polls", 500, 72, 14.4, 34461.25600000001, 624, 129100, 35761.0, 58126.8, 63169.95, 116481.12000000004, 3.0238521457254826, 1483.6307839204394, 12.711648388740384], "isController": false}, {"data": ["Save Poll-0", 487, 0, 0.0, 29111.86652977413, 613, 102223, 27270.0, 50841.2, 58928.19999999999, 81276.6, 2.3196882948623903, 0.8204181839508055, 1.8423475665302798], "isController": false}, {"data": ["Show New Poll Form-0", 471, 0, 0.0, 22325.79830148619, 197, 70618, 20864.0, 38525.8, 45591.39999999999, 53611.759999999995, 2.519915895800675, 4.1588455702179115, 1.287027356937259], "isController": false}, {"data": ["Save Poll-2", 474, 3, 0.6329113924050633, 22194.23206751056, 94, 155041, 22242.0, 39229.0, 47067.5, 70702.75, 2.2641725738960967, 127.05355772744424, 1.4402416968397118], "isController": false}, {"data": ["Show New Poll Form-1", 46, 0, 0.0, 136.73913043478262, 91, 285, 128.0, 191.9, 234.14999999999995, 285.0, 0.3343339123609062, 46.382435238703515, 0.18120636851592084], "isController": false}, {"data": ["Save Poll-1", 487, 13, 2.6694045174537986, 32117.12114989734, 496, 121351, 31573.0, 49394.0, 57066.799999999974, 77334.16, 2.3182196834463884, 83.12891880132096, 1.4042045995477805], "isController": false}, {"data": ["Polls-0", 450, 0, 0.0, 17422.731111111116, 130, 57535, 15792.5, 34786.50000000001, 43039.34999999999, 54587.170000000006, 3.87807337314822, 95.21294595150684, 1.9428238676025749], "isController": false}, {"data": ["Polls-2", 450, 0, 0.0, 241.92444444444442, 82, 2551, 114.0, 227.60000000000014, 1393.5999999999972, 2417.9900000000007, 3.958166577241422, 23.633037552005913, 2.087314405967156], "isController": false}, {"data": ["Show New Poll Form", 500, 29, 5.8, 24772.732000000004, 197, 114980, 22353.5, 45098.90000000002, 54741.64999999999, 78875.87000000001, 2.560924391268272, 36.81725955801006, 1.406892832036652], "isController": false}, {"data": ["Save Poll-8", 44, 11, 25.0, 20010.727272727272, 198, 47545, 22758.0, 35246.5, 45262.25, 47545.0, 0.4373366199842956, 19.05734894803149, 0.2056421704320687], "isController": false}, {"data": ["Polls-1", 450, 0, 0.0, 262.3422222222221, 72, 2622, 121.0, 243.80000000000007, 1897.1499999999978, 2557.25, 3.957261574990107, 548.991894484017, 2.1448048575385834], "isController": false}, {"data": ["Save Poll-7", 425, 6, 1.411764705882353, 24280.538823529423, 166, 87244, 24058.0, 39014.2, 47612.1, 66043.54000000005, 2.02953086797066, 104.01367150192448, 1.2751441713067315], "isController": false}, {"data": ["Polls-4", 450, 1, 0.2222222222222222, 13765.422222222207, 153, 110947, 14389.5, 27458.7, 28122.5, 29113.56, 2.7625666085504506, 420.6026726105334, 1.4239747904286275], "isController": false}, {"data": ["Polls-3", 450, 1, 0.2222222222222222, 13629.155555555559, 97, 110947, 13896.0, 27239.8, 27917.399999999998, 28920.39, 2.762498772222768, 149.67231536916194, 1.407789277744696], "isController": false}, {"data": ["Polls-6", 450, 1, 0.2222222222222222, 13721.871111111106, 148, 110946, 14281.0, 27423.8, 28149.15, 29090.64, 2.7625326899701648, 234.63083402780336, 1.4104983532235686], "isController": false}, {"data": ["Save Poll-4", 474, 6, 1.2658227848101267, 24629.251054852317, 166, 148271, 24021.0, 40068.5, 48900.5, 110610.75, 2.2635670760825963, 83.00465062451052, 1.4762460886014594], "isController": false}, {"data": ["Polls-5", 450, 1, 0.2222222222222222, 13618.522222222222, 57, 109836, 14127.5, 27357.1, 28057.55, 28997.87, 2.7816583629013314, 59.22264142414727, 1.441946983136969], "isController": false}, {"data": ["Save Poll-3", 474, 7, 1.4767932489451476, 24642.94092827004, 151, 149991, 23999.0, 39745.0, 47098.75, 98028.75, 2.262907884372091, 305.91244453876544, 1.458999713555964], "isController": false}, {"data": ["Polls-8", 450, 9, 2.0, 13817.91555555555, 94, 40700, 14493.5, 27556.2, 28188.65, 29589.18, 3.453621697953921, 193.77687499280495, 1.7418529903567208], "isController": false}, {"data": ["Save Poll-6", 425, 11, 2.588235294117647, 24747.868235294096, 142, 159581, 23914.0, 40584.6, 47037.19999999999, 86325.80000000008, 2.0283878850357473, 33.919590565431015, 1.3088741447958725], "isController": false}, {"data": ["Polls-7", 450, 15, 3.3333333333333335, 13714.802222222226, 89, 43001, 13836.0, 27544.300000000003, 28136.899999999998, 30637.40000000001, 3.26072779444372, 22.97565555347231, 1.6191126880353028], "isController": false}, {"data": ["Save Poll-5", 430, 7, 1.627906976744186, 24885.872093023238, 197, 165462, 23865.0, 39681.80000000001, 47490.89999999999, 128893.34999999998, 2.0531429799221717, 160.06163159214077, 1.3322954466779668], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 3, 0.974025974025974, 0.030652906917339327], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 15, 4.87012987012987, 0.15326453458669664], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.MalformedChunkCodingException/Non HTTP response message: Unexpected content at the end of chunk", 4, 1.2987012987012987, 0.040870542556452436], "isController": false}, {"data": ["500", 112, 36.36363636363637, 1.1443751915806681], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 36, 11.688311688311689, 0.36783488300807193], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 18, 5.8441558441558445, 0.18391744150403597], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, 0.3246753246753247, 0.010217635639113109], "isController": false}, {"data": ["Test failed: text expected to contain /Add a new Survey/", 49, 15.909090909090908, 0.5006641463165423], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, 0.3246753246753247, 0.010217635639113109], "isController": false}, {"data": ["Assertion failed", 69, 22.4025974025974, 0.7050168590988045], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9787, 308, "500", 112, "Assertion failed", 69, "Test failed: text expected to contain /Add a new Survey/", 49, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 36, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 18], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Save Poll", 500, 115, "Test failed: text expected to contain /Add a new Survey/", 49, "Assertion failed", 40, "500", 19, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 4, "Non HTTP response code: org.apache.http.MalformedChunkCodingException/Non HTTP response message: Unexpected content at the end of chunk", 2], "isController": false}, {"data": ["Polls", 500, 72, "500", 41, "Assertion failed", 22, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 8, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-2", 474, 3, "500", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-1", 487, 13, "500", 7, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 4, "Non HTTP response code: org.apache.http.MalformedChunkCodingException/Non HTTP response message: Unexpected content at the end of chunk", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show New Poll Form", 500, 29, "500", 18, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, null, null, null, null], "isController": false}, {"data": ["Save Poll-8", 44, 11, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-7", 425, 6, "500", 5, "Assertion failed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-4", 450, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-3", 450, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-6", 450, 1, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-4", 474, 6, "500", 3, "Assertion failed", 3, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-5", 450, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-3", 474, 7, "500", 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 13.79.73.31:8082 failed to respond", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Polls-8", 450, 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 8, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-6", 425, 11, "500", 8, "Assertion failed", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Polls-7", 450, 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-5", 430, 7, "500", 4, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: null", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Assertion failed", 1, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
