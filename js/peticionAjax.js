function peticionAjax() {
    var browser = getBrowser();
    var dato = {
        metodo: 'POST',
        direccion: '',
        caracteres: 'utf-8',
        parametros: {},
        retorno: function () { alert('no se ha especificado retorno'); },
        extra: {},
        asincrono: true,
        contentType: 'application/x-www-form-urlencoded'
    };
    this.respuesta = function () {
        var http = (dato.asincrono) ? this : this.xmlhttp;
        if (http.readyState == 4) {
            dato.extra.xxhttpresponsecodexx = http.status;
            var resultado = '';
            if (http.responseType != "arraybuffer") {
                if (http.responseText == "" || http.responseText == null) {
                    try { dato.retorno(false, 'La llamada no ha devuelto datos'); } catch (e) { }
                    return; //Ha llegado una cadena vac�a del servidor, abortamos el resto de comprobaciones y devolvemos la situaci�n
                }
            }
            resultado = (typeof JSON != 'undefined') ? JSON.parse(http.responseText) : eval("(function(){return " + http.responseText + ";})()");
            if (typeof dato.retorno == 'function') dato.retorno((http.status == 200 && (typeof resultado.success == 'undefined' || resultado.success)) ? true : false, resultado, dato.extra);
        }
    }
    this.pide = function (obj) {
        var chd, cad = '';
        dato.metodo = ((typeof obj.metodo == 'undefined') ? dato.metodo : obj.metodo).toUpperCase();
        dato.direccion = (typeof obj.direccion == 'undefined') ? dato.direccion : obj.direccion;
        dato.parametros = (typeof obj.parametros == 'undefined') ? dato.parametros : obj.parametros;
        dato.retorno = (typeof obj.retorno == 'undefined') ? dato.retorno : obj.retorno;
        dato.extra = (typeof obj.extra == 'undefined') ? dato.extra : obj.extra;
        dato.asincrono = (typeof obj.asincrono == 'undefined') ? dato.asincrono : obj.asincrono;
        dato.autoXSID = (typeof obj.autoXSID == 'undefined') ? dato.autoXSID : obj.autoXSID;
        dato.contentType = (typeof obj.contentType == 'undefined') ? dato.contentType : obj.contentType;
        dato.contentType = (typeof obj.parametros == 'undefined') ? dato.contentType : (typeof obj.parametros.contentType == 'undefined') ? dato.contentType : obj.parametros.contentType;
        dato.caracteres = (typeof obj.caracteres == 'undefined') ? dato.caracteres : obj.caracteres;
        dato.caracteres = ((dato.caracteres != '' && dato.caracteres != null) ? 'charset=' + dato.caracteres : '');
        //dato.canal = dato.canal || obj.canal || (obj.parametros && obj.parametros.xchn) || (dato.direccion.split('.'))[(dato.direccion.split('.')).length - 1].toUpperCase() || '';
        //dato.authorization = (typeof obj.authorization == 'undefined') ? dato.authorization : obj.authorization;
        // if (dato.canal.split('?').length > 1) {   // ñapa para las peticiones get
        //     let par = dato.canal.split('?')[1].split('&');
        //     for (let i = 0; i < par.length; i++) {
        //         if (par[i].split('=')[0].toUpperCase() == 'XCHN') {
        //             dato.canal = par[i].split('=')[1]; break;
        //         }
        //     }
        // }
        // dato.canal = dato.canal.split('?')[0].toUpperCase();
        if (window.XMLHttpRequest) { this.xmlhttp = new XMLHttpRequest(); }
        else { this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
        if (dato.asincrono) {
            this.xmlhttp.onreadystatechange = this.respuesta;
        }

        // if(!dato.authorization) {
        //     try {
        //         if (dato.autoXSID) dato.parametros.xsid = dato.parametros.xsid || top.SESION_ID || localStorage.getItem("SESION_ID") || sessionStorage.getItem("SESION_ID") || (opener && opener.top.SESION_ID) || getValue('xsid').cambia('#', '') || getValue('xsid', parent).cambia('#', '') || getValue('xsid', opener).cambia('#', '') || '';
        //     } catch (e) { }
        // }

        for (chd in dato.parametros) { cad += "&" + chd + "=" + escape(String(dato.parametros[chd])); } cad = cad.substr(1);
        if (dato.metodo == 'POST') {
            this.xmlhttp.open(dato.metodo, dato.direccion, dato.asincrono);
            if(dato.authorization) {
                switch(dato.authorization.type) {
                    case 'basic':
                        this.xmlhttp.setRequestHeader("Authorization", "Basic " + dato.authorization.key);
                        break;
                    case 'oauth2':
                        this.xmlhttp.setRequestHeader("Authorization", "Bearer " + dato.authorization.key);
                        break;
                }
            }

            if (dato.contentType == 'application/json') {
                this.xmlhttp.setRequestHeader("Content-type", "application/json;" + dato.caracteres + "");
                if (dato.canal == "FILE")
                    this.xmlhttp.responseType = 'arraybuffer';
                this.xmlhttp.send(JSON.stringify(obj.parametros));
            } else if (dato.contentType == 'multipart/form-data') {
                this.xmlhttp.send(dato.parametros.data);
            } else {
                this.xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;" + dato.caracteres + "");
                if (dato.canal == "FILE") this.xmlhttp.responseType = 'arraybuffer';
                this.xmlhttp.send(cad);
            }
        } else if (dato.metodo == 'DELETE') {
            this.xmlhttp.open(dato.metodo, dato.direccion, dato.asincrono);

            if(dato.authorization) {
                switch(dato.authorization.type) {
                    case 'basic':
                        this.xmlhttp.setRequestHeader("Authorization", "Basic " + dato.authorization.key);
                        break;
                    case 'oauth2':
                        this.xmlhttp.setRequestHeader("Authorization", "Bearer " + dato.authorization.key);
                        break;
                }
            }

            this.xmlhttp.setRequestHeader("Content-type", "application/json");
            this.xmlhttp.send(JSON.stringify(obj.parametros));

        } else {
            this.xmlhttp.open("GET", dato.direccion + ((dato.direccion.indexOf('?') < 0) ? '?' : '&') + cad, dato.asincrono);

            if(dato.authorization) {
                switch(dato.authorization.type) {
                    case 'basic':
                        this.xmlhttp.setRequestHeader("Authorization", "Basic " + dato.authorization.key);
                        break;
                    case 'oauth2':
                        this.xmlhttp.setRequestHeader("Authorization", "Bearer " + dato.authorization.key);
                        break;
                }
            }

            //this.xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
            //this.xmlhttp.setRequestHeader('Access-Control-Allow-Methods', '*');
            this.xmlhttp.send();
        }
        if (!dato.asincrono) this.respuesta();
    }
}

function invocaAjax(obj) {
    obj = obj || {};
    if (typeof obj.direccion == 'undefined' || obj.direccion.length == 0) {
        if (typeof obj.retorno == 'function') obj.retorno(false, 'No se ha definido direcci&oacute;n de llamada');
        else alert('no se ha especificado retorno');
    } else {
        var conex = new peticionAjax();
        conex.pide(obj);
    }
}

function arrayBufferToString(buffer) {
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if (/[\u0080-\uffff]/.test(str)) {
        throw new Error(str);
    }
    return str;
}

function getValueFilename(path, name) {
    var filename = new String();
    if (empty(name) && !empty(path))
        filename = path.substr(path.lastIndexOf("/") + 1);
    else
        filename = name;
    return filename;
}