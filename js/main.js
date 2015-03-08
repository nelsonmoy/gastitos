// Jquery cuando esta listo el document cargar los listener
$(document).on('ready', init);
/*
$(window).on('hashchange', function() {
	console.log('Funcion que verifica si esta logeado alguien');
   	if (!isUserLogin()) 
   	{
   		$.mobile.navigate('#login');
   	}
});
*/

// Variable que almacena la suma de los gastos
var totalGastos = 0;

// funcion que agregar los listener
function init() {
	
  // funcion que vacia la lista ul que contiene los gastos
	vaciarListaGastos();
	
  // Asigno el boton agregar gasto la funcion agregarGasto()
	$('#btn-agregar-gasto').on('click', agregarGasto);
	
  // Asigno al boton registrar la funcion registrarUsuario()
	$('#btn-registrar').on('click', registrarUsuario);
	
  // Asigno al boton entrar la funcion loginUsuario para loguearse en la aplicacion
	$('#btn-entrar').on('click', loginUsuario);
	
  // Asingo al boton salir la funcion logoutUsuario para salir de la aplicacion
	$('#btn-salir').on('click',logoutUsuario);

  // Asigno al boton de cambiar contraseña la funcion cambiarContrasena para cambiar la contraseña del usuario que inicio sesion
  $('#btn-cambiar-contrasena').on('click', cambiarContrasena);

  // Asigno al enlace de la lista de reportes de Ayer para cargar los gatos de una dia anterior a la actual
  $('#btn-menu-report-ayer').on('click', cargarReporteAyer);

  // Asigno a la lista de meses la funcion de reporte por mes cada vez que cambie de mes
  $('#meses').on('change', cargarReporteMes);

  // Asigno al boton de reporte año la funcion cargar Reporte anio para ver todos los gatos en un año determinado
  $('#btn-ver-report-anio').on('click', cargarReporteAnio);

  // Asigno al enlace de la lista de reporte la funcion cargarAnios en el campo de seleccion
  $('#btn-menu-report-anio').on('click', cargarAnios);

  // Asigno al boton de ver de fecha la funcion que carga los gastos de una fecha seleccionada 
  $('#btn-ver-fecha-reporte').on('click', cargarReporteFecha);

}


// funcion que agregar los datos de concepto y costo a la lista y a la base de datos
function agregarGasto () {
	// almaceno el item div donde esta el total de gastos
	var indicadorTotal = $('#total-gastos-hoy');
	// Obtengo el valor que tiene el div de total de gastos
	totalGastos = indicadorTotal.html();
	// almaceno el input text de concepto
	var inputConcepto = $('#concept');
	// almaceno el input text de costo
	var inputCosto = $('#cost');
	// almaceno el texto del input de concepto
	var concepto = inputConcepto.val();
	// almaceno el valor del input de costo
	var costo = inputCosto.val();

	// Valido si el concepto no es un numero y que este no este vacio
	if (!isNaN(concepto) && concepto != "") {
		// si es un numero o esta vacio, llama a la funcion mostrarMensaje
		mostrarMensaje("¿Compraste números?");
		// limpio el input de concepto
		inputConcepto.val('');
		// limpio el input de costo
		inputCosto.val('');
		// pongo el foco en el input concepto
		inputConcepto.focus();
		// retorno falso para detener la ejecucion
		return false;
	}

	// Si concepto o cosot no tiene nada retorno false
	if(concepto.length == 0 || costo.length == 0)
	{
		return false;
	}

	// Valida si el costo contiene letras
	if (isNaN(costo)) {
		// Si contiene letras muestro un mensaje
		mostrarMensaje("Que bueno que te costo unas letras ;)");
		// limpia el input costo
		inputCosto.val('');
		// pone el foco en input costo
		inputCosto.focus();
		// retorno falso para detener la ejecucion
		return false;
	}

	// funcion jquery ajax para mandar los datos a la base de datos al archivo backend.php
	$.ajax({
		url: 'back/backend.php',
		data: {action: 'add', concepto: concepto, costo: costo}
	}).done(
		function( data ) 
		{
			// si el valor de data es diferente de cero, si se insertaron los datos
			if (data !== "0" ) 
			{
				// selecciono el ul de gastos y agrego el li con los datos de id del registro, el concepto y costo, ademas de una funcion para remover el gasto hecho
				$('#list-gastos').append( '<li data-icon="delete"><a href="#" data-item="' + data + '" onclick="removeGasto(this)"><span class="concepto">' +	concepto + '</span> <span class="costo ui-li-aside">$' + costo + '</span></a></li>');
				// refresco el ul de gastos
				$('#list-gastos').listview( "refresh" );
				// sumo el costo del gasto al totalGastos, los valores los paso a Float
				totalGastos = parseFloat(totalGastos) + parseFloat(costo);
				// limpia el input concepto
				inputConcepto.val('');
				// limpia el input costo
				inputCosto.val('');
				// actualizo el total de gastos
				indicadorTotal.html(totalGastos);
			}
		}
	);
	
}

// funcion que elimina los li de la lista gastos
function vaciarListaGastos () {
	$('#list-gastos').empty();
}

// funcion que manda a llamar un div que tiene el rol de mensaje y lo muestra
function mostrarMensaje(mensaje){
	$('#messageContent').html('<div role="main" class="ui-content"><p>' + mensaje + '</p></div>');
	$.mobile.navigate('#message');
}

/* --- DB --- */


// funcion que registra a los datos enviados por el formulario de registro
function registrarUsuario()
{
	// obtengo el input de email
	var inputEmail = $('#remail');
	// obtengo el input de password
	var inputPassword = $('#rpassword');
	// almaceno el valor del input email
	var email    = $('#remail').val();
	// almaceno el valor de md5 del input password
	var password = md5($('#rpassword').val());

	// si email y password no son nulos entra 
	if (email != null && password != null) 
	{
		// Jquery ajax para mandar los datos y registrarlos a la base de datos
		$.ajax({
			url: 'back/backend.php',
			data: {action: 'signup', email: email, password: password}
		}).done(
			function( data ) 
			{
				// si data es igual a 1
				if (data === "1" ) 
				{
					// Manda a llamar a la ventana registerMessage
					// que muestra un mensaje de registro de su cuenta
				    $.mobile.navigate('#registerMessage');
				}
				// si data es igual a 2
				else if (data === "2")
				{	
					// Manda a llamar a la venta donde indica que el correo ya esta siendo utilizado
					$.mobile.navigate('#correoUtilizadoMessage');
					// limpia el input email
					inputEmail.val('');
					// limpia el input password
					inputPassword.val('');
					inputEmail.focus();
				}
			}
		);
	}
}


// Funcion para iniciar la sesion del usuario
function loginUsuario () 
{
	var inputEmail = $('#email');
	var inputPassword = $('#password');
	var email = inputEmail.val();
	var password = md5(inputPassword.val());
  var indicadorTotal = $('#total-gastos-hoy');
  var usernameInfoSpan = $('#username-myinfo');

	vaciarListaGastos();
  totalGastos = 0;
  indicadorTotal.html(totalGastos);
	if (email != null && password != null) 
	{
		$.ajax({
			url: 'back/backend.php',
			data: {action: 'login', email: email, password: password}
		}).done(
			function( data ) 
			{
				if (data === "1" ) 
				{
				    $.mobile.navigate('#main');
            usernameInfoSpan.text(email);
				    inputEmail.val('');
				    inputPassword.val('');
				}
				else
				{
					
	 				$.mobile.navigate('#login');
          if (email == "") 
          {
            mostrarMensaje('Desbes de escribir tu correo para entrar :)');
          }
          else if (inputPassword.val() == "") 
          {
            mostrarMensaje('Debes de escribir tu contraseña para entrar :)');
          }
          else
          {
            mostrarMensaje('El usuario o contraseña están mal :('); 
          }

          inputEmail.val('');
          inputPassword.val(''); 
          
				}
			}
		);
    cargarGastos();
	}
}


// funcion que cierra la sesión
function logoutUsuario () 
{
	$.ajax({
		url: 'back/backend.php',
		data: {action: 'logout'}
	}).done(
		function( data ) 
		{
			$.mobile.navigate('#login');
		}
	);
}

// Funcion que verifica si un usuario inicio sesion
// Retorna verdadero si lo esta, y falso, si no.
function isUserLogin () 
{
	var retorno = false;
	$.ajax({
		url: 'back/backend.php',
		data: {action: 'isloginuser'}
	}).done(
		function( data ) 
		{
			if (data === "0") 
			{
				retorno =  false;
			}
			else
			{
				retorno = true;
			}
		}
	);
	return retorno;
}

// Funcion que quitar el gasto realizado actualiza el gasto total y borra el registro en la base de datos
function removeGasto(e)
{

  // Obtiene el indicar de total de gastos
	var indicadorTotal = $('#total-gastos-hoy');
  // Obtenemos el elemento a seleccionado
	var itemA= $(e);
  // Obtenemos el identificador que esta en data de la a seleccionado
	var idItemA = itemA.context.dataset.item;
  // Obtenemos el li del a seleccionado
	var itemList = $(itemA.context.parentNode);
  // almacenamos el texto del costo del a seleccionado
	var costo = itemA.context.lastChild.innerText;
  // Se elimina el simbolo de $
  costo = costo.replace('$', '');
  // El texto se convierte a float
  costo = parseFloat(costo);
  // Por medio de ajax se manda el id del a seleccionado para eliminar el registro de la base de datos
	$.ajax({
		url: 'back/backend.php',
		data: {action: 'remove', id: idItemA}
	}).done(
		function( data ) 
		{
      // Se remueve el li de la lista
			itemList.remove();
      // Se actualiza la lista
			$('#list-gastos').listview( "refresh" );
      // al costo total se le resta el costo del gasto eliminado
			totalGastos -= costo;
      // Se actualiza el valor del indicador de gastos total
			indicadorTotal.html(totalGastos);
		}
	);
}

// Funcion que carga los gastos al momento de iniciar sesión en la aplicación
function cargarGastos () 
{

	var indicadorTotal = $('#total-gastos-hoy');
  totalGastos = 0;
  vaciarListaGastos();

	$.getJSON( "back/backend.php?action=load", function( data ) {
		var items = [];
		$.each( data, function( key, val ) {
		  	items.push( '<li data-icon="delete"><a href="#" data-item="' + val.id + '" onclick="removeGasto(this)"><span class="concepto">' +	val.concept + '</span> <span class="costo ui-li-aside">$' + val.cost + '</span></a></li>');
		  	totalGastos = parseFloat(totalGastos) + parseFloat(val.cost);

		});
		 
		$('#list-gastos').append(items.join( "" ));
		indicadorTotal.html(totalGastos);
		$('#list-gastos').listview( "refresh" );
	});
}


// Funcion que cambia la contraseña del usuario actual
function cambiarContrasena()
{

  var nuevaContrasenaUno = $('#newPasswordUno');
  var nuevaContrasenaDos =  $('#newPasswordDos');
  var txtNuevaContrasenaUno = nuevaContrasenaUno.val();
  var txtNuevaContrasenaDos = nuevaContrasenaDos.val();

  if( txtNuevaContrasenaUno === '' || txtNuevaContrasenaDos === '' )
  {
    mostrarMensaje('Para que puedas cambiar tu contraseña debes escribirlos en las dos recuadros :)');
    return false;
  }
  
  if (txtNuevaContrasenaUno !== txtNuevaContrasenaDos) 
  {
    mostrarMensaje('No coinciden las contraseñas :(');
    nuevaContrasenaUno.val('');
    nuevaContrasenaDos.val('');
    return false;
  }
  else
  {
    $.ajax({
      url: 'back/backend.php',
      data: {action: 'updatepassword', password: md5(txtNuevaContrasenaDos)}
    }).done(
      function( data ) 
      {
        if (data === "1") 
        {
          mostrarMensaje('Tu contraseña se ha cambiado con exito :) !');
          nuevaContrasenaUno.val('');
          nuevaContrasenaDos.val('');
        }
        else
        {
          mostrarMensaje('No se puedo cambiar tu contraseña :(');
        }
      }
    );
  }
}

// Funcion que carga los gastos de un dia anterior
function cargarReporteAyer()
{
  var tituloReporte = $('#ayer-reporte-total');
  var listaDeDatos = $('#list-gastos-ayer');
  var sumaTotal = 0;
  var miFecha = new Date();
  var diaDeMes = miFecha.getDate();
  var txtFecha = '';

  miFecha.setDate( diaDeMes - 1);
  txtFecha = miFecha.getFullYear() + '-' + (miFecha.getMonth() + 1 ) + '-' + miFecha.getDate();

  $.getJSON( "back/backend.php?action=reporteayer&fecha=" + txtFecha, function( data ) {
    sumaTotal = cargarLista(data, listaDeDatos);
    tituloReporte.text('Ayer gastaste $'+ sumaTotal + ' pesos');
  });
}


// Funcion que carga los gastos hechos en una fecha en especifico
function cargarReporteFecha() 
{
  var tituloReporte = $('#fecha-reporte-total');
  var listaDeDatos = $('#list-gastos-fecha');
  var fecha = $('#fecha-seleccionada').datebox('getTheDate');
  var sumaTotal = 0;
  
  dia = fecha.getDate();
  mes = fecha.getMonth() + 1;
  anio = fecha.getFullYear();
  
  if ( fecha )
  {

    $.getJSON( "back/backend.php?action=reportefecha&dia=" + dia + "&mes=" + mes + '&anio=' + anio, function( data ) {
      console.log(data);

      sumaTotal = cargarLista(data, listaDeDatos);

      tituloReporte.text('En la fecha de '+ dia + '/' + mes + '/' + anio +' gastaste: $'+ sumaTotal + ' pesos');

    });

  }
  else
  {
    mostrarMensaje('Selecciona una fecha del calendario por favor');
  }
}

// Funcion que carga los gastos de un mes seleccionado del presente año
function cargarReporteMes() 
{

  var tituloReporte = $('#mes-reporte-total');
  var listaDeDatos = $('#list-gastos-mes');

  var mes = $('#meses').val();

  var sumaTotal = 0;

  var fecha = new Date();
  var anio = fecha.getFullYear(); 

  if ( mes !== "0" )
  {

    $.getJSON( "back/backend.php?action=reportemes&mes=" + mes + '&anio=' + anio, function( data ) {

      sumaTotal = cargarLista(data, listaDeDatos);

      tituloReporte.text('En el mes de '+ stringMes(mes) + ' gastaste: $'+ sumaTotal + ' pesos');

    });

  }

}

//Funcion que carga los años registrados del usuario actual
function cargarAnios () 
{
  var campoAnio = $('#select-anio');
  var theFecha;
  var theAnio;
  var auxAnio = 0;
  var items = [];

  campoAnio.empty();

  $.getJSON( "back/backend.php?action=cargaranios", function( data ) {

    campoAnio.append( '<option value="0">Selecciona un año</option>');

    $.each( data, function( key, val ) {

        theFecha = new Date(val.created);
        theAnio = theFecha.getFullYear();
        if (auxAnio !== theAnio) 
        {
          auxAnio = theAnio;
          campoAnio.append( '<option value="' + theAnio + '">' + theAnio + '</option>');
          campoAnio.selectmenu('refresh');
        }

    });

  });
}

// Funcion que cargar los gastos de un año seleccionado en el campo de seleccion de años
function cargarReporteAnio() 
{

  var tituloReporte = $('#anio-reporte-total');
  var listaDeDatos = $('#list-gastos-anio');
  var anio = $('#select-anio').val();
  
  var sumaTotal = 0;

  if (anio == '0' || anio == '' || anio.length == 0)
  {
    mostrarMensaje('Ese es un año?');
    return false;
  }

  $.getJSON( "back/backend.php?action=reporteanio&anio=" + anio, function( data ) {
    sumaTotal = cargarLista(data, listaDeDatos);
    tituloReporte.text('En el año '+ anio + ' gastaste: $'+ sumaTotal + ' pesos');
  });
}

// Funcion que carga los datos que se le envian a una lista que es el elemento y retorna la suma de los gastos
function cargarLista( data , elemento )
{
  var items = [];
  var suma = 0;

  elemento.empty();
 
  $.each( data, function( key, val ) {
      items.push( '<li><span class="concepto">' + val.concept + '</span> <span class="costo ui-li-aside">$' + val.cost + '</span></li>');
      suma += parseFloat(val.cost);
  });
     
  elemento.append(items.join( "" ));
  elemento.listview( "refresh" );

  return suma;
}

// Funcion que retorna el nombre del mes dependiendo del numero de este
function stringMes(mes)
{
  var meses = [ '', 'Enero','Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return meses[mes];
}

/* --- DB --- */



/* --- vendor --- */

function md5(str) {
  //  discuss at: http://phpjs.org/functions/md5/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  // improved by: Michael White (http://getsprink.com)
  // improved by: Jack
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //  depends on: utf8_encode
  //   example 1: md5('Kevin van Zonneveld');
  //   returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

  var xl;

  var rotateLeft = function (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  };

  var addUnsigned = function (lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  };

  var _F = function (x, y, z) {
    return (x & y) | ((~x) & z);
  };
  var _G = function (x, y, z) {
    return (x & z) | (y & (~z));
  };
  var _H = function (x, y, z) {
    return (x ^ y ^ z);
  };
  var _I = function (x, y, z) {
    return (y ^ (x | (~z)));
  };

  var _FF = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _GG = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _HH = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _II = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var convertToWordArray = function (str) {
    var lWordCount;
    var lMessageLength = str.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = new Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  };

  var wordToHex = function (lValue) {
    var wordToHexValue = '',
      wordToHexValue_temp = '',
      lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = '0' + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  };

  var x = [],
    k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22,
    S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20,
    S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23,
    S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  str = this.utf8_encode(str);
  x = convertToWordArray(str);
  a = 0x67452301;
  b = 0xEFCDAB89;
  c = 0x98BADCFE;
  d = 0x10325476;

  xl = x.length;
  for (k = 0; k < xl; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

  return temp.toLowerCase();
}

function utf8_encode(argString) {
  //  discuss at: http://phpjs.org/functions/utf8_encode/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: sowberry
  // improved by: Jack
  // improved by: Yves Sucaet
  // improved by: kirilloid
  // bugfixed by: Onno Marsman
  // bugfixed by: Onno Marsman
  // bugfixed by: Ulrich
  // bugfixed by: Rafal Kukawski
  // bugfixed by: kirilloid
  //   example 1: utf8_encode('Kevin van Zonneveld');
  //   returns 1: 'Kevin van Zonneveld'

  if (argString === null || typeof argString === 'undefined') {
    return '';
  }

  // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  var string = (argString + '');
  var utftext = '',
    start, end, stringl = 0;

  start = end = 0;
  stringl = string.length;
  for (var n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n);
    var enc = null;

    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(
        (c1 >> 6) | 192, (c1 & 63) | 128
      );
    } else if ((c1 & 0xF800) != 0xD800) {
      enc = String.fromCharCode(
        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      );
    } else {
      // surrogate pairs
      if ((c1 & 0xFC00) != 0xD800) {
        throw new RangeError('Unmatched trail surrogate at ' + n);
      }
      var c2 = string.charCodeAt(++n);
      if ((c2 & 0xFC00) != 0xDC00) {
        throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
      }
      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
      enc = String.fromCharCode(
        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      );
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.slice(start, stringl);
  }

  return utftext;
}


/* --- vendor --- */
