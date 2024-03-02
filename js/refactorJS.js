// Add an event listener to the file input element
document.getElementById('fileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        // Set the value of the CodeMirror editor to the read contents
        editor.setValue(e.target.result);
    };

    reader.readAsText(file);
});

// Add event listener for the refactor button
document.getElementById('refactorButton').addEventListener('click', function() {
    // Retrieve code from the CodeMirror editor
    var code = editor.getValue();

    // Send code to the server for processing
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'processCode.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Receive refactored code from the server
            var refactoredCode = xhr.responseText;

            // Display refactored code
            document.getElementById('refactoredCode').textContent = refactoredCode;
        }
    };
    xhr.send(JSON.stringify({ code: code }));
});
