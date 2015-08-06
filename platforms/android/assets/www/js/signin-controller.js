var BookIt = BookIt || {};

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
    this.$chkKeepSignedIn = $("#chk-keep-signed-in", this.$signInPage);
};

BookIt.SignInController.prototype.resetSignInForm = function () {

    var invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);
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
    me.$ctnErr.removeClass().addClass(invisibleStyle);
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
        me.$ctnErr.html("<p>Please enter all the required fields.</p>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        return;
    }

   // if (!me.emailAddressIsValid(emailAddress)) {
   //     me.$ctnErr.html("<p>Please enter a valid email address.</p>");
   //     me.$ctnErr.addClass("bi-ctn-err").slideDown();
   //     me.$txtEmailAddress.addClass(invalidInputStyle);
   //     return;
   // }

	//	var device_info='Device Model: '    + device.model    + '<br />' + 'Device Cordova: '  + device.cordova  + '<br />' + 'Device Platform: ' + device.platform + '<br />' + 'Device UUID: '  + device.uuid + '<br />' +  'Device Version: '  + device.version  + '<br />';

							
	var auth=make_base_auth(emailAddress,password);
    $.mobile.loading("show");
var urlt=BookIt.Settings.signInUrl;
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
                    sessionId: resp.extras.sessionId,
                    expirationDate: expirationDate,
                    keepSignedIn:me.$chkKeepSignedIn.is(":checked")
                });
                // Go to main menu.
				if(resp.error.codigo==0){
				   alert("Bienvenido: "+resp.usauriobean.nombre);// S1000
				   window.localStorage["username"] = username;
					window.localStorage["password"] = password;
					window.location.href = "ingreso.html";
				   }else{
					 alert(resp.error.error);// S1000
					   
				   }
               // $.mobile.navigate(me.mainMenuPageId);
                return;
            } else {
                if (resp.extras.msg) {
                    switch (resp.extras.msg) {
                        case BookIt.ApiMessages.DB_ERROR:
                        // TODO: Use a friendlier error message below.
                            me.$ctnErr.html("<p>Oops! BookIt had a problem and could not log you on.  Please try again in a few minutes.</p>");
                            me.$ctnErr.addClass("bi-ctn-err").slideDown();
                            break;
                        case BookIt.ApiMessages.INVALID_PWD:
                        case BookIt.ApiMessages.EMAIL_NOT_FOUND:
                            me.$ctnErr.html("<p>You entered a wrong username or password.  Please try again.</p>");
                            me.$ctnErr.addClass("bi-ctn-err").slideDown();
                            me.$txtEmailAddress
						.addClass(invalidInputStyle);
                            break;
                    }
                }
            }
        },
        error: function (e) {
            $.mobile.loading("hide");
            console.log(e.message);
			alert("error: "+e.message);
            // TODO: Use a friendlier error message below.
            me.$ctnErr.html("<p>Oops! BookIt had a problem and could not log you on.  Please try again in a few minutes.</p>");
            me.$ctnErr.addClass("bi-ctn-err").slideDown();
        }
    });
};
