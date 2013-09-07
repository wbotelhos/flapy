describe('Flapy', function() {
  beforeEach(function() {
    Factory.html(
      '<div id="tab">' +
        '<div>Box 1</div>' +
        '<div>Box 2</div>' +
        '<div>Box 3</div>' +
      '</div>'
    );
  });

  afterEach(function() { Factory.clear(); });

  describe('channing', function() {
    it ('is chainable', function() {
      // given
      var tab   = $('#tab'),
          clazz = 'some-class';

      // when
      tab.flapy().addClass(clazz);

      // then
      expect(tab).toHaveClass(clazz);
    });
  });

  describe('clazz option', function() {
    context('with default value', function() {
      it ('set it to wrapper', function() {
        // given
        var tab = $('#tab');

        // when
        tab.flapy();

        // then
        expect(tab).toHaveClass('flapy');
      });
    });
  });

  describe('header', function() {
    context('without tag element', function() {
      it ('creates header wrapper', function() {
        // given
        var tab = $('#tab');

        // when
        tab.flapy({
          headers: [{ text: 'Ruby' }, { text: 'Python' }, { text: 'Java' }]
        });

        // then
        var header = tab.children('ul:first');
        expect(header).toHaveClass('flapy-header');

        var tabs = header.children('li');
        expect(tabs.length).toEqual(3);

        var spacers = tabs.children('div');
        expect(spacers.length).toEqual(3);

        var tag = spacers.children();
        expect(tag.length).toEqual(0);

        expect(spacers[0].innerHTML).toBe('Ruby');
        expect(spacers[1].innerHTML).toBe('Python');
      });
    });

    context('with tag element', function() {
      it ('appends it into spacer with the given text', function() {
        // given
        var tab = $('#tab');

        // when
        tab.flapy({
          headers: [{ tag: 'h2', text: 'Ruby' }, { tag: 'h2', text: 'Python' }, { text: 'Java' }]
        });

        // then
        var header  = tab.children('ul:first'),
            tags    = header.find('h2');

        expect(tags.length).toBe(2);
        expect(tags[0].innerHTML).toBe('Ruby');
        expect(tags[1].innerHTML).toBe('Python');
      });
    });

    context('without active element', function() {
      it ('actives the first tab', function() {
        // given
        var tab = $('#tab');

        // when
        tab.flapy({
          headers: [{ text: 'Ruby' }, { text: 'Python' }, { text: 'Java' }]
        });

        // then
        var tabs = tab.children('ul:first').children('li');

        expect(tabs.filter(':eq(0)')).toHaveClass('active');
        expect(tabs.filter(':eq(1)')).not.toHaveClass('active');
      });
    });

    context('with active element', function() {
      it ('actives the given tab', function() {
        // given
        var tab = $('#tab');

        // when
        tab.flapy({
          headers: [{ text: 'Ruby' }, { text: 'Python', active: true }, { text: 'Java' }]
        });

        // then
        var tabs = tab.children('ul:first').children('li');

        expect(tabs.filter(':eq(0)')).not.toHaveClass('active');
        expect(tabs.filter(':eq(1)')).toHaveClass('active');
      });
    });

    context('with more than one active element', function() {
      it ('actives last one', function() {
        // given
        var tab = $('#tab');

        // when
        tab.flapy({
          headers: [{ text: 'Ruby', active: true }, { text: 'Python', active: true }, { text: 'Java' }]
        });

        // then
        var tabs = tab.children('ul:first').children('li');

        expect(tabs.filter(':eq(0)')).not.toHaveClass('active');
        expect(tabs.filter(':eq(1)')).toHaveClass('active');
      });
    });

    context('clicking on inactive head', function() {
      it ('actives the clicked head', function() {
        // given
        var tab = $('#tab').flapy({
          headers: [{ text: 'Ruby' }, { text: 'Python' }, { text: 'Java' }]
        });

        // when
        tab[0].tabs.eq(1).click();

        // then
        expect(tab[0].tabs.eq(0)).not.toHaveClass('active');
        expect(tab[0].tabs.eq(1)).toHaveClass('active');
      });
    });

    context('clicking on active head', function() {
      it ('the same head keeps active', function() {
        // given
        var tab = $('#tab').flapy({
          headers: [{ text: 'Ruby' }, { text: 'Python' }, { text: 'Java' }]
        });

        // when
        tab[0].tabs.eq(0).click();

        // then
        expect(tab[0].tabs.eq(0)).toHaveClass('active');
        expect(tab[0].tabs.eq(1)).not.toHaveClass('active');
      });
    });

    context('with more than 2 tabs', function() {
      context('and active option true', function() {
        context('and inactive tab ahead', function() {
          it ('applies none border left style on next inactive tab', function() {
            // given
            var tab = $('#tab');

            // when
            tab.flapy({
              headers: [{ text: 'Ruby', active: true }, { text: 'Python' }, { text: 'Java' }]
            });

            // then
            var tabs = tab[0].tabs;

            expect(tabs.eq(0)).not.toHaveClass('flapy-none-left');
            expect(tabs.eq(1)).toHaveClass('flapy-none-left');
            expect(tabs.eq(2)).not.toHaveClass('flapy-none-left');

            expect(tabs.eq(0)).not.toHaveClass('flapy-none-right');
            expect(tabs.eq(1)).not.toHaveClass('flapy-none-right');
            expect(tabs.eq(2)).not.toHaveClass('flapy-none-right');
          });
        });

        context('and inactive tab behind', function() {
          it ('applies none border right style on prev inactive tab', function() {
            // given
            var tab = $('#tab');

            // when
            tab.flapy({
              headers: [{ text: 'Ruby' }, { text: 'Python' }, { text: 'Java', active: true }]
            });

            // then
            var tabs = tab[0].tabs;

            expect(tabs.eq(0)).not.toHaveClass('flapy-none-left');
            expect(tabs.eq(1)).not.toHaveClass('flapy-none-left');
            expect(tabs.eq(2)).not.toHaveClass('flapy-none-left');

            expect(tabs.eq(0)).not.toHaveClass('flapy-none-right');
            expect(tabs.eq(1)).toHaveClass('flapy-none-right');
            expect(tabs.eq(2)).not.toHaveClass('flapy-none-right');
          });
        });
      });

      context('and activating via click', function() {
        context('on click on the last tab', function() {
          it ('applies none border right style on prev inactive tab', function() {
            // given
            var tab = $('#tab').flapy({
              headers: [{ text: 'Ruby' }, { text: 'Python' }, { text: 'Java' }]
            });

            var tabs = tab[0].tabs;

            // when
            tabs.eq(2).click();

            // then
            expect(tabs.eq(0)).not.toHaveClass('flapy-none-left');
            expect(tabs.eq(1)).not.toHaveClass('flapy-none-left');
            expect(tabs.eq(2)).not.toHaveClass('flapy-none-left');

            expect(tabs.eq(0)).not.toHaveClass('flapy-none-right');
            expect(tabs.eq(1)).toHaveClass('flapy-none-right');
            expect(tabs.eq(2)).not.toHaveClass('flapy-none-right');
          });
        });

        context('on click on the first tab', function() {
          it ('applies none border left style on next inactive tab', function() {
            // given
            var tab = $('#tab').flapy({
              headers: [{ text: 'Ruby' }, { text: 'Python' }, { text: 'Java', active: true }]
            });

            var tabs = tab[0].tabs;

            // when
            tabs.eq(0).click();

            // then
            expect(tabs.eq(0)).not.toHaveClass('flapy-none-left');
            expect(tabs.eq(1)).toHaveClass('flapy-none-left');
            expect(tabs.eq(2)).not.toHaveClass('flapy-none-left');

            expect(tabs.eq(0)).not.toHaveClass('flapy-none-right');
            expect(tabs.eq(1)).not.toHaveClass('flapy-none-right');
            expect(tabs.eq(2)).not.toHaveClass('flapy-none-right');
          });
        });
      });
    });

    context('with rounded width', function() {
      it ('does the round division for each tab', function() {
        // given
        var tab = $('#tab').width(300);

        // when
        tab.flapy({
          headers: [{ text: 'Ruby' }, { text: 'Python' }, { text: 'Java' }]
        });

        // then
        var tabs = tab[0].tabs;

        expect(tabs.eq(0).width()).toBe(100);
        expect(tabs.eq(1).width()).toBe(100);
        expect(tabs.eq(2).width()).toBe(100);
      });
    });

    context('with not rounded width', function() {
      it ('does the round division for each tab and increment 1 for each left to right tab', function() {
        // given
        var tab = $('#tab').width(302);

        // when
        tab.flapy({
          headers: [{ text: 'Ruby' }, { text: 'Python' }, { text: 'Java' }]
        });

        // then
        var tabs = tab[0].tabs;

        expect(tabs.eq(0).width()).toBe(101);
        expect(tabs.eq(1).width()).toBe(101);
        expect(tabs.eq(2).width()).toBe(100);
      });
    });

    it ('receives class', function() {
      // given
      var tab = $('#tab');

      // when
      tab.flapy();

      // then
      var tabs = tab.children(tab[0].opt.box);
      expect(tabs).toHaveClass('flapy-box');
    });

    it ('active the same position that the active header', function() {
      // given
      var tab = $('#tab');

      // when
      tab.flapy({
        headers: [{ text: 'Ruby' }, { text: 'Python', active: true }, { text: 'Java' }]
      });

      // then
      var tabs = tab.children(tab[0].opt.box);
      expect(tabs[1]).toHaveClass('active');
    });

    context('clicking on inactive head', function() {
      it ('actives the boxe with the same clicked head index', function() {
        // given
        var tab = $('#tab').flapy({
          headers: [{ text: 'Ruby' }, { text: 'Python' }, { text: 'Java' }]
        });

        // when
        tab[0].tabs.eq(1).click();

        // then
        expect(tab[0].boxes.eq(0)).not.toHaveClass('active');
        expect(tab[0].boxes.eq(1)).toHaveClass('active');
      });
    });

    context('clicking on active head', function() {
      it ('the same box keeps active', function() {
        // given
        var tab = $('#tab').flapy({
          headers: [{ text: 'Ruby', active: true }, { text: 'Python' }, { text: 'Java' }]
        });

        // when
        tab[0].tabs.eq(0).click();

        // then
        expect(tab[0].boxes.eq(0)).toHaveClass('active');
        expect(tab[0].boxes.eq(1)).not.toHaveClass('active');
      });
    });

    context('clicking on active head', function() {
      it ('calls click bind', function() {
        // given
        var tab = $('#tab').flapy({
          headers: [{ text: 'Ruby', active: true }, { text: 'Python' }, { text: 'Java' }]
        }),
        opt     = tab[0].opt,
        target  = tab[0].tabs.eq(0);

        spyOnEvent(target, 'click');

        // when
        target.click();

        // then
        expect('click').toHaveBeenTriggeredOn(target);
      });
    });

    context('clicking on inactive head', function() {
      it ('calls click bind', function() {
        // given
        var tab = $('#tab').flapy({
          headers: [{ text: 'Ruby', active: true }, { text: 'Python' }, { text: 'Java' }]
        }),
        opt     = tab[0].opt,
        target  = tab[0].tabs.eq(1);

        spyOnEvent(target, 'click');

        // when
        target.click();

        // then
        expect('click').toHaveBeenTriggeredOn(target);
      });
    });
  });

  describe('border', function() {
    context('disabled', function() {
      it ('prevents the border styles', function() {
        // given
        var tab = $('#tab');

        // when
        tab.flapy({
          border : false,
          headers: [{ text: 'Ruby', active: true }, { text: 'Python' }, { text: 'Java' }]
        });

        // then
        var tabs = tab[0].tabs;

        expect(tabs.eq(0)).not.toHaveClass('flapy-none-left');
        expect(tabs.eq(1)).not.toHaveClass('flapy-none-left');
        expect(tabs.eq(2)).not.toHaveClass('flapy-none-left');

        expect(tabs.eq(0)).not.toHaveClass('flapy-none-right');
        expect(tabs.eq(1)).not.toHaveClass('flapy-none-right');
        expect(tabs.eq(2)).not.toHaveClass('flapy-none-right');
      });
    });
  });

  describe('box', function() {
    it ('has default value', function() {
      // given
      var tab = $('#tab');

      // when
      tab.flapy();

      // then
      expect(tab[0].opt.box).toBe('div');
    });

    context('using the wrapper option', function() {
      it ('applies the wrapper class on this element', function() {
        // given
        var tab = $('#tab').html(
          '<div>' +
            '<p>outside-element</p>' +
            '<div>Box 1</div>' +
            '<div>Box 2</div>' +
            '<div>Box 3</div>' +
          '</div>'
        );

        // when
        tab.flapy({ wrapper: 'div' });

        // then
        expect(tab[0].opt.wrapper).toBe('div');
      });

      it ('applies the box class on wrappers children box', function() {
        // given
        var tab = $('#tab').html(
          '<div>' +
            '<p>outside-element</p>' +
            '<div>Box 1</div>' +
            '<div>Box 2</div>' +
            '<div>Box 3</div>' +
          '</div>'
        );

        // when
        tab.flapy({ wrapper: 'div' });

        // then
        var tabs = tab.children(tab[0].opt.wrapper).children(tab[0].opt.box);
        expect(tabs).toHaveClass('flapy-box');
      });
    });
  });

  describe('hide', function() {
    context('true', function() {
      it ('hides the tab', function() {
        // given
        var tab = $('#tab');

        // when
        tab.flapy({
          headers: [{ text: 'Ruby', hide: true }, { text: 'Python' }, { text: 'Java' }]
        });

        // then
        expect(tab[0].tabs.eq(0)).toBeHidden();
      });

      it ('hides the boxes', function() {
        // given
        var tab = $('#tab');

        // when
        tab.flapy({
          headers: [{ text: 'Ruby', hide: true }, { text: 'Python' }, { text: 'Java' }]
        });

        // then
        expect(tab[0].boxes.eq(0)).toBeHidden();
      });

      context('on a active tab', function() {
        context('not beeing the first', function() {
          it ('hides and desactive the given tab and active the first one', function() {
            // given
            var tab = $('#tab');

            // when
            tab.flapy({
              headers: [{ text: 'Ruby' }, { text: 'Python', active: true, hide: true }, { text: 'Java' }]
            });

            // then
            var tabs = tab[0].tabs;

            expect(tabs.first()).toHaveClass('active');
            expect(tabs.eq(1)).not.toHaveClass('active');
            expect(tabs.eq(1)).toBeHidden();
          });
        });

        context('beeing the first', function() {
          it ('hides and desactive the given tab and active the next one', function() {
            // given
            var tab = $('#tab');

            // when
            tab.flapy({
              headers: [{ text: 'Ruby', active: true, hide: true }, { text: 'Python' }, { text: 'Java' }]
            });

            // then
            var tabs = tab[0].tabs;

            expect(tabs.first()).not.toHaveClass('active');
            expect(tabs.first()).toBeHidden();
            expect(tabs.eq(1)).toHaveClass('active');
          });
        });
      });
    });
  });

  describe('options', function() {
    it ('has the right value options', function() {
      // given
      var flapy = $.fn.flapy

      // when
      var opt = flapy.defaults

      // then
      expect(opt.border).toBeTruthy();
      expect(opt.box).toEqual('div');
      expect(opt.headers).toEqual([]);
      expect(opt.wrapper).toBeUndefined();
    });
  });
});
