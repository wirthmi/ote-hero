function defineScenes( Q ) {

  /**
   * This is a helper function for building a single slot.
   */
  function buildSlot( Q, stage, usage, properties ) {

    var slot = new Q.Slot( usage, properties.x, properties.y );
    stage.insert( slot );

    return slot;

  }


  /**
   * This is a helper function capable of building large containers of slots.
   */
  function buildSlotContainer( Q, stage, usage, properties ) {

    var slotContainer = new Q.UI.Container({
      x: properties.x,
      y: properties.y
    });

    stage.insert( slotContainer );

    for ( var i = 0; i < properties.slots; ++i ) {

      var slot = new Q.Slot(
        usage,
        ( i % properties.columns ) * Q.const.SLOT_WIDTH,
        Math.floor( i / properties.columns ) * Q.const.SLOT_HEIGHT
      );

      slotContainer.insert( slot );
    }

    slotContainer.fit();
    return slotContainer;

  }


  /**
   * It just returns a simple router to slots placed within slot containers.
   * Routes are determined by slot container's usage purpose.
   */
  function getUsageSlotRouter(
    Q, headSlotContainer, handSlotContainer, bodySlotContainer
  ) {

    var usageSlotRouter = new Array();

    usageSlotRouter[ Q.const.USAGE_HEAD ] = {
      slotContainer: headSlotContainer,
      occupiedSlotCount: 0,
      totalSlotCount: Q.const.HEAD_SLOT_CONTAINER.slots
    };
    usageSlotRouter[ Q.const.USAGE_HAND ] = {
      slotContainer: handSlotContainer,
      occupiedSlotCount: 0,
      totalSlotCount: Q.const.HAND_SLOT_CONTAINER.slots
    };
    usageSlotRouter[ Q.const.USAGE_BODY ] = {
      slotContainer: bodySlotContainer,
      occupiedSlotCount: 0,
      totalSlotCount: Q.const.BODY_SLOT_CONTAINER.slots
    };

    return usageSlotRouter;

  }


  /**
   * It returns a name of user's selected hero. If it is unknown, a default
   * one will be returned.
   */
  function getSelectedHeroName( Q ) {

    var selectedHeroName = Q.const.INPUT_PARAMETERS.heroName;

    if ( typeof Q.const.INPUT_HEROES[ selectedHeroName ] === "undefined" ) {
      selectedHeroName = Q.const.DEFAULT_HERO_NAME;
    }

    return selectedHeroName;

  }


  /**
   * This is a helper function that builds all accessible items defined within
   * application's input and attaches them to appropriate slots in slot containers.
   */
  function attachItemsToSlotContainers(
    Q, stage, headSlotContainer, handSlotContainer, bodySlotContainer
  ) {

    var usageSlotRouter = getUsageSlotRouter(
      Q, headSlotContainer, handSlotContainer, bodySlotContainer );

    var selectedHeroName = getSelectedHeroName( Q );

    $.each( Q.const.INPUT_ITEMS, function ( index, inputItem ) {

      var usageSlotRoute = usageSlotRouter[ inputItem.usage ];

      if ( usageSlotRoute.occupiedSlotCount >= usageSlotRoute.totalSlotCount ) {
        alert( "There is not enough space in slot container for all items." );
        return false;
      }

      var isItemAccessibleToSelectedHero = false;

      // if goodHeroes array contains at least one hero name, then badHeroes
      // array shall be ignored and only heroes listed in goodHeroes can use
      // the item (i.e. others automatically can not)
      // if goodHeroes is empty, then those heroes which are listed in badHeroes
      // can not use the item (i.e. others automatically can)

      if ( inputItem.goodHeroes.length > 0 ) {
        isItemAccessibleToSelectedHero =
          ( inputItem.goodHeroes.indexOf( selectedHeroName ) >= 0 );
      } else {
        isItemAccessibleToSelectedHero =
          ( inputItem.badHeroes.indexOf( selectedHeroName ) == -1 );
      }

      if ( isItemAccessibleToSelectedHero ) {

        var item = new Q.Item( inputItem );
        stage.insert( item );

        usageSlotRoute.slotContainer
          .children[ usageSlotRoute.occupiedSlotCount++ ].attachItem( item );
      }

    });

  }


  /**
   * This is a helper function for building a set of hero's capability stripes.
   */
  function buildCapabilityStripes( Q, stage ) {

    Q.sheet( "stripes", "stripes.png", {
      tilew: Q.const.CAPABILITY_STRIPES.tileWidth,
      tileh: Q.const.CAPABILITY_STRIPES.tileHeight
    });

    var selectedHeroCapabilities =
      Q.const.INPUT_HEROES[ getSelectedHeroName( Q ) ].capabilities;

    var i = 0;
    $.each( selectedHeroCapabilities, function ( capability, value ) {

      // woohoo :-D ... Damned, focus man! :-)
      var stripper = new Q.Sprite({
        x: Q.const.CAPABILITY_STRIPES.x,
        y: (
          Q.const.CAPABILITY_STRIPES.y +
            ( i * Q.const.CAPABILITY_STRIPES.verticalStride )
        ),
        sheet: "stripes",
        frame: ( value - 1 )
      });

      stage.insert( stripper );
      ++i;

    });

  }


  /**
   * This is a helper function for building a set hero's capability bonus signs.
   */
  function buildPlusMinusSigns( Q, stage ) {

    var capabilities =
      Q.const.INPUT_HEROES[ Q.const.DEFAULT_HERO_NAME ].capabilities;

    var i = 0;
    $.each( capabilities, function ( capability ) {

      var plusMinusSign = new Q.PlusMinusSign(
        capability,
        Q.const.PLUS_MINUS_SIGNS.x,
        (
          Q.const.PLUS_MINUS_SIGNS.y +
            ( i * Q.const.PLUS_MINUS_SIGNS.verticalStride )
        )
      );

      stage.insert( plusMinusSign );

      Q.objects.headSlot.on(
        "item.attached", plusMinusSign, "handleSlotItemAttached" );
      Q.objects.headSlot.on(
        "item.detached", plusMinusSign, "handleSlotItemDetached" );

      Q.objects.handSlot.on(
        "item.attached", plusMinusSign, "handleSlotItemAttached" );
      Q.objects.handSlot.on(
        "item.detached", plusMinusSign, "handleSlotItemDetached" );

      Q.objects.bodySlot1.on(
        "item.attached", plusMinusSign, "handleSlotItemAttached" );
      Q.objects.bodySlot1.on(
        "item.detached", plusMinusSign, "handleSlotItemDetached" );

      Q.objects.bodySlot2.on(
        "item.attached", plusMinusSign, "handleSlotItemAttached" );
      Q.objects.bodySlot2.on(
        "item.detached", plusMinusSign, "handleSlotItemDetached" );

      if ( capability === "repair" ) {

        Q.objects.repairChargeRatioSlider.on(
          "position.changed",
          plusMinusSign,
          "handleSliderPositionChangedAsDecreasingMagnitude"
        );

      } else if ( capability === "charge" ) {

        Q.objects.repairChargeRatioSlider.on(
          "position.changed",
          plusMinusSign,
          "handleSliderPositionChangedAsIncreasingMagnitude"
        );
      }

      ++i;

    });

  }


  /**
   * This is a helper function for establishing a very important upgrade points
   * label which also holds current amount of upgrade points and so it should
   * be inserted quite soon into the stage.
   */
  function buildUpgradePointsLabel( Q, stage ) {

    var upgradePointsLabel = new Q.UpgradePointsLabel();
    stage.insert( upgradePointsLabel );

    Q.objects.headSlot.on(
      "item.attached", upgradePointsLabel, "handleSlotItemAttached" );
    Q.objects.headSlot.on(
      "item.detached", upgradePointsLabel, "handleSlotItemDetached" );

    Q.objects.handSlot.on(
      "item.attached", upgradePointsLabel, "handleSlotItemAttached" );
    Q.objects.handSlot.on(
      "item.detached", upgradePointsLabel, "handleSlotItemDetached" );

    Q.objects.bodySlot1.on(
      "item.attached", upgradePointsLabel, "handleSlotItemAttached" );
    Q.objects.bodySlot1.on(
      "item.detached", upgradePointsLabel, "handleSlotItemDetached" );

    Q.objects.bodySlot2.on(
      "item.attached", upgradePointsLabel, "handleSlotItemAttached" );
    Q.objects.bodySlot2.on(
      "item.detached", upgradePointsLabel, "handleSlotItemDetached" );

    return upgradePointsLabel;

  }


  /**
   * This helper just creates a hero name image label.
   */
  function buildHeroName( Q, stage ) {

    var heroName = new Q.Sprite({
      x: Q.const.HERO_NAME.x,
      y: Q.const.HERO_NAME.y,
      asset: "hero-" + getSelectedHeroName( Q ) + ".png"
    });

    stage.insert( heroName );

  }


  /**
   * This helper builds some item label meant to be visible only on item hover.
   */
  function buildItemLabel( Q, stage, properties ) {

    var itemLabel = new Q.Label({
      x: properties.x,
      y: properties.y,
      color: properties.color,
      font: properties.font,
      size: properties.font.split( " " )[ 1 ].slice( 0, -2 ),
      align: properties.align,
      label: " "
    });

    stage.insert( itemLabel );
    return itemLabel;

  }


  /**
   * This is a helper function for building a repair-charge balance slider.
   */
  function buildRepairChargeRatioSlider( Q, stage ) {

    var width =
      ( Q.const.REPAIR_CHARGE_RATIO.rightX - Q.const.REPAIR_CHARGE_RATIO.leftX );
    var stride =
      ( width / ( Q.const.REPAIR_CHARGE_RATIO.positions - 1 ) );

    for ( var i = 0; i < Q.const.REPAIR_CHARGE_RATIO.positions; ++i ) {

      var position = new Q.RepairChargeRatioPosition(
        i + 1,
        Math.floor( Q.const.REPAIR_CHARGE_RATIO.leftX + ( i * stride ) ),
        Q.const.REPAIR_CHARGE_RATIO.bothY
      );

      stage.insert( position );
    }

    return stage.insert( new Q.RepairChargeRatioSlider() );

  }


  /**
   * This is a helper function which just attaches slider to the position
   * determined by application's input. This step is sepparated because
   * position attaching events must be triggered after all plus-minus signs
   * are built.
   */
  function attachRepairChargeRatioSliderToSelectedPosition( Q ) {

    var middle = ( Math.floor( Q.const.REPAIR_CHARGE_RATIO.positions / 2 ) + 1 );
    var middlePosition = null;

    var selected = Q.const.INPUT_PARAMETERS.repairChargeRatio;
    var selectedPosition = null;

    Q( "RepairChargeRatioPosition" ).each(function () {

      if ( this.p.value === middle ) {
        middlePosition = this;
      } else if ( this.p.value === selected ) {
        selectedPosition = this;
      }

    });

    if ( !selectedPosition ) {
      selectedPosition = middlePosition;
    }

    selectedPosition.attachSlider( Q.objects.repairChargeRatioSlider );

  }


  /**
   * This is just a helper function that looks up for given item and if it's
   * found, it will be attached to the given slot.
   */
  function tryToAttachItemsToSlot( Q, itemId, slot ) {

    if ( !itemId || ( itemId.length < 1 ) ) {
      return;
    }

    var foundItem = null;

    Q( "Item" ).each(function () {
      if ( this.p.id === itemId ) {
        foundItem = this;
        return false;
      }
    });

    if ( foundItem ) {
      slot.attachItem( foundItem );
    }

  }


  /**
   * Defines application's main scene with all that cool&sweet stuff.
   */
  Q.scene( "main", function ( stage ) {

    stage.insert( new Q.Background() );

    // ------------

    Q.objects.headSlot = buildSlot(
      Q, stage, Q.const.USAGE_HEAD, Q.const.HERO_HEAD_SLOT );
    Q.objects.handSlot = buildSlot(
      Q, stage, Q.const.USAGE_HAND, Q.const.HERO_HAND_SLOT );
    Q.objects.bodySlot1 = buildSlot(
      Q, stage, Q.const.USAGE_BODY, Q.const.HERO_BODY_SLOT_1 );
    Q.objects.bodySlot2 = buildSlot(
      Q, stage, Q.const.USAGE_BODY, Q.const.HERO_BODY_SLOT_2 );

    var headSlotContainer = buildSlotContainer(
        Q, stage, Q.const.USAGE_HEAD, Q.const.HEAD_SLOT_CONTAINER );
    var handSlotContainer = buildSlotContainer(
        Q, stage, Q.const.USAGE_HAND, Q.const.HAND_SLOT_CONTAINER );
    var bodySlotContainer = buildSlotContainer(
        Q, stage, Q.const.USAGE_BODY, Q.const.BODY_SLOT_CONTAINER );

    Q.objects.upgradePointsLabel = buildUpgradePointsLabel( Q, stage );

    attachItemsToSlotContainers(
      Q, stage, headSlotContainer, handSlotContainer, bodySlotContainer );

    // ------------

    Q.objects.repairChargeRatioSlider =
      buildRepairChargeRatioSlider( Q, stage );

    buildCapabilityStripes( Q, stage );
    buildPlusMinusSigns( Q, stage );

    attachRepairChargeRatioSliderToSelectedPosition( Q );

    // ------------

    tryToAttachItemsToSlot(
      Q, Q.const.INPUT_PARAMETERS.usedItems.headSlot, Q.objects.headSlot );
    tryToAttachItemsToSlot(
      Q, Q.const.INPUT_PARAMETERS.usedItems.handSlot, Q.objects.handSlot );
    tryToAttachItemsToSlot(
      Q, Q.const.INPUT_PARAMETERS.usedItems.bodySlot1, Q.objects.bodySlot1 );
    tryToAttachItemsToSlot(
      Q, Q.const.INPUT_PARAMETERS.usedItems.bodySlot2, Q.objects.bodySlot2 );

    // ------------

    buildHeroName( Q, stage );

    Q.objects.itemNameLabel =
      buildItemLabel( Q, stage, Q.const.ITEM_NAME );
    Q.objects.itemDescriptionLabel =
      buildItemLabel( Q, stage, Q.const.ITEM_DESCRIPTION );

    // ------------

    stage.insert( new Q.SaveButton() );

  });

}
