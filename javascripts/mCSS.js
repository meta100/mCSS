/*
  mCSS
  Version: 1.0
  
  Copyright (c) 2011 Meta100 LLC.
  http://www.meta100.com/
  
  Licensed under the MIT license 
  http://www.opensource.org/licenses/mit-license.php 
*/

// Extention of jQuery css().
// Call same as jQuery css() but with an added optional precedence argument.
// Example1: $('foo').css('property', 'value') - same result as before this extention.
// Example2: $('foo').css({'property': 'value'}) - same result as before this extention.
// Example3: $('foo').css('property', 'value', 'inline') - same result as before this extention.
// Example4: $('foo').css({'property': 'value'}, 'inline') - same result as before this extention.
// Example5: $('foo').css('property') - same result as before this extention.
// Example6: $('foo').css('property', 'value', 'low') - adds css to a style sheet prepended to the <head>.
// Example7: $('foo').css({'property': 'value'}, 'low') - adds css to a style sheet prepended to the <head>.
// Example8: $('foo').css('property', 'value', 'high') - adds css to a style sheet appended to the <body>.
// Example9: $('foo').css({'property': 'value'}, 'high') - adds css to a style sheet appended to the <body>.
// Example10: $('foo').css() - returns an object of the full css applied to <foo>.
// Example11: $('foo').cssCopyTo('bar') - copies the diff css from $('foo') to $('bar') and applies to style attribute - 'bar' can be a selector or an object.
// Example12: $('foo').cssCopyTo('bar', 'inline') - copies the diff css from $('foo') to $('bar') and applies to style attribute.
// Example13: $('foo').cssCopyTo('bar', 'low') - copies the diff css from $('foo') to $('bar') and applies to a style sheet prepended to the <head>.
// Example14: $('foo').cssCopyTo('bar', 'high') - copies the css from $('foo') to $('bar') and applies to a style sheet appended to the <body>.
// Example15: $('foo').cssSyncTo('bar') - will apply any $.css changes made to 'foo' also to 'bar.

(function($){

  var include_external_css = false, // Set true to parse links (external) css too.
      $o,
      $g;

  $.fn.inlineCSS = $.fn.css;

  $.fn.css = function (temp_property, value, precedence) {

    var selector = $(this).selector.replace('\\', ''),
        property = {};

    for (var v in $.cssPseudoClasses) selector = selector.replace(new RegExp($.rEscape(v), "g"), $.cssPseudoClasses[v]);

    if (typeof temp_property == 'string' && typeof value != 'undefined') {

      property[$.camelCase(temp_property)] = value;
    } else if (typeof temp_property == 'object') {

      for (p in temp_property) property[$.camelCase(p)] = temp_property[p];

      precedence = value;
    } else {

      return $(this).inlineCSS(temp_property);
    }

    if (precedence != 'high' && precedence != 'low') precedence = 'inline';

    if (precedence == 'inline' && arguments.length) return this.each(function () {

      $(this).inlineCSS(property);
      $.fn.css.selectorParts(function (selector) {

        $(selector).inlineCSS(property);
      });
    });

    if (!arguments.length) return $(this).cssCopy();

    $.fn.css.add(selector.split(','), property, precedence);

    return this;
  };

  $.fn.css.globals = {
    sync: {},
    browserSpecific: false,
    browsers: {
      mozilla: "-moz-", 
      khtml: "-khtml-", 
      webkit: "-webkit-", 
      opera: "-o-", 
      wap: "-wap-", 
      atsc: "-atsc-", 
      msie: "-ms-"
    },
    css2: ["azimuth", "border-collapse", "border-spacing", "bottom", "caption-side", "clip", "direction", "elevation", "empty-cells", "left", "pitch", "pitch-range", "play-during", "position", "richness", "right", "speak-header", "speak-numeral", "speak-punctuation", "speech-rate", "stress", "table-layout", "text-decoration", "text-transform", "top", "unicode-bidi", "volume", "z-index", "background", "background-attachment", "background-color", "background-image", "background-position", "background-repeat", "border", "border-bottom", "border-bottom-color", "border-bottom-style", "border-bottom-width", "border-color", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-style", "border-top", "border-top-color", "border-top-style", "border-top-width", "border-width", "clear", "color", "content", "counter-increment", "counter-reset", "cue", "cue-after", "cue-before", "cursor", "display", "float", "font", "font-family", "font-size", "font-size-adjust", "font-style", "font-variant", "font-weight", "height", "letter-spacing", "line-height", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marks", "max-height", "max-width", "min-height", "min-width", "orphans", "outline", "outline-color", "outline-style", "outline-width", "overflow", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "pause", "pause-after", "pause-before", "quotes", "size", "speak", "text-align", "text-indent", "text-shadow", "vertical-align", "visibility", "voice-family", "white-space", "widows", "width", "word-spacing"],
    css3: ["alignment-adjust", "alignment-baseline", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "appearance", "backface-visibility", "background-break", "background-clip", "background-origin", "background-size", "baseline-shift", "binding", "bookmark-label", "bookmark-level", "bookmark-target", "border-bottom-left-radius", "border-bottom-right-radius", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-length", "border-radius", "border-top-left-radius", "border-top-right-radius", "box-align", "box-decoration-break", "box-direction", "box-flex", "box-flex-group", "box-lines", "box-ordinal-group", "box-orient", "box-pack", "box-shadow", "box-sizing", "color-profile", "column-break-after", "column-break-before", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "crop", "display-model", "display-role", "dominant-baseline", "drop-initial-after-adjust", "drop-initial-after-align", "drop-initial-before-adjust", "drop-initial-before-align", "drop-initial-size", "drop-initial-value", "fit", "fit-position", "float-offset", "font-stretch", "grid-columns", "grid-rows", "hanging-punctuation", "hyphenate-after", "hyphenate-before", "hyphenate-character", "hyphenate-lines", "hyphenate-resource", "hyphens", "icon", "image-orientation", "image-resolution", "inline-box-align", "line-stacking", "line-stacking-ruby", "line-stacking-shift", "line-stacking-strategy", "mark", "mark-after", "mark-before", "marquee-direction", "marquee-play-count", "marquee-speed", "marquee-style", "move-to", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "opacity", "outline-offset", "overflow-style", "overflow-x", "overflow-y", "page-policy", "perspective", "perspective-origin", "phonemes", "presentation-level", "punctuation-trim", "rendering-intent", "resize", "rest", "rest-after", "rest-before", "rotation", "rotation-point", "ruby-align", "ruby-overhang", "ruby-position", "ruby-span", "string-set", "tab-side", "target", "target-name", "target-new", "target-position", "text-align-last", "text-emphasis", "text-height", "text-justify", "text-outline", "text-replace", "text-wrap", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "voice-balance", "voice-duration", "voice-pitch", "voice-pitch-range", "voice-rate", "voice-stress", "voice-volume", "white-space-collapse", "word-break", "word-wrap"],
    html: '<style type="text/css"></style>',
    ajaxTimeout: 1000,
    styleSheetsReady: false,
    handlers: [],
    totalSheets: 0,
    sheetCount: 0,
    mediaUsed: false,
    importantRules: {},
    sheets: {
      low: false,
      high: false
    },
    timer: false,
    ready: false,
    onLoad: false,
    important: false,
		sheet: false,
		rules: false,
		remove: false,
		insert: false,
		owner: false,
    debug: false
  };

  $.fn.css.options = {};

  $.fn.css.init = function () {

    $g = $.fn.css.globals;
    $o = $.fn.css.options;

    if (include_external_css) {

      $('link[rel=stylesheet]').each(function (index) {
    
        var $t = $(this);
  
        $g.totalSheets++;
  
        // IE can do cssText need to check if it filters out unknown properties, I think mozilla can load from cache, not sure how to speed this up in webkit.
        $.ajax({ 
          url: $t.attr('href'),
          timeout: $g.ajaxTimeout,
          error: function (request, status, error) {
    
            error = error || status
            $.fn.css.error('The file at ' + $t.attr('href') + ' had the following error: ' + error, 'error');
            $.fn.css.error('Using styleSheetDOM.');
  
            if (++$g.sheetCount == $g.totalSheets) $.fn.css.styleSheetsReady();
          },
          success: function (data) {
    
            var $e = $($g.html).attr({
              'data-parse': 'false'
            }).html(data);
    
            $t.after($e).remove();
  
            if (++$g.sheetCount == $g.totalSheets) $.fn.css.styleSheetsReady();
          }
        });
      });
    } else {

      $.fn.css.styleSheetsReady();
    }
  };

  $.fn.css.styleSheetsReady = function () {

    $(function () {

      $g.styleSheetsReady = true;
      $.fn.css.parse();
    });
  };

  $.fn.css.add = function (selector, property, precedence) {

    var sheet = $.fn.css.newStyleSheet(precedence),
        output,
        rulesCount;

    for (var s = 0; s < selector.length; s++) {
  
      selector[s] = $.trim(selector[s]);
      output = [];

      $.fn.css.selectorParts(selector[s], function (s) {
  
        selector.push(s);
      });

      for (var p in property) {

        var value = property[p],
            elem = {style: {}},
            origName = $.cssProps[p] || p;

  			// If a number was passed in, add 'px' to the (except for certain CSS properties)
  			if (typeof value === "number" && !$.cssNumber[p]) value += "px";

  			// If a hook was provided, use that value, otherwise just set the specified value
  			if (!$.cssHooks[origName] || !("set" in $.cssHooks[origName]) || (value = $.cssHooks[origName].set(elem, value)) !== undefined) {

  				try {

  					property[p] = value;
  				} catch(e) {}
  			}

        if ($.isEmptyObject(elem.style) || !$.cssHooks[origName] || !("set" in $.cssHooks[origName])) {
          output.push($.unCamelCase(p) + ':' + property[p]);
        } else {
          for (var e in elem.style) output.push($.unCamelCase(e) + ':' + elem.style[e]);
        }
      }

      if (sheet[$g.rules].length > 4089) sheet = $.fn.css.newStyleSheet(precedence);

      rulesCount = sheet[$g.rules].length;

      if ($g.insert == 'insertRule') sheet[$g.insert](selector[s] + '{' + output.join(';') + '}', rulesCount);
      else sheet[$g.insert](selector[s], output.join(';') + '', rulesCount);
    }

    return this;
  };

  $.fn.css.newStyleSheet = function (precedence) {

    if (!$g.sheet) $.fn.css.tester();
    if ($g.sheets[precedence] && $g.sheets[precedence][$g.rules].length < 4090) return $g.sheets[precedence];
    if ($g.sheets[precedence]) $('style[data-precedence=' + precedence + ']').attr('data-precedence', '');

    var $e = $($g.html).attr({
          'data-precedence': precedence,
          'data-parse': 'false'
        }),
        sheets = document[$g.sheet];

    if (precedence == 'high') $e.appendTo('body');
    else $e.prependTo('head');

    for (var s in sheets) {

      if (precedence == $(sheets[s][$g.owner]).attr('data-precedence')) {

        $g.sheets[precedence] = sheets[s];
        return $g.sheets[precedence];
      }
    }

    $.fn.css.error('ERROR: Could not create stylesheet.');
  };

  $.fn.css.selectorParts = function (selector, handler) { // ToDo: Good start, but sure it will need refining.

    var new_selector;

    for (var x in $g.sync) {

      new_selector = selector.replace(x, $g.sync[x]);

      if ($(selector)[0]) handler($g.sync[x]);
      else if ($(new_selector)[0]) handler(new_selector);
    }
  };

  $.fn.css.parse = function () {

    $g.timer = new Date().getTime();

    var css = $.fn.css.parse.text();

    for (var c in css) {

      var properties = {};

      if ($g.sync[c]) {

        $($g.sync[c]).css(css[c], 'high');
      } else {

        for (var p in css[c]) {
  
          if ($.cssHooks[$.camelCase(p)]) $(c).css(p, css[c][p], 'high');
        }
      }
    }

    $.fn.css.error('Time to parse css: ' + (new Date().getTime() - $g.timer) + 'ms', 'log');
  };

  $.fn.css.parse.text = function () {

    var css = {};
    
    $('style[data-parse!="false"]').each(function () {

      var $t = $(this),
          text = $t.html().replace(
            /\/\*(.|\s)*?\*\//g, '' // Remove comments.
          ).replace(
            /<!--(.|\s)*?-->/g, '' // Remove HTML style comments.
          ).replace(
            /@media([^{]+){([^}]*})}/g, function () { // @media statements.
      
              if ($.fn.css.media(arguments[1])) return arguments[2];
            
              return '';
            }
          ).replace(
            /@[^;}{]+;/g, '' // General @ statements will not modify @media, @font-face, @page and remove; @import, @charset, @namespace, @fontdef.
          ).replace(
            /([^}{]*)({[^}]*!important[^}]*)(})/gi, function () { // Find and process !important. This takes a long time need to find a faster way.
      
              var selectors = arguments[1].split(',');
      
              for (var s = 0; s < selectors.length; s++) {
          
                arguments[2].replace(
                  /[{;]{1}([^:};]*):([^;!}]*!important)/gi, function () {
      
                    var selector = $.trim(selectors[s]);
      
                    if (typeof $g.importantRules[selector] == 'undefined') $g.importantRules[selector] = {}
                    $g.importantRules[$.trim(selectors[s])][arguments[1]] = arguments[2];        
      
                    return arguments[0];
                  }
                );
              }
      
              return arguments[0];
            }
          ).replace(
            /;[^:;]*;/g, '' // ERROR control ;;.
          ).replace(
            /"/g, "'" // " to ' we need " for parsing the json.
          ).replace(
            /\s*:\s*([^}{;]*)\s*([};]{1})/g, '":"$1$2' // Prossess the : between properties and values and trim the space.
          ).replace(
            /[;]*\s*(})\s*/g, '"},"' // Add " and , around the } and trim the space.
          ).replace(
            /\s*([{;]+)\s*/g, function () { // Add " and : around the { or add " around the ; and trim the space.
      
              if (arguments[1].indexOf('{') > -1) return '":{"';
              else return '","';
            }
          ).replace(
            /"([^"]*\,[^"]*)(":{[^}]*})/g, function () { // Breakup multiple selectors.
      
              var selectors = arguments[1].split(','),
                  outputText = '',
                  comma = '';
      
              for (var s = 0; s < selectors.length; s++) {
          
                outputText += comma +'"' + $.trim(selectors[s]) + arguments[2];
                comma = ',';
              }
      
              return outputText;
            }
          ).replace(
            /\s*"\s*"\s*/g, '' // "ERROR control "".
          );
      
          text = $.trim(text);
      
          try {
      
            if (text.length > 10) text = $.parseJSON('{"' + (text.substr(0, text.length - 2)) + '}');
            else text = {};
          } catch (e) {
      
            $.fn.css.error('ERROR: Unable to parse the raw css file.');
            text = {};
          }
    
          $.extend(css, text);
        }).attr('data-parse', 'false');

    return css;
  };

  $.fn.css.media = function (media) {

    if (!media) return true;

    if (typeof media == 'string') media = media.split(',');
    else media = media.mediaText.split(',');

    for (var m in media) {

      for (var mu in $g.mediaUsed) {

        if (media[m].indexOf(mu) > -1) {

          if (media[m].indexOf('not') > -1) {

            for (var mu2 in $g.mediaUsed) {

              if (mu2 != mu && mu2 != 'all' && $g.mediaUsed[mu2]) return true;
            }
          } else {

            if ($g.mediaUsed[mu]) return true;
          }
        }
      }
    }

		return false;
  };

  $.fn.cssCopy = function () {

    var result,
        css = {},
        $t = $(this);

    for (var p in $g.css2) {

      result = $t.inlineCSS($g.css2[p]);

      if (result) css[$g.css2[p]] = result;
    }

    for (var p in $g.css3) {

      result = $t.inlineCSS($g.css3[p]);

      if (result) {

        css[$g.css3[p]] = result;
      } else {

        result = $t.inlineCSS($g.browserSpecific + $g.css3[p]);

        if (result) css[$g.browserSpecific + $g.css3[p]] = result;
      }
    }

    return css;
  };

  $.fn.css.merge = function (this_css, that_css) {

    for (var p in that_css) {

      if (that_css[p] == this_css[p]) delete this_css[p];
    }

    return this_css;
  };

  $.fn.css.browser = function () {

    var regEx;

    for (var b in $g.browsers) {

      regEx = new RegExp(b);
      if (regEx.test(navigator.userAgent.toLowerCase())) $g.browserSpecific = $g.browsers[b];
    }
  };

  $.fn.css.tester = function () {

  	var text = '#mCSSparseMedaiType{border:0;padding:0;margin:0;height: 1px !important}@media print{div#mCSSparseMedaiType{margin-top:1px}}@media embossed{div#mCSSparseMedaiType{margin-right:1px}}@media braille{div#mCSSparseMedaiType{margin-bottom:1px}}@media aural{div#mCSSparseMedaiType{margin-left:1px}}@media tty{div#mCSSparseMedaiType{border:1px solid #000}}@media screen{div#mCSSparseMedaiType{padding-top:1px}}@media projection{div#mCSSparseMedaiType{padding-right:1px}}@media handheld{div#mCSSparseMedaiType{padding-bottom:1px}}@media tv{div#mCSSparseMedaiType{padding-left:1px}}#mCSSparseMedaiType{height:0}',
        styleSheet = $('<style id="mCSSparseTester" type="text/css">' + text + '</style>').appendTo('head')[0],
        sheet;

		$g.sheet = (document.styleSheets)? 'styleSheets': 'sheet',
		sheet = document[$g.sheet][0],
		$g.rules = (sheet.cssRules)? 'cssRules': 'rules',
		$g.remove = (sheet.deleteRule)? 'deleteRule': 'removeRule',
		$g.insert = (sheet.insertRule)? 'insertRule': 'addRule',
		$g.owner = (sheet.ownerNode)? 'ownerNode': 'owningElement',		

		$('<div id="mCSSparseMedaiType" />').appendTo('body');

    var $e = $("#mCSSparseMedaiType"),
        mediaTypes = {
          print: "margin-top",
          embossed: "margin-right",
          braille: "margin-bottom",
          aural: "margin-left",
          tty: "border-width",
          screen: "padding-top",
          projection: "padding-right",
          handheld: "padding-bottom",
          tv: "padding-left"
        },
        mediaUsed = {
          all: true
        };

    for (m in mediaTypes) mediaUsed[m] = (parseInt($e.css(mediaTypes[m])) == 1)? true: false;

    $g.important = (parseInt($e.css('height')) == 1)? true: false;

    $e.remove();
    $('#mCSSparseTester').remove();

		$g.mediaUsed = mediaUsed;
  };

  $.fn.css.path = function (elem, root) {

    var path = '',
        id = '';

    if (typeof root == 'string') root = $(root);

    while(elem[0] && elem.parent()[0] && elem[0] != root[0] && elem[0].nodeType != 9) {

      id = elem.attr('id');
      tag = elem[0].tagName.toLowerCase();

      if (id.length){

        path = tag + "#" + id + " " + path;
        break;
      } else {

        path = tag + ":eq(" + elem.prevAll(tag).size() + ") " + path;
      }

      elem = elem.parent();
    }

    return path;
  };

  $.fn.css.error = function (error, level) {

    if (!$g.debug) return false;
    if (typeof level != 'string') level = 'log';

    if (window.debug) debug[level](error); // If using JavaScript Debug
    else if (window.console) console[level](error);
    else alert(error);
  };

  $.fn.cssSyncTo = function (that, precedence) {

    $g.sync[$(this).selector] = that;
    $(this).cssCopyTo(that, precedence);

    return this;
  };

  $.fn.cssMergeIn = function (that, precedence) {

    var working_span = $('<span/>').appendTo('body').css(that),
        that_css = $(working_span).cssCopy();

    working_span.remove();

    $(this).css($.fn.css.merge($(this).cssCopy(), that_css), precedence);

    return this;
  };

  $.fn.cssCopyFrom = function (that, precedence) {

    if (typeof that == 'string') that = $(that);
    if (typeof that != 'object' || !$(that)[0]) return $(this).cssCopy();

    that.cssCopyTo(this, precedence);

    return this;
  };

  $.fn.cssCopyTo = function (that, precedence) {

    if (typeof that == 'string') that = $(that);
    if (typeof that != 'object' || !$(that)[0]) return $(this).cssCopy();

    return this.each(function () {

      that.css($.fn.css.merge($(this).cssCopy(), $(that).cssCopy()), precedence);
    });
  };

  $.fn.css.init();
  $.fn.css.browser();

  jQuery.extend({

  	unCamelCase: function (string) {
  		return string.replace(/([A-Z])/g, function (all, letter) {

      	return '-' + letter.toLowerCase();
    	});
  	},
    rEscape: function(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  	},
  	cssPseudoClasses: {
  		":autofill": ":" + $.fn.css.globals.browserSpecific + "autofill"
    }
  });
})(jQuery);
