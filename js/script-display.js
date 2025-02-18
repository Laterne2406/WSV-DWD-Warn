


// Daten aus dem session Storage auslesen

parameter = sessionStorage.getItem('added-items');

var out_wsv ;
var out_dwd ;
var wsv_n ;
var dwd_n ;

//console.log(parameter)
if (parameter) {
	let userdata = JSON.parse(parameter);
	out_wsv = userdata.wsv_id;
	wsv_n = userdata.wsv_name;
	out_dwd = userdata.dwd_id;
	dwd_n = userdata.dwd_name;
	warncellid = userdata.warncellid;
	kreis = userdata.kreis;
	//console.log(wsv_n,out_wsv,dwd_n,out_dwd);
	} 
else {
	console.log("session Storage not found")
}

// ab hier der function Definitionsblock

function popupBack() {
	sessionStorage.clear();
	location.href='index.html'
}

function popupFn() 
{
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popupDialog").style.display = "grid";
}

function closeFn() 
{
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popupDialog").style.display = "none";
}



// bis hier function Definitionsblock


// Pegeldiagram WSV als iframe abrufen

if (out_wsv != "") {
	var diagram_id = 'https://www.pegelonline.wsv.de/charts/OnlineVisualisierungGanglinie?pegeluuid=' + out_wsv +
	'&pegelkennwerte=NW,HW,MNW,MHW,MW&dauer=24;2&imgLinien=2&anordnung=block&imgBreite=450&imgHoehe=180&schriftPegelname=11&schriftAchse=11&anzeigeUeberschrift=false\
	&anzeigeDatenquelle=true&schriftLetzterWert=15"';

	var iframe = document.getElementById('g_1');
	iframe.src = diagram_id;
	
		
	document.getElementById('g_top1').innerHTML = wsv_n;
	}
	else
		document.getElementById('g_top1').innerHTML = "Keine WSV-Station ausgewählt";




//Anzeige DWD Warnmeldungen

if (warncellid != "" && warncellid.charAt(0) != "5") {	
	warn_kreis_url = "https://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dwd%3AWarnungen_Landkreise&outputFormat=application%2Fjson&CQL_FILTER=GC_WARNCELLID%20IN%20('"+warncellid+"')";
	//console.log("Kreis:",warncellid);
	fetch(warn_kreis_url)
		.then(response => response.json())
		.then(data => {data;	
			var messages = "";
			var color={Minor:"yellow",Moderate:"orange",Severe:"red",Extreme:"DarkRed"};
			var sever={Minor:"1.png",Moderate:"2.png",Severe:"3.png",Extreme:"4.png"};
			var icon ={FOG:"warn_icons_nebel_",FROST:"warn_icons_frost_",SLIPPERINESS:"warn_icons_eis_",HEAT:"warn_icons_hitze.png",RAIN:"warn_icons_regen_",SNOWFALL:"warn_icons_schnee_",THAW:"warn_icons_tau_",THUNDERSTORM:"warn_icons_gewitter_",UV:"warn_icons_uv.png",WIND:"warn_icons_wind_",}
			for(let i=0;i<data.features.length;i++) {
		    //console.log(data.features[i]);
			
			messages += "<div style='position: relative; background: "+ color[data.features[i].properties.SEVERITY]+" '><table style='left'><tr><td>Ereignis:</td><td><a style='font-weight: bold' >" + data.features[i].properties.EVENT +", Meldung von "+new Date(data.features[0].properties.SENT).toLocaleTimeString('de',{hour:"2-digit",minute:"2-digit"})+ "</a></td></tr>";
			messages += "<tr><td><img  style='position: absolute; top: 25px; left:10px' src='icons/" + icon[data.features[i].properties.EC_GROUP] + sever[data.features[i].properties.SEVERITY]+ "' width='35px' height='35px' ></td><td>" + new Date(data.features[i].properties.ONSET).toLocaleString("de-DE") + "  bis  " + new Date(data.features[i].properties.EXPIRES).toLocaleString("de-DE") + "</br>";
			messages += data.features[i].properties.DESCRIPTION + "</td></tr></table></br></div>";
			};
		document.getElementById('g_top3').innerHTML = "Gebietswarnungen "+kreis;
		if (messages=="") {
			document.getElementById('g_3').innerHTML = "Keine Warnmeldungen vorhanden";
			}
			else
				document.getElementById('g_3').innerHTML = messages
		
    })
	.catch(error => console.log(`This is the error: ${error}`));
	}
else if (warncellid.charAt(0) == "5"){
	küsten_url = "https://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dwd%3AWarnungen_Kueste&maxFeatures=50&outputFormat=application%2Fjson&CQL_FILTER=WARNCELLID%20IN%20('"+warncellid+"')";
	//console.log("Küste:",warncellid);
	fetch(küsten_url)
		.then(response => response.json())
		.then(data => {data;	
			var messages = "";
			var color={Minor:"yellow",Moderate:"orange",Severe:"red",Extreme:"DarkRed"};
			var sever={Minor:"1.png",Moderate:"2.png",Severe:"3.png",Extreme:"4.png"};
			var icon ={FOG:"warn_icons_nebel_",FROST:"warn_icons_frost_",SLIPPERINESS:"warn_icons_eis_",HEAT:"warn_icons_hitze.png",RAIN:"warn_icons_regen_",SNOWFALL:"warn_icons_schnee_",THAW:"warn_icons_tau_",THUNDERSTORM:"warn_icons_gewitter_",UV:"warn_icons_uv.png",WIND:"warn_icons_wind_",}
			for(let i=0;i<data.features.length;i++) {
		    //console.log(data.features[i]);
			
			messages += "<div style='position: relative; background: "+ color[data.features[i].properties.SEVERITY]+" '><table style='left'><tr><td>Ereignis:</td><td>" + data.features[i].properties.EVENT +", Meldung von "+new Date(data.features[0].properties.SENT).toLocaleTimeString('de',{hour:"2-digit",minute:"2-digit"})+ "</td></tr>";
			messages += "<tr><td><img  style='position: absolute; top: 25px; left:10px' src='icons/" + icon[data.features[i].properties.EC_GROUP] + sever[data.features[i].properties.SEVERITY]+ "' width='35px' height='35px' ></td><td>" + new Date(data.features[i].properties.ONSET).toLocaleString("de-DE") + "</br>";
			messages += data.features[i].properties.DESCRIPTION + "</td></tr></table></br></div>";
			};
		document.getElementById('g_top3').innerHTML = "Küstenwarnungen "+kreis;
		if (messages=="") {
			document.getElementById('g_3').innerHTML = "Keine Warnmeldungen vorhanden";
			}
			else
				document.getElementById('g_3').innerHTML = messages
		
    })
	.catch(error => console.log(`This is the error: ${error}`));
	}
	
else 
	document.getElementById('g_top3').innerHTML = "Keine Gebietsauswahl vorhanden";
	


// Aktuelle DWD Messwertdatenabfrage
let aktuell_DWD;


var präfix = 'https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/current_measurement_';
var suffix = '.json';
var st_id = out_dwd;
var url = präfix + st_id + suffix;
var station = dwd_n;

if (out_dwd != "") {
	fetch(url)
	.then(response => response.json())
	.then (data => {
		wetterdata = data
		//console.log(st_id,wetterdata);
		var zeitstempel =new Date(wetterdata.time).toLocaleString("de-DE");
		var temper = wetterdata.temperature /10;
	    if (temper > 100)                
			temper = "--";
		var feuchte = wetterdata.humidity /10;
	    if (feuchte > 100)                
			feuchte = "--";
		var dewpoint = wetterdata.dewpoint /10;
	    if (dewpoint > 100)                
			dewpoint = "--";
		var precip = wetterdata.precipitation /10;
	    if (precip > 300)
			precip = "--";

	    var snow = wetterdata.totalsnow
	    if (snow > 200)                
			snow = "--";
    
		var pressure = wetterdata.pressure /10;
	    if (pressure > 2000)                
			pressure = "--";
		var meanwind = wetterdata.meanwind /10;
	    if (meanwind > 200)                
			meanwind = "--";
	    var maxwind = wetterdata.maxwind /10;
	    if (maxwind > 300)                
			maxwind = "--";
	
	    var sunshine = wetterdata.sunshine /10;
		//console.log("Sonne: ", wetterdata.sunshine)
	    if (sunshine > 60)
	        sunshine = "--";
    
	    var cloud = wetterdata.cloud_cover_total;
		//console.log("Wolken: ", wetterdata.cloud_cover_total)
	    if (cloud > 100)
	        cloud = "--";
		
	    var winddir = wetterdata.winddirection /10;
		if (winddir >= 0 && winddir <= 180) 
	    	windzug = winddir + 180;
		else if (winddir > 180 && winddir <= 360)
	    	windzug = winddir - 180;
		else
			{
			winddir = "--";
			windzug = "--";
			}
			
		if (winddir>0 && winddir<=11.25) windskala="N";
		else if (winddir>11.25 && winddir<=33.75) windskala="NNO";
		else if (winddir>33.75 && winddir<=56.25) windskala="NO";
		else if (winddir>56.25 && winddir<=78.75) windskala="ONO";
		else if (winddir>78.75 && winddir<=101.25) windskala="O";
		else if (winddir>101.25 && winddir<=123.75) windskala="OSO";
		else if (winddir>123.75 && winddir<=146.25) windskala="SO";
		else if (winddir>146.25 && winddir<=168.75) windskala="SSO";
		else if (winddir>168.75 && winddir<=191.25) windskala="S";
		else if (winddir>191.25 && winddir<=213.75) windskala="SSW";
		else if (winddir>213.75 && winddir<=236.25) windskala="SW";
		else if (winddir>236.25 && winddir<=258.75) windskala="WSW";
		else if (winddir>258.75 && winddir<=281.25) windskala="W";
		else if (winddir>281.25 && winddir<=303.75) windskala="WNW";
		else if (winddir>303.75 && winddir<=326.25) windskala="NW";
		else if (winddir>326.25 && winddir<=348.75) windskala="NNW";
		else if (winddir>348.75 && winddir<=360) windskala="N";
		else windskala= "--"
	    
		//console.log(zeitstempel, station, wetterdata.winddirection);
	
		document.getElementById('g_top2').innerHTML = `${dwd_n} ${zeitstempel}`;
		document.getElementById("g_22_1").innerHTML = `<span>${temper}</span>`;
		document.getElementById("g_22_2").innerHTML = `<span>${feuchte}</span>`;
		document.getElementById("g_22_3").innerHTML = `<span>${dewpoint}</span>`;
		document.getElementById("g_22_4").innerHTML = `<span>${precip}</span>`;
		document.getElementById("g_22_5").innerHTML = `<span style="font-size:21px">s:${sunshine}<br/>w:${cloud}</span>`;
		document.getElementById("g_22_6").innerHTML = `<span style="font-size:21px">${meanwind}<br/>${maxwind}</span>`;
		document.getElementById("g_22_7").innerHTML = `<span>${windzug}°</span>`;
		document.getElementById("g_2_6").innerHTML = `<img src="assets/windrose-spezial.svg"  style="transform:translate(-50%, -50%)rotate(${winddir}deg)" width="90px" height="90px" ><span style="font-size:16px">${windskala}</span>`;
		document.getElementById("g_2_7").innerHTML = `<img src="assets/wi-direction-up.svg" style="transform:translate(-50%, -50%)rotate(${windzug}deg)" width="80px" height="80px">`;
						
	})
	.catch(error => console.log(`This is error: ${error}`))
}
else
	document.getElementById('g_top2').innerHTML = "Keine DWD-Station ausgewählt";
		    
			


//History DWD Diagrammerstellung

var station = dwd_n;
var test_url = 'https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/current_measurement_'+out_dwd+'.json'
//let test_url = 'https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/current_measurement_10150.json'
if (out_dwd != "") {
	document.getElementById('g_top4').innerHTML = `${dwd_n} -- Wetterdaten Zeitreihe / Häufigkeit Windrichtungen`;
	fetch(test_url)
		.then(response => response.json())
		.then(data => {
		    test_data = data;
			//console.log(`Test  `, test_data)
		
			let x_value_temp_start = test_data.history.temperature.start ;
			let x_step = test_data.history.temperature.timeStep ;
			let x_time =[];
			let j = 0;
			let y_temp_history = [];
			let y_wind_history = [];
			let y_direction_history =[];
			let diagram_data ={}
		
			while (j < test_data.history.temperature.data.length) {
				let f = j * x_step + x_value_temp_start
				x_time.push(f);
			
				if (test_data.history.temperature.data[j] < 1000)
					y_temp_history.push(test_data.history.temperature.data[j]/10)
				else
					y_temp_history.push(null)
			
				if (test_data.history.windSpeed.data[j] < 2000)
					y_wind_history.push(test_data.history.windSpeed.data[j]/10)
				else
					y_wind_history.push(null)
				
				if (test_data.history.windDirection.data[j] <3600)
					y_direction_history.push(test_data.history.windDirection.data[j]/10)
				else
					y_direction_history.push(null)
			
				j++ ;
			}
		
			//console.log('Zeit ' , x_time)
			//console.log(`history Temperatur  `, y_temp_history)
			//console.log('history Windrichtung  ',count)
			//console.log(`history Windrichtung  `, y_direction_history)

			var trace1 = {
			  type: "scatter",
			  mode: "lines",
				name: 'Temperatur',
				yaxis: 'y1',
			  x: x_time,
			  y: y_temp_history,
				line: {color: '#ff6347'},
	
			};

			var trace2 = {
			  type: "scatter",
			  mode: "lines",
				name: 'Wind',
				yaxis: 'y2',
			  x: x_time,
			  y: y_wind_history,
			  line: {color: '#009cb8'},
		  
			};
		
			var trace3 = {
			  type: "scatter",
			  mode: "lines",
				name: 'Windrichtung',
				yaxis: 'y3',
			  x: x_time,
			  y: y_direction_history,
			  line: {color: '#8a8a8a'},
		 
			};

			var data_p = [trace1,trace2];
			var time_l = x_time.length-1
			var range_p = [x_time[0],x_time[time_l]];
		
			var layout_p = {
				width: 350,
				height: 300,
				margin:{b: 30, l: 40, r:40, t:70, pad:3},
				title: {text: station + ' , 96 Stunden', font:{size: 11}},
				showlegend: false,
				//paper_bgcolor: '#ADD8E6',
				//plot_bgcolor: '#ADD8E6',
				grid:{rows: '2', columns: '1', pattern: 'coupled' , roworder: 'bottom to top'},
				xaxis:{
					type: 'date',
					tickfont:{size: '9'},
					tickangle: '0',
					tickformat: '%d-%m \n %H:%M',
				
				},
				yaxis1:{
					title:{text: 'Temperatur °C', font:{size: '9', color:'#ff6347'}},
					tickfont: {size: '9',color: '#ff6347'},
					zeroline: true,
					zerolinecolor: '#8a8a8a',
				
				},
				yaxis2:{
					title:{text: 'Wind km/h', font:{size: '9',color:'#009cb8'}},
					tickfont: {size: '9',color: '#009cb8'},
					side: 'right',
				
				},
				//yaxis3:{
				//	title:{text: 'Windrichtung', font:{color:'#8a8a8a'}},
				//	tickfont: {color: '#8a8a8a'},
				//	dtick: 5,
				//	tickmode: 'array',
				//	tickvals: [0,90,180,270,360],
				//	ticktext: ['N','O','S','W','N'],
				//	side: 'left',
				//},
			
			};
		
			//console.log(range_p);
			//console.log(data_p);
			
			document.getElementById("g_4_1")
			Plotly.newPlot('g_4_1', data_p, layout_p);
		
		
			var count = {};
			y_direction_history.forEach(e => count[e] ? count[e]++ : count[e] = 1 );
		
			let minVal = Math.min(...Object.values(count));
			let maxVal = Math.max(...Object.values(count));
		
			dataW = [{
			  	type: 'scatterpolar',
			  	r: Object.values(count),
				theta: Object.keys(count),
			  	fill: 'toself'
			}]

			layoutW = {
				width: 350,
				height: 300,
				margin:{b: 30, l: 40, r:40, t:70},
				title: {text: station + ' , 96 Stunden', font:{size: 11}},
				hovermode: false,
			  	polar: {
			    	radialaxis: {
			      	visible: true,
			      	range: [minVal, maxVal],
					showticklabels: false
				
			    },
				angularaxis: {
					direction: 'clockwise',
					tickmode: 'array',
					ticktext: ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'],
					tickvals: [0,45,90,135,180,225,270,315]
				},
			  },
			  showlegend: false
			}
			
			document.getElementById("g_4_2")
			Plotly.newPlot("g_4_2", dataW, layoutW)
		
			})

		.catch(error => console.log(`This is the error: ${error}`))
	

}
else
	document.getElementById('g_top4').innerHTML = "Keine DWD-Station ausgewählt";

	


