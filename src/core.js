(function(MessageBox, $, undefined) {
    defaults = {
        buttons: 'close',
        hideTitle: false,
        hideContent: false,
        title: 'Messsage',
        message: null,
        identifier: null,
        remote: null
    };

    // jshint multistr:true
    MessageBox.template = ' \
        <div id="messagebox-modal" class="modal fade"> \
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
        var messageBox = $('#messagebox-modal');

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
        $('body').on('click', '[data-toggle="messagebox"]', function(event) {
            var element = $(event.target);

            MessageBox.Show({
                buttons: element.attr('data-buttons'),
                hideTitle: element.attr('data-hide-title'),
                message: element.attr('data-message'),
                identifier: element.attr('data-identifier'),
                remote: element.attr('data-url')
            });
        });

        //Show/Hide events
        $('body').on('shown.bs.modal', '#messagebox-modal', triggerMessageboxEvent.bind(null, 'shown'));
        $('body').on('hidden.bs.modal', '#messagebox-modal', triggerMessageboxEvent.bind(null, 'hidden'));

        //Button events
        $('body').on('click', '#messagebox-modal #ok-button', triggerMessageboxEvent.bind(null, 'ok'));
        $('body').on('click', '#messagebox-modal #cancel-button', triggerMessageboxEvent.bind(null, 'cancel'));
        $('body').on('click', '#messagebox-modal #close-button', triggerMessageboxEvent.bind(null, 'close'));
    }

    MessageBox.Show = function(options) {
        var modal = $('#messagebox-modal');
        var body = modal.find('.modal-body');
        var header = modal.find('.modal-header');
        var footer = modal.find('.modal-footer');
        var settings = $.extend(defaults, options);

        if (!settings.message || !settings.identifier) {
            throw "Message and Identifier must be specified";
        }

        modal.attr('data-identifier', settings.identifier);

        header.toggle(!settings.hideTitle);
        body.toggle(!settings.hideContent);

        header.html(settings.title);
        parseButtonSettings(footer, settings.buttons);

        if (settings.remote) {
            loadRemoteContent(body, settings.remote);
        } else {
            body.html(settings.message);
            modal.modal('show');
        }
    };

    function triggerMessageboxEvent(eventName) {
        var modal = $('#messagebox-modal');
        var identifier = modal.attr('data-identifier');

        modal.trigger(eventName + '.messagebox.' + identifier);
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

        $('button', footer).hide();

        for (var i = 0; i < buttonsArray.length; i++) {
            $('#' + buttonsArray[i].trim() + '-button', footer).show();
        }
    }

    $(function() {
        init();
        eventHandlers();
    });

})(window.MessageBox = window.MessageBox || {}, jQuery);
