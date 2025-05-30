
if (!isBackgroundTask) { function isBackgroundTask() { return false; } }

function getUri(market) {
    var url = "https://assets.msn.com/service/msn/livetile/singletile?source=appxmanifest&tenant=amp&vertical=news";
    if (market !== null && market != undefined && market.length > 0) {
        url += "&market=" + encodeURIComponent(market.toLowerCase ());
    }
    return url;
}

function getUri_Multiple(market) {
    var url = "https://assets.msn.com/service/msn/livetile/multipletile?source=appxmanifest&tenant=amp&vertical=news";
    if (market !== null && market != undefined && market.length > 0) {
        url += "&market=" + encodeURIComponent(market.toLowerCase());
    }
    return url;
}

var getMarket = function () {
    try {
        if (typeof Platform !== "undefined" &&
            Platform.Utilities &&
            Platform.Utilities.Globalization &&
            typeof Platform.Utilities.Globalization.getMarketString === "function") {
            return Platform.Utilities.Globalization.getMarketString();
        }
    } catch (e) {
    }
    try {
        var lang = navigator.language || navigator.userLanguage || "";
        Windows.Storage.ApplicationData.current.localSettings.values["language"] = lang;
        return lang;
    } catch (e) {
    }
    return "";
}

function setGetMarketFunction(func) {
    if (func) {
        getMarket = func;
    }
}

function getMarketUri() {
    return getUri(getMarket());
}

function getMarketUri_Multiple() {
    return getUri_Multiple(getMarket());
}

function getTileXmlFromUri(uri, cbsuccess, cbfailed) {
    WinJS.xhr({ url: uri }).done(
        function (result) {
            try {
                if (cbsuccess) {
                    cbsuccess(xmlDomToXmlString(result.responseText));
                }
            } catch (e) {
                if (cbfailed) {
                    cbfailed(e);
                }
            }
        },
        function (error) {
            if (cbfailed) {
                cbfailed(error);
            }
        }
    );
}

function formateXml(xmlStr) {
    var text = xmlStr; 
    text = '\n' + text.replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
        return name + ' ' + props.replace(/\s+(\w+=)/g, " $1");
    }).replace(/>\s*?</g, ">\n<");
    text = text.replace(/\n/g, '\r').replace(/<!--(.+?)-->/g, function ($0, text) {
        var ret = '<!--' + escape(text) + '-->'; 
        return ret;
    }).replace(/\r/g, '\n');
    var rgx = /\n(<(([^?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
    var nodeStack = [];
    var output = text.replace(rgx, function ($0, all, name, isBegin, isCloseFull1, isCloseFull2, isFull1, isFull2) {
        var isClosed = (isCloseFull1 === '/') || (isCloseFull2 === '/') || (isFull1 === '/') || (isFull2 === '/');
        var prefix = '';

        if (isBegin === '!') { 
            prefix = setPrefix(nodeStack.length);
        } else {
            if (isBegin !== '/') { 
                prefix = setPrefix(nodeStack.length);
                if (!isClosed) { 
                    nodeStack.push(name);
                }
            } else { 
                nodeStack.pop();
                prefix = setPrefix(nodeStack.length);
            }
        }
        return '\n' + prefix + all;
    });
    var outputText = output.substring(1);
    outputText = outputText.replace(/\n/g, '\r').replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
        if (prefix.charAt(0) === '\r') {
            prefix = prefix.substring(1);
        }
        text = unescape(text).replace(/\r/g, '\n'); 
        return '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix) + '-->';
    });
    outputText = outputText.replace(/\s+$/g, '').replace(/\r/g, '\r\n');
    return outputText;
}

function setPrefix(prefixIndex) {
    var result = '';
    var span = '    '; 
    var output = [];
    for (var i = 0; i < prefixIndex; ++i) {
        output.push(span);
    }
    return output.join('');
}

function formatXml(xml) {
    return formateXml(xml);
}

function getTileQueueFromStored(callback, errorCallback) {
    var localFolder = Windows.Storage.ApplicationData.current.localFolder;
    var fileName = "tiles.xml";

    localFolder.getFileAsync(fileName).then(function (file) {
        Windows.Storage.FileIO.readTextAsync(file).then(function (content) {
            var result = [];
            if (content) {
                try {
                    var doc = new Windows.Data.Xml.Dom.XmlDocument();
                    doc.loadXml("<root>" + content + "</root>");
                    var nodes = doc.getElementsByTagName("tile");
                    for (var i = 0; i < Math.min(4, nodes.length) ; i++) {
                        var innerXml = nodes[i].innerText;
                        var tileDoc = new Windows.Data.Xml.Dom.XmlDocument();
                        tileDoc.loadXml(innerXml);
                        result.push(tileDoc);
                    }
                } catch (e) {
                }
            }
            if (callback) callback(result);
        }, function (readErr) {
            if (errorCallback) errorCallback(readErr);
        });
    }, function (fileErr) {
        if (callback) callback([]);
    });
}

function pushTileStorage(xmlString, callback, errorCallback) {
    var localFolder = Windows.Storage.ApplicationData.current.localFolder;
    var fileName = "tiles.xml";
    localFolder.createFileAsync(fileName, Windows.Storage.CreationCollisionOption.openIfExists).then(function (file) {
        Windows.Storage.FileIO.readTextAsync(file).then(function (content) {
            var xmlList = [];
            if (content) {
                try {
                    var doc = new Windows.Data.Xml.Dom.XmlDocument();
                    doc.loadXml("<root>" + content + "</root>");
                    var nodes = doc.getElementsByTagName("tile");
                    for (var i = 0; i < nodes.length; i++) {
                        xmlList.push(nodes[i].innerText);
                    }
                } catch (e) {
                    xmlList = [];
                }
            }
            var index = xmlList.indexOf(xmlString);
            if (index !== -1) {
                xmlList.splice(index, 1);
            }
            xmlList.unshift(xmlString);
            if (xmlList.length > 5) {
                xmlList.pop();
            }
            var newContent = "";
            for (var j = 0; j < xmlList.length; j++) {
                newContent += "<tile>" + xmlList[j] + "</tile>";
            }
            Windows.Storage.FileIO.writeTextAsync(file, newContent).done(function () {
                if (callback) callback();
            }, function (writeErr) {
                if (errorCallback) errorCallback(writeErr);
            });
        }, function (readErr) {
            if (errorCallback) errorCallback(readErr);
        });
    }, function (createErr) {
        if (errorCallback) errorCallback(createErr);
    });
}


function updateTile() {
    if (setUpdateButtonDisabled) {
        setUpdateButtonDisabled(true);
    }
    if (setDisplayStatus) {
        setDisplayStatus("开始更新磁贴...");
    }
    var updater = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
    updater.enableNotificationQueue(true);
    updater.clear(); 
    var uriMain = getMarketUri(); 
    var uriMultiple = getMarketUri_Multiple();
    if (setDisplayStatus) {
        setDisplayStatus("开始更新磁贴 (Multiple)...");
    }
    getTileXmlFromUri(uriMultiple, function (xmlMultiple) {
        if (setDisplayGetXmlMultiple) {
            setDisplayGetXmlMultiple(formatXml(xmlDomToXmlString(xmlMultiple)));
        }
        if (setDisplayStatus) {
            setDisplayStatus("正在进行转换(win10TileToWin8Tile3)...");
        }
        var xmlStr = win10TileToWin8Tile3(xmlDomToXmlString(xmlMultiple));
        if (setDisplayTransXmlMultiple) {
            setDisplayTransXmlMultiple(formatXml(xmlDomToXmlString(xmlStr)));
        }
        var xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();
        xmlDoc.loadXml(xmlDomToXmlString(xmlStr));
        updater.update(new Windows.UI.Notifications.TileNotification(xmlDoc));
        if (setDisplayStatus) {
            setDisplayStatus("开始更新磁贴 (Single)...");
        }
        getTileXmlFromUri(uriMain, function (xmlMain) {
            if (setDisplayGetXml) {
                setDisplayGetXml(formatXml(xmlDomToXmlString(xmlMain)));
            }
            if (setDisplayStatus) {
                setDisplayStatus("正在进行转换(win10TileToWin8Tile)...");
            }
            var xmlStrMain = win10TileToWin8Tile(xmlDomToXmlString(xmlMain));
            if (setDisplayTransXml) {
                setDisplayTransXml(formatXml(xmlDomToXmlString(xmlStr)));
            }
            if (setDisplayStatus) {
                setDisplayStatus("正在储存磁贴 (Single)...");
            }
            pushTileStorage(xmlDomToXmlString(xmlStrMain), function () {
                if (setDisplayStatus) {
                    setDisplayStatus("正在提取储存的历史磁贴 (Single)...");
                }
                getTileQueueFromStored(function (queue) {
                    if (setDisplayStatus) {
                        setDisplayStatus("正在添加磁贴队列 (Single)...");
                    }
                    for (var i = 0; i < queue.length; i++) {
                        updater.update(new Windows.UI.Notifications.TileNotification(queue[i]));
                    }
                    if (setUpdateButtonDisabled) {
                        setUpdateButtonDisabled(false);
                    }
                    if (setDisplayStatus) setDisplayStatus("磁贴已更新。");
                }, function (err) {
                    setDisplayStatus("从储存获取磁贴失败：" + err);
                    if (setUpdateButtonDisabled) {
                        setUpdateButtonDisabled(false);
                    }
                });    
            }, function (err) {
                setDisplayStatus("储存磁贴失败：" + err);
                if (setUpdateButtonDisabled) {
                    setUpdateButtonDisabled(false);
                }
            });
        }, function (e) {
            if (setDisplayStatus) setDisplayStatus("错误：获取主磁贴失败 " + e);
            if (setUpdateButtonDisabled) {
                setUpdateButtonDisabled(false);
            }
        });
    }, function (e) {
        if (setDisplayStatus) setDisplayStatus("错误：获取 multiple 磁贴失败 " + e);
        if (setUpdateButtonDisabled) {
            setUpdateButtonDisabled(false);
        }
    });
}

/**
 * 异步版本的 getTileXmlFromUriAsync
 */
function getTileXmlFromUriAsync(uri) {
    return new WinJS.Promise(function (complete, error) {
        WinJS.xhr({ url: uri }).done(
            function (result) {
                try {
                    complete(xmlDomToXmlString(result.responseText));
                } catch (e) {
                    error(e);
                }
            },
            function (err) {
                error(err);
            }
        );
    });
}

/**
 * 异步版本的 getTileQueueFromStoredAsync
 */
function getTileQueueFromStoredAsync() {
    return new WinJS.Promise(function (complete, error) {
        var localFolder = Windows.Storage.ApplicationData.current.localFolder;
        var fileName = "tiles.xml";

        localFolder.getFileAsync(fileName).then(function (file) {
            Windows.Storage.FileIO.readTextAsync(file).then(function (content) {
                var result = [];
                if (content) {
                    try {
                        var doc = new Windows.Data.Xml.Dom.XmlDocument();
                        doc.loadXml(content);
                        var nodes = doc.getElementsByTagName("tile");
                        for (var i = 0; i < Math.min(4, nodes.length) ; i++) {
                            var innerXml = nodes[i].getXml();
                            var tileDoc = new Windows.Data.Xml.Dom.XmlDocument();
                            tileDoc.loadXml(innerXml);
                            result.push(tileDoc);
                        }
                    } catch (e) {
                    }
                }
                complete(result);
            }, error);
        }, function () {
            complete([]); // 文件不存在也返回空数组
        });
    });
}

/**
 * 异步版本的 pushTileStorageAsync
 */
function pushTileStorageAsync(xmlString) {
    return new WinJS.Promise(function (complete, error) {
        var localFolder = Windows.Storage.ApplicationData.current.localFolder;
        var fileName = "tiles.xml";
        localFolder.createFileAsync(fileName, Windows.Storage.CreationCollisionOption.openIfExists).then(function (file) {
            Windows.Storage.FileIO.readTextAsync(file).then(function (content) {
                var xmlList = [];
                if (content) {
                    try {
                        var doc = new Windows.Data.Xml.Dom.XmlDocument();
                        doc.loadXml(content);
                        var nodes = doc.getElementsByTagName("tile");
                        for (var i = 0; i < nodes.length; i++) {
                            xmlList.push(xmlDomToXmlString(nodes[i].getXml ()));
                        }
                    } catch (e) {
                        xmlList = [];
                    }
                }
                var index = xmlList.indexOf(xmlDomToXmlString(xmlString));
                if (index !== -1) {
                    xmlList.splice(index, 1);
                }
                xmlList.unshift(xmlString);
                if (xmlList.length > 5) {
                    xmlList.pop();
                }
                var newContent = "<root>";
                for (var j = 0; j < xmlList.length; j++) {
                    newContent += xmlList[j] ;
                }
                newContent += "</root>"
                Windows.Storage.FileIO.writeTextAsync(file, newContent).done(function () {
                    complete();
                }, error);
            }, error);
        }, error);
    });
}

function updateTileAsync() {
    return new WinJS.Promise(function (complete, error) {
        if (typeof setUpdateButtonDisabled === "function") {
            setUpdateButtonDisabled(true);
        }
        if (typeof setDisplayStatus === "function") {
            setDisplayStatus("开始更新磁贴...");
        }

        var updater = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
        updater.enableNotificationQueue(true);
        updater.clear();

        var uriMain = getMarketUri();
        var uriMultiple = getMarketUri_Multiple();

        if (typeof setDisplayStatus === "function") {
            setDisplayStatus("开始更新磁贴 (Multiple)...");
        }

        getTileXmlFromUriAsync(uriMultiple).then(function (xmlMultiple) {
            if (typeof setDisplayGetXmlMultiple === "function") {
                setDisplayGetXmlMultiple(formatXml(xmlDomToXmlString(xmlMultiple)));
            }

            if (typeof setDisplayStatus === "function") {
                setDisplayStatus("正在进行转换(win10TileToWin8Tile3)...");
            }

            var xmlStr = win10TileToWin8Tile3(xmlDomToXmlString(xmlMultiple));

            if (typeof setDisplayTransXmlMultiple === "function") {
                setDisplayTransXmlMultiple(formatXml(xmlDomToXmlString(xmlStr)));
            }

            var xmlDocMultiple = new Windows.Data.Xml.Dom.XmlDocument();
            xmlDocMultiple.loadXml(xmlDomToXmlString(xmlStr));
            var tilem = new Windows.UI.Notifications.TileNotification(xmlDocMultiple);
            updater.update(tilem);

            if (typeof setDisplayStatus === "function") {
                setDisplayStatus("开始更新磁贴 (Single)...");
            }

            return getTileXmlFromUriAsync(uriMain).then(function (xmlMain) {
                if (typeof setDisplayGetXml === "function") {
                    setDisplayGetXml(formatXml(xmlDomToXmlString(xmlMain)));
                }

                if (typeof setDisplayStatus === "function") {
                    setDisplayStatus("正在进行转换(win10TileToWin8Tile)...");
                }

                var xmlStrMain = win10TileToWin8Tile(xmlDomToXmlString(xmlMain));

                if (typeof setDisplayTransXml === "function") {
                    setDisplayTransXml(formatXml(xmlDomToXmlString(xmlStrMain)));
                }

                if (typeof setDisplayStatus === "function") {
                    setDisplayStatus("正在储存磁贴 (Single)...");
                }

                return pushTileStorageAsync(xmlDomToXmlString(xmlStrMain)).then(function () {
                    if (typeof setDisplayStatus === "function") {
                        setDisplayStatus("正在提取储存的历史磁贴 (Single)...");
                    }

                    return getTileQueueFromStoredAsync().then(function (queue) {
                        if (typeof setDisplayStatus === "function") {
                            setDisplayStatus("正在添加磁贴队列 (Single)...");
                        }

                        for (var i = 0; i < queue.length; i++) {
                            var tiles = new Windows.UI.Notifications.TileNotification(queue[i]);
                            updater.update(tiles);
                        }

                        if (typeof setUpdateButtonDisabled === "function") {
                            setUpdateButtonDisabled(false);
                        }
                        if (typeof setDisplayStatus === "function") {
                            setDisplayStatus("磁贴已更新。");
                        }

                        complete(); 
                    });
                });
            });
        }).then(null, function (err) {
            if (typeof setDisplayStatus === "function") {
                setDisplayStatus("更新磁贴失败：" + err);
            }
            if (typeof setUpdateButtonDisabled === "function") {
                setUpdateButtonDisabled(false);
            }
            error(err);
        });
    });
}
