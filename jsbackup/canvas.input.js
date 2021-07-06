if (untangleGame === undefined) {
  var untangleGame = {};
}

untangleGame.handleInput = function(){
  // Add Mouse Event Listener to canvas
  // we find if the mouse down position is on any circle
  // and set that circle as target dragging circle.
  $("#game").bind("mousedown", function(e) {
    var canvasPosition = $(this).offset();
    var mouseX = e.pageX - canvasPosition.left;
    var mouseY = e.pageY - canvasPosition.top;

    for(var i=0;i<untangleGame.circles.length;i++) {
      var circleX = untangleGame.circles[i].x;
      var circleY = untangleGame.circles[i].y;
      var radius = untangleGame.circles[i].radius;
      if (Math.pow(mouseX-circleX,2) + Math.pow(mouseY-circleY,2) <
      Math.pow(radius,2)) {
        untangleGame.targetCircleIndex = i;
        break;
      }
    }
  });

  // we move the target dragging circle when the mouse is moving
  $("#game").bind("mousemove", function(e) {
    if (untangleGame.targetCircleIndex !== undefined) {
      var canvasPosition = $(this).offset();
      var mouseX = e.pageX - canvasPosition.left;
      var mouseY = e.pageY - canvasPosition.top;
      var circle = untangleGame.circles[untangleGame.targetCircleIndex];
      circle.x = mouseX;
      circle.y = mouseY;
    }
    untangleGame.connectCircles();
    untangleGame.updateLineIntersection();
  });

  // We clear the dragging circle data when mouse is up
  $("#game").bind("mouseup", function(e) {
    untangleGame.targetCircleIndex = undefined;
  });
};
