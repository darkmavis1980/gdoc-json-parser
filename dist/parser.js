
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "TYPES", () => $5dd49e5016284773$export$426db7a6155b7a80);
$parcel$export(module.exports, "default", () => $5dd49e5016284773$export$2e2bcd8739ae039);
// The higher number the smaller the indentation gets
const $5dd49e5016284773$var$TEXT_INDENT_RATIO = 4;
const $5dd49e5016284773$var$TABLE_WRAPPER_CLASS = "";
const $5dd49e5016284773$var$TABLE_CLASS = "";
const $5dd49e5016284773$var$BASE_FONT_SIZE = "10pt";
const $5dd49e5016284773$var$BASE_FONT_WEIGHT = "400";
const $5dd49e5016284773$var$borders = [
    {
        key: "top",
        class: "borderTop"
    },
    {
        key: "bottom",
        class: "borderBottom"
    }
];
const $5dd49e5016284773$var$formatStyles = {
    bold: (text)=>`<strong>${text}</strong> `,
    underline: (text)=>`<u>${text}</u> `,
    italic: (text)=>`<i>${text}</i> `,
    link: (text, textStyle)=>` <a href="${textStyle.link.url}">${text}</a> `,
    fontSize: (text, textStyle)=>{
        if (textStyle.fontSize.magnitude === 16) return `<h2>${text}</h2>`;
        return text;
    }
};
/**
 * @description Parses the textRun node and returns a cleaned up text wrapped in an html element
 * @param {Object} text The text node with the content and eventual textStyle
 * @param {String|Boolean} wrapperElement Wrapper element for the text, set to false will return the cleaned up text without a wrapping element
 * @returns {String}
 */ const $5dd49e5016284773$var$parseText = (text, wrapperElement = "p")=>{
    let { content: content, textStyle: textStyle } = text;
    content = content.replace(/(\r\n|\n|\r|)/gm, "").replace(/(\u000b)/gm, "<br />").trim();
    if (content === "") return;
    if (!wrapperElement) return content;
    Object.keys(textStyle).map((key)=>{
        if ($5dd49e5016284773$var$formatStyles[key] && textStyle[key]) content = $5dd49e5016284773$var$formatStyles[key](content, textStyle);
    });
    const styles = [];
    if (textStyle) {
        if (textStyle.fontSize && `${textStyle.fontSize.magnitude}${textStyle.fontSize.unit.toLowerCase()}` !== $5dd49e5016284773$var$BASE_FONT_SIZE) styles.push(`font-size: ${textStyle.fontSize.magnitude}${textStyle.fontSize.unit.toLowerCase()}`);
        if (textStyle.weightedFontFamily && textStyle.weightedFontFamily.weight && textStyle.weightedFontFamily.weight.toString() !== $5dd49e5016284773$var$BASE_FONT_WEIGHT) styles.push(`font-weight: ${textStyle.weightedFontFamily.weight}`);
    }
    if (styles.length > 0) return `<${wrapperElement} style="${styles.join(";")}">${content}</${wrapperElement}>`;
    return content;
};
/**
 * @description Parses the paragraphStyles and return an array with styles to be applied to the element
 * @param {Object} paragraphStyle Object containing the node style properties
 * @param {Number} indent_ratio Ratio of indentation, if set to 1, it will map as stored in the source node, bigger than one
 *                              will cut the indentation, to be more friendly to confined widths
 * @returns {Array}
 */ const $5dd49e5016284773$var$getNodeStyle = (paragraphStyle, indent_ratio = $5dd49e5016284773$var$TEXT_INDENT_RATIO)=>{
    const styles = [];
    if (paragraphStyle) {
        const { indentStart: indentStart, alignment: alignment } = paragraphStyle;
        if (indentStart) {
            //styles.push(`text-indent: -${indentStart.magnitude || 0}${indentStart.unit.toLowerCase()}`);
            styles.push(`text-indent: -${indentStart.magnitude / indent_ratio || 0}${indentStart.unit.toLowerCase()}`);
            styles.push(`padding-left: ${indentStart.magnitude / (indent_ratio / 2) || 0}${indentStart.unit.toLowerCase()}`);
        }
        if (alignment === "END") styles.push("text-align: right");
        if (alignment === "CENTER") styles.push("text-align: center");
    }
    return styles;
};
/**
 * @description Translates the colorAttr object into an rgb value usable for inline styles
 * @param {Object} colorAttr Color object data
 * @returns {String}
 */ const $5dd49e5016284773$var$getColor = (colorAttr)=>{
    if (colorAttr.color.rgbColor && Object.keys(colorAttr.color.rgbColor).length > 0) return `rgb(${colorAttr.color.rgbColor.red}, ${colorAttr.color.rgbColor.green}, ${colorAttr.color.rgbColor.blue})`;
    return "#000";
};
/**
 * @description Parse a paragraph node and return an html string as a result
 * @param {Object} item The document node item representing a paragraph
 * @param {Object} item.paragraph The paragraph object
 * @param {Object} item.paragraphStyle The style to apply to the paragraph
 * @returns {String}
 */ const $5dd49e5016284773$var$parseParagraph = (item)=>{
    const { elements: elements, bullet: bullet } = item.paragraph;
    const { paragraphStyle: paragraphStyle } = item;
    let wrapperElement = "p";
    const wrapper = elements.length === 1 ? "div" : "span";
    const styles = $5dd49e5016284773$var$getNodeStyle(paragraphStyle);
    if (bullet) wrapperElement = "li";
    return `<${wrapperElement}${styles.length > 0 ? ' style="' + styles.join(";") + '"' : ""}>${elements.map((element)=>{
        if (element.textRun) return $5dd49e5016284773$var$parseText(element.textRun, wrapper);
    }).join("")}</${wrapperElement}>`;
};
/**
 * @description Similar to parseParagraph, but specific to a table cell
 * @param {Object} cell The document node item representing a table cell
 * @returns {String}
 */ const $5dd49e5016284773$var$parseCell = (cell)=>{
    const { content: content } = cell;
    return content.map((line)=>{
        if (line.paragraph) {
            const wrapperElement = "div";
            const wrapper = line.paragraph.elements.length === 1 ? "div" : "span";
            const styles = $5dd49e5016284773$var$getNodeStyle(line.paragraph.paragraphStyle);
            return `<${wrapperElement}${styles.length > 0 ? ' style="' + styles.join(";") + '"' : ""}>${line.paragraph.elements.map((element)=>{
                if (element.textRun && element.textRun) return $5dd49e5016284773$var$parseText(element.textRun, wrapper);
                return "";
            }).join("")}</${wrapperElement}>`;
        }
        return "";
    }).join("");
};
/**
 * @description Parses the rows of a table node and create the relative html code for it
 * @param {Array} rows The array of rows
 * @returns {String}
 */ const $5dd49e5016284773$var$createTableRows = (rows)=>{
    const htmlRows = rows.map((row)=>{
        const { tableCells: tableCells } = row;
        let colSpanCounter = 1;
        const htmlRow = tableCells.map((cell)=>{
            // Removes columns covered by a previous colspan
            if (colSpanCounter > 1) {
                colSpanCounter--;
                return null;
            }
            const props = [];
            const styles = [];
            if (cell.tableCellStyle.rowSpan > 1) props.push(`rowspan="${cell.tableCellStyle.rowSpan}"`);
            if (cell.tableCellStyle.columnSpan > 1) {
                colSpanCounter = cell.tableCellStyle.columnSpan;
                props.push(`colspan="${cell.tableCellStyle.columnSpan}"`);
            }
            $5dd49e5016284773$var$borders.forEach((border)=>{
                if (cell.tableCellStyle[border.class]) {
                    styles.push(`border-${border.key}-width: ${cell.tableCellStyle[border.class].width.magnitude}${cell.tableCellStyle[border.class].width.unit.toLowerCase()}`);
                    styles.push(`border-${border.key}-color: ${$5dd49e5016284773$var$getColor(cell.tableCellStyle[border.class].color)}`);
                    styles.push(`border-${border.key}-style: solid`);
                }
            });
            if (styles.length > 0) props.push(`style="${styles.join(";")}"`);
            if (props.length > 0) return `<td ${props.join(" ")}>
        ${$5dd49e5016284773$var$parseCell(cell)}
        </td>`;
            return `<td>${$5dd49e5016284773$var$parseCell(cell)}</td>`;
        }).join("");
        return `<tr>${htmlRow}</tr>`;
    }).join("");
    return `<tbody>${htmlRows}</tbody>`;
};
/**
 * @description Read the columns array and creates the eventual <thead> html element
 * @param {Array} columns Array of columns objects
 * @returns {String}
 */ const $5dd49e5016284773$var$createTableHead = (columns)=>{
    const htmlColumns = columns.map((column)=>{
        if (column.widthType === "FIXED_WIDTH") return `<th width="${column.width.magnitude}${column.width.unit.toLowerCase()}"></th>`;
        return "<th></th>";
    }).join("");
    return `<thead><tr>${htmlColumns}</tr></thead>`;
};
/**
 * @description Parse the table node object and creates the html table with it
 * @param {Object} item Object that contains the table node
 * @returns {String}
 */ const $5dd49e5016284773$var$parseTable = (item)=>{
    const { tableStyle: tableStyle, tableRows: tableRows } = item.table;
    return `<div class="${$5dd49e5016284773$var$TABLE_WRAPPER_CLASS}">
    <table style="border-collapse: collapse;" class="${$5dd49e5016284773$var$TABLE_CLASS}">
      ${$5dd49e5016284773$var$createTableHead(tableStyle.tableColumnProperties)}\n
      ${$5dd49e5016284773$var$createTableRows(tableRows)}
    </table>
  </div>`;
};
/**
 * @description Parses the sectionBreak element
 * @returns {String}
 */ const $5dd49e5016284773$var$parseBreak = ()=>"";
const $5dd49e5016284773$export$426db7a6155b7a80 = {
    paragraph: $5dd49e5016284773$var$parseParagraph,
    table: $5dd49e5016284773$var$parseTable,
    sectionBreak: $5dd49e5016284773$var$parseBreak
};
/**
 * @description Parse the content of the body to match all eventual lists
 * @param {Object} param Object Containing the content and list properties
 * @returns {Object}
 */ function $5dd49e5016284773$var$getListsMapping({ content: content, lists: lists }) {
    const bulletLists = content.filter((line)=>line.paragraph && line.paragraph.bullet);
    const listKeys = Object.keys(lists).filter((key)=>bulletLists.filter((item)=>item.paragraph.bullet.listId === key).length > 0);
    const listMap = {
        openTags: {},
        closeTags: {}
    };
    listKeys.forEach((key)=>{
        // Handles main lists
        const foundRootList = bulletLists.filter((item)=>key === item.paragraph.bullet.listId && !item.paragraph.bullet.nestingLevel);
        const first = foundRootList[0];
        const last = foundRootList[foundRootList.length - 1];
        const listElement = lists[key].listProperties.nestingLevels[0].glyphType === "UPPER_ALPHA" ? "ol" : "ul";
        listMap.openTags[first.startIndex] = `<${listElement}>`;
        listMap.closeTags[last.startIndex] = `</${listElement}>`;
        // Handles sub lists
        const foundSubList = bulletLists.filter((item)=>key === item.paragraph.bullet.listId && item.paragraph.bullet.nestingLevel);
        if (foundSubList.length > 0) {
            const firstSub = foundSubList[0];
            const lastsub = foundSubList[foundSubList.length - 1];
            const listElementSub = lists[key].listProperties.nestingLevels[1].glyphType === "UPPER_ALPHA" ? "ol" : "ul";
            listMap.openTags[firstSub.startIndex] = `<${listElementSub}>`;
            listMap.closeTags[lastsub.startIndex] = `</${listElementSub}>`;
        }
    });
    return listMap;
}
/**
 * @description Parses the main doc object from google docs API and returns the translated html of it
 * @param {Object} doc The main doc object retrieved from google docs API
 * @returns {String}
 */ const $5dd49e5016284773$var$parser = (doc)=>{
    // get the list of <ul|ol> tags
    const listMap = $5dd49e5016284773$var$getListsMapping({
        content: doc.body.content,
        lists: doc.lists
    });
    const html = doc.body.content.map((line)=>{
        let htmlLine = "";
        // Injects the start of a list element if found for this line
        if (listMap.openTags[line.startIndex]) htmlLine += listMap.openTags[line.startIndex];
        htmlLine += Object.keys($5dd49e5016284773$export$426db7a6155b7a80).map((key)=>{
            if (line[key]) return $5dd49e5016284773$export$426db7a6155b7a80[key](line);
        }).join("");
        // Injects the end of a list element if found for this line
        if (listMap.closeTags[line.startIndex]) htmlLine += listMap.closeTags[line.startIndex];
        return htmlLine;
    }).join("");
    return html;
};
var $5dd49e5016284773$export$2e2bcd8739ae039 = $5dd49e5016284773$var$parser;


//# sourceMappingURL=parser.js.map
