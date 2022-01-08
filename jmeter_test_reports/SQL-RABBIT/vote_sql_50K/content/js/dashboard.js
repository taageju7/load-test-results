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

    var data = {"OkPercent": 97.99112801013942, "KoPercent": 2.008871989860583};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.10367553865652725, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.059940059940059943, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.08691308691308691, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-2"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-3"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-4"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-5"], "isController": false}, {"data": [0.044455544455544456, 500, 1500, "Login-0"], "isController": false}, {"data": [0.023476523476523476, 500, 1500, "Login-1"], "isController": false}, {"data": [0.9815184815184815, 500, 1500, "Login-2"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "Vote For Selected Poll-0"], "isController": false}, {"data": [0.01898101898101898, 500, 1500, "Login-3"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-1"], "isController": false}, {"data": [0.02047952047952048, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0175, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0155, 500, 1500, "Login-6"], "isController": false}, {"data": [0.018, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0165, 500, 1500, "Login-8"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "Re Vote For Selected Poll-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Re Vote For Selected Poll-4"], "isController": false}, {"data": [0.0625, 500, 1500, "Show Vote Page"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "Re Vote For Selected Poll-3"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "Re Vote For Selected Poll-2"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "Re Vote For Selected Poll-1"], "isController": false}, {"data": [0.061938061938061936, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.05844155844155844, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "Re Vote For Selected Poll-7"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "Re Vote For Selected Poll-6"], "isController": false}, {"data": [0.10416666666666667, 500, 1500, "Re Vote For Selected Poll"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "Re Vote For Selected Poll-5"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Show Selected Poll-6"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Show Selected Poll-5"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Show Selected Poll-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Show Selected Poll-3"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Show Selected Poll-2"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Show Selected Poll-1"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "Show Selected Poll-0"], "isController": false}, {"data": [0.036463536463536464, 500, 1500, "Login Welcome"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "Vote For Selected Poll"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "Show Selected Poll"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "Show Vote Page-7"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "Show Vote Page-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "Show Vote Page-4"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "Show Vote Page-5"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "Show Vote Page-6"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "Show Vote Page-0"], "isController": false}, {"data": [1.0, 500, 1500, "Show Vote Page-1"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "Show Vote Page-2"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-6"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-7"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15780, 317, 2.008871989860583, 11889.963498098869, 5, 54090, 10240.5, 21198.8, 30387.09999999998, 42352.56000000001, 174.7837355869876, 15159.299168569249, 183.0407363166377], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 1001, 0, 0.0, 10822.429570429567, 16, 22028, 10763.0, 18913.2, 19745.8, 20997.32, 15.395736565258852, 1829.581823134555, 9.276532676528038], "isController": false}, {"data": ["Login Welcome-0", 1001, 0, 0.0, 7181.995004995005, 12, 17491, 7729.0, 12290.600000000002, 13027.7, 14346.54, 22.067901234567902, 56.74295307677469, 11.012399932484568], "isController": false}, {"data": ["Vote For Selected Poll-2", 21, 0, 0.0, 11973.47619047619, 25, 24061, 10030.0, 20903.600000000002, 23758.899999999994, 24061.0, 0.43252595155709345, 23.48438513732699, 0.24794212262110726], "isController": false}, {"data": ["Vote For Selected Poll-3", 21, 0, 0.0, 12188.04761904762, 27, 21909, 10372.0, 19947.2, 21719.699999999997, 21909.0, 0.4324903204547327, 65.99151865243225, 0.2504558203414614], "isController": false}, {"data": ["Vote For Selected Poll-4", 21, 0, 0.0, 11766.380952380952, 25, 21290, 9950.0, 19988.600000000002, 21189.5, 21290.0, 0.43251704323110823, 9.226889462288634, 0.251738435318106], "isController": false}, {"data": ["Vote For Selected Poll-5", 21, 0, 0.0, 12272.333333333332, 27, 23307, 10307.0, 20270.6, 23009.999999999996, 23307.0, 0.43251704323110823, 36.814634265647854, 0.24835939591786296], "isController": false}, {"data": ["Login-0", 1001, 0, 0.0, 6604.151848151848, 273, 24956, 4114.0, 17680.200000000004, 20254.8, 22406.88, 12.890016353966804, 5.524946640354379, 9.44092994675303], "isController": false}, {"data": ["Login-1", 1001, 0, 0.0, 13238.90109890109, 38, 25013, 12748.0, 19309.6, 20417.9, 22365.180000000008, 11.739732132385711, 55.26855159515516, 7.11963150611029], "isController": false}, {"data": ["Login-2", 1001, 0, 0.0, 151.8171828171827, 71, 7701, 99.0, 169.80000000000007, 241.0, 1597.7800000000002, 11.741797750173019, 71.43071681343913, 6.754709072327597], "isController": false}, {"data": ["Vote For Selected Poll-0", 21, 0, 0.0, 7436.0, 31, 21196, 3412.0, 19922.2, 21072.699999999997, 21196.0, 0.3195034004290474, 0.1151335495686704, 0.22808299386097036], "isController": false}, {"data": ["Login-3", 1001, 0, 0.0, 11763.713286713284, 49, 22589, 10376.0, 18540.4, 19627.5, 21083.9, 11.470281543274243, 623.1428202597715, 7.124343982399248], "isController": false}, {"data": ["Vote For Selected Poll-1", 21, 0, 0.0, 16436.428571428572, 286, 23749, 16613.0, 22507.4, 23646.8, 23749.0, 0.33507251926666987, 265.1264580890096, 0.18945994985879086], "isController": false}, {"data": ["Login-4", 1001, 0, 0.0, 11788.758241758233, 45, 23885, 10350.0, 18619.0, 19635.399999999998, 21496.68, 11.479621092226887, 1750.288170940704, 7.197430703685865], "isController": false}, {"data": ["Login-5", 1000, 0, 0.0, 11820.702000000001, 49, 30452, 10374.0, 18589.9, 19636.35, 21227.69, 11.454360102172892, 244.3559535468426, 7.2149045565444485], "isController": false}, {"data": ["Login-6", 1000, 0, 0.0, 11812.141000000016, 75, 23041, 10356.0, 18603.6, 19698.6, 21139.9, 11.463420226058648, 975.7340887727263, 7.131053402343124], "isController": false}, {"data": ["Login-7", 1000, 0, 0.0, 11821.634, 142, 28203, 10380.5, 18720.9, 19674.649999999998, 21124.74, 11.458954026676444, 82.46194552986204, 7.150655881881102], "isController": false}, {"data": ["Login-8", 1000, 153, 15.3, 10731.757999999998, 45, 32519, 10105.5, 18451.1, 19581.0, 25974.960000000006, 11.48171536827602, 561.0255750724783, 6.078133073081118], "isController": false}, {"data": ["Re Vote For Selected Poll-0", 21, 0, 0.0, 2887.238095238096, 21, 10743, 1108.0, 9995.6, 10691.4, 10743.0, 0.7504556337776507, 0.2711607270485652, 0.5364585194582425], "isController": false}, {"data": ["Re Vote For Selected Poll-4", 21, 0, 0.0, 1127.4761904761901, 5, 6126, 321.0, 4842.600000000001, 6037.399999999999, 6126.0, 2.1332791548151158, 45.509260875914265, 1.2416351330759854], "isController": false}, {"data": ["Show Vote Page", 24, 1, 4.166666666666667, 11726.666666666668, 1435, 21613, 12377.0, 18908.5, 21219.75, 21613.0, 0.27718426979268923, 224.6356881063406, 1.2465509867471272], "isController": false}, {"data": ["Re Vote For Selected Poll-3", 21, 0, 0.0, 1134.6666666666663, 6, 6682, 311.0, 4691.4000000000015, 6518.999999999998, 6682.0, 2.133062468257999, 325.4732533963941, 1.2352598082783137], "isController": false}, {"data": ["Re Vote For Selected Poll-2", 21, 0, 0.0, 1179.2380952380956, 5, 7055, 270.0, 4228.6, 6791.399999999996, 7055.0, 2.1332791548151158, 115.82830832867738, 1.2228856092543683], "isController": false}, {"data": ["Re Vote For Selected Poll-1", 21, 0, 0.0, 4014.333333333334, 13, 10315, 2908.0, 9917.2, 10275.699999999999, 10315.0, 1.094776352830779, 4.419731877541445, 0.6200881685955584], "isController": false}, {"data": ["Login Welcome-3", 1001, 0, 0.0, 10869.476523476515, 18, 23720, 10618.0, 19048.2, 19698.1, 21371.08, 15.407822432927487, 564.9585047745394, 9.253721480713285], "isController": false}, {"data": ["Login Welcome-2", 1001, 0, 0.0, 10953.030969030964, 16, 25842, 10764.0, 19014.2, 19968.7, 21734.260000000002, 15.393132294822308, 1310.7612925579358, 9.124639944294085], "isController": false}, {"data": ["Re Vote For Selected Poll-7", 21, 0, 0.0, 1111.619047619048, 6, 6543, 299.0, 4292.600000000001, 6348.399999999997, 6543.0, 2.133062468257999, 122.01367286693753, 1.2310936706449973], "isController": false}, {"data": ["Re Vote For Selected Poll-6", 21, 0, 0.0, 1088.4285714285716, 6, 6281, 336.0, 4111.000000000001, 6090.299999999997, 6281.0, 2.1334958854007926, 15.353253104998476, 1.2292603245961597], "isController": false}, {"data": ["Re Vote For Selected Poll", 24, 3, 12.5, 7190.25, 13, 25784, 5575.5, 18101.0, 23965.5, 25784.0, 0.8570510302467592, 286.6307013980645, 3.6337833781202016], "isController": false}, {"data": ["Re Vote For Selected Poll-5", 21, 0, 0.0, 1160.5238095238099, 6, 6860, 362.0, 4458.800000000001, 6654.899999999997, 6860.0, 2.1334958854007926, 181.59716930813775, 1.2250933404449862], "isController": false}, {"data": ["Show Selected Poll-6", 21, 0, 0.0, 12381.952380952383, 14, 19442, 12951.0, 17761.8, 19286.999999999996, 19442.0, 0.28291592008298866, 6.0354475334110225, 0.164665906610802], "isController": false}, {"data": ["Show Selected Poll-5", 21, 0, 0.0, 13384.095238095239, 16, 30364, 12383.0, 26204.800000000007, 30138.299999999996, 30364.0, 0.2829044860568503, 43.16696995402802, 0.1638304299137815], "isController": false}, {"data": ["Show Selected Poll-4", 21, 0, 0.0, 12118.809523809523, 15, 23605, 10971.0, 17366.4, 23005.89999999999, 23605.0, 0.282908297296205, 15.360760177120802, 0.1621749712039769], "isController": false}, {"data": ["Login", 1001, 153, 15.284715284715285, 32736.5054945055, 2023, 54090, 33077.0, 44931.0, 46772.1, 49993.40000000001, 11.409227683049147, 4339.6417056567425, 63.494460654691345], "isController": false}, {"data": ["Show Selected Poll-3", 21, 0, 0.0, 12138.952380952382, 14, 29050, 10922.0, 17270.2, 27894.999999999985, 29050.0, 0.2829121086382497, 16.182904151735194, 0.16328228145039608], "isController": false}, {"data": ["Show Selected Poll-2", 21, 0, 0.0, 11527.714285714286, 14, 16584, 11341.0, 16222.2, 16551.0, 16584.0, 0.2829121086382497, 2.0359173130422485, 0.16300600009430405], "isController": false}, {"data": ["Show Selected Poll-1", 21, 0, 0.0, 11378.285714285716, 15, 17610, 11645.0, 15999.6, 17463.8, 17610.0, 0.282908297296205, 24.080358586266822, 0.1624512488380552], "isController": false}, {"data": ["Show Selected Poll-0", 21, 0, 0.0, 6154.523809523808, 15, 11520, 6706.0, 11119.2, 11487.1, 11520.0, 0.27077208726597557, 1.7274941856529475, 0.15416028015240602], "isController": false}, {"data": ["Login Welcome", 1001, 0, 0.0, 18705.68631368632, 46, 38339, 18893.0, 31786.800000000003, 33901.299999999996, 36259.48, 15.365958491956283, 3737.4242693350498, 35.26367427353248], "isController": false}, {"data": ["Vote For Selected Poll", 24, 3, 12.5, 34018.20833333334, 14, 53799, 37900.0, 49093.0, 52897.75, 53799.0, 0.3633610900832702, 371.80908757570023, 1.5399377838758517], "isController": false}, {"data": ["Show Selected Poll", 24, 3, 12.5, 17961.291666666668, 13, 40379, 17776.0, 33770.5, 39912.5, 40379.0, 0.30916679548616477, 103.9330303659762, 1.112615514859329], "isController": false}, {"data": ["Show Vote Page-7", 22, 1, 4.545454545454546, 5020.772727272727, 7, 11311, 4650.0, 8891.6, 10961.049999999996, 11311.0, 0.26969708114204455, 14.758863897214766, 0.1485800103894671], "isController": false}, {"data": ["Show Vote Page-3", 24, 0, 0.0, 4231.166666666666, 12, 8383, 4672.5, 6646.5, 8218.75, 8383.0, 0.2915664407026751, 41.299598564642714, 0.16891776459654495], "isController": false}, {"data": ["Show Vote Page-4", 24, 0, 0.0, 4161.583333333333, 12, 7934, 4596.0, 6936.5, 7870.5, 7934.0, 0.2915664407026751, 7.769766344425007, 0.16951095803872976], "isController": false}, {"data": ["Show Vote Page-5", 24, 0, 0.0, 4269.583333333333, 13, 9474, 4279.5, 8794.0, 9458.25, 9474.0, 0.2915628986211505, 22.923776992346475, 0.16746833809147788], "isController": false}, {"data": ["Show Vote Page-6", 24, 0, 0.0, 4127.749999999999, 11, 8689, 4529.0, 6455.0, 8254.5, 8689.0, 0.29154873115562624, 3.3129739564984995, 0.16800590538028887], "isController": false}, {"data": ["Show Vote Page-0", 24, 0, 0.0, 6022.541666666665, 1360, 12131, 6001.0, 8630.0, 11256.5, 12131.0, 0.2774887270204648, 85.40853711411724, 0.15608740894901146], "isController": false}, {"data": ["Show Vote Page-1", 24, 0, 0.0, 154.08333333333334, 12, 491, 115.0, 385.0, 488.75, 491.0, 0.2912939520093214, 38.36226138929009, 0.15863762425507638], "isController": false}, {"data": ["Show Vote Page-2", 24, 0, 0.0, 4230.166666666666, 13, 8352, 4569.5, 6437.0, 7918.75, 8352.0, 0.29156998287026353, 18.219232533135713, 0.16728258294558573], "isController": false}, {"data": ["Vote For Selected Poll-6", 21, 0, 0.0, 13181.285714285716, 25, 26635, 10319.0, 24466.600000000006, 26524.3, 26635.0, 0.43255267873694614, 3.112774110949762, 0.2492246879441389], "isController": false}, {"data": ["Vote For Selected Poll-7", 21, 0, 0.0, 13453.952380952383, 25, 27528, 11356.0, 25584.2, 27361.899999999998, 27528.0, 0.43252595155709345, 24.740991295415224, 0.24963167711937717], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 7, 2.2082018927444795, 0.044359949302915085], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 154, 48.58044164037855, 0.9759188846641318], "isController": false}, {"data": ["403", 2, 0.6309148264984227, 0.012674271229404309], "isController": false}, {"data": ["Assertion failed", 154, 48.58044164037855, 0.9759188846641318], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15780, 317, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 154, "Assertion failed", 154, "500", 7, "403", 2, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 1000, 153, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 153, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Show Vote Page", 24, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Re Vote For Selected Poll", 24, 3, "500", 2, "403", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 1001, 153, "Assertion failed", 153, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Vote For Selected Poll", 24, 3, "500", 2, "403", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Selected Poll", 24, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Vote Page-7", 22, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
