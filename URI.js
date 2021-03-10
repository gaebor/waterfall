/*! URI.js v1.19.6 http://medialize.github.io/URI.js/ */
/* build contains: IPv6.js, punycode.js, SecondLevelDomains.js, URI.js */
/*
 URI.js - Mutating URLs
 IPv6 Support

 Version: 1.19.6

 Author: Rodney Rehm
 Web: http://medialize.github.io/URI.js/

 Licensed under
   MIT License http://www.opensource.org/licenses/mit-license

 https://mths.be/punycode v1.4.0 by @mathias  URI.js - Mutating URLs
 Second Level Domain (SLD) Support

 Version: 1.19.6

 Author: Rodney Rehm
 Web: http://medialize.github.io/URI.js/

 Licensed under
   MIT License http://www.opensource.org/licenses/mit-license

 URI.js - Mutating URLs

 Version: 1.19.6

 Author: Rodney Rehm
 Web: http://medialize.github.io/URI.js/

 Licensed under
   MIT License http://www.opensource.org/licenses/mit-license

*/
(function (t, w) { "object" === typeof module && module.exports ? module.exports = w() : "function" === typeof define && define.amd ? define(w) : t.IPv6 = w(t) })(this, function (t) {
    var w = t && t.IPv6; return {
        best: function (n) {
            n = n.toLowerCase().split(":"); var k = n.length, d = 8; "" === n[0] && "" === n[1] && "" === n[2] ? (n.shift(), n.shift()) : "" === n[0] && "" === n[1] ? n.shift() : "" === n[k - 1] && "" === n[k - 2] && n.pop(); k = n.length; -1 !== n[k - 1].indexOf(".") && (d = 7); var m; for (m = 0; m < k && "" !== n[m]; m++); if (m < d) for (n.splice(m, 1, "0000"); n.length < d;)n.splice(m, 0, "0000");
            for (m = 0; m < d; m++) { k = n[m].split(""); for (var x = 0; 3 > x; x++)if ("0" === k[0] && 1 < k.length) k.splice(0, 1); else break; n[m] = k.join("") } k = -1; var v = x = 0, J = -1, E = !1; for (m = 0; m < d; m++)E ? "0" === n[m] ? v += 1 : (E = !1, v > x && (k = J, x = v)) : "0" === n[m] && (E = !0, J = m, v = 1); v > x && (k = J, x = v); 1 < x && n.splice(k, x, ""); k = n.length; d = ""; "" === n[0] && (d = ":"); for (m = 0; m < k; m++) { d += n[m]; if (m === k - 1) break; d += ":" } "" === n[k - 1] && (d += ":"); return d
        }, noConflict: function () { t.IPv6 === this && (t.IPv6 = w); return this }
    }
});
(function (t) {
    function w(l) { throw new RangeError(O[l]); } function n(l, p) { for (var u = l.length, q = []; u--;)q[u] = p(l[u]); return q } function k(l, p) { var u = l.split("@"), q = ""; 1 < u.length && (q = u[0] + "@", l = u[1]); l = l.replace(L, "."); u = l.split("."); u = n(u, p).join("."); return q + u } function d(l) { for (var p = [], u = 0, q = l.length, z, C; u < q;)z = l.charCodeAt(u++), 55296 <= z && 56319 >= z && u < q ? (C = l.charCodeAt(u++), 56320 == (C & 64512) ? p.push(((z & 1023) << 10) + (C & 1023) + 65536) : (p.push(z), u--)) : p.push(z); return p } function m(l) {
        return n(l, function (p) {
            var u =
                ""; 65535 < p && (p -= 65536, u += g(p >>> 10 & 1023 | 55296), p = 56320 | p & 1023); return u += g(p)
        }).join("")
    } function x(l, p, u) { var q = 0; l = u ? F(l / 700) : l >> 1; for (l += F(l / p); 455 < l; q += 36)l = F(l / 35); return F(q + 36 * l / (l + 38)) } function v(l) {
        var p = [], u = l.length, q = 0, z = 128, C = 72, a, b; var c = l.lastIndexOf("-"); 0 > c && (c = 0); for (a = 0; a < c; ++a)128 <= l.charCodeAt(a) && w("not-basic"), p.push(l.charCodeAt(a)); for (c = 0 < c ? c + 1 : 0; c < u;) {
            a = q; var e = 1; for (b = 36; ; b += 36) {
                c >= u && w("invalid-input"); var f = l.charCodeAt(c++); f = 10 > f - 48 ? f - 22 : 26 > f - 65 ? f - 65 : 26 > f - 97 ? f - 97 : 36;
                (36 <= f || f > F((2147483647 - q) / e)) && w("overflow"); q += f * e; var h = b <= C ? 1 : b >= C + 26 ? 26 : b - C; if (f < h) break; f = 36 - h; e > F(2147483647 / f) && w("overflow"); e *= f
            } e = p.length + 1; C = x(q - a, e, 0 == a); F(q / e) > 2147483647 - z && w("overflow"); z += F(q / e); q %= e; p.splice(q++, 0, z)
        } return m(p)
    } function J(l) {
        var p, u, q, z = []; l = d(l); var C = l.length; var a = 128; var b = 0; var c = 72; for (q = 0; q < C; ++q) { var e = l[q]; 128 > e && z.push(g(e)) } for ((p = u = z.length) && z.push("-"); p < C;) {
            var f = 2147483647; for (q = 0; q < C; ++q)e = l[q], e >= a && e < f && (f = e); var h = p + 1; f - a > F((2147483647 - b) / h) &&
                w("overflow"); b += (f - a) * h; a = f; for (q = 0; q < C; ++q)if (e = l[q], e < a && 2147483647 < ++b && w("overflow"), e == a) { var r = b; for (f = 36; ; f += 36) { e = f <= c ? 1 : f >= c + 26 ? 26 : f - c; if (r < e) break; var y = r - e; r = 36 - e; var A = z; e += y % r; A.push.call(A, g(e + 22 + 75 * (26 > e) - 0)); r = F(y / r) } z.push(g(r + 22 + 75 * (26 > r) - 0)); c = x(b, h, p == u); b = 0; ++p } ++b; ++a
        } return z.join("")
    } var E = "object" == typeof exports && exports && !exports.nodeType && exports, M = "object" == typeof module && module && !module.nodeType && module, H = "object" == typeof global && global; if (H.global === H || H.window === H ||
        H.self === H) t = H; var P = /^xn--/, N = /[^\x20-\x7E]/, L = /[\x2E\u3002\uFF0E\uFF61]/g, O = { overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input" }, F = Math.floor, g = String.fromCharCode, B; var D = {
            version: "1.3.2", ucs2: { decode: d, encode: m }, decode: v, encode: J, toASCII: function (l) { return k(l, function (p) { return N.test(p) ? "xn--" + J(p) : p }) }, toUnicode: function (l) {
                return k(l, function (p) {
                    return P.test(p) ? v(p.slice(4).toLowerCase()) :
                        p
                })
            }
        }; if ("function" == typeof define && "object" == typeof define.amd && define.amd) define("punycode", function () { return D }); else if (E && M) if (module.exports == E) M.exports = D; else for (B in D) D.hasOwnProperty(B) && (E[B] = D[B]); else t.punycode = D
})(this);
(function (t, w) { "object" === typeof module && module.exports ? module.exports = w() : "function" === typeof define && define.amd ? define(w) : t.SecondLevelDomains = w(t) })(this, function (t) {
    var w = t && t.SecondLevelDomains, n = {
        list: {
            ac: " com gov mil net org ", ae: " ac co gov mil name net org pro sch ", af: " com edu gov net org ", al: " com edu gov mil net org ", ao: " co ed gv it og pb ", ar: " com edu gob gov int mil net org tur ", at: " ac co gv or ", au: " asn com csiro edu gov id net org ", ba: " co com edu gov mil net org rs unbi unmo unsa untz unze ",
            bb: " biz co com edu gov info net org store tv ", bh: " biz cc com edu gov info net org ", bn: " com edu gov net org ", bo: " com edu gob gov int mil net org tv ", br: " adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ", bs: " com edu gov net org ", bz: " du et om ov rg ", ca: " ab bc mb nb nf nl ns nt nu on pe qc sk yk ",
            ck: " biz co edu gen gov info net org ", cn: " ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ", co: " com edu gov mil net nom org ", cr: " ac c co ed fi go or sa ", cy: " ac biz com ekloges gov ltd name net org parliament press pro tm ", "do": " art com edu gob gov mil net org sld web ", dz: " art asso com edu gov net org pol ", ec: " com edu fin gov info med mil net org pro ", eg: " com edu eun gov mil name net org sci ", er: " com edu gov ind mil net org rochest w ",
            es: " com edu gob nom org ", et: " biz com edu gov info name net org ", fj: " ac biz com info mil name net org pro ", fk: " ac co gov net nom org ", fr: " asso com f gouv nom prd presse tm ", gg: " co net org ", gh: " com edu gov mil org ", gn: " ac com gov net org ", gr: " com edu gov mil net org ", gt: " com edu gob ind mil net org ", gu: " com edu gov net org ", hk: " com edu gov idv net org ", hu: " 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ",
            id: " ac co go mil net or sch web ", il: " ac co gov idf k12 muni net org ", "in": " ac co edu ernet firm gen gov i ind mil net nic org res ", iq: " com edu gov i mil net org ", ir: " ac co dnssec gov i id net org sch ", it: " edu gov ", je: " co net org ", jo: " com edu gov mil name net org sch ", jp: " ac ad co ed go gr lg ne or ", ke: " ac co go info me mobi ne or sc ", kh: " com edu gov mil net org per ", ki: " biz com de edu gov info mob net org tel ", km: " asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ",
            kn: " edu gov net org ", kr: " ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ", kw: " com edu gov net org ", ky: " com edu gov net org ", kz: " com edu gov mil net org ", lb: " com edu gov net org ", lk: " assn com edu gov grp hotel int ltd net ngo org sch soc web ", lr: " com edu gov net org ", lv: " asn com conf edu gov id mil net org ", ly: " com edu gov id med net org plc sch ", ma: " ac co gov m net org press ",
            mc: " asso tm ", me: " ac co edu gov its net org priv ", mg: " com edu gov mil nom org prd tm ", mk: " com edu gov inf name net org pro ", ml: " com edu gov net org presse ", mn: " edu gov org ", mo: " com edu gov net org ", mt: " com edu gov net org ", mv: " aero biz com coop edu gov info int mil museum name net org pro ", mw: " ac co com coop edu gov int museum net org ", mx: " com edu gob net org ", my: " com edu gov mil name net org sch ", nf: " arts com firm info net other per rec store web ", ng: " biz com edu gov mil mobi name net org sch ",
            ni: " ac co com edu gob mil net nom org ", np: " com edu gov mil net org ", nr: " biz com edu gov info net org ", om: " ac biz co com edu gov med mil museum net org pro sch ", pe: " com edu gob mil net nom org sld ", ph: " com edu gov i mil net ngo org ", pk: " biz com edu fam gob gok gon gop gos gov net org web ", pl: " art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ", pr: " ac biz com edu est gov info isla name net org pro prof ",
            ps: " com edu gov net org plo sec ", pw: " belau co ed go ne or ", ro: " arts com firm info nom nt org rec store tm www ", rs: " ac co edu gov in org ", sb: " com edu gov net org ", sc: " com edu gov net org ", sh: " co com edu gov net nom org ", sl: " com edu gov net org ", st: " co com consulado edu embaixada gov mil net org principe saotome store ", sv: " com edu gob org red ", sz: " ac co org ", tr: " av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ", tt: " aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ",
            tw: " club com ebiz edu game gov idv mil net org ", mu: " ac co com gov net or org ", mz: " ac co edu gov org ", na: " co com ", nz: " ac co cri geek gen govt health iwi maori mil net org parliament school ", pa: " abo ac com edu gob ing med net nom org sld ", pt: " com edu gov int net nome org publ ", py: " com edu gov mil net org ", qa: " com edu gov mil net org ", re: " asso com nom ", ru: " ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ",
            rw: " ac co com edu gouv gov int mil net ", sa: " com edu gov med net org pub sch ", sd: " com edu gov info med net org tv ", se: " a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ", sg: " com edu gov idn net org per ", sn: " art com edu gouv org perso univ ", sy: " com edu gov mil net news org ", th: " ac co go in mi net or ", tj: " ac biz co com edu go gov info int mil name net nic org test web ", tn: " agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ",
            tz: " ac co go ne or ", ua: " biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ", ug: " ac co go ne or org sc ", uk: " ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ",
            us: " dni fed isa kids nsn ", uy: " com edu gub mil net org ", ve: " co com edu gob info mil net org web ", vi: " co com k12 net org ", vn: " ac biz com edu gov health info int name net org pro ", ye: " co com gov ltd me net org plc ", yu: " ac co edu gov org ", za: " ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ", zm: " ac co com edu gov net org sch ", com: "ar br cn de eu gb gr hu jpn kr no qc ru sa se uk us uy za ", net: "gb jp se uk ",
            org: "ae", de: "com "
        }, has: function (k) { var d = k.lastIndexOf("."); if (0 >= d || d >= k.length - 1) return !1; var m = k.lastIndexOf(".", d - 1); if (0 >= m || m >= d - 1) return !1; var x = n.list[k.slice(d + 1)]; return x ? 0 <= x.indexOf(" " + k.slice(m + 1, d) + " ") : !1 }, is: function (k) { var d = k.lastIndexOf("."); if (0 >= d || d >= k.length - 1 || 0 <= k.lastIndexOf(".", d - 1)) return !1; var m = n.list[k.slice(d + 1)]; return m ? 0 <= m.indexOf(" " + k.slice(0, d) + " ") : !1 }, get: function (k) {
            var d = k.lastIndexOf("."); if (0 >= d || d >= k.length - 1) return null; var m = k.lastIndexOf(".", d - 1);
            if (0 >= m || m >= d - 1) return null; var x = n.list[k.slice(d + 1)]; return !x || 0 > x.indexOf(" " + k.slice(m + 1, d) + " ") ? null : k.slice(m + 1)
        }, noConflict: function () { t.SecondLevelDomains === this && (t.SecondLevelDomains = w); return this }
    }; return n
});
(function (t, w) { "object" === typeof module && module.exports ? module.exports = w(require("./punycode"), require("./IPv6"), require("./SecondLevelDomains")) : "function" === typeof define && define.amd ? define(["./punycode", "./IPv6", "./SecondLevelDomains"], w) : t.URI = w(t.punycode, t.IPv6, t.SecondLevelDomains, t) })(this, function (t, w, n, k) {
    function d(a, b) {
        var c = 1 <= arguments.length, e = 2 <= arguments.length; if (!(this instanceof d)) return c ? e ? new d(a, b) : new d(a) : new d; if (void 0 === a) {
            if (c) throw new TypeError("undefined is not a valid argument for URI");
            a = "undefined" !== typeof location ? location.href + "" : ""
        } if (null === a && c) throw new TypeError("null is not a valid argument for URI"); this.href(a); return void 0 !== b ? this.absoluteTo(b) : this
    } function m(a) { return a.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1") } function x(a) { return void 0 === a ? "Undefined" : String(Object.prototype.toString.call(a)).slice(8, -1) } function v(a) { return "Array" === x(a) } function J(a, b) {
        var c = {}, e; if ("RegExp" === x(b)) c = null; else if (v(b)) { var f = 0; for (e = b.length; f < e; f++)c[b[f]] = !0 } else c[b] =
            !0; f = 0; for (e = a.length; f < e; f++)if (c && void 0 !== c[a[f]] || !c && b.test(a[f])) a.splice(f, 1), e--, f--; return a
    } function E(a, b) { var c; if (v(b)) { var e = 0; for (c = b.length; e < c; e++)if (!E(a, b[e])) return !1; return !0 } var f = x(b); e = 0; for (c = a.length; e < c; e++)if ("RegExp" === f) { if ("string" === typeof a[e] && a[e].match(b)) return !0 } else if (a[e] === b) return !0; return !1 } function M(a, b) { if (!v(a) || !v(b) || a.length !== b.length) return !1; a.sort(); b.sort(); for (var c = 0, e = a.length; c < e; c++)if (a[c] !== b[c]) return !1; return !0 } function H(a) {
        return a.replace(/^\/+|\/+$/g,
            "")
    } function P(a) { return escape(a) } function N(a) { return encodeURIComponent(a).replace(/[!'()*]/g, P).replace(/\*/g, "%2A") } function L(a) { return function (b, c) { if (void 0 === b) return this._parts[a] || ""; this._parts[a] = b || null; this.build(!c); return this } } function O(a, b) { return function (c, e) { if (void 0 === c) return this._parts[a] || ""; null !== c && (c += "", c.charAt(0) === b && (c = c.substring(1))); this._parts[a] = c; this.build(!e); return this } } var F = k && k.URI; d.version = "1.19.6"; var g = d.prototype, B = Object.prototype.hasOwnProperty;
    d._parts = function () { return { protocol: null, username: null, password: null, hostname: null, urn: null, port: null, path: null, query: null, fragment: null, preventInvalidHostname: d.preventInvalidHostname, duplicateQueryParameters: d.duplicateQueryParameters, escapeQuerySpace: d.escapeQuerySpace } }; d.preventInvalidHostname = !1; d.duplicateQueryParameters = !1; d.escapeQuerySpace = !0; d.protocol_expression = /^[a-z][a-z0-9.+-]*$/i; d.idn_expression = /[^a-z0-9\._-]/i; d.punycode_expression = /(xn--)/i; d.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    d.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
    d.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u2018\u2019]))/ig; d.findUri = { start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi, end: /[\s\r\n]|$/, trim: /[`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u201e\u2018\u2019]+$/, parens: /(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g }; d.defaultPorts = {
        http: "80", https: "443", ftp: "21",
        gopher: "70", ws: "80", wss: "443"
    }; d.hostProtocols = ["http", "https"]; d.invalid_hostname_characters = /[^a-zA-Z0-9\.\-:_]/; d.domAttributes = { a: "href", blockquote: "cite", link: "href", base: "href", script: "src", form: "action", img: "src", area: "href", iframe: "src", embed: "src", source: "src", track: "src", input: "src", audio: "src", video: "src" }; d.getDomAttribute = function (a) { if (a && a.nodeName) { var b = a.nodeName.toLowerCase(); if ("input" !== b || "image" === a.type) return d.domAttributes[b] } }; d.encode = N; d.decode = decodeURIComponent; d.iso8859 =
        function () { d.encode = escape; d.decode = unescape }; d.unicode = function () { d.encode = N; d.decode = decodeURIComponent }; d.characters = {
            pathname: { encode: { expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig, map: { "%24": "$", "%26": "&", "%2B": "+", "%2C": ",", "%3B": ";", "%3D": "=", "%3A": ":", "%40": "@" } }, decode: { expression: /[\/\?#]/g, map: { "/": "%2F", "?": "%3F", "#": "%23" } } }, reserved: {
                encode: {
                    expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig, map: {
                        "%3A": ":", "%2F": "/", "%3F": "?", "%23": "#", "%5B": "[", "%5D": "]", "%40": "@",
                        "%21": "!", "%24": "$", "%26": "&", "%27": "'", "%28": "(", "%29": ")", "%2A": "*", "%2B": "+", "%2C": ",", "%3B": ";", "%3D": "="
                    }
                }
            }, urnpath: { encode: { expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig, map: { "%21": "!", "%24": "$", "%27": "'", "%28": "(", "%29": ")", "%2A": "*", "%2B": "+", "%2C": ",", "%3B": ";", "%3D": "=", "%40": "@" } }, decode: { expression: /[\/\?#:]/g, map: { "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" } } }
        }; d.encodeQuery = function (a, b) { var c = d.encode(a + ""); void 0 === b && (b = d.escapeQuerySpace); return b ? c.replace(/%20/g, "+") : c }; d.decodeQuery =
            function (a, b) { a += ""; void 0 === b && (b = d.escapeQuerySpace); try { return d.decode(b ? a.replace(/\+/g, "%20") : a) } catch (c) { return a } }; var D = { encode: "encode", decode: "decode" }, l, p = function (a, b) { return function (c) { try { return d[b](c + "").replace(d.characters[a][b].expression, function (e) { return d.characters[a][b].map[e] }) } catch (e) { return c } } }; for (l in D) d[l + "PathSegment"] = p("pathname", D[l]), d[l + "UrnPathSegment"] = p("urnpath", D[l]); D = function (a, b, c) {
                return function (e) {
                    var f = c ? function (y) { return d[b](d[c](y)) } : d[b];
                    e = (e + "").split(a); for (var h = 0, r = e.length; h < r; h++)e[h] = f(e[h]); return e.join(a)
                }
            }; d.decodePath = D("/", "decodePathSegment"); d.decodeUrnPath = D(":", "decodeUrnPathSegment"); d.recodePath = D("/", "encodePathSegment", "decode"); d.recodeUrnPath = D(":", "encodeUrnPathSegment", "decode"); d.encodeReserved = p("reserved", "encode"); d.parse = function (a, b) {
                b || (b = { preventInvalidHostname: d.preventInvalidHostname }); var c = a.indexOf("#"); -1 < c && (b.fragment = a.substring(c + 1) || null, a = a.substring(0, c)); c = a.indexOf("?"); -1 < c && (b.query =
                    a.substring(c + 1) || null, a = a.substring(0, c)); "//" === a.substring(0, 2) ? (b.protocol = null, a = a.substring(2), a = d.parseAuthority(a, b)) : (c = a.indexOf(":"), -1 < c && (b.protocol = a.substring(0, c) || null, b.protocol && !b.protocol.match(d.protocol_expression) ? b.protocol = void 0 : "//" === a.substring(c + 1, c + 3).replace(/\\/g, "/") ? (a = a.substring(c + 3), a = d.parseAuthority(a, b)) : (a = a.substring(c + 1), b.urn = !0))); b.path = a; return b
            }; d.parseHost = function (a, b) {
                a || (a = ""); a = a.replace(/\\/g, "/"); var c = a.indexOf("/"); -1 === c && (c = a.length); if ("[" ===
                    a.charAt(0)) { var e = a.indexOf("]"); b.hostname = a.substring(1, e) || null; b.port = a.substring(e + 2, c) || null; "/" === b.port && (b.port = null) } else { var f = a.indexOf(":"); e = a.indexOf("/"); f = a.indexOf(":", f + 1); -1 !== f && (-1 === e || f < e) ? (b.hostname = a.substring(0, c) || null, b.port = null) : (e = a.substring(0, c).split(":"), b.hostname = e[0] || null, b.port = e[1] || null) } b.hostname && "/" !== a.substring(c).charAt(0) && (c++, a = "/" + a); b.preventInvalidHostname && d.ensureValidHostname(b.hostname, b.protocol); b.port && d.ensureValidPort(b.port); return a.substring(c) ||
                        "/"
            }; d.parseAuthority = function (a, b) { a = d.parseUserinfo(a, b); return d.parseHost(a, b) }; d.parseUserinfo = function (a, b) { var c = a; -1 !== a.indexOf("\\") && (a = a.replace(/\\/g, "/")); var e = a.indexOf("/"), f = a.lastIndexOf("@", -1 < e ? e : a.length - 1); -1 < f && (-1 === e || f < e) ? (e = a.substring(0, f).split(":"), b.username = e[0] ? d.decode(e[0]) : null, e.shift(), b.password = e[0] ? d.decode(e.join(":")) : null, a = c.substring(f + 1)) : (b.username = null, b.password = null); return a }; d.parseQuery = function (a, b) {
                if (!a) return {}; a = a.replace(/&+/g, "&").replace(/^\?*&*|&+$/g,
                    ""); if (!a) return {}; for (var c = {}, e = a.split("&"), f = e.length, h, r, y = 0; y < f; y++)if (h = e[y].split("="), r = d.decodeQuery(h.shift(), b), h = h.length ? d.decodeQuery(h.join("="), b) : null, B.call(c, r)) { if ("string" === typeof c[r] || null === c[r]) c[r] = [c[r]]; c[r].push(h) } else c[r] = h; return c
            }; d.build = function (a) {
                var b = "", c = !1; a.protocol && (b += a.protocol + ":"); a.urn || !b && !a.hostname || (b += "//", c = !0); b += d.buildAuthority(a) || ""; "string" === typeof a.path && ("/" !== a.path.charAt(0) && c && (b += "/"), b += a.path); "string" === typeof a.query &&
                    a.query && (b += "?" + a.query); "string" === typeof a.fragment && a.fragment && (b += "#" + a.fragment); return b
            }; d.buildHost = function (a) { var b = ""; if (a.hostname) b = d.ip6_expression.test(a.hostname) ? b + ("[" + a.hostname + "]") : b + a.hostname; else return ""; a.port && (b += ":" + a.port); return b }; d.buildAuthority = function (a) { return d.buildUserinfo(a) + d.buildHost(a) }; d.buildUserinfo = function (a) { var b = ""; a.username && (b += d.encode(a.username)); a.password && (b += ":" + d.encode(a.password)); b && (b += "@"); return b }; d.buildQuery = function (a, b,
                c) { var e = "", f, h; for (f in a) if (B.call(a, f)) if (v(a[f])) { var r = {}; var y = 0; for (h = a[f].length; y < h; y++)void 0 !== a[f][y] && void 0 === r[a[f][y] + ""] && (e += "&" + d.buildQueryParameter(f, a[f][y], c), !0 !== b && (r[a[f][y] + ""] = !0)) } else void 0 !== a[f] && (e += "&" + d.buildQueryParameter(f, a[f], c)); return e.substring(1) }; d.buildQueryParameter = function (a, b, c) { return d.encodeQuery(a, c) + (null !== b ? "=" + d.encodeQuery(b, c) : "") }; d.addQuery = function (a, b, c) {
                    if ("object" === typeof b) for (var e in b) B.call(b, e) && d.addQuery(a, e, b[e]); else if ("string" ===
                        typeof b) void 0 === a[b] ? a[b] = c : ("string" === typeof a[b] && (a[b] = [a[b]]), v(c) || (c = [c]), a[b] = (a[b] || []).concat(c)); else throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
                }; d.setQuery = function (a, b, c) { if ("object" === typeof b) for (var e in b) B.call(b, e) && d.setQuery(a, e, b[e]); else if ("string" === typeof b) a[b] = void 0 === c ? null : c; else throw new TypeError("URI.setQuery() accepts an object, string as the name parameter"); }; d.removeQuery = function (a, b, c) {
                    var e; if (v(b)) for (c = 0, e = b.length; c <
                        e; c++)a[b[c]] = void 0; else if ("RegExp" === x(b)) for (e in a) b.test(e) && (a[e] = void 0); else if ("object" === typeof b) for (e in b) B.call(b, e) && d.removeQuery(a, e, b[e]); else if ("string" === typeof b) void 0 !== c ? "RegExp" === x(c) ? !v(a[b]) && c.test(a[b]) ? a[b] = void 0 : a[b] = J(a[b], c) : a[b] !== String(c) || v(c) && 1 !== c.length ? v(a[b]) && (a[b] = J(a[b], c)) : a[b] = void 0 : a[b] = void 0; else throw new TypeError("URI.removeQuery() accepts an object, string, RegExp as the first parameter");
                }; d.hasQuery = function (a, b, c, e) {
                    switch (x(b)) {
                        case "String": break;
                        case "RegExp": for (var f in a) if (B.call(a, f) && b.test(f) && (void 0 === c || d.hasQuery(a, f, c))) return !0; return !1; case "Object": for (var h in b) if (B.call(b, h) && !d.hasQuery(a, h, b[h])) return !1; return !0; default: throw new TypeError("URI.hasQuery() accepts a string, regular expression or object as the name parameter");
                    }switch (x(c)) {
                        case "Undefined": return b in a; case "Boolean": return a = !(v(a[b]) ? !a[b].length : !a[b]), c === a; case "Function": return !!c(a[b], b, a); case "Array": return v(a[b]) ? (e ? E : M)(a[b], c) : !1; case "RegExp": return v(a[b]) ?
                            e ? E(a[b], c) : !1 : !(!a[b] || !a[b].match(c)); case "Number": c = String(c); case "String": return v(a[b]) ? e ? E(a[b], c) : !1 : a[b] === c; default: throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter");
                    }
                }; d.joinPaths = function () {
                    for (var a = [], b = [], c = 0, e = 0; e < arguments.length; e++) { var f = new d(arguments[e]); a.push(f); f = f.segment(); for (var h = 0; h < f.length; h++)"string" === typeof f[h] && b.push(f[h]), f[h] && c++ } if (!b.length || !c) return new d(""); b = (new d("")).segment(b);
                    "" !== a[0].path() && "/" !== a[0].path().slice(0, 1) || b.path("/" + b.path()); return b.normalize()
                }; d.commonPath = function (a, b) { var c = Math.min(a.length, b.length), e; for (e = 0; e < c; e++)if (a.charAt(e) !== b.charAt(e)) { e--; break } if (1 > e) return a.charAt(0) === b.charAt(0) && "/" === a.charAt(0) ? "/" : ""; if ("/" !== a.charAt(e) || "/" !== b.charAt(e)) e = a.substring(0, e).lastIndexOf("/"); return a.substring(0, e + 1) }; d.withinString = function (a, b, c) {
                    c || (c = {}); var e = c.start || d.findUri.start, f = c.end || d.findUri.end, h = c.trim || d.findUri.trim, r =
                        c.parens || d.findUri.parens, y = /[a-z0-9-]=["']?$/i; for (e.lastIndex = 0; ;) {
                            var A = e.exec(a); if (!A) break; var K = A.index; if (c.ignoreHtml) { var G = a.slice(Math.max(K - 3, 0), K); if (G && y.test(G)) continue } var I = K + a.slice(K).search(f); G = a.slice(K, I); for (I = -1; ;) { var Q = r.exec(G); if (!Q) break; I = Math.max(I, Q.index + Q[0].length) } G = -1 < I ? G.slice(0, I) + G.slice(I).replace(h, "") : G.replace(h, ""); G.length <= A[0].length || c.ignore && c.ignore.test(G) || (I = K + G.length, A = b(G, K, I, a), void 0 === A ? e.lastIndex = I : (A = String(A), a = a.slice(0, K) + A + a.slice(I),
                                e.lastIndex = K + A.length))
                        } e.lastIndex = 0; return a
                }; d.ensureValidHostname = function (a, b) {
                    var c = !!a, e = !1; b && (e = E(d.hostProtocols, b)); if (e && !c) throw new TypeError("Hostname cannot be empty, if protocol is " + b); if (a && a.match(d.invalid_hostname_characters)) {
                        if (!t) throw new TypeError('Hostname "' + a + '" contains characters other than [A-Z0-9.-:_] and Punycode.js is not available'); if (t.toASCII(a).match(d.invalid_hostname_characters)) throw new TypeError('Hostname "' + a + '" contains characters other than [A-Z0-9.-:_]');
                    }
                }; d.ensureValidPort = function (a) { if (a) { var b = Number(a); if (!(/^[0-9]+$/.test(b) && 0 < b && 65536 > b)) throw new TypeError('Port "' + a + '" is not a valid port'); } }; d.noConflict = function (a) {
                    if (a) return a = { URI: this.noConflict() }, k.URITemplate && "function" === typeof k.URITemplate.noConflict && (a.URITemplate = k.URITemplate.noConflict()), k.IPv6 && "function" === typeof k.IPv6.noConflict && (a.IPv6 = k.IPv6.noConflict()), k.SecondLevelDomains && "function" === typeof k.SecondLevelDomains.noConflict && (a.SecondLevelDomains = k.SecondLevelDomains.noConflict()),
                        a; k.URI === this && (k.URI = F); return this
                }; g.build = function (a) { if (!0 === a) this._deferred_build = !0; else if (void 0 === a || this._deferred_build) this._string = d.build(this._parts), this._deferred_build = !1; return this }; g.clone = function () { return new d(this) }; g.valueOf = g.toString = function () { return this.build(!1)._string }; g.protocol = L("protocol"); g.username = L("username"); g.password = L("password"); g.hostname = L("hostname"); g.port = L("port"); g.query = O("query", "?"); g.fragment = O("fragment", "#"); g.search = function (a, b) {
                    var c =
                        this.query(a, b); return "string" === typeof c && c.length ? "?" + c : c
                }; g.hash = function (a, b) { var c = this.fragment(a, b); return "string" === typeof c && c.length ? "#" + c : c }; g.pathname = function (a, b) { if (void 0 === a || !0 === a) { var c = this._parts.path || (this._parts.hostname ? "/" : ""); return a ? (this._parts.urn ? d.decodeUrnPath : d.decodePath)(c) : c } this._parts.path = this._parts.urn ? a ? d.recodeUrnPath(a) : "" : a ? d.recodePath(a) : "/"; this.build(!b); return this }; g.path = g.pathname; g.href = function (a, b) {
                    var c; if (void 0 === a) return this.toString();
                    this._string = ""; this._parts = d._parts(); var e = a instanceof d, f = "object" === typeof a && (a.hostname || a.path || a.pathname); a.nodeName && (f = d.getDomAttribute(a), a = a[f] || "", f = !1); !e && f && void 0 !== a.pathname && (a = a.toString()); if ("string" === typeof a || a instanceof String) this._parts = d.parse(String(a), this._parts); else if (e || f) { e = e ? a._parts : a; for (c in e) "query" !== c && B.call(this._parts, c) && (this._parts[c] = e[c]); e.query && this.query(e.query, !1) } else throw new TypeError("invalid input"); this.build(!b); return this
                };
    g.is = function (a) {
        var b = !1, c = !1, e = !1, f = !1, h = !1, r = !1, y = !1, A = !this._parts.urn; this._parts.hostname && (A = !1, c = d.ip4_expression.test(this._parts.hostname), e = d.ip6_expression.test(this._parts.hostname), b = c || e, h = (f = !b) && n && n.has(this._parts.hostname), r = f && d.idn_expression.test(this._parts.hostname), y = f && d.punycode_expression.test(this._parts.hostname)); switch (a.toLowerCase()) {
            case "relative": return A; case "absolute": return !A; case "domain": case "name": return f; case "sld": return h; case "ip": return b; case "ip4": case "ipv4": case "inet4": return c;
            case "ip6": case "ipv6": case "inet6": return e; case "idn": return r; case "url": return !this._parts.urn; case "urn": return !!this._parts.urn; case "punycode": return y
        }return null
    }; var u = g.protocol, q = g.port, z = g.hostname; g.protocol = function (a, b) { if (a && (a = a.replace(/:(\/\/)?$/, ""), !a.match(d.protocol_expression))) throw new TypeError('Protocol "' + a + "\" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]"); return u.call(this, a, b) }; g.scheme = g.protocol; g.port = function (a, b) {
        if (this._parts.urn) return void 0 ===
            a ? "" : this; void 0 !== a && (0 === a && (a = null), a && (a += "", ":" === a.charAt(0) && (a = a.substring(1)), d.ensureValidPort(a))); return q.call(this, a, b)
    }; g.hostname = function (a, b) {
        if (this._parts.urn) return void 0 === a ? "" : this; if (void 0 !== a) { var c = { preventInvalidHostname: this._parts.preventInvalidHostname }; if ("/" !== d.parseHost(a, c)) throw new TypeError('Hostname "' + a + '" contains characters other than [A-Z0-9.-]'); a = c.hostname; this._parts.preventInvalidHostname && d.ensureValidHostname(a, this._parts.protocol) } return z.call(this,
            a, b)
    }; g.origin = function (a, b) { if (this._parts.urn) return void 0 === a ? "" : this; if (void 0 === a) { var c = this.protocol(); return this.authority() ? (c ? c + "://" : "") + this.authority() : "" } c = d(a); this.protocol(c.protocol()).authority(c.authority()).build(!b); return this }; g.host = function (a, b) {
        if (this._parts.urn) return void 0 === a ? "" : this; if (void 0 === a) return this._parts.hostname ? d.buildHost(this._parts) : ""; if ("/" !== d.parseHost(a, this._parts)) throw new TypeError('Hostname "' + a + '" contains characters other than [A-Z0-9.-]');
        this.build(!b); return this
    }; g.authority = function (a, b) { if (this._parts.urn) return void 0 === a ? "" : this; if (void 0 === a) return this._parts.hostname ? d.buildAuthority(this._parts) : ""; if ("/" !== d.parseAuthority(a, this._parts)) throw new TypeError('Hostname "' + a + '" contains characters other than [A-Z0-9.-]'); this.build(!b); return this }; g.userinfo = function (a, b) {
        if (this._parts.urn) return void 0 === a ? "" : this; if (void 0 === a) { var c = d.buildUserinfo(this._parts); return c ? c.substring(0, c.length - 1) : c } "@" !== a[a.length - 1] &&
            (a += "@"); d.parseUserinfo(a, this._parts); this.build(!b); return this
    }; g.resource = function (a, b) { if (void 0 === a) return this.path() + this.search() + this.hash(); var c = d.parse(a); this._parts.path = c.path; this._parts.query = c.query; this._parts.fragment = c.fragment; this.build(!b); return this }; g.subdomain = function (a, b) {
        if (this._parts.urn) return void 0 === a ? "" : this; if (void 0 === a) {
            if (!this._parts.hostname || this.is("IP")) return ""; var c = this._parts.hostname.length - this.domain().length - 1; return this._parts.hostname.substring(0,
                c) || ""
        } c = this._parts.hostname.length - this.domain().length; c = this._parts.hostname.substring(0, c); c = new RegExp("^" + m(c)); a && "." !== a.charAt(a.length - 1) && (a += "."); if (-1 !== a.indexOf(":")) throw new TypeError("Domains cannot contain colons"); a && d.ensureValidHostname(a, this._parts.protocol); this._parts.hostname = this._parts.hostname.replace(c, a); this.build(!b); return this
    }; g.domain = function (a, b) {
        if (this._parts.urn) return void 0 === a ? "" : this; "boolean" === typeof a && (b = a, a = void 0); if (void 0 === a) {
            if (!this._parts.hostname ||
                this.is("IP")) return ""; var c = this._parts.hostname.match(/\./g); if (c && 2 > c.length) return this._parts.hostname; c = this._parts.hostname.length - this.tld(b).length - 1; c = this._parts.hostname.lastIndexOf(".", c - 1) + 1; return this._parts.hostname.substring(c) || ""
        } if (!a) throw new TypeError("cannot set domain empty"); if (-1 !== a.indexOf(":")) throw new TypeError("Domains cannot contain colons"); d.ensureValidHostname(a, this._parts.protocol); !this._parts.hostname || this.is("IP") ? this._parts.hostname = a : (c = new RegExp(m(this.domain()) +
            "$"), this._parts.hostname = this._parts.hostname.replace(c, a)); this.build(!b); return this
    }; g.tld = function (a, b) {
        if (this._parts.urn) return void 0 === a ? "" : this; "boolean" === typeof a && (b = a, a = void 0); if (void 0 === a) { if (!this._parts.hostname || this.is("IP")) return ""; var c = this._parts.hostname.lastIndexOf("."); c = this._parts.hostname.substring(c + 1); return !0 !== b && n && n.list[c.toLowerCase()] ? n.get(this._parts.hostname) || c : c } if (a) if (a.match(/[^a-zA-Z0-9-]/)) if (n && n.is(a)) c = new RegExp(m(this.tld()) + "$"), this._parts.hostname =
            this._parts.hostname.replace(c, a); else throw new TypeError('TLD "' + a + '" contains characters other than [A-Z0-9]'); else { if (!this._parts.hostname || this.is("IP")) throw new ReferenceError("cannot set TLD on non-domain host"); c = new RegExp(m(this.tld()) + "$"); this._parts.hostname = this._parts.hostname.replace(c, a) } else throw new TypeError("cannot set TLD empty"); this.build(!b); return this
    }; g.directory = function (a, b) {
        if (this._parts.urn) return void 0 === a ? "" : this; if (void 0 === a || !0 === a) {
            if (!this._parts.path &&
                !this._parts.hostname) return ""; if ("/" === this._parts.path) return "/"; var c = this._parts.path.length - this.filename().length - 1; c = this._parts.path.substring(0, c) || (this._parts.hostname ? "/" : ""); return a ? d.decodePath(c) : c
        } c = this._parts.path.length - this.filename().length; c = this._parts.path.substring(0, c); c = new RegExp("^" + m(c)); this.is("relative") || (a || (a = "/"), "/" !== a.charAt(0) && (a = "/" + a)); a && "/" !== a.charAt(a.length - 1) && (a += "/"); a = d.recodePath(a); this._parts.path = this._parts.path.replace(c, a); this.build(!b);
        return this
    }; g.filename = function (a, b) { if (this._parts.urn) return void 0 === a ? "" : this; if ("string" !== typeof a) { if (!this._parts.path || "/" === this._parts.path) return ""; var c = this._parts.path.lastIndexOf("/"); c = this._parts.path.substring(c + 1); return a ? d.decodePathSegment(c) : c } c = !1; "/" === a.charAt(0) && (a = a.substring(1)); a.match(/\.?\//) && (c = !0); var e = new RegExp(m(this.filename()) + "$"); a = d.recodePath(a); this._parts.path = this._parts.path.replace(e, a); c ? this.normalizePath(b) : this.build(!b); return this }; g.suffix =
        function (a, b) {
            if (this._parts.urn) return void 0 === a ? "" : this; if (void 0 === a || !0 === a) { if (!this._parts.path || "/" === this._parts.path) return ""; var c = this.filename(), e = c.lastIndexOf("."); if (-1 === e) return ""; c = c.substring(e + 1); c = /^[a-z0-9%]+$/i.test(c) ? c : ""; return a ? d.decodePathSegment(c) : c } "." === a.charAt(0) && (a = a.substring(1)); if (c = this.suffix()) e = a ? new RegExp(m(c) + "$") : new RegExp(m("." + c) + "$"); else { if (!a) return this; this._parts.path += "." + d.recodePath(a) } e && (a = d.recodePath(a), this._parts.path = this._parts.path.replace(e,
                a)); this.build(!b); return this
        }; g.segment = function (a, b, c) {
            var e = this._parts.urn ? ":" : "/", f = this.path(), h = "/" === f.substring(0, 1); f = f.split(e); void 0 !== a && "number" !== typeof a && (c = b, b = a, a = void 0); if (void 0 !== a && "number" !== typeof a) throw Error('Bad segment "' + a + '", must be 0-based integer'); h && f.shift(); 0 > a && (a = Math.max(f.length + a, 0)); if (void 0 === b) return void 0 === a ? f : f[a]; if (null === a || void 0 === f[a]) if (v(b)) {
                f = []; a = 0; for (var r = b.length; a < r; a++)if (b[a].length || f.length && f[f.length - 1].length) f.length && !f[f.length -
                    1].length && f.pop(), f.push(H(b[a]))
            } else { if (b || "string" === typeof b) b = H(b), "" === f[f.length - 1] ? f[f.length - 1] = b : f.push(b) } else b ? f[a] = H(b) : f.splice(a, 1); h && f.unshift(""); return this.path(f.join(e), c)
        }; g.segmentCoded = function (a, b, c) {
            var e; "number" !== typeof a && (c = b, b = a, a = void 0); if (void 0 === b) { a = this.segment(a, b, c); if (v(a)) { var f = 0; for (e = a.length; f < e; f++)a[f] = d.decode(a[f]) } else a = void 0 !== a ? d.decode(a) : void 0; return a } if (v(b)) for (f = 0, e = b.length; f < e; f++)b[f] = d.encode(b[f]); else b = "string" === typeof b || b instanceof
                String ? d.encode(b) : b; return this.segment(a, b, c)
        }; var C = g.query; g.query = function (a, b) {
            if (!0 === a) return d.parseQuery(this._parts.query, this._parts.escapeQuerySpace); if ("function" === typeof a) { var c = d.parseQuery(this._parts.query, this._parts.escapeQuerySpace), e = a.call(this, c); this._parts.query = d.buildQuery(e || c, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace); this.build(!b); return this } return void 0 !== a && "string" !== typeof a ? (this._parts.query = d.buildQuery(a, this._parts.duplicateQueryParameters,
                this._parts.escapeQuerySpace), this.build(!b), this) : C.call(this, a, b)
        }; g.setQuery = function (a, b, c) {
            var e = d.parseQuery(this._parts.query, this._parts.escapeQuerySpace); if ("string" === typeof a || a instanceof String) e[a] = void 0 !== b ? b : null; else if ("object" === typeof a) for (var f in a) B.call(a, f) && (e[f] = a[f]); else throw new TypeError("URI.addQuery() accepts an object, string as the name parameter"); this._parts.query = d.buildQuery(e, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace); "string" !== typeof a &&
                (c = b); this.build(!c); return this
        }; g.addQuery = function (a, b, c) { var e = d.parseQuery(this._parts.query, this._parts.escapeQuerySpace); d.addQuery(e, a, void 0 === b ? null : b); this._parts.query = d.buildQuery(e, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace); "string" !== typeof a && (c = b); this.build(!c); return this }; g.removeQuery = function (a, b, c) {
            var e = d.parseQuery(this._parts.query, this._parts.escapeQuerySpace); d.removeQuery(e, a, b); this._parts.query = d.buildQuery(e, this._parts.duplicateQueryParameters,
                this._parts.escapeQuerySpace); "string" !== typeof a && (c = b); this.build(!c); return this
        }; g.hasQuery = function (a, b, c) { var e = d.parseQuery(this._parts.query, this._parts.escapeQuerySpace); return d.hasQuery(e, a, b, c) }; g.setSearch = g.setQuery; g.addSearch = g.addQuery; g.removeSearch = g.removeQuery; g.hasSearch = g.hasQuery; g.normalize = function () { return this._parts.urn ? this.normalizeProtocol(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build() : this.normalizeProtocol(!1).normalizeHostname(!1).normalizePort(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build() };
    g.normalizeProtocol = function (a) { "string" === typeof this._parts.protocol && (this._parts.protocol = this._parts.protocol.toLowerCase(), this.build(!a)); return this }; g.normalizeHostname = function (a) { this._parts.hostname && (this.is("IDN") && t ? this._parts.hostname = t.toASCII(this._parts.hostname) : this.is("IPv6") && w && (this._parts.hostname = w.best(this._parts.hostname)), this._parts.hostname = this._parts.hostname.toLowerCase(), this.build(!a)); return this }; g.normalizePort = function (a) {
        "string" === typeof this._parts.protocol &&
        this._parts.port === d.defaultPorts[this._parts.protocol] && (this._parts.port = null, this.build(!a)); return this
    }; g.normalizePath = function (a) {
        var b = this._parts.path; if (!b) return this; if (this._parts.urn) return this._parts.path = d.recodeUrnPath(this._parts.path), this.build(!a), this; if ("/" === this._parts.path) return this; b = d.recodePath(b); var c = ""; if ("/" !== b.charAt(0)) { var e = !0; b = "/" + b } if ("/.." === b.slice(-3) || "/." === b.slice(-2)) b += "/"; b = b.replace(/(\/(\.\/)+)|(\/\.$)/g, "/").replace(/\/{2,}/g, "/"); e && (c = b.substring(1).match(/^(\.\.\/)+/) ||
            "") && (c = c[0]); for (; ;) { var f = b.search(/\/\.\.(\/|$)/); if (-1 === f) break; else if (0 === f) { b = b.substring(3); continue } var h = b.substring(0, f).lastIndexOf("/"); -1 === h && (h = f); b = b.substring(0, h) + b.substring(f + 3) } e && this.is("relative") && (b = c + b.substring(1)); this._parts.path = b; this.build(!a); return this
    }; g.normalizePathname = g.normalizePath; g.normalizeQuery = function (a) {
        "string" === typeof this._parts.query && (this._parts.query.length ? this.query(d.parseQuery(this._parts.query, this._parts.escapeQuerySpace)) : this._parts.query =
            null, this.build(!a)); return this
    }; g.normalizeFragment = function (a) { this._parts.fragment || (this._parts.fragment = null, this.build(!a)); return this }; g.normalizeSearch = g.normalizeQuery; g.normalizeHash = g.normalizeFragment; g.iso8859 = function () { var a = d.encode, b = d.decode; d.encode = escape; d.decode = decodeURIComponent; try { this.normalize() } finally { d.encode = a, d.decode = b } return this }; g.unicode = function () { var a = d.encode, b = d.decode; d.encode = N; d.decode = unescape; try { this.normalize() } finally { d.encode = a, d.decode = b } return this };
    g.readable = function () {
        var a = this.clone(); a.username("").password("").normalize(); var b = ""; a._parts.protocol && (b += a._parts.protocol + "://"); a._parts.hostname && (a.is("punycode") && t ? (b += t.toUnicode(a._parts.hostname), a._parts.port && (b += ":" + a._parts.port)) : b += a.host()); a._parts.hostname && a._parts.path && "/" !== a._parts.path.charAt(0) && (b += "/"); b += a.path(!0); if (a._parts.query) {
            for (var c = "", e = 0, f = a._parts.query.split("&"), h = f.length; e < h; e++) {
                var r = (f[e] || "").split("="); c += "&" + d.decodeQuery(r[0], this._parts.escapeQuerySpace).replace(/&/g,
                    "%26"); void 0 !== r[1] && (c += "=" + d.decodeQuery(r[1], this._parts.escapeQuerySpace).replace(/&/g, "%26"))
            } b += "?" + c.substring(1)
        } return b += d.decodeQuery(a.hash(), !0)
    }; g.absoluteTo = function (a) {
        var b = this.clone(), c = ["protocol", "username", "password", "hostname", "port"], e, f; if (this._parts.urn) throw Error("URNs do not have any generally defined hierarchical components"); a instanceof d || (a = new d(a)); if (b._parts.protocol) return b; b._parts.protocol = a._parts.protocol; if (this._parts.hostname) return b; for (e = 0; f = c[e]; e++)b._parts[f] =
            a._parts[f]; b._parts.path ? (".." === b._parts.path.substring(-2) && (b._parts.path += "/"), "/" !== b.path().charAt(0) && (c = (c = a.directory()) ? c : 0 === a.path().indexOf("/") ? "/" : "", b._parts.path = (c ? c + "/" : "") + b._parts.path, b.normalizePath())) : (b._parts.path = a._parts.path, b._parts.query || (b._parts.query = a._parts.query)); b.build(); return b
    }; g.relativeTo = function (a) {
        var b = this.clone().normalize(); if (b._parts.urn) throw Error("URNs do not have any generally defined hierarchical components"); a = (new d(a)).normalize(); var c =
            b._parts; var e = a._parts; var f = b.path(); a = a.path(); if ("/" !== f.charAt(0)) throw Error("URI is already relative"); if ("/" !== a.charAt(0)) throw Error("Cannot calculate a URI relative to another relative URI"); c.protocol === e.protocol && (c.protocol = null); if (c.username === e.username && c.password === e.password && null === c.protocol && null === c.username && null === c.password && c.hostname === e.hostname && c.port === e.port) c.hostname = null, c.port = null; else return b.build(); if (f === a) return c.path = "", b.build(); f = d.commonPath(f, a);
        if (!f) return b.build(); e = e.path.substring(f.length).replace(/[^\/]*$/, "").replace(/.*?\//g, "../"); c.path = e + c.path.substring(f.length) || "./"; return b.build()
    }; g.equals = function (a) {
        var b = this.clone(), c = new d(a); a = {}; var e; b.normalize(); c.normalize(); if (b.toString() === c.toString()) return !0; var f = b.query(); var h = c.query(); b.query(""); c.query(""); if (b.toString() !== c.toString() || f.length !== h.length) return !1; b = d.parseQuery(f, this._parts.escapeQuerySpace); h = d.parseQuery(h, this._parts.escapeQuerySpace); for (e in b) if (B.call(b,
            e)) { if (!v(b[e])) { if (b[e] !== h[e]) return !1 } else if (!M(b[e], h[e])) return !1; a[e] = !0 } for (e in h) if (B.call(h, e) && !a[e]) return !1; return !0
    }; g.preventInvalidHostname = function (a) { this._parts.preventInvalidHostname = !!a; return this }; g.duplicateQueryParameters = function (a) { this._parts.duplicateQueryParameters = !!a; return this }; g.escapeQuerySpace = function (a) { this._parts.escapeQuerySpace = !!a; return this }; return d
});
