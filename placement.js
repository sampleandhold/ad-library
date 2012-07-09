/* FIF library  */
window.firstAd = false;
window.compCounter = 0;
var fifIndex = 0;
var useImages = false;
//var IE = (navigator.appName=="Microsoft Internet Explorer");
var IE = window.opera ? 0 : parseInt((navigator.userAgent.match(/MSIE (\d+)/) || [0, 0])[1]);
// Called when a Rich Media IFRAME completes its loading
function adsRMIFOnL(win, doc) {
    var adFrame = win.frameElement;
    var div = adFrame.parentNode;
    if (div.childNodes.length == 1) {
        var adSpan = doc.getElementById("adSpan");
        var adDiv = doc.getElementById("adDiv");
        if (adSpan) {
            var w = adSpan.offsetWidth;
            if (IE && IE < 9) var h = adSpan.offsetHeight;
            else var h = adDiv.offsetHeight;
            // fix the subscriptiontextlink		
            if (h == 95 && w == 56) {
                adFrame.style.width = "300px";
                adFrame.style.height = "35px";
            } else {
                adFrame.style.width = w + "px";
                adFrame.style.height = h + "px";
            }
            if (((h <= 3) || (h == 13 && w == 1) || (h == 14 && w == 1) || (h == 13 && w == 0)) && div.parentNode.id != "branding-ad") {
                if (div.parentNode.className != "shopping-tools shop-on mod hidden" && div.parentNode.className != "shopping-tools shop-on mod") {
                    if (div.parentNode.className == "feature-listings" || div.parentNode.id == "content") {
                        div.style.display = "none";
                    } else {
                        div.parentNode.style.display = "none";
                    }
                }
            }
            if (div.parentNode.className == "shopping-tools shop-on mod hidden" || div.parentNode.className == "shopping-tools shop-on mod") {
                div.parentNode.className = "shopping-tools shop-on mod";
                //div.parentNode.style.display = "block";
                div.parentNode.style.height = "60px";
                adFrame.style.width = "480px";
                adFrame.style.height = "13px";
            }
        }
    }
    $('.pushdownAd, .pushdownAd div#adDiv0').show();
    if ($('.pushdownAd div#adDiv0').length == 0 || $('.pushdownAd div#adDiv0').height() < 16) {
        $('.pushdownAd').hide();
    } else {
        $('.pushdownAd #adDiv0 table').css('margin', '-2px auto 0 auto');
    }
    $('.pushdown-ad, .pushdown-ad div#adDiv0').show();
    if ($('.pushdown-ad div#adDiv0').length == 0 || $('.pushdown-ad div#adDiv0').height() < 16) {
        $('.pushdown-ad').hide();
    }
}
// Returns the URL of for a given frame. This assumes the IFRAME is in a
// div and the div has the adURL property set to the URL that the 
// IFRAME should use to load an ad in a <SCRIPT> tag. This is used by the
// addoc.htm file.
function adsGetAdURL(win) {
    var adFrame = win.frameElement;
    var div = adFrame.parentNode;
    return div.adURL;
}
// Called by the Frame source when an ad frame is created. Loads the
// ad reference document into the IFrame
function LoadFrame(win, doc) {
    var div = win.frameElement.parentNode;
    var content;
    //    content = "<html><body onload='if (parent.adsRMIFOnL) parent.adsRMIFOnL(window, document);'>";
    content = "<html><body onload='if (parent.adsRMIFOnL) setTimeout(\"parent.adsRMIFOnL(window, document)\", 100);'>";
    content += "<scr" + "ipt>inFIF=true;</scr" + "ipt>";
    content += "<scr" + "ipt>inDapIF=true;</scr" + "ipt>";
    content += "<scr" + "ipt type='text/javascript'> function closeDocument() { if(event.srcElement.readyState && event.srcElement.readyState == 'complete') { window.setTimeout(\'document.close()\', 100); } }</scr" + "ipt>";
    content += "<scr" + "ipt id='adscr' type='text/javascript' src='" + div.adURL + "'";
    content += " onreadystatechange='closeDocument();'";
    content += "></scr" + "ipt>";
    content += "</body></html>";
    // Write the content string to the document
    doc.write(content);
}

function RemoveChildren(obj) {
    var iframe = null;
    while (obj.childNodes.length > 0) {
        var child = obj.childNodes[0];
        var id = child.id;
        if (id == "adFrame") {
            iframe = child;
            iframe.src = "about:blank";
        }
        if (id) child.id = "";
        if (child.childNodes.length > 0) RemoveChildren(child);
        obj.removeChild(child);
    }
}
// Clear the contents of the Ad DIV
function ClearDiv() {
    RemoveChildren(this);
}
// Clear the ad DIV, add the IFRAME, and make the ad call
function LoadAd() {
    // First clear any existing content in the DIV
    this.ClearAd();
    // If there is no ad URL, just return 
    if (!this.adURL || this.adURL == "") return;
    if (useImages) {
        var a = document.createElement('a');
        a.href = "myclick.htm";
        var img = document.createElement('img');
        this.appendChild(a);
        a.appendChild(img);
        if (this.w > 0) img.width = this.w;
        if (this.h > 0) img.height = this.h;
        img.src = "aol.jpg";
    } else {
        // Create the ad call IFRAME
        var iframe = document.createElement('iframe');
        // Set the properties of the iframe
        iframe.id = "adFrame";
        iframe.style.height = 0;
        iframe.style.width = 0;
        iframe.marginWidth = 0;
        iframe.marginHeight = 0;
        iframe.frameBorder = 0;
        iframe.scrolling = "no";
        iframe.width = 0;
        iframe.height = 0;
        // Put the new IFRAME into the ad div
        this.appendChild(iframe);
        // If there is a page based URL, use it instead of doc.writing into the
        // IFRAME
        if (this.adPage) iframe.src = this.adPage;
        else {
            // Load the frame's content (make the ad call)
            iframe.src = "javascript:void(parent.LoadFrame(this, document))";
        }
    }
}
var adDivs;
if (!adDivs) adDivs = new Array();

function CreateAdDiv(w, h, adURL, adPage) {
    var did = "adDiv" + adDivs.length;
    // Create the ad call IFRAME
    var div = document.createElement('div');
    // Set the DIV ID
    div.id = did;
    // Setup the DIV attributes
    _SetupAdDiv(div, w, h, adURL, adPage);
    return div;
}

function SetupAdDiv(w, h, adURL, adPage) {
    var did = "adDiv" + adDivs.length;
    // Doc write the new DIV
    if (!document.getElementById(did)) {
        document.write('<div id="' + did + '"></div>');
    }
    // Get the new DIV object
    var div = document.getElementById(did);
    // Setup the DIV attributes
    _SetupAdDiv(div, w, h, adURL, adPage);
    return div;
}

function _SetupAdDiv(div, w, h, adURL, adPage) {
    if (div && div != null) {
        //console.log('fif: '+div+' '+w+' '+h+' '+adURL+' '+adPage);
        // Setup the onload handler
        div.RMIFOnLoad = adsRMIFOnL;
        div.LoadAd = LoadAd;
        div.ClearAd = ClearDiv;
        div.w = w;
        div.h = h;
        div.adURL = adURL;
        div.adPage = adPage;
        // Add the div to the array
        adDivs[adDivs.length] = div;
    }
}

function LoadAds() {
    // Clear the ads
    ClearAds();
    // Schedule the routine to actually load the ads
    setTimeout('DoLoadAds();', 100);
}

function DoLoadAds() {
    for (i = 0; i < adDivs.length; i++) {
        adDivs[i].LoadAd();
    }
}

function ClearAds() {
    for (i = 0; i < adDivs.length; i++)
    adDivs[i].ClearAd();
}

function HideAds() {
    for (i = 0; i < adDivs.length; i++)
    adDivs[i].style.display = "none";
}

function ShowAds() {
    for (i = 0; i < adDivs.length; i++)
    adDivs[i].style.display = "block";
}
/* Object Utility Functions */
_o = function (source) {
    var self = this;
    var element = source;
    self.type = typeof (element)
    self.type = self.type.toLowerCase();
    self.isA = function (instance) {
        if (typeof (instance) == "string") {
            return null;
        }
        return element instanceof instance;
    }
    self.empty = function () {
        if (
        element === "" || element === 0 || element === "0" || element === null || element === "NULL" || element === undefined || element === false) {
            return true;
        }
        if (typeof (element) === 'object') {
            var i = 0;
            for (key in element) {
                i++;
            }
            if (i === 0) {
                return true;
            }
        }
        return false;
    }
    self.contains = function (needle, cs) {
        if (self.type != "object") {
            return false;
        }
        if (needle == undefined) {
            return false;
        }
        var sens = (cs == undefined) ? false : cs;
        for (var i = 0; i < element.length; i++) {
            var k = element[i];
            k = (sens == true || typeof (k) != 'string') ? k : k.toLowerCase();
            needle = (sens == true || typeof (needle) != 'string') ? needle : needle.toLowerCase();
            if (k == needle) {
                return true;
            }
        }
        return false;
    }
    self.hasKey = function (needle, cs) {
        if (self.type != "object") {
            return false;
        }
        if (needle == undefined) {
            return false;
        }
        var sens = (cs == undefined) ? false : cs;
        for (var k in element) {
            k = (cs == true || typeof (k) != 'string') ? k : k.toLowerCase();
            key = (cs == true || typeof (needle) != 'string') ? needle : needle.toLowerCase();
            if (k == key) {
                return true;
            }
        }
        return false;
    }
    self.keyHasValue = function (needle, cs) {
        if (self.type != "object") {
            return false;
        }
        if (needle == undefined) {
            return false;
        }
        if (self.hasKey(needle) && !self.empty(needle)) {
            return true;
        }
        return false;
    }
    self.count = function () {
        if (self.type != "object") {
            return false;
        }
        if (self.isA(Array)) {
            return element.length;
        }
        var i = 0;
        for (var p in element) {
            i++;
        }
        return i;
    }
    self.debug = function () {
        console.log(element);
    }
    return self;
} /* Validation Functions */
_v = function (item) {
    var self = this;
    var element = item;
    self.type = typeof (element)
    self.type = self.type.toLowerCase();
    // for our purposes alphanumeric includes spaces
    // perhaps we need to also allow html entities
    self.alphaNum = function (args) {
        var regex = /^[0-9A-Za-z \&\;]+$/;
        if (regex.test(element)) {
            if (args.maxlength !== undefined) {
                if (element.length > args.maxlength) {
                    return false;
                }
            }
            if (args.minlength !== undefined) {
                if (element.length < args.minlength) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };
    self.notEmpty = function () {
        if (element === "" || element === null || element === undefined) {
            return false;
        }
        return true;
    };
    self.integer = function (args) {
        /*
			note that length is a character count, not a numeric test, if
			you want a numeric test, do it in your own code
		*/
        var regex = /^[0-9]+$/;
        if (regex.test(element)) {
            if (args.maxlength !== undefined) {
                if (element.length > args.maxlength) {
                    return false;
                }
            }
            if (args.minlength !== undefined) {
                if (element.length < args.minlength) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };
    self.decimal = function () {
        var regex = /^(\d|-)?(\d|,)*\.?\d*$/;
        if (regex.test(element)) {
            return true;
        }
        return false;
    };
    self.currency = function () {
        var regex = /^\$?(\d{1,3},?(\d{3},?)*\d{3}(\.\d{0,2})?|\d{1,3}(\.\d{0,2})?|\.\d{1,2}?)$/;
        if (regex.test(element)) {
            return true;
        }
        if (element === "" || element === null || element === undefined) {
            return true;
        }
        return false;
    };
    self.fromList = function (args, cs) {
        var sens = (cs == undefined) ? false : cs;
        for (var i = 0; i < args.list.length; i++) {
            var k = args.list[i];
            k = (cs == true || typeof (k) != 'string') ? k : k.toLowerCase();
            key = (cs == true || typeof (element) != 'string') ? element : element.toLowerCase();
            if (k == key) {
                return true;
            }
        }
        return false;
    };
    self.email = function () {
        var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if (regex.test(element)) {
            return true;
        }
        return false;
    }
    return self;
}
hfm = new function () {
    var self = this;
    self.isIE = /*@cc_on!@*/
    false;
    self.debug = false;
    self.urlInfo = false;
    self.version = {
        major: 1,
        minor: 5,
        release: 'd1'
    };
    self.jq = false;
    self.scr = {
        tot: {
            w: 0,
            h: 0
        },
        viz: {
            w: 0,
            h: 0
        }
    }; // screen guides
    var screen = { // the page screen
        'state': false,
        'ele': false
    }; /* load: called on page load */
    self.load = function () {
        screen.ele = self.ce('div', {
            'id': 'screen'
        });
        hfm.jq(screen.ele).css('display', 'none');
        hfm.jq('body').append(screen.ele);
        self.resize();
        hfm.jq(window).resize(self.resize);
    }
    self.resize = function () {
        // store the window size elements
        self.scr.tot.w = hfm.jq(document).width();
        self.scr.tot.h = hfm.jq(document).height();
        self.scr.viz.w = hfm.jq(window).width();
        self.scr.viz.h = hfm.jq(window).height();
        self.scr['max'] = {
            w: (self.scr.tot.w > self.scr.viz.w) ? self.scr.tot.w : self.scr.viz.w,
            h: (self.scr.tot.h > self.scr.viz.h) ? self.scr.tot.h : self.scr.viz.h
        }
        hfm.jq('#screen').width(self.scr.viz.w);
        hfm.jq('#screen').height(self.scr.viz.h);
    }
    self.screen = function (mode) {
        if (mode.toLowerCase() === 'show') {
            if (screen.state === false) {
                self.resize();
                hfm.jq(screen.ele).fadeIn('fast');
                screen.state = true;
            }
            return;
        }
        if (mode.toLowerCase() === 'hide') {
            if (screen.state === true) {
                hfm.jq(screen.ele).fadeOut('fast');
                screen.state = false;
            }
            return;
        }
    }
    self.parseXML = function (xml) {
        var output;
        if (window.ActiveXObject) {
            output = new ActiveXObject("Microsoft.XMLDOM");
            output.async = false;
            output.loadXML(xml);
        } else if (window.XMLHttpRequest) {
            output = (new DOMParser()).parseFromString(xml, "text/xml");
        }
        return output;
    };
    self.cdSlideRefresh = function (params) {
        //console.log('cdSlideRefresh');
        if (hfm.cd.page.model_frequency && hfm.cd.page.model_frequency != 'pull from make') {
            var interval = hfm.cd.page.model_frequency;
        } else if (hfm.cd.page.make_frequency && hfm.cd.page.make_frequency != '' && hfm.cd.page.model_frequency == 'pull from make') {
            var interval = hfm.cd.page.make_frequency;
        } else {
            var interval = 1;
        }
        //console.log('ad refresh interval: '+interval);
        if (_o(params).hasKey('interface')) {
            if (params.interface == 'page') {
                if (!$("#zoom-container").is(":visible")) {
                    //console.log('interface: page');
                    //console.log('integer: '+hfm.cd.page.refreshPageInt);
                    if (hfm.cd.page.refreshPageInt % interval == 0 && hfm.cd.page.refreshPageInt != 0) {
                        //console.log('commencing ad refresh page');
                        hfm.ads.refresh('base');
                    }
                    hfm.cd.page.refreshPageInt++;
                }
            }
            if (params.interface == 'zoom') {
                if ($("#zoom-container").is(":visible")) {
                    //console.log('interface: zoom');
                    //console.log('integer: '+hfm.cd.page.refreshZoomInt);
                    var noText = true;
                    var noImage = true;
                    if (hfm.cd.page.refreshZoomInt == 0) {
                        $('.main.mod .shopping-tools a:eq(1) img').each(function (index) {
                            if ($(this).attr('src').indexOf('817-grey.gif') != -1 || $(this).attr('src') == "") {
                                noImage = true;
                                return false;
                            } else {
                                noImage = false;
                            }
                        });
                        $('.main.mod div.shopping-tools a:eq(1)').each(function (index) {
                            if ($(this).text() == "") {
                                noText = true;
                            } else {
                                noText = false;
                                return false;
                            }
                        });
                        if (noText == false || noImage == false) {
                            $('.main.mod .shopping-tools').removeClass('hidden');
                        }
                    }
                    if ((hfm.cd.page.refreshZoomInt % interval == 0) || hfm.cd.page.refreshZoomInt == 0) {
                        //console.log('commencing ad refresh zoom');
                        hfm.ads.refresh('zoom');
                    }
                    hfm.cd.page.refreshZoomInt++;
                }
            }
        }
    };
    self.ce = function (tag, params) {
        if (_o(tag).empty()) {
            return false;
        }
        var ele = document.createElement(tag);
        if (!_o(params).empty()) {
            for (var iden in params) {
                switch (iden) {
                case 'id':
                    ele.id = params[iden];
                    break;
                case 'style':
                    hfm.jq(ele).addClass(params[iden]);
                    break;
                case 'html':
                    hfm.jq(ele).html(params[iden]);
                    break;
                default:
                    hfm.jq(ele).attr(iden, params[iden]);
                    break;
                }
            }
        }
        return ele;
    };
    self.log = function () {
        if (hfm.debug && typeof (window.console) == 'object') {
            for (var i = 0; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    };
    self.info = function (object) {
        if (hfm.debug && typeof (window.console) == 'object') {
            if (typeof (object) != 'object') {
                return false;
            }
            for (var k in object) {
                console.log(k, object[k]);
            }
        }
    }

    function parseURL() {
        var brandMap = {
            'el': 'elle',
            'cdnew': 'caranddriver',
            'cd': 'caranddriver',
            'rtnew': 'roadandtrack',
            'rt': 'roadandtrack',
            'wd': 'womansday'
        };
        var path = window.location.pathname.split("/");
        if (path[0] == "") {
            path.shift();
        }
        var l = path.length - 1;
        if (path[l] == "") {
            path.pop();
        }
        var qs = window.location.search.replace('?', '').split('&');
        var query = {};
        for (var i = 0; i < qs.length; i++) {
            var s = qs[i].split('=');
            if (s.length == 2) {
                var k = unescape(s[0]);
                query[k] = unescape(s[1]);
            }
        }
        var hostInfo = window.location.host.split('.');
        var domain = hostInfo[(hostInfo.length - 2)];
        var env = 'production';
        var subsite = hostInfo[0]
        if (domain == 'hfmus' || domain == 'hfmdigital') {
            if (subsite.indexOf('-') > 0) {
                env = subsite.split('-')[1];
                subsite = subsite.split('-')[0];
                var brand = brandMap[(hostInfo[1])];
            } else {
                env = subsite;
                subsite = 'www';
                var brand = brandMap[(hostInfo[1])];
            }
        } else {
            var brand = domain;
        }
        var data = {
            'protocol': window.location.protocol,
            'host': window.location.host,
            'path': path,
            'channel': path[0],
            'subchannel': path[1],
            'query': query,
            'brand': brand,
            'subsite': subsite,
            'env': env
        }
        return data;
    }

    function init() {
        self.urlInfo = parseURL();
        if (window.$ != undefined) {
            var v = $.fn.jquery.split('.');
            if (v != undefined) {
                if (parseInt(v[1]) >= 3) {
                    self.jq = $;
                }
            }
        } else if (window.jQuery != undefined) {
            var v = jQuery.fn.jquery.split('.');
            if (v != undefined) {
                if (parseInt(v[1]) >= 3) {
                    self.jq = jQuery;
                }
            }
        }
        self.jq(document).ready(function () {
            self.load();
        });
    };
    init();
};
hfm.varString = function (string, params) {
    var self = this;
    var source = string;
    var data = {};
    var eq = (params == undefined) ? '=' : params.eq;
    var sc = (params == undefined) ? ';' : params.sc;
    var mode = (params == undefined) ? 'hash' : params.mode;
    init();
    self.set = function (key, val) {
        key = key.toString();
        data[key] = val;
    }
    self.get = function (key) {
        key = key.toString();
        hfm.info({
            'fetching: %o': key,
            'from: %o': data
        });
        if (_o(data).hasKey(key)) {
            return data[key];
        }
        return false;
    }
    self.remove = function (key) {
        key = key.toString();
        if (_o(data).hasKey(key)) {
            delete data[key];
            return true;
        }
        return false;
    }
    self.update = function (name) {
        switch (mode) {
        case 'cookie':
            if (name == undefined) {
                return false;
            }
            hfm.cookie.write(name, self.asString(), 1000);
            break;
        case 'hash':
            window.location.hash = self.asString();
            break;
        }
    }
    self.length = function () {
        var i = 0;
        for (var k in data) {
            i++;
        }
        return i;
    }
    self.asString = function () {
        var string = "";
        for (var k in data) {
            string += k + eq + data[k] + sc;
        }
        return string;
    }
    self.asPairs = function () {
        return data;
    }

    function init() {
        if (_o(source).empty()) {
            return;
        }
        if (mode == 'hash') {
            source = source.replace(/#/, "");
        }
        var sets = source.split(sc);
        var l = sets.length;
        for (var i = 0; i < l; i++) {
            var ele = sets[i].split(eq);
            if (ele.length === 2) {
                data[ele[0]] = ele[1];
            }
        }
    }
};
hfm.cookie = new function () {
    var self = this;
    var expiration = 365;
    self.read = function (key) {
        if (document.cookie.length > 0) {
            cs = document.cookie.indexOf(key + '=');
            if (cs != -1) {
                var vs = cs + key.length + 1;
                var ve = document.cookie.indexOf(';', vs);
                if (ve == -1) {
                    ve = document.cookie.length;
                }
                return unescape(document.cookie.substring(vs, ve));
            }
        }
        return false;
    };
    self.write = function (key, val, expiry) {
        var exp = '';
        switch (expiry) {
        case undefined:
            exp = expiration;
            break;
        case false:
            exp = '';
            break;
        default:
            exp = (isNaN(parseInt(expiry))) ? expiration : parseInt(expiry);
            break;
        }
        var ed = new Date();
        ed.setDate(ed.getDate() + exp);
        document.cookie = key + '=' + escape(val) + '; expires=' + exp + 'path=/';
    };
    self.clear = function (key) {
        return hfm.cookie.write(key, '', - 1);
    };
}
hfm.position = new function () {
    var self = this;
    self.center = function (item) {
        var iw = hfm.jq(item).width();
        var l = (parseInt(hfm.scr.viz.w) - parseInt(iw)) / 2;
        hfm.jq(item).css('left', l);
    }
    self.match = function (item, to) {
        hfm.jq(item).css({
            top: hfm.jq(to).css('top'),
            left: hfm.jq(to).css('left'),
            width: hfm.jq(to).width(),
            height: hfm.jq(to).height()
        });
    }
    self.over = function (item, target) {
        var o = {
            w: hfm.jq(item).width(),
            h: hfm.jq(item).height()
        }
        var t = {
            w: hfm.jq(target).width(),
            h: hfm.jq(target).height(),
            pos: hfm.jq(target).offset()
        }
        hfm.jq(item).css({
            top: t.pos.top - ((o.h - t.h) / 2),
            left: t.pos.left - ((o.w - t.w) / 2)
        });
    }
};
hfm.ads = new function () {
    var self = this;
    var core = {
        'host': 'ad.doubleclick.net',
        'type': 'adj',
        'zone': [],
        'attr': {}
    };
    var cm8 = {
        'server': 'hfm.checkm8.com',
        'cat': [],
        'profile': '',
        'call': '<script' + ' language="javascript" src="http://hfm.checkm8.com/adam/cm8adam_1_call.js"></' + 'SCRIPT>'
    };
    var channel = ['hfmus']; // equivalent to dartsite
    var compState = false;
    var tile = 1;
    var loc = 1;
    var ordinal = false;
    var refreshables = {};
    var rMode = false;
    var calls = [];
    var brand = false;
    self.control = [];
    self.pagetype = false;
    self.setup = function (params) {
        if (_o(params).keyHasValue('host')) {
            core.host = params.host;
        }
        if (_o(params).keyHasValue('type')) {
            core.type = params.type;
        }
        if (_o(params).hasKey('zones') && _o(params.zones).isA(Array)) {
            core.zone = params.zones;
        }
        if (_o(params).hasKey('cm8') && typeof (params.cm8) == "object") {
            for (var label in params.cm8) {
                cm8[label] = params.cm8[label];
            }
        }
        if (_o(params).hasKey('attributes') && typeof (params.attributes) == "object") {
            for (var key in params.attributes) {
                core.attr[key] = clean(params.attributes[key]);
            }
        }
        if (_o(params).keyHasValue('channel')) {
            channel = params.channel.split('.');
        }
        if (_o(hfm.urlInfo.query).keyHasValue('adtest')) {
            self.setKey('adtest', hfm.urlInfo.query.adtest);
        }
        ordinal = Math.floor(Math.random() * 100000000000);
        //		elle.ads.setup(core, channel.slice(0));
        return self;
    };
    self.close = function () {
        //document.write('<script' + ' type="text/javascript" src="http://s.sniphub.com/?s=6"></' + 'script>');
    };
    self.place = function (size, params) {
        if (params.container && params.container !== "") {
            var container = params.container;
            hfm.info({
                "placing ad into container: %f": container
            });
        }
        if (params.callback == 'hfm.cd.identify') {
            var flow = hfm.cd.page.adflow;
            hfm.info({
                "adflow: %f": flow
            });
            var at = '';
            var hidden = false;
            size = size.toLowerCase();
            if (size == 'leaderboard') {
                at = 'a';
            }
            if (size == 'pushdown') {
                at = 'b';
            }
            if (size == 'primaryrightrail') {
                at = 'c';
            }
            if (size == 'subscriptiontextlink') {
                at = 'd';
            }
            if (size == 'rightrailprominentpromo') {
                at = 'e';
            }
            if (size == 'rightrailsubsandcatchall') {
                at = 'f';
            }
            if (size == 'advertorialhomepage') {
                at = 'g';
            }
            if (size == 'rightrailcontentwidget') {
                at = 'h';
            }
            if (size == 'fiw') {
                at = 'i';
            }
            if (size == 'manufacturerlinks') {
                at = 'j';
                hidden = true;
                if (typeof (window.console) == 'object') {
                    hfm.log('manufacturer links');
                }
            }
            if (size == 'gearboxheader') {
                at = 'k';
            }
            if (size == 'advertorialarticlelistingandgearbox') {
                at = 'l';
            }
            if (size == 'peelback') {
                at = 'm';
            }
            if (size == 'interstitialsmall') {
                at = 'n';
            }
            if (size == 'interstitiallarge') {
                at = 'o';
            }
            if (size == 'advertorialbuyersguidelanding') {
                at = 'p';
            }
            if (size == 'specsbox') {
                at = 'q';
            }
            if (size == 'topmanufacturerlinks') {
                at = 'r';
                hidden = true;
                if (typeof (window.console) == 'object') {
                    hfm.log('top manufacturer links');
                }
            }
            if (size == 'pushdownarticleandgallery') {
                at = 's';
            }
            var suppress = true;
            switch (flow) {
            case "homepage":
                if (at == 'b' || at == 'c' || at == 'd' || at == 'g' || at == 'e' || at == 'f') {
                    suppress = false;
                }
                break;
            case "landing":
                if (at == 'b' || at == 'c' || at == 'd' || at == 'l' || at == 'e' || at == 'f') {
                    suppress = false;
                }
                break;
            case "reviewslanding":
                if (at == 'b' || at == 'c' || at == 'd' || at == 'l' || at == 'e' || at == 'f') {
                    suppress = false;
                }
                break;
            case "category":
                if (at == 'a' || at == 'c' || at == 'h' || at == 'f' || (at == 's' && (hfm.cd.page.content_type == "gallery" || hfm.cd.page.content_type == "article"))) {
                    suppress = false;
                }
                break;
            case "make/model":
                if (at == 'a' || at == 'c' || at == 'h' || at == 'j' || at == 'r' || at == 'i' || at == 'f' || at == 'c' || at == 'n' || (at == 'q' && hfm.cd.page.is_spec == true) || (at == 's' && hfm.cd.page.is_spec == true) || (at == 's' && (hfm.cd.page.content_type == "gallery" || hfm.cd.page.content_type == "article"))) {
                    suppress = false;
                }
                break;
            case "ros":
                if (at == 'a' || at == 'c' || at == 'f' || at == 'd' || (at == 'q' && hfm.cd.page.is_spec == true) || (at == 's' && (hfm.cd.page.content_type == "gallery" || hfm.cd.page.content_type == "article"))) {
                    suppress = false;
                }
                if (at == 'r') {
                    $('.shopping-tools.shop-on').hide();
                    hfm.cd.page.showZoomTools = false;
                }
                break;
            case "video":
                if (at == 'c' || at == 'j' || at == 'f' || (at == 's' && (hfm.cd.page.content_type == "gallery" || hfm.cd.page.content_type == "article"))) {
                    suppress = false;
                }
                break;
            case "gearbox":
                if (at == 'k' || at == 'l' || at == 'f' || at == 'a' || at == 'c' || at == 'h' || at == 'm') {
                    suppress = false;
                }
            case "gearboxLanding":
                if (at == 'k' || at == 'l' || at == 'f') {
                    suppress = false;
                }
                break;
            default:
                //console.log('no adflow specified.');
            }
        }
        //var suppress = false;
        if (container) {
            suppress = false;
        }
        if (suppress == false) {
            if (brand == false) {
                brand = elle.ads.setup(core, channel.slice(0));
            }
            if (ordinal == false) {
                self.setup();
            }
            if (!validate(size, params)) {
                return false;
            }
            if (tile == 1) {
                //setCM8();
                //document.write(cm8.call);
                if (self.pagetype == 'gallery' && channel[2] == 'runway') {
                    self.setType('adi');
                    hfm.info({
                        "setting type: %o": core
                    });
                }
            }
            if (_o(params).hasKey('companion')) {
                if (params.companion === true) {
                    var compw = 0;
                    var comph = 0;
                    if (size == 'primaryrightrail') {
                        compw = 300;
                        comph = 250;
                    }
                    if (size == 'manufacturerlinks') {
                        compw = 400;
                        comph = 40;
                    }
                    document.write('<div id="companion-' + window.compCounter + '" class="video-companion" style="width:' + compw + 'px;height:' + comph + 'px;"></div>');
                    window.compCounter++;
                    return;
                }
            }
            // here's the callback handler for caranddriver
            if (_o(params).hasKey('callback') && typeof hfm.cd === 'object') {
                if (_o(params).hasKey('refresh')) {
                    self.setType('adi');
                }
                if (params.callback == 'hfm.cd.identify') {
                    blork = function (size) {
                        var xtraKeys = {}
                        var tileOverride = false;
                        var adiOverride = false;
                        var iframeWidth = "";
                        var iframeHeight = "";
                        var addborder = false;
                        var interstitialSmall = false;
                        var manu = false;
                        size = size.toLowerCase()
                        switch (size) {
                        case "leaderboard":
                            //A
                            size = "728x90";
                            break;
                        case "pushdown":
                            //B
                            size = "756x30";
                            if (hfm.cd.page.section_type !== "homepage") {
                                addborder = true;
                            }
                            break;
                        case "primaryrightrail":
                            //C
                            size = "300x250";
                            break;
                        case "subscriptiontextlink":
                            //D
                            size = "2x2";
                            adiOverride = true;
                            //add key kw=textlink
                            xtraKeys = {
                                "kw": "textlink"
                            }
                            break;
                        case "rightrailprominentpromo":
                            //E
                            size = "2x2";
                            // add key jumpstart=gearbox
                            xtraKeys = {
                                "jumpstart": "gearbox"
                            }
                            break;
                        case "rightrailsubsandcatchall":
                            //F           
                            // add key kw=catchall
                            //iframeHeight = 300;
                            //iframeWidth = 336;
                            adiOverride = true;
                            xtraKeys = {
                                "kw": "catchall"
                            }
                            size = "2x2";
                            //adiOverride = true;
                            break;
                        case "advertorialhomepage":
                            //G
                            size = "228x234";
                            break;
                        case "rightrailcontentwidget":
                            //H
                            size = "300x120";
                            // console.log('right rail content widget');
                            iframeHeight = 250;
                            break;
                        case "fiw":
                            //I
                            size = "242x90";
                            // add keys tn=3;tsw=1x0;tsc=000000;tp=1;
                            xtraKeys = {
                                "tn": "3",
                                "tsw": "1x0",
                                "tsc": "000000",
                                "tp": "1"
                            }
                            var tileOverride = true;
                            iframeWidth = 728;
                            break;
                        case "manufacturerlinks":
                            //J 
                            manu = true;
                            size = "400x40";
                            adiOverride = true;
                            break;
                        case "gearboxheader":
                            //K
                            size = "2x2";
                            xtraKeys = {
                                "kw": "gearheader"
                            }
                            //console.log('gearboxheader');
                            break;
                        case "advertorialarticlelistingandgearbox":
                            //L
                            size = "684x140";
                            break;
                        case "peelback":
                            //M
                            size = "2x2";
                            break;
                        case "interstitialsmall":
                            //N
                            interstitialSmall = true;
                            size = "300x250";
                            break;
                        case "interstitiallarge":
                            //O
                            size = "300x250";
                            break;
                        case "advertorialbuyersguidelanding":
                            //P
                            size = "339x120";
                            break;
                        case "specsbox":
                            //Q
                            size = "2x2";
                            xtraKeys = {
                                "kw": "specs"
                            }
                            break;
                        case "topmanufacturerlinks":
                            //R 
                            size = "666x666";
                            adiOverride = true;
                            manu = true;
                            break;
                        case "pushdownarticleandgallery":
                            //S
                            size = "678x30";
                            adiOverride = true;
                            if (window.location.href.indexOf("dev-www") >= 0) {
                                xtraKeys = {
                                    "test": "fblogin"
                                }
                            }
                            $('#pushdown-article').css({
                                'visibility': 'visible',
                                'display': 'block'
                            });
                            break;
                        default:
                            size = "2x2";
                        }
                        return [size, xtraKeys, tileOverride, adiOverride, iframeWidth, iframeHeight, addborder, interstitialSmall, manu];
                    }
                    var identity = blork(size);
                    size = identity[0];
                    xtraKeys = identity[1];
                    tileOver = identity[2];
                    adiOver = identity[3];
                    iframeWidth = identity[4];
                    iframeHeight = identity[5];
                    addborder = identity[6];
                    interstitialSmall = identity[7];
                    manu = identity[8];
                    //console.log(identity);    
                }
            }
            // end callback handler    		
            if (typeof (size) != 'string') {
                return;
            }
            if (size.length < 3) {
                return;
            }
            var sizes = parseSize(size);
            var adRef = 'hfm-ad-' + tile;
            if (_o(params).hasKey('refresh')) {
                var mode = params.refresh;
                if (mode === true) {
                    mode = 'core';
                }
                if (!_o(refreshables).hasKey(mode)) {
                    refreshables[mode] = [];
                }
                refreshables[mode].push({
                    'id': adRef,
                    'size': size,
                    'type': core.type
                });
            }
            if (adiOver == true) {
                self.setType('adj');
            }
            base = build();
            if (tile === 1) {
                base.keys = prependKeys({
                    'dcopt': 'ist'
                }, base.keys);
            }
            if (_o(params).hasKey('useLoc')) {
                if (params.useLoc === true) {
                    base.keys = appendKeys({
                        'loc': loc
                    }, base.keys);
                    loc++;
                }
            }
            if (xtraKeys) {
                base.keys = appendKeys(xtraKeys, base.keys);
            }
            var theU = hfm.cd.page.uText;
            theU += "sz_" + size;
            base.keys = appendKeys({
                'sz': size,
                'cmn': 'jsa'
            }, base.keys);
            if (tileOver == false) {
                base.keys = appendKeys({
                    'tile': tile
                }, base.keys);
            }
            base.keys = appendKeys({
                'u': theU
            }, base.keys);
            for (var i = 0; i < segLen; i++) {
                segArr = rsi_segs[i].split("_")
                // if (segArr.length>1) segQS+=("btseg"+"="+segArr[1]+";");
                base.keys = appendKeys({
                    'btseg': segArr[1]
                }, base.keys);
            }
            base.keys = appendKeys({
                'ord': ordinal + '?'
            }, base.keys);
            // add the size to the u string
            //if(tileOver == false){
            tile++;
            //}
            var call = base.path + base.keys;
            //console.log('placing ad type: '+at);
            hfm.info({
                "placing: %s": call
            });
            if (sizes[0].x == '666') {
                sizes[0].x = '400'
            }
            if (sizes[0].y == '666') {
                sizes[0].y = '40'
            }
            if (iframeWidth != "") {
                sizes[0].x = iframeWidth;
            }
            if (iframeHeight != "") {
                sizes[0].y = iframeHeight;
            }
            if (core.type == 'adi' && container !== "inter-pageinter-ad") {
                if (_o(params).hasKey('reserve')) {
                    if (params.reserve == true) {
                        call = '';
                    }
                }
                hfm.info({
                    'ad call: %s': call
                });
                document.write('<iframe id="' + adRef + '" src="" rel="' + call + '" width="' + sizes[0].x + '" height="' + sizes[0].y + '" marginwidth="0" marginheight="0" frameborder="0" scrolling="no" style="display:none;" class="delayMe">');
                if (navigator.userAgent.indexOf("Gecko") == -1) {
                    document.write('<' + 'script type="text/javascript" src="' + call.replace('/adi/', '/adj/') + '"' + '><' + '/script' + '>');
                }
                document.write('</iframe>');
            } else {
                if (container) {
                    if (interstitialSmall) {
                        if ($("#" + container).html().indexOf('<') == -1) {
                            $("#" + container).append('<iframe id="' + adRef + '" src="" rel="' + call.replace('/adj/', '/adi/') + '" width="' + sizes[0].x + '" height="' + sizes[0].y + '" marginwidth="0" marginheight="0" frameborder="0" scrolling="no" style="display:none;" class="delayMe">');
                            if (navigator.userAgent.indexOf("Gecko") == -1) {
                                $("#" + container).append('<' + 'script type="text/javascript" src="' + call.replace('/adj/', '/adi/') + '"' + '><' + '/script' + '>');
                            }
                            $("#" + container).append('</iframe>');
                        }
                    }
                    if (manu && hfm.cd.page.showZoomTools == true && !$("#content > .shopping-tools").hasClass("hidden")) {
                        var shopClone = "";
                        var shop1 = "";
                        shopClone += '<p>Shopping Tools</p>'
                        $('div[id^="adDiv"] iframe').each(function (index) {
                            shop1 = $(this).contents().find('.jcpmanufacturer').html();
                            if (shop1) {
                                if (index == 1) {
                                    shopClone += '<p>Advertisement</p>';
                                }
                                shopClone += '<div class="jcpmanufacturer">';
                                shopClone += shop1;
                                shopClone += '</div>';
                            }
                        });
                        $("#zoom-container .main .shopping-tools").removeClass('hidden').css({
                            "display": "block",
                            "height": "77px"
                        });
                        $("#zoom-container .main .shopping-tools").html(shopClone);
                        if ($("#content > .shopping-tools > a > img").length) {
                            $("#content > .shopping-tools > a:first").clone().appendTo("#zoom-container .main .shopping-tools");
                        }
                        if ($("#content > .shopping-tools > img").length) {
                            $("#content > .shopping-tools > img:first").clone().appendTo("#zoom-container .main .shopping-tools");
                        }
                    }
                } else if (_o(params).hasKey('fif') && (params.fif === true)) {
                    if (size == '728x90') {
                        $("#branding-ad").append('<div id="adDiv0"></div>')
                        window.firstAd = true;
                    } else if (size == '756x30') {
                        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
                            var pushMargin = "-3"
                        } else {
                            var pushMargin = "-15"
                        }
                        if ($(".pushdown-ad").length > 0) {
                            $(".pushdown-ad").append('<div id="adDiv0" style="margin-bottom:' + pushMargin + 'px;"></div>');
                            window.firstAd = true;
                        } else if ($(".pushdownAd").length > 0) {
                            $(".pushdownAd").append('<div id="adDiv0" style="margin-bottom:' + pushMargin + 'px;"></div>');
                            window.firstAd = true;
                        }
                    } else if (size == '300x250' && window.firstAd == false) {
                        $(".prr").append('<div id="adDiv0"></div>');
                        window.firstAd = true;
                    } else if (size == '2x2' && window.firstAd == false) {
                        if (at == "k") {
                            $('<div id="adDiv0"></div>').insertAfter($('.shopping-tools'));
                            //console.log('gearheader placement');
                        } else if (at == "d") {
                            $('<div id="adDiv0"></div>').appendTo($('#tertiary .mod.advertisement').eq(2));
                            //console.log('subs link');
                        }
                        window.firstAd = true;
                    }
                    SetupAdDiv(300, 225, call, "/assets/js/ads/adpage.html");
                } else {
                    document.write('<' + 'script language="javascript" src="' + call + '"' + '><' + '/script' + '>');
                }
            }
        } else {
            hfm.info({
                'suppressing ad %x': size
            });
        }
    };
    self.insert = function (size, params) {
        if (typeof (size) != 'string') {
            return;
        }
        if (size.length < 3) {
            return;
        }
        var sizes = parseSize(size);
        var output = '';
        var adRef = 'hfm-ad-' + tile;
        if (_o(params).hasKey('refresh')) {
            var mode = params.refresh;
            if (mode === true) {
                mode = 'core';
            }
            if (!_o(refreshables).hasKey(mode)) {
                refreshables[mode] = [];
            }
            refreshables[mode].push({
                'id': adRef,
                'size': size,
                'type': core.type
            });
        }
        base = build();
        base.keys = prependKeys({
            'sz': size
        }, base.keys);
        if (tile === 1) {
            base.keys = prependKeys({
                'dcopt': 'ist'
            }, base.keys);
        }
        if (_o(params).hasKey('useLoc')) {
            if (params.useLoc === true) {
                base.keys = appendKeys({
                    'loc': loc
                }, base.keys);
                loc++;
            }
        }
        base.keys = appendKeys({
            'tile': tile++,
            'ord': ordinal + '?'
        }, base.keys);
        tile++;
        var call = base.path + base.keys;
        hfm.info({
            'params: %o': params
        });
        if (_o(params).hasKey('reserve')) {
            if (params.reserve == true) {
                call = '';
            }
        }
        hfm.info({
            'ad call: %s': call
        });
        output = '<iframe id="' + adRef + '" src="" rel="' + call + '" width="' + sizes[0].x + '" height="' + sizes[0].y + '" marginwidth="0" marginheight="0" frameborder="0" scrolling="no" style="display:none;" class="delayMe">';
        if (navigator.userAgent.indexOf("Gecko") == -1) {
            output += '<script type="text/javascript" src="' + call.replace('/adi/', '/adj/') + '">';
        }
        output += '</iframe>';
        return output;
    };
    self.refresh = function (key) {
        if (key == undefined) {
            key = 'core';
        }
        if (!_o(refreshables).hasKey(key)) {
            return;
        }
        analytics();
        var startType = core.type;
        var ids = refreshables[key];
        hfm.info({
            'refreshing: %o': key,
            "ids: %o": ids
        });
        ordinal = Math.floor(Math.random() * 100000000000);
        tile = 1;
        rMode = key;
        if (ids[0].type != 'adi') {
            return;
        }
        core.type = ids[0].type;
        var base = build();
        base.keys = prependKeys({
            'sz': ids[0].size,
            'dcopt': 'ist'
        }, base.keys);
        var theU = hfm.cd.page.uText;
        theU += "sz_" + ids[0].size;
        base.keys = appendKeys({
            'cmn': 'jsa',
            'u': theU
        }, base.keys);
        base.keys = appendKeys({
            'tile': tile++,
            'ord': ordinal + '?'
        }, base.keys);
        var ele = document.getElementById(ids[0].id);
        hfm.info({
            "Starting refresh: %o": ele,
            "New Path: %o": base.path + base.keys
        });
        //ele.src = base.path + base.keys;
        ele.contentWindow.location.replace(base.path + base.keys);
        setTimeout('hfm.ads.complete()', 500);
        core.type = startType;
    };
    self.complete = function () {
        if (rMode == false) {
            return;
        }
        var startType = core.type;
        var key = rMode;
        var ids = refreshables[key];
        for (var i = 1; i < ids.length; i++) {
            if (ids[i].type != 'adi') {
                continue;
            }
            core.type = ids[i].type;
            var base = build();
            base.keys = prependKeys({
                'sz': ids[i].size
            }, base.keys);
            var theU = hfm.cd.page.uText;
            theU += "sz_" + ids[i].size;
            base.keys = appendKeys({
                'cmn': 'jsa',
                'u': theU
            }, base.keys);
            base.keys = appendKeys({
                'tile': tile++,
                'ord': ordinal + '?'
            }, base.keys);
            var ele = document.getElementById(ids[i].id);
            if (ele) {
                //hfm.info({"post-refreshing : %o": ele});
                //hfm.info({"Continuing refresh: %o": base.path + base.keys});
                //ele.src = base.path + base.keys;
                ele.contentWindow.location.replace(base.path + base.keys);
            }
        }
        core.type = startType;
        rMode = false;
    };
    self.companion = function (source) {
        var adXML = false;
        if (source !== false) {
            adXML = hfm.parseXML(source);
            if (typeof console == "object") {
                console.log('companion xml');
                console.log(adXML);
            }
        }
        //console.log(adXML);
        var companion = adXML.getElementsByTagName('Companion');
        //console.log(companion);
        //console.log(companion.length);
        var adCall = [];
        var adSize = [];
        var clickThrough = [];
        var adType = [];
        var placementType = [];
        for (var i = 0; i <= companion.length - 1; i++) {
            if (companion[i].getAttribute('width') == "400") {
                placementType[0] = "manufacturer";
                adCall[0] = companion[i].getElementsByTagName('StaticResource')[0].firstChild.nodeValue;
                adSize[0] = companion[i].getAttribute('width');
                clickThrough[0] = companion[i].getElementsByTagName('CompanionClickThrough')[0].firstChild.nodeValue;
                adType[0] = companion[i].getElementsByTagName('StaticResource')[0].getAttribute('creativeType');
                //console.log('companion is manufacturer');
                $('div.shopping-tools').removeClass('hidden');
                $('.shopping-tools p').each(function (intIndex) {
                    if ($(this).html() == "Shopping Tools") {
                        $(this).hide();
                    }
                });
            }
            if (companion[i].getAttribute('width') == "300") {
                placementType[1] = "rightrail";
                adCall[1] = companion[i].getElementsByTagName('StaticResource')[0].firstChild.nodeValue;
                adSize[1] = companion[i].getAttribute('width');
                clickThrough[1] = companion[i].getElementsByTagName('CompanionClickThrough')[0].firstChild.nodeValue;
                adType[1] = companion[i].getElementsByTagName('StaticResource')[0].getAttribute('creativeType');
                //console.log('companion is rightrail');
            }
            //console.log(adCall[i]);
            //console.log(clickThrough[i]);
            //console.log(adType[i]);
        };
        $(".video-companion").each(function (intIndex) {
            $(this).html('<iframe src="about:blank" id="ifr_companion-' + intIndex + '" width="100%" height="100%" marginwidth=0 marginheight=0 hspace=0 vspace=0 frameborder=0 scrolling=no>' + '</iframe>');
            //console.log('companion: ' + intIndex);
            var doc = $('#ifr_companion-' + intIndex)[0].contentWindow.document;
            doc.open();
            if (adType[intIndex] == "image/jpeg") {
                doc.write('<html><head></head><body><div><a href="' + clickThrough[intIndex] + '" target="_parent" style="border:0;outline:0;"><img src="' + adCall[intIndex] + '" style="border:0;outline:0;" /></a></div></body></html>');
            }
            if (adType[intIndex] == "application/x-shockwave-flash") {
                doc.write('<html><head></head><body><div>')
                //doc.write('<img src="' + adCall[intIndex] + '" />
                doc.write('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,16,0"width="300" height="250" ><param name="movie" value="' + adCall[intIndex] + '?clickTag=' + clickThrough[intIndex] + '"><param name="quality" value="high"><param name="flashvars" value="targetURL=' + clickThrough[intIndex] + '"><param name="play" value="true"><param name="LOOP" value="false"><embed src="' + adCall[intIndex] + '?clickTag=' + clickThrough[intIndex] + '" width="300" height="250" play="true" loop="false" quality="high" flashvars="targetURL=' + clickThrough[intIndex] + '" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"></embed></object>');
                doc.write('</div></body></html>');
            }
            doc.close();
        });
    };
    self.mediaEvent = function (event) {
        switch (event.type) {
        case "mediaBegin":
            if (compState === false) {
                hfm.ads.companion(false);
            }
            break;
        }
    };
    self.setKey = function (key, val) {
        if (_o(val).empty()) {
            return self;
        }
        if (key !== "u") {
            val = clean(val);
        }
        if (_o(core.attr).hasKey(key)) {
            if (_o(core.attr[key]).isA(Array)) {
                core.attr[key].push(val);
            } else {
                core.attr[key] = val;
            }
        } else {
            core.attr[key] = val;
        }
        return self;
    };
    self.clearKey = function (key) {
        if (_o(core.attr).hasKey(key)) {
            delete core.attr[key];
            return true;
        }
        return false;
    };
    self.getKey = function (key) {
        if (_o(core.attr).hasKey(key)) {
            return core.attr[key];
        }
        return false;
    };
    self.setType = function (type) {
        core.type = type;
        hfm.info({
            "Type set to: %s": core.type
        });
        return self;
    };
    self.setHost = function (host) {
        core.host = host;
        return self;
    };
    self.setSitename = function (site) {
        hfm.info({
            "Setting sitename to: %s": site
        });
        hfm.info({
            "Global Object: %g": hfm.cd.page
        });
        channel = site.split('.');
        cm8.cat = channel.slice(0);
        return self;
    };
    self.setSitenameAt = function (site, loc) {
        hfm.info({
            "Setting sitename at location to: %s": site
        });
        channel[loc] = clean(site);
        cm8.cat[loc] = clean(site);
        return self;
    };
    self.getSitename = function () {
        return channel.join('.');
    };
    self.appendZone = function (value) {
        value = clean(value);
        if (!_o(value).empty()) {
            core.zone.push(value);
            cm8.cat.push(value);
        }
        return self;
    };
    self.getZone = function (depth) {
        var level = (depth > 0) ? (depth - 1) : 0;
        if (core.zone.length >= level && depth <= core.zone.length) {
            return core.zone[level];
        }
        return false;
    };
    self.getZones = function () {
        var z = core.zone.slice();
        if (!_o(hfm.urlInfo.channel).empty()) {
            z.unshift(clean(hfm.urlInfo.channel));
        }
        z.push(self.pagetype);
        return z;
    };
    self.setZoneAt = function (value, pos) {
        hfm.info({
            "Setting position: %s": pos,
            "to: %o": value
        });
        pos = (pos > 0) ? (pos - 1) : pos;
        value = clean(value);
        if (pos >= 0 && pos < core.zone.length) {
            core.zone[pos] = value;
            cm8.cat[(pos + 3)] = value;
            hfm.info({
                "CM8 Cat (setZoneAt) -- %o": cm8.cat.slice(0),
                "cm8.cat array: %o": _o(cm8.cat).isA(Array)
            });
        } else if (pos >= 0) {
            self.appendZone(value);
        }
        return self;
    };
    self.removeZoneAt = function (pos) {
        hfm.info({
            'Removing zone at: %s': pos
        });
        pos = (pos > 0) ? (pos - 1) : pos;
        if (pos >= 0 && pos < core.zone.length) {
            var tossed = core.zone.splice(pos, 1);
            cm8.cat.splice((pos + 3), 1);
            hfm.info({
                "CM8 Cat (removeZoneAt) -- %o": cm8.cat.slice(0),
                "cm8.cat array: %o": _o(cm8.cat).isA(Array)
            });
        }
        return self;
    };
    self.refreshable = function () {
        return refreshables;
    };
    self.debug = function () {
        if (hfm.debug && typeof (window.console) == 'object') {
            if (ordinal === false) {
                hfm.ads.setup();
            }
            console.log("core", core);
            console.log("hfm.urlInfo", hfm.urlInfo);
            console.log("channel", channel);
            console.log("sitename", channel.join('.'));
            console.log("pagetype", self.pagetype);
            console.log("cm8", cm8);
            console.log("tile, loc, ordinal", tile, loc, ordinal);
            console.log(build());
            console.log('refresh', refreshables);
        }
    };

    function analytics() {
        // omniture
        s.referrer = location.href;
        s.events = s.eVar27 = s.eVar28 = s.eVar46 = s.eVar48 = s.eVar49 = s.eVar50 = s.campaign = "";
        var s_code = s.t();
        if (s_code) {
            document.write(s_code);
        }
        // google analytics
        if (window.gaq != undefined) {
            _gaq.push(['_trackPageview']);
            _gaq.push(['t2._trackPageview']);
        }
        // new style, duplicating for coverage
        if (window.pageTracker != undefined) {
            window.pageTracker._trackPageview();
        }
    };

    function appendKeys(data, source) {
        for (var k in data) {
            source += ';' + k + '=' + data[k];
        }
        return source;
    };

    function build() {
        var call = {};
        var base = 'http://' + core.host + '/' + core.type + '/' + channel.join('.') + '/' + buildZones();
        var keys = "";
        for (var key in core.attr) {
            if (typeof (core.attr[key]) === 'array') {
                for (var j = 0; j < core.attr[key].length; j++) {
                    keys += ';' + key + '=' + core.attr[key][j];
                }
            } else {
                keys += ';' + key + '=' + core.attr[key];
            }
        }
        //if (!_o(window.segQS).empty()) { keys = keys +';'+ segQS.substring(0,(segQS.length-1)); }
        call.path = base;
        call.keys = keys;
        return call;
    };

    function buildZones() {
        base = '';
        for (var i = 0; i < core.zone.length; i++) {
            var z = core.zone[i];
            if (!_o(z).empty()) {
                if (i > 0) {
                    base += '/';
                }
                base += clean(z);
            }
        }
        if (base == '') {
            //base += self.pagetype;
        } else {
            //base += '/'+ self.pagetype;
        }
        return base;
    };

    function clean(string) {
        if (typeof (string) != "string") {
            return string;
        }
        return string.toLowerCase().replace(/[^a-z|0-9]/g, "");
    };

    function prependKeys(data, source) {
        var p = '';
        for (var k in data) {
            p += ';' + k + '=' + data[k];
        }
        return p + source;
    };

    function parseSize(size) {
        var result = [];
        var sizes = size.split(',');
        for (var i = 0; i < sizes.length; i++) {
            var dim = sizes[i].split('x');
            if (dim.length == 2) {
                result.push({
                    'x': dim[0],
                    'y': dim[1]
                });
            }
        }
        return result;
    };

    function setCM8() {
        window.CM8Server = cm8.server;
        window.CM8Cat = cm8.cat.join('.') + '.' + self.pagetype;
        aid = (_o(self.getKey('aid')).empty()) ? '' : self.getKey('aid') + '&';
        gid = (_o(self.getKey('gid')).empty()) ? '' : self.getKey('gid') + '&';
        window.CM8Profile = aid + gid + window.segQS.replace(/;/g, '&');
        hfm.info({
            'CM8Server: %o': cm8.server,
            'CM8Cat: %o': cm8.cat.join('.') + '.' + self.pagetype,
            'CM8Profile: %o': aid + gid + window.segQS.replace(/;/g, '&')
        });
    };

    function validate(size, params) {
        if (self.control.length < 1) {
            return true;
        }
        var against = {
            'sitename': channel.join('.'),
            'size': size,
            'zone': core.zone.join('.'),
            'pagetype': self.pagetype
        };
        var i = 0;
        var l = self.control.length;
        for (var i; i < l; i++) {
            var count = 0;
            var test = self.control[i].match;
            for (var k in test) {
                if (against[k] != test[k]) {
                    count++;
                }
                if (count > 0) {
                    break;
                }
            }
            if (count > 0) {
                continue;
            }
            hfm.info({
                "match found: %o": test[k],
                "against: %o": against[k]
            });
            return self.control[i].display;
        }
        return true;
    };

    function init() {
        if (hfm.urlInfo == false) {
            return;
        }
        if (_o(hfm.urlInfo.query).hasKey('adDebug')) {
            hfm.cookie.write('debug', 'enabled');
        }
        if (hfm.cookie.read('debug') == 'enabled') {
            hfm.debug = true;
        }
        var ch = (_o(hfm.urlInfo.channel).empty()) ? 'hp' : hfm.urlInfo.channel;
        var br = (hfm.urlInfo.brand.indexOf('.el.') > 0) ? 'elle' : hfm.urlInfo.brand;
        channel[1] = clean(br);
        channel[2] = clean(ch);
        cm8.cat = channel.slice(0);
        switch (hfm.urlInfo.path.length) {
        case 0:
        case 1:
            self.pagetype = 'landingpage';
            break;
        case 2:
            self.pagetype = 'landingpage';
            var sc = clean(hfm.urlInfo.path[1]);
            if (!_o(sc).empty()) {
                //self.appendZone(sc);
                //self.setKey('subch', sc);
            }
            break;
        default:
            self.pagetype = 'article';
            var sc = clean(hfm.urlInfo.path[1]);
            if (!_o(sc).empty()) {
                //self.appendZone(sc);
                //self.setKey('subch', sc);
            }
            break;
        }
    };
    init();
}; /* check namespace */
if (typeof (elle) != 'object') {
    var elle = new function () {};
}
elle.ads = new function () {
    var self = this;
    var valid = {
        'channels': ['hp', 'runway', 'fashion', 'popculture', 'beauty', 'lifelove', 'astrologyadvice', 'accessories', 'sweepstakes', 'newsletter', 'blogs', 'forums', 'microsite', 'misc', 'search', 'video', 'elleshops', 'mark', 'enth']
    };
    self.setup = function (core, channel) {
        if (channel[2] == "runway") {
            hfm.ads.setZoneAt(hfm.urlInfo.path[2], 1);
            hfm.ads.setKey('subch', hfm.urlInfo.path[2]);
        }
        if (channel[2] == 'sweepstakes') {
            hfm.ads.removeZoneAt(1);
        }
        if (channel[2].indexOf('newsletter') > 0) {
            channel[2] = 'newsletter';
            hfm.ads.setSitenameAt('newsletter', 2);
        }
        //if (!_o(valid.channels).contains(channel[2])) { hfm.ads.setSitenameAt('misc', 2); }
        return true;
    }
}
elle.gallery = function (input) {
    var self = this;
    self.container = null;
    self.current = 0; // the current slide # being shown
    /*
	params.container		the DOM container that all of the slideshow will live within and where actions should be trapped
	params.hero				the hero (base & full) the image will be swapped into
	params.thumbs			the thumbnails that drive the gallery
	params.delay			delay between slide updates when playing
	params.extensions		the extensions for each photo type used
	*/
    var params = input;
    var media = null; // the actual array of slides to present
    var state = false; // play state (true-play, false-pause)
    var view = false; // is the host currently displayed
    var mode = 'base' // base, fullscreen or fullthumbs
    var hash = false; // the location hash variable object
    var delay = 5000;
    var interval = null;
    var fsReady = false; // has the fullscreen been prepared
    var loaded = false;
    var cookie = 'el.gal' // the name of the cookie to store the views in
    var aIS = {
        'enabled': true,
        'element': false,
        'delta': false,
        'count': 6,
        'interval': false,
        'cd': false,
        'viewData': false
    };
    var active_galleries = [];
    var active_env = 'stage';
    var meta = {};
    var actors = {};
    var roles = {
        'caption': false,
        'status': false
    };
    init();
    self.action = function (event) {
        if (typeof (event) === 'string') {
            var target = false;
            var action = event;
        } else {
            var target = hfm.jq(event.currentTarget);
            var action = hfm.jq(target).attr('gaction');
        }
        //		hfm.info({'action %o': action});
        switch (action) {
        case 'next':
            pause();
            if (self.current < (_o(media).count() - 1)) {
                self.current += 1;
                try {
                    update();
                } catch (err) {
                    hfm.log(err);
                }
            }
            break;
        case 'previous':
            pause();
            if (self.current > 0) {
                self.current -= 1
                try {
                    update();
                } catch (err) {
                    hfm.log(err);
                }
            };
            break;
        case 'auto':
            if (self.current < (_o(media).count() - 1)) {
                self.current += 1;
                try {
                    update();
                } catch (err) {
                    hfm.log(err);
                }
            } else {
                pause();
            }
            break;
        case 'play':
            if (interval !== null) {
                try {
                    pause();
                } catch (err) {
                    hfm.log(err);
                }
            } else {
                try {
                    play();
                } catch (err) {
                    hfm.log(err);
                }
            }
            break;
        case 'fullscreen':
        case 'fullthumbs':
            try {
                if (mode == 'base') {
                    hfm.screen('show');
                }
                fsAssemble();
                self.resize();
                fullscreen(mode, action);
                hfm.jq(params.fullscreen.container).fadeIn('fast');
                setMode(action);
            } catch (err) {
                hfm.log(err);
            }
            break;
        case 'fullclose':
            pause();
            hfm.jq(params.fullscreen.container).fadeOut(300);
            fullscreen(mode, 'base');
            hfm.screen('hide');
            setMode('base');
            break;
        case 'print':
            pause();
            window.print();
            break;
        case 'fulljump':
            fullscreen('fullthumbs', 'fullscreen');
            setMode('fullscreen');
        case 'jump':
            if (target === false) {
                return false;
            }
            var tmp = target.find('img')[0];
            self.current = parseInt(hfm.jq(tmp).attr('gsn'));
            if (isNaN(self.current)) {
                return false;
            }
            try {
                update();
            } catch (err) {
                hfm.log(err);
            }
            break;
        }
        if (!_o(params.delegate).empty()) {
            params.delegate(action);
        }
        return false;
    };
    self.load = function () {
        hfm.jq(self.container + ' a').each(function () {
            register(this);
        });
        hfm.jq(params.fullscreen.container + ' a').each(function () {
            register(this);
        });
        // handle hash tag
        hash = new hfm.varString(window.location.hash);
        if (hash.length() > 0) {
            var data = hash.asPairs();
            self.current = (_o(data).hasKey('slide')) ? parseInt(data['slide']) : 0;
            var nmode = (_o(data).hasKey('mode')) ? data['mode'] : 'base';
            hfm.info({
                'hash: %o': data
            });
            if (nmode != 'base') {
                self.action(nmode);
            }
        }
        update({
            'skip': true
        });
        hfm.log(actors, roles);
        hfm.jq(window).resize(self.resize);
        loaded = true;
    };
    self.play = function () {
        self.action('auto');
    };
    self.registerAction = function (selector, action) {};
    self.registerRole = function (selector, role) {
        if (_o(roles).hasKey(role)) {
            if (roles[role] === false) {
                roles[role] = [selector];
            } else {
                var r = roles[role];
                if (!_o(r).isA(Array)) {
                    return false;
                }
                if (!_o(r).contains(selector)) {
                    roles[role].push(selector)
                }
            }
        }
    };
    self.resize = function () {
        //		hfm.position.center(params.fullscreen.container);
    };
    self.inter = function (params) {
        var close = false;
        if (params != undefined) {
            if (_o(params).hasKey('close') && params.close == true) {
                close = true;
            }
        }
        if (close == false) {
            if (aIS.cd > 0) {
                aIS.cd--;
                hfm.jq('#ad-timeout').html(aIS.cd);
                return;
            }
        }
        hfm.jq(aIS.element).fadeOut(300, function () {
            hfm.jq(this).remove();
        });
        hfm.jq('#ad-close').remove();
        clearInterval(aIS.interval);
        aIS.element = false;
        aIS.cd = false;
        aIS.interval = false;
        incrementView(true);
        update({
            'skipView': true
        });
    }
    self.setMeta = function (key, val) {
        meta[key] = val;
    }
    self.debug = function () {
        hfm.info({
            'params: %o': params,
            'media: %o': media,
            'state: %o': state,
            'mode: %o': mode,
            'delay: %o': delay,
            'actors: %o': actors,
            'roles: %o': roles,
            'aIS: %o': aIS,
            'meta: %o': meta
        });
    }

    function init() {
        self.container = params.container;
        if (_o(active_galleries).contains(params.id)) {
            aIS.enabled = true;
        }
        if (hfm.urlInfo.env == active_env) {
            aIS.enabled = true;
        }
        var io = hfm.urlInfo.path.indexOf("(imageIndex)")
        if (io >= 0) {
            self.current = parseInt(hfm.urlInfo.path[(io + 1)]);
            hfm.info({
                "Setting current slide to: %s": self.current
            });
        }
        media = parse();
        if (!_o(params.delay).empty()) {
            var d = parseInt(params.delay);
            if (!isNaN(d)) {
                delay = d * 1000; // convert to milliseconds
            }
        }
        hfm.jq(document).ready(function () {
            self.load();
        });
    };

    function close() {
        controller.detach();
        hfm.jq(params.host).fadeOut(400);
        hfm.jq(backer).fadeOut(400).remove();
        if (interval !== null) {
            clearInterval(interval);
        }
        interval = null;
        view = false;
        window.ss = false;
    };

    function fullscreen(from, to) {
        var fs = params.fullscreen;
        switch (from) {
        case 'fullscreen':
            hfm.jq(fs.container + ' ' + fs.label.lg).css('display', 'none');
            if (to == 'fullthumbs') {
                hfm.jq(fs.container + ' ' + fs.label.th).css('display', 'block');
                hfm.jq(fs.container + ' ' + fs.heroPane).fadeOut(300, function () {
                    hfm.jq(fs.container + ' ' + fs.thumbsPane).fadeIn(300);
                });
            }
            if (to == 'base') {
                toggleAds('base');
            }
            break;
        case 'fullthumbs':
            hfm.jq(fs.container + ' ' + fs.label.th).css('display', 'none');
            if (to == 'fullscreen') {
                hfm.jq(fs.container + ' ' + fs.label.lg).css('display', 'block');
                hfm.jq(fs.container + ' ' + fs.thumbsPane).fadeOut(300, function () {
                    hfm.jq(fs.container + ' ' + fs.heroPane).fadeIn(300);
                });
            }
            if (to == 'base') {
                toggleAds('base');
            }
            break;
        case 'base':
            var sel = fs.container + ' ';
            var sub = fs.container + ' ';
            if (to == 'fullscreen') {
                sel += fs.label.lg;
                sub += fs.heroPane;
                hfm.jq(fs.container + ' ' + fs.thumbsPane).css('display', 'none');
            }
            if (to == 'fullthumbs') {
                sel += fs.label.th;
                sub += fs.thumbsPane;
                hfm.jq(fs.container + ' ' + fs.heroPane).css('display', 'none');
            }
            if (to == 'fullthumbs' || to == 'fullscreen') {
                toggleAds('full');
            }
            hfm.jq(sel).css('display', 'block');
            hfm.jq(sub).css('display', 'block');
            hfm.jq('html, body').animate({
                scrollTop: 0
            }, 'slow');
            break;
        }
        if (to == 'base') {
            var esel = fs.container + ' ' + fs.label.lg;
            if (from == 'fullthumbs') {
                esel = fs.container + ' ' + fs.label.th;
            }
            hfm.jq(esel).css('display', 'none');
            hfm.ads.refresh('base');
        } else {
            hfm.ads.refresh('full');
        }
    };

    function parse() {
        var output = {};
        var list = hfm.jq(params.thumbs + ' img');
        for (var i = 0; i < list.length; i++) {
            var base = hfm.jq(list[i]).attr('src');
            var elements = base.split('/');
            var frame = elements.pop();
            var l = frame.indexOf('_');
            var data = {
                'frame': {
                    'base': frame.substring(0, l),
                    'extension': frame.substring(l)
                },
                'key': elements.pop(),
                'collection': elements.pop(),
                'core': elements.join('/')
            }
            var media = {
                'thumb': base,
                'hero': data.core + '/' + data.collection + '/' + data.key + '/' + data.frame.base + params.extensions.hero,
                'fullthumb': data.core + '/' + data.collection + '/' + data.key + '/' + data.frame.base + params.extensions.fullthumb,
                'fullhero': data.core + '/' + data.collection + '/' + data.key + '/' + data.frame.base + params.extensions.fullhero
            }
            hfm.jq(list[i]).attr('gsn', i);
            output[i] = media;
        }
        hfm.info({
            'media found: %o': output
        });
        return output;
    };

    function pause() {
        for (var i = 0; i < actors.play.length; i++) {
            hfm.jq(actors.play[i]).text('Play');
        }
        if (interval !== null) {
            clearInterval(interval);
        }
        state = false;
        interval = null;
    };

    function play() {
        for (var i = 0; i < actors.play.length; i++) {
            hfm.jq(actors.play[i]).text('Pause');
        }
        interval = setInterval(self.play, delay);
        state = true;
    };

    function register(ele) {
        var act = hfm.jq(ele).attr('gaction');
        if (act !== undefined) {
            hfm.jq(ele).unbind('click').click(self.action);
            if (actors[act] === undefined) {
                actors[act] = [];
            }
            actors[act].push(ele);
        }
    };

    function update(input) {
        var slide = parseInt(self.current);
        if (isNaN(slide) || slide == undefined) {
            return false;
        }
        if (_o(media).count() < slide || _o(media).count() == 0) {
            return false;
        }
        var skip = false;
        if (input != undefined && _o(input).hasKey('skipView')) {
            if (input.skipView == true) {
                skip = true;
            }
        }
        if (aIS.enabled == false) {
            aIS.delta = 0;
        }
        if (mode == 'base' && aIS.enabled == true) {
            // interstitial management here
            if (!aIS.delta) {
                loadViews();
            }
            if (aIS.delta >= aIS.count) {
                return interstitial();
            } else {
                if (loaded && skip != true) {
                    incrementView();
                }
            }
        }
        var fs = params.fullscreen;
        var mEle = media[slide];
        // update image
        hfm.jq(params.hero.base).fadeOut(500, function () {
            hfm.jq(this).attr('src', media[slide].hero).fadeIn(500);
            /*
				hfm.jq(this).attr('src', media[slide].hero).bind('load', function(){
					hfm.jq(this).attr('src', media[slide].hero).fadeIn(500);
				});
*/
        });
        hfm.jq(fs.container + ' ' + fs.hero).fadeOut(500, function () {
            hfm.jq(this).attr('src', media[slide].fullhero).fadeIn(500);
        });
        // update status
        if (roles.status !== false) {
            for (var i = 0; i < roles.status.length; i++) {
                hfm.jq(roles.status[i]).text((slide + 1) + ' of ' + _o(media).count());
            }
        }
        // update thumb state
        hfm.jq(params.thumbs + ' .active').removeClass('active');
        hfm.jq('#galleryThumbnail_' + slide).parent().addClass('active');
        if (fsReady) {
            hfm.jq(params.fullscreen.thumbs + ' .active').removeClass('active');
            hfm.jq('#gallery-fullscreen .gfThumb_' + slide).addClass('active');
        }
        // update caption (ignored for now)
        // update next/previous buttons if needed
        buttons();
        // update URL with hash
        hash.set('mode', mode);
        hash.set('slide', slide);
        hfm.ads.setKey('slide', (slide + 1));
        if (loaded && skip != true) {
            var sn = (self.current == 0) ? '1' : '2 plus';
            s.prop4 = s.evar4 = params.id;
            s.prop5 = s.evar5 = 'gallery';
            s.prop6 = s.evar6 = hfm.urlInfo.channel.toLowerCase();
            s.prop7 = s.evar7 = s.prop6 + ':' + hfm.ads.getZone(0);
            s.pageName = 'el:' + s.prop7 + ':' + hfm.ads.getKey('runseason') + ':' + hfm.ads.getKey('runfinder') + ':runway:show ' + params.id + ':slide ' + sn;
            hfm.info({
                'omniture: %o': s
            });
            switch (mode) {
            case 'fullthumbs':
            case 'fullscreen':
                hfm.ads.refresh('full');
                break;
            default:
                hfm.ads.refresh('base');
                break;
            }
        }
        hash.update();
    };

    function buttons() {
        var slide = parseInt(self.current);
        // reset buttons
        hfm.jq('.gallery-inactive').removeClass('gallery-inactive');
        if (slide < 1) {
            if (actors.previous != undefined) {
                for (var i = 0; i < actors.previous.length; i++) {
                    hfm.jq(actors.previous[i]).addClass('gallery-inactive');
                }
            }
        }
        if (slide > (_o(media).count() - 2)) {
            if (actors.next != undefined) {
                for (var i = 0; i < actors.next.length; i++) {
                    hfm.jq(actors.next[i]).addClass('gallery-inactive');
                }
            }
        }
    };

    function fsAssemble() {
        if (fsReady === true) {
            return;
        }
        var l = params.fullscreen.container + ' ' + params.fullscreen.thumbs;
        var hl = meta.designer + ' â€” ' + meta.season;
        hfm.jq(params.fullscreen.container + ' h2').text(hl);
        hfm.jq(l).empty();
        for (var i = 0; i < _o(media).count(); i++) {
            var el = hfm.ce('li', {
                'html': '<img src="' + media[i].fullthumb + '" gsn="' + i + '" />'
            });
            hfm.jq(el).attr('gaction', 'fulljump').addClass('gfThumb_' + i).click(self.action);
            if (i == parseInt(self.current)) {
                hfm.jq(el).addClass('active');
            }
            if ((i % 4) == 0) {
                hfm.jq(el).addClass('gf-row-final');
            }
            hfm.jq(l).append(el);
        }
        var h = hfm.jq(params.fullscreen.container + ' ' + params.fullscreen.hero);
        if (h.length < 1) {
            var p = params.fullscreen.hero.replace(' img', '');
            var q = hfm.jq('<img />');
            hfm.jq(q).attr('src', media[(self.current)].fullhero);
            hfm.jq(params.fullscreen.container + ' ' + p).prepend(q);
        }
        fsReady = true;
    };

    function setMode(to) {
        hash.set('mode', to);
        hash.update();
        mode = to;
    };

    function interstitial() {
        if (aIS.enabled != true) {
            return;
        }
        if (aIS.element != false) {
            return;
        }
        hfm.ads.setType('adi');
        var ad = hfm.ads.insert('615x865');
        var backer = hfm.ce('div', {
            'id': 'adBacker'
        });
        hfm.jq(backer).css({
            'display': 'none',
            'width': 643,
            'height': 840,
            'border-left': '6px solid black',
            'border-right': '6px solid black',
            'border-bottom': '6px solid black',
            'background-color': 'black',
            'text-align': 'center',
            'position': 'absolute',
            'z-index': '12000'
        });
        var msg = hfm.ce('p', {
            'html': '<b>ADVERTISEMENT</b> The gallery will update in <span id="ad-timeout">' + params.delay + '</span> seconds.'
        });
        hfm.jq(msg).css({
            'color': 'silver',
            'height': '12px',
            'font-size': '9px',
            'text-align': 'center'
        });
        var cl = hfm.ce('div', {
            'id': 'ad-close',
            'html': 'CLOSE'
        });
        hfm.jq(cl).css({
            'display': 'block',
            'padding': '4px',
            'position': 'absolute',
            'border': '1px solid white',
            'z-index': 20000,
            'float': 'right',
            'font-weight': 'bold',
            'font-size': '11px',
            'background-color': 'black',
            'color': 'white',
            'text-align': 'right',
            'cursor': 'pointer'
        });
        hfm.jq(cl).click(function () {
            self.inter({
                'close': true
            });
        });
        hfm.jq(backer).append(msg).append(ad);
        hfm.jq('body').append(backer).append(cl);
        hfm.position.over(cl, params.container + " .next-slide");
        var pos = hfm.jq(params.container).offset();
        hfm.jq(backer).css({
            top: (pos.top),
            left: (pos.left)
        }).fadeIn(500);
        aIS.element = backer;
        aIS.interval = setInterval(self.inter, 1000);
        aIS.cd = (delay / 1000);
    }

    function loadViews() {
        if (aIS.viewData == false) {
            var c = hfm.cookie.read(cookie);
            if (!c) {
                c = '';
            }
            aIS.viewData = new hfm.varString(c, {
                'eq': '[',
                'sc': ']',
                'mode': 'cookie'
            });
        }
        var gc = parseInt(aIS.viewData.get(params.id));
        aIS.delta = (!gc) ? 1 : gc;
    };

    function incrementView(reset) {
        if (mode != 'base') {
            return;
        }
        aIS.delta = (reset === true) ? 1 : (aIS.delta + 1);
        aIS.viewData.set(params.id, aIS.delta);
        aIS.viewData.update(cookie);
    }

    function toggleAds(mode) {
        var ads = hfm.ads.refreshable(); // manage ad slot display
        hfm.info({
            'displaying: %o': mode,
            'ads: %o': ads
        });
        for (var type in ads) {
            var placements = ads[type];
            var display = (type == mode) ? 'block' : 'none';
            hfm.info({
                'display: %o': display,
                'type: %o': type
            });
            for (var i = 0; i < placements.length; i++) {
                hfm.jq('#' + placements[i].id).parent().css('display', display);
            }
        }
    }
};
elle.dyn = new function () {};
elle.dyn.dropdown = function (type, target, params) {
    var self = this;
    var mode = (type == 'seasons') ? 'season' : 'designer';
    var src = '/elle_custom/feed/' + type.toLowerCase();
    var dest = target;
    var conf = (params != undefined) ? params : false;
    /*
	sources:
		http://www.elle.com/elle_custom/feed/seasons
		http://www.elle.com/elle_custom/feed/designers
		http://www.elle.com/elle_custom/feed/designers?gid=377777

	params:
		omni: true
		omni_id: event/var id (int)
		omni_suite: omniture suite code (string)
		omni_label: omniture event label (string)
		default_text: default option text (string)
	*/
    self.load = function () {
        $.ajax({
            type: "GET",
            url: src,
            dataType: "xml",
            success: function (xml) {
                var select = ce('select', {
                    'id': dest + '-select'
                });
                if (conf.default_text != undefined) {
                    hfm.jq(select).append(ce('option', {
                        'html': conf.default_text,
                        'value': ''
                    }));
                }
                hfm.jq(xml).find(mode).each(function () {
                    name = hfm.jq(this).find('name').text();
                    url = hfm.jq(this).find('link').text();
                    hfm.jq(select).append(ce('option', {
                        'html': name,
                        'value': url
                    }));
                });
                hfm.jq("#" + dest).empty().append(select);
                hfm.jq(select).click(function () {
                    var sel = this[this.selectedIndex];
                    if (conf.omni == true) {
                        var s = s_gi(conf.omni_suite);
                        s.linkTrackVars = 'prop' + conf.omni_id + ',eVar' + conf.omni_id + ',events';
                        s.linkTrackEvents = s.events = 'event' + conf.omni_id;
                        s['prop' + conf.omni_id] = s['eVar' + conf.omni_id] = hfm.jq(sel).text();
                        s.tl(this, 'o', conf.omni_label);
                    }
                    if (this.selectedIndex > 0) {
                        window.location.href = hfm.jq(sel).val();
                    }
                });
            }
        });
    };

    function init() {
        if (typeof (jQuery) != 'function') {
            return false;
        }
        if (conf.gallery != undefined) {
            src += '?gid=' + conf.gallery;
        }
        hfm.jq(function () {
            self.load();
        });
    };

    function ce(tag, params) {
        if (tag == undefined) {
            return false;
        }
        var ele = document.createElement(tag);
        if ((params) != undefined) {
            for (var iden in params) {
                switch (iden) {
                case 'id':
                    ele.id = params[iden];
                    break;
                case 'style':
                    hfm.jq(ele).addClass(params[iden]);
                    break;
                case 'html':
                    hfm.jq(ele).html(params[iden]);
                    break;
                default:
                    hfm.jq(ele).attr(iden, params[iden]);
                    break;
                }
            }
        }
        return ele;
    };
    init();
}
hfm.ads.control = [{
    'match': {
        'pagetype': 'gallery',
        'size': '728x90,1000x90,970x418'
    },
    'display': false
}, {
    'match': {
        'pagetype': 'gallery',
        'size': '728x90,970x90,970x418'
    },
    'display': false
}, {
    'match': {
        'sitename': 'hfmus.elle.video',
        'size': '728x90,970x90,970x418'
    },
    'display': false
}];