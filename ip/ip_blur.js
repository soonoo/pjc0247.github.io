/*
  blur.js
*/

var ip_blur = function(src, w,h){
  var roi = ip_get_roi( src );
  var dst = ip_create_img( roi[2],roi[3] );

  for(i=roi[0],u=0;i<roi[2];i++,u++){
    for(j=roi[1],v=0;j<roi[3];j++,v++){
      
      var to_x = Math.min( roi[2], i+w );
      var to_y = Math.min( roi[3], j+h );
      var f = false;
      
      var r = 0,g = 0,b = 0;
      var div = 0;
      
      for(k=i;k<to_x;k++){
        for(l=j;l<to_y;l++){
          var p = ip_get_rgb_at( src, k,l );
          
          r += p[0];
          g += p[1];
          b += p[2];
          div += 1;
        }
      }
      
      ip_set_rgba_at(
        dst, u,v,
        r/div,g/div,b/div,255 );
    }
  }
  
  return dst;
}

var ip_gauss_blur = function(src, r){
  var dst = ip_create_img( src.width, src.height );
  
  _ip_gauss_blur( src,dst, src.width,src.height, r ); 
  
  return dst;
}

var _ip_gauss_boxes = function(sigma, n){
    var wIdeal = Math.sqrt((12*sigma*sigma/n)+1);  // Ideal averaging filter width 
    var wl = Math.floor(wIdeal);  if(wl%2==0) wl--;
    var wu = wl+2;
				
    var mIdeal = (12*sigma*sigma - n*wl*wl - 4*n*wl - 3*n)/(-4*wl - 4);
    var m = Math.round(mIdeal);
    // var sigmaActual = Math.sqrt( (m*wl*wl + (n-m)*wu*wu - n)/12 );
				
    var sizes = [];  for(var i=0; i<n; i++) sizes.push(i<m?wl:wu);
    return sizes;
}

function _ip_gauss_blur(src,dst, w,h, r) {
    var bxs = _ip_gauss_boxes(r, 3);
    _ip_box_blur(src, dst, w, h, (bxs[0]-1)/2);
    _ip_box_blur(dst, src, w, h, (bxs[1]-1)/2);
    _ip_box_blur(src, dst, w, h, (bxs[2]-1)/2);
}
function _ip_box_blur(src,dst, w,h, r) {
    for(i=0;i<w;i++){
        for(j=0;j<h;j++) {
            var cr = 0,cg = 0,cb = 0;
            
            for(k=i-r;k<i+r+1;k++){
                for(l=j-r;l<j+r+1;l++){
		    var x = Math.min(w-1, Math.max(0, k));
                    var y = Math.min(h-1, Math.max(0, l));
                    var p = ip_get_rgb_at( src, k,l );
                    
                    cr += p[0];
                    cg += p[1];
                    cb += p[2];
                }
            }
            
            var div = ((r+r+1)*(r+r+1));
            ip_set_rgba_at(
            	dst, i,j,
            	cr/div,cg/div,cb/div,
            	255);
        }
    }
}
