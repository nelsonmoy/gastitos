<?php
	session_start();

	if(isset($_GET['action']) && $_GET['action'] != "" && !is_null($_GET['action']))
	{
		switch ($_GET['action']) {
			case 'signup':
				registroUsuario($_GET['email'], $_GET['password']);
				break;

			case 'login':
				loginUsuario($_GET['email'], $_GET['password']);
				break;

			case 'logout':
				logoutUsuario();
				break;
			
			case 'add':
				agregarGastito($_GET['concepto'], $_GET['costo']);
				break;

			case 'remove':
				quitarGastito($_GET['id']);
				break;

			case 'isloginuser':
				estaLogeadoUsuario();
				break;
			case 'load':
				cargarDatos();
				break;

			default:
				# code...
				break;
		}
	}


	function registroUsuario($email , $password)
	{
		require 'import.php';
		$resultado = "0";
		if(!correoExiste($email))
		{
			if($email != null && $password != null)
			{

				$stmt = $dbh->prepare("INSERT INTO users (email, password, hash, created) VALUES (:email, :password, :hash, NOW())");
				$stmt->bindParam(':email', $email);
				$stmt->bindParam(':password', $password);
				$stmt->bindParam(':hash', md5($email));
				$stmt->execute();
				enviarCorreoActivacion($email);
				$resultado = "1";
			}
		}
		else
		{
			$resultado = "2";
		}
		$dbh = null;
		echo $resultado;
	}

	function correoExiste($email = '')
	{
		require 'import.php';

		$stmt = $dbh->prepare('SELECT * FROM users WHERE email = :email');
		$stmt->bindParam(':email', $email);
		$stmt->execute();
		$data = $stmt->fetchAll();
		$dbh = null;
		if (count($data) == 0) 
		{
			return false;
		}
		else
		{
			return true;
		}
		
	}

	function enviarCorreoActivacion($email = null)
	{
		// subject
		$titulo = 'Activa tu cuenta :)';

		// message
		$mensaje = '
		<html>
		<head>
			<meta charset="UTF-8">
			<title>¡Felicidades, ya puedes utilizar Gastitos!</title>
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
		  	<title>Activa tu cuenta</title>
		</head>
		<body>
		  <h2>¡Bienvenido a Gastitos!</h2>
		  <p>Estas a un paso de poder disfrutas de Gastitos</p>
		  <p>Para activar tu cuenta solo debes clickear el siguiente botón</p>
		  <p><a class="btn btn-default" href="http://gastitos.motmotsystem.net/back/activate.php?m='.md5($email).'>Activar cuenta</a></p>
		</body>
		</html>
		';

		// Para enviar un correo HTML mail, la cabecera Content-type debe fijarse
		$cabeceras  = 'MIME-Version: 1.0' . "\r\n";
		$cabeceras .= 'Content-type: text/html; charset=utf-8' . "\r\n";

		// Cabeceras adicionales
		$cabeceras .= 'To: Ti <'.$email.'>' . "\r\n";
		$cabeceras .= 'From: Motmot System <hola@motmotsystem.net>' . "\r\n";

		// Mail it
		mail($email, $titulo, $mensaje, $cabeceras);
	}

	function agregarGastito($concepto = null, $costo = null)
	{
		require 'import.php';
		$retorno = "0";
		if($concepto != null && $costo != null)
		{
			$user = $_SESSION['current_user'];
			$stmt = $dbh->prepare("INSERT INTO records (user_id, concept, cost, created) VALUES (:user_id, :concept, :cost , NOW())");
			$stmt->bindParam(':user_id', $user[0]['id']);
			$stmt->bindParam(':concept', $concepto);
			$stmt->bindParam(':cost', $costo);
			$stmt->execute();
			$retorno = $dbh->lastInsertId();
		}
		$dbh = null;
		echo $retorno;
	}

	function quitarGastito($id = null)
	{
		require 'import.php';

		if($id != null)
		{

			$stmt = $dbh->prepare("DELETE FROM records WHERE id = :id");
			$stmt->bindParam(':id', $id);
			$stmt->execute();
		}
		$dbh = null;	
	}


	function loginUsuario($email, $password)
	{
		require 'import.php';
		$resultado = "0";
		if(correoExiste($email))
		{
			if($email != null && $password != null)
			{

				$stmt = $dbh->prepare("SELECT * FROM users  WHERE email = :email AND password = :password AND status = 1");
				$stmt->bindParam(':email', $email);
				$stmt->bindParam(':password', $password);
				$stmt->execute();
				$data = $stmt->fetchAll();
				if(count($data) == 1)
				{
					$_SESSION['current_user'] = $data;
					$resultado = "1";
				}
				else
				{
					$resultado = "0";
				}
				
			}
		}
		else
		{
			$resultado = "0";
		}
		$dbh = null;
		echo $resultado;
	}

	function logoutUsuario()
	{
		session_start();
		$_SESSION['current_user'] = null;
		session_destroy();
	}

	function estaLogeadoUsuario()
	{
		$retorno = "0";
		if ( isset($_SESSION['current_user']) && $_SESSION['current_user'] != null) 
		{
			$retorno = "1";
		}
		else
		{
			$retorno = "0";	
		}
		echo $retorno;
	}

	function cargarDatos()
	{
		header('Content-type: application/json');
		require 'import.php';
		$resultado = "";
		$user = $_SESSION['current_user'];
		$stmt = $dbh->prepare("SELECT * FROM records  WHERE user_id = :id AND created BETWEEN :dateTimeOne AND :dateTimeTwo");
		$stmt->bindParam(':id', $user[0]['id']);
		$dateTimeOne = new DateTime();
		$dateTimeOne->setTime(0, 0, 0);
		$dateTimeTwo = new DateTime();
		$dateTimeTwo->setTime(23,59,59);
		$stmt->bindParam(':dateTimeOne', $dateTimeOne->format('Y-m-d H:i:s'));
		$stmt->bindParam(':dateTimeTwo', $dateTimeTwo->format('Y-m-d H:i:s'));
		$stmt->execute();
		$data = $stmt->fetchAll();
		$dbh = null;
		echo json_encode($data, JSON_PRETTY_PRINT);
		
	}