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

    var data = {"OkPercent": 99.85416270369666, "KoPercent": 0.14583729630334158};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9336123264219136, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.999, 500, 1500, "Login Welcome-1"], "isController": false}, {"data": [0.9935, 500, 1500, "Login Welcome-0"], "isController": false}, {"data": [1.0, 500, 1500, "Vote For Selected Poll-2"], "isController": false}, {"data": [1.0, 500, 1500, "Vote For Selected Poll-3"], "isController": false}, {"data": [1.0, 500, 1500, "Vote For Selected Poll-4"], "isController": false}, {"data": [1.0, 500, 1500, "Vote For Selected Poll-5"], "isController": false}, {"data": [0.7515, 500, 1500, "Login-0"], "isController": false}, {"data": [0.9415, 500, 1500, "Login-1"], "isController": false}, {"data": [0.896, 500, 1500, "Login-2"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "Vote For Selected Poll-0"], "isController": false}, {"data": [0.9835, 500, 1500, "Login-3"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "Vote For Selected Poll-1"], "isController": false}, {"data": [0.983, 500, 1500, "Login-4"], "isController": false}, {"data": [0.9815, 500, 1500, "Login-5"], "isController": false}, {"data": [0.981, 500, 1500, "Login-6"], "isController": false}, {"data": [0.983, 500, 1500, "Login-7"], "isController": false}, {"data": [0.9815, 500, 1500, "Login-8"], "isController": false}, {"data": [0.47619047619047616, 500, 1500, "Re Vote For Selected Poll-0"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-4"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "Show Vote Page"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-3"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-2"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-1"], "isController": false}, {"data": [0.9995, 500, 1500, "Login Welcome-3"], "isController": false}, {"data": [0.9995, 500, 1500, "Login Welcome-2"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-7"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-6"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "Re Vote For Selected Poll"], "isController": false}, {"data": [1.0, 500, 1500, "Re Vote For Selected Poll-5"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "Show Selected Poll-6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Show Selected Poll-5"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "Show Selected Poll-4"], "isController": false}, {"data": [0.6915, 500, 1500, "Login"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "Show Selected Poll-3"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "Show Selected Poll-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "Show Selected Poll-1"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "Show Selected Poll-0"], "isController": false}, {"data": [0.9915, 500, 1500, "Login Welcome"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "Vote For Selected Poll"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "Show Selected Poll"], "isController": false}, {"data": [1.0, 500, 1500, "Show Vote Page-7"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "Show Vote Page-3"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "Show Vote Page-4"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "Show Vote Page-5"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "Show Vote Page-6"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "Show Vote Page-0"], "isController": false}, {"data": [0.8958333333333334, 500, 1500, "Show Vote Page-1"], "isController": false}, {"data": [0.9375, 500, 1500, "Show Vote Page-2"], "isController": false}, {"data": [1.0, 500, 1500, "Vote For Selected Poll-6"], "isController": false}, {"data": [1.0, 500, 1500, "Vote For Selected Poll-7"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15771, 23, 0.14583729630334158, 323.15826517024914, 2, 13835, 6.0, 312.0, 1489.5999999999985, 7621.280000000001, 257.87305013244384, 22632.03967145038, 273.0684507750417], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login Welcome-1", 1000, 0, 0.0, 9.760999999999989, 4, 915, 5.0, 9.0, 17.0, 63.98000000000002, 16.73948341954167, 1989.2685525787176, 10.086192646344934], "isController": false}, {"data": ["Login Welcome-0", 1000, 0, 0.0, 18.920999999999978, 2, 2499, 3.0, 5.0, 15.0, 226.18000000000075, 16.715699384862265, 42.980895000334314, 8.341525767250602], "isController": false}, {"data": ["Vote For Selected Poll-2", 21, 0, 0.0, 8.476190476190476, 4, 29, 6.0, 25.20000000000001, 28.9, 29.0, 0.4834588024034809, 26.24983003401478, 0.27713898145590166], "isController": false}, {"data": ["Vote For Selected Poll-3", 21, 0, 0.0, 10.38095238095238, 5, 31, 7.0, 24.400000000000006, 30.499999999999993, 31.0, 0.48344767254477644, 73.76684423057, 0.2799653025576684], "isController": false}, {"data": ["Vote For Selected Poll-4", 21, 0, 0.0, 9.000000000000002, 3, 34, 6.0, 25.000000000000007, 33.29999999999999, 34.0, 0.483469932774657, 10.313867852990606, 0.28139460931024957], "isController": false}, {"data": ["Vote For Selected Poll-5", 21, 0, 0.0, 9.952380952380954, 5, 34, 7.0, 25.000000000000007, 33.29999999999999, 34.0, 0.4834588024034809, 41.150653532702535, 0.27761110919262383], "isController": false}, {"data": ["Login-0", 1000, 0, 0.0, 1361.4670000000006, 189, 10399, 216.0, 4930.799999999998, 6760.0999999999985, 8555.400000000001, 16.829633618876116, 7.215048006529898, 12.326391810700281], "isController": false}, {"data": ["Login-1", 1000, 0, 0.0, 144.03399999999976, 2, 3416, 3.0, 114.79999999999995, 1583.8999999999999, 2547.9700000000003, 16.912461101339467, 79.65703114429712, 10.256482757745907], "isController": false}, {"data": ["Login-2", 1000, 2, 0.2, 322.97899999999953, 69, 3372, 95.5, 1042.9999999999998, 1275.85, 2976.98, 16.893604081494743, 100.80766605356962, 9.697687635148831], "isController": false}, {"data": ["Vote For Selected Poll-0", 21, 0, 0.0, 999.9047619047618, 25, 4378, 675.0, 3069.4000000000015, 4294.5999999999985, 4378.0, 0.43282905313491904, 0.15597062559256358, 0.3089824588297127], "isController": false}, {"data": ["Login-3", 1000, 0, 0.0, 48.742000000000004, 3, 3033, 5.0, 46.799999999999955, 244.59999999999945, 913.97, 16.912175074836373, 918.2617402205348, 10.504046237886655], "isController": false}, {"data": ["Vote For Selected Poll-1", 21, 0, 0.0, 7072.380952380953, 282, 12845, 4710.0, 12593.2, 12821.8, 12845.0, 0.46402686936538806, 367.1620587946902, 0.2623745677368747], "isController": false}, {"data": ["Login-4", 1000, 0, 0.0, 51.05100000000005, 4, 2940, 6.0, 47.799999999999955, 256.8499999999998, 954.99, 16.912461101339467, 2578.0066292883657, 10.60332033892572], "isController": false}, {"data": ["Login-5", 1000, 0, 0.0, 51.35600000000018, 3, 3782, 5.0, 40.89999999999998, 246.94999999999993, 971.5400000000004, 16.91303318337111, 360.80586903392754, 10.653228909447622], "isController": false}, {"data": ["Login-6", 1000, 0, 0.0, 57.30199999999999, 4, 3033, 6.0, 52.89999999999998, 270.7999999999997, 1026.7200000000003, 16.912175074836373, 1439.5167768776744, 10.520562033858175], "isController": false}, {"data": ["Login-7", 1000, 0, 0.0, 49.57799999999998, 2, 3080, 5.0, 50.799999999999955, 265.74999999999966, 925.94, 16.91274713751755, 121.7090172425457, 10.553950606321985], "isController": false}, {"data": ["Login-8", 1000, 5, 0.5, 38.57799999999997, 3, 1922, 5.0, 27.0, 78.0, 920.94, 16.91274713751755, 962.7582629340234, 10.517614626143724], "isController": false}, {"data": ["Re Vote For Selected Poll-0", 21, 0, 0.0, 1767.7619047619048, 4, 4535, 2812.0, 4268.6, 4517.7, 4535.0, 0.48354785972506853, 0.17471944150222202, 0.3456611653503419], "isController": false}, {"data": ["Re Vote For Selected Poll-4", 21, 0, 0.0, 16.19047619047619, 4, 54, 10.0, 48.00000000000001, 53.599999999999994, 54.0, 0.5311614730878188, 11.331271855081445, 0.30915257613314445], "isController": false}, {"data": ["Show Vote Page", 24, 0, 0.0, 5755.791666666666, 1194, 12989, 4260.0, 11120.5, 12884.75, 12989.0, 0.42376622230069744, 349.29027434448665, 1.9350887260527943], "isController": false}, {"data": ["Re Vote For Selected Poll-3", 21, 0, 0.0, 16.238095238095237, 5, 49, 13.0, 39.40000000000001, 48.39999999999999, 49.0, 0.5311346046841013, 81.04315290827812, 0.30758087947038293], "isController": false}, {"data": ["Re Vote For Selected Poll-2", 21, 0, 0.0, 16.476190476190474, 4, 95, 9.0, 43.00000000000001, 89.99999999999993, 95.0, 0.531148038546172, 28.83915995618029, 0.3044764635025419], "isController": false}, {"data": ["Re Vote For Selected Poll-1", 21, 0, 0.0, 9.809523809523807, 2, 115, 3.0, 14.200000000000003, 104.99999999999986, 115.0, 0.531148038546172, 2.144302725927612, 0.3008455687077927], "isController": false}, {"data": ["Login Welcome-3", 1000, 0, 0.0, 8.345999999999993, 3, 857, 5.0, 9.0, 16.949999999999932, 62.92000000000007, 16.740884588341647, 613.8378844125623, 10.05433986506847], "isController": false}, {"data": ["Login Welcome-2", 1000, 0, 0.0, 8.931999999999997, 4, 767, 5.0, 10.0, 17.0, 81.8900000000001, 16.740604335816524, 1425.501694986189, 9.923385577969364], "isController": false}, {"data": ["Re Vote For Selected Poll-7", 21, 0, 0.0, 18.80952380952381, 4, 153, 9.0, 36.80000000000001, 141.69999999999985, 153.0, 0.531148038546172, 30.382290243948706, 0.30655126052811293], "isController": false}, {"data": ["Re Vote For Selected Poll-6", 21, 0, 0.0, 20.0952380952381, 4, 135, 11.0, 47.400000000000006, 126.39999999999988, 135.0, 0.5311614730878188, 3.8223914992032575, 0.3060403018767705], "isController": false}, {"data": ["Re Vote For Selected Poll", 24, 3, 12.5, 1580.5416666666665, 4, 4550, 156.0, 4142.0, 4506.5, 4550.0, 0.5524989065125808, 184.7775670336564, 2.342522524402035], "isController": false}, {"data": ["Re Vote For Selected Poll-5", 21, 0, 0.0, 18.333333333333332, 5, 68, 13.0, 50.400000000000006, 66.39999999999998, 68.0, 0.531148038546172, 45.20982718719175, 0.3049951627589347], "isController": false}, {"data": ["Show Selected Poll-6", 21, 0, 0.0, 877.0952380952382, 6, 3082, 59.0, 3036.0, 3077.4, 3082.0, 0.4327131112072696, 9.231072181955863, 0.25185255300735615], "isController": false}, {"data": ["Show Selected Poll-5", 21, 0, 0.0, 886.2380952380951, 6, 3066, 86.0, 3035.0, 3062.9, 3066.0, 0.43218769294093434, 65.9453422450607, 0.25028056827536527], "isController": false}, {"data": ["Show Selected Poll-4", 21, 0, 0.0, 792.1428571428571, 7, 3084, 238.0, 2835.2000000000007, 3073.3999999999996, 3084.0, 0.4320987654320988, 23.46119068287037, 0.24769724151234568], "isController": false}, {"data": ["Login", 1000, 7, 0.7, 1884.5280000000016, 271, 12503, 313.0, 6526.399999999999, 9413.65, 11807.81, 16.80728763992067, 6528.0454378456, 95.10925656114492], "isController": false}, {"data": ["Show Selected Poll-3", 21, 0, 0.0, 797.5238095238095, 6, 3886, 223.0, 2864.4000000000005, 3800.8999999999987, 3886.0, 0.43216101084518344, 24.720116259029076, 0.24942105215771818], "isController": false}, {"data": ["Show Selected Poll-2", 21, 0, 0.0, 908.7619047619049, 7, 3889, 228.0, 3069.8, 3807.099999999999, 3889.0, 0.4319210201563143, 3.1082285132147267, 0.2488607440353764], "isController": false}, {"data": ["Show Selected Poll-1", 21, 0, 0.0, 793.8571428571429, 6, 3929, 274.0, 2865.0000000000005, 3837.5999999999985, 3929.0, 0.4321076565361427, 36.77978842157246, 0.24812431840161323], "isController": false}, {"data": ["Show Selected Poll-0", 21, 0, 0.0, 3887.333333333333, 6, 8540, 4418.0, 8356.0, 8532.7, 8540.0, 0.3982628155284568, 2.54087009164786, 0.22674533345028353], "isController": false}, {"data": ["Login Welcome", 1000, 0, 0.0, 35.86299999999996, 7, 3361, 9.0, 20.0, 52.849999999999795, 821.4800000000023, 16.711509216397335, 4064.699260724611, 38.35160806497435], "isController": false}, {"data": ["Vote For Selected Poll", 24, 3, 12.5, 7089.541666666665, 6, 13835, 5366.0, 13523.5, 13793.0, 13835.0, 0.49162194272604365, 503.0529530603466, 2.083512037056004], "isController": false}, {"data": ["Show Selected Poll", 24, 3, 12.5, 4706.5, 9, 8830, 4474.0, 8795.0, 8822.5, 8830.0, 0.4550798285865979, 152.98481704368766, 1.6377207551954946], "isController": false}, {"data": ["Show Vote Page-7", 24, 0, 0.0, 17.416666666666664, 4, 262, 5.5, 17.5, 202.25, 262.0, 0.45295838444842884, 25.909750401056904, 0.261424223836935], "isController": false}, {"data": ["Show Vote Page-3", 24, 0, 0.0, 82.75000000000001, 5, 1495, 8.5, 112.5, 1156.75, 1495.0, 0.45293273948818596, 69.11072436211973, 0.26229405714501397], "isController": false}, {"data": ["Show Vote Page-4", 24, 0, 0.0, 71.54166666666664, 3, 968, 7.0, 229.5, 812.5, 968.0, 0.45295838444842884, 9.66296475417571, 0.26363593469849955], "isController": false}, {"data": ["Show Vote Page-5", 24, 0, 0.0, 83.625, 4, 1535, 9.0, 118.0, 1187.0, 1535.0, 0.4529498358056845, 38.55381610236667, 0.2600922885290454], "isController": false}, {"data": ["Show Vote Page-6", 24, 0, 0.0, 87.29166666666667, 4, 1475, 8.5, 186.0, 1180.25, 1475.0, 0.4529412874856097, 3.259496433087361, 0.26097203087549775], "isController": false}, {"data": ["Show Vote Page-0", 24, 0, 0.0, 5335.416666666667, 1088, 12637, 4181.0, 9389.5, 12189.0, 12637.0, 0.424530805016539, 130.6667676401394, 0.2387985778218032], "isController": false}, {"data": ["Show Vote Page-1", 24, 0, 0.0, 327.125, 72, 1177, 110.0, 1133.0, 1166.75, 1177.0, 0.45217325771991634, 62.731238342408204, 0.24507437308061875], "isController": false}, {"data": ["Show Vote Page-2", 24, 0, 0.0, 155.125, 4, 1922, 8.0, 792.0, 1811.25, 1922.0, 0.4529498358056845, 24.59331828218775, 0.25964995470501645], "isController": false}, {"data": ["Vote For Selected Poll-6", 21, 0, 0.0, 8.761904761904761, 4, 30, 6.0, 24.80000000000001, 29.799999999999997, 30.0, 0.483469932774657, 3.4791893892738743, 0.2785617776728981], "isController": false}, {"data": ["Vote For Selected Poll-7", 21, 0, 0.0, 10.047619047619047, 5, 30, 7.0, 25.800000000000008, 29.799999999999997, 30.0, 0.483469932774657, 27.65504672103785, 0.27903391627912333], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 3, 13.043478260869565, 0.019022256039566292], "isController": false}, {"data": ["Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, 4.3478260869565215, 0.006340752013188764], "isController": false}, {"data": ["403", 6, 26.08695652173913, 0.038044512079132585], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 4.3478260869565215, 0.006340752013188764], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 1, 4.3478260869565215, 0.006340752013188764], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 4, 17.391304347826086, 0.025363008052755057], "isController": false}, {"data": ["Assertion failed", 7, 30.434782608695652, 0.04438526409232135], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15771, 23, "Assertion failed", 7, "403", 6, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 4, "500", 3, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-2", 1000, 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-8", 1000, 5, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 4, "Non HTTP response code: java.io.InterruptedIOException/Non HTTP response message: Connection already shutdown", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Re Vote For Selected Poll", 24, 3, "403", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 1000, 7, "Assertion failed", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Vote For Selected Poll", 24, 3, "403", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Show Selected Poll", 24, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
