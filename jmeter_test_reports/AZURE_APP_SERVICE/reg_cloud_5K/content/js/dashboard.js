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

    var data = {"OkPercent": 83.70178184703133, "KoPercent": 16.298218152968673};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [4.288440508609044E-5, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Welcome-3"], "isController": false}, {"data": [0.0, 500, 1500, "Registration-5"], "isController": false}, {"data": [2.0279862096937742E-4, 500, 1500, "Registration-4"], "isController": false}, {"data": [0.0, 500, 1500, "Registration"], "isController": false}, {"data": [0.0, 500, 1500, "Welcome"], "isController": false}, {"data": [1.0139931048468871E-4, 500, 1500, "Registration-3"], "isController": false}, {"data": [0.0, 500, 1500, "Welcome-0"], "isController": false}, {"data": [1.0139931048468871E-4, 500, 1500, "Registration-2"], "isController": false}, {"data": [0.0, 500, 1500, "Welcome-1"], "isController": false}, {"data": [0.0, 500, 1500, "Registration-1"], "isController": false}, {"data": [0.0, 500, 1500, "Welcome-2"], "isController": false}, {"data": [0.0, 500, 1500, "Registration-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 46637, 7601, 16.298218152968673, 156555.2401312262, 1, 625156, 159611.5, 448836.10000000015, 476632.55000000005, 522764.6600000002, 59.88515281712024, 4492.661440801102, 68.2340064218727], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Welcome-3", 2990, 426, 14.247491638795987, 92176.85585284262, 4415, 458331, 91442.0, 130288.6, 173645.85, 185550.77000000002, 5.277314958628675, 169.2025991851711, 3.4980309625275336], "isController": false}, {"data": ["Registration-5", 2, 0, 0.0, 190893.0, 188170, 193616, 190893.0, 193616.0, 193616.0, 193616.0, 0.00983327679199178, 0.36018217374416767, 0.008056757059063578], "isController": false}, {"data": ["Registration-4", 4931, 502, 10.180490772662745, 144335.8030825389, 1, 303462, 151092.0, 198975.2, 207221.19999999998, 221079.52000000008, 7.823221529962574, 260.0840265515157, 5.766299105350918], "isController": false}, {"data": ["Registration", 5000, 2466, 49.32, 419190.70119999984, 153564, 625156, 429903.0, 493558.0, 516815.14999999997, 554510.9799999999, 6.582082518252116, 1440.584988651667, 24.997534547294237], "isController": false}, {"data": ["Welcome", 5000, 2527, 50.54, 151397.99499999994, 13946, 536757, 161284.0, 203904.6, 218476.25, 243521.8199999999, 8.715067829372916, 1148.8964113011987, 13.217244635439997], "isController": false}, {"data": ["Registration-3", 4931, 481, 9.754613668627053, 145251.15351855665, 1, 248138, 151353.0, 199833.6, 207573.8, 219794.64000000004, 7.815954946115719, 602.6118965410318, 5.729288229585553], "isController": false}, {"data": ["Welcome-0", 2990, 0, 0.0, 56146.49230769235, 1818, 135974, 66831.5, 96684.1, 102662.79999999999, 111540.60000000002, 16.079418344519016, 69.4850330159127, 8.306652640869688], "isController": false}, {"data": ["Registration-2", 4931, 483, 9.79517339282093, 144936.97728655435, 1, 258143, 151093.0, 198954.80000000002, 206813.8, 224327.48000000024, 7.813676072340283, 839.6509871010367, 5.805255555320066], "isController": false}, {"data": ["Welcome-1", 2990, 299, 10.0, 90782.02541806032, 4402, 191244, 90987.5, 128980.6, 174063.79999999996, 185209.07, 9.392001407229642, 1008.005155416617, 6.537713479563759], "isController": false}, {"data": ["Registration-1", 4941, 10, 0.20238818053025703, 135149.83869662054, 54248, 207327, 135071.0, 152988.2, 160849.4, 179641.97999999998, 7.20372651790726, 24.762358567546784, 5.6974572228621], "isController": false}, {"data": ["Welcome-2", 2990, 407, 13.612040133779264, 91702.36421404687, 3068, 196179, 91187.0, 129521.90000000001, 174629.3, 184856.14, 9.248776625031706, 685.2296400526546, 6.10633246374727], "isController": false}, {"data": ["Registration-0", 4941, 0, 0.0, 131231.2204007287, 50450, 198303, 133191.0, 160909.2, 166836.8, 177549.63999999998, 7.25219466587212, 4.451429108274342, 6.109927393198554], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 0.013156163662675963, 0.002144220254304522], "isController": false}, {"data": ["500", 36, 0.4736218918563347, 0.0771919291549628], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLProtocolException/Non HTTP response message: Illegal packet size: 35337", 1, 0.013156163662675963, 0.002144220254304522], "isController": false}, {"data": ["403", 2, 0.026312327325351926, 0.004288440508609044], "isController": false}, {"data": ["Test failed: text expected to contain /You've successfully registered to our Survey app/", 2015, 26.509669780292068, 4.320603812423612], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 3150, 41.44191553742929, 6.754293801059244], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1457, 19.16853045651888, 3.124128910521689], "isController": false}, {"data": ["Assertion failed", 899, 11.827391132745692, 1.9276540086197653], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 40, 0.5262465465070385, 0.08576881017218088], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 46637, 7601, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 3150, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 2015, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1457, "Assertion failed", 899, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 40], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Welcome-3", 2990, 426, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 423, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 2, "500", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-4", 4931, 502, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 498, "500", 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null], "isController": false}, {"data": ["Registration", 5000, 2466, "Test failed: text expected to contain /You've successfully registered to our Survey app/", 2015, "Assertion failed", 382, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 54, "500", 13, "403", 2], "isController": false}, {"data": ["Welcome", 5000, 2527, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1971, "Assertion failed", 517, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 37, "500", 2, null, null], "isController": false}, {"data": ["Registration-3", 4931, 481, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 477, "500", 4, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration-2", 4931, 483, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 482, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-1", 2990, 299, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 298, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Registration-1", 4941, 10, "500", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Welcome-2", 2990, 407, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 404, "500", 2, "Non HTTP response code: javax.net.ssl.SSLProtocolException/Non HTTP response message: Illegal packet size: 35337", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
