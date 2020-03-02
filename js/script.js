google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawAllSheets);

// draw all sheets here
function drawAllSheets() {
    drawSheetName('mghepALL', 'SELECT A,L', 
                  generalViewResponseHandler);
    drawSheetName('mghepALL', 'SELECT A,L,F,R,X',
                  compareGDPResponseHandler);
    drawSheetName('mghepALL', 'SELECT A,F,R,X',
                  compareMilitaryResponseHandler);
    drawSheetName('percapitaALL', 'SELECT A,L,X',
                  perCapitaEduGDPResponseHandler);
    drawSheetName('percapitaALL', 'SELECT A,L,R,AE,AD',
                  perCapitaHealthGDPResponseHandler);
    drawSheetName('percapitaALL', 'SELECT A,L,F,AE,AD',
                  perCapitaMilitaryGDPResponseHandler);
    drawSheetName('growthALL', 'SELECT A,B,C,D,E',
                  growthHealthResponseHandler);
    drawSheetName('growthALL', 'SELECT F,G,H,I,J',
                  pctGrowthHealthResponseHandler);
    drawSheetName('growthALL', 'SELECT K,L,M,N,O',
                  growthEduResponseHandler);
    drawSheetName('growthALL', 'SELECT P,Q,R,S,T',
                  pctGrowthEduResponseHandler);
}

function drawSheetName(sheetName, query, responseHandler) {
    var queryString = encodeURIComponent(query);
    var query = new google.visualization.Query(
        "https://docs.google.com/spreadsheets/d/1FyZi_5kNPfpQf2BS_HEfFe7TvQsNFIzt-tCifJ3GIxg/gviz/tq?sheet=" + sheetName + "&headers=1&tq=" + queryString
    );
    query.send(responseHandler);
}

// General view of these countries in map
function generalViewResponseHandler(response) {
    var data = response.getDataTable();

    var options = {height: 400,};
    var chart = new google.visualization.GeoChart(document.getElementById('general_view_div'));
    chart.draw(data, options);  
}


// Compare the spending data to that country’s GDP
function compareGDPResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({column: 1, desc: true});
    data.setColumnLabel(1, 'GDP')
    data.setColumnLabel(2, 'Military')
    data.setColumnLabel(3, 'Health')
    data.setColumnLabel(4, 'Education')


    var options = {height: 400,
                   vAxis: {title: 'Spending in Millions $',
                           scaleType: 'log',
                           ticks: [0, 10000, 100000, 1000000, 10000000, 20000000]
                   },
                   hAxis: {title: 'Country'},
                };

    var chart = new google.visualization.ColumnChart(document.getElementById('compare_gdp_div'));

    chart.draw(data, options);
}

// Compare the education and health to the overall military spending of the country
function compareMilitaryResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({column: 1, desc: true});
    data.setColumnLabel(1, 'Military')
    data.setColumnLabel(2, 'Health')
    data.setColumnLabel(3, 'Education')


    var options = {height: 400,
                   vAxis: {title: 'Spending in Millions ($)',
                           scaleType: 'log',
                   },
                   hAxis: {title: 'Country'},
                };

    var chart = new google.visualization.ColumnChart(document.getElementById('compare_military_div'));

    chart.draw(data, options);
}


// Compare the per person educational spending to the per person GDP
function perCapitaEduGDPResponseHandler(response) {
    var data = response.getDataTable();
    data.setColumnLabel(1, 'GDP')
    data.setColumnLabel(2, 'Education')

    var options = {height: 400,
        vAxis: {title: 'Spending in Millions ($)',
        },
        hAxis: {title: 'Country'},
     };

    var chart = new google.visualization.ColumnChart(document.getElementById('pcedu_gdp_div'));

    chart.draw(data, options)
    
}

// Compare the per person healthcare spending to the per person GDP
function perCapitaHealthGDPResponseHandler(response) {
    var data = response.getDataTable();
    data.setColumnLabel(1, 'GDP per capita')
    data.setColumnLabel(2, 'Healthcare per capita')
    data.setColumnLabel(4, 'Population')

    var options = {height: 400,
        vAxis: {title: 'Healthcare per capita ($)',
        },
        hAxis: {title: 'GDP per capita ($)'},
     };

    var chart = new google.visualization.BubbleChart(document.getElementById('pchealth_gdp_div'));

    chart.draw(data, options)
    
    
}

// Compare the per person military spending to the per person GDP
function perCapitaMilitaryGDPResponseHandler(response) {
    var data = response.getDataTable();
    data.setColumnLabel(1, 'GDP per capita')
    data.setColumnLabel(2, 'Military per capita')
    data.setColumnLabel(4, 'Population')

    var options = {height: 400,
        vAxis: {title: 'Military per capita ($)',
        },
        hAxis: {title: 'GDP per capita ($)'},
     };

    var chart = new google.visualization.BubbleChart(document.getElementById('pcmilitary_gdp_div'));

    chart.draw(data, options)
    
}

// from stackoverflow, transpose the datatable
function transposeDataTable(dataTable) {
    //step 1: let us get what the columns would be
    var rows = [];//the row tip becomes the column header and the rest become
    for (var rowIdx=0; rowIdx < dataTable.getNumberOfRows(); rowIdx++) {
        var rowData = [];
        for( var colIdx = 0; colIdx < dataTable.getNumberOfColumns(); colIdx++) {
            rowData.push(dataTable.getValue(rowIdx, colIdx));
        }
        rows.push( rowData);
    }
    var newTB = new google.visualization.DataTable();
    newTB.addColumn('string', dataTable.getColumnLabel(0));
    newTB.addRows(dataTable.getNumberOfColumns()-1);
    var colIdx = 1;
    for(var idx=0; idx < (dataTable.getNumberOfColumns() -1);idx++) {
        var colLabel = dataTable.getColumnLabel(colIdx);
        newTB.setValue(idx, 0, colLabel);
        colIdx++;
    }
    for (var i=0; i< rows.length; i++) {
        var rowData = rows[i];
        newTB.addColumn('number',rowData[0]); //assuming the first one is always a header
        var localRowIdx = 0;

        for(var j=1; j< rowData.length; j++) {
            newTB.setValue(localRowIdx, (i+1), rowData[j]);
            localRowIdx++;
        }
    }
    return newTB;
}

// Growth of healthcare in values
function growthHealthResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({column: 4, desc: true});

    var options = {height: 400,
        vAxis: {title: 'Million ($)'},
        hAxis: {title: 'Year'},
        legend: {position: 'top', maxLines: 3},
        width: 700,
        bars: {groupWidth: '50%'},
    };

    var chart = new google.visualization.LineChart(document.getElementById('growth_health_div'));

    chart.draw(transposeDataTable(data), options)  
}

// Growth of healthcare in percentage
function pctGrowthHealthResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({column: 4, desc: true});


    // * 100, change to percentage 
    for (i = 0; i < data.getNumberOfRows(); i++) {
        for (j = 0; j < data.getNumberOfColumns(); j++) {
            if (typeof data.getValue(i, j) == 'number') {
                data.setValue(i, j, data.getValue(i, j) * 100);
            }
        }
    }

    // Set suffix and digits
    var formater = new google.visualization.NumberFormat({
        fractionDigits: 2, suffix: '%'
    });
    for (j=1; j<data.getNumberOfColumns(); j++) {
        formater.format(data, j);
    }
   
    var options = {height: 400,
        vAxis: {title: 'Country'},
        hAxis: {title: 'Percentage (%)'},
        legend: {position: 'top', maxLines: 1},
        width: 700,
        bars: {groupWidth: '50%'},
        isStacked: true,
    };
    var view = new google.visualization.DataView(data);

    var chart = new google.visualization.BarChart(document.getElementById('pct_growth_health_div'));

    chart.draw(view, options)
}

// Growth of education in values
function growthEduResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({column: 4, desc: true});

    var options = {height: 400,
        vAxis: {title: 'Million ($)'},
        hAxis: {title: 'Country'},
        legend: {position: 'top', maxLines: 1},
        width: 700,
        bars: {groupWidth: '50%'},
        isStacked: true,
    };

    var chart = new google.visualization.SteppedAreaChart(document.getElementById('growth_edu_div'));

    chart.draw(data, options)  
}

// Growth of education in percentage
function pctGrowthEduResponseHandler(response) {
    var data = response.getDataTable();
    data.sort({column: 4, desc: true});


    // * 100, change to percentage 
    for (i = 0; i < data.getNumberOfRows(); i++) {
        for (j = 0; j < data.getNumberOfColumns(); j++) {
            if (typeof data.getValue(i, j) == 'number') {
                data.setValue(i, j, data.getValue(i, j) * 100);
            }
        }
    }

    // Set suffix and digits
    var formater = new google.visualization.NumberFormat({
        fractionDigits: 2, suffix: '%'
    });
    for (j=1; j<data.getNumberOfColumns(); j++) {
        formater.format(data, j);
    }
   
    var options = {height: 400,
        vAxis: {title: 'Percentage (%)'},
        hAxis: {title: 'Country'},
        legend: {position: 'top', maxLines: 1},
        width: 700,
        bars: {groupWidth: '50%'},
        isStacked: true,
    };
    var view = new google.visualization.DataView(data);

    var chart = new google.visualization.SteppedAreaChart(document.getElementById('pct_growth_edu_div'));

    chart.draw(view, options)
}


// for navigator function, hide or show infomation
function show(element) {
    document.getElementById(element).parentElement.classList.remove('invisible')
}

function hideAllGraph() {
    var all_graph = document.getElementsByClassName('navigator');
    for (i=0; i<all_graph.length; i++) {
        all_graph[i].classList.add('invisible')
    }
}

function showAllGraph() {
    var all_graph = document.getElementsByClassName('navigator');
    for (i=0; i<all_graph.length; i++) {
        all_graph[i].classList.remove('invisible')
    }
}

// navigator for side bar
function onClickNavigator() {
    var toWhere = event.srcElement.innerHTML

    if (toWhere == 'General view') {
        hideAllGraph()
        show('general_view_div')
    }
    if (toWhere == 'Compare all together') {
        hideAllGraph()
        show('compare_gdp_div')
    }
    if (toWhere == 'Compare without GDP') {
        hideAllGraph()
        show('compare_military_div')
    }
    if (toWhere == 'Per capita comparison') {
        hideAllGraph()
        show('pcedu_gdp_div')
        show('pchealth_gdp_div')
        show('pcmilitary_gdp_div')
    }
    if (toWhere == 'Growth comparison') {
        hideAllGraph()
        show('growth_health_div')
        show('pct_growth_health_div')
        show('growth_edu_div')
        show('pct_growth_edu_div')
    }
    if (toWhere == 'Compare by yourself') {
        showAllGraph()
    }
}

// for section: Compare by yourself. Collapse or not
function collapse(element) {
    // console.log(event.srcElement.innerHTML)
    if (event.srcElement.innerHTML == 'Collapse') {
        event.srcElement.innerHTML = 'Collapsed'
        document.getElementById(element).classList.add('invisible')
    }
    else {
        event.srcElement.innerHTML = 'Collapse'
        document.getElementById(element).classList.remove('invisible')
    }
}


// get different plot in general view part
function getDiffPlot(selectObject) {
    var selected = selectObject.value;  
    if (selected == 'GDP') {
        drawSheetName('mghepALL', 'SELECT A,L', 
        generalViewResponseHandler);
    }
    if (selected == 'Population') {
        drawSheetName('mghepALL', 'SELECT A,AD', 
        generalViewResponseHandler);
    }
    if (selected == 'Military') {
        drawSheetName('mghepALL', 'SELECT A,F', 
        generalViewResponseHandler);
    }
    if (selected == 'Healthcare') {
        drawSheetName('mghepALL', 'SELECT A,R', 
        generalViewResponseHandler);
    }
    if (selected == 'Education') {
        drawSheetName('mghepALL', 'SELECT A,X', 
        generalViewResponseHandler);
    }
}

// getTimePlot function: interactively generate plot with selected year
// compare with GDP
function getTimePlot1(selectObject) {
    var year = selectObject.value;  
    if (year == 2012) {
        drawSheetName('mghepALL', 'SELECT A,H,B,N,T',
        compareGDPResponseHandler);
    }
    if (year == 2013) {
        drawSheetName('mghepALL', 'SELECT A,I,C,O,U',
        compareGDPResponseHandler);
    }
    if (year == 2014) {
        drawSheetName('mghepALL', 'SELECT A,J,D,P,V',
        compareGDPResponseHandler);
    }
    if (year == 2015) {
        drawSheetName('mghepALL', 'SELECT A,K,E,Q,W',
        compareGDPResponseHandler);
    }
    if (year == 2016) {
        drawSheetName('mghepALL', 'SELECT A,L,F,R,X',
        compareGDPResponseHandler);
    }
}

// compare with military. Interactively generate plot with selected year
function getTimePlot2(selectObject) {
    var year = selectObject.value;  
    if (year == 2012) {
        drawSheetName('mghepALL', 'SELECT A,B,N,T',
        compareMilitaryResponseHandler);
    }
    if (year == 2013) {
        drawSheetName('mghepALL', 'SELECT A,C,O,U',
        compareMilitaryResponseHandler);
    }
    if (year == 2014) {
        drawSheetName('mghepALL', 'SELECT A,D,P,V',
        compareMilitaryResponseHandler);
    }
    if (year == 2015) {
        drawSheetName('mghepALL', 'SELECT A,E,Q,W',
        compareMilitaryResponseHandler);
    }
    if (year == 2016) {
        drawSheetName('mghepALL', 'SELECT A,F,R,X',
        compareMilitaryResponseHandler);
    }
}

// per capita education vs GDP. Interactively generate plot with selected year
function getTimePlot3(selectObject) {
    var year = selectObject.value;  
    if (year == 2012) {
        drawSheetName('percapitaALL', 'SELECT A,H,T',
        perCapitaEduGDPResponseHandler);
    }
    if (year == 2013) {
        drawSheetName('percapitaALL', 'SELECT A,I,U',
        perCapitaEduGDPResponseHandler);
    }
    if (year == 2014) {
        drawSheetName('percapitaALL', 'SELECT A,J,V',
        perCapitaEduGDPResponseHandler);
    }
    if (year == 2015) {
        drawSheetName('percapitaALL', 'SELECT A,K,W',
        perCapitaEduGDPResponseHandler);
    }
    if (year == 2016) {
        drawSheetName('percapitaALL', 'SELECT A,L,X',
        perCapitaEduGDPResponseHandler);
    }
}

// per capita healthcare vs GDP. Interactively generate plot with selected year
function getTimePlot4(selectObject) {
    var year = selectObject.value;  
    if (year == 2012) {
        drawSheetName('percapitaALL', 'SELECT A,H,N,AE,AD',
        perCapitaHealthGDPResponseHandler);
    }
    if (year == 2013) {
        drawSheetName('percapitaALL', 'SELECT A,I,O,AE,AD',
        perCapitaHealthGDPResponseHandler);
    }
    if (year == 2014) {
        drawSheetName('percapitaALL', 'SELECT A,J,P,AE,AD',
        perCapitaHealthGDPResponseHandler);
    }
    if (year == 2015) {
        drawSheetName('percapitaALL', 'SELECT A,K,Q,AE,AD',
        perCapitaHealthGDPResponseHandler);
    }
    if (year == 2016) {
        drawSheetName('percapitaALL', 'SELECT A,L,R,AE,AD',
        perCapitaHealthGDPResponseHandler);
    }
}

// per capita military vs GDP. Interactively generate plot with selected year
function getTimePlot5(selectObject) {
    var year = selectObject.value;  
    if (year == 2012) {
        drawSheetName('percapitaALL', 'SELECT A,H,B,AE,AD',
        perCapitaMilitaryGDPResponseHandler);
    }
    if (year == 2013) {
        drawSheetName('percapitaALL', 'SELECT A,I,C,AE,AD',
        perCapitaMilitaryGDPResponseHandler);
    }
    if (year == 2014) {
        drawSheetName('percapitaALL', 'SELECT A,J,D,AE,AD',
        perCapitaMilitaryGDPResponseHandler);
    }
    if (year == 2015) {
        drawSheetName('percapitaALL', 'SELECT A,K,E,AE,AD',
        perCapitaMilitaryGDPResponseHandler);
    }
    if (year == 2016) {
        drawSheetName('percapitaALL', 'SELECT A,L,F,AE,AD',
        perCapitaMilitaryGDPResponseHandler);
    }
}
