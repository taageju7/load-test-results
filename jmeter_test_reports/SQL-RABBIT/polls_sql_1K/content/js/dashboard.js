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

    var data = {"OkPercent": 99.5854181558256, "KoPercent": 0.4145818441744103};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.15789849892780558, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0015, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.049, 500, 1500, "Polls"], "isController": false}, {"data": [0.04054054054054054, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.072, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.026526526526526525, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [1.0, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.024524524524524523, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.07907907907907907, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.972972972972973, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.072, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.0, 500, 1500, "Save Poll-8"], "isController": false}, {"data": [0.9714714714714715, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.02052052052052052, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [0.14864864864864866, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.14864864864864866, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.14864864864864866, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.025025025025025027, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.14864864864864866, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.023023023023023025, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.14714714714714713, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.023023023023023025, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.14714714714714713, 500, 1500, "Polls-7"], "isController": false}, {"data": [0.025525525525525526, 500, 1500, "Save Poll-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20985, 87, 0.4145818441744103, 28143.38131999041, 2, 117853, 27680.5, 53078.0, 71587.40000000004, 107945.0, 87.83164450471492, 8256.553959231896, 86.08056959642856], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 1000, 1, 0.1, 92512.70899999997, 1139, 117853, 104235.0, 108878.9, 109682.9, 111340.78, 4.237719090076957, 1789.8583717862198, 21.863667412152083], "isController": false}, {"data": ["Polls", 1000, 39, 3.9, 46580.47300000001, 131, 82951, 59674.5, 72044.6, 73226.8, 76183.12, 7.657026470340508, 4304.6900348945055, 35.33972701025659], "isController": false}, {"data": ["Save Poll-0", 999, 0, 0.0, 22291.55355355355, 48, 72202, 20337.0, 39915.0, 50275.0, 60286.0, 4.786133149361849, 1.7153426423982407, 3.841993602319765], "isController": false}, {"data": ["Show New Poll Form-0", 1000, 0, 0.0, 19691.813999999988, 11, 63661, 12859.0, 45996.99999999999, 51268.99999999999, 59126.80000000001, 6.306363120388473, 10.407962571734881, 3.2086085798070254], "isController": false}, {"data": ["Save Poll-2", 999, 0, 0.0, 32901.38838838841, 32, 56125, 34157.0, 50819.0, 52434.0, 54719.0, 4.239607868101088, 229.98823325800498, 2.632999163165489], "isController": false}, {"data": ["Show New Poll Form-1", 1, 0, 0.0, 139.0, 139, 139, 139.0, 139.0, 139.0, 139.0, 7.194244604316547, 998.0468749999999, 3.899224370503597], "isController": false}, {"data": ["Save Poll-1", 999, 0, 0.0, 35690.78678678676, 53, 72623, 39502.0, 54242.0, 56424.0, 61985.0, 4.289468260511129, 191.70862057930364, 2.6222725889452803], "isController": false}, {"data": ["Polls-0", 999, 0, 0.0, 24322.902902902923, 3, 60776, 24764.0, 47257.0, 49840.0, 55796.0, 8.725119435443723, 365.4264088933553, 4.354039093273186], "isController": false}, {"data": ["Polls-2", 999, 0, 0.0, 159.03803803803794, 75, 2326, 101.0, 135.0, 256.0, 2093.0, 8.741763578610243, 52.19447511681936, 4.609914387157746], "isController": false}, {"data": ["Show New Poll Form", 1000, 0, 0.0, 19691.952999999994, 11, 63661, 12859.0, 45996.99999999999, 51268.99999999999, 59126.80000000001, 6.306363120388473, 11.282834966418617, 3.212026579349814], "isController": false}, {"data": ["Save Poll-8", 1, 0, 0.0, 51800.0, 51800, 51800, 51800.0, 51800.0, 51800.0, 51800.0, 0.019305019305019305, 1.1042697273166024, 0.012065637065637066], "isController": false}, {"data": ["Polls-1", 999, 0, 0.0, 158.8948948948953, 69, 2346, 99.0, 132.0, 279.0, 2143.0, 8.74053983113872, 1212.5928757546262, 4.737304303009755], "isController": false}, {"data": ["Save Poll-7", 999, 0, 0.0, 33032.01901901897, 77, 62149, 34525.0, 50682.0, 52717.0, 54572.0, 4.2380431185888465, 242.20889785557776, 2.648772806261189], "isController": false}, {"data": ["Polls-4", 999, 0, 0.0, 22028.287287287276, 3, 44565, 23150.0, 41738.0, 42976.0, 44140.0, 8.323404680769519, 1270.0263780822218, 4.283627213638219], "isController": false}, {"data": ["Polls-3", 999, 0, 0.0, 22022.79479479478, 2, 44531, 23153.0, 41733.0, 42980.0, 44142.0, 8.323196640727842, 451.9154394803001, 4.234751415839068], "isController": false}, {"data": ["Polls-6", 999, 0, 0.0, 22028.17117117118, 3, 44554, 23154.0, 41736.0, 42979.0, 44146.0, 8.323404680769519, 708.4647968514369, 4.2429855892204], "isController": false}, {"data": ["Save Poll-4", 999, 0, 0.0, 33116.68368368367, 63, 56970, 34476.0, 50923.0, 52775.0, 54655.0, 4.238582556896288, 90.97859391838713, 2.6697978717987882], "isController": false}, {"data": ["Polls-5", 999, 0, 0.0, 22028.396396396383, 2, 44557, 23160.0, 41733.0, 42976.0, 44148.0, 8.323751437284407, 177.57065444089636, 4.308191661875719], "isController": false}, {"data": ["Save Poll-3", 999, 0, 0.0, 33104.96396396396, 34, 59771, 34555.0, 50718.0, 52679.0, 54352.0, 4.238097056240694, 646.252898213816, 2.6570633360060074], "isController": false}, {"data": ["Polls-8", 999, 27, 2.7027027027027026, 21569.982982982976, 2, 44524, 22272.0, 41580.0, 42942.0, 44423.0, 8.294379914150262, 462.23063470635486, 4.137557547968749], "isController": false}, {"data": ["Save Poll-6", 999, 0, 0.0, 33086.81581581581, 26, 62694, 34608.0, 50883.0, 52886.0, 54707.0, 4.238061097653582, 30.828876815705854, 2.644641168743981], "isController": false}, {"data": ["Polls-7", 999, 20, 2.002002002002002, 21786.481481481474, 2, 44533, 23024.0, 41630.0, 42925.0, 44429.0, 7.674579396174234, 54.53768839546363, 3.848603028731659], "isController": false}, {"data": ["Save Poll-5", 999, 0, 0.0, 33143.28028028025, 104, 63186, 34371.0, 50982.0, 52926.0, 55085.0, 4.238402728869504, 360.4903061187962, 2.6366176557156917], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 2, 2.2988505747126435, 0.009530617107457708], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 47, 54.02298850574713, 0.22396950202525615], "isController": false}, {"data": ["Assertion failed", 38, 43.67816091954023, 0.18108172504169645], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20985, 87, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 47, "Assertion failed", 38, "500", 2, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Save Poll", 1000, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls", 1000, 39, "Assertion failed", 38, "500", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-8", 999, 27, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 27, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-7", 999, 20, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 20, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
