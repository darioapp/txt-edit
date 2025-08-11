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

class customElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        const container = document.createElement('div');
        container.innerHTML = `test`
        this.shadowRoot.appendChild(container);
    }
    connectCallback() {}
}

var data = {
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
// Define the new element
window.customElements.define('editor-custom-element', customElement);

class textEditor {
    constructor(initObj = {
        container: "", //Div id tag for the quiz container
    }) {
        this.containerName = initObj.container;

        this.actions = new Map([
            ['bold', {name: `Bold`, command: 'bold', icon: 'B'}],
            ['italic', {name: 'Italic', command: 'italic', icon: 'I'}],
            ['underline', {name: 'Underline', command: 'underline', icon: 'U'}],
            ['createLink', {name: 'Create Link', command: 'createLink', icon: 'Link' }],
            ['insert Ordered List', {name: 'Insert Ordered List', command: 'insertOrderedList', icon: 'OL' }],
            ['insert Unordered List', {name: 'Insert Unordered List', command: 'insertUnorderedList', icon: 'UL' }],
            ['justify Left', {name: 'Justify Left', command: 'justifyLeft', icon: 'Left' }],
            ['justify Center', {name: 'Justify Center', command: 'justifyCenter', icon: 'Center' }],
            ['justify Right', {name: 'Justify Right', command: 'justifyRight', icon: 'Right' }],
            ['justify Full', {name: 'Justify Full', command: 'justifyFull'}]
        ]);

        
        this.displayContent = document.getElementById("display-content");
        this.init();
    }

    addCustomAction(action = {name: "", command: () => {}, icon: ""}) {}

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
        toolbar.className = 'toolbar';
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
    }

    createWorkspace() {
        const workspace = document.createElement('div');
        workspace.className = 'workspace';
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

