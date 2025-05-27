function writeLog(filename, content) {
    var folder = Windows.Storage.ApplicationData.current.localFolder;
    return folder.createFileAsync(filename, Windows.Storage.CreationCollisionOption.replaceExisting)
        .then(function (file) {
            return Windows.Storage.FileIO.writeTextAsync(file, content);
        });
}

function readLog(filename, onSuccess, onError) {
    var folder = Windows.Storage.ApplicationData.current.localFolder;
    folder.getFileAsync(filename)
        .then(function (file) {
            return Windows.Storage.FileIO.readTextAsync(file);
        })
        .done(function (text) {
            if (onSuccess) onSuccess(text);
        }, function (err) {
            if (onError) onError(err);
        });
}

function appendLog(filename, logText) {
    var folder = Windows.Storage.ApplicationData.current.localFolder;
    folder.createFileAsync(filename, Windows.Storage.CreationCollisionOption.openIfExists)
        .then(function (file) {
            var timestamp = new Date().toISOString();
            var fullText = "[" + timestamp + "] " + logText + "\r\n";
            return Windows.Storage.FileIO.appendTextAsync(file, fullText);
        });
}
