# Simple Unobtrusive Bootstrap MessageBox
A simple and lightweight library to provide a Booststrap based message box. The library handles adding, opening, and populating the message box.

##Examples

###HTML5 Data Attribute
```
<button type="button" class="btn" data-toggle="message-box" data-buttons="ok:success,cancel" data-message="This will do some stuff" data-identifier="my-message-box">
    Open Modal
</button>
```

###JavaScript
```javascript
MessageBox.Show({
    identifier: 'my-message-box'
    buttons: 'ok:success,cancel',
    message: 'This will do some stuff'
});
```
##Options

###Toggle (required)
*HTML5 Data Attribute:* `data-toggle`
*JavaScript:* N/A

The value of this option must be `message-box`. This indicates that when this element is toggled it will open a message box with the given options.

###Identifier (required)
*HTML5 Data Attribute:* `data-identifier`
*JavaScript:* `identifier`

The identifier option is used to uniquely identify the dialog that is currently open. The library uses one modal for all dialogs and uses this option to distinguish between events. When an event is triggered this identifier is appended to the event name. Eg. `shown.message-box.my-identifier`.

###Message (required)
*HTML5 Data Attribute:* `data-message`
*JavaScript:* `message`

This is the message that is displayed in the message box.

###Buttons (optional)
*HTML5 Data Attribute:* `data-button`
*JavaScript:* `buttons`

A comma separated list of button names to enable and the class to apply to that button. To specify the class of a button append a semi-colon to the name then the class to add, eg. `ok:success` will add `btn-success` to the button with the id `ok-button`.

##Events
All events that are triggered by the library will be of the form `<event>.message-box.<identifier>`. This allows for event handlers to bind to the same events for different identifiers, ie. performing one action when a certain message box is shown and a different one when another is shown.

###Shown
*Full Event Name:* `shown.message-box.<identifier>`
*Triggered:* After the content has been loaded and the modal is made visible
*Parameters:* None

###Hidden
*Full Event Name:* `hidden.message-box.<identifier>`
*Triggered:* After the modal has been closed and all animations have completed
*Parameters:* None

###Error
*Full Event Name:* `error.message-box.<identifier>`
*Triggered:* When a message box with remote content results in an Ajax error.
*Parameters:* jqXHR jqXHR, PlainObject ajaxSettings, String thrownError
