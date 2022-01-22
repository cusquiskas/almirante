// Funciones de Array
let t = [];
if (!t.push) {
  Array.prototype.push = function () {
    let i, j = arguments.length;
    for (i = 0; i < j; i++) this[this.length] = arguments[i];
    return this.length;
  }
}
if (!t.pop) {
  Array.prototype.pop = function () {
    if (this.length) {
      let t = this[this.length - 1];
      this.length--;
      return t;
    }
    return null;
  }
}
if (!t.splice) {
  Array.prototype.splice = function (i, n) {
    if (arguments.length < 2 || isNaN(i = i * 1) || isNaN(n = n * 1)) return null;
    if (i < 0 || i >= this.length || n < 0) return null;
    let x, l = this.length - n, r = [];
    if (l >= i) {
      for (x = i; x < l; x++) { r[r.length] = this[x]; this[x] = this[x + n] }
      this.length = l; r.length = n;
    } else {
      for (x = i, l = arr.length; x < l;) r[r.length] = this[x++];
      this.length = i;
    }
    if (arguments.length > 2) for (x = 2, l = arguments.length; x < l;) this[this.length] = arguments[x++];
    return r;
  }
}
if (!t.inArray) {
  Array.prototype.inArray = function (s) {
    for (let i = 0; i < this.length; i++) if (s == this[i]) return i;
    return -1
  }
}
function ordenaArrayObjetos(obj, cmp, ord) {
  return obj.sort(function (a, b) {
    return ((a[cmp] < b[cmp]) ? ((ord == 'ascending') ? -1 : 1) : ((a[cmp] > b[cmp]) ? ((ord == 'ascending') ? 1 : -1) : 0));
  });
}
function esArray(obj) { return (typeof (obj) == 'object' && (obj instanceof Array)); }
t = null;

// Funciones de String
String.prototype.ltrim = function (c) { c = c ? c.aRegExp() : '\\s'; return this.replace(new RegExp("^" + c + "+"), '') }
String.prototype.rtrim = function (c) { c = c ? c.aRegExp() : '\\s'; return this.replace(new RegExp(c + "+$", "g"), '') }
String.prototype.trim = function (c) { c = c ? c.aRegExp() : '\\s'; return this.replace(new RegExp("(^" + c + "+)|(" + c + "+$)", "g"), '') }
String.prototype.esNull = function () { return this.length == 0 }
String.prototype.esNumero = function (ent) {
  if (!this.length) return false;
  if (this.indexOf('.') > -1) return false;
  let c = 0, l = this.indexOf(',');
  if (l > -1 && ent) return false;
  while (l > -1) { l = this.indexOf(',', l + 1); c++; }
  if (c > 1) return false;
  return !isNaN(this.replace(',', '.'));
}
String.prototype.esHora = function (f) {
  let rx = __regexpHora(f);
  let s = rx.regx.exec(this);
  if (!s) return false;
  rx.fmt = rx.fmt.toLowerCase();
  for (let i = 1; i < 4; i++) {
    let m = parseInt(s[i], 10);
    if (m > ((rx.fmt.charAt(i - 1) == 'h') ? 23 : 59)) return false;
  }
  return true;
}
String.prototype.hazHora = function (f) {
  f = f || 'HMS';
  let h = [], r = '', i;
  if (this.indexOf(':') > -1 || this.indexOf('.') > -1) {
    h = (this.indexOf(':') > -1) ? this.split(':') : this.split('.');
  } else {
    switch (this.length) {
      case 1:
      case 2: h[0] = this; h[1] = '0'; h[2] = '0'; break;
      case 4: h[0] = this.substr(0, 2); h[1] = this.substr(2, 2); h[2] = '0'; break;
      case 6: h[0] = this.substr(0, 2); h[1] = this.substr(2, 2); h[2] = this.substr(4, 2); break;
      default: throw 'Hora incorrecta.';
    }
  }
  if (horaValida(h[0], h[1] || 0, h[2] || 0)) {
    for (i = 0; i < f.length; i++) {
      switch (f.substr(i, 1)) {
        case 'h': r += (r.length) ? ':' : ''; r += h[0].ltrim('0').lpad(1, '0'); break;
        case 'H': r += (r.length) ? ':' : ''; r += h[0].ltrim('0').lpad(2, '0'); break;
        case 'm': r += (r.length) ? ':' : ''; r += h[1].ltrim('0').lpad(1, '0'); break;
        case 'M': r += (r.length) ? ':' : ''; r += h[1].ltrim('0').lpad(2, '0'); break;
        case 's': r += (r.length) ? ':' : ''; r += h[2].ltrim('0').lpad(1, '0'); break;
        case 'S': r += (r.length) ? ':' : ''; r += h[2].ltrim('0').lpad(2, '0'); break;
        case ':': break;
        default: throw 'Formato incorrecto.';
      }
    }
  } else throw 'Hora incorrecta.';
  return r;
}
String.prototype.hazObjFecha = function (f) {
  let sep;
  if (!f && '0123456789dmy'.indexOf(this.substring(2, 3).toLowerCase()) == -1) { sep = this.substring(2, 3); }
  if (f && f.length == 1 && '0123456789dmy'.indexOf(f.toLowerCase()) == -1) { sep = f; f = null; }
  sep = sep || '/';
  let rx = { 6: 'ddmmyy', 8: 'ddmmyyyy', 10: 'dd' + sep + 'mm' + sep + 'yyyy' };
  if (f) rx = __regexpFecha(f); else {
    if (this.length != 6 && this.length != 8 && this.length != 10) return false;
    rx = __regexpFecha(rx[this.length]);
  }
  let s = rx.regx.exec(this), s2;
  if (!s) return false;
  let fc = { d: '!', m: '!', y: '!' };
  for (let i = 1; i < 4; i++) {
    fc[rx.fmt.charAt(i - 1).toLowerCase()] = parseInt(s[i] || '!', 10);
  }
  if (isNaN(fc.d)) fc.d = 1;
  if (isNaN(fc.m)) fc.m = 1;
  if (isNaN(fc.y)) fc.y = 1904; else {
    if (rx.fmt.indexOf('y') != -1 && fc.y !== '!') {
      fc.y %= 100;
      s = (new Date()).getFullYear();
      s2 = Math.floor(s / 100) * 100; s %= 100;
      fc.y += (fc.y < 50) ? ((s < 50) ? s2 : s2 + 100) : ((s < 50) ? s2 - 100 : s2);
    }
  }
  return fc;
}
String.prototype.esFecha = function (f) {
  let fc = this.hazObjFecha(f);
  return fechaValida(fc.d, fc.m, fc.y);
}
String.prototype.hazFecha = function (fe, fs) {
  let fc = this.hazObjFecha(fe);
  if (fc !== false && fechaValida(fc.d, fc.m, fc.y)) {
    s = (new Date(fc.y, fc.m - 1, fc.d)).formatea(fs);
    return s;
  } else throw 'Fecha incorrecta.';
}
String.prototype.esMail = function () {
  if (this.search(/^[\w\-]+(\.[\w\-]+)*@([a-z0-9]([\w\-]*?[^-])?\.)+[a-z]{2,8}(\.[a-z]{2})?$/i) != -1) return true;
  let i, r = this.match(/^[\w\-]+(\.[\w\-]+)*@(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i);
  if (!r || r.length != 6) return false;
  for (i = 5; i; i--) if (parseInt(r[i]) > 255) return false;
  return true;
}
String.prototype.esDNI = function (t) {
  if (!t) {
    if (this.search(/^[xtayz]\d{7,8}[a-z]$/i) != -1) t = 'NIE';
    else if (this.search(/^\d{8}[a-z]$/i) != -1) t = 'NIF';
    else if (this.search(/^[a-hj-np-suvw]\d{7}[a-z0-9]$/i) != -1) t = 'CIF';
    else if (this.search(/^\d{8}$/i) != -1) t = 'DNI';
    else if (this.search(/^\d{11}$/i) != -1 || this.search(/^\d{12}$/i) != -1) t = 'NSS';
  }
  switch (String(t).toUpperCase()) {
    case 'NIF':
      if (this.search(/^\d{8}[a-z]$/i) != -1) {
        return ('TRWAGMYFPDXBNJZSQVHLCKE'.charAt(parseInt(this.substr(0, 8), 10) % 23) == this.substr(this.length - 1).toUpperCase());
      } else return false;
    case 'NIE':
      if (this.search(/^[xyz]\d{7,8}[a-z]$/i) != -1) {
        t = this.replace(/^[xta]/i, '0').replace(/^y/i, '1').replace(/^z/i, '2');
        return ('TRWAGMYFPDXBNJZSQVHLCKE'.charAt(parseInt(t.match(/\d+/)[0], 10) % 23) == t.substr(t.length - 1).toUpperCase());
      } else return false;
    case 'DNI':
      return this.search(/^\d{8}$/) != -1;
    case 'CIF':
      let i, x = 0;
      if (this.search(/^[a-hj-np-suvw]\d{7}[a-z0-9]$/i) != -1) {
        t = this.substr(1, 7).match(/\d/g);
        for (i = 0; i < 7; i++) x += (i % 2 != 0) ? parseInt(t[i]) : ((t[i] * 2) < 10) ? (t[i] * 2) : parseInt(String((t[i] * 2)).substr(0, 1)) + parseInt(String((t[i] * 2)).substr(1, 1));
        x = (10 - parseInt((x < 10) ? x : (String(x).substr(1, 1) == '0') ? '10' : String(x).substr(1, 1)));
        if (this.search(/^[kpnqsw]/i) != -1) { return ('JABCDEFGHI'.charAt(x) == this.substr(this.length - 1).toUpperCase()); }
        else {
          return (String(x) == this.substr(this.length - 1));
        }
      } else return false;
    case 'NSS':
      let nss = this;
      let pro = nss.substr(0, 2) * 1;
      if ((pro < 1 || pro > 53) && pro != 66) return false;
      if (!nss) return false;
      if (nss.length != 11 && nss.length != 12) return false;
      if (nss.substr(2, 1) == 0) nss = "" + nss.substr(0, 2) + nss.substr(3, nss.length - 1);
      return ((nss.substr(0, nss.length - 2) % 97) * 1 == (nss.substr(nss.length - 2, 2)) * 1);

    default:
      return false;
  }
}

String.prototype.reemplazaMostachos = function (obj) {
  let cad = this;
  for (let chd in obj) cad = cad.replace(new RegExp('{{' + chd + '}}', 'g'), ((obj[chd] || obj[chd] === 0 || obj[chd] === false) ? obj[chd] : ''));
  return cad;
}

String.prototype.cambia = function (org, dst) {
  if (!org) return this;
  let cad = this;
  dst = (!dst ? '' : dst).aRegExp();
  if (!esArray(org)) org = [org];
  for (let i = 0; i < org.length; i++) cad = cad.replace(new RegExp(org[i].aRegExp(), "g"), dst);
  return cad;
}
String.prototype.lpad = function (sz, p) {
  if ((!sz) || (this.length >= sz)) return this;
  p = (!p) ? ' ' : p; sz -= this.length;
  let t = '', i = sz;
  while (i--) t += p;
  t = t.substr(0, sz);
  return t + this;
}
String.prototype.rpad = function (sz, p) {
  if ((!sz) || (this.length >= sz)) return this;
  p = (!p) ? ' ' : p; sz -= this.length;
  let t = '', i = sz;
  while (i--) t += p;
  t = t.substr(0, sz);
  return this + t;
}
String.prototype.cuentaSubCad = function (s) {
  if (!s) return 0;
  let x = 0, c = 0, sz = s.length;
  while ((x = this.indexOf(s, x)) > -1) { c++; x += sz }
  return c;
}
String.prototype.aRegExp = function () { return this.replace(/([\.\\\+\?\*\^\$\{\}\[\]\|])/g, '\\$1') }

String.prototype.buscaPalabra = function (p, s, i) {
  s = parseInt(s + 'a'); s = isNaN(s) ? 0 : s;
  return this.substr(s).search(new RegExp('(^|\\b)' + p.aRegExp() + '($|\\b)', 'g' + ((i) ? 'i' : ''))) + s;
}
String.prototype.cambiaPalabra = function (p, p2, i) { return this.replace(new RegExp('(^|\\b)(' + p.aRegExp() + ')($|\\b)', 'g' + ((i) ? 'i' : '')), '$1' + (p2 ? p2 : '').aRegExp() + '$3') }

function sustituirPaisIBAN(letra) { letra = letra.replace(/A/ig, '10'); letra = letra.replace(/B/ig, '11'); letra = letra.replace(/C/ig, '12'); letra = letra.replace(/D/ig, '13'); letra = letra.replace(/E/ig, '14'); letra = letra.replace(/F/ig, '15'); letra = letra.replace(/G/ig, '16'); letra = letra.replace(/H/ig, '17'); letra = letra.replace(/I/ig, '18'); letra = letra.replace(/J/ig, '19'); letra = letra.replace(/K/ig, '20'); letra = letra.replace(/L/ig, '21'); letra = letra.replace(/M/ig, '22'); letra = letra.replace(/N/ig, '23'); letra = letra.replace(/O/ig, '24'); letra = letra.replace(/P/ig, '25'); letra = letra.replace(/Q/ig, '26'); letra = letra.replace(/R/ig, '27'); letra = letra.replace(/S/ig, '28'); letra = letra.replace(/T/ig, '29'); letra = letra.replace(/U/ig, '30'); letra = letra.replace(/V/ig, '31'); letra = letra.replace(/W/ig, '32'); letra = letra.replace(/X/ig, '33'); letra = letra.replace(/Y/ig, '34'); letra = letra.replace(/Z/ig, '35'); return letra; }
function comprobarDC(cuenta, formato) {
  let i;
  switch (formato.toUpperCase()) {
    case 'CCC':
      let numeros = [6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
      let tras_entidad = '';
      for (i = 0; i < cuenta.entidad.length + 1; i++) tras_entidad += cuenta.entidad.substr(cuenta.entidad.length - i, 1);
      let tras_oficina = '';
      for (i = 0; i < cuenta.oficina.length + 1; i++) tras_oficina += cuenta.oficina.substr(cuenta.oficina.length - i, 1);
      let tras_cuenta = '';
      for (i = 0; i < cuenta.cuenta.length + 1; i++) tras_cuenta += cuenta.cuenta.substr(cuenta.cuenta.length - i, 1);
      let tras_total = "" + tras_oficina + tras_entidad;
      let resultado = 0;
      for (i = 0; i < 8; i++) resultado += (tras_total.substr(i, 1) * numeros[i]);
      let resultado_cuenta = 0;
      for (i = 0; i < 10; i++) resultado_cuenta += (tras_cuenta.substr(i, 1) * numeros[i]);
      let dc_resultado = 11 - (resultado % 11);
      let dc_resultado_cuenta = 11 - (resultado_cuenta % 11);
      if (dc_resultado == 10) dc_resultado = 1;
      if (dc_resultado == 11) dc_resultado = 0;
      if (dc_resultado_cuenta == 10) dc_resultado_cuenta = 1;
      if (dc_resultado_cuenta == 11) dc_resultado_cuenta = 0;
      return (cuenta.dc == "" + dc_resultado + dc_resultado_cuenta);
      break;
    case 'IBAN':
      let numero = sustituirPaisIBAN(cuenta.pais);
      let iban = String(cuenta.entidad) + String(cuenta.oficina);
      let modulo = iban % 97;
      iban = "" + modulo + cuenta.dc + cuenta.cuenta.substring(0, 2);
      modulo = iban % 97;
      iban = "" + modulo + cuenta.cuenta.substring(2, cuenta.cuenta.length) + numero + '00';
      let modulo_iban = iban % 97;
      let iban_resul = 98 - modulo_iban;
      if (iban_resul >= 1 && iban_resul <= 9) iban_resul = '0' + iban_resul;
      return (cuenta.iban.substr(0, 4) == cuenta.pais + iban_resul);
      break;
    default:
      return false;
  }
}

function formatoEsp(valor, dec) {
  if (isNaN(valor) || !isFinite(valor)) return valor;
  if (!isNaN(dec) && isFinite(dec) && dec >= 0) valor = parseFloat(valor).toFixed(dec);
  valor = String(valor).replace(/[^\d-]/g, ',');
  valor = (valor.substr(0, 1) == ',') ? '0' + valor : valor;
  let len, neg = valor.charAt(0);
  valor = valor.substr(neg == '-' ? 1 : 0);
  len = valor.indexOf(',');
  len = (len > 0) ? len : valor.length;
  while (len > 3) {
    valor = valor.substr(0, len - 3) + '.' + valor.substr(len - 3);
    len -= 3;
  }
  return (neg == '-' ? '-' : '') + valor;
}

function dec2bin(x, a) {
  if ((/[^0-9]/g.test(x)) || x == "") { return (a) ? [] : ''; }
  x = parseInt(x);
  let arr = new Array(), i, bin = x.toString(2);
  if (!a) return bin.toString();
  else {
    for (i = bin.length - 1; i >= 0; i--) { arr.push(parseInt(bin.substr(i, 1))); }
    return arr;
  }
}

// Funciones de Date
Date.prototype.addMonth = function (n) { return new Date(new Date(this).setMonth(this.getMonth() + n)); }
Date.prototype.formatea = function (f) {
  f = f || 'dd/mm/yyyy';
  let rx = __regexpFecha(f), i, j, s = '';
  for (i = 0; i < rx.fmt.length;) {
    let c = rx.fmt.charAt(i);
    switch (c) {
      case 'd': case 'D':
        j = this.getDate(); s += ((j < 10) && (c == 'D')) ? '0' + j : j;
        break;
      case 'm': case 'M':
        j = this.getMonth() + 1; s += ((j < 10) && (c == 'M')) ? '0' + j : j;
        break;
      default: s += String(this.getFullYear()).substr(c == 'Y' ? 0 : 2, c == 'Y' ? 4 : 2);
    }
    if (rx.fmt.charAt(++i)) s += rx.sep;
  }
  return s;
}
Date.prototype.formateaHora = function (f) {
  let rx = __regexpHora(f), i, j, s = '';
  for (i = 0; i < rx.fmt.length;) {
    let c = rx.fmt.charAt(i);
    switch (c) {
      case 'h': case 'H':
        j = this.getHours(); s += ((j < 10) && (c == 'H')) ? '0' + j : j;
        break;
      case 'm': case 'M':
        j = this.getMinutes(); s += ((j < 10) && (c == 'M')) ? '0' + j : j;
        break;
      default:
        j = this.getSeconds(); s += ((j < 10) && (c == 'S')) ? '0' + j : j;
    }
    if (rx.fmt.charAt(++i)) s += rx.sep;
  }
  return s;
}

function __regexpHora(f) {
  f = String(f).toLowerCase().match(/^((hh?)|(mm?)|(ss?))(([^hms]?)((hh?)|(mm?)|(ss?))((\6)((hh?)|(mm?)|(ss?)))?)?$/);
  let i, m = 0, ms = 'hms', fmt = '', s;
  if (f) {
    for (i = 0; i < 14; i++) if (!f[i]) f[i] = '';
    for (i = 0; i < 3; i++) {
      let c, d = f[[1, 7, 13][i]]; c = d.charAt(0)
      m |= (1 << ms.indexOf[c]); ms[c] <<= 3;
      fmt += (d.length > 1) ? c.toUpperCase() : c;
    }
  } else { m = 8; f = [] }
  fmt = (m > 7) ? 'hM' : fmt;
  f[6] = (m > 7) ? ':' : f[6];
  for (i = 0, s = '^'; i < fmt.length; i++) {
    s += '(\\d\\d' + (('hms'.indexOf(fmt.charAt(i)) != -1) ? '?' : '') + ')' + (fmt.charAt(i + 1) ? f[6].aRegExp() : '');
  }
  return { regx: new RegExp(s + '$'), fmt: fmt, sep: f[6] };
}
function comparaHora(h0, h1, sep) {
  h0 = '' + h0; h1 = '' + h1; sep = (sep) ? sep : ':';
  h0 = h0.split(sep); h1 = h1.split(sep);
  h0 = horaValida(h0[0], h0[1], (h0[2] ? h0[2] : 0)) ? new Date('01', '01', '01', h0[0], h0[1], (h0[2] ? h0[2] : 0)) : new Date();
  h1 = horaValida(h1[0], h1[1], (h1[2] ? h1[2] : 0)) ? new Date('01', '01', '01', h1[0], h1[1], (h1[2] ? h1[2] : 0)) : new Date();
  if (h0 < h1) return -1;
  if (h0 > h1) return 1;
  return 0;
}
function horaValida(h, m, s) {
  if (isNaN(h) || isNaN(m) || isNaN(s)) return false;
  h = parseInt(h, 10); m = parseInt(m, 10); s = parseInt(s, 10);
  if (h < 0 || h > 23) return false;
  if (m < 0 || m > 59) return false;
  if (s < 0 || s > 59) return false;
  return true;
}
function __regexpFecha(f) {
  f = String(f).toLowerCase().match(/^((dd?)|(mm?)|(y{2,4}))(([^dmy]?)((dd?)|(mm?)|(y{2,4}))((\6)((dd?)|(mm?)|(y{2,4})))?)?$/);
  let i = 0, m = 0, ms = 'dmy', fmt = '', s;
  if (f) {
    for (i = 0; i < 14; i++) if (!f[i]) f[i] = '';
    for (i = 0; i < 3; i++) {
      let c, d = f[[1, 7, 13][i]]; c = d.charAt(0);
      m |= (1 << ms.indexOf[c]); ms[c] <<= 3;
      fmt += (d.length > ((c != 'y') ? 1 : 3)) ? c.toUpperCase() : c;
    }
  } else throw "Formato de fecha inv�lido";
  fmt = (m > 7) ? 'dmY' : fmt;
  f[6] = (m > 7) ? '/' : f[6];
  for (i = 0, s = '^'; i < fmt.length; i++) {
    let fc = fmt.charAt(i);
    switch (fc.toLowerCase()) {
      case 'd': case 'm': s += '(\\d\\d' + (('dm'.indexOf(fc) != -1) ? '?' : '') + ')'; break;
      case 'y': s += '(\\d{' + ((fc == 'y') ? '2' : '4') + '})'; break;
    }
    s += (fmt.charAt(i + 1) ? f[6].aRegExp() : '');
  }
  return { regx: new RegExp(s + '$'), fmt: fmt, sep: f[6] }
}
function comparaFecha(f0, f1, sep) {
  f0 = '' + f0; f1 = '' + f1; sep = (sep) ? sep : '/';
  f0 = f0.split(sep); f1 = f1.split(sep);
  f0 = fechaValida(f0[0], f0[1], f0[2]) ? new Date(f0[2], f0[1] - 1, f0[0]) : new Date();
  f1 = fechaValida(f1[0], f1[1], f1[2]) ? new Date(f1[2], f1[1] - 1, f1[0]) : new Date();
  if (f0 < f1) return -1;
  if (f0 > f1) return 1;
  return 0;
}
function bisiesto(anyo) {
  if ((anyo % 100) == 0) {
    if ((anyo % 400) == 0) return true;
  } else {
    if ((anyo % 4) == 0) return true;
  }
  return false;
}
function fechaValida(d, m, a) {
  if (isNaN(d) || isNaN(m) || isNaN(a)) return false;
  d = parseInt(d, 10); m = parseInt(m, 10); a = parseInt(a, 10);
  if (m < 1 || m > 12) return false;
  if (a < 1900) return false;
  if (d < 1) return false;
  if (d > [31, 28 + (bisiesto(a) ? 1 : 0), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]) return false;
  return true;
}
function sysdate(f) { return (new Date).formatea(f) }


// Funciones de forms
function radioIndex(rad) {
  if (rad[0].type != 'radio') return -1;
  let i, j = -1;
  for (i = 0; i < rad.length; i++) if (rad[i].checked) { j = i; break; }
  return j;
}
function radioValue(rad) {
  let i = radioIndex(rad);
  return (i == -1) ? '' : rad[i].value;
}
function radioCheckValue(rad, val) {
  let i, j = -1;
  if (rad[0].type != 'radio') return;
  for (i = 0; i < rad.length; i++) if (rad[i].value == val) { j = i; break; }
  if (j != -1) rad[j].checked = true;
  return j;
}
function radioValueOff(rad) {
  if (rad[0].type != 'radio') return;
  for (i = 0; i < rad.length; i++) rad[i].checked = false;
  return;
}
function getOption(s, v, p, i) {
  let j, k;
  if (!s.options) return null; else s = s.options;
  p = p ? p : 'value';
  v = v ? ((i) ? ('' + v).toUpperCase() : ('' + v)) : '';
  try {
    for (j = 0; j < s.length; j++) {
      k = '' + s[j][p]; k = i ? k.toUpperCase() : k;
      if (k == v) return s[j];
    }
  } catch (e) { return null }
  return null;
}
function getSelectText(s, v, i) {
  let y = getSelectIndex(s, v, i);
  return (y != -1) ? s.options[y].text : '';
}
function getSelectIndex(s, v, i) {
  if (!s.options) return -1; else s = s.options;
  v = (v) ? ((i) ? ('' + v).toUpperCase() : ('' + v)) : '';
  for (let j = 0; j < s.length; j++) if ((i ? s[j].value : s[j].value.toUpperCase()) == v) return j;
  return -1;
}
function getSelectedOptions(s, f) {
  let i, opt = [], str = ''; f = f || 'array';
  for (i = 0; i < s.options.length; i++) {
    if (s.options[i].selected) { if (f == 'array') opt.push(s.options[i].value); else str += ',' + s.options[i].value; }
  }
  if (f == 'array') return opt;
  else return str.substr(1, str.length - 1);
}
function rellenaSelect(s, o, r, c) {
  if (!s.options) return -1; else s = s.options;
  if (!r) s.length = 0;
  c = c || {};
  c.txt = c.txt || 'txt';
  c.val = c.val || 'val';
  let i, j, ss;
  for (let i = 0; i < o.length; i++) {
    ss = new Option(o[i][c.txt], o[i][c.val]);
    for (j in o[i]) if ('txt\x1fval\x1f'.indexOf(j) == -1) ss.setAttribute(j, o[i][j]);
    s[s.length] = ss;
  }
  return s.length;
}
function selectMultiple(campo) {
  let cmb = getId(campo); let estados = '@'; let num = 0;
  for (i = 0; i < cmb.options.length; i++) {
    if (cmb.options[i].selected && cmb.options[i].value != '') {
      estados += cmb.options[i].value + '@';
      num++;
    }
  }
  return num > 0 ? estados : '';
}

// Inicializadores y eventos
function anadeEvt(o, e, f) {
  e = e.replace(/^on/i, '');
  if (o.addEventListener) {
    o.addEventListener(e, f, false);
    o = f = null;
    return true;
  }
  e = 'on' + e;
  if (o.attachEvent) {
    o.attachEvent(e, f);
    o = f = null;
    return true;
  }
  let old = (o[e]) ? o[e] : function () { };
  o[e] = function () { old(); f() };
  o = f = null;
  return false;
}
function borraEvt(o, e, f) {
  e = e.replace(/^on/i, '');
  if (o.removeEventListener) {
    o.removeEventListener(e, f, false);
    o = f = null;
    return true;
  }
  e = 'on' + e;
  if (o.detachEvent) {
    o.detach(e, f);
    o = f = null;
    return true;
  }
  o = f = null;
  return false;
}

function getBrowser() {
  // Obtener los datos del browser
  let objAgent = navigator.userAgent;
  let objOffsetName, objOffsetVersion, ix;

  let bwr = {
    browserName: navigator.appName,
    browserFullVersion: '' + parseFloat(navigator.appVersion),
    browserVersion: '',
    language: navigator.language,
    os: ''
  };

  // In Chrome
  if ((objOffsetVersion = objAgent.indexOf("Chrome")) != -1) {
    bwr.browserName = "Chrome";
    bwr.browserFullVersion = objAgent.substring(objOffsetVersion + 7);
    if ((ix = bwr.browserFullVersion.indexOf(" ")) != -1)
      bwr.browserFullVersion = bwr.browserFullVersion.substring(0, ix);
  }
  // In Microsoft internet explorer
  else if ((objOffsetVersion = objAgent.indexOf("MSIE")) != -1) {
    bwr.browserName = "Internet Explorer";
    bwr.browserFullVersion = objAgent.substring(objOffsetVersion + 5);
    bwr.browserFullVersion = bwr.browserFullVersion.substring(0, bwr.browserFullVersion.indexOf(";"));
  }
  // In Microsoft internet explorer
  else if (bwr.browserName == 'Netscape' && (objOffsetVersion = objAgent.indexOf("Trident/")) != -1) {
    let re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
    bwr.browserName = "Internet Explorer";
    if (re.exec(objAgent) != null) bwr.browserFullVersion = RegExp.$1;
  }
  // In Firefox
  else if ((objOffsetVersion = objAgent.indexOf("Firefox")) != -1) {
    let re = new RegExp("Firefox/([0-9]{1,}[\.0-9]{0,})");
    bwr.browserName = "Firefox";
    if (re.exec(objAgent) != null) bwr.browserFullVersion = RegExp.$1;
  }
  // In Safari
  else if ((objOffsetVersion = objAgent.indexOf("Safari")) != -1) {
    bwr.browserName = "Safari";
    bwr.browserFullVersion = objAgent.substring(objOffsetVersion + 7);
    if ((objOffsetVersion = objAgent.indexOf("Version")) != -1)
      bwr.browserFullVersion = objAgent.substring(objOffsetVersion + 8);
    bwr.browserFullVersion = bwr.browserFullVersion.substring(0, bwr.browserFullVersion.indexOf(" "));
  }
  // For other browser "name/version" is at the end of userAgent
  else if ((objOffsetName = objAgent.lastIndexOf(' ') + 1) <
    (objOffsetVersion = objAgent.lastIndexOf('/'))) {
    bwr.browserName = objAgent.substring(objOffsetName, objOffsetVersion);
    bwr.browserFullVersion = objAgent.substring(objOffsetVersion + 1);
    if (bwr.browserName.toLowerCase() == bwr.browserName.toUpperCase()) {
      bwr.browserName = navigator.appName;
    }
  }

  if ((ix = bwr.browserFullVersion.indexOf(".")) != -1)
    bwr.browserVersion = bwr.browserFullVersion.substring(0, ix);

  if ((objOffsetVersion = objAgent.indexOf("Windows")) != -1) {
    bwr.os = "Windows";
  } else if ((objOffsetVersion = objAgent.indexOf("Macintosh")) != -1) {
    bwr.os = "Macintosh";
  } else if ((objOffsetVersion = objAgent.indexOf("iPhone")) != -1) {
    bwr.os = "iPhone";
  } else if ((objOffsetVersion = objAgent.indexOf("Windows Phone")) != -1) {
    bwr.os = "Windows Phone";
  } else if ((objOffsetVersion = objAgent.indexOf("Android")) != -1) {
    bwr.os = "Android";
  } else if ((objOffsetVersion = objAgent.indexOf("Linux")) != -1) {
    bwr.os = "Linux";
  }

  return bwr;
}


function empty(data) {
  if (typeof (data) == 'number' || typeof (data) == 'boolean') {
    return false;
  }
  if (typeof (data) == 'undefined' || data === null) {
    return true;
  }
  if (typeof (data.length) != 'undefined') {
    return data.length == 0;
  }
  let count = 0;
  for (let i in data) {
    if (data.hasOwnProperty(i)) {
      count++;
    }
  }
  return count == 0;
}

/** Funcion para saber si es Firefox */
function esFirefox() {
  let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  return isFirefox;
};
/** Funcion para saber si es IE */
function esInternetExplorer() {
  let esIE = false;
  let ua = window.navigator.userAgent;
  let msie = ua.indexOf("MSIE ");
  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    esIE = true;
  }
  return esIE;
};
