function defineSprites( Q ) {

  /**
   * Defines a background sprite placed in the middle of the whole stage.
   */
  Q.Sprite.extend( "Background", {

    init: function () {

      this._super({
        x: Q.const.CANVAS_WIDTH / 2,
        y: Q.const.CANVAS_HEIGHT / 2,
        asset: "background.png"
      });

    }

  });


  /**
   * Defines just a shared interface for Item and Slot sprites which is
   * introducing a usage limiting ability for them.
   */
  Q.Sprite.extend( "UsageLimitedSprite", {

    init: function ( usage, p, defaults ) {

      p.usage = usage;
      this._super( p, defaults );

    },

    isForHead: function () {

      return ( this.p.usage === Q.const.USAGE_HEAD );

    },

    isForHand: function () {

      return ( this.p.usage === Q.const.USAGE_HAND );

    },

    isForBody: function () {

      return ( this.p.usage === Q.const.USAGE_BODY );

    },

    hasSameUsage: function ( other ) {

      return ( this.p.usage === other.p.usage );

    }

  });


  /**
   * Defines a sprite for representation of any kind of capability item.
   */
  Q.UsageLimitedSprite.extend( "Item", {

    init: function ( inputItem ) {

      var isItemAssetLoaded =
        ( Q.const.ASSETS_TO_LOAD.indexOf( inputItem.asset ) >= 0 );

      if ( !isItemAssetLoaded ) {
        // this is fallback item asset - nice pink stuff :-)
        inputItem.asset = "pinky.png";
      }

      this._super( inputItem.usage, {
        slot: null,
        x: Q.const.CANVAS_WIDTH / 2,
        y: Q.const.CANVAS_HEIGHT / 2
      }, inputItem );

      this.add( "draggableFeature" );
      this.add( "hoverableFeature" );

      this.on( "mouseIn", this, "_handleMouseIn" );
      this.on( "mouseOut", this, "_handleMouseOut" );

    },

    _handleMouseIn: function () {

      Q.el.style.cursor = "move";

      var wrappedDescription = this._wrapTextIntoLines(
        Q.const.ITEM_DESCRIPTION.maximumLineWidth, this.p.description );

      Q.objects.itemNameLabel.p.label = this.p.name;
      Q.objects.itemDescriptionLabel.p.label = wrappedDescription;

    },

    _handleMouseOut: function () {

      Q.el.style.cursor = "auto";

      Q.objects.itemNameLabel.p.label = "";
      Q.objects.itemDescriptionLabel.p.label = "";

    },

    _wrapTextIntoLines: function ( maximumLineWidth, text ) {

      var coolWrappingRegexp =
        new RegExp( "(.{1," + maximumLineWidth + "})($|\\b +)", "g" );

      return text.replace( coolWrappingRegexp, "$1\n" ).slice( 0, -1 );

    }

  });


  /**
   * Defines a sprite to which any capability item can be attached.
   */
  Q.UsageLimitedSprite.extend( "Slot", {

    init: function ( usage, x, y ) {

      this._super( usage, {
        item: null,
        x: x,
        y: y,
        asset: "slot.png"
      });

      this.add( "droppableFeature" );

      // this event will be triggered only for objects which pass
      // an isDropAllowed() test expected by droppableFeature
      this.on( "drop", this, "_handleDrop" );

    },

    isDropAllowed: function ( object ) {

      if ( !object.isA( "Item" ) ) {
        return false;
      } else {
        return this.isItemAttachAllowed( object );
      }

    },

    _handleDrop: function ( object ) {

      // it's already guaranteed that object is an Item, which is fulfilling
      // all isItemAttachAllowed() conditions, so we can skip another check
      this.attachItem( object, true );

    },

    isItemAttachAllowed: function ( item ) {

      var isSlotEmpty =
        ( this.p.item === null );
      var isSlotOnHero =
        ( !this.container );
      var hasItemSameUsage =
        item.hasSameUsage( this );
      var isThereEnoughUpgradePoints =
        ( Q.objects.upgradePointsLabel.p.value >= item.p.price );

      return (
        isSlotEmpty &&
        hasItemSameUsage &&
        ( !isSlotOnHero || isThereEnoughUpgradePoints )
      );

    },

    attachItem: function ( item, skipAllowedCheck ) {

      if ( !item ) {
        return;
      }

      if (
        !skipAllowedCheck &&
        !this.isItemAttachAllowed( item )
      ) {
        return;
      }

      // detach old item's slot first if necessary
      if ( item.p.slot !== null ) {
        item.p.slot.detachItem();
      }

      // and then attach the item to this new slot
      this.p.item = item;
      item.p.slot = this;

      this._alignItem( item );
      this.trigger( "item.attached", item );

    },

    detachItem: function () {

      if ( this.p.item !== null ) {

        this.trigger( "item.detached", this.p.item );

        this.p.item.p.slot = null;
        this.p.item = null;
      }

    },

    _alignItem: function ( item ) {

      item.p.x = this.p.x;
      item.p.y = this.p.y;

      var isSlotInsideContainer =
        ( typeof this.container !== "undefined" );

      if ( isSlotInsideContainer ) {
        item.p.x += this.container.p.x;
        item.p.y += this.container.p.y;
      }

    }

  });


  /**
   * Defines a sprite displaying plus or minus sign according to the value
   * which this sprite holds.
   */
  Q.Sprite.extend( "PlusMinusSign", {

    init: function ( capability, x, y ) {

      if ( typeof Q.sheet( "signs" ) === "undefined" ) {
        Q.sheet( "signs", "signs.png", {
          tilew: Q.const.PLUS_MINUS_SIGNS.tileWidth,
          tileh: Q.const.PLUS_MINUS_SIGNS.tileHeight
        });
      }

      this._super({
        x: x,
        y: y,
        sheet: "signs",
        frame: 2,
        capability: capability,
        value: 0
      });

    },

    _addValue: function ( addition ) {

      this.p.value = Math.round( this.p.value + addition );

      if ( this.p.value > 0 ) {
        this.p.frame = 0;
      } else if ( this.p.value < 0 ) {
        this.p.frame = 1;
      } else {
        this.p.frame = 2;
      }

    },

    handleSlotItemAttached: function ( item ) {

      this._addValue( item.p.bonusCapabilities[ this.p.capability ] );

    },

    handleSlotItemDetached: function ( item ) {

      this._addValue( -1 * item.p.bonusCapabilities[ this.p.capability ] );

    },

    handleSliderPositionChangedAsIncreasingMagnitude: function ( arguments ) {

      // i.e. charge capability is increasing as slider moves to the right

      this._handleSliderPositionChangedHelper(
        arguments.previousRepairChargeRatioPosition,
        arguments.currentRepairChargeRatioPosition,
        true
      );

    },

    handleSliderPositionChangedAsDecreasingMagnitude: function ( arguments ) {

      // i.e. repair capability is decreasing as slider moves to the right

      this._handleSliderPositionChangedHelper(
        arguments.previousRepairChargeRatioPosition,
        arguments.currentRepairChargeRatioPosition,
        false
      );

    },

    _handleSliderPositionChangedHelper: function (
      previousRepairChargeRatioPosition,
      currentRepairChargeRatioPosition,
      asIncreasingMagnitude
    ) {

      var shift =
        ( Math.floor( Q.const.REPAIR_CHARGE_RATIO.positions / 2 ) + 1 );

      if ( previousRepairChargeRatioPosition ) {

        var previousShiftedValue =
          ( previousRepairChargeRatioPosition.p.value - shift );
        this._addValue(
          ( asIncreasingMagnitude ? -1 : 1 ) * previousShiftedValue );
      }

      var currentShiftedValue =
        ( currentRepairChargeRatioPosition.p.value - shift );
      this._addValue(
        ( asIncreasingMagnitude ? 1 : -1 ) * currentShiftedValue );

    }

  });


  /**
   * Defines a general text label capable of setting font via given properties.
   */
  Q.UI.Text.extend( "Label", {

    init: function ( p, defaults ) {

      this._super( p, defaults );
      this.fontString = this.p.font;

    }

  });


  /**
   * Defines a text label which displays current amount of upgrade points.
   */
  Q.Label.extend( "UpgradePointsLabel", {

    init: function () {

      this._super({
        x: Q.const.UPGRADE_POINTS.x,
        y: Q.const.UPGRADE_POINTS.y,
        font: Q.const.UPGRADE_POINTS.font,
        color: Q.const.UPGRADE_POINTS.color,
        label: "0",
        value: 0
      });

      this._addValue( Q.const.UPGRADE_POINTS.startValue );

    },

    _addValue: function ( addition ) {

      this.p.value += addition;
      this.p.label = "" + Math.round ( this.p.value );

      this.calcSize();
    },

    handleSlotItemAttached: function ( item ) {

      this._addValue( -1 * item.p.price );

    },

    handleSlotItemDetached: function ( item ) {

      this._addValue( item.p.price );

    }

  });


  /**
   * Defines a slider which can be attached to several positions.
   */
  Q.Sprite.extend( "RepairChargeRatioSlider", {

    init: function () {

      this._super({
        repairChargeRatioPosition: null,
        x: Q.const.CANVAS_WIDTH / 2,
        y: Q.const.CANVAS_HEIGHT / 2,
        asset: "repairchargeratio-slider.png"
      });

      this.add( "draggableFeature" );
      this.add( "hoverableFeature" );

      this.enableDragLimitBox(
        Q.const.REPAIR_CHARGE_RATIO.leftX,
        Q.const.REPAIR_CHARGE_RATIO.bothY,
        Q.const.REPAIR_CHARGE_RATIO.rightX - Q.const.REPAIR_CHARGE_RATIO.leftX,
        1
      );

      this.on( "mouseIn", this, "_handleMouseIn" );
      this.on( "mouseOut", this, "_handleMouseOut" );

    },

    _handleMouseIn: function () {

      Q.el.style.cursor = "col-resize";

    },

    _handleMouseOut: function () {

      Q.el.style.cursor = "auto";

    }

  });


  /**
   * Defines one position for slider to which it can be attached.
   */
  Q.Sprite.extend( "RepairChargeRatioPosition", {

    init: function ( value, x, y ) {

      this._super({
        value: value,
        x: x,
        y: y,
        asset: "repairchargeratio-position.png"
      });

      this.add( "droppableFeature" );
      this.on( "drop", this, "_handleDrop" );

    },

    isDropAllowed: function ( object ) {

      return object.isA( "RepairChargeRatioSlider" );

    },

    _handleDrop: function ( object ) {

      // it's already guaranteed that object is a RepairChargeRatioSlider
      this.attachSlider( object );

    },

    attachSlider: function ( repairChargeRatioSlider ) {

      repairChargeRatioSlider.p.x = this.p.x;
      repairChargeRatioSlider.p.y = this.p.y;

      repairChargeRatioSlider.trigger(
        "position.changed",
        {                                       // this overcomes issue #79
          previousRepairChargeRatioPosition:
            repairChargeRatioSlider.p.repairChargeRatioPosition,
          currentRepairChargeRatioPosition:
            this
        }
      );

      repairChargeRatioSlider.p.repairChargeRatioPosition = this;

    }

  });


  /**
   * Defines a general button which can be clicked.
   */
  Q.Sprite.extend( "Button", {

    init: function ( p, defaults ) {

      this._super( p, defaults );

      this.add( "clickableFeature" );
      this.add( "hoverableFeature" );

      this.on( "mouseIn", this, "_handleMouseIn" );
      this.on( "mouseOut", this, "_handleMouseOut" );

    },

    _handleMouseIn: function () {

      Q.el.style.cursor = "pointer";

    },

    _handleMouseOut: function () {

      Q.el.style.cursor = "auto";

    }

  });


  /**
   * Defines a hero configuration saving button.
   */
  Q.Button.extend( "SaveButton", {

    init: function () {

      if ( typeof Q.sheet( "save" ) === "undefined" ) {
        Q.sheet( "save", "save.png", {
          tilew: Q.const.SAVE_BUTTON.tileWidth,
          tileh: Q.const.SAVE_BUTTON.tileHeight
        });
      }

      this._super({
        x: Q.const.SAVE_BUTTON.x,
        y: Q.const.SAVE_BUTTON.y,
        sheet: "save",
        frame: 0
      });

      this.on( "click", this, "_handleClick" );

    },

    _handleClick: function () {

      var button = this;
      this.p.frame = 1;

      $.ajax({
        url : this._buildSavingUrl(),
        type: "POST",
        data: {
          parameters: this._getCurrentParameters()
        },
        success: function ( data ) {
          button._handleSuccess( data );
        },
        error: function () {
          button._handleError();
        }
      });

    },

    _handleSuccess: function ( data ) {

      if ( data == Q.const.SAVE_BUTTON.validReply ) {
        this.p.frame = 0;
      } else {
        this._handleError();
      }

    },

    _handleError: function () {

      var button = this;
      this.p.frame = 2;

      setTimeout( function () {
        button._handleReset();
      }, Q.const.SAVE_BUTTON.resetTimeout );

    },

    _handleReset: function () {

      this.p.frame = 0;

    },

    _buildSavingUrl: function () {

      var username = encodeURIComponent( Q.const.INPUT_PARAMETERS.userName );
      var pass = encodeURIComponent( Q.const.INPUT_PARAMETERS.passToken );
      var hero = encodeURIComponent( Q.const.INPUT_PARAMETERS.heroName );

      return "index.php?action=save"
        + "&username=" + username + "&pass=" + pass + "&hero=" + hero;

    },

    _getCurrentParameters: function () {

      // make a copy of input ones and the update them accordingly
      var parameters = $.extend( true, {}, Q.const.INPUT_PARAMETERS );

      if ( Q.objects.repairChargeRatioSlider.p.repairChargeRatioPosition ) {
        parameters.repairChargeRatio =
          Q.objects.repairChargeRatioSlider.p.repairChargeRatioPosition.p.value;
      }

      parameters.usedItems.headSlot =
        Q.objects.headSlot.p.item ? Q.objects.headSlot.p.item.p.id : "";

      parameters.usedItems.handSlot =
        Q.objects.handSlot.p.item ? Q.objects.handSlot.p.item.p.id : "";

      parameters.usedItems.bodySlot1 =
        Q.objects.bodySlot1.p.item ? Q.objects.bodySlot1.p.item.p.id : "";

      parameters.usedItems.bodySlot2 =
        Q.objects.bodySlot2.p.item ? Q.objects.bodySlot2.p.item.p.id : "";

      return parameters;

    }

  });


}
