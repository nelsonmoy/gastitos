<?php

	if( !function_exists("connection") ) 
	{
		function connection($user, $pass, $db, $host) 
		{
			try {
			    return $dbh = new PDO('mysql:host='.$host.';dbname='.$db, $user, $pass);
			} catch (PDOException $e) {
			    print "Error!: " . $e->getMessage() . "<br/>";
			    die();
			}
		}
	}

	$dbh = connection($dbUser, $dbPassword, $db, $dbHost);

	

	