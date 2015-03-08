<?php 

	function activarUsuario($hash = null)
	{
		require 'import.php';

		if($hash != null)
		{

			$stmt = $dbh->prepare("UPDATE users SET status = 1 WHERE hash = :hash");
			$stmt->bindParam(':hash', $hash);
			$stmt->execute();		
		}
		$dbh = null;
	}

	function mostrarPaginaExito()
	{
		require 'congratulation.php';
	}

	if (isset($_GET['m']) && !is_null($_GET['m']) && $_GET['m'] != "") 
	{
		activarUsuario($_GET['m']);
		mostrarPaginaExito();
	}
	

