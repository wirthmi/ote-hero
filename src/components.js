function defineComponents( Q ) {


  /**
   * Just a helper function that fixes problem with deprecated "collision
   * engine's database" in case of change in entity's type.
   *
   * Is such solution OK? Isn't there a better one?
   */
  function fixDeprecatedCollisionDatabase( entity ) {

    if ( entity.stage ) {
      entity.stage.delGrid( entity );
      entity.stage.addGrid( entity );
    }

  }


  /**
   * Component which allows any entity to be "draggable".
   */
  Q.component( "draggableFeature", {

    added: function () {

      // so we can filter "draggable" objects via collision masks
      this.entity.p.type |= Q.const.TYPE_DRAGGABLE;

      this.entity.p.dragLimitBox = null;

      this.entity.on( "drag", this, "_handleEntityDrag" );
      this.entity.on( "touchEnd", this, "_handleEntityTouchEnd" );

    },

    destroyed: function () {

      this.entity.p.type &= ~Q.const.TYPE_DRAGGABLE;
      delete this.entity.p.dragLimitBox;
      fixDeprecatedCollisionDatabase( this.entity );

    },

    _handleEntityDrag: function ( event ) {

      var x = event.origX + event.dx;
      var y = event.origY + event.dy;

      if ( this.entity.p.dragLimitBox ) {

        x = this._boundValue(
          this.entity.p.dragLimitBox.minimumX,
          x,
          this.entity.p.dragLimitBox.maximumX
        );

        y = this._boundValue(
          this.entity.p.dragLimitBox.minimumY,
          y,
          this.entity.p.dragLimitBox.maximumY
        );
      }

      this.entity.p.x = x;
      this.entity.p.y = y;

    },

    _handleEntityTouchEnd: function ( event ) {

      var droppable = this.entity.stage.locate(
        this.entity.p.x, this.entity.p.y, Q.const.TYPE_DROPPABLE );

      // notice that a "droppable" object is allowed to refuse given drop

      var isDropValid = (
        ( droppable !== false ) &&
        droppable.droppableFeature.dropped( this.entity )
      );

      if ( !isDropValid ) {
        this.entity.p.x = event.origX;
        this.entity.p.y = event.origY;
      }

    },

    _boundValue: function ( minimum, value, maximum ) {

      if ( value < minimum ) {
        return minimum;
      } else if ( value > maximum ) {
        return maximum;
      } else {
        return value;
      }

    },

    extend: {

      enableDragLimitBox: function ( x, y, width, height ) {

        this.p.dragLimitBox = {
            minimumX: x,
            maximumX: x + width - 1,
            minimumY: y,
            maximumY: y + height - 1
        }

      },

      disableDragLimitBox: function () {

        this.p.dragLimitBox = null;

      }

    }

  });


  /**
   * Component which allows any entity to be "droppable".
   */
  Q.component( "droppableFeature", {

    added: function () {

      // so we can filter "droppable" objects via collision masks
      this.entity.p.type |= Q.const.TYPE_DROPPABLE;

    },

    destroyed: function () {

      this.entity.p.type &= ~Q.const.TYPE_DROPPABLE;
      fixDeprecatedCollisionDatabase( this.entity );

    },

    dropped: function ( object ) {

      var isDropAllowed =
        ( typeof this.entity.isDropAllowed === "undefined" ) ||
        this.entity.isDropAllowed( object );

      if ( isDropAllowed ) {
        this.entity.trigger( "drop", object );
      }

      return isDropAllowed;

    }

  });


  /**
   * Component which allows any entity to be "hoverable".
   */
  Q.component( "hoverableFeature", {

    added: function () {

      // so we can filter "hoverable" objects via collision masks
      this.entity.p.type |= Q.const.TYPE_HOVERABLE;

      this._addCanvasMousemoveListenerOnce();

    },

    destroyed: function () {

      this.entity.p.type &= ~Q.const.TYPE_HOVERABLE;
      fixDeprecatedCollisionDatabase( this.entity );

    },

    _addCanvasMousemoveListenerOnce: function () {

      if ( typeof Q.hoverObject === "undefined" ) {

        // this ensures, that the following listener will be added just once
        Q.hoverObject = null;

        $( Q.el ).mousemove(function ( event ) {

          var stage = Q.stage();
          var offset = $(this).offset();

          var x = Q.canvasToStageX( event.pageX - offset.left, stage );
          var y = Q.canvasToStageY( event.pageY - offset.top, stage );

          var object =
            stage.locate( x, y, Q.const.TYPE_HOVERABLE );

          var isPointingSomewhere = ( object !== false );
          var wasPointingSomewhere = ( Q.hoverObject !== null );
          var isStillPointingSameThing = ( object === Q.hoverObject );

          if ( !isPointingSomewhere && !wasPointingSomewhere ) {
            // intentionally do nothing, it is here because of
            // performance reasons, it's the most frequent case
          } else if ( isPointingSomewhere && !wasPointingSomewhere ) {
            Q.hoverObject = object;
            Q.hoverObject.trigger( "mouseIn" );
            Q.hoverObject.trigger( "hover", x, y );
          } else if ( !isPointingSomewhere && wasPointingSomewhere ) {
            Q.hoverObject.trigger( "mouseOut" );
            Q.hoverObject = null;
          } else if ( isStillPointingSameThing ) {
            Q.hoverObject.trigger( "hover", x, y );
          } else {
            Q.hoverObject = object;
            Q.hoverObject.trigger( "mouseOut" );
            Q.hoverObject.trigger( "mouseIn" );
            Q.hoverObject.trigger( "hover", x, y );
          }

        });
      }

    }

  });


  /**
   * Component which allows any entity to be "clickable".
   */
  Q.component( "clickableFeature", {

    added: function () {

      // so we can filter "clickable" objects via collision masks
      this.entity.p.type |= Q.const.TYPE_CLICKABLE;

      this.entity.on( "touch", this, "_handleEntityTouch" );

    },

    destroyed: function () {

      this.entity.p.type &= ~Q.const.TYPE_CLICKABLE;
      fixDeprecatedCollisionDatabase( this.entity );

    },

    _handleEntityTouch: function ( event ) {

      this.entity.trigger( "click" );

    }

  });

}
