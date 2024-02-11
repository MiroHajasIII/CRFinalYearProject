document.getElementById('refactorButton').addEventListener('click', function() {
    // Retrieve code from the editor
    var code = document.getElementById('uploadedDocument').textContent;

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
