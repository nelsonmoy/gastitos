<?php
	header("Access-Control-Allow-Origin: *");
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

			case 'updatepassword':
				cambiarContrasena($_GET['password']);
				break;

			case 'reporteayer':
				cargarReporteAyer($_GET['fecha']);
				break;

			case 'reportefecha';
				cargarReporteFecha($_GET['dia'], $_GET['mes'], $_GET['anio']);
				break;

			case 'reportemes':
				cargarReporteMes($_GET['mes'], $_GET['anio']);
				break;

			case 'reporteanio':
				cargarReporteAnio($_GET['anio']);
				break;

			case 'cargaranios':
				cargarAnios();
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

		$stmt = $dbh->prepare('SELECT email FROM users WHERE email = :email');
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
		  <p>Para activar tu cuenta debes de copiar y pegar el siguiente enlace en tu navegador y presionar la tecla Enter</p>
		  <p>http://gastitos.motmotsystem.net/back/activate.php?m='.md5($email).'</p>
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

				$stmt = $dbh->prepare("SELECT id, email, password, status FROM users  WHERE email = :email AND password = :password AND status = 1");
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
		require 'import.php';
		cors(); 
		
		/* PHP5 */
		//$data = [];

		/* PHP4 */
		$data = array();

		if (isset($_SESSION['current_user']))
		{
			try
			{
				$resultado = "";
				$user = $_SESSION['current_user'];
				$stmt = $dbh->prepare("SELECT * FROM records WHERE user_id = :id AND created BETWEEN :dateTimeOne AND :dateTimeTwo");
				$stmt->bindParam(':id', $user[0]['id']);
				$fecha = date('Y-m-j');
				/*
				$nuevafecha = strtotime ( '-1 day' , strtotime ( $fecha ) ) ;
				$nuevafecha = date ( 'Y-m-j' , $nuevafecha );
				$dateTimeOne = new DateTime($nuevafecha);
				$dateTimeTwo = new DateTime($nuevafecha);
				*/

				$dateTimeOne = new DateTime();
				$dateTimeTwo = new DateTime();

				$dateTimeOne->setTime(0, 0, 0);
				$dateTimeTwo->setTime(23,59,59);
				
				$oDateOne = $dateTimeOne->format('Y-m-d H:i:s');
				$oDateTwo = $dateTimeTwo->format('Y-m-d H:i:s');

				$stmt->bindParam(':dateTimeOne', $oDateOne);
				$stmt->bindParam(':dateTimeTwo', $oDateTwo);

				$stmt->execute();
				$data = $stmt->fetchAll();
				$dbh = null;
				echo json_encode($data);
			}
			catch (Exception $e) {
				echo json_encode($data);	
			}
		}
	}

	function cambiarContrasena($password)
	{
		require 'import.php';
		$retorno = "0";
		if($password != null)
		{
			$user = $_SESSION['current_user'];
			$stmt = $dbh->prepare("UPDATE users SET password = :password WHERE id = :user_id");
			$stmt->bindParam(':user_id', $user[0]['id']);
			$stmt->bindParam(':password', $password);
			$stmt->execute();
			$retorno = "1";
		}
		$dbh = null;
		echo $retorno;
	}

	function cargarReporteAyer($fecha)
	{
		
		require 'import.php';
		
		$resultado = "";

		$fechaAyer = explode("-", $fecha);
		if (isset($_SESSION['current_user']))
		{

			try {

				$user = $_SESSION['current_user'];

				$stmt = $dbh->prepare("SELECT * FROM records WHERE user_id = :id AND created BETWEEN :dateTimeOne AND :dateTimeTwo");
				$stmt->bindParam(':id', $user[0]['id']);

				$dateTimeOne = new DateTime();
				$dateTimeTwo = new DateTime();

				$dateTimeOne->setDate( $fechaAyer[0], $fechaAyer[1], $fechaAyer[2] );
				$dateTimeTwo->setDate( $fechaAyer[0], $fechaAyer[1], $fechaAyer[2] );

				$dateTimeOne->setTime(0, 0, 0);
				$dateTimeTwo->setTime(23,59,59);

				$oDateOne = $dateTimeOne->format('Y-m-d H:i:s');
				$oDateTwo = $dateTimeTwo->format('Y-m-d H:i:s');

				$stmt->bindParam(':dateTimeOne', $oDateOne);
				$stmt->bindParam(':dateTimeTwo', $oDateTwo);

				$stmt->execute();

				$data = $stmt->fetchAll();

				$dbh = null;

				header('Content-type: application/json');

				echo json_encode($data);

			} catch (Exception $e) {

				echo json_encode($data);

			}
		}
	}

	function cargarReporteFecha($dia, $mes, $anio)
	{
		
		require 'import.php';
		
		$resultado = "";
		
		if (isset($_SESSION['current_user']))
		{
			
			try 
			{
			
				$user = $_SESSION['current_user'];


				$stmt = $dbh->prepare("SELECT * FROM records WHERE user_id = :id AND created BETWEEN :dateTimeOne AND :dateTimeTwo");
				$stmt->bindParam(':id', $user[0]['id']);

				$dateTimeOne = new DateTime();
				$dateTimeTwo = new DateTime();

				$dateTimeOne->setDate( $anio, $mes, $dia );
				$dateTimeTwo->setDate( $anio, $mes, $dia );

				$dateTimeOne->setTime(0, 0, 0);
				$dateTimeTwo->setTime(23,59,59);

				$oDateOne = $dateTimeOne->format('Y-m-d H:i:s');
				$oDateTwo = $dateTimeTwo->format('Y-m-d H:i:s');

				$stmt->bindParam(':dateTimeOne', $oDateOne);
				$stmt->bindParam(':dateTimeTwo', $oDateTwo);

				$stmt->execute();

				$data = $stmt->fetchAll();

				$dbh = null;

				header('Content-type: application/json');

				echo json_encode($data);
			
			} catch (Exception $e) 
			{

				echo "Ocurrio un error";

			}
		}
		
	}

	function cargarReporteMes($mes, $anio)
	{
		
		require 'import.php';
		
		$resultado = "";
		/* PHP5*/
		/*
		$diasMes = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30 , 31];
		*/
		/* PHP4 */
		$diasMes = array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30 , 31);
		$ultimoDia = 0;

		if (($anio % 4 == 0) && (($anio % 100 != 0) || ($anio % 400 == 0)))
		{
			if ($mes == 2) 
			{
				$ultimoDia = 29;
			}
		}
		else
		{
			$ultimoDia = $diasMes[$mes];
		}

		if (isset($_SESSION['current_user']))
		{
			try 
			{

				$user = $_SESSION['current_user'];

				$stmt = $dbh->prepare("SELECT * FROM records WHERE user_id = :id AND created BETWEEN :dateTimeOne AND :dateTimeTwo");
				$stmt->bindParam(':id', $user[0]['id']);

				$dateTimeOne = new DateTime();
				$dateTimeTwo = new DateTime();

				$dateTimeOne->setDate( $anio, $mes, 1 );
				$dateTimeTwo->setDate($anio, $mes, $ultimoDia );

				$dateTimeOne->setTime(0, 0, 0);
				$dateTimeTwo->setTime(23,59,59);

				$oDateOne = $dateTimeOne->format('Y-m-d H:i:s');
				$oDateTwo = $dateTimeTwo->format('Y-m-d H:i:s');

				$stmt->bindParam(':dateTimeOne', $oDateOne);
				$stmt->bindParam(':dateTimeTwo', $oDateTwo);

				$stmt->execute();

				$data = $stmt->fetchAll();

				$dbh = null;

				header('Content-type: application/json');

				echo json_encode($data);

			} catch (Exception $e) 
			{

				echo json_encode($data);

			}
		}
		
	}

	function cargarReporteAnio($anio)
	{
		
		require 'import.php';
		
		$resultado = "";

		if (isset($_SESSION['current_user']))
		{
			try 
			{

				$user = $_SESSION['current_user'];

				$stmt = $dbh->prepare("SELECT * FROM records WHERE user_id = :id AND created BETWEEN :dateTimeOne AND :dateTimeTwo");
				$stmt->bindParam(':id', $user[0]['id']);

				$dateTimeOne = new DateTime();
				$dateTimeTwo = new DateTime();

				$dateTimeOne->setDate( $anio, 1, 1 );
				$dateTimeTwo->setDate( $anio, 12, 31 );

				$dateTimeOne->setTime(0, 0, 0);
				$dateTimeTwo->setTime(23,59,59);

				$oDateOne = $dateTimeOne->format('Y-m-d H:i:s');
				$oDateTwo = $dateTimeTwo->format('Y-m-d H:i:s');

				$stmt->bindParam(':dateTimeOne', $oDateOne);
				$stmt->bindParam(':dateTimeTwo', $oDateTwo);

				$stmt->execute();

				$data = $stmt->fetchAll();

				$dbh = null;

				header('Content-type: application/json');

				echo json_encode($data);

			} 
			catch (Exception $e) 
			{

				echo json_encode($data);

			}
		}
	}


	function cargarAnios()
	{
		require 'import.php';
		
		$resultado = "";

		if ( isset( $_SESSION[ 'current_user' ] ) )
		{
			try 
			{

				$user = $_SESSION[ 'current_user' ];

				$stmt = $dbh->prepare( "SELECT * FROM records WHERE user_id = :id" );
				$stmt->bindParam( ':id' , $user[ 0 ][ 'id' ] );

				$stmt->execute();

				$data = $stmt->fetchAll();

				$dbh = null;

				header( 'Content-type: application/json' );

				echo json_encode( $data );

			} 
			catch (Exception $e) 
			{

				echo json_encode($data);

			}
		}
	}

	function cors() {

	    // Allow from any origin
	    if (isset($_SERVER['HTTP_ORIGIN'])) {
	        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
	        header('Access-Control-Allow-Credentials: true');
	        header('Access-Control-Max-Age: 86400');    // cache for 1 day
	    }

	    // Access-Control headers are received during OPTIONS requests
	    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

	        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
	            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

	        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
	            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

	        exit(0);
	    }

	    //echo "You have CORS!";
	}