"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const str = {
    /**
  *  Splits by new line character ("\n") by putting new line characters into the
  *  array as well. Ex: "hello\n\nworld\n " => ["hello", "\n", "\n", "world", "\n", " "]
  */
    tokenizeWithNewLines(str) {
        const NewLine = "\n";
        if (str === NewLine) {
            return [str];
        }
        var lines = str.split(NewLine);
        if (lines.length === 1) {
            return lines;
        }
        var lastIndex = lines.length - 1;
        return lines.reduce((pv, line, ind) => {
            if (ind !== lastIndex) {
                if (line !== "") {
                    pv = pv.concat(line, NewLine);
                }
                else {
                    pv.push(NewLine);
                }
            }
            else if (line !== "") {
                pv.push(line);
            }
            return pv;
        }, []);
    }
};
class InsertOpDenormalizer {
    static denormalize(op) {
        if (!op || typeof op !== 'object') {
            return [];
        }
        if (typeof op.insert === 'object' || op.insert === NewLine) {
            return [op];
        }
        let newlinedArray = str.tokenizeWithNewLines(op.insert + '');
        if (newlinedArray.length === 1) {
            return [op];
        }
        let nlObj = obj.assign({}, op, { insert: NewLine });
        return newlinedArray.map((line) => {
            if (line === NewLine) {
                return nlObj;
            }
            return obj.assign({}, op, {
                insert: line
            });
        });
    }
}
class InsertOpsConverter {
    static convert(deltaOps) {
        if (!Array.isArray(deltaOps)) {
            return [];
        }
        var denormalizedOps = [].concat.apply([], deltaOps.map(InsertOpDenormalizer.denormalize));
        var results = [];
        var insertVal, attributes;
        for (var op of denormalizedOps) {
            if (!op.insert) {
                continue;
            }
            insertVal = InsertOpsConverter.convertInsertVal(op.insert);
            if (!insertVal) {
                continue;
            }
            attributes = OpAttributeSanitizer.sanitize(op.attributes);
            results.push(new DeltaInsertOp(insertVal, attributes));
        }
        return results;
    }
    static convertInsertVal(insertPropVal) {
        if (typeof insertPropVal === 'string') {
            return new InsertDataQuill(DataType.Text, insertPropVal);
        }
        if (!insertPropVal || typeof insertPropVal !== 'object') {
            return null;
        }
        let keys = Object.keys(insertPropVal);
        if (!keys.length) {
            return null;
        }
        return DataType.Image in insertPropVal ?
            new InsertDataQuill(DataType.Image, insertPropVal[DataType.Image])
            : DataType.Video in insertPropVal ?
                new InsertDataQuill(DataType.Video, insertPropVal[DataType.Video])
                : DataType.Formula in insertPropVal ?
                    new InsertDataQuill(DataType.Formula, insertPropVal[DataType.Formula])
                    // custom
                    : new InsertDataCustom(keys[0], insertPropVal[keys[0]]);
    }
}
const NewLine = "\n";
var ListType;
(function (ListType) {
    ListType["Ordered"] = "ordered";
    ListType["Bullet"] = "bullet";
    ListType["Checked"] = "checked";
    ListType["Unchecked"] = "unchecked";
})(ListType || (ListType = {}));
var ScriptType;
(function (ScriptType) {
    ScriptType["Sub"] = "sub";
    ScriptType["Super"] = "super";
})(ScriptType || (ScriptType = {}));
var DirectionType;
(function (DirectionType) {
    DirectionType["Rtl"] = "rtl";
})(DirectionType || (DirectionType = {}));
var AlignType;
(function (AlignType) {
    AlignType["Center"] = "center";
    AlignType["Right"] = "right";
    AlignType["Justify"] = "justify";
})(AlignType || (AlignType = {}));
var DataType;
(function (DataType) {
    DataType["Image"] = "image";
    DataType["Video"] = "video";
    DataType["Formula"] = "formula";
    DataType["Text"] = "text";
})(DataType || (DataType = {}));
;
class InsertDataQuill {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
;
class InsertDataCustom {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
;
;
const arr = {
    preferSecond(arr) {
        if (arr.length === 0) {
            return null;
        }
        return arr.length >= 2 ? arr[1] : arr[0];
    },
    flatten(arr) {
        return arr.reduce((pv, v) => {
            return pv.concat(Array.isArray(v) ? flatten(v) : v);
        }, []);
    }
};
const DEFAULT_INLINE_FONTS = {
    serif: 'font-family: Georgia, Times New Roman, serif',
    monospace: 'font-family: Monaco, Courier New, monospace'
};
const DEFAULT_FONT_SIZE_STYLES = {
    small: 'font-size: 0.75em',
    large: 'font-size: 1.5em',
    huge: 'font-size: 2.5em'
};
const DEFAULT_INLINE_STYLES = {
    lineheight: (value) => 'line-height:' + value,
    fontFamily: (value) => 'font-family:' + value,
    font: (value) => DEFAULT_INLINE_FONTS[value] || ('font-family:' + value),
    size: (value) => DEFAULT_FONT_SIZE_STYLES[value] || ('font-size:' + value),
    indent: (value, op) => {
        var indentSize = parseInt(value, 10) * 3;
        var side = op.attributes['direction'] === 'rtl' ? 'right' : 'left';
        return 'padding-' + side + ':' + indentSize + 'em';
    },
    direction: (value, op) => {
        if (value === 'rtl') {
            return 'direction:rtl' + (op.attributes['align'] ? '' : '; text-align:inherit');
        }
        else {
            return undefined;
        }
    }
};
const url = {
    sanitize(str) {
        return str.replace(/^\s*/gm, '');
    },
    encodeLink(str) {
        let linkMaps = encodeMappings(EncodeTarget.Url);
        let decoded = linkMaps.reduce(decodeMapping, str);
        return linkMaps.reduce(encodeMapping, decoded);
    }
};
class MentionSanitizer {
    static sanitize(dirtyObj) {
        var cleanObj = {};
        if (!dirtyObj || typeof dirtyObj !== 'object') {
            return cleanObj;
        }
        if (dirtyObj.class && MentionSanitizer.IsValidClass(dirtyObj.class)) {
            cleanObj.class = dirtyObj.class;
        }
        if (dirtyObj.id && MentionSanitizer.IsValidId(dirtyObj.id)) {
            cleanObj.id = dirtyObj.id;
        }
        if (MentionSanitizer.IsValidTarget(dirtyObj.target + '')) {
            cleanObj.target = dirtyObj.target;
        }
        if (dirtyObj.avatar) {
            cleanObj.avatar = url.sanitize(dirtyObj.avatar + '');
        }
        if (dirtyObj['end-point']) {
            cleanObj['end-point'] = url.sanitize(dirtyObj['end-point'] + '');
        }
        if (dirtyObj.slug) {
            cleanObj.slug = (dirtyObj.slug + '');
        }
        return cleanObj;
    }
    static IsValidClass(classAttr) {
        return !!classAttr.match(/^[a-zA-Z0-9_\-]{1,500}$/i);
    }
    static IsValidId(idAttr) {
        return !!idAttr.match(/^[a-zA-Z0-9_\-\:\.]{1,500}$/i);
    }
    static IsValidTarget(target) {
        return ['_self', '_blank', '_parent', '_top'].indexOf(target) > -1;
    }
}
class OpAttributeSanitizer {
    static sanitize(dirtyAttrs) {
        var cleanAttrs = {};
        if (!dirtyAttrs || typeof dirtyAttrs !== 'object') {
            return cleanAttrs;
        }
        let booleanAttrs = [
            'bold', 'italic', 'underline', 'strike', 'code',
            'blockquote', 'code-block', 'renderAsBlock'
        ];
        let colorAttrs = ['background', 'color'];
        let { font, size, link, script, list, header, align, direction, indent, mentions, mention, width, target } = dirtyAttrs;
        let sanitizedAttrs = [...booleanAttrs, ...colorAttrs,
            'font', 'size', 'link', 'script', 'list', 'header', 'align',
            'direction', 'indent', 'mentions', 'mention', 'width'
        ];
        booleanAttrs.forEach(function (prop) {
            var v = dirtyAttrs[prop];
            if (v) {
                cleanAttrs[prop] = !!v;
            }
        });
        colorAttrs.forEach(function (prop) {
            var val = dirtyAttrs[prop];
            if (val && (OpAttributeSanitizer.IsValidHexColor(val + '') ||
                OpAttributeSanitizer.IsValidColorLiteral(val + '') ||
                OpAttributeSanitizer.IsValidRGBColor(val + ''))) {
                cleanAttrs[prop] = val;
            }
        });
        if (font && OpAttributeSanitizer.IsValidFontName(font + '')) {
            cleanAttrs.font = font;
        }
        if (size && OpAttributeSanitizer.IsValidSize(size + '')) {
            cleanAttrs.size = size;
        }
        if (width && OpAttributeSanitizer.IsValidWidth(width + '')) {
            cleanAttrs.width = width;
        }
        if (link) {
            cleanAttrs.link = url.sanitize(link + '');
        }
        if (target && OpAttributeSanitizer.isValidTarget(target)) {
            cleanAttrs.target = target;
        }
        if (script === ScriptType.Sub || ScriptType.Super === script) {
            cleanAttrs.script = script;
        }
        if (list === ListType.Bullet || list === ListType.Ordered || list === ListType.Checked || list === ListType.Unchecked) {
            cleanAttrs.list = list;
        }
        if (Number(header)) {
            cleanAttrs.header = Math.min(Number(header), 6);
        }
        if (align === AlignType.Center || align === AlignType.Right || align === AlignType.Justify) {
            cleanAttrs.align = align;
        }
        if (direction === DirectionType.Rtl) {
            cleanAttrs.direction = direction;
        }
        if (indent && Number(indent)) {
            cleanAttrs.indent = Math.min(Number(indent), 30);
        }
        if (mentions && mention) {
            let sanitizedMention = MentionSanitizer.sanitize(mention);
            if (Object.keys(sanitizedMention).length > 0) {
                cleanAttrs.mentions = !!mentions;
                cleanAttrs.mention = mention;
            }
        }
        return Object.keys(dirtyAttrs).reduce((cleaned, k) => {
            // this is a custom attr, put it back
            if (sanitizedAttrs.indexOf(k) === -1) {
                cleaned[k] = dirtyAttrs[k];
            }
            ;
            return cleaned;
        }, cleanAttrs);
    }
    static IsValidHexColor(colorStr) {
        return !!colorStr.match(/^#([0-9A-F]{6}|[0-9A-F]{3})$/i);
    }
    static IsValidColorLiteral(colorStr) {
        return !!colorStr.match(/^[a-z]{1,50}$/i);
    }
    static IsValidRGBColor(colorStr) {
        const re = /^rgb\(((0|25[0-5]|2[0-4]\d|1\d\d|0?\d?\d),\s*){2}(0|25[0-5]|2[0-4]\d|1\d\d|0?\d?\d)\)$/i;
        return !!colorStr.match(re);
    }
    static IsValidFontName(fontName) {
        return !!fontName.match(/^[a-z\s0-9\- ]{1,30}$/i);
    }
    static IsValidSize(size) {
        return !!size.match(/^[a-z0-9\-]{1,20}$/i);
    }
    static IsValidWidth(width) {
        return !!width.match(/^[0-9]*(px|em|%)?$/);
    }
    static isValidTarget(target) {
        return !!target.match(/^[_a-zA-Z0-9\-]{1,50}$/);
    }
}
class OpToHtmlConverter {
    constructor(op, options) {
        this.op = op;
        this.options = obj.assign({}, {
            classPrefix: 'ql',
            inlineStyles: undefined,
            encodeHtml: true,
            listItemTag: 'li',
            paragraphTag: 'p'
        }, options);
    }
    prefixClass(className) {
        if (!this.options.classPrefix) {
            return className + '';
        }
        return this.options.classPrefix + '-' + className;
    }
    getHtml() {
        var parts = this.getHtmlParts();
        return parts.openingTag + parts.content + parts.closingTag;
    }
    getHtmlParts() {
        if (this.op.isJustNewline() && !this.op.isContainerBlock()) {
            return { openingTag: '', closingTag: '', content: NewLine };
        }
        let tags = this.getTags(), attrs = this.getTagAttributes();
        if (!tags.length && attrs.length) {
            tags.push('span');
        }
        let beginTags = [], endTags = [];
        for (var tag of tags) {
            beginTags.push(makeStartTag(tag, attrs));
            endTags.push(tag === 'img' ? '' : makeEndTag(tag));
            // consumed in first tag
            attrs = [];
        }
        endTags.reverse();
        return {
            openingTag: beginTags.join(''),
            content: this.getContent(),
            closingTag: endTags.join('')
        };
    }
    getContent() {
        if (this.op.isContainerBlock()) {
            return '';
        }
        if (this.op.isMentions()) {
            return this.op.insert.value;
        }
        var content = this.op.isFormula() || this.op.isText() ? this.op.insert.value : '';
        return this.options.encodeHtml && encodeHtml(content) || content;
    }
    getCssClasses() {
        var attrs = this.op.attributes;
        if (this.options.inlineStyles) {
            return [];
        }
        var propsArr = ['indent', 'align', 'direction', 'font', 'size'];
        if (this.options.allowBackgroundClasses) {
            propsArr.push('background');
        }
        return propsArr
            .filter((prop) => !!attrs[prop])
            .filter((prop) => prop === 'background' ? OpAttributeSanitizer.IsValidColorLiteral(attrs[prop]) : true)
            .map((prop) => prop + '-' + attrs[prop])
            .concat(this.op.isFormula() ? 'formula' : [])
            .concat(this.op.isVideo() ? 'video' : [])
            .concat(this.op.isImage() ? 'image' : [])
            .map(this.prefixClass.bind(this));
    }
    getCssStyles() {
        var attrs = this.op.attributes;
        var propsArr = [['color'], ['size'], ['lineheight'], ['fontFamily']];
        if (!!this.options.inlineStyles || !this.options.allowBackgroundClasses) {
            propsArr.push(['background', 'background-color']);
        }
        if (this.options.inlineStyles) {
            propsArr = propsArr.concat([
                ['indent'],
                ['align', 'text-align'],
                ['direction'],
                ['font', 'font-family'],
            ]);
        }
        return propsArr
            .filter((item) => !!attrs[item[0]])
            .map((item) => {
            let attribute = item[0];
            let attrValue = attrs[attribute];
            let attributeConverter = (this.options.inlineStyles && this.options.inlineStyles[attribute]) ||
                DEFAULT_INLINE_STYLES[attribute];
            if (typeof (attributeConverter) === 'object') {
                return attributeConverter[attrValue];
            }
            else if (typeof (attributeConverter) === 'function') {
                var converterFn = attributeConverter;
                return converterFn(attrValue, this.op);
            }
            else {
                return arr.preferSecond(item) + ':' + attrValue;
            }
        })
            .filter((item) => item !== undefined);
    }
    getTagAttributes() {
        if (this.op.attributes.code && !this.op.isLink()) {
            return [];
        }
        const makeAttr = (k, v) => ({ key: k, value: v });
        var classes = this.getCssClasses();
        var tagAttrs = classes.length ? [makeAttr('class', classes.join(' '))] : [];
        if (this.op.isImage()) {
            const {width, alt} = this.op.attributes;

            if (width) {
                tagAttrs = tagAttrs.concat(makeAttr('width', width));
            }
            if (alt || alt === '') {
                tagAttrs = tagAttrs.concat(makeAttr('alt', alt));
            }
            return tagAttrs.concat(makeAttr('src', url.sanitize(this.op.insert.value + '') + ''));
        }
        if (this.op.isACheckList()) {
            return tagAttrs.concat(makeAttr('data-checked', this.op.isCheckedList() ? 'true' : 'false'));
        }
        if (this.op.isFormula()) {
            return tagAttrs;
        }
        if (this.op.isVideo()) {
            return tagAttrs.concat(makeAttr('frameborder', '0'), makeAttr('allowfullscreen', 'true'), makeAttr('src', url.sanitize(this.op.insert.value + '') + ''));
        }
        if (this.op.isMentions()) {
            var mention = this.op.attributes.mention;
            if (mention.class) {
                tagAttrs = tagAttrs.concat(makeAttr('class', mention.class));
            }
            if (mention['end-point'] && mention.slug) {
                tagAttrs = tagAttrs.concat(makeAttr('href', url.encodeLink(mention['end-point'] + '/' + mention.slug)));
            }
            else {
                tagAttrs = tagAttrs.concat(makeAttr('href', 'about:blank'));
            }
            if (mention.target) {
                tagAttrs = tagAttrs.concat(makeAttr('target', mention.target));
            }
            return tagAttrs;
        }
        var styles = this.getCssStyles();
        if (styles.length) {
            tagAttrs.push(makeAttr('style', styles.join(';')));
        }
        if (this.op.isContainerBlock()) {
            return tagAttrs;
        }
        if (this.op.isLink()) {
            let target = this.op.attributes.target || this.options.linkTarget;
            tagAttrs = tagAttrs
                .concat(makeAttr('href', url.encodeLink(this.op.attributes.link)))
                .concat(target ? makeAttr('target', target) : []);
            if (!!this.options.linkRel && OpToHtmlConverter.IsValidRel(this.options.linkRel)) {
                tagAttrs.push(makeAttr('rel', this.options.linkRel));
            }
        }
        return tagAttrs;
    }
    getTags() {
        var attrs = this.op.attributes;
        // embeds
        if (!this.op.isText()) {
            return [this.op.isVideo() ? 'iframe'
                    : this.op.isImage() ? 'img'
                        : 'span' // formula
            ];
        }
        // blocks
        var positionTag = this.options.paragraphTag || 'p';
        var blocks = [['blockquote'], ['code-block', 'pre'],
            ['list', this.options.listItemTag], ['header'],
            ['align', positionTag], ['direction', positionTag],
            ['indent', positionTag]];
        for (var item of blocks) {
            var firstItem = item[0];
            if (attrs[firstItem]) {
                return firstItem === 'header' ? ['h' + attrs[firstItem]] : [arr.preferSecond(item)];
            }
        }
        // inlines
        return [['link', 'a'], ['mentions', 'a'], ['script'],
            ['bold', 'strong'], ['italic', 'em'], ['strike', 's'], ['underline', 'u'],
            ['code']]
            .filter((item) => !!attrs[item[0]])
            .map((item) => {
            return item[0] === 'script' ?
                (attrs[item[0]] === ScriptType.Sub ? 'sub' : 'sup')
                : arr.preferSecond(item);
        });
    }
    static IsValidRel(relStr) {
        return !!relStr.match(/^[a-z\s]{1,50}$/i);
    }
}
/**
* Returns consecutive list of elements satisfying the predicate starting from startIndex
* and traversing the array in reverse order.
*/
function sliceFromReverseWhile(arr, startIndex, predicate) {
    var result = {
        elements: [],
        sliceStartsAt: -1
    };
    for (var i = startIndex; i >= 0; i--) {
        if (!predicate(arr[i])) {
            break;
        }
        result.sliceStartsAt = i;
        result.elements.unshift(arr[i]);
    }
    return result;
}
;
class Grouper {
    static pairOpsWithTheirBlock(ops) {
        let result = [];
        const canBeInBlock = (op) => {
            return !(op.isJustNewline() || op.isCustomBlock() || op.isVideo() || op.isContainerBlock());
        };
        const isInlineData = (op) => op.isInline();
        let lastInd = ops.length - 1;
        let opsSlice;
        for (var i = lastInd; i >= 0; i--) {
            let op = ops[i];
            if (op.isVideo()) {
                result.push(new VideoItem(op));
            }
            else if (op.isCustomBlock()) {
                result.push(new BlotBlock(op));
            }
            else if (op.isContainerBlock()) {
                opsSlice = sliceFromReverseWhile(ops, i - 1, canBeInBlock);
                result.push(new BlockGroup(op, opsSlice.elements));
                i = opsSlice.sliceStartsAt > -1 ? opsSlice.sliceStartsAt : i;
            }
            else {
                opsSlice = sliceFromReverseWhile(ops, i - 1, isInlineData);
                result.push(new InlineGroup(opsSlice.elements.concat(op)));
                i = opsSlice.sliceStartsAt > -1 ? opsSlice.sliceStartsAt : i;
            }
        }
        result.reverse();
        return result;
    }
    static groupConsecutiveSameStyleBlocks(groups, blocksOf = {
        header: true,
        codeBlocks: true,
        blockquotes: true
    }) {
        return groupConsecutiveElementsWhile(groups, (g, gPrev) => {
            if (!(g instanceof BlockGroup) || !(gPrev instanceof BlockGroup)) {
                return false;
            }
            return blocksOf.codeBlocks && Grouper.areBothCodeblocks(g, gPrev)
                || blocksOf.blockquotes && Grouper.areBothBlockquotesWithSameAdi(g, gPrev)
                || blocksOf.header && Grouper.areBothSameHeadersWithSameAdi(g, gPrev);
        });
    }
    // Moves all ops of same style consecutive blocks to the ops of first block
    // and discards the rest.
    static reduceConsecutiveSameStyleBlocksToOne(groups) {
        var newLineOp = DeltaInsertOp.createNewLineOp();
        return groups.map(function (elm) {
            if (!Array.isArray(elm)) {
                if (elm instanceof BlockGroup && !elm.ops.length) {
                    elm.ops.push(newLineOp);
                }
                return elm;
            }
            var groupsLastInd = elm.length - 1;
            elm[0].ops = flatten(elm.map((g, i) => {
                if (!g.ops.length) {
                    return [newLineOp];
                }
                return g.ops.concat(i < groupsLastInd ? [newLineOp] : []);
            }));
            return elm[0];
        });
    }
    static areBothCodeblocks(g1, gOther) {
        return g1.op.isCodeBlock() && gOther.op.isCodeBlock();
    }
    static areBothSameHeadersWithSameAdi(g1, gOther) {
        return g1.op.isSameHeaderAs(gOther.op) && g1.op.hasSameAdiAs(gOther.op);
    }
    static areBothBlockquotesWithSameAdi(g, gOther) {
        return g.op.isBlockquote() && gOther.op.isBlockquote()
            && g.op.hasSameAdiAs(gOther.op);
    }
}
class DeltaInsertOp {
    constructor(insertVal, attrs) {
        if (typeof insertVal === 'string') {
            insertVal = new InsertDataQuill(DataType.Text, insertVal + '');
        }
        this.insert = insertVal;
        this.attributes = attrs || {};
    }
    static createNewLineOp() {
        return new DeltaInsertOp(NewLine);
    }
    isContainerBlock() {
        var attrs = this.attributes;
        return !!(attrs.blockquote || attrs.list || attrs['code-block'] ||
            attrs.header || attrs.align || attrs.direction || attrs.indent);
    }
    isBlockquote() {
        return !!this.attributes.blockquote;
    }
    isHeader() {
        return !!this.attributes.header;
    }
    isSameHeaderAs(op) {
        return op.attributes.header === this.attributes.header && this.isHeader();
    }
    // adi: alignment direction indentation
    hasSameAdiAs(op) {
        return this.attributes.align === op.attributes.align
            && this.attributes.direction === op.attributes.direction
            && this.attributes.indent === op.attributes.indent;
    }
    hasSameIndentationAs(op) {
        return this.attributes.indent === op.attributes.indent;
    }
    hasHigherIndentThan(op) {
        return (Number(this.attributes.indent) || 0) > (Number(op.attributes.indent) || 0);
    }
    isInline() {
        return !(this.isContainerBlock() || this.isVideo() || this.isCustomBlock());
    }
    isCodeBlock() {
        return !!this.attributes['code-block'];
    }
    isJustNewline() {
        return this.insert.value === NewLine;
    }
    isList() {
        return (this.isOrderedList() ||
            this.isBulletList() ||
            this.isCheckedList() ||
            this.isUncheckedList());
    }
    isOrderedList() {
        return this.attributes.list === ListType.Ordered;
    }
    isBulletList() {
        return this.attributes.list === ListType.Bullet;
    }
    isCheckedList() {
        return this.attributes.list === ListType.Checked;
    }
    isUncheckedList() {
        return this.attributes.list === ListType.Unchecked;
    }
    isACheckList() {
        return this.attributes.list == ListType.Unchecked ||
            this.attributes.list === ListType.Checked;
    }
    isSameListAs(op) {
        return !!op.attributes.list && (this.attributes.list === op.attributes.list ||
            op.isACheckList() && this.isACheckList());
    }
    isText() {
        return this.insert.type === DataType.Text;
    }
    isImage() {
        return this.insert.type === DataType.Image;
    }
    isFormula() {
        return this.insert.type === DataType.Formula;
    }
    isVideo() {
        return this.insert.type === DataType.Video;
    }
    isLink() {
        return this.isText() && !!this.attributes.link;
    }
    isCustom() {
        return this.insert instanceof InsertDataCustom;
    }
    isCustomBlock() {
        return this.isCustom() && !!this.attributes.renderAsBlock;
    }
    isMentions() {
        return this.isText() && !!this.attributes.mentions;
    }
}
class InlineGroup {
    constructor(ops) {
        this.ops = ops;
    }
}
class SingleItem {
    constructor(op) {
        this.op = op;
    }
}
class VideoItem extends SingleItem {
}
;
class BlotBlock extends SingleItem {
}
;
class BlockGroup {
    constructor(op, ops) {
        this.op = op;
        this.ops = ops;
    }
}
class ListGroup {
    constructor(items) {
        this.items = items;
    }
}
class ListItem {
    constructor(item, innerList = null) {
        this.item = item;
        this.innerList = innerList;
    }
}
/**
* Returns a new array by putting consecutive elements satisfying predicate into a new
* array and returning others as they are.
* Ex: [1, "ha", 3, "ha", "ha"] => [1, "ha", 3, ["ha", "ha"]]
*      where predicate: (v, vprev) => typeof v === typeof vPrev
*/
function groupConsecutiveElementsWhile(arr, predicate) {
    var groups = [];
    var currElm, currGroup;
    for (var i = 0; i < arr.length; i++) {
        currElm = arr[i];
        if (i > 0 && predicate(currElm, arr[i - 1])) {
            currGroup = groups[groups.length - 1];
            currGroup.push(currElm);
        }
        else {
            groups.push([currElm]);
        }
    }
    return groups.map((g) => g.length === 1 ? g[0] : g);
}
;
function flatten(arr) {
    return arr.reduce((pv, v) => {
        return pv.concat(Array.isArray(v) ? flatten(v) : v);
    }, []);
}
;
class ListNester {
    nest(groups) {
        var listBlocked = this.convertListBlocksToListGroups(groups);
        var groupedByListGroups = this.groupConsecutiveListGroups(listBlocked);
        // convert grouped ones into listgroup
        var nested = flatten(groupedByListGroups.map((group) => {
            if (!Array.isArray(group)) {
                return group;
            }
            return this.nestListSection(group);
        }));
        var groupRootLists = groupConsecutiveElementsWhile(nested, (curr, prev) => {
            if (!(curr instanceof ListGroup && prev instanceof ListGroup)) {
                return false;
            }
            return curr.items[0].item.op.isSameListAs(prev.items[0].item.op);
        });
        return groupRootLists.map((v) => {
            if (!Array.isArray(v)) {
                return v;
            }
            var litems = v.map((g) => g.items);
            return new ListGroup(flatten(litems));
        });
    }
    convertListBlocksToListGroups(items) {
        var grouped = groupConsecutiveElementsWhile(items, (g, gPrev) => {
            return g instanceof BlockGroup && gPrev instanceof BlockGroup
                && g.op.isList() && gPrev.op.isList() && g.op.isSameListAs(gPrev.op)
                && g.op.hasSameIndentationAs(gPrev.op);
        });
        return grouped.map((item) => {
            if (!Array.isArray(item)) {
                if (item instanceof BlockGroup && item.op.isList()) {
                    return new ListGroup([new ListItem(item)]);
                }
                return item;
            }
            return new ListGroup(item.map((g) => new ListItem(g)));
        });
    }
    groupConsecutiveListGroups(items) {
        return groupConsecutiveElementsWhile(items, (curr, prev) => {
            return curr instanceof ListGroup && prev instanceof ListGroup;
        });
    }
    nestListSection(sectionItems) {
        var indentGroups = this.groupByIndent(sectionItems);
        Object.keys(indentGroups).map(Number).sort().reverse().forEach((indent) => {
            indentGroups[indent].forEach((lg) => {
                var idx = sectionItems.indexOf(lg);
                if (this.placeUnderParent(lg, sectionItems.slice(0, idx))) {
                    sectionItems.splice(idx, 1);
                }
            });
        });
        return sectionItems;
    }
    groupByIndent(items) {
        return items.reduce((pv, cv) => {
            var indent = cv.items[0].item.op.attributes.indent;
            if (indent) {
                pv[indent] = pv[indent] || [];
                pv[indent].push(cv);
            }
            return pv;
        }, {});
    }
    placeUnderParent(target, items) {
        for (var i = items.length - 1; i >= 0; i--) {
            var elm = items[i];
            if (target.items[0].item.op.hasHigherIndentThan(elm.items[0].item.op)) {
                var parent = elm.items[elm.items.length - 1];
                if (parent.innerList) {
                    parent.innerList.items = parent.innerList.items.concat(target.items);
                }
                else {
                    parent.innerList = target;
                }
                return true;
            }
        }
        return false;
    }
}
var EncodeTarget;
(function (EncodeTarget) {
    EncodeTarget[EncodeTarget["Html"] = 0] = "Html";
    EncodeTarget[EncodeTarget["Url"] = 1] = "Url";
})(EncodeTarget || (EncodeTarget = {}));
function encodeMapping(str, mapping) {
    return str.replace(new RegExp(mapping[0], 'g'), mapping[1]);
}
function decodeMapping(str, mapping) {
    return str.replace(new RegExp(mapping[1], 'g'), mapping[0].replace('\\', ''));
}
function encodeMappings(mtype) {
    let maps = [
        ['&', '&amp;'],
        ['<', '&lt;'],
        ['>', '&gt;'],
        ['"', '&quot;'],
        ["'", "&#x27;"],
        ['\\/', '&#x2F;'],
        ['\\(', '&#40;'],
        ['\\)', '&#41;']
    ];
    if (mtype === EncodeTarget.Html) {
        return maps.filter(([v, _]) => v.indexOf('(') === -1 && v.indexOf(')') === -1);
    }
    else { // for url
        return maps.filter(([v, _]) => v.indexOf('/') === -1);
    }
}
function decodeHtml(str) {
    return encodeMappings(EncodeTarget.Html).reduce(decodeMapping, str);
}
function makeStartTag(tag, attrs = undefined) {
    if (!tag) {
        return '';
    }
    var attrsStr = '';
    if (attrs) {
        var arrAttrs = [].concat(attrs);
        attrsStr = arrAttrs.map(function (attr) {
            return attr.key + (attr.value ? '="' + attr.value + '"' : '');
        }).join(' ');
    }
    var closing = '>';
    if (tag === 'img' || tag === 'br') {
        closing = '/>';
    }
    return attrsStr ? `<${tag} ${attrsStr}${closing}` : `<${tag}${closing}`;
}
function makeEndTag(tag = '') {
    return tag && `</${tag}>` || '';
}
function encodeHtml(str, preventDoubleEncoding = true) {
    if (preventDoubleEncoding) {
        str = decodeHtml(str);
    }
    return encodeMappings(EncodeTarget.Html).reduce(encodeMapping, str);
}
const obj = {
    assign(target, ...sources /*, one or more source objects */) {
        // TypeError if undefined or null
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 0; index < sources.length; index++) {
            var nextSource = sources[index];
            if (nextSource != null) { // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    }
};
var GroupType;
(function (GroupType) {
    GroupType["Block"] = "block";
    GroupType["InlineGroup"] = "inline-group";
    GroupType["List"] = "list";
    GroupType["Video"] = "video";
})(GroupType || (GroupType = {}));
;
const BrTag = '<br/>';
class QuillDeltaToHtmlConverter {
    constructor(deltaOps, options) {
        this.rawDeltaOps = [];
        // render callbacks
        this.callbacks = {};
        this.options = obj.assign({
            paragraphTag: 'p',
            encodeHtml: true,
            classPrefix: 'ql',
            inlineStyles: false,
            multiLineBlockquote: true,
            multiLineHeader: true,
            multiLineCodeblock: true,
            multiLineParagraph: true,
            allowBackgroundClasses: false,
            linkTarget: '_blank'
        }, options, {
            orderedListTag: 'ol',
            bulletListTag: 'ul',
            listItemTag: 'li'
        });
        var inlineStyles;
        if (!this.options.inlineStyles) {
            inlineStyles = undefined;
        }
        else if (typeof (this.options.inlineStyles) === 'object') {
            inlineStyles = this.options.inlineStyles;
        }
        else {
            inlineStyles = {};
        }
        this.converterOptions = {
            encodeHtml: this.options.encodeHtml,
            classPrefix: this.options.classPrefix,
            inlineStyles: inlineStyles,
            listItemTag: this.options.listItemTag,
            paragraphTag: this.options.paragraphTag,
            linkRel: this.options.linkRel,
            linkTarget: this.options.linkTarget,
            allowBackgroundClasses: this.options.allowBackgroundClasses
        };
        this.rawDeltaOps = deltaOps;
    }
    _getListTag(op) {
        return op.isOrderedList() ? this.options.orderedListTag + ''
            : op.isBulletList() ? this.options.bulletListTag + ''
                : op.isCheckedList() ? this.options.bulletListTag + ''
                    : op.isUncheckedList() ? this.options.bulletListTag + ''
                        : '';
    }
    getGroupedOps() {
        var deltaOps = InsertOpsConverter.convert(this.rawDeltaOps);
        var pairedOps = Grouper.pairOpsWithTheirBlock(deltaOps);
        var groupedSameStyleBlocks = Grouper.groupConsecutiveSameStyleBlocks(pairedOps, {
            blockquotes: !!this.options.multiLineBlockquote,
            header: !!this.options.multiLineHeader,
            codeBlocks: !!this.options.multiLineCodeblock
        });
        var groupedOps = Grouper.reduceConsecutiveSameStyleBlocksToOne(groupedSameStyleBlocks);
        var listNester = new ListNester();
        return listNester.nest(groupedOps);
    }
    convert() {
        let groups = this.getGroupedOps();
        return groups.map((group) => {
            if (group instanceof ListGroup) {
                return this._renderWithCallbacks(GroupType.List, group, () => this._renderList(group));
            }
            else if (group instanceof BlockGroup) {
                var g = group;
                return this._renderWithCallbacks(GroupType.Block, group, () => this._renderBlock(g.op, g.ops));
            }
            else if (group instanceof BlotBlock) {
                return this._renderCustom(group.op, null);
            }
            else if (group instanceof VideoItem) {
                return this._renderWithCallbacks(GroupType.Video, group, () => {
                    var g = group;
                    var converter = new OpToHtmlConverter(g.op, this.converterOptions);
                    return converter.getHtml();
                });
            }
            else { // InlineGroup
                return this._renderWithCallbacks(GroupType.InlineGroup, group, () => {
                    return this._renderInlines(group.ops, true);
                });
            }
        })
            .join("");
    }
    _renderWithCallbacks(groupType, group, myRenderFn) {
        var html = '';
        var beforeCb = this.callbacks['beforeRender_cb'];
        html = typeof beforeCb === 'function' ? beforeCb.apply(null, [groupType, group]) : '';
        if (!html) {
            html = myRenderFn();
        }
        var afterCb = this.callbacks['afterRender_cb'];
        html = typeof afterCb === 'function' ? afterCb.apply(null, [groupType, html]) : html;
        return html;
    }
    _renderList(list) {
        var firstItem = list.items[0];
        return makeStartTag(this._getListTag(firstItem.item.op))
            + list.items.map((li) => this._renderListItem(li)).join('')
            + makeEndTag(this._getListTag(firstItem.item.op));
    }
    _renderListItem(li) {
        //if (!isOuterMost) {
        li.item.op.attributes.indent = 0;
        //}
        var converter = new OpToHtmlConverter(li.item.op, this.converterOptions);
        var parts = converter.getHtmlParts();
        var liElementsHtml = this._renderInlines(li.item.ops, false);
        return parts.openingTag + (liElementsHtml) +
            (li.innerList ? this._renderList(li.innerList) : '')
            + parts.closingTag;
    }
    _renderBlock(bop, ops) {
        var converter = new OpToHtmlConverter(bop, this.converterOptions);
        var htmlParts = converter.getHtmlParts();
        if (bop.isCodeBlock()) {
            return htmlParts.openingTag +
                encodeHtml(ops.map((iop) => iop.isCustom() ? this._renderCustom(iop, bop) : iop.insert.value).join(""))
                + htmlParts.closingTag;
        }
        var inlines = ops.map(op => this._renderInline(op, bop)).join('');
        return htmlParts.openingTag + (inlines || BrTag) + htmlParts.closingTag;
    }
    _renderInlines(ops, isInlineGroup = true) {
        var opsLen = ops.length - 1;
        var html = ops.map((op, i) => {
            if (i > 0 && i === opsLen && op.isJustNewline()) {
                return '';
            }
            return this._renderInline(op, null);
        }).join('');
        if (!isInlineGroup) {
            return html;
        }
        let startParaTag = makeStartTag(this.options.paragraphTag);
        let endParaTag = makeEndTag(this.options.paragraphTag);
        if (html === BrTag || this.options.multiLineParagraph) {
            return startParaTag + html + endParaTag;
        }
        return startParaTag + html.split(BrTag).map((v) => {
            return v === '' ? BrTag : v;
        }).join(endParaTag + startParaTag) + endParaTag;
    }
    _renderInline(op, contextOp) {
        if (op.isCustom()) {
            return this._renderCustom(op, contextOp);
        }
        var converter = new OpToHtmlConverter(op, this.converterOptions);
        return converter.getHtml().replace(/\n/g, BrTag);
    }
    _renderCustom(op, contextOp) {
        var renderCb = this.callbacks['renderCustomOp_cb'];
        if (typeof renderCb === 'function') {
            return renderCb.apply(null, [op, contextOp]);
        }
        return "";
    }
    beforeRender(cb) {
        if (typeof cb === 'function') {
            this.callbacks['beforeRender_cb'] = cb;
        }
    }
    afterRender(cb) {
        if (typeof cb === 'function') {
            this.callbacks['afterRender_cb'] = cb;
        }
    }
    renderCustomWith(cb) {
        this.callbacks['renderCustomOp_cb'] = cb;
    }
}
exports.QuillDeltaToHtmlConverter = QuillDeltaToHtmlConverter;