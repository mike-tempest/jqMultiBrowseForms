/*!
 * jQuery Multi Browser Forms
 * Original author: @mike_tempest
 * Licensed under the MIT license
 */


// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;
(function($, window, document, undefined) {

    // undefined is used here as the undefined global 
    // variable in ECMAScript 3 and is mutable (i.e. it can 
    // be changed by someone else). undefined isn't really 
    // being passed in so we can ensure that its value is 
    // truly undefined. In ES5, undefined can no longer be 
    // modified.

    // window and document are passed through as local 
    // variables rather than as globals, because this (slightly) 
    // quickens the resolution process and can be more 
    // efficiently minified (especially when both are 
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'jqMultiBrowserForms',
            defaults = {
        propertyName: "value"
    };

    // The actual plugin constructor
    function MultiBrowserForms(element, options) {
        this.element = $(element);

        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    // This runs through the selector and checks what
    // elements are contained, then sends said elements
    // to the appropriate function
    MultiBrowserForms.prototype.init = function() {
        var me = this;

        return this.element.each(function() {
            var formEl = $(this);
            if (formEl.hasClass('jqMultiFormsBuilt')) {
                return;
            }
            formEl.addClass('jqMultiFormsBuilt');

            // Send fields to the correct function
            me._buildSelect($(this).find('select'));
            me._buildCheckbox($(this).find('input:checkbox'));
            me._buildRadio($(this).find('input:radio'));

        });
    };

    // This function builds the dom structure for the select
    // to be styled cross browser easily
    MultiBrowserForms.prototype._buildSelect = function(els) {
        if (els.length > 0) {
            els.each(function() {
                var list = $(document.createElement('ul'));

                $(this).find('option').each(function(i) {
                    list.append('<li><a href="#" index="' + i + '">' + this.innerHTML + '</a></li>');
                });

                $(this).addClass('jqMultiHide')
                        .wrap('<div class="jqMultiSelectWrapper">')
                        .parent()
                        .prepend('<div><span>' + $(this).find(':first-child').html() + '</span><a href="#" class="jqTransformSelectOpen"></a></div>')
                        .append(list);
                
                list.children(':first-child').children('a').addClass('selected');
            });

            // Add listeners to the dom for select interactions
            this._addSelectListeners();
        }
    };

    // This adds the necessary listeners for select functionality
    // note that it does not apply a listener for every element
    // only for the class, then 
    MultiBrowserForms.prototype._addSelectListeners = function() {
            $('.jqMultiSelectWrapper').find('span').on('click', function(e){
                e.preventDefault();
                var showNew = !$(this).parents('.jqMultiSelectWrapper').hasClass('focus');
                
                if ( $('.jqMultiSelectWrapper').hasClass('focus')) {
                    $('.jqMultiSelectWrapper')
                            .removeClass('focus')                            
                            .find('ul')
                            .slideUp(150);
                } 
                
                if (showNew) {
                    $(this).parents('.jqMultiSelectWrapper')
                            .addClass('focus')
                            .find('ul')
                            .slideDown(150);
                }
            }).next('a').on('focus', function(){
                var currIndex = $(this).parents('.jqMultiSelectWrapper').find('select')[0].selectedIndex;
                $(this).prev('span').trigger('click');
                $(this).parents('.jqMultiSelectWrapper').find('ul').children(':eq('+currIndex+')').children()[0].focus();
            });
            
            $('.jqMultiSelectWrapper').find('li').on('click', function(e){
                e.preventDefault();
                var selectParent = $(this).parents('.jqMultiSelectWrapper'),
                    select = $(this).parents('.jqMultiSelectWrapper').find('select');
                    
                selectParent.find('span').trigger('click');
                selectParent.find('.selected').removeClass('selected');
                $(this).find('a').addClass('selected');
                
                if (select[0].selectedIndex != $(this).children('a').attr('index')) {
                    select[0].selectedIndex = $(this).children('a').attr('index');
                    select.trigger('change');
                    selectParent.find('span').html($(this).children('a').html());
                }
            })
            
            $(document).mousedown(function(e){
                if ($(e.target).parents('.jqMultiSelectWrapper').length === 0) { 
                    $('.jqMultiSelectWrapper.focus').find('span').trigger('click');
                }
            });
    };

    MultiBrowserForms.prototype._buildRadio = function(els) {
        if (els.length > 0) {
            els.each(function(){
               $(this).addClass('jqMultiHide')
                       .wrap('<div class="jqMultiRadioWrapper">')
                        .parent()
                        .prepend('<a href="#" rel="'+ this.name +'"><span></span></a>');
            });
            
            this._addRadioListeners();
        }
    };
    
    MultiBrowserForms.prototype._addRadioListeners = function() {
        $('.jqMultiRadioWrapper').delegate('a','click', function(e) {
                e.preventDefault();
                var me = $(this);
				if(me.next('input').attr('disabled')){return false;}
				me.next('input').trigger('click').trigger('change');
        });
        
        $('.jqMultiRadioWrapper').delegate('input','change', function(){
            if ($(this).is(':checked')) {
                $(this).prev('a').addClass('jqMultiChecked');
            } else {
                $(this).prev('a').removeClass('jqMultiChecked');
            }
        });
    };

    MultiBrowserForms.prototype._buildCheckbox = function(els) {
        if (els.length > 0) {
            els.each(function(){
               $(this).addClass('jqMultiHide')
                       .wrap('<div class="jqMultiCheckboxWrapper">')
                        .parent()
                        .prepend('<a href="#" rel="'+ this.name +'"><span></span></a>');
            });
            
            this._addCheckboxListeners();
        }
    };
    
    MultiBrowserForms.prototype._addCheckboxListeners = function() {
        $('.jqMultiCheckboxWrapper').delegate('a','click', function(e) {
                e.preventDefault();
                var me = $(this);
				if(me.next('input').attr('disabled')){return false;}
				me.next('input').trigger('click').trigger('change');
        });
        
        $('.jqMultiCheckboxWrapper').delegate('input','change', function(){
            if ($(this).is(':checked')) {
                $(this).prev('a').addClass('jqMultiChecked');
            } else {
                $(this).prev('a').removeClass('jqMultiChecked');
            }
        });
    };


    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                        new MultiBrowserForms(this, options));
            }
        });
    }

})(jQuery, window, document);