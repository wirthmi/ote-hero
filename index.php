<?php

  include "constants.php";
  include "database.php";
  include "functions.php";

  $action = getFilteredInput( "action", "/^load|save|setup$/" );
  $username = getFilteredInput( "username", "/^.*$/" );
  $pass = mb_strtolower( getFilteredInput( "pass", "/^[a-fA-F0-9]{32}$/" ) );
  $hero = getFilteredInput( "hero", "/^ball|bug|bulk|cam|doc$/" );

  if ( $pass !== md5( $username . MAGIC_PASS_SALT ) ) {
    die( "Access denied." );
  }

  // ######## LOAD HANDLER ########
  if ( $action === "load" ) {

    $values = getHeroValues( $username, $hero );
    $values = addDefaultItemsForLobbyIfNecessary( $values );

    die(
      $values[ "heroName" ] . "_" .
      $values[ "usedItems" ][ "headSlot" ] . "_" .
      $values[ "usedItems" ][ "handSlot" ] . "_" .
      $values[ "usedItems" ][ "bodySlot1" ] . "_" .
      $values[ "usedItems" ][ "bodySlot2" ] . "_" .
      $values[ "repairChargeRatio" ]
    );

  // ######## SAVE HANDLER ########
  } elseif ( $action === "save" ) {

    $values = getRawInput( "parameters" );
    //print_r( $values );

    if ( !validateHeroValuesStructure( $values ) ) {
      die( "Given parameters doesn't have a desired structure." );
    }
    if ( !setHeroValues( $username, $hero, $values ) ) {
      die( "Saving parameters to database has failed." );
    }

    die( "OK" );

  // ######## SETUP HANDLER ########
  } elseif ( $action === "setup" ) {

    $values = getHeroValues( $username, $hero );

    include "application.html";

  // ######## NEVER GONNA HAPPEN HANDLER ########
  } else {
    die( "Requested unknown action." );
  }

?>
