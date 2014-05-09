
var canvas = document.getElementById("canvas");
var dc = canvas.getContext("2d");

var art = new Image();
art.src = "album.png";

getLuminance = function(color){
  var rgb = color.split(',');
  
  
}
getColorDistance = function(color1, color2){
  var rgb1 = color1.split(',');
  var rgb2 = color2.split(',');
  
  return Math.abs(rgb1[0] - rgb2[0]) +
    Math.abs(rgb1[1] - rgb2[1]) +
    Math.abs(rgb1[2] - rgb2[2]);
}

getColorList = function(pixels, w,h){
  var colorList = new Array();
  var map = new Array();
  var candidates = new Array();
  
  /* 빈도맵을 만든다 */
  for(i=0;i<w;i++){
    for(j=0;j<h;j++){
      idx = (j * w + i) * 4;
      key =
        pixels.data[idx + 0] + "," + pixels.data[idx+1] + "," + pixels.data[idx+2];
      
      if( map[key] == undefined )
        map[key] = 1;
      else
        map[key] += 1;
    }
  }
  
  for(i=0;i<5;i++){
    var max = {
     key : "", /* 색상 키 */
      hit : 0 /* 발생 빈도 */
    }; 
    
    for(k in map){
      if( map[k] > max.hit ){
        var flag = true;
        for(c in candidates){
          if( getColorDistance( candidates[c], k) < 100 )
            flag = false;
        }
      
        if( flag == true ){
          max.key = k;
          max.hit = map[k];
        }
      }
    }
    
    candidates.push( max.key );
  }
  
  return candidates;
}

crushImage = function(pixels, w,h, crush){
  for(i=0;i<w;i++){
    for(j=0;j<h;j++){
      idx = (j * w + i) * 4;
      
      pixels[idx+0] = parseInt( pixels[idx+0] / crush );
      pixels[idx+1] = parseInt( pixels[idx+1] / crush );
      pixels[idx+2] = parseInt( pixels[idx+2] / crush );
    }
  }
  
  return pixels;
}
downsampleImage = function(img, x,y, scale){
  var sw = img.width * scale;
  var sh = img.height * scale;
  
  console.log( sw, sh );
  dc.drawImage( img, x,y, sw,sh );
  var pixels = dc.getImageData( x,y, sw,sh );
  
  dc.putImageData( pixels, 300,0 );
}
art.onload = function(){
  dc.drawImage( art, 0,0, 300,300 );
  
  var pixels = dc.getImageData( 0,0,300,300 );
  
  downsampleImage( art, 300,0, 0.5 );
  
  dc.putImageData( pixels, 300,300,30,30 );
  var colorList = getColorList( pixels, 32,32 );
  
  console.log( colorList );
  
  var offset = 0;
  for(color in colorList){
    dc.fillStyle = "rgb(" + colorList[color] + ")";
    console.log( "rgb(" + colorList[color] + ");" );
    
    dc.fillRect( offset*50,32,50,50 );
    dc.fill();
    offset += 1;
  }
  
}
