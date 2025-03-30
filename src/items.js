

function createBag(x, y, z, w, h, d, colour, id){
  w=w/2;
  h=h/2;
  d=d/2;
  var array = new Array();
  // front
  gridToTriangles([[x-w,y-h,z-d],[x-w,y+h,z-d],[x+w,y+h,z-d],[x+w,y-h,z-d]], array, 3);
    // left
  gridToTriangles([[x-w,y+h,z+d],[x-w,y+h,z-d],[x-w,y-h,z-d],[x-w,y-h,z+d]], array, 3);
    // bottom
  gridToTriangles([[x-w,y-h,z+d],[x-w,y-h,z-d],[x+w,y-h,z-d],[x+w,y-h,z+d]], array, 3);

  // back
  gridToTriangles([[x-w,y-h,z+d],[x+w,y-h,z+d],[x+w,y+h,z+d],[x-w,y+h,z+d]], array, 3);
    // right
  gridToTriangles([[x+w,y+h,z-d],[x+w,y+h,z+d],[x+w,y-h,z+d],[x+w,y-h,z-d]], array, 3);


  gridToTriangles([[x-w,y+h,z-d],[x-w,y+(h*2),z-d],[x-(w*0.75),y+(h*2),z-d],[x-(w*0.75),y+h,z-d]], array, 1);
  gridToTriangles([[x-w,y+h,z+d],[x-w,y+(h*2),z+d],[x-(w*0.75),y+(h*2),z+d],[x-(w*0.75),y+h,z+d]], array, 1);
  gridToTriangles([[x-w,y+(h*2),z+d],[x-w,y+(h*2),z-d],[x-(w*0.75),y+(h*2),z-d],[x-(w*0.75),y+(h*2),z+d]], array, 1);

  gridToTriangles([[x+(w*0.75),y+h,z-d],[x+(w*0.75),y+(h*2),z-d],[x+w,y+(h*2),z-d],[x+w,y+h,z-d]], array, 1);
  gridToTriangles([[x+(w*0.75),y+h,z+d],[x+(w*0.75),y+(h*2),z+d],[x+w,y+(h*2),z+d],[x+w,y+h,z+d]], array, 1);
  gridToTriangles([[x+(w*0.75),y+(h*2),z+d],[x+(w*0.75),y+(h*2),z-d],[x+w,y+(h*2),z-d],[x+w,y+(h*2),z+d]], array, 1);

  return Geometry.custom(array, colour, id);
}