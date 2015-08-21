
$(document).ready(function() {

var result = JSON.parse(window.localStorage.getItem("bookit-session"));
//var session = result.Session.getInstance().get();
var aplicaciones=result.aplicaciones;
var object=aplicaciones;
$.each(aplicaciones, function() {
    var list = $('#listadoaplicaciones'),
        listItem = $('<li/>'),
        html = listItem.append($('<a  target="_blank"/>').attr('href',this.aplicacion.linkpublico+"/page/inicio?action=ingresar&ahui="+result.sessionId).text(this.aplicacion.nombre));
  

    list.append(html)

});

});