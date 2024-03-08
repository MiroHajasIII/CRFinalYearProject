// add an event listener to the file input element
document.getElementById('fileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        // set the value of the CodeMirror editor to the read contents
        editor.setValue(e.target.result);
    };

    reader.readAsText(file);
});

// add event listener for the refactor button
document.getElementById('refactorButton').addEventListener('click', function() {
    // retrieve code from the CodeMirror editor
    var code = editor.getValue();

    // send code to the server for processing
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'processCode.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // receive refactored code from the server
            var refactoredCode = xhr.responseText;

            // display refactored code
            document.getElementById('refactoredCode').textContent = refactoredCode;
        }
    };
    xhr.send(JSON.stringify({ code: code }));
});

        // COMMENTED OUT DUE TO TESTING CODE INSIDE THE REFACTOR.PHTML SCRIPT TAG
// /**
//  *      ///  WIP AREA DOWN HERE  ///
//  */
// // event listeners for refactoring buttons
// document.getElementById('renameVariableButton').addEventListener('click', function() {
//     // retrieve the old and new variable names from the input fields
//     var oldVariableName = document.getElementById('oldVariableNameInput').value;
//     var newVariableName = document.getElementById('newVariableNameInput').value;
//     console.log("newVariableNameInput: " + newVariableName);
//
//     // get the code from the editor
//     var code = editor.getValue();
//
//     // refactor the code by renaming the variables
//     var updatedCode = refactorRenameVariable(code, oldVariableName, newVariableName);
//
//     // display the refactored code in the output editor
//     editorOutput.setValue(updatedCode);
// });
//
// // function to refactor 'rename variable'
// function refactorRenameVariable(code, oldVariableName, newVariableName) {
//     var regex = new RegExp('\\b' + oldVariableName + '\\b', 'g'); // use word boundaries to match whole words
//     var updatedCode = code.replace(regex, newVariableName);
//
//     return updatedCode;
// }