
/**
 * 将 xml 文本转换成 xml dom 对象
 * @param {string} xmlString 
 * @returns {Document}
 */
function xmlStringToXmlDom(xmlString) {
    if (xmlString instanceof Document) {
        return xmlString;
    }
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlString, "text/xml");
    return xmlDoc;
}
/**
 * 将 xml dom 对象转换成 xml 文本
 * @param {Document} xmlDoc 
 * @returns {string}
 */
function xmlDomToXmlString(xmlDoc) {
    if (typeof xmlDoc === "string") {
        return xmlDomToXmlString(xmlStringToXmlDom(xmlDoc));
    }
    var serializer = new XMLSerializer();
    var xmlString = serializer.serializeToString(xmlDoc);
    return xmlString;
}

/**
 * 用于 Win10 MSN 财经、体育、天气应用。
 * @param {string} tileXmlString 
 * @returns 
 */
function win10TileToWin8Tile(tileXmlString) {
    var xmlDoc = xmlStringToXmlDom(tileXmlString);
    var tile = xmlDoc.getElementsByTagName("tile")[0];
    var visual = tile.getElementsByTagName("visual")[0];
    var baseUri = visual.getAttribute("baseUri");
    if (baseUri == null || baseUri.length == 0 || baseUri == undefined) {
        baseUri = "";
    }
    var bindings = visual.getElementsByTagName("binding");
    var tilegroup = new TileGroup(); {
        var binding = bindings[0];
        var tile = new TileTemplate();
        image = binding.getElementsByTagName("image")[0];
        if (image === null || image == undefined) {
            src = getBlankImageUri(150, 150);
        } else {
            src = baseUri + image.getAttribute("src");
            ialt = image.getAttribute("alt");
        }
        if (src == null || src.length == 0 || src == undefined) {
            src = "";
        }
        if (ialt == null || ialt.length == 0 || ialt == undefined) {
            ialt = "";
        }
        tnode = binding.getElementsByTagName("text")[0];
        text = tnode.textContent;
        if (text == null || text.length == 0 || text == undefined) {
            text = "";
        }
        var tile = new TileTemplate();
        tile.create("TileSquare150x150PeekImageAndText04", "TileSquarePeekImageAndText04");
        tile.images[0] = src;
        tile.alts[0] = ialt;
        tile.texts[0] = text;
        tilegroup.tiles.push(tile);
    } {
        var binding = bindings[1];
        var tile = new TileTemplate();
        image = binding.getElementsByTagName("image")[0];
        if (image === null || image == undefined) {
            src = getBlankImageUri(310, 100);
        } else {
            src = baseUri + image.getAttribute("src");
            ialt = image.getAttribute("alt");
        }
        if (src == null || src.length == 0 || src == undefined) {
            src = "";
        }
        if (ialt == null || ialt.length == 0 || ialt == undefined) {
            ialt = "";
        }
        tnode = binding.getElementsByTagName("text")[0];
        text = tnode.textContent;
        if (text == null || text.length == 0 || text == undefined) {
            text = "";
        }
        var tile = new TileTemplate();
        tile.create("TileWide310x150ImageAndText01", "TileWideImageAndText01");
        tile.images[0] = src;
        tile.alts[0] = ialt;
        tile.texts[0] = text;
        tilegroup.tiles.push(tile);
    } {
        var binding = bindings[2];
        var tile = new TileTemplate();
        image = binding.getElementsByTagName("image")[0];
        if (image === null || image == undefined) {
            src =  getBlankImageUri(310, 310);
        } else {
            src = baseUri + image.getAttribute("src");
            ialt = image.getAttribute("alt");
        }
        if (src === null || src.length == 0 || src == undefined) {
            src = "";
        }
        if (ialt === null || ialt.length == 0 || ialt == undefined) {
            ialt = "";
        }
        tnode = binding.getElementsByTagName("text")[0];
        text = tnode.textContent;
        if (text == null || text.length == 0 || text == undefined) {
            text = "";
        }
        var tile = new TileTemplate();
        tile.create("TileSquare310x310ImageAndTextOverlay01", null);
        tile.images[0] = src;
        tile.alts[0] = ialt;
        tile.texts[0] = text;
        tilegroup.tiles.push(tile);
    }
    return tilegroup.getXml();
}

/**
 * 用于 Win10 MSN 天气应用
 * @param {string} tileXmlString 
 * @returns 
 */
function win10TileToWin8Tile2(tileXmlString) {
    var xmlDoc = xmlStringToXmlDom(tileXmlString);
    var tile = xmlDoc.getElementsByTagName("tile")[0];
    var visual = tile.getElementsByTagName("visual")[0];
    var baseUri = visual.getAttribute("baseUri");
    if (baseUri == null || baseUri.length == 0 || baseUri == undefined) {
        baseUri = "";
    }
    var bindings = visual.getElementsByTagName("binding");
    var tilegroup = new TileGroup(); {
        var binding = bindings[1];
        var tile = new TileTemplate();
        image = binding.getElementsByTagName("image")[0];
        if (image === null || image == undefined) {
            src = getBlankImageUri(150, 150);
        } else {
            src = baseUri + image.getAttribute("src");
            ialt = image.getAttribute("alt");
        }
        if (src == null || src.length == 0 || src == undefined) {
            src = "";
        }
        if (ialt == null || ialt.length == 0 || ialt == undefined) {
            ialt = "";
        }
        tnode = binding.getElementsByTagName("text")[0];
        text = tnode.textContent;
        if (text == null || text.length == 0 || text == undefined) {
            text = "";
        }
        var nowtem = "";
        var hightem = "";
        var lowtem = "";
        var displayname = ""; {
            if (binding.getAttribute("DisplayName")) {
                displayname = binding.getAttribute("DisplayName");
            }
            var group = binding.getElementsByTagName("group")[0]; {
                var subg1 = group.getElementsByTagName("subgroup")[0];
                nowtem = subg1.getElementsByTagName("text")[0].textContent;
                var subg2 = group.getElementsByTagName("subgroup")[1];
                hightem = subg2.getElementsByTagName("text")[0].textContent;
                lowtem = subg2.getElementsByTagName("text")[1].textContent;
            }
        }
        var tile = new TileTemplate();
        tile.create("TileSquare150x150PeekImageAndText03", "TileSquarePeekImageAndText03");
        tile.images[0] = src;
        tile.alts[0] = ialt;
        tile.texts[0] = nowtem;
        tile.texts[1] = displayname;
        tile.texts[2] = text;
        tile.texts[3] = hightem + "/" + lowtem;
        tilegroup.tiles.push(tile);
    }
    var tileWide = null; {
        var binding = bindings[2];
        var tile = new TileTemplate();
        image = binding.getElementsByTagName("image")[0];
        if (image === null || image == undefined) {
            src = getBlankImageUri(80, 80);
        } else {
            src = baseUri + image.getAttribute("src");
            ialt = image.getAttribute("alt");
        }
        if (src == null || src.length == 0 || src == undefined) {
            src = "";
        }
        if (ialt == null || ialt.length == 0 || ialt == undefined) {
            ialt = "";
        }
        tnode = binding.getElementsByTagName("text")[0];
        text = tnode.textContent;
        if (text == null || text.length == 0 || text == undefined) {
            text = "";
        }
        var nowtem = "";
        var hightem = "";
        var lowtem = "";
        var displayname = ""; {
            if (binding.getAttribute("DisplayName")) {
                displayname = binding.getAttribute("DisplayName");
            }
            var group = binding.getElementsByTagName("group")[0]; {
                var subg1 = group.getElementsByTagName("subgroup")[0];
                nowtem = subg1.getElementsByTagName("text")[0].textContent;
                var subg2 = group.getElementsByTagName("subgroup")[1];
                hightem = subg2.getElementsByTagName("text")[0].textContent;
                lowtem = subg2.getElementsByTagName("text")[1].textContent;
            }
        }
        var tile = new TileTemplate();
        tile.create("TileWide310x150SmallImageAndText02", "TileWideSmallImageAndText02");
        tile.images[0] = src;
        tile.alts[0] = ialt;
        tile.texts[0] = nowtem;
        tile.texts[1] = displayname;
        tile.texts[2] = text;
        tile.texts[3] = hightem + "/" + lowtem;
        tileWide = tile;
        tilegroup.tiles.push(tileWide);
    } {
        var binding = bindings[3];
        var tile = new TileTemplate();
        image = binding.getElementsByTagName("image")[0];
        if (image === null || image == undefined) {
            src = getBlankImageUri(310, 310);
        } else {
            src = baseUri + image.getAttribute("src");
            ialt = image.getAttribute("alt");
        }
        if (src == null || src.length == 0 || src == undefined) {
            src = "";
        }
        if (ialt == null || ialt.length == 0 || ialt == undefined) {
            ialt = "";
        }
        tnode = binding.getElementsByTagName("text")[0];
        text = tnode.textContent;
        if (text == null || text.length == 0 || text == undefined) {
            text = "";
        }
        var nowtem = "";
        var today_name = "";
        var tomorrow_name = "";
        var today_high = "";
        var today_low = "";
        var tomorrow_high = "";
        var tomorrow_low = ""; {
            if (binding.getAttribute("DisplayName")) {
                displayname = binding.getAttribute("DisplayName");
            }
            var group = binding.getElementsByTagName("group")[0]; {
                var subg1 = group.getElementsByTagName("subgroup")[0];
                nowtem = subg1.getElementsByTagName("text")[0].textContent;
            }
            group = binding.getElementsByTagName("group")[1]; {
                var subg1 = group.getElementsByTagName("subgroup")[0];
                today_name = subg1.getElementsByTagName("text")[0].textContent;
                today_high = subg1.getElementsByTagName("text")[1].textContent;
                today_low = subg1.getElementsByTagName("text")[2].textContent;
                var todayimg = subg1.getElementsByTagName("image")[0];
                if (todayimg === null || todayimg == undefined) {
                    tileWide.images[0] = getBlankImageUri(80, 80);
                } else {
                    tileWide.images[0] = baseUri + todayimg.getAttribute("src");
                }
            } {
                var subg2 = group.getElementsByTagName("subgroup")[1];
                tomorrow_name = subg2.getElementsByTagName("text")[0].textContent;
                tomorrow_high = subg2.getElementsByTagName("text")[1].textContent;
                tomorrow_low = subg2.getElementsByTagName("text")[2].textContent;
            }
        }
        var tile = new TileTemplate();
        tile.create("TileSquare310x310BlockAndText02", "");
        tile.images[0] = src;
        tile.alts[0] = ialt;
        tile.texts[0] = nowtem;
        tile.texts[1] = displayname;
        tile.texts[2] = text;
        tile.texts[3] = today_name;
        tile.texts[4] = today_high + "/" + today_low;
        tile.texts[5] = tomorrow_name;
        tile.texts[6] = tomorrow_high + "/" + tomorrow_low;
        tilegroup.tiles.push(tile);
    }
    return tilegroup.getXml();
}

/**
 * 用于 Win10 MSN 财经、体育、天气应用。（Multiple）
 * @param {string} tileXmlString 
 * @returns 
 */
function win10TileToWin8Tile3(tileXmlString) {
    var xmlDoc = xmlStringToXmlDom(tileXmlString);
    var tile = xmlDoc.getElementsByTagName("tile")[0];
    var visual = tile.getElementsByTagName("visual")[0];
    var baseUri = visual.getAttribute("baseUri");
    if (baseUri == null || baseUri.length == 0 || baseUri == undefined) {
        baseUri = "";
    }
    var bindings = visual.getElementsByTagName("binding");
    var tilegroup = new TileGroup(); {
        var binding = bindings[0];
        var tile = new TileTemplate();
        image = binding.getElementsByTagName("image")[0];
        if (image === null || image == undefined) {
            src = getBlankImageUri(150, 150);
        } else {
            src = baseUri + image.getAttribute("src");
            ialt = image.getAttribute("alt");
        }
        if (src == null || src.length == 0 || src == undefined) {
            src = "";
        }
        if (ialt == null || ialt.length == 0 || ialt == undefined) {
            ialt = "";
        }
        tnode = binding.getElementsByTagName("text")[0];
        text = tnode.textContent;
        if (text == null || text.length == 0 || text == undefined) {
            text = "";
        }
        var tile = new TileTemplate();
        tile.create("TileSquare150x150PeekImageAndText04", "TileSquarePeekImageAndText04");
        tile.images[0] = src;
        tile.alts[0] = ialt;
        tile.texts[0] = text;
        tilegroup.tiles.push(tile);
    } {
        var binding = bindings[1];
        var tile = new TileTemplate();
        image = binding.getElementsByTagName("image")[0];
        if (image === null || image == undefined) {
            src = getBlankImageUri(310, 100);
        } else {
            src = baseUri + image.getAttribute("src");
            ialt = image.getAttribute("alt");
        }
        if (src == null || src.length == 0 || src == undefined) {
            src = "";
        }
        if (ialt == null || ialt.length == 0 || ialt == undefined) {
            ialt = "";
        }
        tnode = binding.getElementsByTagName("text")[0];
        text = tnode.textContent;
        if (text == null || text.length == 0 || text == undefined) {
            text = "";
        }
        var tile = new TileTemplate();
        tile.create("TileWide310x150ImageAndText01", "TileWideImageAndText01");
        tile.images[0] = src;
        tile.alts[0] = ialt;
        tile.texts[0] = text;
        tilegroup.tiles.push(tile);
    } {
        var binding = bindings[2];
        var tile = new TileTemplate();
        tile.create("TileSquare310x310SmallImagesAndTextList02", null); {
            var group = binding.getElementsByTagName("group")[0]; {
                var subgroup = group.getElementsByTagName("subgroup")[0];
                var image = subgroup.getElementsByTagName("image")[0];
                if (image === null || image == undefined) {
                    src = getBlankImageUri(60, 60);
                } else {
                    src = baseUri + image.getAttribute("src");
                    ialt = image.getAttribute("alt");
                }
                tile.images[0] = src;
                subgroup = group.getElementsByTagName("subgroup")[1];
                var text = subgroup.getElementsByTagName("text")[0];
                tile.texts[0] = text.textContent;
            }
        } {
            var group = binding.getElementsByTagName("group")[1]; {
                var subgroup = group.getElementsByTagName("subgroup")[0];
                var image = subgroup.getElementsByTagName("image")[0];
                if (image === null || image == undefined) {
                    src = getBlankImageUri(60, 60);
                } else {
                    src = baseUri + image.getAttribute("src");
                    ialt = image.getAttribute("alt");
                }
                tile.images[1] = src;
                subgroup = group.getElementsByTagName("subgroup")[1];
                var text = subgroup.getElementsByTagName("text")[0];
                tile.texts[1] = text.textContent;
            }
        } {
            var group = binding.getElementsByTagName("group")[2]; {
                var subgroup = group.getElementsByTagName("subgroup")[0];
                var image = subgroup.getElementsByTagName("image")[0];
                if (image === null || image == undefined) {
                    src = getBlankImageUri(60, 60);
                } else {
                    src = baseUri + image.getAttribute("src");
                    ialt = image.getAttribute("alt");
                }
                tile.images[2] = src;
                subgroup = group.getElementsByTagName("subgroup")[1];
                var text = subgroup.getElementsByTagName("text")[0];
                tile.texts[2] = text.textContent;
            }
        }
        tilegroup.tiles.push(tile);
    }
    return tilegroup.getXml();
}

// 覆盖兼容

/**
 * 将 xml 文本转换成 Windows.Data.Xml.Dom.XmlDocument 对象
 * @param {string|Windows.Data.Xml.Dom.XmlDocument} xmlString
 * @returns {Windows.Data.Xml.Dom.XmlDocument}
 */
function xmlStringToXmlDom(xmlString) {
    if (xmlString instanceof Windows.Data.Xml.Dom.XmlDocument) {
        return xmlString;
    }
    var xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();
    xmlDoc.loadXml(xmlString);
    return xmlDoc;
}

/**
 * 将 Windows.Data.Xml.Dom.XmlDocument 对象转换成 xml 文本
 * @param {Windows.Data.Xml.Dom.XmlDocument|string} xmlDoc
 * @returns {string}
 */
function xmlDomToXmlString(xmlDoc) {
    if (typeof xmlDoc === "string") {
        return xmlStringToXmlDom(xmlDoc).getXml();
    }
    // Windows.Data.Xml.Dom.XmlDocument
    return xmlDoc.getXml();
}

/**
 * 用于 Win10 MSN 财经、体育、天气应用。只用 Windows.Data.Xml.Dom.XmlDocument。
 * @param {string} tileXmlString 
 * @returns {Windows.Data.Xml.Dom.XmlDocument}
 */
function win10TileToWin8Tile(tileXmlString) {
    var xmlDoc = xmlStringToXmlDom(tileXmlString);
    var tile = xmlDoc.getElementsByTagName("tile").item(0);
    if (!tile) return null;
    var visual = tile.getElementsByTagName("visual").item(0);
    if (!visual) return null;

    var baseUri = visual.getAttribute("baseUri");
    if (!baseUri) baseUri = "";

    var bindings = visual.getElementsByTagName("binding");
    var tilegroup = new TileGroup();

    // Square150x150
    if (bindings.length > 0) {
        var binding = bindings.item(0);
        var image = binding.getElementsByTagName("image").item(0);
        var src, ialt;
        if (!image) {
            src = getBlankImageUri(150, 150);
            ialt = "";
        } else {
            src = baseUri + (image.getAttribute("src") || "");
            ialt = image.getAttribute("alt") || "";
        }
        if (!src) src = "";
        if (!ialt) ialt = "";
        var tnode = binding.getElementsByTagName("text").item(0);
        var text = tnode ? tnode.innerText : "";
        if (!text) text = "";

        var tileObj = new TileTemplate();
        tileObj.create("TileSquare150x150PeekImageAndText04", "TileSquarePeekImageAndText04");
        tileObj.images[0] = src;
        tileObj.alts[0] = ialt;
        tileObj.texts[0] = text;
        tilegroup.tiles.push(tileObj);
    }

    // Wide310x150
    if (bindings.length > 1) {
        var binding = bindings.item(1);
        var image = binding.getElementsByTagName("image").item(0);
        var src, ialt;
        if (!image) {
            src = getBlankImageUri(310, 150);
            ialt = "";
        } else {
            src = baseUri + (image.getAttribute("src") || "");
            ialt = image.getAttribute("alt") || "";
        }
        if (!src) src = "";
        if (!ialt) ialt = "";
        var tnode = binding.getElementsByTagName("text").item(0);
        var text = tnode ? tnode.innerText : "";
        if (!text) text = "";

        var tileObj = new TileTemplate();
        tileObj.create("TileWide310x150ImageAndText01", "TileWideImageAndText01");
        tileObj.images[0] = src;
        tileObj.alts[0] = ialt;
        tileObj.texts[0] = text;
        tilegroup.tiles.push(tileObj);
    }

    // Square310x310
    if (bindings.length > 2) {
        var binding = bindings.item(2);
        var image = binding.getElementsByTagName("image").item(0);
        var src, ialt;
        if (!image) {
            src = getBlankImageUri(310, 310);
            ialt = "";
        } else {
            src = baseUri + image.getAttribute("src") || "";
            ialt = image.getAttribute("alt") || "";
        }
        if (!src) src = "";
        if (!ialt) ialt = "";
        var tnode = binding.getElementsByTagName("text").item(0);
        var text = tnode ? tnode.innerText : "";
        if (!text) text = "";

        var tileObj = new TileTemplate();
        tileObj.create("TileSquare310x310ImageAndTextOverlay01", null);
        tileObj.images[0] = src;
        tileObj.alts[0] = ialt;
        tileObj.texts[0] = text;
        tilegroup.tiles.push(tileObj);
    }

    return tilegroup.getXml();
}

/**
 * 用于 Win10 MSN 天气应用，UWP专用版本，只用 Windows.Data.Xml.Dom.XmlDocument。
 * @param {string} tileXmlString 
 * @returns {Windows.Data.Xml.Dom.XmlDocument}
 */
function win10TileToWin8Tile2(tileXmlString) {
    var xmlDoc = xmlStringToXmlDom(tileXmlString);
    var tile = xmlDoc.getElementsByTagName("tile").item(0);
    if (!tile) return null;
    var visual = tile.getElementsByTagName("visual").item(0);
    if (!visual) return null;

    var baseUri = visual.getAttribute("baseUri") || "";

    var bindings = visual.getElementsByTagName("binding");
    var tilegroup = new TileGroup();

    // Square150x150
    if (bindings.length > 1) {
        var binding = bindings.item(1);
        var image = binding.getElementsByTagName("image").item(0);
        var src, ialt;
        if (!image) {
            src = getBlankImageUri(150, 150);
            ialt = "";
        } else {
            src = baseUri + (image.getAttribute("src") || "");
            ialt = image.getAttribute("alt") || "";
        }
        if (!src) src = "";
        if (!ialt) ialt = "";

        var tnode = binding.getElementsByTagName("text").item(0);
        var text = tnode ? tnode.innerText : "";
        if (!text) text = "";

        var nowtem = "", hightem = "", lowtem = "", displayname = "";
        if (binding.getAttribute("DisplayName")) {
            displayname = binding.getAttribute("DisplayName");
        }
        var group = binding.getElementsByTagName("group").item(0);
        if (group) {
            var subg1 = group.getElementsByTagName("subgroup").item(0);
            if (subg1) nowtem = (subg1.getElementsByTagName("text").item(0) || {}).innerText || "";
            var subg2 = group.getElementsByTagName("subgroup").item(1);
            if (subg2) {
                hightem = (subg2.getElementsByTagName("text").item(0) || {}).innerText || "";
                lowtem = (subg2.getElementsByTagName("text").item(1) || {}).innerText || "";
            }
        }

        var tileObj = new TileTemplate();
        tileObj.create("TileSquare150x150PeekImageAndText03", "TileSquarePeekImageAndText03");
        tileObj.images[0] = src;
        tileObj.alts[0] = ialt;
        tileObj.texts[0] = nowtem;
        tileObj.texts[1] = displayname;
        tileObj.texts[2] = text;
        tileObj.texts[3] = hightem + "/" + lowtem;
        tilegroup.tiles.push(tileObj);
    }

    // Wide310x150
    var tileWide = null;
    if (bindings.length > 2) {
        var binding = bindings.item(2);
        var image = binding.getElementsByTagName("image").item(0);
        var src, ialt;
        if (!image) {
            src = getBlankImageUri(80, 80);
            ialt = "";
        } else {
            src = baseUri + (image.getAttribute("src") || "");
            ialt = image.getAttribute("alt") || "";
        }
        if (!src) src = "";
        if (!ialt) ialt = "";

        var tnode = binding.getElementsByTagName("text").item(0);
        var text = tnode ? tnode.innerText : "";
        if (!text) text = "";

        var nowtem = "", hightem = "", lowtem = "", displayname = "";
        if (binding.getAttribute("DisplayName")) {
            displayname = binding.getAttribute("DisplayName");
        }
        var group = binding.getElementsByTagName("group").item(0);
        if (group) {
            var subg1 = group.getElementsByTagName("subgroup").item(0);
            if (subg1) nowtem = (subg1.getElementsByTagName("text").item(0) || {}).innerText || "";
            var subg2 = group.getElementsByTagName("subgroup").item(1);
            if (subg2) {
                hightem = (subg2.getElementsByTagName("text").item(0) || {}).innerText || "";
                lowtem = (subg2.getElementsByTagName("text").item(1) || {}).innerText || "";
            }
        }

        var tileObj = new TileTemplate();
        tileObj.create("TileWide310x150SmallImageAndText02", "TileWideSmallImageAndText02");
        tileObj.images[0] = src;
        tileObj.alts[0] = ialt;
        tileObj.texts[0] = nowtem;
        tileObj.texts[1] = displayname;
        tileObj.texts[2] = text;
        tileObj.texts[3] = hightem + "/" + lowtem;
        tileWide = tileObj;
        tilegroup.tiles.push(tileWide);
    }

    // Square310x310
    if (bindings.length > 3) {
        var binding = bindings.item(3);
        var image = binding.getElementsByTagName("image").item(0);
        var src, ialt;
        if (!image) {
            src = getBlankImageUri(310, 310);
            ialt = "";
        } else {
            src = baseUri + (image.getAttribute("src") || "");
            ialt = image.getAttribute("alt") || "";
        }
        if (!src) src = "";
        if (!ialt) ialt = "";

        var tnode = binding.getElementsByTagName("text").item(0);
        var text = tnode ? tnode.innerText : "";
        if (!text) text = "";

        var nowtem = "", today_name = "", tomorrow_name = "";
        var today_high = "", today_low = "", tomorrow_high = "", tomorrow_low = "", displayname = "";
        if (binding.getAttribute("DisplayName")) {
            displayname = binding.getAttribute("DisplayName");
        }
        var group = binding.getElementsByTagName("group").item(0);
        if (group) {
            var subg1 = group.getElementsByTagName("subgroup").item(0);
            if (subg1) nowtem = (subg1.getElementsByTagName("text").item(0) || {}).innerText || "";
        }
        group = binding.getElementsByTagName("group").item(1);
        if (group) {
            var subg1 = group.getElementsByTagName("subgroup").item(0);
            if (subg1) {
                today_name = (subg1.getElementsByTagName("text").item(0) || {}).innerText || "";
                today_high = (subg1.getElementsByTagName("text").item(1) || {}).innerText || "";
                today_low = (subg1.getElementsByTagName("text").item(2) || {}).innerText || "";
                var todayimg = subg1.getElementsByTagName("image").item(0);
                if (tileWide) {
                    if (!todayimg) {
                        tileWide.images[0] = getBlankImageUri(80, 80);
                    } else {
                        tileWide.images[0] = baseUri + (todayimg.getAttribute("src") || "");
                    }
                }
            }
            var subg2 = group.getElementsByTagName("subgroup").item(1);
            if (subg2) {
                tomorrow_name = (subg2.getElementsByTagName("text").item(0) || {}).innerText || "";
                tomorrow_high = (subg2.getElementsByTagName("text").item(1) || {}).innerText || "";
                tomorrow_low = (subg2.getElementsByTagName("text").item(2) || {}).innerText || "";
            }
        }

        var tileObj = new TileTemplate();
        tileObj.create("TileSquare310x310BlockAndText02", "");
        tileObj.images[0] = src;
        tileObj.alts[0] = ialt;
        tileObj.texts[0] = nowtem;
        tileObj.texts[1] = displayname;
        tileObj.texts[2] = text;
        tileObj.texts[3] = today_name;
        tileObj.texts[4] = today_high + "/" + today_low;
        tileObj.texts[5] = tomorrow_name;
        tileObj.texts[6] = tomorrow_high + "/" + tomorrow_low;
        tilegroup.tiles.push(tileObj);
    }

    return tilegroup.getXml();
}

/**
 * 用于 Win10 MSN 财经、体育、天气应用。（Multiple）
 * 仅使用 Windows.Data.Xml.Dom.XmlDocument API（UWP环境）
 * @param {string} tileXmlString 
 * @returns {Windows.Data.Xml.Dom.XmlDocument}
 */
function win10TileToWin8Tile3(tileXmlString) {
    var xmlDoc = xmlStringToXmlDom(tileXmlString);
    var tile = xmlDoc.getElementsByTagName("tile").item(0);
    if (!tile) return null;
    var visual = tile.getElementsByTagName("visual").item(0);
    if (!visual) return null;

    var baseUri = visual.getAttribute("baseUri") || "";

    var bindings = visual.getElementsByTagName("binding");
    var tilegroup = new TileGroup();

    // TileSquare150x150PeekImageAndText04
    if (bindings.length > 0) {
        var binding = bindings.item(0);
        var image = binding.getElementsByTagName("image").item(0);
        var src, ialt;
        if (!image) {
            src = getBlankImageUri(150, 150);
            ialt = "";
        } else {
            src = baseUri + (image.getAttribute("src") || "");
            ialt = image.getAttribute("alt") || "";
        }
        if (!src) src = "";
        if (!ialt) ialt = "";
        var tnode = binding.getElementsByTagName("text").item(0);
        var text = tnode ? tnode.innerText : "";
        if (!text) text = "";

        var tileObj = new TileTemplate();
        tileObj.create("TileSquare150x150PeekImageAndText04", "TileSquarePeekImageAndText04");
        tileObj.images[0] = src;
        tileObj.alts[0] = ialt;
        tileObj.texts[0] = text;
        tilegroup.tiles.push(tileObj);
    }

    // TileWide310x150ImageAndText01
    if (bindings.length > 1) {
        var binding = bindings.item(1);
        var image = binding.getElementsByTagName("image").item(0);
        var src, ialt;
        if (!image) {
            src = getBlankImageUri(310, 100);
            ialt = "";
        } else {
            src = baseUri + (image.getAttribute("src") || "");
            ialt = image.getAttribute("alt") || "";
        }
        if (!src) src = "";
        if (!ialt) ialt = "";
        var tnode = binding.getElementsByTagName("text").item(0);
        var text = tnode ? tnode.innerText : "";
        if (!text) text = "";

        var tileObj = new TileTemplate();
        tileObj.create("TileWide310x150ImageAndText01", "TileWideImageAndText01");
        tileObj.images[0] = src;
        tileObj.alts[0] = ialt;
        tileObj.texts[0] = text;
        tilegroup.tiles.push(tileObj);
    }

    // TileSquare310x310SmallImagesAndTextList02
    if (bindings.length > 2) {
        var binding = bindings.item(2);
        var tileObj = new TileTemplate();
        tileObj.create("TileSquare310x310SmallImagesAndTextList02", null);

        // 三组 group/subgroup
        for (var groupIdx = 0; groupIdx < 3; groupIdx++) {
            var group = binding.getElementsByTagName("group").item(groupIdx);
            if (!group) continue;
            var subgroupImg = group.getElementsByTagName("subgroup").item(0);
            var subgroupText = group.getElementsByTagName("subgroup").item(1);

            // image
            var image = subgroupImg ? subgroupImg.getElementsByTagName("image").item(0) : null;
            var src, ialt;
            if (!image) {
                src = getBlankImageUri(60, 60);
                ialt = "";
            } else {
                src = baseUri + (image.getAttribute("src") || "");
                ialt = image.getAttribute("alt") || "";
            }
            tileObj.images[groupIdx] = src;
            // text
            var textNode = subgroupText ? subgroupText.getElementsByTagName("text").item(0) : null;
            var text = textNode ? textNode.innerText : "";
            tileObj.texts[groupIdx] = text;
        }
        tilegroup.tiles.push(tileObj);
    }

    return tilegroup.getXml();
}