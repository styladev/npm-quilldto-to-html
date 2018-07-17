// Generated by dts-bundle v0.7.3

interface IMention {
    [index: string]: string;
    'name'?: string;
    'target'?: string;
    'slug'?: string;
    'class'?: string;
    'avatar'?: string;
    'id'?: string;
    'end-point'?: string;
}

declare class MentionSanitizer {
    static sanitize(dirtyObj: IMention): IMention;
    static IsValidClass(classAttr: string): boolean;
    static IsValidId(idAttr: string): boolean;
    static IsValidTarget(target: string): boolean;
}

declare class InsertDataQuill {
    readonly type: DataType;
    readonly value: string;
    constructor(type: DataType, value: string);
}
declare class InsertDataCustom {
    readonly type: string;
    readonly value: any;
    constructor(type: string, value: any);
}

type InsertData = InsertDataCustom | InsertDataQuill;

interface IOpAttributes {
    background?: string;
    color?: string;
    font?: string;
    size?: string;
    width?: string;
    link?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    script?: ScriptType;
    code?: boolean;
    list?: ListType;
    blockquote?: boolean;
    'code-block'?: boolean;
    header?: number;
    align?: AlignType;
    direction?: DirectionType;
    indent?: number;
    mentions?: boolean;
    mention?: IMention;
    target?: string;
}

declare class OpAttributeSanitizer {
    static sanitize(dirtyAttrs: IOpAttributes): IOpAttributes;
    static IsValidHexColor(colorStr: string): boolean;
    static IsValidColorLiteral(colorStr: string): boolean;
    static IsValidFontName(fontName: string): boolean;
    static IsValidSize(size: string): boolean;
    static IsValidWidth(width: string): boolean;
    static isValidTarget(target: string): boolean;
}

declare type NewLine = "\n";
declare const NewLine: "\n";

declare enum ListType {
    Ordered = "ordered",
    Bullet = "bullet"
}

declare enum ScriptType {
    Sub = "sub",
    Super = "super"
}

declare enum DirectionType {
    Rtl = "rtl"
}

declare enum AlignType {
    Center = "center",
    Right = "right"
}

declare enum DataType {
    Image = "image",
    Video = "video",
    Formula = "formula",
    Text = "text"
}

declare enum GroupType {
    Block = "block",
    InlineGroup = "inline-group",
    List = "list",
    Video = "video"
}


declare class InlineGroup {
    readonly ops: DeltaInsertOp[];
    constructor(ops: DeltaInsertOp[]);
}

declare class VideoItem {
    readonly op: DeltaInsertOp;
    constructor(op: DeltaInsertOp);
}

declare class BlockGroup {
    readonly op: DeltaInsertOp;
    ops: DeltaInsertOp[];
    constructor(op: DeltaInsertOp, ops: DeltaInsertOp[]);
}

declare class ListGroup {
    items: ListItem[];
    constructor(items: ListItem[]);
}

declare class ListItem {
    readonly item: BlockGroup;
    innerList: ListGroup;
    constructor(item: BlockGroup, innerList?: ListGroup);
}

type TDataGroup = VideoItem | InlineGroup | BlockGroup | ListItem | ListGroup;

declare class DeltaInsertOp {
    readonly insert: InsertData;
    readonly attributes: IOpAttributes;
    constructor(insertVal: InsertData | string, attributes?: IOpAttributes);
    static createNewLineOp(): DeltaInsertOp;
    isContainerBlock(): boolean;
    isBlockquote(): boolean;
    isHeader(): boolean;
    isSameHeaderAs(op: DeltaInsertOp): boolean;
    hasSameAdiAs(op: DeltaInsertOp): boolean;
    hasSameIndentationAs(op: DeltaInsertOp): boolean;
    hasHigherIndentThan(op: DeltaInsertOp): boolean;
    isInline(): boolean;
    isCodeBlock(): boolean;
    isJustNewline(): boolean;
    isList(): boolean;
    isOrderedList(): boolean;
    isBulletList(): boolean;
    isSameListAs(op: DeltaInsertOp): boolean;
    isText(): boolean;
    isImage(): boolean;
    isFormula(): boolean;
    isVideo(): boolean;
    isLink(): boolean;
    isCustom(): boolean;
    isMentions(): boolean;
}

declare interface IQuillDeltaToHtmlConverterOptions {
    orderedListTag?: string;
    bulletListTag?: string;
    listItemTag?: string;
    paragraphTag?: string;
    classPrefix?: string;
    encodeHtml?: boolean;
    multiLineBlockquote?: boolean;
    multiLineHeader?: boolean;
    multiLineCodeblock?: boolean;
    linkRel?: string;
    linkTarget?: string;
    allowBackgroundClasses?: boolean;
}

export declare class QuillDeltaToHtmlConverter {
    constructor(deltaOps: any[], options?: IQuillDeltaToHtmlConverterOptions);
    _getListTag(op: DeltaInsertOp): string;
    getGroupedOps(): TDataGroup[];
    convert(): string;
    _renderWithCallbacks(groupType: GroupType, group: TDataGroup, myRenderFn: () => string): string;
    _renderList(list: ListGroup, isOuterMost?: boolean): string;
    _renderListItem(li: ListItem, isOuterMost: boolean): string;
    _renderBlock(bop: DeltaInsertOp, ops: DeltaInsertOp[]): string;
    _renderInlines(ops: DeltaInsertOp[], wrapInParagraphTag?: boolean): string;
    _renderInline(op: DeltaInsertOp, contextOp: DeltaInsertOp): any;
    _renderCustom(op: DeltaInsertOp, contextOp: DeltaInsertOp): any;
    beforeRender(cb: (group: GroupType, data: TDataGroup) => string): void;
    afterRender(cb: (group: GroupType, html: string) => string): void;
    renderCustomWith(cb: (op: DeltaInsertOp, contextOp: DeltaInsertOp) => string): void;
}
