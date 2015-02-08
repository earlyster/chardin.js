// Generated by CoffeeScript 1.6.2
(function() {
  var __slice = [].slice;

  (function($, window) {
    var chardin;

    chardin = (function() {
      function chardin(el) {
        var _this = this;

        this.$el = $(el);
        $(window).resize(function() {
          return _this.refresh();
        });
      }

      chardin.prototype.preOverlaySetup      = function() {};
      chardin.prototype.postOverlaySetup     = function() {};
      chardin.prototype.getElements          = function() { return this.$el.find('*[data-intro]:visible'); };
      chardin.prototype.showElement          = function(el, i) { this._showElement(el); };
      chardin.prototype.finalSetup           = function() {};
      chardin.prototype.destroy              = function() {};

      chardin.prototype.start = function() {
        var elements, i, len, el;

        if (this._overlayVisible()) {
          return false;
        }

        this.preOverlaySetup();
        this._addOverlayLayer();
        this.postOverlaySetup();

        _(this.getElements()).each(this.showElement, this);

        this.finalSetup();

        return this.$el.trigger('chardin:start');
      };

      chardin.prototype.refresh = function() {
        var el, _i, _len, _ref, _results;

        if (this._overlayVisible()) {
          _ref = this.$el.find('*[data-intro]:visible');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            el = _ref[_i];
            _results.push(this._positionHelperLayer(el));
          }
          return _results;
        } else {
          return this;
        }
      };

      chardin.prototype.stop = function() {
        this.$el.find(".chardin-overlay").fadeOut(function() {
          return $(this).remove();
        });
        this.$el.find('.chardin-helper-layer').remove();
        this.$el.find('.chardin-show-element').removeClass('chardin-show-element');
        this.$el.find('.chardin-relative-position').removeClass('chardin-relative-position');
        if (window.removeEventListener) {
          window.removeEventListener("keydown", this._onKeyDown, true);
        } else {
          if (document.detachEvent) {
            document.detachEvent("onkeydown", this._onKeyDown);
          }
        }
        this.destroy();
        return this.$el.trigger('chardin:stop');
      };

      chardin.prototype._overlayVisible = function() {
        return this.$el.find('.chardin-overlay').length !== 0;
      };

      chardin.prototype._addOverlayLayer = function() {
        var element_position, overlay_layer, styleText,
          _this = this;

        if (this._overlayVisible()) {
          return false;
        }
        overlay_layer = document.createElement("div");
        styleText = "";
        overlay_layer.className = "chardin-overlay";
        if (this.$el.prop('tagName') === "BODY") {
          styleText += "top: 0;bottom: 0; left: 0;right: 0;position: fixed;";
          overlay_layer.setAttribute("style", styleText);
        } else {
          element_position = this._getOffset(this.$el.get()[0]);
          if (element_position) {
            styleText += "width: " + element_position.width + "px; height:" + element_position.height + "px; top:" + element_position.top + "px;left: " + element_position.left + "px;";
            overlay_layer.setAttribute("style", styleText);
          }
        }
        this.$el.get()[0].appendChild(overlay_layer);
        overlay_layer.onclick = function() {
          return _this.stop();
        };
        return setTimeout(function() {
          styleText += "opacity: .8;opacity: .8;-ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=80)';filter: alpha(opacity=80);";
          return overlay_layer.setAttribute("style", styleText);
        }, 10);
      };

      chardin.prototype._getPosition = function(element) {
        return element.getAttribute('data-position') || 'bottom';
      };

      chardin.prototype._placeTooltip = function(element) {
        var my_height, my_width, target_element_position, target_height, target_width, tooltip_layer, tooltip_layer_position;

        tooltip_layer = $(element).data('tooltip_layer');
        tooltip_layer_position = this._getOffset(tooltip_layer);
        tooltip_layer.style.top = null;
        tooltip_layer.style.right = null;
        tooltip_layer.style.bottom = null;
        tooltip_layer.style.left = null;
        switch (this._getPosition(element)) {
          case "top":
          case "bottom":
            target_element_position = this._getOffset(element);
            target_width = target_element_position.width;
            my_width = $(tooltip_layer).width();
            tooltip_layer.style.left = "" + ((target_width / 2) - (tooltip_layer_position.width / 2)) + "px";
            break;
          case "left":
          case "right":
            target_element_position = this._getOffset(element);
            target_height = target_element_position.height;
            my_height = $(tooltip_layer).height();
            tooltip_layer.style.top = "" + ((target_height / 2) - (tooltip_layer_position.height / 2)) + "px";
        }
        switch (this._getPosition(element)) {
          case "left":
            return tooltip_layer.style.left = "-" + (tooltip_layer_position.width - 34) + "px";
          case "right":
            return tooltip_layer.style.right = "-" + (tooltip_layer_position.width - 34) + "px";
          case "bottom":
            return tooltip_layer.style.bottom = "-" + tooltip_layer_position.height + "px";
          case "top":
            return tooltip_layer.style.top = "-" + tooltip_layer_position.height + "px";
        }
      };

      chardin.prototype._positionHelperLayer = function(element) {
        var element_position, helper_layer;

        helper_layer = $(element).data('helper_layer');
        element_position = this._getOffset(element);
        return helper_layer.setAttribute("style", "width: " + element_position.width + "px; height:" + element_position.height + "px; top:" + element_position.top + "px; left: " + element_position.left + "px;");
      };

      chardin.prototype._showElement = function(element) {
        var current_element_position, element_position, helper_layer, tooltip_layer;

        element_position = this._getOffset(element);
        helper_layer = document.createElement("div");
        tooltip_layer = document.createElement("div");
        $(element).data('helper_layer', helper_layer).data('tooltip_layer', tooltip_layer);
        if (element.id) {
          helper_layer.setAttribute("data-id", element.id);
        }
        helper_layer.className = "chardin-helper-layer chardin-" + (this._getPosition(element));
        this._positionHelperLayer(element);
        this.$el.get()[0].appendChild(helper_layer);
        tooltip_layer.className = "chardin-tooltip chardin-" + (this._getPosition(element));
        tooltip_layer.innerHTML = "<div class='chardin-tooltiptext'>" + (element.getAttribute('data-intro')) + "</div>";
        helper_layer.appendChild(tooltip_layer);
        this._placeTooltip(element);
        element.className += " chardin-show-element";
        current_element_position = "";
        if (element.currentStyle) {
          current_element_position = element.currentStyle["position"];
        } else {
          if (document.defaultView && document.defaultView.getComputedStyle) {
            current_element_position = document.defaultView.getComputedStyle(element, null).getPropertyValue("position");
          }
        }
        current_element_position = current_element_position.toLowerCase();
        if (current_element_position !== "absolute" && current_element_position !== "relative") {
          return element.className += " chardin-relative-position";
        }
      };

      chardin.prototype._getOffset = function(element) {
        var element_position, _x, _y;

        element_position = {
          width: element.offsetWidth,
          height: element.offsetHeight
        };
        _x = 0;
        _y = 0;
        while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
          _x += element.offsetLeft;
          _y += element.offsetTop;
          element = element.offsetParent;
        }
        element_position.top = _y;
        element_position.left = _x;
        return element_position;
      };

      return chardin;

    })();
    return $.fn.extend({
      chardin: function() {
        var $this, args, data, option;

        option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        $this = $(this[0]);
        data = $this.data('chardin');
        if (!data) {
          $this.data('chardin', (data = new chardin(this, option)));
        }
        if (typeof option === 'string') {
          data[option].apply(data, args);
        }
        return data;
      }
    });
  })(window.jQuery, window);

}).call(this);
