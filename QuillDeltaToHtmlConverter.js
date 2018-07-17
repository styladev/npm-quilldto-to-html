(function() {
  // ASSET: value-types.ts
  var $yxNR$exports = {};
  Object.defineProperty($yxNR$exports, "__esModule", {
      value: true
  });
  var $yxNR$var$NewLine = "\n";
  var $yxNR$export$NewLine = $yxNR$var$NewLine;
  $yxNR$exports.NewLine = $yxNR$export$NewLine;
  var $yxNR$var$ListType;

  (function(ListType) {
      ListType["Ordered"] = "ordered";
      ListType["Bullet"] = "bullet";
  })($yxNR$var$ListType || ($yxNR$var$ListType = {}));

  var $yxNR$export$ListType = $yxNR$var$ListType;
  $yxNR$exports.ListType = $yxNR$export$ListType;
  var $yxNR$var$ScriptType;

  (function(ScriptType) {
      ScriptType["Sub"] = "sub";
      ScriptType["Super"] = "super";
  })($yxNR$var$ScriptType || ($yxNR$var$ScriptType = {}));

  var $yxNR$export$ScriptType = $yxNR$var$ScriptType;
  $yxNR$exports.ScriptType = $yxNR$export$ScriptType;
  var $yxNR$var$DirectionType;

  (function(DirectionType) {
      DirectionType["Rtl"] = "rtl";
  })($yxNR$var$DirectionType || ($yxNR$var$DirectionType = {}));

  var $yxNR$export$DirectionType = $yxNR$var$DirectionType;
  $yxNR$exports.DirectionType = $yxNR$export$DirectionType;
  var $yxNR$var$AlignType;

  (function(AlignType) {
      AlignType["Center"] = "center";
      AlignType["Right"] = "right";
  })($yxNR$var$AlignType || ($yxNR$var$AlignType = {}));

  var $yxNR$export$AlignType = $yxNR$var$AlignType;
  $yxNR$exports.AlignType = $yxNR$export$AlignType;
  var $yxNR$var$DataType;

  (function(DataType) {
      DataType["Image"] = "image";
      DataType["Video"] = "video";
      DataType["Formula"] = "formula";
      DataType["Text"] = "text";
  })($yxNR$var$DataType || ($yxNR$var$DataType = {}));

  var $yxNR$export$DataType = $yxNR$var$DataType;
  $yxNR$exports.DataType = $yxNR$export$DataType;;
  var $yxNR$var$GroupType;

  (function(GroupType) {
      GroupType["Block"] = "block";
      GroupType["InlineGroup"] = "inline-group";
      GroupType["List"] = "list";
      GroupType["Video"] = "video";
  })($yxNR$var$GroupType || ($yxNR$var$GroupType = {}));

  var $yxNR$export$GroupType = $yxNR$var$GroupType;
  $yxNR$exports.GroupType = $yxNR$export$GroupType;;
  // ASSET: InsertData.ts
  var $yyeL$exports = {};
  Object.defineProperty($yyeL$exports, "__esModule", {
      value: true
  });

  var $yyeL$var$InsertDataQuill = function() {
      function InsertDataQuill(type, value) {
          this.type = type;
          this.value = value;
      }

      return InsertDataQuill;
  }();

  var $yyeL$export$InsertDataQuill = $yyeL$var$InsertDataQuill;
  $yyeL$exports.InsertDataQuill = $yyeL$export$InsertDataQuill;;

  var $yyeL$var$InsertDataCustom = function() {
      function InsertDataCustom(type, value) {
          this.type = type;
          this.value = value;
      }

      return InsertDataCustom;
  }();

  var $yyeL$export$InsertDataCustom = $yyeL$var$InsertDataCustom;
  $yyeL$exports.InsertDataCustom = $yyeL$export$InsertDataCustom;;
  // ASSET: DeltaInsertOp.ts
  var $Wpdu$exports = {};
  Object.defineProperty($Wpdu$exports, "__esModule", {
      value: true
  });

  var $Wpdu$var$DeltaInsertOp = function() {
      function DeltaInsertOp(insertVal, attributes) {
          if (typeof insertVal === 'string') {
              insertVal = new $yyeL$export$InsertDataQuill($yxNR$export$DataType.Text, insertVal + '');
          }

          this.insert = insertVal;
          this.attributes = attributes || {};
      }

      DeltaInsertOp.createNewLineOp = function() {
          return new DeltaInsertOp($yxNR$export$NewLine);
      };

      DeltaInsertOp.prototype.isContainerBlock = function() {
          var attrs = this.attributes;
          return !!(attrs.blockquote || attrs.list || attrs['code-block'] || attrs.header || attrs.align || attrs.direction || attrs.indent);
      };

      DeltaInsertOp.prototype.isBlockquote = function() {
          return this.attributes.blockquote;
      };

      DeltaInsertOp.prototype.isHeader = function() {
          return !!this.attributes.header;
      };

      DeltaInsertOp.prototype.isSameHeaderAs = function(op) {
          return op.attributes.header === this.attributes.header && this.isHeader();
      };

      DeltaInsertOp.prototype.hasSameAdiAs = function(op) {
          return this.attributes.align === op.attributes.align && this.attributes.direction === op.attributes.direction && this.attributes.indent === op.attributes.indent;
      };

      DeltaInsertOp.prototype.hasSameIndentationAs = function(op) {
          return this.attributes.indent === op.attributes.indent;
      };

      DeltaInsertOp.prototype.hasHigherIndentThan = function(op) {
          return (Number(this.attributes.indent) || 0) > (Number(op.attributes.indent) || 0);
      };

      DeltaInsertOp.prototype.isInline = function() {
          return !(this.isContainerBlock() || this.isVideo());
      };

      DeltaInsertOp.prototype.isCodeBlock = function() {
          return !!this.attributes['code-block'];
      };

      DeltaInsertOp.prototype.isJustNewline = function() {
          return this.insert.value === $yxNR$export$NewLine;
      };

      DeltaInsertOp.prototype.isList = function() {
          return this.isOrderedList() || this.isBulletList();
      };

      DeltaInsertOp.prototype.isOrderedList = function() {
          return this.attributes.list === $yxNR$export$ListType.Ordered;
      };

      DeltaInsertOp.prototype.isBulletList = function() {
          return this.attributes.list === $yxNR$export$ListType.Bullet;
      };

      DeltaInsertOp.prototype.isSameListAs = function(op) {
          return this.attributes.list === op.attributes.list && !!op.attributes.list;
      };

      DeltaInsertOp.prototype.isText = function() {
          return this.insert.type === $yxNR$export$DataType.Text;
      };

      DeltaInsertOp.prototype.isImage = function() {
          return this.insert.type === $yxNR$export$DataType.Image;
      };

      DeltaInsertOp.prototype.isFormula = function() {
          return this.insert.type === $yxNR$export$DataType.Formula;
      };

      DeltaInsertOp.prototype.isVideo = function() {
          return this.insert.type === $yxNR$export$DataType.Video;
      };

      DeltaInsertOp.prototype.isLink = function() {
          return this.isText() && !!this.attributes.link;
      };

      DeltaInsertOp.prototype.isCustom = function() {
          return this.insert instanceof $yyeL$export$InsertDataCustom;
      };

      DeltaInsertOp.prototype.isMentions = function() {
          return this.isText() && !!this.attributes.mentions;
      };

      return DeltaInsertOp;
  }();

  var $Wpdu$export$DeltaInsertOp = $Wpdu$var$DeltaInsertOp;
  $Wpdu$exports.DeltaInsertOp = $Wpdu$export$DeltaInsertOp;
  // ASSET: mentions/MentionSanitizer.ts
  var $rtR$exports = {};
  Object.defineProperty($rtR$exports, "__esModule", {
      value: true
  });

  // ASSET: extensions/String.ts
  String.prototype._tokenizeWithNewLines = function() {
      var NewLine = "\n";
      var this_ = this.toString();

      if (this_ === NewLine) {
          return [this_];
      }

      var lines = this.split(NewLine);

      if (lines.length === 1) {
          return lines;
      }

      var lastIndex = lines.length - 1;
      return lines.reduce(function(pv, line, ind) {
          if (ind !== lastIndex) {
              if (line !== "") {
                  pv = pv.concat(line, NewLine);
              } else {
                  pv.push(NewLine);
              }
          } else if (line !== "") {
              pv.push(line);
          }

          return pv;
      }, []);
  };

  String.prototype._scrubUrl = function() {
      return this.replace(/[^-A-Za-z0-9+&@#/%?=~_|!:,.;\(\)]/g, '');
  };

  var $rtR$var$MentionSanitizer = function() {
      function MentionSanitizer() {}

      MentionSanitizer.sanitize = function(dirtyObj) {
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

          if (MentionSanitizer.IsValidTarget(dirtyObj.target)) {
              cleanObj.target = dirtyObj.target;
          }

          if (dirtyObj.avatar) {
              cleanObj.avatar = (dirtyObj.avatar + '')._scrubUrl();
          }

          if (dirtyObj['end-point']) {
              cleanObj['end-point'] = (dirtyObj['end-point'] + '')._scrubUrl();
          }

          if (dirtyObj.slug) {
              cleanObj.slug = (dirtyObj.slug + '')._scrubUrl();
          }

          return cleanObj;
      };

      MentionSanitizer.IsValidClass = function(classAttr) {
          return !!classAttr.match(/^[a-zA-Z0-9_\-]{1,500}$/i);
      };

      MentionSanitizer.IsValidId = function(idAttr) {
          return !!idAttr.match(/^[a-zA-Z0-9_\-\:\.]{1,500}$/i);
      };

      MentionSanitizer.IsValidTarget = function(target) {
          return ['_self', '_blank', '_parent', '_top'].indexOf(target) > -1;
      };

      return MentionSanitizer;
  }();

  var $rtR$export$MentionSanitizer = $rtR$var$MentionSanitizer;
  $rtR$exports.MentionSanitizer = $rtR$export$MentionSanitizer;
  // ASSET: OpAttributeSanitizer.ts
  var $o5GJ$exports = {};
  Object.defineProperty($o5GJ$exports, "__esModule", {
      value: true
  });

  var $o5GJ$var$OpAttributeSanitizer = function() {
      function OpAttributeSanitizer() {}

      OpAttributeSanitizer.sanitize = function(dirtyAttrs) {
          var cleanAttrs = {};

          if (!dirtyAttrs || typeof dirtyAttrs !== 'object') {
              return cleanAttrs;
          }

          var booleanAttrs = ['bold', 'italic', 'underline', 'strike', 'code', 'blockquote', 'code-block'];
          var colorAttrs = ['background', 'color'];
          var font = dirtyAttrs.font,
              size = dirtyAttrs.size,
              link = dirtyAttrs.link,
              script = dirtyAttrs.script,
              list = dirtyAttrs.list,
              header = dirtyAttrs.header,
              align = dirtyAttrs.align,
              direction = dirtyAttrs.direction,
              indent = dirtyAttrs.indent,
              mentions = dirtyAttrs.mentions,
              mention = dirtyAttrs.mention,
              width = dirtyAttrs.width,
              target = dirtyAttrs.target;
          var sanitizedAttrs = booleanAttrs.concat(colorAttrs, ['font', 'size', 'link', 'script', 'list', 'header', 'align', 'direction', 'indent', 'mentions', 'mention', 'width']);
          booleanAttrs.forEach(function(prop) {
              var v = dirtyAttrs[prop];

              if (v) {
                  cleanAttrs[prop] = !!v;
              }
          });
          colorAttrs.forEach(function(prop) {
              var val = dirtyAttrs[prop];

              if (val && (OpAttributeSanitizer.IsValidHexColor(val + '') || OpAttributeSanitizer.IsValidColorLiteral(val + ''))) {
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
              cleanAttrs.link = (link + '')._scrubUrl();
          }

          if (target && OpAttributeSanitizer.isValidTarget(target)) {
              cleanAttrs.target = target;
          }

          if (script === $yxNR$export$ScriptType.Sub || $yxNR$export$ScriptType.Super === script) {
              cleanAttrs.script = script;
          }

          if (list === $yxNR$export$ListType.Bullet || list === $yxNR$export$ListType.Ordered) {
              cleanAttrs.list = list;
          }

          if (Number(header)) {
              cleanAttrs.header = Math.min(Number(header), 6);
          }

          if (align === $yxNR$export$AlignType.Center || align === $yxNR$export$AlignType.Right) {
              cleanAttrs.align = align;
          }

          if (direction === $yxNR$export$DirectionType.Rtl) {
              cleanAttrs.direction = direction;
          }

          if (indent && Number(indent)) {
              cleanAttrs.indent = Math.min(Number(indent), 30);
          }

          if (mentions && mention) {
              var sanitizedMention = $rtR$exports.MentionSanitizer.sanitize(mention);

              if (Object.keys(sanitizedMention).length > 0) {
                  cleanAttrs.mentions = !!mentions;
                  cleanAttrs.mention = mention;
              }
          }

          return Object.keys(dirtyAttrs).reduce(function(cleaned, k) {
              if (sanitizedAttrs.indexOf(k) === -1) {
                  cleaned[k] = dirtyAttrs[k];
              }

              ;
              return cleaned;
          }, cleanAttrs);
      };

      OpAttributeSanitizer.IsValidHexColor = function(colorStr) {
          return !!colorStr.match(/^#([0-9A-F]{6}|[0-9A-F]{3})$/i);
      };

      OpAttributeSanitizer.IsValidColorLiteral = function(colorStr) {
          return !!colorStr.match(/^[a-z]{1,50}$/i);
      };

      OpAttributeSanitizer.IsValidFontName = function(fontName) {
          return !!fontName.match(/^[a-z\s0-9\- ]{1,30}$/i);
      };

      OpAttributeSanitizer.IsValidSize = function(size) {
          return !!size.match(/^[a-z0-9\-]{1,20}$/i);
      };

      OpAttributeSanitizer.IsValidWidth = function(width) {
          return !!width.match(/^[0-9]*(px|em|%)?$/);
      };

      OpAttributeSanitizer.isValidTarget = function(target) {
          return !!target.match(/^[_a-zA-Z0-9\-]{1,50}$/);
      };

      return OpAttributeSanitizer;
  }();

  var $o5GJ$export$OpAttributeSanitizer = $o5GJ$var$OpAttributeSanitizer;
  $o5GJ$exports.OpAttributeSanitizer = $o5GJ$export$OpAttributeSanitizer;
  // ASSET: InsertOpDenormalizer.ts
  var $RBG9$exports = {};
  Object.defineProperty($RBG9$exports, "__esModule", {
      value: true
  });

  // ASSET: extensions/Object.ts
  Object._assign = function(target, varArg1, varArg2) {
      if (varArg2 === void 0) {
          varArg2 = null;
      }

      if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource != null) {
              for (var nextKey in nextSource) {
                  if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                      to[nextKey] = nextSource[nextKey];
                  }
              }
          }
      }

      return to;
  };

  var $RBG9$var$InsertOpDenormalizer = function() {
      function InsertOpDenormalizer() {}

      InsertOpDenormalizer.denormalize = function(op) {
          if (!op || typeof op !== 'object') {
              return [];
          }

          if (typeof op.insert === 'object' || op.insert === $yxNR$export$NewLine) {
              return [op];
          }

          var newlinedArray = (op.insert + '')._tokenizeWithNewLines();

          if (newlinedArray.length === 1) {
              return [op];
          }

          var nlObj = Object._assign({}, op, {
              insert: $yxNR$export$NewLine
          });

          return newlinedArray.map(function(line) {
              if (line === $yxNR$export$NewLine) {
                  return nlObj;
              }

              return Object._assign({}, op, {
                  insert: line
              });
          });
      };

      return InsertOpDenormalizer;
  }();

  var $RBG9$export$InsertOpDenormalizer = $RBG9$var$InsertOpDenormalizer;
  $RBG9$exports.InsertOpDenormalizer = $RBG9$export$InsertOpDenormalizer;
  // ASSET: InsertOpsConverter.ts
  var $OyBJ$exports = {};
  Object.defineProperty($OyBJ$exports, "__esModule", {
      value: true
  });

  var $OyBJ$var$InsertOpsConverter = function() {
      function InsertOpsConverter() {}

      InsertOpsConverter.convert = function(deltaOps) {
          if (!Array.isArray(deltaOps)) {
              return [];
          }

          var denormalizedOps = [].concat.apply([], deltaOps.map($RBG9$export$InsertOpDenormalizer.denormalize));
          var results = [];
          var insertVal, attributes;

          for (var _i = 0, denormalizedOps_1 = denormalizedOps; _i < denormalizedOps_1.length; _i++) {
              var op = denormalizedOps_1[_i];

              if (!op.insert) {
                  continue;
              }

              insertVal = InsertOpsConverter.convertInsertVal(op.insert);

              if (!insertVal) {
                  continue;
              }

              attributes = $o5GJ$export$OpAttributeSanitizer.sanitize(op.attributes);
              results.push(new $Wpdu$export$DeltaInsertOp(insertVal, attributes));
          }

          return results;
      };

      InsertOpsConverter.convertInsertVal = function(insertPropVal) {
          if (typeof insertPropVal === 'string') {
              return new $yyeL$export$InsertDataQuill($yxNR$export$DataType.Text, insertPropVal);
          }

          if (!insertPropVal || typeof insertPropVal !== 'object') {
              return null;
          }

          var keys = Object.keys(insertPropVal);

          if (!keys.length) {
              return null;
          }

          return $yxNR$export$DataType.Image in insertPropVal ? new $yyeL$export$InsertDataQuill($yxNR$export$DataType.Image, insertPropVal[$yxNR$export$DataType.Image]) : $yxNR$export$DataType.Video in insertPropVal ? new $yyeL$export$InsertDataQuill($yxNR$export$DataType.Video, insertPropVal[$yxNR$export$DataType.Video]) : $yxNR$export$DataType.Formula in insertPropVal ? new $yyeL$export$InsertDataQuill($yxNR$export$DataType.Formula, insertPropVal[$yxNR$export$DataType.Formula]) : new $yyeL$export$InsertDataCustom(keys[0], insertPropVal[keys[0]]);
      };

      return InsertOpsConverter;
  }();

  var $OyBJ$export$InsertOpsConverter = $OyBJ$var$InsertOpsConverter;
  $OyBJ$exports.InsertOpsConverter = $OyBJ$export$InsertOpsConverter;
  // ASSET: funcs-html.ts
  var $LXAR$exports = {};
  Object.defineProperty($LXAR$exports, "__esModule", {
      value: true
  });
  var $LXAR$var$EncodeTarget;

  (function(EncodeTarget) {
      EncodeTarget[EncodeTarget["Html"] = 0] = "Html";
      EncodeTarget[EncodeTarget["Url"] = 1] = "Url";
  })($LXAR$var$EncodeTarget || ($LXAR$var$EncodeTarget = {}));

  function $LXAR$var$makeStartTag(tag, attrs) {
      if (attrs === void 0) {
          attrs = null;
      }

      if (!tag) {
          return '';
      }

      var attrsStr = '';

      if (attrs) {
          attrs = [].concat(attrs);
          attrsStr = attrs.map(function(attr) {
              return attr.key + (attr.value ? '="' + attr.value + '"' : '');
          }).join(' ');
      }

      var closing = '>';

      if (tag === 'img' || tag === 'br') {
          closing = '/>';
      }

      return attrsStr ? "<" + tag + " " + attrsStr + closing : "<" + tag + closing;
  }

  var $LXAR$export$makeStartTag = $LXAR$var$makeStartTag;
  $LXAR$exports.makeStartTag = $LXAR$export$makeStartTag;

  function $LXAR$var$makeEndTag(tag) {
      if (tag === void 0) {
          tag = '';
      }

      return tag && "</" + tag + ">" || '';
  }

  var $LXAR$export$makeEndTag = $LXAR$var$makeEndTag;
  $LXAR$exports.makeEndTag = $LXAR$export$makeEndTag;

  function $LXAR$var$decodeHtml(str) {
      return $LXAR$var$encodeMappings($LXAR$var$EncodeTarget.Html).reduce($LXAR$var$decodeMapping, str);
  }

  var $LXAR$export$decodeHtml = $LXAR$var$decodeHtml;
  $LXAR$exports.decodeHtml = $LXAR$export$decodeHtml;

  function $LXAR$var$encodeHtml(str, preventDoubleEncoding) {
      if (preventDoubleEncoding === void 0) {
          preventDoubleEncoding = true;
      }

      if (preventDoubleEncoding) {
          str = $LXAR$var$decodeHtml(str);
      }

      return $LXAR$var$encodeMappings($LXAR$var$EncodeTarget.Html).reduce($LXAR$var$encodeMapping, str);
  }

  var $LXAR$export$encodeHtml = $LXAR$var$encodeHtml;
  $LXAR$exports.encodeHtml = $LXAR$export$encodeHtml;

  function $LXAR$var$encodeLink(str) {
      var linkMaps = $LXAR$var$encodeMappings($LXAR$var$EncodeTarget.Url);
      var decoded = linkMaps.reduce($LXAR$var$decodeMapping, str);
      return linkMaps.reduce($LXAR$var$encodeMapping, decoded);
  }

  var $LXAR$export$encodeLink = $LXAR$var$encodeLink;
  $LXAR$exports.encodeLink = $LXAR$export$encodeLink;

  function $LXAR$var$encodeMappings(mtype) {
      var maps = [
          ['&', '&amp;'],
          ['<', '&lt;'],
          ['>', '&gt;'],
          ['"', '&quot;'],
          ["'", "&#x27;"],
          ['\\/', '&#x2F;'],
          ['\\(', '&#40;'],
          ['\\)', '&#41;']
      ];

      if (mtype === $LXAR$var$EncodeTarget.Html) {
          return maps.filter(function(_a) {
              var v = _a[0],
                  _ = _a[1];
              return v.indexOf('(') === -1 || v.indexOf(')') === -1;
          });
      } else {
          return maps.filter(function(_a) {
              var v = _a[0],
                  _ = _a[1];
              return v.indexOf('/') === -1;
          });
      }
  }

  function $LXAR$var$encodeMapping(str, mapping) {
      return str.replace(new RegExp(mapping[0], 'g'), mapping[1]);
  }

  function $LXAR$var$decodeMapping(str, mapping) {
      return str.replace(new RegExp(mapping[1], 'g'), mapping[0].replace('\\', ''));
  }

  // ASSET: OpToHtmlConverter.ts
  var $SpEM$exports = {};
  Object.defineProperty($SpEM$exports, "__esModule", {
      value: true
  });

  // ASSET: extensions/Array.ts
  Array.prototype._preferSecond = function() {
      if (this.length === 0) {
          return null;
      }

      return this.length >= 2 ? this[1] : this[0];
  };

  Array.prototype._flatten = function() {
      return this.reduce(function(pv, v) {
          return pv.concat(Array.isArray(v) ? v._flatten() : v);
      }, []);
  };

  Array.prototype._groupConsecutiveElementsWhile = function(predicate) {
      var groups = [];
      var currElm, currGroup;

      for (var i = 0; i < this.length; i++) {
          currElm = this[i];

          if (i > 0 && predicate(currElm, this[i - 1])) {
              currGroup = groups[groups.length - 1];
              currGroup.push(currElm);
          } else {
              groups.push([currElm]);
          }
      }

      return groups.map(function(g) {
          return g.length === 1 ? g[0] : g;
      });
  };

  Array.prototype._sliceFromReverseWhile = function(startIndex, predicate) {
      var result = {
          elements: [],
          sliceStartsAt: -1
      };

      for (var i = startIndex; i >= 0; i--) {
          if (!predicate(this[i])) {
              break;
          }

          result.sliceStartsAt = i;
          result.elements.unshift(this[i]);
      }

      return result;
  };

  Array.prototype._intersperse = function(item) {
      var _this = this;

      return this.reduce(function(pv, v, index) {
          pv.push(v);

          if (index < _this.length - 1) {
              pv.push(item);
          }

          return pv;
      }, []);
  };

  var $SpEM$var$OpToHtmlConverter = function() {
      function OpToHtmlConverter(op, options) {
          this.op = op;
          this.options = Object._assign({}, {
              classPrefix: 'ql',
              encodeHtml: true,
              listItemTag: 'li',
              paragraphTag: 'p'
          }, options);
      }

      OpToHtmlConverter.prototype.prefixClass = function(className) {
          if (!this.options.classPrefix) {
              return className + '';
          }

          return this.options.classPrefix + '-' + className;
      };

      OpToHtmlConverter.prototype.getHtml = function() {
          var parts = this.getHtmlParts();
          return parts.openingTag + parts.content + parts.closingTag;
      };

      OpToHtmlConverter.prototype.getHtmlParts = function() {
          if (this.op.isJustNewline() && !this.op.isContainerBlock()) {
              return {
                  openingTag: '',
                  closingTag: '',
                  content: $yxNR$export$NewLine
              };
          }

          var tags = this.getTags(),
              attrs = this.getTagAttributes();

          if (!tags.length && attrs.length) {
              tags.push('span');
          }

          var beginTags = [],
              endTags = [];

          for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
              var tag = tags_1[_i];
              beginTags.push($LXAR$export$makeStartTag(tag, attrs));
              endTags.push(tag === 'img' ? '' : $LXAR$export$makeEndTag(tag));
              attrs = null;
          }

          endTags.reverse();
          return {
              openingTag: beginTags.join(''),
              content: this.getContent(),
              closingTag: endTags.join('')
          };
      };

      OpToHtmlConverter.prototype.getContent = function() {
          if (this.op.isContainerBlock()) {
              return '';
          }

          if (this.op.isMentions()) {
              return this.op.insert.value;
          }

          var content = this.op.isFormula() || this.op.isText() ? this.op.insert.value : '';
          return this.options.encodeHtml && $LXAR$export$encodeHtml(content) || content;
      };

      OpToHtmlConverter.prototype.getCssClasses = function() {
          var attrs = this.op.attributes;
          var propsArr = ['indent', 'align', 'direction', 'font', 'size'];

          if (this.options.allowBackgroundClasses) {
              propsArr.push('background');
          }

          return propsArr.filter(function(prop) {
              return !!attrs[prop];
          }).filter(function(prop) {
              return prop === 'background' ? $o5GJ$export$OpAttributeSanitizer.IsValidColorLiteral(attrs[prop]) : true;
          }).map(function(prop) {
              return prop + '-' + attrs[prop];
          }).concat(this.op.isFormula() ? 'formula' : []).concat(this.op.isVideo() ? 'video' : []).concat(this.op.isImage() ? 'image' : []).map(this.prefixClass.bind(this));
      };

      OpToHtmlConverter.prototype.getCssStyles = function() {
          var attrs = this.op.attributes;
          var propsArr = [
              ['color']
          ];

          if (!this.options.allowBackgroundClasses) {
              propsArr.push(['background', 'background-color']);
          }

          return propsArr.filter(function(item) {
              return !!attrs[item[0]];
          }).map(function(item) {
              return item._preferSecond() + ':' + attrs[item[0]];
          });
      };

      OpToHtmlConverter.prototype.getTagAttributes = function() {
          if (this.op.attributes.code) {
              return [];
          }

          var makeAttr = function(k, v) {
              return {
                  key: k,
                  value: v
              };
          };

          var classes = this.getCssClasses();
          var tagAttrs = classes.length ? [makeAttr('class', classes.join(' '))] : [];

          if (this.op.isImage()) {
              this.op.attributes.width && (tagAttrs = tagAttrs.concat(makeAttr('width', this.op.attributes.width)));
              return tagAttrs.concat(makeAttr('src', (this.op.insert.value + '')._scrubUrl()));
          }

          if (this.op.isFormula() || this.op.isContainerBlock()) {
              return tagAttrs;
          }

          if (this.op.isVideo()) {
              return tagAttrs.concat(makeAttr('frameborder', '0'), makeAttr('allowfullscreen', 'true'), makeAttr('src', (this.op.insert.value + '')._scrubUrl()));
          }

          if (this.op.isMentions()) {
              var mention = this.op.attributes.mention;

              if (mention.class) {
                  tagAttrs = tagAttrs.concat(makeAttr('class', mention.class));
              }

              if (mention['end-point'] && mention.slug) {
                  tagAttrs = tagAttrs.concat(makeAttr('href', $LXAR$export$encodeLink(mention['end-point'] + '/' + mention.slug)));
              } else {
                  tagAttrs = tagAttrs.concat(makeAttr('href', 'javascript:void(0)'));
              }

              if (mention.target) {
                  tagAttrs = tagAttrs.concat(makeAttr('target', mention.target));
              }

              return tagAttrs;
          }

          var styles = this.getCssStyles();
          var styleAttr = styles.length ? [makeAttr('style', styles.join(';'))] : [];
          tagAttrs = tagAttrs.concat(styleAttr);

          if (this.op.isLink()) {
              var target = this.op.attributes.target || this.options.linkTarget;
              tagAttrs = tagAttrs.concat(makeAttr('href', $LXAR$export$encodeLink(this.op.attributes.link))).concat(target ? makeAttr('target', target) : []);

              if (!!this.options.linkRel && OpToHtmlConverter.IsValidRel(this.options.linkRel)) {
                  tagAttrs.push(makeAttr('rel', this.options.linkRel));
              }
          }

          return tagAttrs;
      };

      OpToHtmlConverter.prototype.getTags = function() {
          var attrs = this.op.attributes;

          if (attrs.code) {
              return ['code'];
          }

          if (!this.op.isText()) {
              return [this.op.isVideo() ? 'iframe' : this.op.isImage() ? 'img' : 'span'];
          }

          var positionTag = this.options.paragraphTag || 'p';
          var blocks = [
              ['blockquote'],
              ['code-block', 'pre'],
              ['list', this.options.listItemTag],
              ['header'],
              ['align', positionTag],
              ['direction', positionTag],
              ['indent', positionTag]
          ];

          for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
              var item = blocks_1[_i];

              if (attrs[item[0]]) {
                  return item[0] === 'header' ? ['h' + attrs[item[0]]] : [item._preferSecond()];
              }
          }

          return [
              ['link', 'a'],
              ['script'],
              ['bold', 'strong'],
              ['italic', 'em'],
              ['strike', 's'],
              ['underline', 'u'],
              ['mentions', 'a']
          ].filter(function(item) {
              return !!attrs[item[0]];
          }).map(function(item) {
              return item[0] === 'script' ? attrs[item[0]] === $yxNR$export$ScriptType.Sub ? 'sub' : 'sup' : item._preferSecond();
          });
      };

      OpToHtmlConverter.IsValidRel = function(relStr) {
          return !!relStr.match(/^[a-z\s]{1,50}$/i);
      };

      return OpToHtmlConverter;
  }();

  var $SpEM$export$OpToHtmlConverter = $SpEM$var$OpToHtmlConverter;
  $SpEM$exports.OpToHtmlConverter = $SpEM$export$OpToHtmlConverter;
  // ASSET: grouper/group-types.ts
  var $d2X$exports = {};
  Object.defineProperty($d2X$exports, "__esModule", {
      value: true
  });

  var $d2X$var$InlineGroup = function() {
      function InlineGroup(ops) {
          this.ops = ops;
      }

      return InlineGroup;
  }();

  var $d2X$export$InlineGroup = $d2X$var$InlineGroup;
  $d2X$exports.InlineGroup = $d2X$export$InlineGroup;

  var $d2X$var$VideoItem = function() {
      function VideoItem(op) {
          this.op = op;
      }

      return VideoItem;
  }();

  var $d2X$export$VideoItem = $d2X$var$VideoItem;
  $d2X$exports.VideoItem = $d2X$export$VideoItem;

  var $d2X$var$BlockGroup = function() {
      function BlockGroup(op, ops) {
          this.op = op;
          this.ops = ops;
      }

      return BlockGroup;
  }();

  var $d2X$export$BlockGroup = $d2X$var$BlockGroup;
  $d2X$exports.BlockGroup = $d2X$export$BlockGroup;

  var $d2X$var$ListGroup = function() {
      function ListGroup(items) {
          this.items = items;
      }

      return ListGroup;
  }();

  var $d2X$export$ListGroup = $d2X$var$ListGroup;
  $d2X$exports.ListGroup = $d2X$export$ListGroup;

  var $d2X$var$ListItem = function() {
      function ListItem(item, innerList) {
          if (innerList === void 0) {
              innerList = null;
          }

          this.item = item;
          this.innerList = innerList;
      }

      return ListItem;
  }();

  var $d2X$export$ListItem = $d2X$var$ListItem;
  $d2X$exports.ListItem = $d2X$export$ListItem;
  // ASSET: grouper/Grouper.ts
  var $TII$exports = {};
  Object.defineProperty($TII$exports, "__esModule", {
      value: true
  });

  var $TII$var$Grouper = function() {
      function Grouper() {}

      Grouper.pairOpsWithTheirBlock = function(ops) {
          var result = [];

          var canBeInBlock = function(op) {
              return !(op.isJustNewline() || op.isVideo() || op.isContainerBlock());
          };

          var isInlineData = function(op) {
              return op.isInline();
          };

          var lastInd = ops.length - 1;
          var opsSlice;

          for (var i = lastInd; i >= 0; i--) {
              var op = ops[i];

              if (op.isVideo()) {
                  result.push(new $d2X$exports.VideoItem(op));
              } else if (op.isContainerBlock()) {
                  opsSlice = ops._sliceFromReverseWhile(i - 1, canBeInBlock);
                  result.push(new $d2X$exports.BlockGroup(op, opsSlice.elements));
                  i = opsSlice.sliceStartsAt > -1 ? opsSlice.sliceStartsAt : i;
              } else {
                  opsSlice = ops._sliceFromReverseWhile(i - 1, isInlineData);
                  result.push(new $d2X$exports.InlineGroup(opsSlice.elements.concat(op)));
                  i = opsSlice.sliceStartsAt > -1 ? opsSlice.sliceStartsAt : i;
              }
          }

          result.reverse();
          return result;
      };

      Grouper.groupConsecutiveSameStyleBlocks = function(groups, blocksOf) {
          if (blocksOf === void 0) {
              blocksOf = {
                  header: true,
                  codeBlocks: true,
                  blockquotes: true
              };
          }

          return groups._groupConsecutiveElementsWhile(function(g, gPrev) {
              if (!(g instanceof $d2X$exports.BlockGroup) || !(gPrev instanceof $d2X$exports.BlockGroup)) {
                  return false;
              }

              return blocksOf.codeBlocks && Grouper.areBothCodeblocks(g, gPrev) || blocksOf.blockquotes && Grouper.areBothBlockquotesWithSameAdi(g, gPrev) || blocksOf.header && Grouper.areBothSameHeadersWithSameAdi(g, gPrev);
          });
      };

      Grouper.reduceConsecutiveSameStyleBlocksToOne = function(groups) {
          var newLineOp = $Wpdu$export$DeltaInsertOp.createNewLineOp();
          return groups.map(function(elm) {
              if (!Array.isArray(elm)) {
                  if (elm instanceof $d2X$exports.BlockGroup && !elm.ops.length) {
                      elm.ops.push(newLineOp);
                  }

                  return elm;
              }

              var groupsLastInd = elm.length - 1;
              elm[0].ops = elm.map(function(g, i) {
                  if (!g.ops.length) {
                      return [newLineOp];
                  }

                  return g.ops.concat(i < groupsLastInd ? [newLineOp] : []);
              })._flatten();
              return elm[0];
          });
      };

      Grouper.areBothCodeblocks = function(g1, gOther) {
          return g1.op.isCodeBlock() && gOther.op.isCodeBlock();
      };

      Grouper.areBothSameHeadersWithSameAdi = function(g1, gOther) {
          return g1.op.isSameHeaderAs(gOther.op) && g1.op.hasSameAdiAs(gOther.op);
      };

      Grouper.areBothBlockquotesWithSameAdi = function(g, gOther) {
          return g.op.isBlockquote() && gOther.op.isBlockquote() && g.op.hasSameAdiAs(gOther.op);
      };

      return Grouper;
  }();

  var $TII$export$Grouper = $TII$var$Grouper;
  $TII$exports.Grouper = $TII$export$Grouper;
  // ASSET: grouper/ListNester.ts
  var $eQIn$exports = {};
  Object.defineProperty($eQIn$exports, "__esModule", {
      value: true
  });

  var $eQIn$var$ListNester = function() {
      function ListNester() {}

      ListNester.prototype.nest = function(groups) {
          var _this = this;

          var result = [];
          var listBlocked = this.convertListBlocksToListGroups(groups);
          var groupedByListGroups = this.groupConsecutiveListGroups(listBlocked);

          var nested = groupedByListGroups.map(function(group) {
              if (!Array.isArray(group)) {
                  return group;
              }

              return _this.nestListSection(group);
          })._flatten();

          var groupRootLists = nested._groupConsecutiveElementsWhile(function(curr, prev) {
              if (!(curr instanceof $d2X$exports.ListGroup && prev instanceof $d2X$exports.ListGroup)) {
                  return false;
              }

              return curr.items[0].item.op.isSameListAs(prev.items[0].item.op);
          });

          return groupRootLists.map(function(v) {
              if (!Array.isArray(v)) {
                  return v;
              }

              var litems = v.map(function(g) {
                  return g.items;
              });
              return new $d2X$exports.ListGroup(litems._flatten());
          });
      };

      ListNester.prototype.convertListBlocksToListGroups = function(items) {
          var grouped = items._groupConsecutiveElementsWhile(function(g, gPrev) {
              return g instanceof $d2X$exports.BlockGroup && gPrev instanceof $d2X$exports.BlockGroup && g.op.isList() && gPrev.op.isList() && g.op.isSameListAs(gPrev.op) && g.op.hasSameIndentationAs(gPrev.op);
          });

          return grouped.map(function(item) {
              if (!Array.isArray(item)) {
                  if (item instanceof $d2X$exports.BlockGroup && item.op.isList()) {
                      return new $d2X$exports.ListGroup([new $d2X$exports.ListItem(item)]);
                  }

                  return item;
              }

              return new $d2X$exports.ListGroup(item.map(function(g) {
                  return new $d2X$exports.ListItem(g);
              }));
          });
      };

      ListNester.prototype.groupConsecutiveListGroups = function(items) {
          return items._groupConsecutiveElementsWhile(function(curr, prev) {
              return curr instanceof $d2X$exports.ListGroup && prev instanceof $d2X$exports.ListGroup;
          });
      };

      ListNester.prototype.nestListSection = function(sectionItems) {
          var _this = this;

          var indentGroups = this.groupByIndent(sectionItems);
          Object.keys(indentGroups).map(Number).sort().reverse().forEach(function(indent) {
              indentGroups[indent].forEach(function(lg) {
                  var idx = sectionItems.indexOf(lg);

                  if (_this.placeUnderParent(lg, sectionItems.slice(0, idx))) {
                      sectionItems.splice(idx, 1);
                  }
              });
          });
          return sectionItems;
      };

      ListNester.prototype.groupByIndent = function(items) {
          return items.reduce(function(pv, cv) {
              var indent = cv.items[0].item.op.attributes.indent;

              if (indent) {
                  pv[indent] = pv[indent] || [];
                  pv[indent].push(cv);
              }

              return pv;
          }, {});
      };

      ListNester.prototype.placeUnderParent = function(target, items) {
          for (var i = items.length - 1; i >= 0; i--) {
              var elm = items[i];

              if (target.items[0].item.op.hasHigherIndentThan(elm.items[0].item.op)) {
                  var parent = elm.items[elm.items.length - 1];

                  if (parent.innerList) {
                      parent.innerList.items = parent.innerList.items.concat(target.items);
                  } else {
                      parent.innerList = target;
                  }

                  return true;
              }
          }

          return false;
      };

      return ListNester;
  }();

  var $eQIn$export$ListNester = $eQIn$var$ListNester;
  $eQIn$exports.ListNester = $eQIn$export$ListNester;
  // ASSET: QuillDeltaToHtmlConverter.ts
  var $EcDJ$exports = {};
  Object.defineProperty($EcDJ$exports, "__esModule", {
      value: true
  });
  var $EcDJ$var$BrTag = '<br/>';

  var $EcDJ$var$QuillDeltaToHtmlConverter = function() {
      function QuillDeltaToHtmlConverter(deltaOps, options) {
          this.rawDeltaOps = [];
          this.callbacks = {};
          this.options = Object._assign({
              paragraphTag: 'p',
              encodeHtml: true,
              classPrefix: 'ql',
              multiLineBlockquote: true,
              multiLineHeader: true,
              multiLineCodeblock: true,
              allowBackgroundClasses: false,
              linkTarget: '_blank'
          }, options, {
              orderedListTag: 'ol',
              bulletListTag: 'ul',
              listItemTag: 'li'
          });
          this.converterOptions = {
              encodeHtml: this.options.encodeHtml,
              classPrefix: this.options.classPrefix,
              listItemTag: this.options.listItemTag,
              paragraphTag: this.options.paragraphTag,
              linkRel: this.options.linkRel,
              linkTarget: this.options.linkTarget,
              allowBackgroundClasses: this.options.allowBackgroundClasses
          };
          this.rawDeltaOps = deltaOps;
      }

      QuillDeltaToHtmlConverter.prototype._getListTag = function(op) {
          return op.isOrderedList() ? this.options.orderedListTag + '' : op.isBulletList() ? this.options.bulletListTag + '' : '';
      };

      QuillDeltaToHtmlConverter.prototype.getGroupedOps = function() {
          var deltaOps = $OyBJ$export$InsertOpsConverter.convert(this.rawDeltaOps);
          var pairedOps = $TII$exports.Grouper.pairOpsWithTheirBlock(deltaOps);
          var groupedSameStyleBlocks = $TII$exports.Grouper.groupConsecutiveSameStyleBlocks(pairedOps, {
              blockquotes: !!this.options.multiLineBlockquote,
              header: !!this.options.multiLineHeader,
              codeBlocks: !!this.options.multiLineCodeblock
          });
          var groupedOps = $TII$exports.Grouper.reduceConsecutiveSameStyleBlocksToOne(groupedSameStyleBlocks);
          var listNester = new $eQIn$export$ListNester();
          return listNester.nest(groupedOps);
      };

      QuillDeltaToHtmlConverter.prototype.convert = function() {
          var _this = this;

          return this.getGroupedOps().map(function(group) {
              if (group instanceof $d2X$exports.ListGroup) {
                  return _this._renderWithCallbacks($yxNR$export$GroupType.List, group, function() {
                      return _this._renderList(group);
                  });
              } else if (group instanceof $d2X$exports.BlockGroup) {
                  var g = group;
                  return _this._renderWithCallbacks($yxNR$export$GroupType.Block, group, function() {
                      return _this._renderBlock(g.op, g.ops);
                  });
              } else if (group instanceof $d2X$exports.VideoItem) {
                  return _this._renderWithCallbacks($yxNR$export$GroupType.Video, group, function() {
                      var g = group;
                      var converter = new $SpEM$export$OpToHtmlConverter(g.op, _this.converterOptions);
                      return converter.getHtml();
                  });
              } else {
                  return _this._renderWithCallbacks($yxNR$export$GroupType.InlineGroup, group, function() {
                      return _this._renderInlines(group.ops);
                  });
              }
          }).join("");
      };

      QuillDeltaToHtmlConverter.prototype._renderWithCallbacks = function(groupType, group, myRenderFn) {
          var html = '';
          var beforeCb = this.callbacks['beforeRender_cb'];
          html = typeof beforeCb === 'function' ? beforeCb.apply(null, [groupType, group]) : '';

          if (!html) {
              html = myRenderFn();
          }

          var afterCb = this.callbacks['afterRender_cb'];
          html = typeof afterCb === 'function' ? afterCb.apply(null, [groupType, html]) : html;
          return html;
      };

      QuillDeltaToHtmlConverter.prototype._renderList = function(list, isOuterMost) {
          var _this = this;

          if (isOuterMost === void 0) {
              isOuterMost = true;
          }

          var firstItem = list.items[0];
          return $LXAR$export$makeStartTag(this._getListTag(firstItem.item.op)) + list.items.map(function(li) {
              return _this._renderListItem(li, isOuterMost);
          }).join('') + $LXAR$export$makeEndTag(this._getListTag(firstItem.item.op));
      };

      QuillDeltaToHtmlConverter.prototype._renderListItem = function(li, isOuterMost) {
          var converterOptions = Object._assign({}, this.converterOptions);

          li.item.op.attributes.indent = 0;
          var converter = new $SpEM$export$OpToHtmlConverter(li.item.op, this.converterOptions);
          var parts = converter.getHtmlParts();

          var liElementsHtml = this._renderInlines(li.item.ops, false);

          return parts.openingTag + liElementsHtml + (li.innerList ? this._renderList(li.innerList, false) : '') + parts.closingTag;
      };

      QuillDeltaToHtmlConverter.prototype._renderBlock = function(bop, ops) {
          var _this = this;

          var converter = new $SpEM$export$OpToHtmlConverter(bop, this.converterOptions);
          var htmlParts = converter.getHtmlParts();

          if (bop.isCodeBlock()) {
              return htmlParts.openingTag + $LXAR$export$encodeHtml(ops.map(function(iop) {
                  return iop.isCustom() ? _this._renderCustom(iop, bop) : iop.insert.value;
              }).join("")) + htmlParts.closingTag;
          }

          var inlines = ops.map(function(op) {
              return _this._renderInline(op, bop);
          }).join('');
          return htmlParts.openingTag + (inlines || $EcDJ$var$BrTag) + htmlParts.closingTag;
      };

      QuillDeltaToHtmlConverter.prototype._renderInlines = function(ops, wrapInParagraphTag) {
          var _this = this;

          if (wrapInParagraphTag === void 0) {
              wrapInParagraphTag = true;
          }

          var opsLen = ops.length - 1;
          var html = ops.map(function(op, i) {
              if (i > 0 && i === opsLen && op.isJustNewline()) {
                  return '';
              }

              return _this._renderInline(op, null);
          }).join('');

          if (!wrapInParagraphTag) {
              return html;
          }

          return $LXAR$export$makeStartTag(this.options.paragraphTag) + html + $LXAR$export$makeEndTag(this.options.paragraphTag);
      };

      QuillDeltaToHtmlConverter.prototype._renderInline = function(op, contextOp) {
          if (op.isCustom()) {
              return this._renderCustom(op, contextOp);
          }

          var converter = new $SpEM$export$OpToHtmlConverter(op, this.converterOptions);
          return converter.getHtml().replace(/\n/g, $EcDJ$var$BrTag);
      };

      QuillDeltaToHtmlConverter.prototype._renderCustom = function(op, contextOp) {
          var renderCb = this.callbacks['renderCustomOp_cb'];

          if (typeof renderCb === 'function') {
              return renderCb.apply(null, [op, contextOp]);
          }

          return "";
      };

      QuillDeltaToHtmlConverter.prototype.beforeRender = function(cb) {
          if (typeof cb === 'function') {
              this.callbacks['beforeRender_cb'] = cb;
          }
      };

      QuillDeltaToHtmlConverter.prototype.afterRender = function(cb) {
          if (typeof cb === 'function') {
              this.callbacks['afterRender_cb'] = cb;
          }
      };

      QuillDeltaToHtmlConverter.prototype.renderCustomWith = function(cb) {
          this.callbacks['renderCustomOp_cb'] = cb;
      };

      return QuillDeltaToHtmlConverter;
  }();

  var $EcDJ$export$QuillDeltaToHtmlConverter = $EcDJ$var$QuillDeltaToHtmlConverter;
  $EcDJ$exports.QuillDeltaToHtmlConverter = $EcDJ$export$QuillDeltaToHtmlConverter;

  if (typeof exports === "object" && typeof module !== "undefined") {
      // CommonJS
      module.exports = $EcDJ$exports;
  } else if (typeof define === "function" && define.amd) {
      // RequireJS
      define(function() {
          return $EcDJ$exports;
      });
  }
})();