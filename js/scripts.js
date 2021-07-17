window.addEventListener("load", iniciarApp);


let Moduls = [];
function iniciarApp() {
    console.log('scripts.js -> iniciarApp()');
    Template = document.getElementsByTagName('template');
    if ( Template){
        for (let i = 0; i < Template.length; i++) {
            Moduls[Template[i].id] = new ModulController(Template[i], null);
            Moduls['get'+Template[i].id.substr(0,1).toUpperCase()+Template[i].id.substr(1).toLowerCase()] = function () { return Moduls[Template[i].id]; };
        }
    }
    //Template = undefined;
    //Moduls.Forms = [];
    //for (let i = 0; i < document.forms.length; i++) Moduls.Forms[document.forms[i].name] = new FormController(document.forms[i], null);
    Moduls.constants = {};
    Moduls.constants.initDate = new Date;
    Moduls.getFooter().load  ({ url: 'content/footer.html', script: false});
    Moduls.getHeader().load  ({ url: 'content/header.html', script: false});
    Moduls.getBody().load    ({ url: 'content/blanco.html', script: false});
    Moduls.getAlertbox().load({ url: 'content/alerta.html', script: false});
}

function validaErroresCBK (suc, obj) {
    let ok = "<div class='alert alert-success'><button type='button' class='close' data-dismiss='alert'>&times;</button><strong>¡Ok!</strong> {{mensage}}.</div>";
    let ko = "<div class='alert alert-danger'><button type='button' class='close' data-dismiss='alert'>&times;</button><strong>¡Error!</strong> {{mensage}}.</div>"
    for (let i=0; i<obj.length; i++) {
        if (suc) {
            $(".alertBoxMessage").append(ok.reemplazaMostachos(obj[i].mensage));
        } else {
            $(".alertBoxMessage").append(ko.reemplazaMostachos(obj[i].mensage));
        }
    }
}


