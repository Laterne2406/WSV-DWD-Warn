// Änderungen für das DWD-Warnmodul2 wurden mit "// Warnmodul2:" markiert
L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({
  
  onAdd: function (map) {
    // Triggered when the layer is added to a map.
    //   Register a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onAdd.call(this, map);
    map.on('click', this.getFeatureInfoJsonp, this);
    if(!this._marker) this._marker = L.marker([50.099444, 8.770833]).addTo(this._map)  //Marker hinzufügen
  },
  
  onRemove: function (map) {
   
    //   Unregister a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onRemove.call(this, map);
    map.off('click', this.getFeatureInfoJsonp, this);
  },

  // Warnmodul2: JSON-Version der getFeatureInfo-Funktion  //P
  getFeatureInfoJsonp: function (evt) {
	  
    // Make an AJAX request to the server and hope for the best
    var url = this.getFeatureInfoUrl(evt.latlng),
        showResultsJson = L.Util.bind(this.showGetFeatureInfoJson, this);

    var xhr = new XMLHttpRequest()
    xhr.open("GET", url, true)
    xhr.onload = function() {var data=JSON.parse(this.response); showResultsJson(evt.latlng, data)
	
    }
    
	xhr.send()   
  },


  getFeatureInfoUrl: function (latlng) { this._map=this._map||karte  //work if layer disabled
    // Construct a GetFeatureInfo request URL given a point
	//console.log("Geolocation: ", latlng);  
    var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
        size = this._map.getSize(),
        
        params = {
          request: 'GetFeatureInfo',
          service: 'WMS',
          srs: 'EPSG:4326',
          styles: this.wmsParams.styles,
          transparent: this.wmsParams.transparent,
          version: this.wmsParams.version,      
          format: this.wmsParams.format,
          bbox: this._map.getBounds().toBBoxString(),
          height: size.y,
          width: size.x,
          layers: this.wmsParams.layers.replace(/gt_.+/,'gt'),
          query_layers: this.wmsParams.layers.replace(/gt_.+/,'gt'),
          info_format: 'application/json',  //text/javascript
          // Warnmodul2: nur ausgewählte Properties werden abgefragt - eine ungefilterte Antwort liefert eine Vielzahl weiterer Eigenschaften der Warnungen, analog zum Inhalt im CAP-Format
          //propertyName: 'EVENT,ONSET,EXPIRES,SENT,DESCRIPTION,SEVERITY,EC_GROUP,GC_WARNCELLID' +(this.wmsParams.layers.match(/seen|kreise/)?',AREADESC':''),  //,PARAMATERVALUE,DESCRIPTION,ALTITUDE
          propertyName: 'EVENT,ONSET,EXPIRES,SENT,DESCRIPTION,SEVERITY,EC_GROUP,GC_WARNCELLID,AREADESC',
		  // Warnmodul2: FEATURE_COUNT > 1 notwendig, um im Falle überlappender Warnungen alle Warnungen abzufragen
          FEATURE_COUNT: 10,
        };
    
    params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);  //InvalidPoint on mobile bugfixed   point.x
    params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);  //
    //console.log("url-params:",L.Util.getParamString(params));
    return "https://maps.dwd.de/geoserver/dwd/wms/" + L.Util.getParamString(params) ;  //this._url  don't use proxy here
  },
	

  // Warnmodul2: angepasste Funktion zum Aufbereiten der Geoserver-Antwort (Auswahl von bestimmten properties) und zur Anzeige als Popup
  showGetFeatureInfoJson: function (latlng, data) {
    this._data=data  //needed for notification
    this._marker.closePopup();this._marker.unbindPopup(); this._marker.setLatLng(latlng)  //feedback
    if ( data.features[0] == null ) { return 0 };
    var content="<h2 style='opacity:.87'>Amtliche Warnung </br>" + data.features[0].properties.AREADESC +"</h2>" ;
    var color={Minor:"yellow",Moderate:"orange",Severe:"red",Extreme:"DarkRed"}  //
	var sever={Minor:"1.png",Moderate:"2.png",Severe:"3.png",Extreme:"4.png"};
	var icon ={FOG:"warn_icons_nebel_",FROST:"warn_icons_frost_",SLIPPERINESS:"warn_icons_eis_",HEAT:"warn_icons_hitze.png",RAIN:"warn_icons_regen_",SNOWFALL:"warn_icons_schnee_",THAW:"warn_icons_tau_",THUNDERSTORM:"warn_icons_gewitter_",UV:"warn_icons_uv.png",WIND:"warn_icons_wind_",};
	data.features.sort(function(a, b){return new Date(a.properties.ONSET) - new Date(b.properties.ONSET)});  //sort array
    data.features.forEach(function(item){ item=item.properties  //$.each(data.features, function (i, item) {
        var o = new Date(item.ONSET);
        var e = new Date(item.EXPIRES); 
		var ec=item.EC_GROUP.match(/\w+/); ec={TORNADO:"WIND",HAIL:"RAIN",SNOWDRIFT:"SNOWFALL"}[ec]||ec;
        var onset = ('0' + o.getDate()).slice(-2) + '.' + ('0' + (o.getMonth()+1)).slice(-2) + ". - " + ('0' + (o.getHours())).slice(-2) + ":" + ('0' + (o.getMinutes())).slice(-2) + " Uhr",
        end = ('0' + e.getDate()).slice(-2) + '.' + ('0' + (e.getMonth()+1)).slice(-2) + "." +" - " + ('0' + (e.getHours())).slice(-2) + ":" + ('0' + (e.getMinutes())).slice(-2) + " Uhr" ;
        if (e.toDateString()==o.toDateString()) end=end.replace(/.{6}/,'Ende :')  //
        content += "<div style='position: relative;'>"  //
        content += "<div style='position: relative;'><table style='no-repeat"  // left/contain url(\"icons/warn.png\"), linear-gradient(to right, "+color[item.SEVERITY]
		+" 54px,transparent 54px); border-spacing:0px'>"
        + "<tr><td>Ereignis&nbsp;:</td><td><a style='font-weight: bold '><img  style='position: absolute; top: 25px; left:5px' src='icons/" + icon[item.EC_GROUP] + sever[item.SEVERITY]+ "' width='35px' height='35px' >"+ item.EVENT.replace("RMATION","") + "</a>"
		+ "</td></tr><tr><td></td><td"+(Date.now()-o<0?" style='color:#808080'":"")+">" + onset + "</td></tr>"
        + "<tr><td></td><td"+(Date.now()-e>0?" style='color:#808080'":"")+">" + (item.EXPIRES?end:item.AREADESC) + "</br>" + item.DESCRIPTION + "</td></tr></table>" //"&nbsp;"
        +"</div></div><p></p>"
		
    });
	
    content += "Meldung von: " + new Date(data.features[0].properties.SENT).toLocaleTimeString('de',{hour:"2-digit",minute:"2-digit"}) + "</br></br>";
    //if ((Date.now()-new Date(data.features[0].properties.SENT))/3.6e6>48) content += " not up to date, try <a href='?7'>Landkreise</a>"  //
	content += `<button class='button-popup' onclick='select_warnings({warncell:"${data.features[0].properties.GC_WARNCELLID}", name:"${data.features[0].properties.AREADESC}"})'> Select Region </button>`
    this._marker.bindPopup(content,{ maxWidth: 400}).openPopup();
	
  }
});



L.tileLayer.betterWms = function (url, options) {
  return new L.TileLayer.BetterWMS(url, options);  
};
