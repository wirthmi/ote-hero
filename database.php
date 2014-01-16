<?php

// @@@ class for connecting to some database server
class Database
{
	protected $db = null;			// resource of our database connection
	protected $established = false;		// true if connection is established



	// @@@ constructor connecting to our database
	function __construct($host = null,$login = null,$password = null,$database = null)
	{
		// if given parameters are ok use them, otherwise use standard values
		if ((!isset($host)) || is_null($host) || (!is_string($host)) || (iconv_strlen($host) <= 0) ||
		(!isset($login)) || is_null($login) || (!is_string($login)) || (iconv_strlen($login) <= 0) ||
		(!isset($password)) || is_null($password) || (!is_string($password)) ||
		(iconv_strlen($password) <= 0) || (!isset($database)) || is_null($database) ||
		(!is_string($database)) || (iconv_strlen($database) <= 0))
			{ $host = DB_HOST; $login = DB_LOGIN; $password = DB_PASSWORD; $database = DB_DATABASE; }

		if (!$this->established)
		{
			// connect to our mysql server and choose database
			$this->db=mysql_connect($host,$login,$password,true) or error_handler(4);
			mysql_select_db($database,$this->db) or error_handler(4);

			// choose UTF-8 codepage
			mysql_query('SET NAMES \'utf8\'',$this->db) or error_handler(5);

			// connection is established
			$this->established=is_resource($this->db);
		}
	}



	// @@@ destructor for closing established connection to database
	function __destruct()
	{
		if ($this->established) { mysql_close($this->db); $this->established=false; }
	}



	// @@@ function for sending querries through database link, it returns answers,
	// if result is empty, it returns an array with no items
	function q($query = null)
	{
		// if database is connected and the query is non-empty string
		if ($this->established && isset($query) && is_string($query) && (iconv_strlen($query) > 0))
		{
			// submit a query
			$result = mysql_query($query,$this->db) or error_handler(5);

			// whether the result is a resource (database server is sending
			// some data back), check them a return them as an array
			if (is_resource($result))
			{
				$return = array();
				while ($row = mysql_fetch_array($result,MYSQL_ASSOC)) $return[] = $row;

				// unset resource for data and return rusult as array
				mysql_free_result($result); unset($result);
				return($return);
			}
			else return($result);
		}
		else return(false);
	}



	// @@@ function for discovering the last id (AUTO_INCREMENT column) generated
	// from the previous INSERT sql operation
	function last_id()
	{
		if ($this->established) return(mysql_insert_id()); else return(false);
	}
}

// @@@ function for escaping dangerous characters in inserted parts of SQL querries,
// it helps to prevent SQL injection attacks of bad or stupid people
function p2db($sql_part)
{
	return(mysql_real_escape_string(trim($sql_part)));
}

?>
