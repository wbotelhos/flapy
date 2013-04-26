/*!
 * jQuery Flapy - A Tab Menu
 * ----------------------------------------------------------------------
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
 * ----------------------------------------------------------------------
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

        var $this = $(this).addClass('flapy');

        methods._header.call(this);

        this.opt.boxes = $this.children(this.opt.box);

        if (this.opt.wrapper) {
          this.opt.boxes =
            $this.children(this.opt.wrapper).addClass('flapy-wrapper')
              .children(this.opt.box);
        } else {
          this.opt.boxes = $this.children(this.opt.box);
        }

        this.opt.boxes.addClass('flapy-box');

        this.opt.boxes.eq(this.opt.activedIndex).addClass('active');

        methods._bindTabs.call(this);
        methods._expandTabs.call(this);

        $this.data({ 'settings': this.opt, 'flapy': true });
      });
    }, _expandTabs: function() {
      var $this = $(this),
          width = $this.outerWidth(),
          count = this.opt.headers.length,
          rest  = width % count,
          round = (width - rest) / count,
          unit  = $this.css('width').indexOf('%') > 0 ? '%' : '';

      this.opt.tabs.width(round + unit);

      for (var i = 0; i < rest; i++) {
        var tab = this.opt.tabs.eq(i);

        tab.width((tab.width() + 1) + unit);
      }
    }, _bindTabs: function() {
      var that = this;

      that.opt.tabs.on('click', function(evt) {
        var actual = $(this);

        if (actual.hasClass('active')) {
          return false;
        }

        var index = that.opt.tabs.index(actual);

        if (that.opt.border) {
          methods._activeTab.call(that, index);
        }

        that.opt.boxes.removeClass('active');

        that.opt.boxes.eq(index).addClass('active');
      });
    }, _header: function() {
      this.opt.header = $('<ul />', { 'class': 'flapy-header' }).prependTo(this);
      this.opt.activedIndex = 0;

      for (var i in this.opt.headers) {
        var head  = this.opt.headers[i],
            li    = $('<li />'),
            div   = $('<div />');

        if (head.active) {
          this.opt.activedIndex = i;
        }

        if (head.tag) {
          $('<' + head.tag + ' />', { text: head.text }).appendTo(div);
        } else {
          div.text(head.text);
        }

        div.appendTo(li);
        li.appendTo(this.opt.header);
      }

      this.opt.tabs = this.opt.header.children('li');

      if (this.opt.border) {
        methods._activeTab.call(this, this.opt.activedIndex);
      }
    }, _activeTab: function(index) {
      var total = this.opt.headers.length,
          tab   = this.opt.tabs
                    .removeClass('active')
                    .removeClass('flapy-none-left')
                    .removeClass('flapy-none-right')
                      .eq(index).addClass('active');

      if (total > 2) {
        if (index == 0) {
          tab.next('li').addClass('flapy-none-left');
        } else if (index == total - 1) {
          tab.prev('li').addClass('flapy-none-right');
        }
      }
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
