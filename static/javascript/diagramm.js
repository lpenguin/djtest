function drawDiagramm( id, data ){
    $("#"+id).css("width", "1150px")
	     .css("height", "400px")
    var container = document.getElementById(id);
    var bars = [];
    var c = 0;
    var ticks = [];
    for( var i in data ){
	var scales = data[i];
	for( var j in scales ){
	    var scale = scales[j];
	    bars.push({
	      data: [[c++, scale.value - scale.min]],
	      //label: scale.scale.name
	    }
	    );
	    ticks.push( [c-1, scale.scale.name] );
	}
    }
    Flotr.draw(
    container,
    bars,
    {
      bars : {
        show : true,
        horizontal : false,
        shadowSize : 0,
        barWidth : 0.5
      },
      mouse : {
        track : false,
        trackY: false
	//trackFormatter: function(obj){
	//  return '';//obj.y;
	//}
      },
      yaxis : {
        min : 0,
	max : 1,
        autoscaleMargin : 1,
	ticks: [[0.33, 'Низк'], [0.66, 'Сред'], [1, 'Высок']]
      },
      xaxis : {
	labelsAngle: 45,
	ticks: ticks
      },
      
    }
  );
}