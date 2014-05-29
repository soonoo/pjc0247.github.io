/*
  p.js
*/

var ip_is_in_range = function(val, range){
  if( range[0] <= val && range[1] >= val )
    return true;
  else
    return false;
}

var ip_lighten = function(dst, val){
  var roi = ip_get_roi( dst );
  var ch_mask = [];

  for(i=0;i<4;i++){
    ch_mask[i] = ip_get_channel_mask( dst, i );
  }
  
  for(i=roi[0];i<roi[2];i++){
    for(j=roi[1];j<roi[3];j++){
      var idx = (j * dst.width + i) * 4;
      
      for(k=0;k<IP_A;k++){
        if( ip_is_in_range( dst.data[idx+k], ch_mask[k] ) ){
          dst.data[idx+k] = Math.min( dst.data[idx+k]+val, 255 );
        }
      }
    }
  }
}
var ip_darken = function(dst, val){
var roi = ip_get_roi( dst );
  var ch_mask = [];

  for(i=0;i<4;i++){
    ch_mask[i] = ip_get_channel_mask( dst, i );
  }
  
  for(i=roi[0];i<roi[2];i++){
    for(j=roi[1];j<roi[3];j++){
      var idx = (j * dst.width + i) * 4;
      
      for(k=0;k<IP_A;k++){
        if( ip_is_in_range( dst.data[idx+k], ch_mask[k] ) ){
          dst.data[idx+k] = Math.max( dst.data[idx+k]-val, 0 );
        }
      }
    }
  }
}
