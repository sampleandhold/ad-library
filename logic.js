var rsi_segs = [];
var segs_beg = document.cookie.indexOf('jag_rsi_segs=');
if (segs_beg >= 0) {
    segs_beg = document.cookie.indexOf('=', segs_beg) + 1;
    if (segs_beg > 0) {
        var segs_end = document.cookie.indexOf(';', segs_beg);
        if (segs_end == -1) segs_end = document.cookie.length;
        rsi_segs = document.cookie.substring(segs_beg, segs_end).split('|');
    }
}
var segLen = 20
var segQS = "",
    segArr = new Array()
    if (rsi_segs.length < segLen) {
        segLen = rsi_segs.length
    }
for (var i = 0; i < segLen; i++) {
    segArr = rsi_segs[i].split("_")
    if (segArr.length > 1) segQS += ("btseg" + "=" + segArr[1] + ";");
}
//if(document.URL.indexOf("dev") >= 0){
hfm.cd.page.companion = true;
//}else{hfm.cd.page.companion = false;}
var cdAdLogic = (function () {
    hfm.cd.page.showZoomTools = true;
    if (window.location.href.indexOf("roadandtrack.com") >= 0) {
        hfm.brand = 'rt';
    } else if (window.location.href.indexOf("caranddriver.com") >= 0 || window.location.href.indexOf(".cd.") >= 0) {
        hfm.brand = 'cd';
    }
    var debug = true;
    return {
        cleanUp: function (item) {
            var item2 = item.replace(/[^a-zA-Z 0-9]+/g, '').toLowerCase();
            return item2;
        },
        removeSpaces: function (string) {
            if (string) {
                return string.split(' ').join('');
            }
        },
        exoticEval: function (make) {
            var exoticMakesArray = ["alfa%20romeo", "aston%20martin", "bentley", "bugatti", "caterham", "chery", "citroen", "daimler", "ferrari", "fisker", "funke_will_ag", "geely", "holden", "lamborghini", "lotus", "maserati", "maybach", "morgan", "mosler", "oldsmobile", "opel", "panoz", "peugeot", "renault", "rolls_royce", "saleen", "seat", "skoda", "spyker", "tesla"];
            var a = exoticMakesArray.length,
                d = false;
            for (x = 0; x < a; x++) {
                if (make === exoticMakesArray[x]) {
                    d = true;
                }
            }
            if (d === true) {
                return true;
            } else {
                return false;
            }
        },
        luxuryEval: function (make) {
            var luxuryMakesArray = ["acura", "alfa%20romeo", "aston%20martin", "audi", "bentley", "bmw", "bugatti", "cadillac", "ferrari", "infiniti", "jaguar", "lamborghini", "land%20rover", "lexus", "lincoln", "lotus", "maserati", "maybach", "mercedes-benz", "morgan", "mosler", "porsche", "rolls-royce", "saab", "saleen", "spyker", "volvo"];
            var a = luxuryMakesArray.length,
                d = false;
            for (x = 0; x < a; x++) {
                if (make === luxuryMakesArray[x]) {
                    d = true;
                }
            }
            if (d === true) {
                return true;
            } else {
                return false;
            }
        },
        //production status logic
        prodStatus: function (modelYear) {
            var d = new Date();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            var proj;
            var yearEnd;
            var x;
            var newYear;
            if (month > 6) {
                yearEnd = true;
            } else {
                yearEnd = false;
            }
            if (yearEnd === true) {
                x = 1;
            } else {
                x = 0;
            }
            newYear = year + x;
            if ((modelYear - newYear) >= -2) {
                isCurrent = true;
            } else {
                isCurrent = false;
            }
            if (isCurrent === true) {
                //console.log('is current');
                return true;
            } else {
                //console.log('is not current');
                return false;
            }
        },
        sectionTypeEval: function (section_type) {
            Object.size = function (obj) {
                section_type = section_type.toLowerCase();
                var size = 0,
                    key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }
                return size;
            };
            var sectionTypes = new cdAdLogic.typeList();
            var sectionSize = Object.size(sectionTypes);
            var answer = [];
            var i = 0;
            for (i = 0; i < sectionSize; i++) {
                if (sectionTypes[i][1] == section_type) {
                    answer[0] = sectionTypes[i][0];
                    answer[1] = sectionTypes[i][1];
                    break;
                }
            }
            //if (answer == 'u'){answer = 't';}
            //alert(answer);
            return answer;
        },
        doLogic: function (nodes, level, dictionary) {
            //console.log('bodystyle: '+nodes.bodyStyle);
            //console.log(nodes.bodyStyle);
            //console.log('logic level: '+level);
            //console.log(level);
            //figure out pagetype from nodes
            var setupInfo = {};
            var pagetype = nodes.sectionType[0];
            var pagetypeText = nodes.sectionType[1];
            //console.log('pagetype text: '+pagetypeText);
            //console.log('pagetype: '+pagetype);
            switch (level) {
            case "gearbox":
                if (nodes.section == "landing") {
                    pagetype = "gbl";
                }
                setupInfo = cdAdLogic.getDetails('gearbox', pagetype, pagetypeText, dictionary, level);
                break;
            case "sub":
                if (nodes.isCurrent === false) {
                    if (nodes.isExotic === true) {
                        setupInfo = cdAdLogic.getDetails('usedCarEnthusiast', pagetype, pagetypeText, dictionary, level); //go to used enthusiast
                    } else {
                        setupInfo = cdAdLogic.getDetails('usedCarInMarket', pagetype, pagetypeText, dictionary, level); //go to used in market
                    }
                } else {
                    if (nodes.manStatus === false) {
                        if (nodes.isExotic === true) {
                            setupInfo = cdAdLogic.getDetails('enthusiastModel', pagetype, pagetypeText, dictionary, level); //go to enthusiast model
                        } else {
                            setupInfo = cdAdLogic.getDetails('inMarketModel', pagetype, pagetypeText, dictionary, level); //go to in market model
                        }
                    } else {
                        setupInfo = cdAdLogic.getDetails('enthusiastModel', pagetype, pagetypeText, dictionary, level); //go to enthusiast model
                    }
                }
                break;
            case "model":
                if (nodes.inMarket === true || cdAdLogic.isBuyersGuide === true || pagetype == "o" || pagetype == "l") {
                    if (nodes.isExotic === true) {
                        setupInfo = cdAdLogic.getDetails('enthusiastModel', pagetype, pagetypeText, dictionary, level); //go to enthusiast model
                    } else {
                        setupInfo = cdAdLogic.getDetails('inMarketModel', pagetype, pagetypeText, dictionary, level); //go to in market model
                    }
                } else {
                    setupInfo = cdAdLogic.getDetails('enthusiastModel', pagetype, pagetypeText, dictionary, level); //go to enthusiast model
                }
                break;
            case "make":
                if (nodes.isExotic === false) {
                    //console.log('inMarketMake');
                    setupInfo = cdAdLogic.getDetails('inMarketMake', pagetype, pagetypeText, dictionary, level); //go to in-market make
                } else {
                    //console.log('enthusiastMake');
                    setupInfo = cdAdLogic.getDetails('enthusiastMake', pagetype, pagetypeText, dictionary, level); //go to enthusiast make
                }
                break;
            case "bodyStyle":
                if (nodes.bodyStyle && nodes.bodyStyle !== "") {
                    setupInfo = cdAdLogic.getDetails('inMarketCategory', pagetype, pagetypeText, dictionary, level); //go to in market category
                } else {
                    if (nodes.contentType == "landing") {
                        setupInfo = cdAdLogic.getDetails('landings', pagetype, pagetypeText, dictionary, level); //go to landings
                    } else {
                        if (nodes.inMarket === true || pagetype == "k" || pagetype == "o" || pagetype == "l") {
                            setupInfo = cdAdLogic.getDetails('inMarketOther', pagetype, pagetypeText, dictionary, level); //go to in market other
                        } else {
                            setupInfo = cdAdLogic.getDetails('other', pagetype, pagetypeText, dictionary, level); //go to other
                        }
                    }
                }
                break;
            default:
                alert("no car for you, ride a bike instead");
            }
            // put exceptions to the rules here:
            /*
            if (nodes.contentType == "blog post" && nodes.section == "blog" && nodes.sectionType[1] == "car news"){
             setupInfo.site = "cd.blog.enth.dfp";
            } 
            */
            //console.log('inMarket: '+nodes.inMarket+ 'bodystyle: '+nodes.bodyStyle+' make: '+nodes.make+ ' sectiontype: '+nodes.sectionType[1]);
            if ((nodes.inMarket == false || nodes.inMarket == undefined) && (nodes.bodyStyle == "" || nodes.bodyStyle == undefined) && (nodes.make == "" || nodes.make == undefined) && nodes.sectionType[1] == "photo gallery") {
                setupInfo.site = hfm.brand + ".gallery.enth.dfp";
            }
            // end exceptions
            var dartSite = setupInfo.site;
            if (document.URL.indexOf("roadandtrack") >= 0) {
                dartSite = dartSite.replace(/cd/i, "rt");
                var rtCheck = true;
            } else {
                var rtCheck = false;
            }
            var dartZone = [];
            dartZone = setupInfo.zone.split("/");
            //console.log('dartZone');
            //console.log(dartZone);
            var prodKey = setupInfo.prod;
            var secKey = setupInfo.sec;
            var adFlow = setupInfo.adFlow;
            if (nodes.bodyStyle) {
                var cleanBody = cdAdLogic.cleanUp(nodes.bodyStyle);
            }
            if (nodes.model) {
                var cleanModel = cdAdLogic.cleanUp(nodes.model);
            }
            if (nodes.submodel) {
                var cleanSubModel = cdAdLogic.cleanUp(nodes.submodel);
            }
            if (nodes.make) {
                var cleanMake = cdAdLogic.cleanUp(nodes.make);
            }
            if (nodes.marketSegment) {
                var cleanMarket = cdAdLogic.cleanUp(nodes.marketSegment);
            }
            // build u value
            var btsegUList = [];
            btsegUList = segQS.split(";");
            //console.log('the split segqs');
            //console.log(btsegUList);
            var uBtseg = "";
            for (var i = 0; i < btsegUList.length; i++) {
                if (btsegUList[i] == "") {
                    btsegUList.splice(i, 1);
                }
            }
            for (var i = 0; i < btsegUList.length; i++) {
                uBtseg += btsegUList[i].replace("=", "_");
                if (btsegUList.length > 1 && i < btsegUList.length) {
                    uBtseg += "|";
                }
            }
            var uText = "";
            if (secKey !== "") {
                uText += "section_" + secKey;
            }
            if (nodes.id !== "") {
                uText += "|content_" + nodes.id;
            }
            if (prodKey !== "") {
                uText += "|prod_" + prodKey;
            }
            //if(cleanMarket !== ""){uText += "|type_"+cleanMarket;}
            //+"|sz_100x100|"
            // end u
            hfm.cd.page.adflow = adFlow;
            hfm.cd.page.refreshZoomInt = 0;
            hfm.cd.page.refreshPageInt = 0;
            //console.log('here\'s the adtype:');
            //console.log(hfm.cd.page.adflow);
            hfm.ads.setup();
            hfm.ads.setSitename(dartSite);
            for (i = 0; i <= dartZone.length; i++) {
                if (dartZone[i] !== "" && dartZone[i] !== undefined) {
                    hfm.ads.appendZone(dartZone[i]);
                }
            }
            hfm.ads.clearKey('subch');
            hfm.ads.setKey('dcove', 'd');
            if (prodKey !== "") {
                hfm.ads.setKey('prod', prodKey);
            }
            if (secKey !== "") {
                hfm.ads.setKey('section', secKey);
            }
            // simplified ad flows
            if (adFlow == "category" && cleanBody !== "" && cleanBody !== "norelation") {
                hfm.ads.setKey('body', cleanBody);
            }
            //if (adFlow == "make/model" && (cleanMarket == "hybrid" || cleanMarket == "electric" || cleanMarket == "luxury")){hfm.ads.setKey('style',cleanMarket);}
            if (adFlow == "make/model") {
                if (cleanMarket !== undefined && cleanMarket != "") {
                    cleanMarket = cleanMarket.toLowerCase();
                    //if (cleanMarket.indexOf("luxury") != -1 && cleanMarket.indexOf("entry") == -1) {
                    if (cleanMarket.indexOf("luxury") != -1) {
                        hfm.ads.setKey('style', 'luxury');
                    }
                    if (cleanMarket.indexOf("hybrid") != -1) {
                        hfm.ads.setKey('style', 'hybrid');
                    }
                    if (cleanMarket.indexOf("electric") != -1) {
                        hfm.ads.setKey('style', 'electric');
                    }
                }
                if (cleanModel !== undefined && cleanModel !== "") {
                    hfm.ads.setKey('mod', cleanModel);
                    uText += "|mod_" + cleanModel;
                }
                if (cleanBody !== undefined && cleanBody !== "") {
                    hfm.ads.setKey('type', cleanBody);
                }
                if (nodes.year !== undefined && nodes.year !== "") {
                    hfm.ads.setKey('year', nodes.year);
                }
                if (cleanMake !== "" && cleanMake !== undefined && (cleanModel == "" || cleanModel == undefined) && nodes.isLuxury == true) {
                    hfm.ads.setKey('style', 'luxury');
                }
                if (cleanModel !== "" && cleanSubModel == "") {
                    hfm.ads.setKey('mod', cleanModel);
                }
                if (cleanMake !== undefined && cleanMake !== "") {
                    hfm.ads.setKey('mak', cleanMake);
                    uText += "|mak_" + cleanMake;
                }
                if (nodes.year !== undefined && nodes.year !== "") {
                    uText += "|yr_" + nodes.year;
                }
                if (cleanBody !== undefined && cleanBody !== "") {
                    uText += "|type_" + cleanBody;
                }
                if (nodes.isLuxury == true) {
                    uText += "|style_luxury";
                }
                if (cleanSubModel !== "") {
                    hfm.ads.setKey('submodel', cleanSubModel);
                    uText += "|submodel_" + cleanSubModel;
                }
            }
            //if (adFlow == "make/model" && cleanSubModel !==""){hfm.ads.setKey('type',cleanSubModel);}
            if (uBtseg !== "") {
                uText += "|" + uBtseg;
            } else {
                uText += "|";
            }
            if (adFlow == "video" && cleanBody !== "") {
                hfm.ads.setKey('type', cleanBody);
            }
            if (cleanMarket) {
                cleanMarket = cleanMarket.toLowerCase();
            }
            if (cleanMarket) {
                if (adFlow == "video" && (cleanMarket.indexOf("luxury") != -1 && cleanMarket.indexOf("entry") == -1)) {
                    hfm.ads.setKey('style', 'luxury');
                }
                if (adFlow == "video" && cleanMarket.indexOf("hybrid") != -1) {
                    hfm.ads.setKey('style', 'hybrid');
                }
                if (adFlow == "video" && cleanMarket.indexOf("electric") != -1) {
                    hfm.ads.setKey('style', 'electric');
                }
            }
            if (adFlow == "video" && nodes.year !== "") {
                hfm.ads.setKey('year', nodes.year);
            }
            if (adFlow == "video" && cleanModel !== "" && cleanSubModel == "") {
                hfm.ads.setKey('mod', cleanModel);
            }
            if (adFlow == "video" && cleanMake !== "") {
                hfm.ads.setKey('mak', cleanMake);
            }
            if (adFlow == "ros" && cleanModel !== "") {
                hfm.ads.setKey('mod', cleanModel);
            }
            if (adFlow == "ros" && cleanMake !== "") {
                hfm.ads.setKey('mak', cleanMake);
            }
            if (adFlow == "ros" && cleanMake !== "" && nodes.isLuxury == true) {
                hfm.ads.setKey('style', 'luxury');
            }
            if (adFlow == "gearbox" || adFlow == "gearboxLanding") {
                hfm.ads.setKey('jumpstart', 'gearheader');
            }
            // additional key values
            if (pagetype == "d" || pagetype == "bb" || (nodes.section == "Auto%20Shows" && nodes.contentType == "gallery")) {
                var showValue = "yes";
            } else {
                var showValue = "null";
            }
            hfm.ads.setKey('show', showValue);
            if (pagetype == "a" && nodes.id !== "") {
                hfm.ads.setKey('content', nodes.id);
            }
            if (window.location.href.indexOf("stage") != -1) {
                hfm.ads.setKey('test', 'cd');
                if (window.location.href.indexOf("car-videos") != -1) {
                    hfm.ads.setKey('test', 'video3');
                }
            }
            if (window.location.href.indexOf("dev-www") != -1) {
                //hfm.ads.setKey('test', 'jumpstarttoyota');
                if (window.location.href.indexOf("car-videos") != -1) {}
            }
            hfm.cd.page.uText = uText;
        },
        getDetails: function (algorithm, pagetype, pagetypeText, dictionary, level) {
            //console.log('logic type: '+algorithm);
            //console.log('section_type short code: '+pagetype);
            //console.log(pagetype);
            //console.log('section_type: '+pagetypeText);
            //console.log(pagetypeText);
            var theGoods1 = dictionary[algorithm];
            //console.log('logic level value set for '+level+', '+algorithm+':');
            //console.log(dictionary[algorithm]);           
            var theGoods2 = theGoods1.breakdown[pagetype];
            if (theGoods1.breakdown[pagetype] != undefined) {
                //console.log('final ad call values:');           
                //console.log(theGoods1.breakdown[pagetype]);
            } else {
                var errortext = ('the page is breaking because the target section_type ' + pagetypeText + ' does not exist in the logic level ' + level + ', ' + algorithm + ' value set');
                //console.log(errortext);
            }
            return theGoods2;
        },
        decisionNodes: function (atts) {
            if (atts.id) {
                this.id = atts.id;
            }
            if (atts.section) {
                this.section = encodeURIComponent(atts.section);
            }
            if (atts.year) {
                this.year = encodeURIComponent(atts.year);
            }
            if (atts.make_name) {
                this.make = encodeURIComponent(atts.make_name).toLowerCase();
            }
            if (atts.model_name) {
                this.model = cdAdLogic.removeSpaces(atts.model_name).toLowerCase();
            }
            if (atts.submodel_name) {
                this.submodel = cdAdLogic.removeSpaces(atts.submodel_name).toLowerCase();
            }
            if (atts.make_name) {
                this.isExotic = cdAdLogic.exoticEval(this.make);
            }
            if (atts.make_name) {
                this.isLuxury = cdAdLogic.luxuryEval(this.make);
            }
            if (atts.body_style_name) {
                this.bodyStyle = cdAdLogic.removeSpaces(atts.body_style_name).toLowerCase();
            }
            if (this.bodyStyle == 'norelation') {
                this.bodyStyle = '';
            }
            if (atts.in_market) {
                this.inMarket = atts.in_market;
            }
            this.manStatus = (atts.msotpnm != 7 ? false : true);
            if (atts.year) {
                this.isCurrent = cdAdLogic.prodStatus(atts.year);
            }
            this.sectionType = cdAdLogic.sectionTypeEval(atts.section_type);
            if (this.sectionType[0] == 't') {
                this.sectionType[0] = 'e';
                this.sectionType[1] = 'Comparison Tests';
            }
            if (this.sectionType[0] == 'u') {
                this.sectionType[0] = 'c';
                this.sectionType[1] = 'Feature';
            }
            if (atts.content_type) {
                this.contentType = atts.content_type;
            }
            if (atts.market_segment) {
                this.marketSegment = atts.market_segment.toLowerCase();
            }
            if (atts.is_spec) {
                this.isSpec = atts.is_spec;
            }
            //console.log('spec: '+this.isSpec);
        },
        typeList: function () {
            this[0] = ['a', 'article'];
            this[1] = ['b', 'car news'];
            this[2] = ['c', 'feature'];
            this[3] = ['d', 'auto show'];
            this[4] = ['e', 'comparison tests'];
            this[5] = ['f', 'information page'];
            this[6] = ['g', 'video'];
            this[7] = ['h', 'awards'];
            this[8] = ['i', 'green/eco'];
            this[9] = ['j', 'photo gallery'];
            this[10] = ['k', 'buyers guide'];
            this[11] = ['l', 'article listing'];
            this[12] = ['m', 'backfires'];
            this[13] = ['n', 'buyers guide pricing page'];
            this[14] = ['o', 'search results'];
            this[15] = ['p', '404'];
            this[16] = ['q', 'racing'];
            this[17] = ['r', 'technical'];
            this[18] = ['s', 'comparison test subpages'];
            this[19] = ['t', 'comparison'];
            this[20] = ['u', 'comparison feature'];
            this[21] = ['v', 'homepage'];
            this[22] = ['x', 'buyers guide used'];
            this[23] = ['y', 'blog'];
            this[24] = ['z', 'reviews'];
            this[25] = ['aa', 'features'];
            this[26] = ['bb', 'auto shows'];
            this[27] = ['cc', 'gearbox'];
            this[28] = ['ee', 'comparison tests used'];
            this[29] = ['ff', 'cpo'];
            this[30] = ['hh', 'buyers guide pricing'];
        },
        siteList: function () {
            this.a = 'cd.new.mark.dfp';
            this.b = 'cd.comp.dfp';
            this.c = 'cd.gallery.mark.dfp';
            this.d = 'cd.gallery.enth.dfp';
            this.e = 'cd.new.enth.dfp';
            this.f = 'cd.video.enth.dfp';
            this.g = 'rt.racing.enth.dfp';
            this.h = 'rt.technical.enth.dfp';
            this.i = 'cd.home.dfp';
            this.j = 'cd.blog.enth';
            this.k = 'cd.ucomp.enth.dfp';
            this.l = 'cd.cpo.dfp';
            this.m = 'cd.used.mark.dfp';
            this.n = 'cd.used.enth.dfp';
            this.o = 'cd.ugallery.mark.dfp';
            this.p = 'cd.ugallery.enth.dfp';
            this.q = 'cd.features.enth.dfp';
            this.r = 'cd.comp.mark.dfp';
            this.s = 'cd.show.enth.dfp';
            this.t = 'cd.features.mark.dfp';
            this.u = 'cd.show.mark.dfp';
            this.v = 'cd.ufeatures.enth.dfp';
            this.w = 'cd.ucomp.mark.dfp';
            this.x = 'cd.blog.dfp';
            this.y = 'cd.ufeatures.mark.dfp';
            this.z = 'cd.enth.dfp';
            this.aa = 'cd.news.enth.dfp';
            this.bb = 'cd.blog.enth.dfp';
            this.zzz = '';
        },
        zoneList: function () {
            this.a = '/rv/mod/';
            this.b = '/bg/mod/';
            this.c = '/null/mod/';
            this.d = '/rv/mak/';
            this.e = '/bg/mak/';
            this.f = '/null/mak/';
            this.g = '/rv/ct/';
            this.h = '/bg/ct/';
            this.i = '/null/ct/';
            this.j = '/ld/';
            this.k = '/';
            this.l = '/rt/';
            this.m = '/at/green/';
            this.n = '/rv/';
            this.o = '/bg/';
            this.p = '/at/gearbox/mak/';
            this.q = '/rt/mod/';
            this.r = '/rt/mak/';
            this.s = '/null/';
            this.t = '/null/show/';
            this.u = '/at/mod/';
            this.v = '/at/mak/';
            this.w = '/at/gearbox/mod/';
            this.x = '/at/gearbox/ct/';
            this.y = '/at/gearbox/';
            this.zzz = '';
        },
        adFlowList: function () {
            this.a = 'make/model';
            this.b = 'video';
            this.c = 'ros';
            this.d = 'category';
            this.e = 'landing';
            this.f = 'backfires';
            this.g = 'gearbox';
            this.h = 'gearboxLanding';
            this.i = 'homepage';
            this.zzz = '';
        },
        sectionList: function () {
            this.a = 'reviews';
            this.b = 'video';
            this.c = 'gallery';
            this.d = 'buyers_guide';
            this.e = 'pricing';
            this.f = 'comp';
            this.g = 'gearbox';
            this.h = 'articles';
            this.i = 'search';
            this.j = 'racing';
            this.k = 'technical';
            this.l = 'social';
            this.zzz = '';
        },
        prodList: function () {
            this.a = 'model';
            this.b = 'ratings';
            this.c = 'make';
            this.d = 'category';
            this.e = 'gearbox';
            this.f = 'show';
            this.g = 'pricing';
            this.h = 'landingpage';
            this.i = 'green';
            this.j = 'CPO';
            this.zzz = '';
        },
        algorithmList: function (make, model, bodystyle, zones, sites, adflow, sections, prods, other, subtype, show) {
            this.inMarketModel = {
                "breakdown": {
                    "a": {
                        "site": sites.a,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.a
                    },
                    "b": {
                        "site": sites.a,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.a
                    },
                    "c": {
                        "site": sites.a,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.a
                    },
                    "d": {
                        "site": sites.a,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.zzz,
                        "prod": prods.f
                    },
                    "e": {
                        "site": sites.r,
                        "zone": zones.c + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.f,
                        "prod": prods.a
                    },
                    "f": {
                        "site": sites.a,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.a
                    },
                    "g": {
                        "site": sites.f,
                        "zone": zones.c + model + "/",
                        "adFlow": adflow.b,
                        "sec": sections.b,
                        "prod": prods.a
                    },
                    "h": {
                        "site": sites.a,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.zzz,
                        "prod": prods.b
                    },
                    "i": {
                        "site": sites.a,
                        "zone": zones.m + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.i
                    },
                    "j": {
                        "site": sites.c,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.c,
                        "prod": prods.a
                    },
                    "k": {
                        "site": sites.a,
                        "zone": zones.b + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.d,
                        "prod": prods.a
                    },
                    "l": {
                        "site": sites.a,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.a
                    },
                    "m": {
                        "site": sites.zzz,
                        "zone": zones.zzz,
                        "adFlow": adflow.zzz,
                        "sec": sections.zzz,
                        "prod": prods.zzz
                    },
                    "n": {
                        "site": sites.a,
                        "zone": zones.b + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.e,
                        "prod": prods.a
                    },
                    "o": {
                        "site": sites.a,
                        "zone": zones.b + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.i,
                        "prod": prods.a
                    },
                    "cc": {
                        "site": sites.a,
                        "zone": zones.w + model + "/",
                        "adFlow": adflow.d,
                        "sec": sections.zzz,
                        "prod": prods.e
                    }
                }
            };
            this.inMarketMake = {
                "breakdown": {
                    "a": {
                        "site": sites.a,
                        "zone": zones.d + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.c
                    },
                    "b": {
                        "site": sites.a,
                        "zone": zones.d + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.c
                    },
                    "c": {
                        "site": sites.a,
                        "zone": zones.d + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.c
                    },
                    "d": {
                        "site": sites.a,
                        "zone": zones.d + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.zzz,
                        "prod": prods.f
                    },
                    "e": {
                        "site": sites.r,
                        "zone": zones.f + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.f,
                        "prod": prods.c
                    },
                    "f": {
                        "site": sites.a,
                        "zone": zones.d + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.c
                    },
                    "g": {
                        "site": sites.f,
                        "zone": zones.f + make + "/",
                        "adFlow": adflow.b,
                        "sec": sections.b,
                        "prod": prods.c
                    },
                    "h": {
                        "site": sites.a,
                        "zone": zones.d + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.c
                    },
                    "i": {
                        "site": sites.a,
                        "zone": zones.m + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.i
                    },
                    "j": {
                        "site": sites.c,
                        "zone": zones.d + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.c,
                        "prod": prods.c
                    },
                    "k": {
                        "site": sites.a,
                        "zone": zones.e + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.d,
                        "prod": prods.c
                    },
                    "l": {
                        "site": sites.a,
                        "zone": zones.d + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.h,
                        "prod": prods.c
                    },
                    "m": {
                        "site": sites.zzz,
                        "zone": zones.zzz,
                        "adFlow": adflow.zzz,
                        "sec": sections.zzz,
                        "prod": prods.zzz
                    },
                    "o": {
                        "site": sites.a,
                        "zone": zones.e + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.i,
                        "prod": prods.c
                    },
                    "cc": {
                        "site": sites.a,
                        "zone": zones.p + make + "/",
                        "adFlow": adflow.d,
                        "sec": sections.zzz,
                        "prod": prods.e
                    }
                }
            };
            this.enthusiastModel = {
                "breakdown": {
                    "a": {
                        "site": sites.z,
                        "zone": zones.u + model + "/",
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.a
                    },
                    "b": {
                        "site": sites.aa,
                        "zone": zones.u + model + "/",
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.a
                    },
                    "c": {
                        "site": sites.q,
                        "zone": zones.u + model + "/",
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.a
                    },
                    "d": {
                        "site": sites.s,
                        "zone": zones.u + model + "/",
                        "adFlow": adflow.c,
                        "sec": sections.zzz,
                        "prod": prods.f
                    },
                    "e": {
                        "site": sites.r,
                        "zone": zones.c + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.f,
                        "prod": prods.a
                    },
                    "f": {
                        "site": sites.e,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.a
                    },
                    "g": {
                        "site": sites.f,
                        "zone": zones.c + model + "/",
                        "adFlow": adflow.b,
                        "sec": sections.b,
                        "prod": prods.a
                    },
                    "h": {
                        "site": sites.z,
                        "zone": zones.q + model + "/",
                        "adFlow": adflow.c,
                        "sec": sections.zzz,
                        "prod": prods.b
                    },
                    "i": {
                        "site": sites.z,
                        "zone": zones.m + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.h,
                        "prod": prods.zzz
                    },
                    "j": {
                        "site": sites.d,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.c,
                        "sec": sections.c,
                        "prod": prods.a
                    },
                    "k": {
                        "site": sites.z,
                        "zone": zones.b + model + "/",
                        "adFlow": adflow.c,
                        "sec": sections.d,
                        "prod": prods.a
                    },
                    "o": {
                        "site": sites.e,
                        "zone": zones.b + model + "/",
                        "adFlow": adflow.c,
                        "sec": sections.i,
                        "prod": prods.a
                    },
                    "l": {
                        "site": sites.z,
                        "zone": zones.u + model + "/",
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.a
                    },
                    "m": {
                        "site": sites.zzz,
                        "zone": zones.zzz,
                        "adFlow": adflow.zzz,
                        "sec": sections.zzz,
                        "prod": prods.zzz
                    },
                    "q": {
                        "site": sites.g,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.j,
                        "prod": prods.zzz
                    },
                    "r": {
                        "site": sites.h,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.k,
                        "prod": prods.zzz
                    },
                    "n": {
                        "site": sites.e,
                        "zone": zones.b + model + "/",
                        "adFlow": adflow.c,
                        "sec": sections.d,
                        "prod": prods.a
                    },
                    "cc": {
                        "site": sites.a,
                        "zone": zones.w + model + "/",
                        "adFlow": adflow.d,
                        "sec": sections.zzz,
                        "prod": prods.e
                    }
                }
            };
            this.enthusiastMake = {
                "breakdown": {
                    "a": {
                        "site": sites.z,
                        "zone": zones.v + make + "/",
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.c
                    },
                    "b": {
                        "site": sites.aa,
                        "zone": zones.v + make + "/",
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.c
                    },
                    "c": {
                        "site": sites.q,
                        "zone": zones.v + make + "/",
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.c
                    },
                    "d": {
                        "site": sites.s,
                        "zone": zones.f + make + "/",
                        "adFlow": adflow.c,
                        "sec": sections.zzz,
                        "prod": prods.c
                    },
                    "e": {
                        "site": sites.r,
                        "zone": zones.d + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.f,
                        "prod": prods.c
                    },
                    "f": {
                        "site": sites.e,
                        "zone": zones.d + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.c
                    },
                    "g": {
                        "site": sites.f,
                        "zone": zones.f + make + "/",
                        "adFlow": adflow.b,
                        "sec": sections.b,
                        "prod": prods.c
                    },
                    "h": {
                        "site": sites.e,
                        "zone": zones.r + make + "/",
                        "adFlow": adflow.c,
                        "sec": sections.zzz,
                        "prod": prods.b
                    },
                    "i": {
                        "site": sites.e,
                        "zone": zones.m + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.h,
                        "prod": prods.zzz
                    },
                    "j": {
                        "site": sites.d,
                        "zone": zones.d + make + "/",
                        "adFlow": adflow.c,
                        "sec": sections.c,
                        "prod": prods.c
                    },
                    "k": {
                        "site": sites.e,
                        "zone": zones.e + make + "/",
                        "adFlow": adflow.c,
                        "sec": sections.d,
                        "prod": prods.c
                    },
                    "o": {
                        "site": sites.e,
                        "zone": zones.e + make + "/",
                        "adFlow": adflow.c,
                        "sec": sections.i,
                        "prod": prods.c
                    },
                    "l": {
                        "site": sites.z,
                        "zone": zones.v + make + "/",
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.c
                    },
                    "m": {
                        "site": sites.zzz,
                        "zone": zones.zzz,
                        "adFlow": adflow.zzz,
                        "sec": sections.zzz,
                        "prod": prods.zzz
                    },
                    "q": {
                        "site": sites.g,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.j,
                        "prod": prods.zzz
                    },
                    "r": {
                        "site": sites.h,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.k,
                        "prod": prods.zzz
                    },
                    "n": {
                        "site": sites.e,
                        "zone": zones.e + make + "/",
                        "adFlow": adflow.c,
                        "sec": sections.e,
                        "prod": prods.c
                    },
                    "cc": {
                        "site": sites.a,
                        "zone": zones.p + make + "/",
                        "adFlow": adflow.d,
                        "sec": sections.zzz,
                        "prod": prods.e
                    }
                }
            };
            this.gearbox = {
                "breakdown": {
                    "cc": {
                        "site": sites.a,
                        "zone": zones.p + make + "/",
                        "adFlow": adflow.d,
                        "sec": sections.zzz,
                        "prod": prods.e
                    },
                    "gbl": {
                        "site": sites.a,
                        "zone": zones.p + make + "/",
                        "adFlow": adflow.h,
                        "sec": sections.zzz,
                        "prod": prods.e
                    }
                }
            };
            this.inMarketCategory = {
                "breakdown": {
                    "a": {
                        "site": sites.a,
                        "zone": zones.g + bodystyle + "/",
                        "adFlow": adflow.d,
                        "sec": sections.a,
                        "prod": prods.d
                    },
                    "b": {
                        "site": sites.a,
                        "zone": zones.g + bodystyle + "/",
                        "adFlow": adflow.d,
                        "sec": sections.a,
                        "prod": prods.d
                    },
                    "c": {
                        "site": sites.a,
                        "zone": zones.g + bodystyle + "/",
                        "adFlow": adflow.d,
                        "sec": sections.a,
                        "prod": prods.d
                    },
                    "d": {
                        "site": sites.a,
                        "zone": zones.g + bodystyle + "/",
                        "adFlow": adflow.d,
                        "sec": sections.zzz,
                        "prod": prods.f
                    },
                    "e": {
                        "site": sites.r,
                        "zone": zones.i + bodystyle + "/",
                        "adFlow": adflow.d,
                        "sec": sections.f,
                        "prod": prods.d
                    },
                    "f": {
                        "site": sites.a,
                        "zone": zones.g + bodystyle + "/",
                        "adFlow": adflow.d,
                        "sec": sections.a,
                        "prod": prods.d
                    },
                    "g": {
                        "site": sites.f,
                        "zone": zones.i + bodystyle + "/",
                        "adFlow": adflow.b,
                        "sec": sections.b,
                        "prod": prods.zzz
                    },
                    "h": {
                        "site": sites.a,
                        "zone": zones.g + bodystyle + "/",
                        "adFlow": adflow.d,
                        "sec": sections.zzz,
                        "prod": prods.b
                    },
                    "i": {
                        "site": sites.a,
                        "zone": zones.m + bodystyle + "/",
                        "adFlow": adflow.d,
                        "sec": sections.h,
                        "prod": prods.i
                    },
                    "j": {
                        "site": sites.c,
                        "zone": zones.i + bodystyle + "/",
                        "adFlow": adflow.d,
                        "sec": sections.c,
                        "prod": prods.d
                    },
                    "k": {
                        "site": sites.a,
                        "zone": zones.h + bodystyle + "/",
                        "adFlow": adflow.d,
                        "sec": sections.d,
                        "prod": prods.d
                    },
                    "cc": {
                        "site": sites.a,
                        "zone": zones.x + bodystyle + "/",
                        "adFlow": adflow.d,
                        "sec": sections.zzz,
                        "prod": prods.e
                    }
                }
            };
            this.inMarketOther = {
                "breakdown": {
                    "a": {
                        "site": sites.a,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.zzz
                    },
                    "b": {
                        "site": sites.a,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.a,
                        "prod": prods.zzz
                    },
                    "c": {
                        "site": sites.a,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.a,
                        "prod": prods.zzz
                    },
                    "d": {
                        "site": sites.u,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.zzz,
                        "prod": prods.f
                    },
                    "s": {
                        "site": sites.a,
                        "zone": zones.k + other + "/" + subtype + "/",
                        //this needs to get fixed
                        "adFlow": adflow.c,
                        "sec": sections.f,
                        "prod": prods.zzz
                    },
                    "e": {
                        "site": sites.r,
                        "zone": zones.s,
                        "adFlow": adflow.c,
                        "sec": sections.f,
                        "prod": prods.zzz
                    },
                    "u": {
                        "site": sites.r,
                        "zone": zones.s,
                        "adFlow": adflow.c,
                        "sec": sections.f,
                        "prod": prods.zzz
                    },
                    "f": {
                        "site": sites.a,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.a,
                        "prod": prods.zzz
                    },
                    "g": {
                        "site": sites.f,
                        "zone": zones.k,
                        "adFlow": adflow.b,
                        "sec": sections.b,
                        "prod": prods.zzz
                    },
                    "h": {
                        "site": sites.a,
                        "zone": zones.l,
                        "adFlow": adflow.c,
                        "sec": sections.zzz,
                        "prod": prods.b
                    },
                    "i": {
                        "site": sites.a,
                        "zone": zones.m,
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.zzz
                    },
                    "j": {
                        "site": sites.c,
                        "zone": zones.n,
                        "adFlow": adflow.c,
                        "sec": sections.c,
                        "prod": prods.zzz
                    },
                    "k": {
                        "site": sites.a,
                        "zone": zones.o,
                        "adFlow": adflow.c,
                        "sec": sections.d,
                        "prod": prods.zzz
                    },
                    "l": {
                        "site": sites.a,
                        "zone": zones.j,
                        "adFlow": adflow.e,
                        "sec": sections.a,
                        "prod": prods.h
                    },
                    "o": {
                        "site": sites.a,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.i,
                        "prod": prods.zzz
                    },
                    "cc": {
                        "site": sites.e,
                        "zone": zones.y,
                        "adFlow": adflow.d,
                        "sec": sections.zzz,
                        "prod": prods.e
                    }
                }
            };
            this.usedCarEnthusiast = {
                "breakdown": {
                    "a": {
                        "site": sites.n,
                        "zone": zones.u + make + "/",
                        "adFlow": adflow.a,
                        "sec": sections.h,
                        "prod": prods.a
                    },
                    "b": {
                        "site": sites.n,
                        "zone": zones.u + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.h,
                        "prod": prods.a
                    },
                    "c": {
                        "site": sites.v,
                        "zone": zones.u + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.h,
                        "prod": prods.a
                    },
                    "d": {
                        "site": sites.s,
                        "zone": zones.c + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.zzz,
                        "prod": prods.f
                    },
                    "e": {
                        "site": sites.k,
                        "zone": zones.c + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.f,
                        "prod": prods.a
                    },
                    "f": {
                        "site": sites.n,
                        "zone": zones.u + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.h,
                        "prod": prods.a
                    },
                    "g": {
                        "site": sites.f,
                        "zone": zones.c + model + "/",
                        "adFlow": adflow.b,
                        "sec": sections.b,
                        "prod": prods.a
                    },
                    "h": {
                        "site": sites.m,
                        "zone": zones.q + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.zzz,
                        "prod": prods.b
                    },
                    "i": {
                        "site": sites.m,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.h,
                        "prod": prods.c
                    },
                    "j": {
                        "site": sites.p,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.c,
                        "prod": prods.a
                    },
                    "k": {
                        "site": sites.n,
                        "zone": zones.b + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.d,
                        "prod": prods.a
                    },
                    "cc": {
                        "site": sites.a,
                        "zone": zones.w + model + "/",
                        "adFlow": adflow.d,
                        "sec": sections.zzz,
                        "prod": prods.e
                    }
                }
            };
            this.usedCarInMarket = {
                "breakdown": {
                    "a": {
                        "site": sites.m,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.a
                    },
                    "b": {
                        "site": sites.m,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.a
                    },
                    "c": {
                        "site": sites.y,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.a
                    },
                    "d": {
                        "site": sites.m,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.zzz,
                        "prod": prods.f
                    },
                    "e": {
                        "site": sites.w,
                        "zone": zones.c + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.f,
                        "prod": prods.a
                    },
                    "f": {
                        "site": sites.m,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.a
                    },
                    "g": {
                        "site": sites.f,
                        "zone": zones.c + model + "/",
                        "adFlow": adflow.b,
                        "sec": sections.b,
                        "prod": prods.zzz
                    },
                    "h": {
                        "site": sites.m,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.zzz,
                        "prod": prods.b
                    },
                    "i": {
                        "site": sites.m,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.h,
                        "prod": prods.zzz
                    },
                    "j": {
                        "site": sites.o,
                        "zone": zones.a + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.c,
                        "prod": prods.a
                    },
                    "k": {
                        "site": sites.m,
                        "zone": zones.b + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.a,
                        "prod": prods.a
                    },
                    "l": {
                        "site": sites.m,
                        "zone": zones.x + model + "/",
                        "adFlow": adflow.a,
                        "sec": sections.zzz,
                        "prod": prods.a
                    },
                    "m": {
                        "site": sites.x,
                        "zone": zones.zzz,
                        "adFlow": adflow.zzz,
                        "sec": sections.zzz,
                        "prod": prods.zzz
                    },
                    "o": {
                        "site": sites.m,
                        "zone": zones.zzz,
                        "adFlow": adflow.c,
                        "sec": sections.i,
                        "prod": prods.zzz
                    },
                    "cc": {
                        "site": sites.m,
                        "zone": zones.w + model + "/",
                        "adFlow": adflow.d,
                        "sec": sections.zzz,
                        "prod": prods.e
                    }
                }
            };
            this.other = {
                "breakdown": {
                    "a": {
                        "site": sites.e,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.zzz
                    },
                    "b": {
                        "site": sites.e,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.zzz
                    },
                    "c": {
                        "site": sites.q,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.zzz
                    },
                    "d": {
                        "site": sites.s,
                        "zone": zones.s,
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.f
                    },
                    "e": {
                        "site": sites.r,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.f,
                        "prod": prods.zzz
                    },
                    "f": {
                        "site": sites.a,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.a,
                        "prod": prods.zzz
                    },
                    "g": {
                        "site": sites.f,
                        "zone": zones.k,
                        "adFlow": adflow.b,
                        "sec": sections.b,
                        "prod": prods.zzz
                    },
                    "h": {
                        "site": sites.a,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.zzz,
                        "prod": prods.b
                    },
                    "i": {
                        "site": sites.a,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.zzz
                    },
                    "j": {
                        "site": sites.c,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.c,
                        "prod": prods.zzz
                    },
                    "k": {
                        "site": sites.a,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.d,
                        "prod": prods.zzz
                    },
                    "o": {
                        "site": sites.a,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.i,
                        "prod": prods.a
                    },
                    "l": {
                        "site": sites.a,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.h,
                        "prod": prods.zzz
                    },
                    "m": {
                        "site": sites.zzz,
                        "zone": zones.zzz,
                        "adFlow": adflow.zzz,
                        "sec": sections.zzz,
                        "prod": prods.zzz
                    },
                    "p": {
                        "site": sites.zzz,
                        "zone": zones.zzz,
                        "adFlow": adflow.zzz,
                        "sec": sections.zzz,
                        "prod": prods.zzz
                    },
                    "q": {
                        "site": sites.g,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.j,
                        "prod": prods.zzz
                    },
                    "r": {
                        "site": sites.h,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.k,
                        "prod": prods.zzz
                    },
                    "n": {
                        "site": sites.a,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.d,
                        "prod": prods.g
                    },
                    "cc": {
                        "site": sites.e,
                        "zone": zones.y,
                        "adFlow": adflow.d,
                        "sec": sections.zzz,
                        "prod": prods.e
                    }
                }
            };
            this.landings = {
                "breakdown": {
                    "aa": {
                        "site": sites.q,
                        "zone": zones.j,
                        "adFlow": adflow.e,
                        "sec": sections.a,
                        "prod": prods.h
                    },
                    "v": {
                        "site": sites.i,
                        "zone": zones.k,
                        "adFlow": adflow.i,
                        "sec": sections.zzz,
                        "prod": prods.zzz
                    },
                    "k": {
                        "site": sites.a,
                        "zone": zones.j,
                        "adFlow": adflow.e,
                        "sec": sections.d,
                        "prod": prods.h
                    },
                    "x": {
                        "site": sites.m,
                        "zone": zones.j,
                        "adFlow": adflow.e,
                        "sec": sections.d,
                        "prod": prods.h
                    },
                    "y": {
                        "site": sites.bb,
                        "zone": zones.j,
                        "adFlow": adflow.c,
                        "sec": sections.l,
                        "prod": prods.h
                    },
                    "z": {
                        "site": sites.a,
                        "zone": zones.j,
                        "adFlow": adflow.e,
                        "sec": sections.a,
                        "prod": prods.h
                    },
                    "c": {
                        "site": sites.q,
                        "zone": zones.j,
                        "adFlow": adflow.e,
                        "sec": sections.a,
                        "prod": prods.h
                    },
                    "b": {
                        "site": sites.a,
                        "zone": zones.j,
                        "adFlow": adflow.e,
                        "sec": sections.a,
                        "prod": prods.h
                    },
                    "m": {
                        "site": sites.zzz,
                        "zone": zones.zzz,
                        "adFlow": adflow.zzz,
                        "sec": sections.zzz,
                        "prod": prods.zzz
                    },
                    "bb": {
                        "site": sites.s,
                        "zone": zones.j,
                        "adFlow": adflow.e,
                        "sec": sections.zzz,
                        "prod": prods.h
                    },
                    "d": {
                        "site": sites.s,
                        "zone": zones.t,
                        "adFlow": adflow.e,
                        "sec": sections.h,
                        "prod": prods.f
                    },
                    "cc": {
                        "site": sites.a,
                        "zone": zones.a,
                        "adFlow": adflow.g,
                        "sec": sections.h,
                        "prod": prods.c
                    },
                    "g": {
                        "site": sites.f,
                        "zone": zones.j,
                        "adFlow": adflow.b,
                        "sec": sections.b,
                        "prod": prods.zzz
                    },
                    "e": {
                        "site": sites.r,
                        "zone": zones.j,
                        "adFlow": adflow.e,
                        "sec": sections.zzz,
                        "prod": prods.j
                    },
                    "ee": {
                        "site": sites.k,
                        "zone": zones.j,
                        "adFlow": adflow.e,
                        "sec": sections.f,
                        "prod": prods.h
                    },
                    "ff": {
                        "site": sites.l,
                        "zone": zones.j,
                        "adFlow": adflow.e,
                        "sec": sections.b,
                        "prod": prods.zzz
                    },
                    "q": {
                        "site": sites.g,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.zzz,
                        "prod": prods.zzz
                    },
                    "r": {
                        "site": sites.h,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.zzz,
                        "prod": prods.b
                    },
                    "hh": {
                        "site": sites.a,
                        "zone": zones.k,
                        "adFlow": adflow.c,
                        "sec": sections.d,
                        "prod": prods.g
                    }
                }
            };
        }
    };
}());
// C&D Ad Logic
var zones = new cdAdLogic.zoneList();
var nodes = new cdAdLogic.decisionNodes(hfm.cd.page);
var sites = new cdAdLogic.siteList();
var adflow = new cdAdLogic.adFlowList();
var sections = new cdAdLogic.sectionList();
var prods = new cdAdLogic.prodList();
var other = "other";
var subtype = "subtype";
var show = "show";
var dictionary = new cdAdLogic.algorithmList(nodes.make, nodes.model, nodes.bodyStyle, zones, sites, adflow, sections, prods, other, subtype, show);
var level = "";
var o_0 = {};
if (nodes.sectionType[1] == 'gearbox') {
    level = "gearbox";
} else if (nodes.submodel !== "" && nodes.submodel !== undefined) {
    level = "sub";
} else if (nodes.model != "" && nodes.model !== undefined) {
    level = "model";
} else if (nodes.make != "" && nodes.make !== undefined) {
    level = "make";
} else {
    level = "bodyStyle"
}
o_0 = cdAdLogic.doLogic(nodes, level, dictionary);
$(document).ready(function () {
    //$('#wrap > .advertisement > table').css({'margin-bottom':'-13px'});
    $("img[width='0'][height='0']").css({
        'display': 'none'
    });
    $('img').each(function (index) {
        if ($(this).attr('src')) {
            if ($(this).attr('src').indexOf('817-grey.gif') != -1 || $(this).attr('src') == "") {
                if (!($(this).parent().parent().hasClass("shopping-tools"))) {
                    $(this).parent().parent().hide();
                }
            }
        }
    });
    var noText = true;
    var noImage = true;
    if (hfm.cd.page.adflow == 'make/model') {
        var noText = true;
        var noImage = true;
        $('div.jcpmanufacturer:eq(1) img').each(function (index) {
            if ($(this).attr('src').indexOf('817-grey.gif') != -1 || $(this).attr('src') == "") {
                noImage = true;
                return false;
            } else {
                noImage = false;
            }
        });
        $('div.jcpmanufacturer:eq(1) a').each(function (index) {
            if ($(this).text() == "") {
                noText = true;
            } else {
                noText = false;
                return false;
            }
        });
        //console.log("noText: "+noText+" noImage: "+noImage);
        if (noText == false || noImage == false) {
            window.shopshow = true;
            parent.$(".shopping-tools").removeClass('hidden');
            parent.$(".shopping-tools").removeClass('hide');
            parent.$(".shopping-tools").css('display', 'block');
        } else {
            window.shopshow = false;
        }
    }
});

function styleOutbrain() {
    $('.ob-text-content div.strip-rec-link-title').each(function (i) {
        var theTitle = $(this).html();
        var shortText = jQuery.trim(theTitle).substring(0, 40).split(" ").slice(0, - 1).join(" ") + "... <span style=\"color:#089adb;\">&gt;</span>";
        $(this).html(shortText);
        $('.OUTBRAIN > div .strip-img').css({
            'height': '82px',
            'width': '134px'
        });
        $('.OUTBRAIN > div .ob_container_recs .item-container').css('width', '136px');
        $('.ob_container').css({
            'border': '4px double #dadada',
            'padding': '5px 0 5px 5px',
            'width': '420px'
        });
    });
}
$(window).load(function () {
    /*   CDIM-1071  ICrossing CMP  */
    window.IC = {};
    (function () {
        var p, s;
        p = document.createElement('script');
        p.type = 'text/javascript';
        p.async = true;
        p.src = document.location.protocol + '//c10048.ic-live.com/pixel-js/c10048-pixel.js';
        s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(p, s);
    })();
    var mySrc = "";
    $('.delayMe').each(function (index) {
        mySrc = $(this).attr('rel');
        $(this).attr('src', mySrc);
        $(this).css('display', 'block');
    });
    LoadAds();

    function styleOutbrain() {
        $('.ob-text-content div.strip-rec-link-title').each(function (i) {
            var theTitle = $(this).html();
            var shortText = jQuery.trim(theTitle).substring(0, 40).split(" ").slice(0, - 1).join(" ") + "... <span style=\"color:#089adb;\">&gt;</span>";
            $(this).html(shortText);
            $('.OUTBRAIN > div .strip-img').css({
                'height': '82px',
                'width': '134px'
            });
            $('.OUTBRAIN > div .ob_container_recs .item-container').css('width', '136px');
            $('.ob_container').css({
                'border': '4px double #dadada',
                'padding': '5px 0 5px 5px',
                'width': '420px'
            });
        });
    }
    $.getScript("http://widgets.outbrain.com/outbrain.js", function () {
        setTimeout('styleOutbrain()', 500);
    });
});