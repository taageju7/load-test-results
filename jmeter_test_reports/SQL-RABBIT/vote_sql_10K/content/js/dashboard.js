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

    var data = {"OkPercent": 99.90243902439025, "KoPercent": 0.0975609756097561};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8301829268292683, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.917, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.883, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.575, 500, 1500, "Vote For Selected Poll-2"], "isController": false}, {"data": [0.6, 500, 1500, "Vote For Selected Poll-3"], "isController": false}, {"data": [0.65, 500, 1500, "Vote For Selected Poll-4"], "isController": false}, {"data": [0.55, 500, 1500, "Vote For Selected Poll-5"], "isController": false}, {"data": [0.693, 500, 1500, "Login-0"], "isController": false}, {"data": [0.861, 500, 1500, "Login-1"], "isController": false}, {"data": [0.984, 500, 1500, "Login-2"], "isController": false}, {"data": [0.2, 500, 1500, "Vote For Selected Poll-0"], "isController": false}, {"data": [0.91, 500, 1500, "Login-3"], "isController": false}, {"data": [0.0, 500, 1500, "Vote For Selected Poll-1"], "isController": false}, {"data": [0.896, 500, 1500, "Login-4"], "isController": false}, {"data": [0.898, 500, 1500, "Login-5"], "isController": false}, {"data": [0.899, 500, 1500, "Login-6"], "isController": false}, {"data": [0.885, 500, 1500, "Login-7"], "isController": false}, {"data": [0.889, 500, 1500, "Login-8"], "isController": false}, {"data": [0.475, 500, 1500, "Re Vote For Selected Poll-0"], "isController": false}, {"data": [0.775, 500, 1500, "Re Vote For Selected Poll-4"], "isController": false}, {"data": [0.0, 500, 1500, "Show Vote Page"], "isController": false}, {"data": [0.775, 500, 1500, "Re Vote For Selected Poll-3"], "isController": false}, {"data": [0.85, 500, 1500, "Re Vote For Selected Poll-2"], "isController": false}, {"data": [0.475, 500, 1500, "Re Vote For Selected Poll-1"], "isController": false}, {"data": [0.899, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.9, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [0.775, 500, 1500, "Re Vote For Selected Poll-7"], "isController": false}, {"data": [0.75, 500, 1500, "Re Vote For Selected Poll-6"], "isController": false}, {"data": [0.025, 500, 1500, "Re Vote For Selected Poll"], "isController": false}, {"data": [0.725, 500, 1500, "Re Vote For Selected Poll-5"], "isController": false}, {"data": [0.7, 500, 1500, "Show Selected Poll-6"], "isController": false}, {"data": [0.675, 500, 1500, "Show Selected Poll-5"], "isController": false}, {"data": [0.625, 500, 1500, "Show Selected Poll-4"], "isController": false}, {"data": [0.61, 500, 1500, "Login"], "isController": false}, {"data": [0.6, 500, 1500, "Show Selected Poll-3"], "isController": false}, {"data": [0.775, 500, 1500, "Show Selected Poll-2"], "isController": false}, {"data": [0.65, 500, 1500, "Show Selected Poll-1"], "isController": false}, {"data": [0.475, 500, 1500, "Show Selected Poll-0"], "isController": false}, {"data": [0.731, 500, 1500, "Login Welcome"], "isController": false}, {"data": [0.0, 500, 1500, "Vote For Selected Poll"], "isController": false}, {"data": [0.05, 500, 1500, "Show Selected Poll"], "isController": false}, {"data": [0.625, 500, 1500, "Show Vote Page-7"], "isController": false}, {"data": [0.65, 500, 1500, "Show Vote Page-3"], "isController": false}, {"data": [0.675, 500, 1500, "Show Vote Page-4"], "isController": false}, {"data": [0.775, 500, 1500, "Show Vote Page-5"], "isController": false}, {"data": [0.65, 500, 1500, "Show Vote Page-6"], "isController": false}, {"data": [0.0, 500, 1500, "Show Vote Page-0"], "isController": false}, {"data": [1.0, 500, 1500, "Show Vote Page-1"], "isController": false}, {"data": [0.75, 500, 1500, "Show Vote Page-2"], "isController": false}, {"data": [0.65, 500, 1500, "Vote For Selected Poll-6"], "isController": false}, {"data": [0.475, 500, 1500, "Vote For Selected Poll-7"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8200, 8, 0.0975609756097561, 481.4597560975618, 9, 9544, 90.0, 1310.800000000001, 2173.8499999999995, 4926.909999999998, 136.22167585886106, 12326.775372325405, 144.133980040202], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 500, 0, 0.0, 209.69600000000008, 11, 2600, 30.5, 693.2000000000013, 978.95, 1436.94, 8.365260745177428, 994.1017722850546, 5.040396366967259], "isController": false}, {"data": ["Login Welcome-0", 500, 0, 0.0, 288.8499999999996, 9, 3139, 30.0, 922.3000000000006, 1375.5999999999995, 2554.71, 8.356592515835743, 21.487214935737804, 4.170135523039126], "isController": false}, {"data": ["Vote For Selected Poll-2", 20, 0, 0.0, 845.05, 175, 2128, 866.0, 1582.3000000000002, 2101.2999999999997, 2128.0, 1.9016829894456593, 103.25358645526292, 1.0901249168013694], "isController": false}, {"data": ["Vote For Selected Poll-3", 20, 0, 0.0, 697.2, 208, 1566, 652.5, 1141.5000000000005, 1545.6499999999996, 1566.0, 2.0584602717167555, 314.09008015129683, 1.192057559695348], "isController": false}, {"data": ["Vote For Selected Poll-4", 20, 0, 0.0, 660.4499999999999, 45, 1418, 659.0, 1172.4, 1406.1499999999999, 1418.0, 2.0693222969477496, 44.14486872736679, 1.20441024314537], "isController": false}, {"data": ["Vote For Selected Poll-5", 20, 0, 0.0, 851.5500000000001, 389, 1329, 837.0, 1254.0, 1325.45, 1329.0, 2.00160128102482, 170.37067153722978, 1.1493569855884707], "isController": false}, {"data": ["Login-0", 500, 0, 0.0, 845.3400000000006, 190, 5123, 233.0, 2425.2000000000007, 2911.099999999998, 3653.8, 8.396446623788812, 3.5996485037532118, 6.149741179532822], "isController": false}, {"data": ["Login-1", 500, 0, 0.0, 299.92799999999977, 10, 3204, 27.0, 1065.5000000000005, 1505.85, 1924.6800000000003, 8.427581789681268, 39.693581026985115, 5.110867472062567], "isController": false}, {"data": ["Login-2", 500, 0, 0.0, 118.60799999999996, 68, 1536, 85.0, 112.0, 159.89999999999998, 1267.8200000000002, 8.418642241379311, 50.26521353886045, 4.842363554855873], "isController": false}, {"data": ["Vote For Selected Poll-0", 20, 0, 0.0, 1771.0499999999997, 423, 3346, 1717.5, 2831.000000000001, 3321.95, 3346.0, 1.9364833462432223, 0.6978147995739737, 1.382391920023238], "isController": false}, {"data": ["Login-3", 500, 0, 0.0, 231.84800000000016, 11, 2138, 34.0, 760.8000000000001, 1086.55, 1769.2600000000007, 8.429428821903027, 457.68341120018204, 5.235465557353834], "isController": false}, {"data": ["Vote For Selected Poll-1", 20, 0, 0.0, 3031.3499999999995, 1875, 5180, 3023.0, 4920.000000000003, 5173.05, 5180.0, 1.8111020556008333, 1433.0362701485105, 1.0240508693289867], "isController": false}, {"data": ["Login-4", 500, 0, 0.0, 248.59800000000004, 11, 2572, 39.0, 872.5000000000005, 1118.2499999999998, 1839.8200000000002, 8.429428821903027, 1286.2040675155101, 5.284856741857172], "isController": false}, {"data": ["Login-5", 500, 0, 0.0, 251.76200000000028, 10, 2671, 37.0, 854.8000000000001, 1168.2499999999995, 1888.8200000000002, 8.429428821903027, 179.82507091256997, 5.30955233410884], "isController": false}, {"data": ["Login-6", 500, 0, 0.0, 238.50599999999986, 10, 2163, 39.0, 774.2000000000003, 1022.8499999999992, 1784.7600000000002, 8.429428821903027, 717.4892735518241, 5.243697421437723], "isController": false}, {"data": ["Login-7", 500, 0, 0.0, 271.6939999999999, 10, 3327, 36.0, 885.7000000000005, 1270.9, 1959.9500000000019, 8.42971305256769, 60.66265184020636, 5.260338516201909], "isController": false}, {"data": ["Login-8", 500, 4, 0.8, 242.63600000000005, 10, 2342, 43.0, 810.0, 1079.1, 1664.5900000000004, 8.439103429651633, 479.04709072458144, 5.232244126384013], "isController": false}, {"data": ["Re Vote For Selected Poll-0", 20, 0, 0.0, 1015.8499999999998, 32, 2903, 881.0, 1947.1000000000004, 2856.249999999999, 2903.0, 2.0631318341242006, 0.7454675572519084, 1.4748168970497213], "isController": false}, {"data": ["Re Vote For Selected Poll-4", 20, 0, 0.0, 598.9, 160, 1996, 445.0, 1386.300000000001, 1967.7499999999995, 1996.0, 2.2740193291642976, 48.51167211483798, 1.3235503126776578], "isController": false}, {"data": ["Show Vote Page", 20, 0, 0.0, 5850.650000000001, 3941, 9544, 4949.5, 9357.4, 9535.85, 9544.0, 1.8125793003443902, 1494.0248606579662, 8.27697344571325], "isController": false}, {"data": ["Re Vote For Selected Poll-3", 20, 0, 0.0, 573.6499999999999, 137, 2428, 474.0, 920.6000000000003, 2353.249999999999, 2428.0, 2.3623907394283012, 360.46529869477916, 1.3680641684384598], "isController": false}, {"data": ["Re Vote For Selected Poll-2", 20, 0, 0.0, 427.6999999999999, 54, 1349, 358.0, 904.2000000000005, 1327.8499999999997, 1349.0, 2.3060071486221605, 125.2067299377378, 1.321900582266805], "isController": false}, {"data": ["Re Vote For Selected Poll-1", 20, 0, 0.0, 1097.0499999999997, 117, 3380, 931.0, 1981.7, 3310.3999999999987, 3380.0, 2.300701714022777, 9.288184458759922, 1.3031318302082135], "isController": false}, {"data": ["Login Welcome-3", 500, 0, 0.0, 238.82599999999948, 10, 2337, 33.0, 775.0, 1082.95, 1611.2200000000007, 8.362182864214875, 306.6160937526132, 5.022209435050926], "isController": false}, {"data": ["Login Welcome-2", 500, 0, 0.0, 239.8099999999994, 11, 2866, 30.0, 788.6000000000008, 1059.4499999999998, 1944.780000000003, 8.361763328650747, 712.0237453174126, 4.956631191885745], "isController": false}, {"data": ["Re Vote For Selected Poll-7", 20, 0, 0.0, 535.75, 56, 1759, 355.5, 1321.4000000000005, 1738.3999999999996, 1759.0, 2.4393218685205516, 139.5320694596902, 1.4078508049762166], "isController": false}, {"data": ["Re Vote For Selected Poll-6", 20, 0, 0.0, 587.65, 188, 1591, 489.0, 1135.5000000000002, 1568.5499999999997, 1591.0, 2.2163120567375887, 15.949222212987591, 1.276976673315603], "isController": false}, {"data": ["Re Vote For Selected Poll", 20, 0, 0.0, 3122.1500000000005, 1068, 6136, 3022.0, 5167.200000000002, 6090.799999999999, 6136.0, 1.7711654268508679, 676.8100480428623, 8.40092820138151], "isController": false}, {"data": ["Re Vote For Selected Poll-5", 20, 0, 0.0, 647.5500000000001, 20, 2604, 411.5, 1589.3000000000006, 2554.899999999999, 2604.0, 2.3665838362323988, 201.43696012306233, 1.3589368122115726], "isController": false}, {"data": ["Show Selected Poll-6", 20, 0, 0.0, 631.55, 153, 1309, 617.0, 1062.7000000000003, 1297.4499999999998, 1309.0, 2.1853146853146854, 46.61933525458917, 1.2719214379370631], "isController": false}, {"data": ["Show Selected Poll-5", 20, 0, 0.0, 734.6499999999999, 36, 2355, 809.0, 1345.3000000000004, 2305.399999999999, 2355.0, 2.268602540834846, 346.15463007599817, 1.3137512760889292], "isController": false}, {"data": ["Show Selected Poll-4", 20, 0, 0.0, 828.1, 253, 2529, 605.0, 1523.5, 2478.999999999999, 2529.0, 2.1331058020477816, 115.81889598442834, 1.2227862361348123], "isController": false}, {"data": ["Login", 500, 4, 0.8, 1644.2239999999995, 283, 8303, 358.5, 4786.600000000002, 5413.999999999999, 6529.790000000002, 8.382510729613733, 3255.782950077957, 47.42896608017033], "isController": false}, {"data": ["Show Selected Poll-3", 20, 0, 0.0, 910.0999999999998, 42, 2950, 674.0, 2127.7000000000007, 2911.0499999999993, 2950.0, 2.196112880202042, 125.62023031733833, 1.2674831173822336], "isController": false}, {"data": ["Show Selected Poll-2", 20, 0, 0.0, 609.4000000000002, 34, 1356, 457.0, 1290.2000000000003, 1353.1, 1356.0, 2.2737608003638017, 16.362639978399272, 1.3100770236471124], "isController": false}, {"data": ["Show Selected Poll-1", 20, 0, 0.0, 813.0500000000001, 39, 2531, 595.5, 2422.200000000002, 2530.85, 2531.0, 1.937046004842615, 164.87590799031477, 1.1122881355932204], "isController": false}, {"data": ["Show Selected Poll-0", 20, 0, 0.0, 1219.1, 179, 3370, 979.0, 3188.800000000003, 3368.35, 3370.0, 2.3142791020597087, 14.764829466558668, 1.3176022622078223], "isController": false}, {"data": ["Login Welcome", 500, 0, 0.0, 626.4680000000002, 21, 4573, 71.0, 1995.9, 2536.25, 3794.9500000000007, 8.349057391420509, 2030.720682806786, 19.160434443201364], "isController": false}, {"data": ["Vote For Selected Poll", 20, 0, 0.0, 6138.700000000001, 4739, 8503, 5812.5, 8372.500000000002, 8499.65, 8503.0, 1.4143271338660632, 1653.8290697263276, 6.705623276288805], "isController": false}, {"data": ["Show Selected Poll", 20, 0, 0.0, 2719.65, 1260, 5072, 2398.0, 4426.4000000000015, 5043.049999999999, 5072.0, 1.8971732119142477, 728.7201639869095, 7.647979510529312], "isController": false}, {"data": ["Show Vote Page-7", 20, 0, 0.0, 814.05, 193, 2571, 568.0, 1894.9000000000012, 2539.9999999999995, 2571.0, 3.0303030303030303, 173.33688446969697, 1.7489346590909092], "isController": false}, {"data": ["Show Vote Page-3", 20, 0, 0.0, 814.7500000000001, 156, 2157, 756.5, 1980.5000000000018, 2152.2, 2157.0, 2.937720329024677, 448.25194164952995, 1.7012384327262045], "isController": false}, {"data": ["Show Vote Page-4", 20, 0, 0.0, 685.1, 30, 2072, 553.5, 1482.4000000000005, 2043.9999999999995, 2072.0, 2.9515938606847696, 62.96637488931523, 1.7179198642266824], "isController": false}, {"data": ["Show Vote Page-5", 20, 0, 0.0, 562.75, 123, 1157, 442.5, 1108.3, 1154.7, 1157.0, 3.0783438510081576, 262.0199707557334, 1.7676427581960905], "isController": false}, {"data": ["Show Vote Page-6", 20, 0, 0.0, 720.1, 19, 1794, 543.0, 1727.0000000000002, 1791.1, 1794.0, 2.548095298764174, 18.33683032870429, 1.468140845967639], "isController": false}, {"data": ["Show Vote Page-0", 20, 0, 0.0, 4411.199999999999, 2880, 8170, 3325.5, 7283.900000000001, 8127.499999999999, 8170.0, 2.173676774263667, 669.0381819910879, 1.2226931855233125], "isController": false}, {"data": ["Show Vote Page-1", 20, 0, 0.0, 183.35, 89, 438, 166.0, 269.3, 429.64999999999986, 438.0, 3.2175032175032174, 446.3770411036036, 1.743861607142857], "isController": false}, {"data": ["Show Vote Page-2", 20, 0, 0.0, 654.1, 225, 1826, 431.5, 1474.2000000000005, 1809.4999999999998, 1826.0, 2.5371051630090067, 137.7544042559939, 1.454375713560827], "isController": false}, {"data": ["Vote For Selected Poll-6", 20, 0, 0.0, 680.9, 77, 1359, 692.5, 1189.3000000000004, 1351.3999999999999, 1359.0, 2.0652622883106155, 14.862224416563405, 1.189946045022718], "isController": false}, {"data": ["Vote For Selected Poll-7", 20, 0, 0.0, 1034.5000000000002, 214, 1668, 1004.0, 1637.7, 1666.6, 1668.0, 1.896633475580844, 108.48965742057847, 1.0946390469416785], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, 50.0, 0.04878048780487805], "isController": false}, {"data": ["Assertion failed", 4, 50.0, 0.04878048780487805], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8200, 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "Assertion failed", 4, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 500, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 500, 4, "Assertion failed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
