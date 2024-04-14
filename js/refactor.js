/**
 * logic and CodeMirror variables found below
 */
    // Get the textarea elements
var codeInput = document.getElementById('codeInput');
var codeOutput = document.getElementById('codeOutput');

// initialise CodeMirror for the codeInput text area
var editorInput = CodeMirror.fromTextArea(codeInput, {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'dracula'
});

// initialise CodeMirror for the codeOutput text area
var editorOutput = CodeMirror.fromTextArea(codeOutput, {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'dracula',
    readOnly: true // Make the output area read-only
});

// load the user chosen file into the CodeMirror text editor area
document.getElementById('fileInput').addEventListener('change', function(event) {
    console.log('File selected');
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        // set the content of the CodeMirror editor to the loaded file content
        editorInput.setValue(e.target.result);
    };
    reader.readAsText(file);
});


/**
 * functions and relative logic found below
 */
// function to handle editor area and results area
function copyText() {
    // get the code from the editor
    var code = editorInput.getValue();

    // set the code to the output area
    editorOutput.setValue(code);
}

document.getElementById('refactorButton').addEventListener('click', function() {
    // call the copyText function when the button is clicked
    copyText();
});

document.getElementById('downloadButton').addEventListener('click', function() {
    // get the code from the output area
    var code = editorOutput.getValue();
    // create a Blob object containing the user's code
    var blob = new Blob([code], { type: 'text/plain' });
    // create a URL for the Blob object
    var url = URL.createObjectURL(blob);

    // create an anchor element with the download attribute set to the desired file name
    var a = document.createElement('a');
    a.href = url;
    a.download = 'refactored_code.txt';

    // append the anchor element to the body
    document.body.appendChild(a);
    // simulate a click on the anchor element to trigger the download
    a.click();
    // remove the anchor element from the body
    document.body.removeChild(a);
    // revoke the URL to release the resources
    URL.revokeObjectURL(url);
});


/**
 * variable rename refactoring code area below
 */
document.getElementById('renameVariableButton').addEventListener('click', function() {
    // prompt user to enter the old variable name
    var oldVariableName = prompt('Enter the name of the variable to rename:');
    if (!oldVariableName) return; // exit if the user cancels or leaves the prompt blank

    // prompt user to enter the new variable name
    var newVariableName = prompt('Enter the new name for the variable:');
    if (!newVariableName) return; // exit if the user cancels or leaves the prompt blank

    // get code from the editor
    var code = editorInput.getValue();

    // refactor code by renaming the variables
    var updatedCode = refactorRenameVariable(code, oldVariableName, newVariableName);

    // display refactored code in the input and output editor
    editorInput.setValue(updatedCode);
    editorOutput.setValue(updatedCode);
});

// function to refactor 'rename variable'
function refactorRenameVariable(code, oldVariableName, newVariableName) {
    var regex = new RegExp('\\b' + oldVariableName + '\\b', 'g');
    var updatedCode = code.replace(regex, newVariableName);

    return updatedCode;
}


/**
 * extractMethod functionality code below
 */
document.getElementById('extractMethodButton').addEventListener('click', function() {
    // get the selected code from the CodeMirror editor
    var selectedCode = editorInput.getSelection();

    // prompt user to enter the name of their new desired method
    var newMethodName = prompt('Enter the name of the new method:');

    if (newMethodName) {
        // split the selected code into lines
        var lines = selectedCode.split('\n');

        // indent each line with a tab, and retain any already implemented indentations from the code before
        for (var i = 0; i < lines.length; i++) {
            lines[i] = '\t' + lines[i]; // prepend a tab to each line
        }

        // join the lines back together with newline characters
        var indentedCode = lines.join('\n');

        // generate the new method with the selected code
        var newMethodCode = 'function ' + newMethodName + '() {\n' +
            indentedCode + '\n' +
            '}';

        // replace the selected code with a method call
        var methodCall = newMethodName + '();\n\n';
        editorInput.replaceSelection(methodCall);
        // insert the new method code at the cursor position in the editor
        editorInput.replaceSelection(newMethodCode);
        // update the CodeMirror editor
        editorOutput.setValue(editorInput.getValue());
        // feedback for user upon success
        alert('Method "' + newMethodName + '" extracted successfully.');
    }
});


/**
 * inline variable code below
 */
document.getElementById('inlineVariableButton').addEventListener('click', function() {
    // retrieve the variable name and value from the user
    var variableName = prompt('Enter the name of the variable to inline:');
    var variableValue = prompt('Enter the value to inline for the variable:');

    if (variableName && variableValue) {
        // get the code from the editor
        var code = editorInput.getValue();
        // refactor the code by replacing all occurrences of the variable with its value
        var updatedCode = refactorInlineVariable(code, variableName, variableValue);

        // display the refactored code in the input and output editor
        editorInput.setValue(updatedCode);
        editorOutput.setValue(updatedCode);

        // provide feedback to the user
        alert('Variable "' + variableName + '" inlined successfully.');
    }
});

// function to refactor 'inline variable'
function refactorInlineVariable(code, variableName, variableValue) {
    // create a regex to match variable declarations
    var declarationRegex = new RegExp('\\bvar\\s+' + variableName + '\\s*=\\s*.*?;', 'g');
    // replace all occurrences of variable declarations with comments
    var updatedCode = code.replace(declarationRegex, '// Variable "' + variableName + '" was declared here.');

    // if the variable is not being declared, replace occurrences with the desired value
    updatedCode = updatedCode.replace(new RegExp('\\b' + variableName + '\\b', 'g'), variableValue);

    return updatedCode;
}


/**
 * remove unused code functionality bellow
 */
document.getElementById('removeUnusedCodeButton').addEventListener('click', function() {
    removeUnusedCode();
});

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// function to remove unused variables from the code
function removeUnusedVariables(code) {
    // define a regular expression to match variable declarations
    var declarationRegex = /\b(var|let|const)\s+(\w+)\s*=/g;
    // find all variable declarations in the code
    var matches = code.match(declarationRegex);
    // if no matches found, return the original code
    if (!matches) {
        return code;
    }
    // iterate over the matches and remove declarations of unused variables
    matches.forEach(function (match) {
        var variableName = match.split(/\s+/)[1]; // extract the variable name
        var regex = new RegExp('\\b' + escapeRegExp(variableName) + '\\b', 'g'); // escape any special characters

        // check if the variable is used in the code
        if (!code.match(regex)) {
            // if not used, remove the variable declaration
            code = code.replace(new RegExp('\\b' + escapeRegExp(match) + ';?\\s*', 'g'), '');
        }
    });
    return code;
}

// function to remove unused code
function removeUnusedCode() {
    var code = editorInput.getValue();
    // identify and remove unused variables
    code = removeUnusedVariables(code);
    // update the editor with the modified code
    editorInput.setValue(code);
    editorOutput.setValue(code);
}



/**
 * Help dialogs for refactoring options
 */
document.querySelectorAll('.help-button').forEach(function(button) {
    button.addEventListener('click', function() {
        var option = button.textContent.trim();
        var helpText = '';

        switch (option) {
            case 'Variable Rename Help':
                helpText = 'This option allows you to rename a variable throughout your code. ' +
                    'Enter the old variable name and then the new variable name.' +
                    '\n\nFor example:\n' +
                    'To change all the occurrences of "method1()" to "finalMethod()" in your code, you can ' +
                    'set "method1()" as the target variable name, and "finalMethod()" as the name to overwrite this ' +
                    'with. Every instance of "method1()" within your code will then be changed to "finalMethod()"';
                break;
            case 'Extract Method Help':
                helpText = 'This option helps you extract a block of code into a new method. ' +
                    'Select the code you want to extract and enter the name of the new method.' +
                    '\n\nFor example:\n' +
                    'If you have a function that performs multiple steps to calculate a result. ' +
                    'Instead of having all those steps in one large function, you can use "Extract ' +
                    'Method" to create a new function for a specific subset of those steps. ' +
                    'This makes the code easier to read, understand, and maintain.';
                break;
            case 'Inline Variable Help':
                helpText = 'This option enables you to inline a variable by replacing all its occurrences with a value. ' +
                    'Enter the variable name and the value to inline.' +
                    '\n\nFor example:\n' +
                    'Suppose you have a variable named "discountPercentage" that is used multiple ' +
                    'times in your code to calculate discounted prices. Instead of keeping ' +
                    '"discountPercentage" as a separate variable throughout your code, you can use ' +
                    '"Inline Variable" to replace all instances of "discountPercentage" with its actual ' +
                    'value, such as 0.10 for a 10% discount, and comment out the original declaration of ' +
                    'the variable as well.';
                break;
            case 'Remove Unused Code Help':
                helpText = 'This option allows you to rename a function throughout your code. ' +
                    'Enter the old function name and then the new function name.';
                break;
            default:
                helpText = 'Help information not available.';
        }

        alert(helpText);
    });
});