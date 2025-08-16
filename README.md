# txt-edit
The project is composed of two parts:
1. The webcomponent `txt-editor`, a simple text editor
2. The `txtEdit` class to access the text editor functionalities 

The web componet can be used as an editable `div` with a formatting toolbar, or as an editor.

To use the webcomponent download and reference `editor.js` in the page using a `script` tag:
`<script src="editor.js"></script>`

## Editable text

To insert editable text on a webpage insert the HTML directly inside the `txt-editor` tag
`<txt-editor>Hello World!</txt-editor>`

The web component `txt-editor` has two states. When the `editor` attribute is added with no value (or any value) the web compoents behaves like an editor. When the attribute is missing or set to `null`, the web compoent behaves like a static `div` tag. Double clicking on the static `txt-editor` element will activate the editing features adding the attribute `editor` to the tag and allowing the user to edit the HTML inside the `txt-editor` tag. The `editor` can also be added through JavaScript.

By clicking on the cancel button on the tollbar, the edited text is restored to the initial text.

By clicking the save button on the toolbar, the attribute `editor` is removed closing the editing features of the `txt-editor` and the edited content is shown.

A `txtEdit` object can be associated to the `txt-editor` tag by including in the tag a unique `id` attribute and referencing the `id` when defining the `txtEdit` object. This can be used to add more features to the editor and to control how the content is saved. FOr more details, refers to [Link Text](#the-editor).

## The Editor

To use the `txt-editor` tag as a simple editor, it is necessary to associate to the the tag a unique `id` parameter, and reference that id when creating a new `txtEdit` object. The `txtEdit` object is used to control the input, the output, and any customized action of the editor.
