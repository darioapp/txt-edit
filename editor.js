class txtEditor extends HTMLElement {
    static get observedAttributes() {
        return [`editor`];
    }

    constructor() {
        super();
        this.__loading = false; // Turns true when connectedCallback() starts to skip the first attributeChangedCallback()
        this.actions = [{
            label: `Save`,
            name: 'save',
            type: 'button',
            icon: `<svg width="20" height="20" version="1.1" viewBox="0 0 30 30" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path d="M22,4h-2v6c0,0.552-0.448,1-1,1h-9c-0.552,0-1-0.448-1-1V4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18  c1.105,0,2-0.895,2-2V8L22,4z M22,24H8v-6c0-1.105,0.895-2,2-2h10c1.105,0,2,0.895,2,2V24z"/>
            <rect height="5" width="2" x="16" y="4"/>
            </svg>`,
            command: () => {this.execCmd('save')}
        },{
            label: `Cancel`,
            name: 'cancel',
            type: 'button',
            icon: `<svg width="20" height="20" version="1.1" viewBox="0 0 30 30" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M16.414,15  c0,0,3.139,3.139,3.293,3.293c0.391,0.391,0.391,1.024,0,1.414c-0.391,0.391-1.024,0.391-1.414,0C18.139,19.554,15,16.414,15,16.414  s-3.139,3.139-3.293,3.293c-0.391,0.391-1.024,0.391-1.414,0c-0.391-0.391-0.391-1.024,0-1.414C10.446,18.139,13.586,15,13.586,15  s-3.139-3.139-3.293-3.293c-0.391-0.391-0.391-1.024,0-1.414c0.391-0.391,1.024-0.391,1.414,0C11.861,10.446,15,13.586,15,13.586  s3.139-3.139,3.293-3.293c0.391-0.391,1.024-0.391,1.414,0c0.391,0.391,0.391,1.024,0,1.414C19.554,11.861,16.414,15,16.414,15z"/>
            </svg>`,
            command: () => {this.execCmd('cancel')}
        },{
            label: `Bold`,
            name: 'bold',
            type: 'button',
            icon: '<b>B</b>',
            command: () => {this.execCmd('bold')}
        },
        {
            label: `Italic`,
            name: 'italic',
            type: 'button',
            icon: '<i>I</i>',
            command: () => {this.execCmd('italic')}
        },
        {
            label: `Underline`,
            name: 'underline',
            type: 'button',
            icon: '<u>U</u>',
            command: () => {this.execCmd('underline')}
        },
        {
            label: 'Font',
            name: 'font',
            type: 'select',
            options: ['Arial', 'Courier', 'Times New Roman', 'Georgia'],
            defaultValue: 'Arial',
            icon: null,
            command: (event) => {
                this.execCmd('fontName', event.target.value);
            }
        }];
    }

    execCmd(command, value = null) {
        switch (command) {
            case `save`:
                this.initialContent = this.content();
                console.log(this.initialContent)
                this.removeAttribute(`editor`);
                break;
            case `cancel`:
                if (confirm("Presso Ok to restore the edited text to the initial text.")) {
                    this.textView.innerHTML = this.initialContent;
                }
                break;
            case 'createLink': editorInput(command, value);
            default:
                this.textView.focus();
                console.log(getCaretPosition());
                document.execCommand(command, false, value);
        }
    }

    //Remove, not used
    addAction(action = {name: "", type: "", command: () => {}, icon: ""}) {
        if (action.name && action.type && action.command) {
            action.command = (event) => {
                //execCmd(event,action.command);
                console.log(event.srcElement.value);
                action.command(event.srcElement.value);
                event.srcElement.value = action.defaultValue;
            }
            console.log(action.command);
            this.actions.push(action);
            this.createToolbar();
        } else {
            console.warn("Action not added. Actions must have a name, type, and command funtion.");
        }
    }

    content() {
        return this.textView.innerHTML;
    }

    prepareContentForSave() {
        this.displayContent = document.getElementById("display-content");
        const editorContent = this.textView.innerHTML;
        //this.displayContent.innerHTML = editorContent; // Render editor content in preview
        //this.displayContent.innerHTML = `<xmp>${editorContent}</xmp>`; // Render XML preview
    }

    // Method to create the toolbar
    createToolbar() {
        const toolbar = this.toolbar;
        toolbar.innerHTML = ''; // Clear existing tools

        // Create buttons and select inputs for each txtEdit action
        for(let i=0; i<this.actions.length; i++) {
            switch (this.actions[i].type) {
                case 'button':
                    const button = document.createElement('button');
                    button.innerHTML = this.actions[i].icon;
                    button.title = this.actions[i].label;
                    button.onclick = this.actions[i].command;
                    toolbar.appendChild(button);
                    break;
                case 'select':
                    const selectInput = document.createElement(`select`);
                    selectInput.title = this.actions[i].label;
                    selectInput.name = this.actions[i].name;
                    selectInput.onchange = this.actions[i].command;
                    for (let j = 0; j < this.actions[i].options.length; j++) {
                        let option = document.createElement(`option`);
                        option.value = this.actions[i].options[j];
                        option.text = this.actions[i].options[j];
                        if (this.actions[i].options[j] == this.actions[i].defaultValue) {
                            option.setAttribute('selected',true);
                        }
                        selectInput.appendChild(option);
                    }
                    toolbar.appendChild(selectInput);
                    break;
                default:
                    console.warn(`Unknown action type: ${this.actions[i].type}`);
            }
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`${name} cahnged from ${oldValue} to ${newValue}`);
        if (this.__loading){

        
        switch (name) {
            case `editor`:
                switch (newValue) {
                    case oldValue: break;
                    /*case`true`:
                    case ``:
                        this.initialContent = this.__root.innerHTML;
                        console.log(this.__root.innerHTML);
                        this.__root.innerHTML = ``;
                        this.createEditor();
                        this.textView.innerHTML = this.initialContent;
                        break;
                    case `false`:*/
                    case null:
                        this.addEditListener();
                        this.innerHTML = this.initialContent;
                        this.__root.innerHTML = this.initialContent;
                        break;
                    default:
                        this.initialContent = this.__root.innerHTML;
                        console.log(this.__root.innerHTML);
                        this.__root.innerHTML = ``;
                        this.createEditor();
                        this.textView.innerHTML = this.initialContent;
                }
        }}
    }

    addEditListener() {
        this.addEventListener('dblclick', this.openEditor);
    }

    createEditor() {
                
        // Link editor.css to the shadow DOM to style the editor
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        //styleLink.setAttribute('href', 'editor.css');
        this.__root.appendChild(styleLink);

        // Style the webcomponent as a div
        const outerStyle = document.createElement('style');
        let border = 1;
        outerStyle.textContent = `:host {display: block; border: ${border}px solid #000;}`;
        //this.__root.host.style.display = 'inline-block';
        //this.__root.host.style.border = '1px solid #000';
        this.__root.appendChild(outerStyle);

        // Create the editor container
        const container = document.createElement('div');
        container.className = `editor-container`;
        container.id = `editor-container`;
        container.style.display = `flex`;
        container.style.flexDirection = `column`;
        container.style.flexWrap = `nowrap`;
        container.style.justifyContent = `space-between`;
        container.style.overflow = 'auto';
        container.style.height = '100%';
        container.style.minHeight = '200px';
        container.style.width = 'auto';

        // Create the editor toolbar
        const toolbar = document.createElement('div');
        toolbar.id = 'editor-toolbar'
        toolbar.className = 'editor-toolbar';
        toolbar.style.display = 'flex';
        toolbar.style.flexWrap = 'wrap';
        toolbar.style.background = '#f1f1f1';
        toolbar.style.border = '1px solid #ccc';
        toolbar.style.padding = '5px';
        container.appendChild(toolbar);

        // Create the editor workspace
        const workspace = document.createElement('div');
        workspace.id = 'editor-workspace';
        workspace.className = 'editor-workspace';
        workspace.style.display = 'flex';
        workspace.style.flexDirection = `column`;
        workspace.style.flex = '1';
        const textView = document.createElement('div');
        textView.id = `text-view`;
        textView.contentEditable = true;
        textView.className = 'textview';
        textView.style.padding = '5px';
        textView.style.background = '#f9f9f9';
        textView.style.flex = '1';
        workspace.appendChild(textView);
        const codeView = document.createElement('div');
        codeView.id = `code-view`;
        codeView.contentEditable = true;
        codeView.className = 'codeview';
        codeView.style.display = 'none';
        codeView.style.padding = '5px';
        codeView.style.background = '#2d2d2d';
        codeView.style.flex = '1';
        workspace.appendChild(codeView);
        container.appendChild(workspace);

        this.__root.appendChild(container);

        this.toolbar = this.__root.getElementById('editor-toolbar');
        this.textView = this.__root.getElementById("text-view");
        this.codeView = this.__root.getElementById("code-view");
        this.createToolbar();

        this.textView.addEventListener('input', () => {
            this.prepareContentForSave();
        });
    }

    openEditor() {
        this.removeEventListener('dblclick', this.openEditor);
        this.observer.disconnect();
        this.setAttribute(`editor`, ``);
    }

    connectedCallback() {
        this.__loading = true; // Allows attributeChangedCallback to check on the attributes
        function callback(mutationList, observer){
            for (const mutation of mutationList) {
                if ((mutation.type === "childList") && (mutation.addedNodes.length>0)){
                    mutation.target.__root.appendChild(mutation.addedNodes[0]);
                    console.log("Mutation");
                } else if (mutation.type === "attributes") {
                    console.log(`The ${mutation.attributeName} attribute was modified.`);
                }
            }

        }
        

        console.log(this.getAttribute(`editor`));
        /*if ((this.getAttribute(`editor`) == ``) || (this.getAttribute(`editor`).toLowerCase() == `true`)) {
            this.edit = true;
        }*/
        // Create shadow DOM
        this.__root = this.attachShadow({mode: 'closed'});

        this.observer = new MutationObserver(callback);
        this.observer.observe(this,{childList: true, subtree: false});

        if (this.getAttribute(`editor`) == null){
            this.addEditListener();
        } else {
            this.createEditor();
        }
    }
}

// Define the new element
window.customElements.define('txt-editor', txtEditor);

class txtEdit {
    constructor(initObj = "" || {
        id: "",
        save: ()=>{},
    }) {
        if (typeof(initObj) == `string`) {
            this.id = initObj;
            this.editor = document.getElementById(this.id);
            if (!this.editor) {
                console.error(`Editor with id ${this.id} not found.`);
                return;
            }
            if (!(this.editor instanceof txtEditor)) {
                console.error(`The element with id ${this.id} is not txt-editor`);
                return;
            }
            this.editor.actions[0].command = () => {console.warn(`Save action not defined. Use the function content() to access the editor's content.`)};
        }
        if (typeof(initObj) == `object`) {
            this.id = initObj.id;
            this.editor = document.getElementById(this.id);
            if (!this.editor) {
                console.error(`Editor with id ${this.id} not found.`);
                return;
            }
            if (!(this.editor instanceof txtEditor)) {
                console.error(`The element with id ${this.id} is not txt-editor`);
                return;
            }
            if (!initObj.save || !(initObj.save instanceof Function)) {
                this.editor.actions[0].command = () => {console.warn(`Save action not defined. Use the function content() to access the editor's content.`)};
            } else {
                this.editor.actions[0].command = () => {
                    console.log(this.content());
                    initObj.save(this.content());
                }
            }
        }
    }

    addAction(action = {name: "", type: "", command: () => {}, icon: ""}) {
        if (action.name && action.type && action.command) {
            let fn = action.command;
            action.command = (event) => {
                //execCmd(event,action.command);
                console.log(fn(event.srcElement.value));
                event.srcElement.value = action.defaultValue;
            }
            console.log(action.command);
            this.editor.actions.push(action);
            this.editor.createToolbar();
        } else {
            console.warn("Action not added. Actions must have a name, type, and command funtion.");
        }
    }

    content() {
        return this.editor.content();
    }

    edit(htmlData) {
        this.editor.initialContent = htmlData;
        this.editor.textView.innerHTML = htmlData;
    }
}

class createLink{
    constructor(url,urltext){
        this.url=url;
        this.urltext=urltext;
    }

    inputform(){
        var formHTML='<form id="myForm" onsubmit="onSubmit(event)">';
        formHTML += '<label for="linktext">Link text: </label><input type="text" id="linktext" name="linktext">';
        formHTML += '<br>';
        formHTML += '<label for="url">URL: </label><input type="text" id="url" name="url">';
        formHTML += '<br>';
        formHTML += '<input type="submit">';
        formHTML += '</form>';
        return formHTML;
    }

    value(){
        return this;
    }
}

// https://codepen.io/neoux/pen/OVzMor
function getCaretPosition() {
  if (window.getSelection && window.getSelection().getRangeAt) {
    var range = window.getSelection().getRangeAt(0);
    var selectedObj = window.getSelection();
    var rangeCount = 0;
    var childNodes = selectedObj.anchorNode.parentNode.childNodes;
    console.log(childNodes);
    for (var i = 0; i < childNodes.length; i++) {
      if (childNodes[i] == selectedObj.anchorNode) {
        break;
      }
      if (childNodes[i].outerHTML)
        rangeCount += childNodes[i].outerHTML.length;
      else if (childNodes[i].nodeType == 3) {
        rangeCount += childNodes[i].textContent.length;
      }
    }
    return range.startOffset + rangeCount;
  }
  return -1;
}


var qtiChoiceInteractionData = {
    items: [{
        label: `Max choices`,
        name: `max-choices`,
        type: `number`, //Non-negative integer
        defaultValue: 1,
        required: false
    },
    {
        label: `Min choices`,
        name: `min-choices`,
        type: `number`, //Non-negative integer
        defaultValue: 0,
        required: false
    },
    {
        label: `Orientation`,
        name: `orientation`,
        type: `select`,
        options: [`vertical`, `horizontal`],
        defaultValue: true,
        required: false
    },
    {
        label: `Shuffle`,
        name: `shuffle`,
        type: `radio`,
        options: [false, true],
        defaultValue: true,
        required: false
    }]
}

class customElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        const container = document.createElement('div');
        container.innerHTML = `test`
        this.shadowRoot.appendChild(container);
    }
    connectedCallback() {}
}

// Define the new element
window.customElements.define('editor-custom-element', customElement);

class textEditor {
    constructor(initObj = {
        container: "", //Div id tag for the quiz container
    }) {
        this.containerName = initObj.container;

        /*this.actions = new Map([
            ['bold', {name: `Bold`, command: 'bold', icon: 'B'}],
            ['italic', {name: 'Italic', command: 'italic', icon: 'I'}],
            ['underline', {name: 'Underline', command: 'underline', icon: 'U'}],
            ['createLink', {name: 'Create Link', command: 'createLink', icon: 'Link' }],
            ['insert Ordered List', {name: 'Insert Ordered List', command: 'insertOrderedList', icon: 'OL' }],
            ['insert Unordered List', {name: 'Insert Unordered List', command: 'insertUnorderedList', icon: 'UL' }],
            ['justify Left', {name: 'Justify Left', command: 'justifyLeft', icon: 'Left' }],
            ['justify Center', {name: 'Justify Center', command: 'justifyCenter', icon: 'Center' }],
            ['justify Right', {name: 'Justify Right', command: 'justifyRight', icon: 'Right' }],
            ['justify Full', {name: 'Justify Full', command: 'justifyFull'}],
            ['font', {label: 'Font', name: 'font', type: 'select', options: ['Arial', 'Courier', 'Times New Roman', 'Georgia'], defaultValue: 'Arial', icon: null, command: () => {execCmd('fontName', this.value);}}]
        ]);*/
        this.actions = [{
            label: `Bold`,
            name: 'bold',
            type: 'button',
            icon: '<b>B</b>',
            command: () => {execCmd('bold')}
        },
        {
            label: `Italic`,
            name: 'italic',
            type: 'button',
            icon: '<i>I</i>',
            command: () => {execCmd('italic')}
        },
        {
            label: `Underline`,
            name: 'underline',
            type: 'button',
            icon: '<u>U</u>',
            command: () => {execCmd('underline')}
        },
        {
            label: 'Font',
            name: 'font',
            type: 'select',
            options: ['Arial', 'Courier', 'Times New Roman', 'Georgia'],
            defaultValue: 'Arial',
            icon: null,
            command: (event) => {
                execCmd('fontName', event.target.value);
            }
        }];
        /* var data = {
    name: `QTI Interaction`,
    items: [{
        label: `Interaction type`,
        name: `interactio_type`,
        type: `select`,
        options: [`Choice Interaction`, `Fill in the Blank`, `Extended Text Interaction`],
        defaultValue: true,
        required: true},
    ]
}
*/

        
        this.displayContent = document.getElementById("display-content");
        this.init();
    }

    addAction(action = {name: "", type: "", command: () => {}, icon: ""}) {
        if (action.name && action.type && action.command) {
            this.actions.push(action);
            this.createToolbar();
        } else {
            console.warn("Action not added. Actions must have a name, type, and command funtion.");
        }
    }

    editorWindow(data) {
        var editorOverlay = document.getElementById('editor-data-window');
        const nodeWindow = document.createElement('div');
        editorOverlay.appendChild(nodeWindow);
        editorOverlay.style.display = 'block';
        nodeWindow.setAttribute('class', 'editorPopup');
        console.log(nodeWindow);
        nodeWindow.innerHTML = data.inputform();
    }



    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'editor-toolbar';
        this.container.appendChild(toolbar);

        const buttons = [
            { command: 'bold', icon: 'B' },
            { command: 'italic', icon: 'I' },
            { command: 'underline', icon: 'U' },
            { command: 'createLink', icon: 'Link' },
            { command: 'insertOrderedList', icon: 'OL' },
            { command: 'insertUnorderedList', icon: 'UL' },
            { command: 'justifyLeft', icon: 'Left' },
            { command: 'justifyCenter', icon: 'Center' },
            { command: 'justifyRight', icon: 'Right' },
            { command: 'justifyFull', icon: 'Justify' }
        ];

        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.innerHTML = button.icon;
            btn.onclick = () => execCmd(button.command);
            toolbar.appendChild(btn);
        });

        for(let i=0; i<this.actions.length; i++) {
            switch (this.actions[i].type) {
                case 'button':
                    const button = document.createElement('button');
                    button.innerHTML = this.actions[i].icon;
                    button.title = this.actions[i].label;
                    button.onclick = this.actions[i].command;
                    toolbar.appendChild(button);
                    break;
                case 'select':
                    const selectInput = document.createElement(`select`);
                    selectInput.title = this.actions[i].label;
                    selectInput.name = this.actions[i].name;
                    selectInput.onchange = this.actions[i].command;
                    for (let j = 0; j < this.actions[i].options.length; j++) {
                        let option = document.createElement(`option`);
                        option.value = this.actions[i].options[j];
                        option.text = this.actions[i].options[j];
                        if (this.actions[i].options[j] == this.actions[i].defaultValue) {
                            option.setAttribute('selected',true);
                        }
                        selectInput.appendChild(option);
                    }
                    toolbar.appendChild(selectInput);
                    break;
                default:
                    console.warn(`Unknown action type: ${this.actions[i].type}`);
            }
        }
    }

    createWorkspace() {
        const workspace = document.createElement('div');
        workspace.className = 'editor-workspace';
        const textView = document.createElement('div');
        textView.id = `text-content`;
        textView.contentEditable = true;
        textView.className = 'textview';
        workspace.appendChild(textView);
        const codeView = document.createElement('div');
        codeView.id = `code-view`;
        codeView.contentEditable = true;
        codeView.className = 'codeview';
        codeView.style.display = 'none';
        workspace.appendChild(codeView);
        this.container.appendChild(workspace);
        this.editor = document.getElementById("text-content");
        this.codeView = document.getElementById("code-view");
    }

    init() {
        // Setting the container for the editor
        if ((this.containerName==null)||(document.getElementById(this.containerName)==null)||(document.getElementById(this.containerName).nodeName!='DIV')) {
            console.log("Container absent or not a DIV. Creating a container and appending it to the body.");
            this.container = document.createElement('div');
            this.container.className = `editor-container`;
            document.body.insertBefore(this.container,document.body.children[0]);
        } else {
            this.container = document.getElementById(this.containerName);
        }

        this.createToolbar();

        this.createWorkspace();


        this.editor.addEventListener('input', () => {
            this.prepareContentForSave();
        });
    }

    prepareContentForSave() {
        const editorContent = this.editor.innerHTML;
        this.displayContent.innerHTML = editorContent; // Render editor content in preview
        //this.displayContent.innerHTML = `<xmp>${editorContent}</xmp>`; // Render XML preview
    }
}

function editorWindow(data){
    var editorOverlay = document.getElementById('editor-data-window');
    const nodeWindow = document.createElement('div');
    editorOverlay.appendChild(nodeWindow);
    editorOverlay.style.display='block';
    nodeWindow.setAttribute('class','editorPopup');
    console.log(nodeWindow);
    nodeWindow.innerHTML=data.inputform();
}

function form(data){
    var editorOverlay = document.getElementById('editor-data-window');
    const nodeWindow = document.createElement('div');
    nodeWindow.innerHTML = `<h2>${data.name}</h2>`;
    const form = document.createElement(`form`);
    let label = document.createElement(`label`);
    label.setAttribute(`for`,data.items[0].label);
    label.innerText = data.items[0].label+ `: `;;
    form.appendChild(label);
    switch (data.items[0].type) {
        case `select`:
            let selectInput = document.createElement(`select`);
            selectInput.id = data.items[0].label;
            selectInput.name = data.items[0].name;
            selectInput.required = data.items[0].required;
            for (let i=0; i<data.items[0].options.length; i++) {
                let option = document.createElement(`option`);
                option.value = data.items[0].options[i];
                option.text = data.items[0].options[i];
                if (data.items[0].defaultValue && i === 0) {
                    option.selected = true;
                }
                selectInput.appendChild(option);
            }
            form.appendChild(selectInput);
            break;
    }
    nodeWindow.appendChild(form);
    editorOverlay.appendChild(nodeWindow);
    editorOverlay.style.display='block';
    nodeWindow.setAttribute('class','editorPopup');
    console.log(nodeWindow);
}

function editorInput(command,value){
    switch (command){
        case 'createLink': {
            data = new createLink('','');
            editorWindow(data);
        }
    }
}

async function onSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('myForm');
    const formData = new FormData(form);
    const linktext = formData.get('linktext');
    const url = formData.get('url');
    alert(`Link Text: ${linktext}; URL: ${url}`);
}

// Function to execute commands
function execCmd(command, value = null) {
    switch (command){
        case 'createLink': editorInput(command,value);
        default: document.execCommand(command, false, value);
    }
}

function insertTextAtCaret(text) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode( document.createTextNode(text) );
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}

// Toggle between code and WYSIWYG view
function toggleCodeView() {
    const editor = document.getElementById("editor");
    const codeView = document.getElementById("code-view");
    if (codeView.style.display === "none") {
        codeView.value = editor.innerHTML; // Populate code view with HTML
        editor.style.display = "none";
        codeView.style.display = "block";
    } else {
        editor.innerHTML = codeView.value; // Apply HTML back to editor
        editor.style.display = "block";
        codeView.style.display = "none";
    }
}
// Prepare content for preview
function prepareContentForSave() {
    const editorContent = document.getElementById("editor").innerHTML;
    const displayContent = document.getElementById("display-content");
    displayContent.innerHTML = editorContent; // Render editor content in preview
    displayContent.innerHTML = `<xmp>${editorContent}</xmp>`; // Render XML preview
}

// Save QTI-item-body
function createXML(data) {
    var itemBody='<qti-item-body>'+data+'</qti-item-body>'
}

const qtiExample = `<qti-choice-interaction response-identifier="RESPONSE" min-choices="1" max-choices="6">
        <qti-prompt>Which of the following elements are used to form water?</qti-prompt>
        <qti-simple-choice identifier="H">Hydrogen</qti-simple-choice>
        <qti-simple-choice identifier="He">Helium</qti-simple-choice>
        <qti-simple-choice identifier="C">Carbon</qti-simple-choice>
        <qti-simple-choice identifier="O">Oxygen</qti-simple-choice>
        <qti-simple-choice identifier="N">Nitrogen</qti-simple-choice>
        <qti-simple-choice identifier="Cl">Chlorine</qti-simple-choice>
      </qti-choice-interaction>`;

