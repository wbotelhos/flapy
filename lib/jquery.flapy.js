/*!
 * jQuery Flapy - A Tab Menu
 * --------------------------------------------------------------
 *
 * jQuery Flapy is a plugin to transform containers in tab menu.
 *
 * Licensed under The MIT License
 *
 * @version        0.2.0
 * @since          2012-01-11
 * @author         Washington Botelho
 * @documentation  wbotelhos.com/flapy
 *
 * --------------------------------------------------------------
 *
 *  $('#tab').flapy();
 *
 *  <div id="tab">
 *    <div>Box 1</div>
 *    <div>Box 2</div>
 *    <div>Box 3</div>
 *  </div>
 *
 */

;(function($) {

  var methods = {
    init: function(settings) {
      return this.each(function() {
        this.opt = $.extend({}, $.fn.flapy.defaults, settings);

        var self           = $(this).addClass('flapy'),
            boxesContainer = this.opt.wrapper ? self.children(this.opt.wrapper).addClass('flapy-wrapper') : self;

        this.header = methods._header.call(this);
        this.tabs   = this.header.children('li');
        this.boxes  = methods._boxes.call(this, boxesContainer);

        if (this.opt.border) {
          methods._activeTab.call(this, this.activedIndex);
        }

        methods._bindTabs.call(this);
        methods._expandTabs.call(this);

        self.data({ 'settings': this.opt, 'flapy': true });
      });
    }, _activeTab: function(index) {
      var total = this.opt.headers.length,
          tab   = this.tabs
                    .removeClass('active flapy-none-left flapy-none-right')
                      .eq(index).addClass('active');

      if (total > 2) {
        if (index == 0) {
          tab.next('li').addClass('flapy-none-left');
        } else if (index == total - 1) {
          tab.prev('li').addClass('flapy-none-right');
        }
      }
    }, _activeBox: function(index) {
      this.boxes.removeClass('active').eq(index).addClass('active');
    }, _bindTabs: function() {
      var that = this;

      that.tabs.on('click', function(evt) {
        var actual = $(this);

        if (actual.hasClass('active')) {
          return false;
        }

        var index = that.tabs.index(actual);

        if (that.opt.border) {
          methods._activeTab.call(that, index);
        }

        methods._activeBox.call(that, index);
      });
    }, _boxes: function(container) {
      var boxes = container.children(this.opt.box).addClass('flapy-box');

      for (var i in this.opt.headers) {
        if (this.opt.headers[i].hide) {
          boxes.eq(i).hide();
        }
      }

      boxes.eq(this.activedIndex).addClass('active');

      return boxes;
    }, _expandTabs: function() {
      var self  = $(this),
          width = self.outerWidth(),
          count = this.opt.headers.length,
          rest  = width % count,
          round = (width - rest) / count,
          unit  = self.css('width').indexOf('%') > 0 ? '%' : '';

      this.tabs.width(round + unit);

      for (var i = 0; i < rest; i++) {
        var tab = this.tabs.eq(i);

        tab.width((tab.width() + 1) + unit);
      }
    }, _header: function() {
      var that   = this,
          header = $('<ul />', { 'class': 'flapy-header' }).prependTo(that);

      that.activedIndex = 0;

      for (var i in that.opt.headers) {
        var head  = that.opt.headers[i],
            li    = $('<li />'),
            div   = $('<div />');

        if (head.hide) {
          li.hide();

          if (i == 0) {
            that.activedIndex++;
          }
        } else if (head.active) {
          that.activedIndex = i;
        }

        if (head.tag) {
          $('<' + head.tag + ' />', { text: head.text }).appendTo(div);
        } else {
          div.text(head.text);
        }

        div.appendTo(li);
        li.appendTo(header);
      }

      return header;
    }
  };

  $.fn.flapy = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist!');
    }
  };

  $.fn.flapy.defaults = {
    border  : true,
    box     : 'div',
    headers : [],
    wrapper : undefined
  };

})(jQuery);
