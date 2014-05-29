/*
  p.js
*/

var ip_is_in_range(val, range){
  if( range[0] >= val && range[1] <= val )
    return true;
  else
    return false;
}

var ip_darken = function(dst, val){
  var roi = ip_get_roi( dst );
  var ch_mask = [];
  
  for(i=0;i<4;i++){
    ch_mask[i] = ip_get_channel_mask( dst, i );
  }
  
  for(i=roi.x;i<roi.width;i++){
    for(j=roi.y;j<roi.height;j++){
      var idx = (j * dst.width + i) * 4;
      
      for(k=IP_R;k<=IP_A;k++){
        if( ip_is_in_range( dst.data[idx+k], ch_mask[k] ) ){
          dst.data[idx+k] = Math.min( dst.data[idx+k], 255 );
        }
      }
    }
  }
}
