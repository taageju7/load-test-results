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

    var data = {"OkPercent": 99.27146024707001, "KoPercent": 0.7285397529299968};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5304719670573329, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7052947052947053, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.6508491508491508, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "Vote For Selected Poll-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "Vote For Selected Poll-3"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "Vote For Selected Poll-4"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "Vote For Selected Poll-5"], "isController": false}, {"data": [0.11638361638361638, 500, 1500, "Login-0"], "isController": false}, {"data": [0.5659340659340659, 500, 1500, "Login-1"], "isController": false}, {"data": [0.47652347652347654, 500, 1500, "Login-2"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-0"], "isController": false}, {"data": [0.5979020979020979, 500, 1500, "Login-3"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-1"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "Login-4"], "isController": false}, {"data": [0.595, 500, 1500, "Login-5"], "isController": false}, {"data": [0.592, 500, 1500, "Login-6"], "isController": false}, {"data": [0.5965, 500, 1500, "Login-7"], "isController": false}, {"data": [0.665, 500, 1500, "Login-8"], "isController": false}, {"data": [0.5, 500, 1500, "Re Vote For Selected Poll-0"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-4"], "isController": false}, {"data": [0.0, 500, 1500, "Show Vote Page"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-3"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-2"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-1"], "isController": false}, {"data": [0.6973026973026973, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.7162837162837162, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-7"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-6"], "isController": false}, {"data": [0.4375, 500, 1500, "Re Vote For Selected Poll"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-5"], "isController": false}, {"data": [0.11904761904761904, 500, 1500, "Show Selected Poll-6"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "Show Selected Poll-5"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "Show Selected Poll-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "Show Selected Poll-3"], "isController": false}, {"data": [0.11904761904761904, 500, 1500, "Show Selected Poll-2"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "Show Selected Poll-1"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "Show Selected Poll-0"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "Login Welcome"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "Vote For Selected Poll"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "Show Selected Poll"], "isController": false}, {"data": [0.11363636363636363, 500, 1500, "Show Vote Page-7"], "isController": false}, {"data": [0.0, 500, 1500, "Show Vote Page-8"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "Show Vote Page-3"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "Show Vote Page-4"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "Show Vote Page-5"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "Show Vote Page-6"], "isController": false}, {"data": [0.0, 500, 1500, "Show Vote Page-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "Show Vote Page-1"], "isController": false}, {"data": [0.3958333333333333, 500, 1500, "Show Vote Page-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "Vote For Selected Poll-6"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "Vote For Selected Poll-7"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15785, 115, 0.7285397529299968, 2655.5303135888394, 0, 29153, 654.0, 7946.4, 10748.699999999999, 21512.79999999999, 238.99285368217053, 20907.655893370164, 252.18493439430412], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 1001, 1, 0.0999000999000999, 964.5074925074919, 0, 7947, 264.0, 3493.400000000001, 4607.999999999995, 6238.82, 19.522945799933687, 2317.7613392709122, 11.7515858736567], "isController": false}, {"data": ["Login Welcome-0", 1001, 0, 0.0, 1184.1478521478525, 3, 6698, 345.0, 4146.8, 4926.0, 5978.6, 20.350078269531807, 52.32593367546606, 10.155166011455814], "isController": false}, {"data": ["Vote For Selected Poll-2", 21, 0, 0.0, 406.6190476190476, 4, 3031, 10.0, 1887.4, 2920.1999999999985, 3031.0, 1.4172909495849362, 76.95308545505164, 0.8124509642640211], "isController": false}, {"data": ["Vote For Selected Poll-3", 21, 0, 0.0, 514.142857142857, 4, 3026, 13.0, 2629.0000000000005, 3003.7999999999997, 3026.0, 1.4170996693434106, 216.22809769130845, 0.8206446327350023], "isController": false}, {"data": ["Vote For Selected Poll-4", 21, 0, 0.0, 408.04761904761915, 4, 3033, 9.0, 1894.4, 2922.7999999999984, 3033.0, 1.417195303009853, 30.2330384709475, 0.8248519537049535], "isController": false}, {"data": ["Vote For Selected Poll-5", 21, 0, 0.0, 514.7619047619048, 6, 3031, 16.0, 2608.4000000000005, 3005.9999999999995, 3031.0, 1.417195303009853, 120.62767833040897, 0.813780115400189], "isController": false}, {"data": ["Login-0", 1001, 0, 0.0, 6682.762237762235, 222, 20168, 6509.0, 12913.000000000018, 15274.8, 17565.72000000001, 16.849298927771887, 7.221982885589726, 12.340795113114174], "isController": false}, {"data": ["Login-1", 1001, 0, 0.0, 1532.0339660339662, 2, 6416, 510.0, 4477.8, 4637.2, 5963.34, 17.76019303786239, 83.61180086427912, 10.7707764096377], "isController": false}, {"data": ["Login-2", 1001, 18, 1.7982017982017982, 2474.57142857143, 21, 12068, 756.0, 8500.200000000003, 10143.0, 11685.78, 17.74570982839314, 106.92881550489292, 10.02503523436392], "isController": false}, {"data": ["Vote For Selected Poll-0", 21, 0, 0.0, 5563.380952380951, 26, 10131, 5905.0, 9062.0, 10050.8, 10131.0, 0.6508197229367466, 0.23452390406607368, 0.4645988451823844], "isController": false}, {"data": ["Login-3", 1001, 2, 0.1998001998001998, 1572.5194805194806, 1, 11516, 398.0, 5145.200000000001, 6068.299999999999, 7118.9000000000015, 17.772490811924083, 963.6573209712284, 11.016675026188235], "isController": false}, {"data": ["Vote For Selected Poll-1", 21, 0, 0.0, 12481.380952380954, 286, 15209, 13450.0, 14953.8, 15183.5, 15209.0, 0.8760585707730174, 693.182199650098, 0.49534952390388387], "isController": false}, {"data": ["Login-4", 1001, 1, 0.0999000999000999, 1577.856143856144, 4, 8785, 464.0, 5154.0, 6050.7, 8313.500000000007, 17.77375308510449, 2704.941539073181, 11.132559338322768], "isController": false}, {"data": ["Login-5", 1000, 0, 0.0, 1504.2460000000008, 3, 9165, 404.0, 5079.9, 5962.0, 7071.51, 17.76104292844076, 378.8964675505746, 11.1873756726995], "isController": false}, {"data": ["Login-6", 1000, 0, 0.0, 1542.0010000000034, 4, 11527, 453.0, 5009.5, 6051.599999999999, 8235.180000000002, 17.760727479397556, 1512.9414477379494, 11.048421293336174], "isController": false}, {"data": ["Login-7", 1000, 1, 0.1, 1518.3819999999967, 3, 11484, 442.5, 5156.8, 6101.549999999999, 8349.0, 17.762304836675607, 127.74281903319775, 11.073010427583084], "isController": false}, {"data": ["Login-8", 1000, 31, 3.1, 1242.5169999999996, 0, 10368, 230.5, 4227.0, 6138.799999999999, 8662.92, 17.811976773182288, 988.5949251729987, 10.787378433258523], "isController": false}, {"data": ["Re Vote For Selected Poll-0", 21, 0, 0.0, 2000.857142857142, 4, 7046, 699.0, 6970.2, 7039.5, 7046.0, 1.782985226693836, 0.6442427088639837, 1.2745558456444217], "isController": false}, {"data": ["Re Vote For Selected Poll-4", 21, 0, 0.0, 6.523809523809525, 3, 12, 6.0, 9.8, 11.799999999999997, 12.0, 4.435994930291509, 94.63311450411913, 2.5818876742712296], "isController": false}, {"data": ["Show Vote Page", 24, 0, 0.0, 11924.666666666664, 3219, 24295, 9735.5, 19908.5, 23282.5, 24295.0, 0.48060556300939183, 391.18144330606566, 2.225734112481727], "isController": false}, {"data": ["Re Vote For Selected Poll-3", 21, 0, 0.0, 8.238095238095239, 6, 15, 7.0, 11.0, 14.599999999999994, 15.0, 4.4350580781415, 676.7231636087645, 2.568349062829989], "isController": false}, {"data": ["Re Vote For Selected Poll-2", 21, 0, 0.0, 7.80952380952381, 4, 20, 7.0, 10.8, 19.099999999999987, 20.0, 4.454815443360204, 241.87820687049214, 2.5536881496605854], "isController": false}, {"data": ["Re Vote For Selected Poll-1", 21, 0, 0.0, 4.190476190476191, 3, 8, 4.0, 6.800000000000001, 7.899999999999999, 8.0, 4.4350580781415, 17.904814545934528, 2.5120446145723334], "isController": false}, {"data": ["Login Welcome-3", 1001, 0, 0.0, 1013.0089910089898, 4, 8276, 294.0, 3444.8, 4688.4, 6250.98, 19.526754189181283, 715.9873433019429, 11.727493971041492], "isController": false}, {"data": ["Login Welcome-2", 1001, 1, 0.0999000999000999, 962.2947052947046, 0, 6759, 254.0, 3515.6000000000004, 4923.9, 6299.700000000001, 19.521803572821593, 1660.6990957940848, 11.560446163897339], "isController": false}, {"data": ["Re Vote For Selected Poll-7", 21, 0, 0.0, 7.0, 5, 11, 6.0, 10.8, 11.0, 11.0, 4.435994930291509, 253.7441084442332, 2.5602275427756656], "isController": false}, {"data": ["Re Vote For Selected Poll-6", 21, 0, 0.0, 6.761904761904762, 4, 20, 6.0, 10.8, 19.099999999999987, 20.0, 4.436932178322417, 31.929446505915912, 2.5564355324318617], "isController": false}, {"data": ["Re Vote For Selected Poll", 24, 3, 12.5, 1769.0000000000002, 5, 7086, 415.0, 6975.0, 7065.25, 7086.0, 2.035796081092544, 680.8482086054797, 8.631506992747477], "isController": false}, {"data": ["Re Vote For Selected Poll-5", 21, 0, 0.0, 8.666666666666666, 5, 22, 7.0, 15.400000000000002, 21.39999999999999, 22.0, 4.455760661998728, 379.26181572246975, 2.5585813176320813], "isController": false}, {"data": ["Show Selected Poll-6", 21, 0, 0.0, 4322.047619047619, 5, 11654, 4018.0, 7478.200000000001, 11244.599999999995, 11654.0, 0.5766062602965404, 12.300745855642504, 0.33560286243822074], "isController": false}, {"data": ["Show Selected Poll-5", 21, 0, 0.0, 3846.5238095238083, 6, 8573, 3612.0, 7964.800000000001, 8547.5, 8573.0, 0.5817174515235457, 88.76133461738227, 0.3368734851108033], "isController": false}, {"data": ["Show Selected Poll-4", 21, 0, 0.0, 4296.666666666667, 5, 8314, 4818.0, 6366.6, 8131.399999999998, 8314.0, 0.5817335660267597, 31.58574661867365, 0.33347422193135545], "isController": false}, {"data": ["Login", 1001, 50, 4.995004995004995, 12812.727272727268, 1675, 29153, 10645.0, 23362.600000000002, 25118.1, 27886.98, 16.81307422275224, 6500.16033556339, 94.6328051516284], "isController": false}, {"data": ["Show Selected Poll-3", 21, 0, 0.0, 3794.47619047619, 5, 8317, 3611.0, 7598.4000000000015, 8273.699999999999, 8317.0, 0.5765904285988853, 32.98164820776475, 0.3327782649433019], "isController": false}, {"data": ["Show Selected Poll-2", 21, 0, 0.0, 3910.2380952380945, 4, 8525, 4005.0, 6452.200000000001, 8327.399999999998, 8525.0, 0.5766062602965404, 4.1494253243410215, 0.3322243101317957], "isController": false}, {"data": ["Show Selected Poll-1", 21, 0, 0.0, 4410.0952380952385, 6, 6776, 4954.0, 6434.200000000001, 6750.4, 6776.0, 0.5817013379130772, 49.51278184814825, 0.3340238151297748], "isController": false}, {"data": ["Show Selected Poll-0", 21, 0, 0.0, 4584.0, 7, 7394, 4082.0, 7384.8, 7393.4, 7394.0, 0.5146806529091712, 3.283602251421499, 0.293026192037155], "isController": false}, {"data": ["Login Welcome", 1001, 1, 0.0999000999000999, 2593.0699300699275, 9, 12670, 1320.0, 9395.200000000004, 10302.799999999996, 12118.840000000004, 19.18359524722116, 4662.133068524818, 44.00194489028363], "isController": false}, {"data": ["Vote For Selected Poll", 24, 3, 12.5, 16289.375, 19, 25091, 18423.0, 22357.5, 24436.25, 25091.0, 0.7368744243168559, 754.006454847252, 3.1229011552041754], "isController": false}, {"data": ["Show Selected Poll", 24, 3, 12.5, 9711.666666666666, 11, 17183, 9688.5, 16794.0, 17092.0, 17183.0, 0.5881055649489083, 197.70426330588842, 2.116447773469088], "isController": false}, {"data": ["Show Vote Page-7", 22, 0, 0.0, 3466.636363636364, 4, 6070, 3420.5, 5733.699999999999, 6060.099999999999, 6070.0, 0.5005916082643124, 22.945330098923726, 0.28880456021889506], "isController": false}, {"data": ["Show Vote Page-8", 5, 0, 0.0, 4514.6, 2166, 6615, 4680.0, 6615.0, 6615.0, 6615.0, 0.2917152858809801, 16.686456206242706, 0.1683630214410735], "isController": false}, {"data": ["Show Vote Page-3", 24, 0, 0.0, 3156.833333333332, 4, 6099, 3240.5, 5888.5, 6059.5, 6099.0, 0.5408206954052776, 65.53146548324582, 0.31266196453117606], "isController": false}, {"data": ["Show Vote Page-4", 24, 0, 0.0, 3151.2083333333335, 5, 6099, 3237.0, 5881.5, 6047.5, 6099.0, 0.5408328826392645, 29.200926457995315, 0.31409943578736255], "isController": false}, {"data": ["Show Vote Page-5", 24, 0, 0.0, 3154.2916666666674, 5, 6096, 3239.0, 5888.0, 6052.25, 6096.0, 0.5408085087205372, 35.33394485302402, 0.3115106302672495], "isController": false}, {"data": ["Show Vote Page-6", 24, 0, 0.0, 3168.833333333333, 5, 6104, 3253.0, 5859.5, 6059.75, 6104.0, 0.5408450704225352, 14.925638204225352, 0.311443661971831], "isController": false}, {"data": ["Show Vote Page-0", 24, 0, 0.0, 8196.625, 3210, 19718, 6264.5, 13045.5, 18198.75, 19718.0, 0.48156025522693524, 148.2199200409326, 0.2708776435651511], "isController": false}, {"data": ["Show Vote Page-1", 24, 0, 0.0, 412.5416666666667, 5, 1157, 212.0, 1098.0, 1150.75, 1157.0, 0.5397503654559767, 71.08281267569998, 0.2939460811874508], "isController": false}, {"data": ["Show Vote Page-2", 24, 0, 0.0, 2270.333333333333, 5, 6152, 1815.5, 5881.5, 6087.25, 6152.0, 0.5408206954052776, 28.349228450267027, 0.3051138892331613], "isController": false}, {"data": ["Vote For Selected Poll-6", 21, 0, 0.0, 375.47619047619054, 4, 3034, 8.0, 1886.2, 2922.6999999999985, 3034.0, 1.4172909495849362, 10.199235358878315, 0.8166031838428832], "isController": false}, {"data": ["Vote For Selected Poll-7", 21, 0, 0.0, 510.80952380952374, 4, 3031, 8.0, 2705.4000000000005, 3018.0, 3031.0, 1.4172909495849362, 81.0707032040899, 0.8179872570358372], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 13, 11.304347826086957, 0.08235666772252138], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 6, 5.217391304347826, 0.03801076971808679], "isController": false}, {"data": ["500", 7, 6.086956521739131, 0.04434589800443459], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 28, 24.347826086956523, 0.17738359201773837], "isController": false}, {"data": ["403", 2, 1.7391304347826086, 0.012670256572695597], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 0.8695652173913043, 0.0063351282863477985], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, 0.8695652173913043, 0.0063351282863477985], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 3, 2.608695652173913, 0.019005384859043396], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 3, 2.608695652173913, 0.019005384859043396], "isController": false}, {"data": ["Assertion failed", 51, 44.34782608695652, 0.32309154260373774], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15785, 115, "Assertion failed", 51, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 28, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 13, "500", 7, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 6], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Login Welcome-1", 1001, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-2", 1001, 18, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 13, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-3", 1001, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-4", 1001, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-7", 1000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Login-8", 1000, 31, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 26, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login Welcome-2", 1001, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Re Vote For Selected Poll", 24, 3, "500", 2, "403", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 1001, 50, "Assertion failed", 50, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login Welcome", 1001, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Vote For Selected Poll", 24, 3, "500", 2, "403", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Show Selected Poll", 24, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
