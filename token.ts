export enum TokenType {
  // Single-character tokens
  LEFT_PARENTHESIS, RIGHT_PARENTHESIS, LEFT_CURLY_BRACE, RIGHT_CURLY_BRACE,
  COMMA, DOT, MINUS, PLUS, CONCATENATE, DIVIDE, ASTERISK, DOLLAR_SIGN,
  SEMICOLON,

  // One or two character tokens
  NOT, NOT_EQUAL,
  EQUAL, EQUAL_EQUAL,
  GREATER, GREATER_EQUAL,
  LESS, LESS_EQUAL, NEWLINE,
  ARRAY, FUNCTION_CALL,

  // Literals
  IDENTIFIER, STR, INT, FLT, CODE,

  // Keywords
  AND, ELSE, FALSE, DEFUN, FOR, IFQ, NIL, OR,
  PRINT, RETRN, THIS, TRUE, DEF, 
  WLOOP, BREAK,

  OK, END
}

export class Token {
  constructor (
    public type: TokenType,
    public lexeme: string,
    public literal: any,
    public line: number
  ) {}

  toString(): string {
    return this.type + " " + this.lexeme + " " + this.literal;
  }
}

export module Keywords {
  export let keywords: Map<string, TokenType> = new Map();
  keywords.set("and",    TokenType.AND);
  keywords.set("else",   TokenType.ELSE);
  keywords.set("false",  TokenType.FALSE);
  keywords.set("for",    TokenType.FOR);
  keywords.set("defun",  TokenType.DEFUN);
  keywords.set("ifq",    TokenType.IFQ);
  keywords.set("nil",    TokenType.NIL);
  keywords.set("or",     TokenType.OR);
  keywords.set("print",  TokenType.PRINT);
  keywords.set("retrn", TokenType.RETRN);
  keywords.set("true",   TokenType.TRUE);
  keywords.set("def",    TokenType.DEF);
  keywords.set("wloop",  TokenType.WLOOP);
  keywords.set("break",  TokenType.BREAK);
}

export module ReservedWords {
  export let keywords: Map<string, TokenType> = new Map();
  keywords.set("leftParenthesis", TokenType.LEFT_PARENTHESIS);
  keywords.set("rightParenthesis", TokenType.RIGHT_PARENTHESIS);
  keywords.set("comma", TokenType.COMMA);
  keywords.set("dot", TokenType.DOT);
  keywords.set("minus", TokenType.MINUS);
  keywords.set("plus", TokenType.PLUS);
  keywords.set("concatenate", TokenType.PLUS);
  keywords.set("divide", TokenType.DIVIDE);
  keywords.set("asterisk", TokenType.ASTERISK);
  keywords.set("not", TokenType.NOT);
  keywords.set("notEqual", TokenType.NOT_EQUAL);
  keywords.set("equal", TokenType.EQUAL);
  keywords.set("equalEqual", TokenType.EQUAL_EQUAL);
  keywords.set("greater", TokenType.GREATER);
  keywords.set("greaterEqual", TokenType.GREATER_EQUAL);
  keywords.set("less", TokenType.LESS);
  keywords.set("lessEqual", TokenType.LESS_EQUAL);
  keywords.set("newline", TokenType.NEWLINE);
  keywords.set("identifier", TokenType.IDENTIFIER);
  keywords.set("str", TokenType.STR);
  keywords.set("inte", TokenType.INT);
  keywords.set("flt", TokenType.FLT);
  keywords.set("end", TokenType.END);
  keywords.set("dollarSign", TokenType.DOLLAR_SIGN);
}
