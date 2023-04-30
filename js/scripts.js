window.addEventListener("load", iniciarApp);


let Moduls = [];
function iniciarApp() {
    console.log('scripts.js -> iniciarApp()');
    Template = document.getElementsByTagName('template');
    if (Template) {
        for (let i = 0; i < Template.length; i++) {
            Moduls[Template[i].id] = new ModulController(Template[i], null);
            Moduls['get' + Template[i].id.substr(0, 1).toUpperCase() + Template[i].id.substr(1).toLowerCase()] = function () { return Moduls[Template[i].id]; };
        }
    }
    //Template = undefined;
    //Moduls.Forms = [];
    //for (let i = 0; i < document.forms.length; i++) Moduls.Forms[document.forms[i].name] = new FormController(document.forms[i], null);
    Moduls.constants = {};
    Moduls.constants.initDate = new Date;
    Moduls.getFooter().load({ url: 'content/footer.html', script: false });
    Moduls.getHeader().load({ url: 'content/header.html', script: false });
    Moduls.getBody().load({ url: 'content/blanco.html', script: false });
    Moduls.getAlertbox().load({ url: 'content/alerta.html', script: false });
    Moduls.getModal().load({ url: 'content/modal.html', script: false });
}

function validaErroresCBK(obj, time=4000) {
    let msg = "<div class='alert alert-{{tipo}} alert-dismissible fade show' role='alert'><strong>{{Campo}}</strong> {{Detalle}}.<button type='button' class='btn-close' data-bs-dismiss='alert'></button></div>";
    if (typeof obj === "object" && typeof obj.length === "undefined") obj = [obj];
    for (let i = 0; i < obj.length; i++) {
        if (obj[i].type) {
            obj[i].Detalle = (obj[i].type == 'required' ? 'No puede estar vacío' : (obj[i].type == 'NaN' ? 'No es un número válido' : (obj[i].type == 'NaD' ? 'No es una fecha válida' : 'Error desconocido')));
            obj[i].Campo = obj[i].label || obj[i].name;
            obj[i].tipo = (obj[i].type == 'required' ? 'Validacion' : 'Error');
        }
        obj[i].tipo = (obj[i].tipo == 'Confirmacion' || obj[i].tipo == 'Respuesta' ? 'success' : (obj[i].tipo == 'Validacion' ? 'warning' : 'danger'));
        if (!obj[i].Detalle) obj[i].Detalle = JSON.stringify(obj[i]);
        if (!obj[i].Campo) obj[i].Campo = "";
        $(".alertBoxMessage").append(msg.reemplazaMostachos(obj[i]));
    }
    $(".alert").delay(time).slideUp(200, function() {
        $(this).alert('close');
    });
}

// Funcion para construir la modal, recibe un objeto modal con parametros
function construirModal(modal) {
    let param = JSON.parse(JSON.stringify(modal));

    let $myModal = $('#myModal');

    $myModal.on('hidden.bs.modal', function () {
        if (Moduls.getModalbody) Moduls.getModalbody().load({ url: '/portalapp/res/blanco.html', script: false });
    });

    if (modal.ocultarXCerrar) {
        $('button.btn-close', $myModal).hide();
    } else {
        $('button.btn-close', $myModal).show();
        if (typeof (modal.xfunction) === 'function') {
            $('button.btn-close', $myModal).click(function () {
                modal.xfunction();
            });
        } else {
            $('button.btn-close', $myModal).click(function () {
                $myModal.hide();
            });
        }
    }
    $('.modal-content', $myModal).css({ "width": 'auto', 'height': 'auto', 'margin': '0 auto' });
    if (modal.w && modal.w != 0)
        $('.modal-content', $myModal).css("max-width", modal.w);
    else
        $('.modal-content', $myModal).css("max-width", 'unset');
    if (modal.h && modal.h != 0)
        $('.modal-content', $myModal).css("max-height", modal.h);
    else
        $('.modal-content', $myModal).css("max-height", 'unset');

    $('.modal-title', $myModal).html(!modal.title ? "<br />" : modal.title);
    let $myModalFooter = $('.modal-footer', $myModal).empty();
    if (modal.oktext) {
        if (!(typeof (modal.okfunction) === 'function')) {
            modal.okfunction = function () { $myModal.hide() };
        }
        $myModalFooter.append('<button id="okfunction" type="button" class="btn btn-primary">' + modal.oktext + '</button>');
        $("#okfunction").on("click", function () { modal.okfunction(); return false; });
    }
    if (modal.canceltext) {
        if (!(typeof (modal.cancelfunction) === 'function')) {
            modal.cancelfunction = function () { $myModal.hide() };
        }
        $myModalFooter.append('<button id="cancelfunction" type="button" class="btn btn-default">' + modal.canceltext + '</button>');
        $("#cancelfunction").on("click", function () { modal.cancelfunction(); return false; });
    }
    $myModal.removeClass('fade');
    $myModal.show();

    //click a la "x" de cerrar modal
    $('.close', $myModal).click(function () {
        $myModal.hide();
    });
}

function cerrarModal() {
    $('#myModal').hide();    
}
