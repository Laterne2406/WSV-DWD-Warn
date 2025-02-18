// Leaflet Kartenobjekt mit Mittelpunkt-locator erstellen
var loc = [54.1906, 9.9547]
var map = L.map('mymap', {
	tap:false,
	zoomControl: true,
	dragging: true,
	attributionControl: true
}).setView(loc, 8);


// OSM-Hintergrundslayer definieren
var osmlayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
	maxZoom: 20,
	minZoom: 2
});

// ab hier der function Definitionsblock
var out_wsv = "" ;
var out_dwd = "" ;
var wsv_n = "";
var dwd_n = "";
var warncellid = "";
var kreis = "";

function select_wsv(obj) {
	wsv_n = "WSV-Station: " + obj.name;
	out_wsv = obj.st_uuid;
	document.getElementById("out-info6").innerHTML = wsv_n;
	//console.log("f-Select-wsv:", out_wsv , result);
};

function select_dwd(obj) {
	dwd_n = "DWD-Station: " + obj.name;
	out_dwd = obj.st_id;
	document.getElementById("out-info5").innerHTML = dwd_n;
	//console.log("f-Select-DWD:", out_dwd , result);
};

function select_warnings(obj) {
	kreis = obj.name;
	warncellid = obj.warncell;
	document.getElementById("out-info4").innerHTML = kreis;
	//console.log("f-Select-warnings:", warncellid , kreis);
};

function selector() {
	
	if (out_wsv != "" || out_dwd != "" || warncellid !=""){
		let parameter = {"wsv_id": out_wsv, "wsv_name": wsv_n , "dwd_id": out_dwd, "dwd_name":dwd_n, "warncellid": warncellid, "kreis": kreis };
		sessionStorage.setItem('added-items', JSON.stringify(parameter));
		location.href='dashboard.html'
	};
};

function popupFn() 
{
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popupDialog").style.display = "grid";
};
function closeFn() 
{
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popupDialog").style.display = "none";
};

// bis hier function Definitionsblock


// Hier Option DWD Warnlayer einfügen
var qs=""  
qs= decodeURIComponent(location.search.slice(1))||qs;  //qs=qs.replace('ort=0','0').replace(/ort=1/,'1')  //URL parameter
var opt=qs.replace(/.*?(&|$)/,''); 
opt=opt? JSON.parse('{"' + opt.replace(/&/g, '","').replace(/=/g, '":"') + '"}') :{}; 
qs=qs.replace('qs=','').replace(/&.*/,'')  //&lkr=1
//console.log("opt: ", opt, "qs: ", qs);

// Layer mit GeoJSON Daten der Landkreiswarnungen, Test ergibt je Ereignis eine separate Box!
//var landkreislayer = L.geoJSON();
//var option = ["%27101%25%27","%27901%25%27","%27113%25%27","%27913%25%27","%27103%25%27","%27903%25%27","%27102%25%27","%27104%25%27"];
//var url_part = "https://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dwd%3AWarnungen_Landkreise&outputFormat=application%2Fjson&CQL_FILTER=GC_WARNCELLID%20LIKE%20"
//for (var f in option){
//	var kreis_url = url_part + option[f];
/*var kreis_url = "https://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dwd%3AWarnungen_Landkreise&outputFormat=application%2Fjson&bbox=8.20,53.50,12.00,55.24"
	//console.log(kreis_url);
	fetch(kreis_url)
		.then(response => response.json())
		.then(data => {data;
		    //console.log(data);
			for(let i=0;i<data.features.length;i++) {
		        //console.log(i,data.features[i].properties.AREADESC);
				
				var popupContent = `<h3>${data.features[i].properties.AREADESC} </h3><a>Warnungen:</br> ${data.features[i].properties.DESCRIPTION}</br></br></a>
				<button class='button-popup' onclick='select_warnings({warncell:"${data.features[i].properties.GC_WARNCELLID}", name:"${data.features[i].properties.AREADESC}"})'> Select Kreis </button>`;
				var color={Minor:"yellow",Moderate:"orange",Severe:"red",Extreme:"DarkRed"};
				var farbe = color[data.features[i].properties.SEVERITY];
				var warn_geo = L.geoJSON(data.features[i],{onEachFeature: function (feature,layer) {layer.bindPopup(popupContent)}, 
				style: {"fillOpacity":0.3 , "color": "#0072B5", "fillColor": farbe ,"weight": 1.5, "opacity": 0.6, "attribution": 'Warndaten: &copy; <a href="https://www.dwd.de">DWD</a>'}}).addTo(landkreislayer); 
				//console.log(warn_geo)
				};
		
	    })
		.catch(error => console.log(`This is the error: ${error}`));
//	};
*/
	
// Layer mit GeoJSON Daten der DWD Küstenwarnungen, DWD geoserver
var kuestenlayer = L.geoJSON();
var kueste_url = "https://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dwd%3AWarnungen_Kueste&outputFormat=application%2Fjson";

fetch(kueste_url)
	.then(response => response.json())
	.then(data => {data;
	    //console.log(data);
		for(let i=0;i<data.features.length;i++) {
	        console.log("Küstenwarnungen: ",data.features[i]);
			var popupContent = `<h3>${data.features[i].properties.AREADESC} </h3><a> ${data.features[i].properties.HEADLINE}</br> ${data.features[i].properties.DESCRIPTION}</br></br></a>
			<button class='button-popup' onclick='select_warnings({warncell:"${data.features[i].properties.WARNCELLID}", name:"${data.features[i].properties.AREADESC}"})'> Select Region </button>`;
			
			var color={Minor:"yellow",Moderate:"orange",Severe:"red",Extreme:"DarkRed"};
			var farbe = color[data.features[i].properties.SEVERITY];
			console.log("Warncell ID: ", data.features[i].properties.WARNCELLID);
			L.geoJSON(data.features[i] 
			
			,{onEachFeature: function (feature,layer) {layer.bindPopup(popupContent)}, style: {"fillOpacity":0.7 , "color": "#0072B5", "fillColor": "yellow","weight": 1.5, "opacity": 0.6}}).addTo(kuestenlayer);
			};

    })
	.catch(error => console.log(`This is the error: ${error}`));

//Layer mit Pegelwarnwerten Küste, WSV REST API
var wsv_warnlayer = L.layerGroup();
var wsvwarn_url = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations.json?includeTimeseries=true&includeCurrentMeasurement=true&includeCharacteristicValues=true&waters=NORDSEE,OSTSEE"
fetch(wsvwarn_url)
	.then(response => response.json())
	.then(data => {data;
	    //console.log(data);
		for(let i=0;i<data.length;i++) {
	        //console.log("Pegelwarnungen: ",data[i]);
			if (data[i].longitude)
	        {
				
				if (data[i].timeseries[0].characteristicValues[0]) {
					if (data[i].timeseries[0].characteristicValues[0].shortname == "MThw") {
						var MThw = data[i].timeseries[0].characteristicValues[0].value;
						var Wert = data[i].timeseries[0].currentMeasurement.value;
						var diff = Wert - MThw;
						var border_farbe = "#00ffff"
						//console.log("Differenz:",diff);
						if (diff < 150) {
							var farbe = "#339933"  //WSV Definition grün
							};
						if (diff >= 150 && diff < 250) {
							var farbe = "#ffff00"  //WSV Definition gelb
							};
						if (diff >= 250 && diff < 350) {
							var farbe = "#ff9900"  //WSV Definition orange
							};
						if (diff >= 350) {
							var farbe ="rot"  //WSV Definition rot
							};
						//console.log("Nordsee:",farbe)
					}
					else {
						var warn_color={low: "##ff9900", normal:"#339933",high:"#0000ff",unknown:"#666666"}; //WSV Definition low=orange, normal=grün, hight=blau, unknown=grün
						var farbe = warn_color[data[i].timeseries[0].currentMeasurement.stateMnwMhw];
						var border_farbe = "#0072B5"
						//console.log("Ostsee:",farbe)
					};
				
				};	
				var zeitstempel =new Date(data[i].timeseries[0].currentMeasurement.timestamp).toLocaleString("de-DE");
				var popupContent = `<h3><img src = "assets/WSVPegel-kl.png"  width="25px" height="25px" >  ${data[i].shortname}</h3><a>${data[i].timeseries[0].currentMeasurement.value}cm am ${zeitstempel}</br></br></a>
				<button class='button-popup' onclick='select_wsv({st_uuid:"${data[i].uuid}", name:"${data[i].shortname}"})'> Select Station </button>`;
				/*var popupOptions = {
					maxWidth: 'auto',
					className: 'another-popup',
					};*/
				var MarkerOptions = {
				    radius: 8,
				    fillColor: farbe,
				    color: border_farbe,
				    weight: 2,
				    opacity: 1,
				    fillOpacity: 1
					};
		
				L.circleMarker([data[i].latitude, data[i].longitude], MarkerOptions).bindPopup(popupContent ).on('click', () => {
	            map.flyTo([data[i].latitude+0.03 , data[i].longitude], 10, {duration:0.5, easeLinearity:0.8});
	        	}).addTo(wsv_warnlayer);
			}
			else
				continue
			};

    })
			.catch(error => console.log(`This is the error: ${error}`));


// Layer mit neutraler Darstellung der Küstenwarngebiete mit betterwms.js, Ohne Übernahme der Warncell ID!
/*var kuestenlayer = L.tileLayer.betterWms("https://maps.dwd.de/geoserver/dwd/wms/", {
	//("https://maps.dwd.de/geoproxy_warnungen/service/", {
	layers: 'Warnungen_Kueste',
	format: 'image/png',
	styles: '',
	transparent: true,
	opacity: 0.9,
	//attribution: 'Geobasisdaten Küstengebiete: &copy; <a href="https://www.bkg.bund.de">BKG</a> 2015 (Daten verändert)'
	
});*/

	
// Warnungs-Layer vom DWD-Geoserver - betterWms fügt Möglichkeiten zur GetFeatureInfo hinzu, DWD Gemeinden vereinigt ohne Warncell ID!
/*var warnlayer = L.tileLayer.betterWms("https://maps.dwd.de/"+(!opt.day &&!opt.lkr?"geoproxy_warnungen/service/":"geoserver/dwd/wms/"), {
	layers: (!opt.lkr? 'Warnungen_Gemeinden_vereinigt':'Warnungen_Landkreise')+(qs.match(/^[A-Z][a-z,V]+/)? '_'+qs:''),  // Filterung
	// eigene Styled Layer Descriptor (SLD) können zur alternativen Anzeige der Warnungen genutzt werden (https://docs.geoserver.org/stable/en/user/styling/sld/reference/)
	//sld: 'https://eigenerserver/alternativer.sld',
	
	format: 'image/png',
	transparent: true,
	opacity: 0.8,
	attribution: 'Warndaten: &copy; <a href="https://www.dwd.de">DWD</a>'
});
//console.log("warnlayer:", warnlayer)*/

// Warnungs-Layer vom DWD-Geoserver - betterWms, mit Warnungen Landkreis und Warncell ID!
var warnlayer = L.tileLayer.betterWms("https://maps.dwd.de/geoserver/dwd/wms", {
	layers: ('Warnungen_Landkreise') + (qs.match(/^[A-Z][a-z,V]+/)? '_'+qs:''),  // Filterung
	format: 'image/png',
	transparent: true,
	opacity: 0.5,
	
		
});

//warnlayer.setParams({bbox:'8.20,53.50,12.00,55.24'} ); //Auswahl nach latLng funktioniert nicht!
//console.log("warnlayer:", warnlayer);
// CQL_FILTER können benutzt werden um angezeigte Warnungen zu filtern (https://docs.geoserver.org/stable/en/user/tutorials/cql/cql_tutorial.html)
// Filterung kann auf Basis der verschiedenen properties der Warnungen erfolgen (bspw. EC_II, EC_GROUP, DESCRIPTION ... ) siehe https://www.dwd.de/DE/wetter/warnungen_aktuell/objekt_einbindung/einbindung_karten_geowebservice.pdf
// warnlayer.setParams({CQL_FILTER:"DESCRIPTION LIKE '%Sturm%'"});
//if(isNaN(qs) &&!qs.match(/^ort=/)) warnlayer.setParams({CQL_FILTER:"EVENT IN ('"+qs.replace(/,/g,"','")+"')"})  //"EC_GROUP LIKE '%"+qs+"%'"
if (opt.day) warnlayer.setParams({CQL_FILTER:"EXPIRES AFTER "+new Date(new Date().setUTCHours(24,0,0)).toISOString()})  //?&day=1 tomorrow



// main-Routine Kartendarstellung mit WSV-Stationsmarker
var iconOption2 = {
    iconUrl: './assets/WSVPegel-kl.png',
    iconSize: [30, 30]
};
var ourCustomIcon2 = L.icon(iconOption2);
var WSV_marker = L.layerGroup();

// Lokale gefilterte Stationen aus der WSV-Liste
var WSV_url = './assets/WSV-Nord-Output.json'

	
fetch(WSV_url)
	.then(response => response.json())
	.then(data => {
	    data;
	    for(let i=0;i<data.length;i++) {
	        //console.log("WSV-station: ", data[i])
			if (data[i].longitude)
	        {
				var popupContent = `<h3><img src = "assets/WSVPegel-kl.png"  width="25px" height="25px" >  ${data[i].shortname}</h3><a></a><button class='button-popup' onclick='select_wsv({st_uuid:"${data[i].uuid}", name:"${data[i].shortname}"})'> Select Station </button>`;
				var popupOptions = {
					maxWidth: 'auto',
					className: 'another-popup',
				};
			
				L.marker([data[i].latitude, data[i].longitude], {icon: ourCustomIcon2}).bindPopup(popupContent , popupOptions).on('click', () => {
	            map.flyTo([data[i].latitude+0.015 , data[i].longitude], 11, {duration:0.5, easeLinearity:0.8});
	        	}).addTo(WSV_marker);
				    							
			}
			else
				continue
		};
							
    })
	.catch(error => console.log(`This is the error: ${error}`));



// main-Routine Kartendarstellung mit DWD-Stationsmarker
var iconOption = {
    iconUrl: './assets/DWDStations-or.png',
    iconSize: [35, 35]
};
var ourCustomIcon = L.icon(iconOption);
var station_url = './assets/DWDStations.json';

var DWD_marker = L.layerGroup()

fetch(station_url)
	.then(response => response.json())
	.then(data => {
	    data;
		//console.log(`f-station  `, data)
	    for(let i=0;i<data.length;i++) {
			
			if ((data[i].latitude) > 53.3700)
			{
				//console.log(`DWD-station  `, data[i].name)
				
				var popupContent = `<h3><img src = "assets/DWDStations.png"  width="30px" height="30px" >  ${data[i].name}</h3><button class='button-popup' onclick='select_dwd({st_id:"${data[i].id}", name:"${data[i].name}"})'> Select Station </button>`;
				var popupOptions = {
					maxWidth: 'auto',
					className: 'another-popup',
				};
				
				L.marker([data[i].latitude, data[i].longitude], {icon: ourCustomIcon}).bindPopup(popupContent , popupOptions).on('click', () => {
				map.flyTo([data[i].latitude+0.015, data[i].longitude], 11, {duration:0.5, easeLinearity:0.8});
	        	}).addTo(DWD_marker);
			}
		
		};
							
    })		
	.catch(error => console.log(`This is the error: ${error}`))
//console.log('DWD marker: ', DWD_marker);

// Layerlisten für die Layercontrol erstellen und dabei initial aktive Layer zur Karte hinzufügen
var baseLayers = {
		"OpenStreetMap": osmlayer.addTo(map)
};

// Layercontrol-Element und Overlays erstellen und hinzufügen

var overLayers = {
		"<span title='Wetter- und Unwetterwarnungen einblenden'>Gebietswarnungen einblenden</span>": warnlayer.addTo(map),
		//"<span title='Kreisgrenzen auf Warnkarte einblenden'>Gebietswarnungen einblenden</span>": landkreislayer,
		"<span title='Küstengebiete auf Warnkarte einblenden'>Küstenwarnungen einblenden</span>": kuestenlayer.addTo(map),
		"<span title='Pegelstationen'>Pegelwarnungen einblenden</span>": wsv_warnlayer.addTo(map),
		"<span title='WSV-Pegelstationen'>Alle WSV Pegel einblenden</span>": WSV_marker,
		"<span title='DWD-Wetterstationen'>DWD einblenden</span>": DWD_marker,
};
L.control.layers(baseLayers, overLayers).addTo(map);
L.control.scale({imperial:false}).addTo(map);

// Button für Hauptseite



document.querySelector("#button-grid8").addEventListener('click', () => {
    map.flyTo(loc, 8, {duration:0.8, easeLinearity:0.8});
	document.getElementById("out-info5").innerHTML = `<img src="assets/DWDStations.png" width="35px" height="35px" >`;
	document.getElementById("out-info6").innerHTML = `<img src="assets/WSVPegel-kl.png" width="30px" height="30px" >`;
	document.getElementById("out-info4").innerHTML = `<img src="icons/Warnung.png" width="35px" height="35px" >`;
	out_wsv = "";
	out_dwd = "";
	sessionStorage.clear();
	map.eachLayer(function (layer) {
      	layer.closePopup();});
	
});
document.querySelector("#button-grid7").addEventListener('click', () => {
	console.log("out_dwd:" , out_dwd);
	console.log("out_wsv:" , out_wsv);
	console.log("warncellID: ", warncellid);
	selector();
});

