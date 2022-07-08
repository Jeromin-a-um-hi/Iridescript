import { logError } from "./error";
import { Token, Keywords, TokenType, ReservedWords } from "./token";

export class Scanner {
  private start: number = 0;
  private current: number = 0;
  private line: number = 1;
  private tokens: Token[] = [];
  private nestedCommentLevel: number = 0;
  
  constructor(public source: string){}

  public scanTokens(): Token[] {
    while (!this.isAtEnd()){
      this.start = this.current;
      this.scanToken();
    }

    return this.tokens.concat(new Token(TokenType.END, "", null, this.line));
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private addToken(type: TokenType, literal: any): void {
    let text: string = this.source.substring(this.start, this.current);
    this.tokens = this.tokens.concat(new Token(type, text, literal, this.line));
  }

  private scanToken(): void {
    let c: string = this.advance();
    switch (c) {
      case "(": this.addToken(TokenType.LEFT_PARENTHESIS, null); break;
      case ")": this.addToken(TokenType.RIGHT_PARENTHESIS, null); break;
      case "{":
	if (this.peek() === "-"){
	  this.nestedCommentLevel++;
	  this.nestedComment();
	  break;
	} else {
	  this.curly();
	  break;
	}
      case "}": this.addToken(TokenType.RIGHT_CURLY_BRACE, null); break;
      case ",": this.addToken(TokenType.COMMA, null); break;
      case "$":
	this.addToken(this.match("$") ? TokenType.FUNCTION_CALL : TokenType.DOLLAR_SIGN, null); break;
      case ".":
	this.isDigit(this.peek())
	  ? this.leadingDecimalFloat()
	  : this.addToken(TokenType.DOT, null);
	break;
      case "-":
	  this.addToken(TokenType.MINUS, null);
	  break;
      case "+": this.addToken(this.match("+")
	? TokenType.CONCATENATE
	: TokenType.PLUS, null); break;
      case "*": this.addToken(TokenType.ASTERISK, null); break; 
      case "!":
        this.addToken(this.match("=") ? TokenType.NOT_EQUAL : TokenType.NOT, null);
        break;
      case "[":
	this.addToken(this.match("]") ? TokenType.ARRAY : TokenType.NEWLINE, null);
	break;
      case "=":
        this.addToken(this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL, null);
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS, null);
        break;
      case ">":
        this.addToken(this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER, null);
        break;
      case "/":
        if (this.match("/")) {
	  // Comment
          while (this.peek() != "\n" && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.DIVIDE, null);
        }
        break;
      case " ": break;
      case "\r": break;
      case "\t": break;
      case "\n":
	this.addToken(TokenType.NEWLINE, null)
        this.line++;
        break;
      case "\"": this.string(); break;
      default:
	if (this.isDigit(c)){
	  this.number();
	} else if (this.isAlpha(c)){
	  this.identifier();
	} else {
	  logError(this.line, `Unexpected variable: ${c}.`);
	  break;
	}
    }
  }

  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    
    let text: string = this.source.substring(this.start, this.current);
    if (ReservedWords.keywords.get(text) == undefined){
      let type: TokenType | undefined = Keywords.keywords.get(text);
      if (type == undefined) type = TokenType.IDENTIFIER;
      this.addToken(type, null);
    } else {
      logError(this.line, `Use of reserved word ${text}`);
    }
  }
  
  private string(): void {
    while (this.peek() != "\"" && !this.isAtEnd()) {
      if (this.peek() == "\n") this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      logError(this.line, "Unterminated string.");
      return;
    }

    this.advance();

    let value: string = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STR, value);
  }

  private curly(): void {
    while (this.peek() != "}" && !this.isAtEnd()) {
      if (this.peek() == "\n") this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      logError(this.line, "Unterminated block.");
      return;
    }

    this.advance();

    let value: string = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.CODE, value);
  }

  private number(): void {
    let isFloat: boolean = false;
    while (this.isDigit(this.peek())) this.advance();

    // Look for a fractional part.
    if (this.peek() == "." && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();
      isFloat = true;
      while (this.isDigit(this.peek())) this.advance();
    }
    if (isFloat){
      this.addToken(TokenType.FLT,
		    parseFloat(this.source.substring(this.start, this.current)))}
    else {
      this.addToken(TokenType.INT,
		    parseFloat(this.source.substring(this.start, this.current)));
    }
  }

  private leadingDecimalFloat(): void {
    while(this.isDigit(this.peek())) this.advance();

    this.addToken(TokenType.FLT,
		  parseFloat("0" + this.source.substring(this.start, this.current)))
  }

  private nestedComment(): void {
    while (this.nestedCommentLevel !== 0) {
      if (this.peek() === "\n") this.line++;
      if (this.peek() === "{" && this.peekNext() === "-"){
	this.nestedCommentLevel++;
      }
      if (this.peek() === "-" && this.peekNext() === "}"){
	if (this.nestedCommentLevel === 1) this.advance();
	this.nestedCommentLevel--;
      }

      if (this.isAtEnd()) { logError(this.line, "Nested comment not closed."); break; }
      else {this.advance()}
    }
  }
  
  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source.charAt(this.current + 1);
  } 

  private isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") ||
           (c >= "A" && c <= "Z") ||
            c == "_";
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }


  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  } 
}
