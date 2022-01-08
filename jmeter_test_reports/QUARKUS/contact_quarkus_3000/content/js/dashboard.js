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

    var data = {"OkPercent": 85.0055617352614, "KoPercent": 14.994438264738598};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8477567667779013, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.933649289099526, 500, 1500, "Show Contact Page-6"], "isController": false}, {"data": [0.9317535545023696, 500, 1500, "Show Contact Page-5"], "isController": false}, {"data": [0.9360189573459715, 500, 1500, "Show Contact Page-4"], "isController": false}, {"data": [0.9322274881516588, 500, 1500, "Show Contact Page-3"], "isController": false}, {"data": [0.9146919431279621, 500, 1500, "Show Contact Page-7"], "isController": false}, {"data": [0.9383886255924171, 500, 1500, "Show Contact Page-2"], "isController": false}, {"data": [0.975829383886256, 500, 1500, "Show Contact Page-1"], "isController": false}, {"data": [1.0, 500, 1500, "Show Contact Page-0"], "isController": false}, {"data": [0.5359281437125748, 500, 1500, "Send Email-2"], "isController": false}, {"data": [0.757396449704142, 500, 1500, "Send Email-1"], "isController": false}, {"data": [0.6256666666666667, 500, 1500, "Show Contact Page"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "Send Email-4"], "isController": false}, {"data": [0.42592592592592593, 500, 1500, "Send Email-3"], "isController": false}, {"data": [0.23529411764705882, 500, 1500, "Send Email-6"], "isController": false}, {"data": [0.26294820717131473, 500, 1500, "Send Email-5"], "isController": false}, {"data": [0.18382352941176472, 500, 1500, "Send Email-7"], "isController": false}, {"data": [0.6543333333333333, 500, 1500, "Send Email"], "isController": false}, {"data": [1.0, 500, 1500, "Send Email-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 26970, 4044, 14.994438264738598, 25.19514275120512, 0, 2167, 5.0, 92.0, 99.0, 110.0, 450.19780660023036, 27667.97817215643, 337.55814350785386], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Show Contact Page-6", 2110, 140, 6.6350710900473935, 6.049763033175352, 2, 83, 5.0, 9.0, 11.0, 21.0, 35.404466667785286, 235.51383406463412, 16.915045010654897], "isController": false}, {"data": ["Show Contact Page-5", 2110, 144, 6.8246445497630335, 6.167298578199041, 2, 69, 5.0, 9.0, 11.449999999999818, 21.0, 35.40803141413972, 2805.976789961991, 16.81796275863805], "isController": false}, {"data": ["Show Contact Page-4", 2110, 135, 6.398104265402844, 6.066350710900467, 2, 71, 5.0, 9.0, 12.0, 22.0, 35.40921982245045, 704.6810692304788, 17.15445462879055], "isController": false}, {"data": ["Show Contact Page-3", 2110, 143, 6.777251184834123, 6.389099526066353, 2, 125, 5.0, 9.0, 12.0, 22.0, 35.4068430855973, 5034.413450929639, 16.987120577290955], "isController": false}, {"data": ["Show Contact Page-7", 2110, 180, 8.530805687203792, 4.809478672985785, 0, 77, 4.0, 7.0, 11.0, 20.0, 35.412785526072874, 1852.3741631946193, 16.607118693671016], "isController": false}, {"data": ["Show Contact Page-2", 2110, 130, 6.161137440758294, 6.090521327014208, 2, 70, 5.0, 9.0, 11.449999999999818, 23.0, 35.406248951236705, 1801.3605934007617, 16.904425676242575], "isController": false}, {"data": ["Show Contact Page-1", 2110, 20, 0.9478672985781991, 121.42511848341242, 5, 1946, 94.0, 108.0, 116.0, 1391.2199999999875, 35.35937526184371, 210.02844408275098, 18.46980104067166], "isController": false}, {"data": ["Show Contact Page-0", 2110, 0, 0.0, 2.48056872037915, 1, 60, 2.0, 4.0, 7.0, 12.0, 35.27956126270733, 207.0262535425863, 17.674233327899277], "isController": false}, {"data": ["Send Email-2", 334, 155, 46.40718562874252, 9.338323353293406, 2, 44, 7.0, 20.0, 23.25, 33.94999999999993, 12.738367658276125, 548.9784456045004, 3.49972140779939], "isController": false}, {"data": ["Send Email-1", 338, 82, 24.2603550295858, 44.96745562130178, 2, 123, 14.0, 101.0, 105.05000000000001, 115.0, 5.899499066203551, 164.26773954169795, 2.3240595491595832], "isController": false}, {"data": ["Show Contact Page", 3000, 1092, 36.4, 90.21266666666654, 3, 2167, 92.0, 108.0, 115.0, 1161.4599999999882, 50.080128205128204, 12821.8511597723, 136.90118708162225], "isController": false}, {"data": ["Send Email-4", 308, 187, 60.714285714285715, 10.56818181818182, 2, 43, 8.0, 21.0, 25.55000000000001, 39.82000000000005, 11.804384485666104, 157.79707231862258, 2.3847407730338803], "isController": false}, {"data": ["Send Email-3", 324, 186, 57.407407407407405, 10.2283950617284, 2, 44, 9.0, 19.0, 24.75, 36.5, 12.408563440695493, 465.59699456167897, 2.715196062004519], "isController": false}, {"data": ["Send Email-6", 153, 117, 76.47058823529412, 12.437908496732026, 2, 44, 11.0, 21.0, 27.299999999999983, 39.14000000000007, 5.903005517188163, 32.867908496180405, 0.7109739717967514], "isController": false}, {"data": ["Send Email-5", 251, 185, 73.70517928286853, 12.565737051792825, 2, 71, 10.0, 22.80000000000001, 29.0, 40.91999999999996, 9.628294142468066, 186.09544921650237, 1.2943414592044191], "isController": false}, {"data": ["Send Email-7", 136, 111, 81.61764705882354, 13.91176470588235, 3, 49, 11.0, 25.299999999999997, 34.45000000000002, 47.889999999999986, 5.24914122505693, 66.00618691863832, 0.49470773910610216], "isController": false}, {"data": ["Send Email", 3000, 1037, 34.56666666666667, 10.252000000000002, 2, 146, 4.0, 14.0, 54.74999999999909, 114.0, 51.878880107908074, 1084.2047082515521, 33.031613962768255], "isController": false}, {"data": ["Send Email-0", 2246, 0, 0.0, 4.3561887800534365, 2, 64, 4.0, 6.0, 9.0, 18.0, 38.8480498140621, 230.8499835142264, 25.72165798235752], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 0.024727992087042534, 0.0037078235076010383], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3558, 87.98219584569733, 13.192436040044495], "isController": false}, {"data": ["Assertion failed", 485, 11.993076162215628, 1.7982944011865036], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 26970, 4044, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3558, "Assertion failed", 485, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Show Contact Page-6", 2110, 140, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 140, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-5", 2110, 144, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 144, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-4", 2110, 135, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 135, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-3", 2110, 143, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 143, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-7", 2110, 180, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 179, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-2", 2110, 130, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 130, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page-1", 2110, 20, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 20, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Email-2", 334, 155, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 155, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-1", 338, 82, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 82, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Contact Page", 3000, 1092, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 890, "Assertion failed", 202, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-4", 308, 187, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 187, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-3", 324, 186, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 186, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-6", 153, 117, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 117, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-5", 251, 185, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 185, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email-7", 136, 111, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 111, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Send Email", 3000, 1037, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 754, "Assertion failed", 283, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
