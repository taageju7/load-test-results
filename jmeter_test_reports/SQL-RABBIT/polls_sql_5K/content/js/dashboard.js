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

    var data = {"OkPercent": 50.03423434150989, "KoPercent": 49.96576565849011};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.16517325553703263, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.0017, 500, 1500, "Polls"], "isController": false}, {"data": [0.01554001554001554, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.06109324758842444, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.028820960698689956, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [1.0, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.005439005439005439, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.07319432502149613, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.92164660361135, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.0152, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.0, 500, 1500, "Save Poll-8"], "isController": false}, {"data": [0.9174548581255374, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.0029791459781529296, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [0.0705073086844368, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.07029234737747206, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.07029234737747206, 500, 1500, "Polls-6"], "isController": false}, {"data": [4.409171075837742E-4, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.07007738607050731, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.0013227513227513227, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.06803525365434222, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.0019860973187686196, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.06803525365434222, 500, 1500, "Polls-7"], "isController": false}, {"data": [0.0014866204162537165, 500, 1500, "Save Poll-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 67184, 33569, 49.96576565849011, 58115.2504167662, 0, 575623, 25972.5, 431065.2, 472505.05000000005, 510617.89, 98.74728637506743, 5348.39929027317, 49.99617248209779], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 5000, 4126, 82.52, 42818.017200000024, 1822, 575623, 4085.0, 116688.5, 182332.75, 484671.21999999863, 7.423453063733314, 634.2040958716692, 7.9541545633450665], "isController": false}, {"data": ["Polls", 5000, 4030, 80.6, 262013.02139999982, 391, 522325, 257677.5, 494793.0, 508313.7, 516747.20999999996, 8.963480985767784, 2484.755835898383, 19.84370609294861], "isController": false}, {"data": ["Save Poll-0", 1287, 0, 0.0, 52119.45143745141, 91, 494517, 14965.0, 148770.4000000001, 306515.1999999989, 484005.87999999983, 2.033374516935308, 0.7423743765187112, 1.6164818868514768], "isController": false}, {"data": ["Show New Poll Form-0", 1244, 0, 0.0, 54296.740353697765, 23, 489921, 7722.0, 195315.0, 372935.0, 482023.55, 2.1732408366627824, 3.5866963026954126, 1.1057211678723726], "isController": false}, {"data": ["Save Poll-2", 1145, 124, 10.829694323144105, 42122.44454148467, 78, 488725, 39672.0, 60619.2, 61940.8, 336062.88, 1.7016811718266989, 92.52976421033819, 0.9494352801048949], "isController": false}, {"data": ["Show New Poll Form-1", 31, 0, 0.0, 148.38709677419354, 70, 275, 123.0, 267.8, 273.8, 275.0, 5.341144038594074, 740.9905210845968, 2.894858341230186], "isController": false}, {"data": ["Save Poll-1", 1287, 142, 11.033411033411033, 58616.98679098686, 66, 492490, 46207.0, 88338.40000000008, 223614.59999999963, 484820.79999999993, 1.9328909861498673, 70.30371031857032, 1.0576833543092805], "isController": false}, {"data": ["Polls-0", 4652, 0, 0.0, 214623.00300945813, 4, 493412, 202676.0, 436721.5, 464939.54999999993, 486772.0, 8.415446650011848, 356.6976850257465, 4.199505115386772], "isController": false}, {"data": ["Polls-2", 4652, 0, 0.0, 375.0670679277748, 71, 7616, 104.0, 451.6999999999998, 2259.549999999982, 5617.280000000006, 8.4162840260666, 50.25113333532342, 4.438274779371058], "isController": false}, {"data": ["Show New Poll Form", 5000, 3756, 75.12, 17178.374399999993, 23, 491759, 4082.0, 14463.800000000034, 36953.39999999995, 427611.97, 8.734890822599608, 29.17381540140317, 1.1404065321915666], "isController": false}, {"data": ["Save Poll-8", 31, 0, 0.0, 53765.87096774193, 28202, 61564, 57738.0, 61247.6, 61563.4, 61564.0, 0.2776807388099141, 15.88366366704288, 0.17355046175619632], "isController": false}, {"data": ["Polls-1", 4652, 0, 0.0, 410.0616938951005, 69, 9072, 103.0, 489.0, 2377.0499999999984, 6710.650000000024, 8.416436294162772, 1167.6275852877682, 4.561642718027674], "isController": false}, {"data": ["Save Poll-7", 1007, 118, 11.717974180734856, 43181.18470705065, 384, 495008, 43482.0, 61120.2, 62457.8, 276310.759999999, 1.4968212985630813, 73.78083634657804, 0.8277031248374231], "isController": false}, {"data": ["Polls-4", 4652, 3421, 73.53826311263973, 31192.399398108304, 3, 475329, 4082.0, 74062.5, 244469.19999999925, 454527.88, 8.367959994963394, 355.57981108233054, 1.139589924203587], "isController": false}, {"data": ["Polls-3", 4652, 3387, 72.80739466895959, 34443.165520206414, 2, 473016, 4083.0, 94417.89999999994, 276229.84999999945, 458310.42000000004, 8.36811051949921, 141.08479524931647, 1.1577532092072602], "isController": false}, {"data": ["Polls-6", 4652, 3455, 74.26913155631986, 28054.239896818508, 3, 475339, 4082.0, 55812.59999999992, 214108.7, 425910.3600000005, 8.367899786665323, 201.15431059768338, 1.0975933350451672], "isController": false}, {"data": ["Save Poll-4", 1134, 116, 10.229276895943563, 44122.34038800703, 1476, 537417, 42454.0, 60839.0, 61866.25, 335648.95, 1.6853581906327375, 41.849547958676766, 0.9610110323896417], "isController": false}, {"data": ["Polls-5", 4652, 3449, 74.14015477214102, 28920.233877901923, 1, 476879, 4082.0, 59870.699999999764, 218423.2999999999, 436821.6500000009, 8.368050309035048, 64.01880093434535, 1.1200208740313424], "isController": false}, {"data": ["Save Poll-3", 1134, 115, 10.141093474426809, 43215.404761904785, 491, 487585, 42015.5, 60991.5, 62050.5, 300687.8500000014, 1.6853131056129547, 214.4027938727574, 0.9555268544760371], "isController": false}, {"data": ["Polls-8", 4652, 3540, 76.09630266552021, 25118.236027514966, 2, 472600, 4080.0, 39755.09999999987, 178945.09999999995, 405186.35, 8.359959889444383, 132.4987466855329, 1.0245392991794589], "isController": false}, {"data": ["Save Poll-6", 1007, 117, 11.618669314796424, 43644.82522343592, 291, 522382, 43275.0, 60942.8, 62194.799999999996, 284950.6, 1.4966989390827183, 13.954564221129466, 0.8310159132018656], "isController": false}, {"data": ["Polls-7", 4652, 3556, 76.4402407566638, 24439.051160791132, 0, 475483, 4080.0, 38917.799999999836, 168484.0, 404111.8100000005, 8.34427488036046, 32.391734947637524, 1.0059833222124166], "isController": false}, {"data": ["Save Poll-5", 1009, 117, 11.595639246778989, 44526.87115956393, 41, 489861, 43630.0, 61016.0, 62180.5, 329921.7999999987, 1.4995756899311443, 110.24082028898786, 0.8297334978866238], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 0.002978938901963121, 0.0014884496308644915], "isController": false}, {"data": ["500", 312, 0.9294289374124937, 0.46439628482972134], "isController": false}, {"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 2, 0.005957877803926242, 0.002976899261728983], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 178, 0.5302511245494355, 0.26494403429387947], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 29, 0.0863892281569305, 0.043165039295070255], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 320, 0.9532604486281986, 0.4763038818766373], "isController": false}, {"data": ["Test failed: text expected to contain /Add a new Survey/", 127, 0.3783252405493163, 0.18903310311979044], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 28784, 85.74577735410647, 42.84353417480352], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, 0.002978938901963121, 0.0014884496308644915], "isController": false}, {"data": ["Assertion failed", 3815, 11.364651910989306, 5.6784353417480355], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 67184, 33569, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 28784, "Assertion failed", 3815, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 320, "500", 312, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 178], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Save Poll", 5000, 4126, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3836, "Assertion failed", 133, "Test failed: text expected to contain /Add a new Survey/", 127, "500", 17, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 13], "isController": false}, {"data": ["Polls", 5000, 4030, "Assertion failed", 3682, "500", 265, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 83, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-2", 1145, 124, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 122, "500", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-1", 1287, 142, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 122, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 13, "500", 7, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show New Poll Form", 5000, 3756, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3747, "500", 6, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 3, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-7", 1007, 118, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 116, "500", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-4", 4652, 3421, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3421, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-3", 4652, 3387, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3387, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-6", 4652, 3455, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3455, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-4", 1134, 116, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 112, "500", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null], "isController": false}, {"data": ["Polls-5", 4652, 3449, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3449, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-3", 1134, 115, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 112, "500", 3, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-8", 4652, 3540, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3282, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 174, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 84, null, null, null, null], "isController": false}, {"data": ["Save Poll-6", 1007, 117, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 115, "500", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-7", 4652, 3556, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3313, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 146, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 93, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1], "isController": false}, {"data": ["Save Poll-5", 1009, 117, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8082 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 112, "500", 5, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
