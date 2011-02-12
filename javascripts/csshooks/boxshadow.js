/*! Copyright (c) 2010 Burin Asavesna (http://helloburin.com)
 * Licensed under the MIT License (LICENSE.txt).
 */
(function($) {
    // boxShadow get hooks
    var div = document.createElement('div'),
        divStyle = div.style,
        support = $.support,
        rWhitespace = /\s/,
        rParenWhitespace = /\)\s/;

    support.boxShadow =
        divStyle.MozBoxShadow     === ''? 'MozBoxShadow'    :
        (divStyle.MsBoxShadow     === ''? 'MsBoxShadow'     :
        (divStyle.WebkitBoxShadow === ''? 'WebkitBoxShadow' :
        (divStyle.OBoxShadow      === ''? 'OBoxShadow'      :
        (divStyle.boxShadow       === ''? 'BoxShadow'       :
        false))));

    support.matrixFilter = !support.transform && divStyle.filter === '';

    div = null;

    // helper function to inject a value into an existing string
    // is there a better way to do this? it seems like a common pattern
    function insert_into(string, value, index) {
        var parts  = string.split(rWhitespace);
        parts[index] = value;
        return parts.join(" ");
    }

    if ( support.matrixFilter )  {
        $.cssHooks.boxShadow = {
          get: function( elem, computed, extra ) {
              return $.css(elem, support.boxShadow);
          },
          set: function( elem, value ) {

            var
              v = value.replace(/\s*inset\s/gi, '').split(rWhitespace);

            for (var i = 0; i < 3; i++) v[i] = parseInt(v[i]);

            var
              direction = Math.round(Math.atan2(v[0], -v[1])*(180/Math.PI)),
              strength = Math.round(Math.abs(Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2))) / 2 + Math.abs(v[2])),
              color = v[3];
      
            elem.style.filter = [
              "progid:DXImageTransform.Microsoft.DropShadow(",
                "OffX="+v[0]+",",
                "OffY="+v[1]+",",
                "Color="+toHex(color)+",",
              ")"
            ].join('');
          }
        };
    } if ( support.boxShadow && support.boxShadow !== "BoxShadow" ) {
        $.cssHooks.boxShadow = {
            get: function( elem, computed, extra ) {
                return $.css(elem, support.boxShadow);
            },
            set: function( elem, value ) {
                elem.style[ support.boxShadow ] = value;
            }
        };

        $.cssHooks.boxShadowColor = {
            get: function ( elem, computed, extra ) {
                return $.css(elem, support.boxShadow).split(rParenWhitespace)[0] + ')';
            },
            set: function( elem, value ) {
                elem.style[ support.boxShadow ] = value + " " + $.css(elem, support.boxShadow).split(rParenWhitespace)[1];
            }
        };

        $.cssHooks.boxShadowBlur = {
            get: function ( elem, computed, extra ) {
                return $.css(elem, support.boxShadow).split(rWhitespace)[5];
            },
            set: function( elem, value ) {
                elem.style[ support.boxShadow ] = insert_into($.css(elem, support.boxShadow), value, 5);
            }
        };

        $.cssHooks.boxShadowSpread = {
            get: function ( elem, computed, extra ) {
                return $.css(elem, support.boxShadow).split(rWhitespace)[6];
            },
            set: function( elem, value ) {
                elem.style[ support.boxShadow ] = insert_into($.css(elem, support.boxShadow), value, 6);
            }
        };

        $.cssHooks.boxShadowX = {
            get: function ( elem, computed, extra ) {
                return $.css(elem, support.boxShadow).split(rWhitespace)[3];
            },
            set: function( elem, value ) {
                elem.style[ support.boxShadow ] = insert_into($.css(elem, support.boxShadow), value, 3);
            }
        };

        $.cssHooks.boxShadowY = {
            get: function ( elem, computed, extra ) {
                return $.css(elem, support.boxShadow).split(rWhitespace)[4];
            },
            set: function( elem, value ) {
                elem.style[ support.boxShadow ] = insert_into($.css(elem, support.boxShadow), value, 4);
            }
        };

        // setup fx hooks
        var fxHooks = "Blur Spread X Y".split(" ");
        $.each(fxHooks, function( i, suffix ) {
            var hook = "boxShadow" + suffix;
            $.fx.step[ hook ] = function( fx ) {
                $.cssHooks[ hook ].set( fx.elem, fx.now + fx.unit );
            };
        });
    }

  function toHex (color) {

    color = color.toLowerCase();

    if (typeof color == 'undefined') return '';
    if (color.indexOf('#') > -1 && color.length > 6) return color;
    if (color.indexOf('rgb') < 0 && color.indexOf('#') < 0) return color;

    if (color.indexOf('#') > -1) {

      return '#' + color.substr(1, 1) + color.substr(1, 1) + color.substr(2, 1) + color.substr(2, 1) + color.substr(3, 1) + color.substr(3, 1);
    }

    var hexArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"],
        decToHex = "#",
        code1 = 0;
  
    color = color.replace(/[^0-9,]/g, '').split(",");

    for (var n = 0; n < color.length; n++) {

      code1 = Math.floor(color[n] / 16);
      decToHex += hexArray[code1] + hexArray[color[n] - code1 * 16];
    }
  
    return decToHex;
  };

})(jQuery);
