/**
 * Simple-Unobtrusive-Bootstrap-MessageBox - A plugin to connect validation plugins with ASP.NET's unobtrusive validation attributes 
 * @version v0.1.1
 * @link https://github.com/amura11/Simple-Unobtrusive-Bootstrap-MessageBox
 * @license MIT
 */
(function(MessageBox, $, undefined) {
    'use strict';
    var modalId = '#message-box-modal';

    MessageBox.defaults = {
        buttons: 'close',
        hideTitle: false,
        hideContent: false,
        title: 'Messsage',
        message: null,
        identifier: null,
        url: null
    };

    // jshint multistr:true
    MessageBox.template = ' \
        <div id="message-box-modal" class="modal fade"> \
            <div class="modal-dialog"> \
                <div class="modal-content">\
                    <div class="modal-header"><h4 class="modal-title"></h4></div> \
                    <div class="modal-body"></div> \
                    <div class="modal-footer"> \
                        <button id="ok-button" type="button" class="btn btn-default" data-dismiss="modal">Ok</button> \
                        <button id="close-button" type="button" class="btn btn-default" data-dismiss="modal">Close</button> \
                        <button id="cancel-button" type="button" class="btn btn-default" data-dismiss="modal">Cancel</button> \
                    </div> \
                </div> \
            </div> \
		</div> \
		';

    function init() {
        var messageBox = $(modalId);

        //Create the message box if it doesn't exist
        if (messageBox.length === 0) {
            messageBox = $(MessageBox.template).appendTo(document.body);
        }

        messageBox.modal({
            backdrop: 'static',
            keyboard: false,
            show: false
        });
    }

    function eventHandlers() {
        $('body').on('click', '[data-toggle="message-box"]', function(event) {
            var element = $(event.target);

            MessageBox.Show({
                buttons: element.attr('data-buttons'),
                hideTitle: element.attr('data-hide-title'),
                message: element.attr('data-message'),
                identifier: element.attr('data-identifier'),
                url: element.attr('data-url')
            });
        });

        //Show/Hide events
        $('body').on('shown.bs.modal', modalId, triggerMessageboxEvent.bind(null, 'shown'));
        $('body').on('hidden.bs.modal', modalId, triggerMessageboxEvent.bind(null, 'hidden'));

        //Button events
        $('body').on('click', modalId + ' #ok-button', triggerMessageboxEvent.bind(null, 'ok'));
        $('body').on('click', modalId + ' #cancel-button', triggerMessageboxEvent.bind(null, 'cancel'));
        $('body').on('click', modalId + ' #close-button', triggerMessageboxEvent.bind(null, 'close'));
    }

    MessageBox.Show = function(options) {
        var modal = $(modalId);
        var body = modal.find('.modal-body');
        var header = modal.find('.modal-header');
        var footer = modal.find('.modal-footer');
        var settings = $.extend(MessageBox.defaults, options);

        if (!(settings.message || settings.url) || !settings.identifier) {
            throw "Message or Url and Identifier must be specified";
        }

        modal.attr('data-identifier', settings.identifier);

        header.toggle(!settings.hideTitle);
        body.toggle(!settings.hideContent);

        header.html(settings.title);
        parseButtonSettings(footer, settings.buttons);

        if (settings.url) {
            loadRemoteContent(body, settings.remote);
        } else {
            body.html(settings.message);
            modal.modal('show');
        }
    };

    function triggerMessageboxEvent(eventName, parameters) {
        var modal = $(modalId);
        var identifier = modal.attr('data-identifier');

        modal.trigger(eventName + '.message-box.' + identifier, parameters);
    }

    function loadRemoteContent(body, url) {
        $.ajax({
            type: 'GET',
            url: url,
            success: function(result) {
                body.htm(result);
                modal.modal('show');
            }
        });
    }

    function parseButtonSettings(footer, buttons) {
        var buttonsArray = buttons.split(',');

        //Hide all the buttons and remove any classes
        $('button', footer).hide().removeClass().addClass('btn');

        for (var i = 0; i < buttonsArray.length; i++) {
        	var buttonConfig = buttonsArray[i].trim().split(':');

            //Determine the button class
            var buttonClass = buttonConfig[1] ? 'btn-' + buttonConfig[1] : 'btn-default';

            //Show the button and add the class
            $('#' + buttonConfig[0] + '-button', footer).show().addClass(buttonClass);
        }
    }

    $(function() {
        init();
        eventHandlers();
    });

})(window.MessageBox = window.MessageBox || {}, jQuery);
