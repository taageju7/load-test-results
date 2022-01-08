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

    var data = {"OkPercent": 98.9284129097711, "KoPercent": 1.071587090228901};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1141652399974637, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.075, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.078, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-2"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-3"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-4"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-5"], "isController": false}, {"data": [0.0695, 500, 1500, "Login-0"], "isController": false}, {"data": [0.0405, 500, 1500, "Login-1"], "isController": false}, {"data": [0.9795, 500, 1500, "Login-2"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "Vote For Selected Poll-0"], "isController": false}, {"data": [0.042, 500, 1500, "Login-3"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-1"], "isController": false}, {"data": [0.0425, 500, 1500, "Login-4"], "isController": false}, {"data": [0.0415, 500, 1500, "Login-5"], "isController": false}, {"data": [0.0435, 500, 1500, "Login-6"], "isController": false}, {"data": [0.039, 500, 1500, "Login-7"], "isController": false}, {"data": [0.0405, 500, 1500, "Login-8"], "isController": false}, {"data": [0.11904761904761904, 500, 1500, "Re Vote For Selected Poll-0"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Re Vote For Selected Poll-4"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "Show Vote Page"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Re Vote For Selected Poll-3"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Re Vote For Selected Poll-2"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Re Vote For Selected Poll-1"], "isController": false}, {"data": [0.0715, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.0705, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Re Vote For Selected Poll-7"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Re Vote For Selected Poll-6"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "Re Vote For Selected Poll"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Re Vote For Selected Poll-5"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "Show Selected Poll-6"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "Show Selected Poll-5"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "Show Selected Poll-4"], "isController": false}, {"data": [0.003, 500, 1500, "Login"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "Show Selected Poll-3"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "Show Selected Poll-2"], "isController": false}, {"data": [0.11904761904761904, 500, 1500, "Show Selected Poll-1"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "Show Selected Poll-0"], "isController": false}, {"data": [0.04, 500, 1500, "Login Welcome"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "Vote For Selected Poll"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "Show Selected Poll"], "isController": false}, {"data": [0.3125, 500, 1500, "Show Vote Page-7"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "Show Vote Page-3"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "Show Vote Page-4"], "isController": false}, {"data": [0.3958333333333333, 500, 1500, "Show Vote Page-5"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "Show Vote Page-6"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "Show Vote Page-0"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "Show Vote Page-1"], "isController": false}, {"data": [0.4375, 500, 1500, "Show Vote Page-2"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-6"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-7"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15771, 169, 1.071587090228901, 5502.955361105851, 9, 26522, 5097.0, 9647.400000000009, 14199.4, 19369.680000000004, 179.4259189733438, 15657.810631246657, 188.95833866627984], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 1000, 0, 0.0, 4906.204000000002, 13, 9698, 5282.0, 7415.4, 7920.049999999997, 9059.230000000001, 13.036959780979075, 1549.2720691284792, 7.8552775242813375], "isController": false}, {"data": ["Login Welcome-0", 1000, 0, 0.0, 4449.6820000000025, 9, 10688, 4654.0, 6662.0, 7222.7, 8543.440000000002, 14.581723268055818, 37.493825551553684, 7.276621669898949], "isController": false}, {"data": ["Vote For Selected Poll-2", 21, 0, 0.0, 4112.571428571428, 13, 5695, 4183.0, 5276.4, 5653.4, 5695.0, 0.30726461335869487, 16.683208240361402, 0.17613703910307996], "isController": false}, {"data": ["Vote For Selected Poll-3", 21, 0, 0.0, 4172.523809523809, 13, 5852, 4196.0, 5640.6, 5839.5, 5852.0, 0.30726461335869487, 46.8839590268125, 0.17793741769697857], "isController": false}, {"data": ["Vote For Selected Poll-4", 21, 0, 0.0, 4711.190476190475, 13, 9353, 4807.0, 5743.6, 8995.299999999996, 9353.0, 0.30726461335869487, 6.5548783972858295, 0.17883760699392787], "isController": false}, {"data": ["Vote For Selected Poll-5", 21, 0, 0.0, 4667.047619047619, 14, 9781, 4471.0, 7883.800000000002, 9648.999999999998, 9781.0, 0.3072601176367308, 26.153117044157668, 0.17643452067421647], "isController": false}, {"data": ["Login-0", 1000, 0, 0.0, 3892.280999999998, 241, 12625, 3300.5, 7547.5, 8853.299999999997, 10421.93, 12.252949897687868, 5.252973637778295, 8.974328538345606], "isController": false}, {"data": ["Login-1", 1000, 0, 0.0, 5492.267999999997, 18, 11209, 5659.0, 7996.9, 8505.05, 9475.62, 11.796765326947352, 55.56230387877643, 7.15409303518975], "isController": false}, {"data": ["Login-2", 1000, 0, 0.0, 143.23899999999995, 70, 2311, 95.0, 150.0, 190.94999999999993, 1757.930000000001, 11.79036726994046, 70.39678270353122, 6.781763986323174], "isController": false}, {"data": ["Vote For Selected Poll-0", 21, 0, 0.0, 2742.333333333333, 42, 4674, 2531.0, 4663.6, 4673.2, 4674.0, 0.28625173795698045, 0.10315126104113848, 0.20434572309233665], "isController": false}, {"data": ["Login-3", 1000, 0, 0.0, 4976.539999999985, 24, 9878, 5077.0, 7279.4, 7732.149999999999, 8674.25, 11.738604749439482, 637.3580912735213, 7.290774043597179], "isController": false}, {"data": ["Vote For Selected Poll-1", 21, 0, 0.0, 4847.666666666667, 276, 7278, 5092.0, 6496.400000000001, 7207.699999999999, 7278.0, 0.293866584570605, 232.52222202057766, 0.16616089108044949], "isController": false}, {"data": ["Login-4", 1000, 0, 0.0, 4998.839000000007, 28, 10204, 5065.5, 7337.3, 7804.799999999999, 8962.550000000001, 11.730893307525367, 1789.9578970907385, 7.354720218194615], "isController": false}, {"data": ["Login-5", 1000, 0, 0.0, 5020.823999999999, 23, 11452, 5162.5, 7330.6, 7783.599999999999, 8763.990000000002, 11.735023176670774, 250.3433411077862, 7.391689403274071], "isController": false}, {"data": ["Login-6", 1000, 0, 0.0, 5002.4249999999965, 29, 9843, 5094.5, 7444.2, 7851.799999999999, 8873.310000000001, 11.743291644647995, 999.5559567846867, 7.305153103164817], "isController": false}, {"data": ["Login-7", 1000, 0, 0.0, 5027.420000000001, 22, 10893, 5143.5, 7345.799999999999, 7751.9, 8545.36, 11.734472359450358, 84.44465509452118, 7.3225857789929485], "isController": false}, {"data": ["Login-8", 1000, 80, 8.0, 4777.723999999994, 9, 11005, 4901.0, 7410.3, 7838.949999999997, 9064.34, 11.747706260352667, 620.7616478507571, 6.754931099702783], "isController": false}, {"data": ["Re Vote For Selected Poll-0", 21, 0, 0.0, 3329.0000000000005, 13, 6460, 3226.0, 6223.0, 6437.5, 6460.0, 0.32390912035537456, 0.11703747512840683, 0.2315444102540373], "isController": false}, {"data": ["Re Vote For Selected Poll-4", 21, 0, 0.0, 5308.809523809524, 12, 7067, 5601.0, 6256.8, 6989.199999999999, 7067.0, 0.36091155948166226, 7.69932911804386, 0.21006180610456124], "isController": false}, {"data": ["Show Vote Page", 24, 0, 0.0, 8307.916666666666, 1158, 14351, 9095.0, 11861.0, 13775.75, 14351.0, 0.2848428023784374, 234.78232891629182, 1.3007079530484114], "isController": false}, {"data": ["Re Vote For Selected Poll-3", 21, 0, 0.0, 5543.523809523811, 13, 8325, 5531.0, 7529.000000000001, 8259.9, 8325.0, 0.3609053568666541, 55.06872977963291, 0.20900085607609947], "isController": false}, {"data": ["Re Vote For Selected Poll-2", 21, 0, 0.0, 5367.047619047618, 13, 8827, 5140.0, 7781.200000000001, 8741.9, 8827.0, 0.3609053568666541, 19.59568060198154, 0.20688617625070893], "isController": false}, {"data": ["Re Vote For Selected Poll-1", 21, 0, 0.0, 5317.4285714285725, 11, 6967, 5775.0, 6625.2, 6933.7, 6967.0, 0.3357582540570789, 1.355492795187465, 0.19017557358701734], "isController": false}, {"data": ["Login Welcome-3", 1000, 0, 0.0, 4920.304000000002, 11, 10019, 5291.0, 7461.4, 7918.799999999998, 8882.080000000002, 13.014732677390805, 477.21110140428965, 7.816465426362643], "isController": false}, {"data": ["Login Welcome-2", 1000, 0, 0.0, 4887.854000000004, 13, 9632, 5252.0, 7462.9, 7916.399999999998, 8710.75, 13.182177695755339, 1122.4933265225416, 7.814044786448721], "isController": false}, {"data": ["Re Vote For Selected Poll-7", 21, 0, 0.0, 5690.238095238096, 13, 9633, 5657.0, 7842.0, 9458.899999999998, 9633.0, 0.3609053568666541, 20.644209348737693, 0.2082959628009693], "isController": false}, {"data": ["Re Vote For Selected Poll-6", 21, 0, 0.0, 5590.238095238095, 13, 11318, 5435.0, 8442.2, 11082.899999999996, 11318.0, 0.3609053568666541, 2.597179272217162, 0.2079435161634042], "isController": false}, {"data": ["Re Vote For Selected Poll", 24, 3, 12.5, 13506.000000000002, 14, 20346, 15509.5, 19991.5, 20286.75, 20346.0, 0.3700448679402377, 123.7576936086313, 1.5689414548545262], "isController": false}, {"data": ["Re Vote For Selected Poll-5", 21, 0, 0.0, 5773.904761904762, 13, 8663, 5782.0, 7679.8, 8566.699999999999, 8663.0, 0.3609053568666541, 30.719248930173407, 0.20723862288827402], "isController": false}, {"data": ["Show Selected Poll-6", 21, 0, 0.0, 1919.095238095238, 23, 3887, 1528.0, 3343.0, 3834.6999999999994, 3887.0, 0.2774804772664209, 5.919493189340786, 0.16150230903397153], "isController": false}, {"data": ["Show Selected Poll-5", 21, 0, 0.0, 2226.666666666667, 26, 3831, 2070.0, 3747.8, 3825.2, 3831.0, 0.27747314456350836, 42.3382289244282, 0.16068513156851602], "isController": false}, {"data": ["Show Selected Poll-4", 21, 0, 0.0, 2150.666666666666, 24, 4441, 2014.0, 3882.2000000000007, 4399.4, 4441.0, 0.2774804772664209, 15.066051812046616, 0.15906351577674716], "isController": false}, {"data": ["Login", 1000, 80, 8.0, 15235.407000000021, 981, 26522, 15721.0, 20456.399999999998, 22025.499999999996, 25202.7, 11.690027237763465, 4494.556100440714, 65.61712749728207], "isController": false}, {"data": ["Show Selected Poll-3", 21, 0, 0.0, 2229.0476190476193, 24, 4288, 2316.0, 3735.4, 4238.999999999999, 4288.0, 0.27747681086652043, 15.871998749702703, 0.16014530783409528], "isController": false}, {"data": ["Show Selected Poll-2", 21, 0, 0.0, 2157.571428571428, 24, 3772, 2281.0, 3589.2000000000007, 3766.9, 3772.0, 0.27747681086652043, 1.9968033391361222, 0.15987433438598345], "isController": false}, {"data": ["Show Selected Poll-1", 21, 0, 0.0, 2289.285714285714, 25, 4537, 2193.0, 3976.8000000000006, 4498.799999999999, 4537.0, 0.27747314456350836, 23.61773367202674, 0.15933028222982704], "isController": false}, {"data": ["Show Selected Poll-0", 21, 0, 0.0, 1855.4761904761906, 31, 4446, 1563.0, 4190.800000000001, 4442.7, 4446.0, 0.2723629430761449, 1.7376436592934128, 0.1550660115365161], "isController": false}, {"data": ["Login Welcome", 1000, 0, 0.0, 9885.876000000002, 26, 18234, 10325.5, 14533.0, 15196.4, 16718.230000000003, 12.998154262094783, 3161.5090735240597, 29.8297485507058], "isController": false}, {"data": ["Vote For Selected Poll", 24, 3, 12.5, 11446.041666666666, 14, 20419, 12789.5, 16673.0, 19589.75, 20419.0, 0.3257992262268377, 333.3743763999185, 1.3807492109549988], "isController": false}, {"data": ["Show Selected Poll", 24, 3, 12.5, 4397.250000000002, 15, 8854, 4746.5, 7607.5, 8580.0, 8854.0, 0.3111670059251384, 104.60544388297527, 1.1198137819432379], "isController": false}, {"data": ["Show Vote Page-7", 24, 0, 0.0, 1681.2916666666667, 12, 4637, 1699.5, 3343.5, 4402.75, 4637.0, 0.3003115732572544, 17.178173917939862, 0.17332435526859116], "isController": false}, {"data": ["Show Vote Page-3", 24, 0, 0.0, 1735.9166666666665, 12, 6524, 1439.5, 3461.0, 5778.75, 6524.0, 0.3001801080648389, 45.80297006328797, 0.17383476961176705], "isController": false}, {"data": ["Show Vote Page-4", 24, 0, 0.0, 1524.625, 11, 4994, 1441.5, 2811.0, 4479.0, 4994.0, 0.300187617260788, 6.40390478424015, 0.174718574108818], "isController": false}, {"data": ["Show Vote Page-5", 24, 0, 0.0, 1401.7083333333333, 11, 3687, 1141.5, 3086.0, 3652.0, 3687.0, 0.3001838626158522, 25.550806118747737, 0.1723712023614464], "isController": false}, {"data": ["Show Vote Page-6", 24, 0, 0.0, 1717.4166666666672, 11, 4634, 1638.0, 3428.5, 4338.0, 4634.0, 0.3001913719996498, 2.1602638869779485, 0.1729618256638607], "isController": false}, {"data": ["Show Vote Page-0", 24, 0, 0.0, 5582.000000000001, 1079, 8637, 6314.0, 8381.0, 8593.5, 8637.0, 0.28520838037290996, 87.78457705973928, 0.16042971395976185], "isController": false}, {"data": ["Show Vote Page-1", 24, 0, 0.0, 132.0416666666667, 76, 518, 108.5, 183.5, 443.5, 518.0, 0.2998463287565123, 41.598504984945215, 0.16251436763658625], "isController": false}, {"data": ["Show Vote Page-2", 24, 0, 0.0, 1258.625, 12, 2945, 1008.5, 2667.5, 2885.5, 2945.0, 0.3001838626158522, 16.298752517166765, 0.1720780540581106], "isController": false}, {"data": ["Vote For Selected Poll-6", 21, 0, 0.0, 4449.142857142858, 13, 6795, 4533.0, 5483.2, 6664.499999999998, 6795.0, 0.30726461335869487, 2.2111649764064674, 0.17703722840002928], "isController": false}, {"data": ["Vote For Selected Poll-7", 21, 0, 0.0, 4294.380952380952, 12, 6537, 4372.0, 5911.0, 6479.499999999999, 6537.0, 0.30726461335869487, 17.575895959836124, 0.17733729149901237], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 3, 1.7751479289940828, 0.019022256039566292], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 80, 47.337278106508876, 0.5072601610551012], "isController": false}, {"data": ["403", 6, 3.5502958579881656, 0.038044512079132585], "isController": false}, {"data": ["Assertion failed", 80, 47.337278106508876, 0.5072601610551012], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15771, 169, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 80, "Assertion failed", 80, "403", 6, "500", 3, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 1000, 80, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 80, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Re Vote For Selected Poll", 24, 3, "403", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 1000, 80, "Assertion failed", 80, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Vote For Selected Poll", 24, 3, "403", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Selected Poll", 24, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
