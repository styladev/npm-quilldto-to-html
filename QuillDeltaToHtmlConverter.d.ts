declare enum ListType {
    Ordered = "ordered",
    Bullet = "bullet",
    Checked = "checked",
    Unchecked = "unchecked"
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
    Right = "right",
    Justify = "justify"
}
declare enum DataType {
    Image = "image",
    Video = "video",
    Formula = "formula",
    Text = "text"
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
declare type InsertData = InsertDataCustom | InsertDataQuill;
declare type InlineStyleType = ((value: string, op: DeltaInsertOp) => string | undefined) | {
    [x: string]: string;
};
interface IInlineStyles {
    indent?: InlineStyleType;
    align?: InlineStyleType;
    direction?: InlineStyleType;
    font?: InlineStyleType;
    size?: InlineStyleType;
}
interface IOpAttributes {
    background?: string | undefined;
    color?: string | undefined;
    font?: string | undefined;
    size?: string | undefined;
    width?: string | undefined;
    link?: string | undefined;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underline?: boolean | undefined;
    strike?: boolean | undefined;
    script?: ScriptType;
    code?: boolean | undefined;
    list?: ListType;
    blockquote?: boolean | undefined;
    'code-block'?: boolean | undefined;
    header?: number | undefined;
    align?: AlignType;
    direction?: DirectionType;
    indent?: number | undefined;
    mentions?: boolean | undefined;
    mention?: IMention | undefined;
    target?: string | undefined;
    renderAsBlock?: boolean | undefined;
}
interface IMention {
    [index: string]: string | undefined;
    'name'?: string;
    'target'?: string;
    'slug'?: string;
    'class'?: string;
    'avatar'?: string;
    'id'?: string;
    'end-point'?: string;
}
declare class DeltaInsertOp {
    readonly insert: InsertData;
    readonly attributes: IOpAttributes;
    constructor(insertVal: InsertData | string, attrs?: IOpAttributes);
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
    isCheckedList(): boolean;
    isUncheckedList(): boolean;
    isACheckList(): boolean;
    isSameListAs(op: DeltaInsertOp): boolean;
    isText(): boolean;
    isImage(): boolean;
    isFormula(): boolean;
    isVideo(): boolean;
    isLink(): boolean;
    isCustom(): boolean;
    isCustomBlock(): boolean;
    isMentions(): boolean;
}
declare class InlineGroup {
    readonly ops: DeltaInsertOp[];
    constructor(ops: DeltaInsertOp[]);
}
declare class SingleItem {
    readonly op: DeltaInsertOp;
    constructor(op: DeltaInsertOp);
}
declare class VideoItem extends SingleItem {
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
    innerList: ListGroup | null;
    constructor(item: BlockGroup, innerList?: ListGroup | null);
}
declare type TDataGroup = VideoItem | InlineGroup | BlockGroup | ListItem | ListGroup;
declare enum GroupType {
    Block = "block",
    InlineGroup = "inline-group",
    List = "list",
    Video = "video"
}
interface IQuillDeltaToHtmlConverterOptions {
    orderedListTag?: string;
    bulletListTag?: string;
    listItemTag?: string;
    paragraphTag?: string;
    classPrefix?: string;
    inlineStyles?: boolean | IInlineStyles;
    encodeHtml?: boolean;
    multiLineBlockquote?: boolean;
    multiLineHeader?: boolean;
    multiLineCodeblock?: boolean;
    multiLineParagraph?: boolean;
    linkRel?: string;
    linkTarget?: string;
    allowBackgroundClasses?: boolean;
}
export declare class QuillDeltaToHtmlConverter {
    private options;
    private rawDeltaOps;
    private converterOptions;
    private callbacks;
    constructor(deltaOps: any[], options?: IQuillDeltaToHtmlConverterOptions);
    _getListTag(op: DeltaInsertOp): string;
    getGroupedOps(): TDataGroup[];
    convert(): string;
    _renderWithCallbacks(groupType: GroupType, group: TDataGroup, myRenderFn: () => string): string;
    _renderList(list: ListGroup): string;
    _renderListItem(li: ListItem): string;
    _renderBlock(bop: DeltaInsertOp, ops: DeltaInsertOp[]): string;
    _renderInlines(ops: DeltaInsertOp[], isInlineGroup?: boolean): string;
    _renderInline(op: DeltaInsertOp, contextOp: DeltaInsertOp | null): any;
    _renderCustom(op: DeltaInsertOp, contextOp: DeltaInsertOp | null): any;
    beforeRender(cb: (group: GroupType, data: TDataGroup) => string): void;
    afterRender(cb: (group: GroupType, html: string) => string): void;
    renderCustomWith(cb: (op: DeltaInsertOp, contextOp: DeltaInsertOp) => string): void;
}
export {};
