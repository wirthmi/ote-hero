$(document).ready(function () {

  var Q = Quintus({
    imagePath: "assets/",
    development: false
  });

  Q.include( "Sprites, Scenes, Input, Touch, UI" );

  defineGlobals( Q );

  // set application's inputs
  Q.const.INPUT_PARAMETERS = defineParameters();
  Q.const.INPUT_HEROES = defineHeroes( Q );
  Q.const.INPUT_ITEMS = defineItems( Q );

  Q.setup( "quintus-canvas", {
    width: Q.const.CANVAS_WIDTH,
    height: Q.const.CANVAS_HEIGHT
  });

  // gonna receive touches only for objects which are "clickable" or "draggable"
  Q.touch( Q.const.TYPE_CLICKABLE | Q.const.TYPE_DRAGGABLE );

  defineComponents( Q );
  defineSprites( Q );
  defineScenes( Q );

  Q.load( Q.const.ASSETS_TO_LOAD , function () {
    Q.stageScene( "main" );
  });

});
