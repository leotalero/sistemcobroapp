var BookIt = BookIt || {};


$(document).delegate("#home", "pagebeforecreate", function () {        

    var $signUpPage = $("#home"),
        $btnSubmit = $("#btn-submit", $signUpPage);

    $btnSubmit.off("tap").on("tap", function () {
            
           app.signInController.onSignInCommand();
		   return false;
    });
});


BookIt.SignInController = function () {

    this.$signInPage = null;
    this.$btnSubmit = null;
    this.$txtEmailAddress = null;
    this.$txtPassword = null;
    this.$chkKeepSignedIn = null;
    this.$ctnErr = null;
    this.mainMenuPageId = null;
};

BookIt.SignInController.prototype.init = function () {
    this.$signInPage = $("#home");
    this.mainMenuPageId = "#page-main-menu";
    this.$btnSubmit = $("#btn-submit", this.$signInPage);
    this.$ctnErr = $("#ctn-err", this.$signInPage);
    this.$txtEmailAddress = $("#nombredeusuario", this.$signInPage);
    this.$txtPassword = $("#clave", this.$signInPage);
    this.$chkKeepSignedIn = $("#chck-rememberme", this.$signInPage);
};

BookIt.SignInController.prototype.resetSignInForm = function () {

    var invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    //this.$ctnErr.html("");
   // this.$ctnErr.removeClass().addClass(invisibleStyle);
    this.$txtEmailAddress.removeClass(invalidInputStyle);
    this.$txtPassword.removeClass(invalidInputStyle);
    this.$txtEmailAddress.val("");
    this.$txtPassword.val("");
    this.$chkKeepSignedIn.prop("checked", false);
};


function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = btoa(tok);
  return "Basic " + hash;
};


BookIt.SignInController.prototype.onSignInCommand = function () {



    var me = this,
        emailAddress = me.$txtEmailAddress.val().trim(),
        password = me.$txtPassword.val().trim(),
        invalidInput = false,
        invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    // Reset styles.
    //me.$ctnErr.removeClass().addClass(invisibleStyle);
    me.$txtEmailAddress.removeClass(invalidInputStyle);
    me.$txtPassword.removeClass(invalidInputStyle);

    // Flag each invalid field.
    if (emailAddress.length === 0) {
        me.$txtEmailAddress.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (password.length === 0) {
        me.$txtPassword.addClass(invalidInputStyle);
        invalidInput = true;
    }

    // Make sure that all the required fields have values.
    if (invalidInput) {
        me.$ctnErr.html("<div data-role='header'><h1>ERROR</h1></div> <div data-role='main' class='ui-content'><p>Por favor ingrese toda la información.</p> <a href='#' class='ui-btn ui-corner-all   ui-btn-b ui-icon-back ui-btn-icon-left' data-rel='back'>OK</a></div> </div>");
       // me.$ctnErr.addClass("bi-ctn-err").slideDown();
		me.$ctnErr.popup( "open" ).slideDown();
    }

   // if (!me.emailAddressIsValid(emailAddress)) {
   //     me.$ctnErr.html("<p>Please enter a valid email address.</p>");
   //     me.$ctnErr.addClass("bi-ctn-err").slideDown();
   //     me.$txtEmailAddress.addClass(invalidInputStyle);
   //     return;
   // }

	//	var device_info='Device Model: '    + device.model    + '<br />' + 'Device Cordova: '  + device.cordova  + '<br />' + 'Device Platform: ' + device.platform + '<br />' + 'Device UUID: '  + device.uuid + '<br />' +  'Device Version: '  + device.version  + '<br />';

	 if (invalidInput==false) {						
	var auth=make_base_auth(emailAddress,password);
    $.mobile.loading("show");
var urlt=BookIt.Settings.signInUrl;
var finalData = "";
    $.ajax({
         type: 'POST',
		url: urlt,
		async: false,
         //data: "email=" + emailAddress + "&password=" + password,
		 contentType: "application/x-www-form-urlencoded",
			dataType: 'json',
			data: {
			"nombredeusuario":emailAddress,
			"password":password
			//"deviceinfo":device_info
			},
			 headers: {
			authorization: auth
		  },
        success: function (resp) {
			 
            $.mobile.loading("hide");

            if (resp.error.codigo==0) {
                // Create session. 
                var today = new Date();
                var expirationDate = new Date();
                expirationDate.setTime(today.getTime() + BookIt.Settings.sessionTimeoutInMSec);

                BookIt.Session.getInstance().set({
                    userProfileModel: resp.usauriobean,
                    sessionId: resp.sessioninfo,
                    expirationDate: expirationDate,
                    keepSignedIn:me.$chkKeepSignedIn.is(":checked"),
					aplicaciones:resp.aplicaciones
                });
                // Go to main menu.
				if(resp.error.codigo==0){
				   alert("Bienvenido: "+resp.usauriobean.nombre);// S1000
				//  me.$ctnErr.html("<div data-role='header'><h1>Bienvenido</h1></div> <div data-role='main' class='ui-content'><p>"+ resp.usauriobean.nombre + ".</p> <a  href='#'  onclick='window.location.href = "+'ingreso.html'+";return false;' class='ui-btn ui-corner-all   ui-btn-b ui-icon-check ui-btn-icon-left' data-rel='back'>OK</a></div> </div>");
				//	me.$ctnErr.popup( "open" ).slideDown();
				  // window.localStorage["username"] = emailAddress;
					window.localStorage["bookit"] = BookIt;
					var session = BookIt.Session.getInstance().get();
					var aplicacio=session.aplicaciones;
					
				   
					//if(("#confirmacion").click()){
					window.location.href = "ingreso.html";
					
					//}
					
				   }else{
					 alert(resp.error.error);// S1000
					   
				   }
               // $.mobile.navigate(me.mainMenuPageId);
                return ;
            } else {
                if (resp.error.error) {
                    switch (resp.error.codigo) {
                        case BookIt.ApiMessages.ERROR_USUARIO_OR_PASS:
                      
                           // me.$ctnErr.html("<p>Oops! Error en usuario o contraseña .</p>");
                            //me.$ctnErr.addClass("bi-ctn-err").slideDown();
							 me.$ctnErr.html("<div data-role='header'><h1>ERROR</h1></div> <div data-role='main' class='ui-content'><p>Oops! Error en usuario o contraseña.</p> <a href='#' class='ui-btn ui-corner-all   ui-btn-b ui-icon-back ui-btn-icon-left' data-rel='back'>OK</a></div> </div>");
							
							me.$ctnErr.popup( "open" ).slideDown();
                            break;
                        case BookIt.ApiMessages.ERROR_USUARIO_NO_ENCONTRADO:
							
							 me.$ctnErr.html("<div data-role='header'><h1>ERROR</h1></div> <div data-role='main' class='ui-content'><p>Oops! Error usuario no encontrado.</p> <a href='#' class='ui-btn ui-corner-all   ui-btn-b ui-icon-back ui-btn-icon-left' data-rel='back'>OK</a></div> </div>");
							
							me.$ctnErr.popup( "open" ).slideDown();
                            break;
                        case BookIt.ApiMessages.ERROR_VALIDANDO_USUARIO:
                           
						 me.$ctnErr.html("<div data-role='header'><h1>ERROR</h1></div> <div data-role='main' class='ui-content'><p>Oops! Error validando usuario.</p> <a href='#' class='ui-btn ui-corner-all   ui-btn-b ui-icon-back ui-btn-icon-left' data-rel='back'>OK</a></div> </div>");
							
							me.$ctnErr.popup( "open" ).slideDown();
						
                            break;
						}
					}
				}
			},
			error: function (e) {
            $.mobile.loading("hide");
            console.log(e.message);
			//alert("error: "+e.message);
            // TODO: Use a friendlier error message below.
           // me.$ctnErr.html("<p>Oops! BookIt had a problem and could not log you on.  Please try again in a few minutes.</p>");
           // me.$ctnErr.addClass("bi-ctn-err").slideDown();
			 me.$ctnErr.html("<div data-role='header'><h1>ERROR</h1></div> <div data-role='main' data-content-theme='a' class='ui-content'><p>Oops! Error conectando con el servidor intente mas tarde.</p> <a href='#' class='ui-btn ui-corner-all   ui-btn-b ui-icon-back ui-btn-icon-left' data-rel='back'>OK</a></div> </div>");
							
			me.$ctnErr.popup( "open" ).slideDown();
				}
		});
		
	}
};
