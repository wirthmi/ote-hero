function defineGlobals( Q ) {

  // may be used to distinguish a webkit browser, because it probably renders
  // fonts differently than firefox and so text positions can slightly differ
  var isWebkitBrowser = /webkit/.test( navigator.userAgent.toLowerCase() );


  /**
   * This is where are stored important constants.
   */
  Q.const = {

    // these will hold application's inputs and will be set later
    INPUT_PARAMETERS: null,
    INPUT_ITEMS: null,

    DEFAULT_HERO_NAME: "ball",

    // sprite type flags, typically used by components which
    // are adding some special features to objects
    TYPE_DRAGGABLE: 256,
    TYPE_DROPPABLE: 128,
    TYPE_HOVERABLE: 64,
    TYPE_CLICKABLE: 32,

    // these are used to determine Item's or Slot's purpose
    USAGE_HEAD: 0,
    USAGE_HAND: 1,
    USAGE_BODY: 2,

    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    SLOT_WIDTH: 50,
    SLOT_HEIGHT: 50,

    HERO_HEAD_SLOT: {
      x: 379,
      y: 56
    },
    HERO_HAND_SLOT: {
      x: 486,
      y: 259
    },
    HERO_BODY_SLOT_1: {
      x: 305,
      y: 242
    },
    HERO_BODY_SLOT_2: {
      x: 355,
      y: 242
    },

    HEAD_SLOT_CONTAINER: {
      x: 589,
      y: 86,
      columns: 4,
      slots: 4
    },
    HAND_SLOT_CONTAINER: {
      x: 589,
      y: 214,
      columns: 4,
      slots: 8
    },
    BODY_SLOT_CONTAINER: {
      x: 589,
      y: 393,
      columns: 4,
      slots: 16
    },

    CAPABILITY_STRIPES: {
      x: 145,
      y: 199,
      verticalStride: 21,
      tileWidth: 28,
      tileHeight: 17
    },

    PLUS_MINUS_SIGNS: {
      x: 172,
      y: 199,
      verticalStride: 21,
      tileWidth: 14,
      tileHeight: 14
    },

    SAVE_BUTTON: {
      x: 481,
      y: 372,
      tileWidth: 84,
      tileHeight: 39,
      resetTimeout: 1000,
      validReply: "OK"
    },

    HERO_NAME: {
      x: 453,
      y: 80
    },

    UPGRADE_POINTS: {
      x: 65,
      y: ( isWebkitBrowser ? 536 : 543 ),
      font: "800 19px Michroma",
      color: "rgb( 255, 42, 42 )",
      startValue: 10
    },

    ITEM_NAME: {
      x: 275,
      y: 522,
      font: "800 14px Michroma",
      color: "white",
      align: "center"
    },

    ITEM_DESCRIPTION: {
      x: 275,
      y: 549,
      font: "500 11px Arial",
      color: "white",
      align: "center",
      maximumLineWidth: 60
    },

    REPAIR_CHARGE_RATIO: {
      leftX: 66,
      rightX: 153,
      bothY: 424,
      positions: 5
    },

    // all used assets must be mentioned here
    ASSETS_TO_LOAD: [
      "background.png",
      "pinky.png",
      "slot.png",
      "stripes.png",
      "signs.png",
      "save.png",
      "repairchargeratio-slider.png",
      "repairchargeratio-position.png",
      "hero-ball.png",
      "hero-bug.png",
      "hero-bulk.png",
      "hero-cam.png",
      "hero-doc.png",
      "item-bsme.png",
      "item-bbge.png",
      "item-bejm.png",
      "item-bpsh.png",
      "item-bemr.png",
      "item-becl.png",
      "item-bfpz.png",
      "item-hetr.png",
      "item-wdam.png",
      "item-hspw.png",
      "item-wdrl.png",
      "item-wgsh.png",
      "item-hlls.png",
      "item-hgls.png",
      "item-bspd.png"
    ]

  };


  /**
   * This is where will be stored some important stage objects.
   */
  Q.objects = {

    headSlot: null,
    handSlot: null,
    bodySlot1: null,
    bodySlot2: null,

    repairChargeRatioSlider: null,

    upgradePointsLabel: null,

    itemNameLabel: null,
    itemDescriptionLabel: null

  };

}
