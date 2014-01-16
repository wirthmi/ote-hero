<?php

  function getRawInput( $variable ) {

    if ( isset( $_POST[ $variable ] ) ) {
      return $_POST[ $variable ];
    } elseif ( isset( $_GET[ $variable ] ) ) {
      return $_GET[ $variable ];
    } else {
      return false;
    }

  }


  function getFilteredInput( $variable, $regexp ) {

    $type = ( isset( $_POST[ $variable ] ) ? INPUT_POST : INPUT_GET );

    $value = filter_input(
      $type,
      $variable,
      FILTER_VALIDATE_REGEXP,
      array(
        "options" => array( "regexp" => $regexp )
      )
    );

    if ( $value ) {
      return $value;
    } else {
      die( "A valid \"" . $variable . "\" parameter has been expected." );
    }

  }


  function getConfigFromValues( $values ) {

    return json_encode( $values );

  }


  function getValuesFromConfig( $config ) {

    return json_decode( $config, true );

  }


  function validateHeroValuesStructure( $values ) {

    $model = getDefaultHeroValues( "chuck", "norris" );

    // validate both ways, i.e. neither of them has some additional data

    return (
      validateArrayStructureAgainstModel( $values, $model ) &&
      validateArrayStructureAgainstModel( $model, $values )
    );

  }


  function validateArrayStructureAgainstModel( $array, $model ) {

    if ( !is_array( $array ) || !is_array( $model ) ) {
      return false;
    }

    foreach ( $model as $key => $value ) {

      if ( !isset( $array[ $key ] ) ) {
        return false;
      }

      if ( is_array( $array[ $key ] ) ) {

        $isNestedArrayValid =
          validateArrayStructureAgainstModel( $model[ $key ], $array[ $key ] );

        if ( !$isNestedArrayValid ) {
          return false;
        }
      }
    }

    return true;

  }


  function getDefaultHeroValues( $username, $hero ) {

    $values = array(
      "userName" => $username,
      "passToken" => md5( $username . MAGIC_PASS_SALT ),
      "heroName" => $hero,
      "repairChargeRatio" => 3,
      "usedItems" => array(
        "headSlot" => "",
        "handSlot" => "",
        "bodySlot1" => "",
        "bodySlot2" => ""
      )
    );

    return $values;

  }


  function getHeroValues( $username, $hero ) {

    $db = new Database();
    $query =
      "SELECT config FROM " . DB_TABLE .
      " WHERE username = '" . p2db( $username ) . "'" .
      " AND hero = '" . p2db( $hero ) . "'" .
      " LIMIT 1";

    //print_r( $query );
    $result = $db->q( $query );

    if ( count( $result ) > 0 ) {
      return getValuesFromConfig( $result[ 0 ][ "config" ] );
    } else {
      return getDefaultHeroValues( $username, $hero );
    }

  }


  function setHeroValues( $username, $hero, $values ) {

    $db = new Database();

    $username = p2db( $username );
    $hero = p2db( $hero );
    $config = p2db( getConfigFromValues( $values ) );

    $query =
      "INSERT INTO " . DB_TABLE . " ( username, hero, config )" .
      " VALUES ( '" . $username . "', '" . $hero . "', '" . $config . "' )" .
      " ON DUPLICATE KEY UPDATE" .
      " username = '" . $username . "', hero = '" . $hero .
      "', config = '" . $config . "', timestamp = NOW()";

    //print_r( $query );
    return $db->q( $query );

  }


  function addDefaultItemsForLobbyIfNecessary( $values ) {

    if ( !$values[ "usedItems" ][ "headSlot" ] ) {
      $values[ "usedItems" ][ "headSlot" ] = "h0";
    }
    if ( !$values[ "usedItems" ][ "handSlot" ] ) {
      $values[ "usedItems" ][ "handSlot" ] = "w0";
    }
    if ( !$values[ "usedItems" ][ "bodySlot1" ] ) {
      $values[ "usedItems" ][ "bodySlot1" ] = "b0";
    }
    if ( !$values[ "usedItems" ][ "bodySlot2" ] ) {
      $values[ "usedItems" ][ "bodySlot2" ] = "b0";
    }

    return $values;

  }

?>
