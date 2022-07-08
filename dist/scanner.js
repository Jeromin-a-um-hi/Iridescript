"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const error_1 = require("./error");
const token_1 = require("./token");
class Scanner {
    constructor(source) {
        this.source = source;
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.tokens = [];
        this.nestedCommentLevel = 0;
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        return this.tokens.concat(new token_1.Token(token_1.TokenType.END, "", null, this.line));
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
    advance() {
        return this.source.charAt(this.current++);
    }
    addToken(type, literal) {
        let text = this.source.substring(this.start, this.current);
        this.tokens = this.tokens.concat(new token_1.Token(type, text, literal, this.line));
    }
    scanToken() {
        let c = this.advance();
        switch (c) {
            case "(":
                this.addToken(token_1.TokenType.LEFT_PARENTHESIS, null);
                break;
            case ")":
                this.addToken(token_1.TokenType.RIGHT_PARENTHESIS, null);
                break;
            case "{":
                if (this.peek() === "-") {
                    this.nestedCommentLevel++;
                    this.nestedComment();
                    break;
                }
                else {
                    this.curly();
                    break;
                }
            case "}":
                this.addToken(token_1.TokenType.RIGHT_CURLY_BRACE, null);
                break;
            case ",":
                this.addToken(token_1.TokenType.COMMA, null);
                break;
            case "$":
                this.addToken(this.match("$") ? token_1.TokenType.FUNCTION_CALL : token_1.TokenType.DOLLAR_SIGN, null);
                break;
            case ".":
                this.isDigit(this.peek())
                    ? this.leadingDecimalFloat()
                    : this.addToken(token_1.TokenType.DOT, null);
                break;
            case "-":
                this.addToken(token_1.TokenType.MINUS, null);
                break;
            case "+":
                this.addToken(this.match("+")
                    ? token_1.TokenType.CONCATENATE
                    : token_1.TokenType.PLUS, null);
                break;
            case "*":
                this.addToken(token_1.TokenType.ASTERISK, null);
                break;
            case "!":
                this.addToken(this.match("=") ? token_1.TokenType.NOT_EQUAL : token_1.TokenType.NOT, null);
                break;
            case "[":
                this.addToken(this.match("]") ? token_1.TokenType.ARRAY : token_1.TokenType.NEWLINE, null);
                break;
            case "=":
                this.addToken(this.match("=") ? token_1.TokenType.EQUAL_EQUAL : token_1.TokenType.EQUAL, null);
                break;
            case "<":
                this.addToken(this.match("=") ? token_1.TokenType.LESS_EQUAL : token_1.TokenType.LESS, null);
                break;
            case ">":
                this.addToken(this.match("=") ? token_1.TokenType.GREATER_EQUAL : token_1.TokenType.GREATER, null);
                break;
            case "/":
                if (this.match("/")) {
                    while (this.peek() != "\n" && !this.isAtEnd())
                        this.advance();
                }
                else {
                    this.addToken(token_1.TokenType.DIVIDE, null);
                }
                break;
            case " ": break;
            case "\r": break;
            case "\t": break;
            case "\n":
                this.addToken(token_1.TokenType.NEWLINE, null);
                this.line++;
                break;
            case "\"":
                this.string();
                break;
            default:
                if (this.isDigit(c)) {
                    this.number();
                }
                else if (this.isAlpha(c)) {
                    this.identifier();
                }
                else {
                    (0, error_1.logError)(this.line, `Unexpected variable: ${c}.`);
                    break;
                }
        }
    }
    identifier() {
        while (this.isAlphaNumeric(this.peek()))
            this.advance();
        let text = this.source.substring(this.start, this.current);
        if (token_1.ReservedWords.keywords.get(text) == undefined) {
            let type = token_1.Keywords.keywords.get(text);
            if (type == undefined)
                type = token_1.TokenType.IDENTIFIER;
            this.addToken(type, null);
        }
        else {
            (0, error_1.logError)(this.line, `Use of reserved word ${text}`);
        }
    }
    string() {
        while (this.peek() != "\"" && !this.isAtEnd()) {
            if (this.peek() == "\n")
                this.line++;
            this.advance();
        }
        if (this.isAtEnd()) {
            (0, error_1.logError)(this.line, "Unterminated string.");
            return;
        }
        this.advance();
        let value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(token_1.TokenType.STR, value);
    }
    curly() {
        while (this.peek() != "}" && !this.isAtEnd()) {
            if (this.peek() == "\n")
                this.line++;
            this.advance();
        }
        if (this.isAtEnd()) {
            (0, error_1.logError)(this.line, "Unterminated block.");
            return;
        }
        this.advance();
        let value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(token_1.TokenType.CODE, value);
    }
    number() {
        let isFloat = false;
        while (this.isDigit(this.peek()))
            this.advance();
        if (this.peek() == "." && this.isDigit(this.peekNext())) {
            this.advance();
            isFloat = true;
            while (this.isDigit(this.peek()))
                this.advance();
        }
        if (isFloat) {
            this.addToken(token_1.TokenType.FLT, parseFloat(this.source.substring(this.start, this.current)));
        }
        else {
            this.addToken(token_1.TokenType.INT, parseFloat(this.source.substring(this.start, this.current)));
        }
    }
    leadingDecimalFloat() {
        while (this.isDigit(this.peek()))
            this.advance();
        this.addToken(token_1.TokenType.FLT, parseFloat("0" + this.source.substring(this.start, this.current)));
    }
    nestedComment() {
        while (this.nestedCommentLevel !== 0) {
            if (this.peek() === "\n")
                this.line++;
            if (this.peek() === "{" && this.peekNext() === "-") {
                this.nestedCommentLevel++;
            }
            if (this.peek() === "-" && this.peekNext() === "}") {
                if (this.nestedCommentLevel === 1)
                    this.advance();
                this.nestedCommentLevel--;
            }
            if (this.isAtEnd()) {
                (0, error_1.logError)(this.line, "Nested comment not closed.");
                break;
            }
            else {
                this.advance();
            }
        }
    }
    match(expected) {
        if (this.isAtEnd())
            return false;
        if (this.source.charAt(this.current) != expected)
            return false;
        this.current++;
        return true;
    }
    peek() {
        if (this.isAtEnd())
            return "\0";
        return this.source.charAt(this.current);
    }
    peekNext() {
        if (this.current + 1 >= this.source.length)
            return "\0";
        return this.source.charAt(this.current + 1);
    }
    isAlpha(c) {
        return (c >= "a" && c <= "z") ||
            (c >= "A" && c <= "Z") ||
            c == "_";
    }
    isAlphaNumeric(c) {
        return this.isAlpha(c) || this.isDigit(c);
    }
    isDigit(c) {
        return c >= "0" && c <= "9";
    }
}
exports.Scanner = Scanner;
