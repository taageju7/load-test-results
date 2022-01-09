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

    var data = {"OkPercent": 98.45496064522398, "KoPercent": 1.545039354776018};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.23127004178408317, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Save Poll"], "isController": false}, {"data": [0.002, 500, 1500, "Polls"], "isController": false}, {"data": [0.006060606060606061, 500, 1500, "Save Poll-0"], "isController": false}, {"data": [0.030612244897959183, 500, 1500, "Show New Poll Form-0"], "isController": false}, {"data": [0.02540650406504065, 500, 1500, "Save Poll-2"], "isController": false}, {"data": [1.0, 500, 1500, "Show New Poll Form-1"], "isController": false}, {"data": [0.005050505050505051, 500, 1500, "Save Poll-1"], "isController": false}, {"data": [0.013265306122448979, 500, 1500, "Polls-0"], "isController": false}, {"data": [0.996938775510204, 500, 1500, "Polls-2"], "isController": false}, {"data": [0.03, 500, 1500, "Show New Poll Form"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "Save Poll-8"], "isController": false}, {"data": [0.9979591836734694, 500, 1500, "Polls-1"], "isController": false}, {"data": [0.0075107296137339056, 500, 1500, "Save Poll-7"], "isController": false}, {"data": [0.4122448979591837, 500, 1500, "Polls-4"], "isController": false}, {"data": [0.4673469387755102, 500, 1500, "Polls-3"], "isController": false}, {"data": [0.4387755102040816, 500, 1500, "Polls-6"], "isController": false}, {"data": [0.009146341463414634, 500, 1500, "Save Poll-4"], "isController": false}, {"data": [0.4744897959183674, 500, 1500, "Polls-5"], "isController": false}, {"data": [0.01016260162601626, 500, 1500, "Save Poll-3"], "isController": false}, {"data": [0.4357142857142857, 500, 1500, "Polls-8"], "isController": false}, {"data": [0.008583690987124463, 500, 1500, "Save Poll-6"], "isController": false}, {"data": [0.44693877551020406, 500, 1500, "Polls-7"], "isController": false}, {"data": [0.01694915254237288, 500, 1500, "Save Poll-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10291, 159, 1.545039354776018, 14068.316587309291, 53, 255899, 9046.0, 32092.000000000007, 44921.0, 93068.56, 33.33657272432783, 3127.1089321145128, 40.97089040229187], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Save Poll", 500, 48, 9.6, 68898.82199999999, 2331, 164782, 69105.0, 101994.3, 114511.75, 142605.19000000003, 1.646746522894717, 671.4431310754654, 10.528258401906603], "isController": false}, {"data": ["Polls", 500, 43, 8.6, 16367.17, 1458, 255899, 11374.5, 34686.4, 41232.75, 55173.030000000006, 1.6337573478236718, 903.7915334303513, 9.104620178986286], "isController": false}, {"data": ["Save Poll-0", 495, 0, 0.0, 19268.842424242426, 151, 64598, 17572.0, 34810.00000000001, 42374.799999999996, 55010.12000000007, 1.6420688076590069, 0.7248194346307335, 1.586643154190261], "isController": false}, {"data": ["Show New Poll Form-0", 490, 0, 0.0, 13785.675510204084, 322, 58817, 12322.5, 26226.300000000003, 31566.199999999997, 46468.94999999997, 1.622667002238618, 2.818222928160558, 1.1155835640390501], "isController": false}, {"data": ["Save Poll-2", 492, 1, 0.2032520325203252, 16865.7337398374, 85, 56994, 16030.0, 30618.1, 35185.1, 44549.07999999997, 1.6451603195356101, 90.63543246274146, 1.2967432325226793], "isController": false}, {"data": ["Show New Poll Form-1", 10, 0, 0.0, 104.8, 95, 120, 104.5, 119.5, 120.0, 120.0, 0.29504617472634465, 40.9322398799162, 0.15991272165343876], "isController": false}, {"data": ["Save Poll-1", 495, 3, 0.6060606060606061, 21611.092929292932, 499, 66180, 19338.0, 38921.200000000004, 44882.0, 57257.04000000008, 1.646624419939125, 68.48357676658682, 1.288033359737538], "isController": false}, {"data": ["Polls-0", 490, 0, 0.0, 10787.383673469394, 503, 43627, 8676.0, 22355.500000000004, 26579.999999999996, 35190.889999999934, 4.757789666857626, 210.3911639683607, 2.4253576231442193], "isController": false}, {"data": ["Polls-2", 490, 1, 0.20408163265306123, 607.4204081632653, 80, 240088, 108.0, 149.90000000000003, 180.34999999999997, 426.69999999999925, 1.614449653881763, 9.624286651096012, 0.8496324450016309], "isController": false}, {"data": ["Show New Poll Form", 500, 10, 2.0, 14624.617999999991, 322, 82370, 12605.5, 28104.100000000002, 36477.2, 58980.35, 1.6557826553455286, 7.887023155292544, 1.1562990008179568], "isController": false}, {"data": ["Save Poll-8", 11, 1, 9.090909090909092, 11818.818181818182, 772, 24757, 11583.0, 23930.000000000004, 24757.0, 24757.0, 0.056518946692357096, 2.956160685613359, 0.040893946692357096], "isController": false}, {"data": ["Polls-1", 490, 0, 0.0, 124.77346938775517, 72, 1100, 109.5, 154.0, 214.89999999999998, 391.17999999999745, 4.87280972175262, 676.0129648436723, 2.6410248003639687], "isController": false}, {"data": ["Save Poll-7", 466, 4, 0.8583690987124464, 17580.774678111567, 420, 107723, 16232.0, 30755.9, 35516.24999999998, 65588.0499999999, 1.556654195617317, 89.03213900592097, 1.2847329511290753], "isController": false}, {"data": ["Polls-4", 490, 1, 0.20408163265306123, 3989.6836734693884, 114, 16322, 1447.5, 13038.900000000003, 14542.9, 15686.449999999997, 4.297642436149313, 654.282280008946, 2.9737294272295114], "isController": false}, {"data": ["Polls-3", 490, 0, 0.0, 3864.1530612244906, 57, 16211, 1287.5, 12987.900000000001, 14486.05, 15817.399999999998, 4.298811247093916, 233.24409461771285, 2.955432732377067], "isController": false}, {"data": ["Polls-6", 490, 1, 0.20408163265306123, 3946.2857142857138, 105, 16248, 1435.5, 12990.600000000002, 14433.599999999999, 15741.199999999997, 4.299226139294927, 365.05612882378875, 2.9538757880086686], "isController": false}, {"data": ["Save Poll-4", 492, 7, 1.4227642276422765, 17765.955284552845, 125, 124039, 16573.0, 30067.2, 35765.69999999999, 60218.13999999997, 1.643412820624163, 41.72836488879406, 1.3146865459353925], "isController": false}, {"data": ["Polls-5", 490, 0, 0.0, 3863.787755102041, 53, 15857, 1255.0, 12934.000000000004, 14389.749999999998, 15672.71, 4.311558496409968, 91.81430134054273, 3.002091023379206], "isController": false}, {"data": ["Save Poll-3", 492, 2, 0.4065040650406504, 17942.853658536587, 299, 129831, 16656.5, 31215.399999999998, 37344.85, 49941.10999999998, 1.6441817021290817, 241.66959425137932, 1.3319324701240154], "isController": false}, {"data": ["Polls-8", 490, 15, 3.061224489795918, 4019.128571428573, 75, 20206, 1619.5, 13070.800000000005, 14476.4, 15954.039999999994, 4.330496416293272, 240.46204194229392, 2.9024751769758996], "isController": false}, {"data": ["Save Poll-6", 466, 2, 0.4291845493562232, 17096.515021459218, 589, 119025, 15615.5, 30606.2, 37025.54999999999, 51916.93999999993, 1.5550802067656, 15.622360316004979, 1.257682327731485], "isController": false}, {"data": ["Polls-7", 490, 18, 3.673469387755102, 4106.597959183673, 84, 37089, 1503.5, 13138.300000000001, 14648.4, 22557.64999999997, 4.332027831068596, 30.461107479599683, 2.8810885988100186], "isController": false}, {"data": ["Save Poll-5", 472, 2, 0.423728813559322, 17759.173728813537, 296, 126620, 16366.5, 32301.799999999996, 37065.799999999974, 50035.79999999995, 1.5727514153096687, 130.5264643227839, 1.2560912358260776], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 44, 27.67295597484277, 0.4275580604411622], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 5.246; actual size: 3.363)", 1, 0.6289308176100629, 0.009717228646390049], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 35, 22.0125786163522, 0.34010300262365173], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 3, 1.8867924528301887, 0.029151685939170148], "isController": false}, {"data": ["Test failed: text expected to contain /Add a new Survey/", 26, 16.352201257861637, 0.2526479448061413], "isController": false}, {"data": ["Assertion failed", 48, 30.18867924528302, 0.46642697502672237], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 2, 1.2578616352201257, 0.019434457292780098], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10291, 159, "Assertion failed", 48, "500", 44, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 35, "Test failed: text expected to contain /Add a new Survey/", 26, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 3], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Save Poll", 500, 48, "Test failed: text expected to contain /Add a new Survey/", 26, "Assertion failed", 14, "500", 8, null, null, null, null], "isController": false}, {"data": ["Polls", 500, 43, "Assertion failed", 33, "500", 10, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-2", 492, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-1", 495, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-2", 490, 1, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 5.246; actual size: 3.363)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show New Poll Form", 500, 10, "500", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-8", 11, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-7", 466, 4, "500", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "Assertion failed", 1, null, null, null, null], "isController": false}, {"data": ["Polls-4", 490, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Polls-6", 490, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Tag mismatch!", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-4", 492, 7, "500", 6, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Save Poll-3", 492, 2, "500", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-8", 490, 15, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-6", 466, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Polls-7", 490, 18, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 18, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Save Poll-5", 472, 2, "500", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
