"use strict";

/* Change slide opacity during scroll */

jQuery(window).scroll(function () {
    jQuery(".slide-1").css("opacity", 1 - jQuery(window).scrollTop() / (window.innerHeight / 5));
    jQuery(".slide-2").css("opacity", jQuery(window).scrollTop() / (jQuery(".slide-2").offset().top - 100));
    jQuery(".slide-3").css("opacity", jQuery(window).scrollTop() / (jQuery(".slide-3").offset().top + window.innerHeight / 2));
});

/* Hide scroll guide */
setTimeout(function () {
    return jQuery('.mouse').addClass('fade-out');
}, 3000);

/* Waypoints */
var slide_1 = null;
var slide_2 = null;
var slide_3 = null;

var waypoint = new Waypoint({
    offset: window.innerHeight / 2,
    element: jQuery('.slide-2')[0],
    handler: function handler(direction) {
        jQuery('.slide-2 .bash-window').show();
        if (!slide_2) {
            jQuery('.slide-2 .what-do-i-do').addClass('reveal-from-left');
            jQuery('.slide-2 .type-area').typeIt({
                callback: function callback() {
                    jQuery('.ti-cursor').remove();
                    jQuery('.slide-2 .bash-window > ul > li:nth-child(1)').typeIt({
                        speed: 20,
                        autoStart: false,
                        callback: function callback() {
                            jQuery('.ti-cursor').remove();
                            jQuery('body > div.slide.slide-2.code-bg > div > ul > li:nth-child(2)').typeIt({ speed: 10, autoStart: false });
                            jQuery('.ti-cursor').html('&#x258c;');
                        } });
                    jQuery('.ti-cursor').html('&#x258c;');
                }
            }).tiType('echo $skills');
            jQuery('.ti-cursor').html('&#x258c;');
        }

        slide_2 = true;
    }
});

/* Typing logic */
var headline_finished = new Promise(function (resolve, reject) {
    jQuery('.slide-2 h1.what-do-i-do').on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function () {
        jQuery('.slide-2 h1.what-do-i-do').removeClass('type-animation');
        jQuery('.slide-2 .code-header').addClass('type-animation').removeClass('hidden');
    });
});

/* Contact logic */

var contact = new Waypoint({
    element: jQuery('.slide-3')[0],
    handler: function handler() {
        jQuery('.social > a').addClass('slide-down');
    }
});

/* Bash Window logic */
jQuery('.window-control.green').on('click', function () {
    jQuery('.bash-window').toggleClass('full-screen');
});
jQuery('.window-control.yellow').on('click', function () {
    jQuery('.bash-window .bash-prompt,.bash-window .skills').toggle();
    jQuery('.bash-window').toggleClass('minimized');
});
jQuery('.window-control.red').on('click', function () {
    jQuery('.bash-window').hide();
});