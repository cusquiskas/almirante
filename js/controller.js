class FormController {
    creaParametro(nombre, objeto) {
        if (typeof (this.parametros[nombre]) == 'undefined') this.parametros[nombre] = {};
        this.parametros[nombre].submit = objeto.submit || this.parametros[nombre].submit || false;
        this.parametros[nombre].label = objeto.label || this.parametros[nombre].label || false;
        this.parametros[nombre].object = objeto.object || this.parametros[nombre].object;
        this.parametros[nombre].select = objeto.select || this.parametros[nombre].select || false;
        this.parametros[nombre].preValue = objeto.preValue || this.parametros[nombre].preValue || '';
        this.parametros[nombre].storeDep = objeto.storeDep || this.parametros[nombre].storeDep || false;
        this.parametros[nombre].getAll = objeto.getAll || this.parametros[nombre].getAll || false;
        this.parametros[nombre].isCheckbox = objeto.isCheckbox;
        this.parametros[nombre].value = objeto.value || this.parametros[nombre].value || '';
        this.parametros[nombre].isList = objeto.isList;
    }

    masParametros(Element) {
        for (let x = 0; x < Element.length; x++) {
            let me = this;
            let nombre = Element[x].name;
            let isChkBox = (Element[x].type == 'checkbox');
            let isList = (Element[x].getAttribute('type')== 'list');
            if (nombre) {
                Element[x].addEventListener('change', function () {
                    me.parametros[nombre].value = isChkBox ? me.getCheckboxValue(nombre) : Element[x].value;
                });
                if(!isChkBox || !me.parametros[nombre] || !me.parametros[nombre].value) {
                    this.creaParametro(nombre, {
                        submit: (Element[x].getAttribute('frC-Submit') === 'false') ? false : true,
                        object: Element[x],
                        value: (Element[x].type == 'submit') ? '' : isChkBox ? this.getCheckboxValue(nombre) : isList ? this.getListValue(nombre) : Element[x].value,
                        select: (Element[x].nodeName == 'SELECT') ? true : false,
                        storeDep: (typeof Element[x].getAttribute('frC-Dependency') == 'string') ? (me.parametros[Element[x].getAttribute('frC-Dependency')] || null) : null,
                        getAll: (typeof Element[x].getAttribute('frC-getAllSeparator') == 'string' && Element[x].getAttribute('frC-getAllSeparator').length > 0) ? true : false,
                        isCheckbox: isChkBox ? true : false,
                        isList: isList ? true : false
                    });
                }
            }
            if (Element[x].type == 'submit') {
                Element[x].type = 'button';
                Element[x].addEventListener('click', function () {
                    if (Element[x].name) me.parametros[nombre].value = Element[x].value;
                    me.executeForm();
                });
            }
        }
    }

    masInjertos(Graft) {
        for (let x = 0; x < Graft.length; x++) {
            let nombre = Graft[x].getAttribute('name');
            if (nombre) {
                this.creaParametro(nombre, {
                    label: true,
                    object: Graft[x],
                    value: Graft[x].innerHTML
                });
            }
        }
    }

    invocaStore(Select) {
        let abort = false,
            populate = false,
            params = {};
        if (Select.getAttribute('frC-Reference')) {
            let map, ref = Select.getAttribute('frC-Reference').split(',');
            for (let y = 0; y < ref.length; y++) {
                map = ref[y].split(':');
                if (map[0].indexOf('?') < 0 && (this.parametros[map[1]].value == '' || this.parametros[map[1]].value == undefined)) {
                    abort = true;
                    if (map[0].indexOf('!') >= 0) {
                        Select.length = 0;
                        Select.selectedIndex = -1;
                        let event = document.createEvent("Event"); event.initEvent('change', false, true);
                        Select.dispatchEvent(event);
                    }
                } else {
                    if (map[0].indexOf('!') >= 0) populate = true;
                    map[0] = map[0].replace('?', '');
                    map[0] = map[0].replace('!', '');
                    params[map[0]] = this.parametros[map[1]].value || '';
                }
            }
        }

        if (!abort) {
            let me = this;
            //this.loading(Select.name, true);
            this.ajax({
                extra: me,
                action: Select.getAttribute('frC-Store'),
                params: params,
                extra: {
                    form: me
                },
                function: function (s, d, e) {
                    //me.loading(Select.name, false);
                    if (s) {
                        let root = Select.getAttribute('frC-indexResponse').split('$');
                        let save = Select.getAttribute('frC-saveObj');
                        let raiz = root[0].split(':');
                        let atrb = root[1] ? root[1].split(',') : [];
                        let masRaiz = raiz[0].split('.');
                        let opciones = d;
                        for (let j = 0; j < masRaiz.length; j++) opciones = opciones[masRaiz[j]];
                        if (!me.parametros[Select.name].storeDep) {
                            // no hay dependencia, procedo a carga normal del combo
                            raiz = raiz[1].split(',');
                            for (let y = 0; y < opciones.length; y++) {
                                let option = new Option(opciones[y][raiz[0]], opciones[y][raiz[1]] || '');
                                for(let i = 0; i < atrb.length; i++) {
                                    option.setAttribute(
                                        atrb[i].split('=')[0],
                                        opciones[y][atrb[i].split('=')[1]]
                                    );
                                }
                                Select[Select.length] = option;
                            }
                            // if(Select.getAttribute('frC-DefaultNull') == 'true') {
                            //     if(Select.options.length > 0 && Select.options[0].value == '') {
                            //         Select.options[0]= new Option('', '');
                            //     } else {
                            //         Select.prepend(new Option('', ''));
                            //     }
                            //     Select.selectedIndex = "0";
                            // }
                            if (me.parametros[Select.name].preValue != '') {
                                Select.value = me.parametros[Select.name].preValue;
                                me.parametros[Select.name].preValue = '';
                                populate = true;
                            } else Select.selectedIndex = -1;
                            if (populate || me.parametros[Select.name].preValue != '') {
                                if (save==="true") Select.setAttribute('obj',JSON.stringify(opciones));
                                $(Select).trigger('ajaxSuccess');
                            }
                        } else {
                            // hay dependencia, tengo que mover las opciones del primero al segundo
                            raiz = raiz[1];
                            for (let y = 0; y < opciones.length; y++) {
                                me.parametros[Select.name].storeDep.object.value = opciones[y][raiz];
                                if (me.parametros[Select.name].storeDep.object.options.selectedIndex > -1) {
                                    Select.appendChild(me.parametros[Select.name].storeDep.object.options[me.parametros[Select.name].storeDep.object.options.selectedIndex]);
                                    me.parametros[Select.name].storeDep.object.options[me.parametros[Select.name].storeDep.object.options.selectedIndex] = null
                                }
                            }
                        }
                        if (save==="true") Select.setAttribute('obj',JSON.stringify(opciones));
                        $(Select).trigger('ajaxSuccess');
                    } else {
                        throw d;
                    }
                }
            });
        }
    }

    cargaSelects(Selects) {
        let me = this;
        for (let x = 0; x < Selects.length; x++) {
            if (Selects[x].getAttribute('frC-Store')) {
                if (Selects[x].getAttribute('frC-Reference')) {
                    let ref = Selects[x].getAttribute('frC-Reference').split(',');
                    for (let y = 0; y < ref.length; y++) {
                        let map = ref[y].split(':');
                        this.parametros[map[1]].object.addEventListener('change', function () {
                            Selects[x].length = 0;
                            me.invocaStore(Selects[x]);
                        })
                    }
                }

                if (Selects[x].getAttribute('frC-Dependency')) {
                    let ref = Selects[x].getAttribute('frC-Dependency');
                    if (this.parametros[ref].object.options.length == 0)
                        this.parametros[ref].object.addEventListener('ajaxSuccess', function () {
                            me.invocaStore(Selects[x]);
                        })
                }

                this.invocaStore(Selects[x]);
            }
        }
    }

    get() {
        let obj = {};
        for (let chd in this.parametros) {
            if (this.parametros[chd].submit) {
                if(this.parametros[chd].isList) {
                    obj[chd] = this.parametros[chd].value;
                } else if(this.parametros[chd].isCheckbox) {
                    obj[chd] = JSON.stringify(this.parametros[chd].value);
                } else if (this.parametros[chd].getAll) {
                    if (this.parametros[chd].select) {
                        let cad = '', sep = this.parametros[chd].object.getAttribute('frC-getAllSeparator');
                        for (let x = 0; x < this.parametros[chd].object.options.length; x++) cad += (sep + this.parametros[chd].object.options[x].value);
                        obj[chd] = cad.substr(sep.length);
                    }
                } else {
                    if (this.parametros[chd].object.type && this.parametros[chd].object.type === "date") {
                        obj[chd] = (this.parametros[chd].value) ? this.parametros[chd].value.hazFecha('yyyy-mm-dd', 'dd/mm/yyyy') : '';
                    } else {
                        obj[chd] = this.parametros[chd].value;
                    }
                }
            }
        }
        return obj;
    }

    set(objeto) {
        for (let chd in objeto) {
            if (typeof (this.parametros[chd]) != 'undefined') {
                if(this.parametros[chd].isList) {
                    let list = this.formulario.querySelectorAll('input[name=' + chd + ']');
                    if(!(list instanceof NodeList)) chklist = [chklist];
                    let val = objeto[chd] instanceof Array ? objeto[chd] : [objeto[chd]];
                    for(let i = 0; i < list.length && i < val.length; i++) {
                        list[i].value = val[i];
                    }
                } else if(this.parametros[chd].isCheckbox) {
                    let chklist = this.formulario.querySelectorAll('input[name=' + chd + ']');
                    if(!(chklist instanceof NodeList)) chklist = [chklist];
                    let chkval = objeto[chd] instanceof Array ? objeto[chd] : [objeto[chd]];
                    for(let i = 0; i < chklist.length && i < chkval.length; i++) {
                        chklist[i].checked = (chkval[i] == 'S');
                    }
                } else {
                    this.parametros[chd].value = (typeof objeto[chd] === 'undefined'? '' : objeto[chd]);
                    if (this.parametros[chd].label) {
                        while (this.parametros[chd].object.childNodes.length > 0) this.parametros[chd].object.removeChild(this.parametros[chd].object.childNodes[0]);
                        this.parametros[chd].object.appendChild(document.createTextNode((typeof objeto[chd] === 'undefined'? '' : objeto[chd])));
                    } else {
                        this.parametros[chd].object.value = (typeof objeto[chd] === 'undefined'? '' : objeto[chd]);
                        if (this.parametros[chd].select) this.parametros[chd].preValue = (typeof objeto[chd] === 'undefined'? '' : objeto[chd]);
                    }
                    let event = document.createEvent("Event"); event.initEvent('change', false, true);
                    this.parametros[chd].object.dispatchEvent(event);
                }
            }
        }
    }

    ajax(objeto) {
        invocaAjax({
            direccion: objeto.action,
            metodo: objeto.method || 'GET',
            parametros: objeto.params || '',
            contentType: objeto.contentType || 'application/json',
            autoXSID: (objeto.autoXSID === false ? false : true),
            caracteres: 'utf-8',
            extra: objeto.extra || {},
            retorno: objeto.function
        });
    }

    executeForm() {
        let me = this;
        let errores = this.validate();
        if (errores.length > 0) {
            let funcion;
            funcion = this.formulario.getAttribute('frC-CallBack') && this.modul.script && this.modul.script[this.formulario.getAttribute('frC-CallBack')]
            if (!funcion) funcion = this.formulario.getAttribute('frC-CallBack') && window[this.formulario.getAttribute('frC-CallBack')];
            if (funcion) funcion(false, errores, { form: this, status: 'validation' });
        } else {
            if (this.formulario.getAttribute('action') !== null) {
                //this.loading(this.formulario.name, true);
                this.ajax({
                    action: this.formulario.action,
                    method: this.formulario.method,
                    params: this.get(),
                    extra: { form: me },
                    contentType: this.formulario.getAttribute('Content-Type') || 'application/x-www-form-urlencoded',
                    autoXSID: false,
                    function: function (s, d, e) {
                        //me.loading(me.formulario.name, false);
                        let funcion;
                        funcion = me.formulario.getAttribute('frC-CallBack') && me.modul.script[me.formulario.getAttribute('frC-CallBack')]
                        if (!funcion) funcion = this.formulario.getAttribute('frC-CallBack') && window[me.formulario.getAttribute('frC-CallBack')];
                        if (funcion) funcion(s, d, e);
                    }
                });
            } else {
                let funcion;
                funcion = this.formulario.getAttribute('frC-CallBack') && this.modul.script[this.formulario.getAttribute('frC-CallBack')]
                if (!funcion) funcion = this.formulario.getAttribute('frC-CallBack') && window[this.formulario.getAttribute('frC-CallBack')];
                if (funcion) funcion(true, {}, { form: me });
            }
        }
    }

    localizaLabel(nombre) {
        let Labels = this.formulario.getElementsByTagName('label');
        for (let x = 0; x < Labels.length; x++) {
            if (Labels[x].getAttribute('for') && Labels[x].getAttribute('for') === nombre)
                return Labels[x].childNodes[0].data;
        }
    }

    validate() {
        let me = this;
        let errores = [];
        let Element = this.formulario.elements;
        let variant;
        for (let x = 0; x < Element.length; x++) {
            if (Element[x].name) {
                let label = this.localizaLabel(Element[x].name) || '';
                if ((Element[x].required && Element[x].value == '' && !Element[x].getAttribute('frC-getAllSeparator')) ||
                    (Element[x].getAttribute('frC-getAllSeparator') && Element[x].options.length == 0)) errores.push({
                        name: Element[x].name,
                        type: 'required',
                        label: label
                    });
                switch (Element[x].type) {
                    case 'number':
                        if (Element[x].value != '' && !Element[x].value.esNumero()) errores.push({
                            name: Element[x].name,
                            type: 'NaN',
                            label: label
                        });
                        break;
                    case 'date':
                        if (Element[x].value != '' && !Element[x].value.esFecha('yyyy-mm-dd')) errores.push({
                            name: Element[x].name,
                            type: 'NaD',
                            label: label
                        });
                        break;
                    case 'checkbox':
                        if (Element[x].required && !Element[x].checked) errores.push({
                            name: Element[x].name,
                            type: 'required',
                            label: label
                        });
                        break;
                }
                if (Element[x].getAttribute('frC-Validate') && Element[x].getAttribute('frC-Validate')!=='') {
                    switch (Element[x].getAttribute('frC-Validate')) {
                        case 'IBAN':
                            Element[x].value = Element[x].value.toUpperCase();
                            Element[x].value = Element[x].value.replace(/[^\dA-Z]/g,'');
                            let event = document.createEvent("Event"); event.initEvent('focus', false, true);
                            Element[x].dispatchEvent(event);
                            if (isNaN(Element[x].value.substr(3,Element[x].value.length-2))) {
                                errores.push({name: Element[x].name, type: 'invalid', label: label});
                            } else {
                                variant = {
                                    iban:Element[x].value,
                                    entidad:Element[x].value.substr(4,4),
                                    oficina:Element[x].value.substr(8,4),
                                    dc:Element[x].value.substr(12,2),
                                    cuenta:Element[x].value.substr(14,10),
                                    pais:Element[x].value.substr(0,2)
                                };
                                if (!comprobarDC(variant,'IBAN')) errores.push({name: Element[x].name, type: 'invalid', label: label });
                            }
                            break;
                    }
                }
            }
        }
        return errores;
    }

    getCheckboxValue(name) {
        let param = [];
        let chklist = this.formulario.querySelectorAll('input[name=' + name + ']');
        if(!(chklist instanceof NodeList)) chklist = [chklist];
        for(let i = 0; i < chklist.length; i++) {
            let val = chklist[i].getAttribute('value');
            if(val) param.push(chklist[i].checked ? val : '');
            else    param.push(chklist[i].checked ? 'S' : 'N');
        }
        return param;
    }

    getListValue(name) {
        let param = [];
        let chklist = this.formulario.querySelectorAll('input[name=' + name + ']');
        if(!(chklist instanceof NodeList)) chklist = [chklist];
        for(let i = 0; i < chklist.length; i++) param.push(chklist[i].getAttribute('value'));
        return param;
    }

    constructor(formulario, template) {
        this.formulario = formulario;
        this.modul = template;
        this.parametros = {};
        this.masParametros(formulario.elements);
        this.masInjertos(formulario.getElementsByTagName('frC-Graft'));
        this.cargaSelects(formulario.getElementsByTagName('select'));
        formulario.getAttribute('frC-AutoLoad') && formulario.getAttribute('frC-AutoLoad') === 'true' && this.executeForm();
    }
}

class ModulController {

    return(url) {
        let me = this,
            direcc = url,
            result = "";
        $.ajax({
            url: url,
            method: 'GET',
            async: false,
            success: function (data, status) {
                result = data;
            }
        });

        return typeof result == 'string' ? result : result.outerHTML;
    }

    enlazarScript(objeto, donde) {
        delete this.script;
        if (objeto.script === true) {
            let url = objeto.url.slice(0, -4) + 'js';
            let script = document.createElement('script');
            let d = new Date;
            let clase = false;
            script.type = 'text/javascript';
            script.src = url+'?'+d.getFullYear()+d.getMonth()+d.getDay()+d.getHours()+d.getMinutes()+d.getSeconds();
            $(donde).append(script);
            if (typeof objeto.class === "string" && objeto.class !== "") {
                clase = eval(objeto.class);
                this.script = new clase(this, objeto.parametros||{});
            } else {
                try {
                    clase = eval(url.substr(url.lastIndexOf('/')+1).slice(0,-3));
                } catch (e) {}
                try {
                    if (clase) this.script = new clase(this, objeto.parametros||{});
                } catch (e) { throw e; }
            }
        }
    }

    load(objeto) {
        let me = this;
        let d = Moduls.constants.initDate; //de este modo se podrá cachear la información hasta la recarga del sitio. 
        $(this.name).empty();
        $.get(objeto.url+'?'+d.getFullYear()+d.getMonth()+d.getDay()+d.getHours()+d.getMinutes()+d.getSeconds(), function (data, status) {
            $(me.name).append(data);
            let yo = me,
                nombre2, nombre = 'get'+me.template.id.substr(0,1).toUpperCase()+me.template.id.substr(1).toLowerCase();
            //Moduls[nombre] = function () { return yo; };
            me.child = [];
            let Template = me.template.getElementsByTagName('template');
            if (Template) {
                for (let i = 0; i < Template.length; i++) {
                    me.child[Template[i].id] = new ModulController(Template[i], me);
                    nombre2 = 'get'+Template[i].id.substr(0,1).toUpperCase()+Template[i].id.substr(1).toLowerCase();
                    Moduls[nombre2] = function () { return yo.child[Template[i].id]; };
                }
            }
            me.Forms = [];
            let formularios = me.template.getElementsByTagName('form');
            for (let i = 0; i < formularios.length; i++) if (formularios[i].name) me.Forms[formularios[i].name] = new FormController(formularios[i], me);
            if (me.Forms && me.Forms.length > 0) {
                Moduls[nombre]().getForms = function () { return yo.Forms; };
                Moduls[nombre]().getForm = function (name) { return yo.Forms[name]; };
            }
            me.enlazarScript(objeto, me.name);
            if (me.script && Moduls[nombre]()) Moduls[nombre]().getScript = function () { return yo.script; };
        });
    }

    constructor(Template, ModulControler) {
        this.template = Template;
        this.name = '#' + Template.id;
        this.padre = ModulControler;
    }
}

