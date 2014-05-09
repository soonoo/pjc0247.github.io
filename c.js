
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
function scaleImage(imageData, scale) {
  var scaled = dc.createImageData(imageData.width * scale, imageData.height * scale);

  for(var row = 0; row < imageData.height; row++) {
    for(var col = 0; col < imageData.width; col++) {
      var sourcePixel = [
        imageData.data[(row * imageData.width + col) * 4 + 0],
        imageData.data[(row * imageData.width + col) * 4 + 1],
        imageData.data[(row * imageData.width + col) * 4 + 2],
        imageData.data[(row * imageData.width + col) * 4 + 3]
      ];
      for(var y = 0; y < scale; y++) {
        var destRow = row * scale + y;
        for(var x = 0; x < scale; x++) {
          var destCol = col * scale + x;
          for(var i = 0; i < 4; i++) {
            scaled.data[(destRow * scaled.width + destCol) * 4 + i] =
              sourcePixel[i];
          }
        }
      }
    }
  }
  return scaled;
}
downsampleImage = function(pixels, scale){
  var downsampled = scaleImage( pixels, scale );
  var upsampled = scaleImage( downsampled, 1/scale );
  return upsampled;
}
art.onload = function(){
  dc.drawImage( art, 0,0, 300,300 );
  
  var pixels = dc.getImageData( 0,0,300,300 );
  
  var downsampled = downsampleImage( pixels, 0.5 );
  var rescaled = scaleImage( pixels, 0.5 );
  
  dc.putImageData( rescaled, 600, 0 );
  dc.putImageData( downsampled, 300,0 );
  
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
