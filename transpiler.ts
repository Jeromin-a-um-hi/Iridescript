import { Scanner } from "./scanner";
import { TokenType, Token } from "./token";

export class Transpiler {
  private code: string          = "startProgram(";
  
  constructor(public tokens: Token[]){}

  creator = (token: Token): void => {
    switch(token.type){
      case TokenType.LEFT_PARENTHESIS:
	this.code = this.code.concat("leftParenthesis(");
	break;
      case TokenType.RIGHT_PARENTHESIS:
	this.code = this.code.concat(")),");
	break;
      case TokenType.ARRAY:
	this.code = this.code.concat("arrayCreate(");
	break;
      case TokenType.LEFT_CURLY_BRACE:
	this.code = this.code.concat("'");
	break;
      case TokenType.RIGHT_CURLY_BRACE:
	this.code = this.code.concat("'");
	break;
      case TokenType.RETRN:
	this.code = this.code.concat("retrn(")
	break;
      case TokenType.SEMICOLON:
	this.code = this.code.concat(";")
	break;
      case TokenType.FALSE:
	this.code = this.code.concat("False(),");
	break;
      case TokenType.TRUE:
	this.code = this.code.concat("True(),");
	break;
      case TokenType.NOT:
	this.code = this.code.concat("not("); 
	break;
      case TokenType.MINUS:
	this.code = this.code.concat("minus("); 
	break;
      case TokenType.PLUS:
	this.code = this.code.concat("plus(");
	break;
      case TokenType.CONCATENATE:
	this.code = this.code.concat("concatenate(");
	break;
      case TokenType.DIVIDE:
	this.code = this.code.concat("divide(");
	break;
      case TokenType.ASTERISK:
	this.code = this.code.concat("asterisk(");
	break;
      case TokenType.NOT_EQUAL:
	this.code = this.code.concat("notEqual(");
	break;
      case TokenType.EQUAL:
	this.code = this.code.concat("equal(");
	break;
      case TokenType.EQUAL_EQUAL:
	this.code = this.code.concat("equalEqual(");
	break;
      case TokenType.GREATER:
	this.code = this.code.concat("greater(");
	break;
      case TokenType.GREATER_EQUAL:
	this.code = this.code.concat("greaterEqual(");
	break;
      case TokenType.LESS:
	this.code = this.code.concat("less(");
	break;
      case TokenType.LESS_EQUAL:
	this.code = this.code.concat("lessEqual(");
	break;
      case TokenType.AND:
	this.code = this.code.concat("and(");
	break;
      case TokenType.OR:
	this.code = this.code.concat("or(");
	break;
      case TokenType.WLOOP:
	this.code = this.code.concat("wloop(");
	break;
      case TokenType.IFQ:
	this.code = this.code.concat("ifq(");
	break;
      case TokenType.DEF:
	this.code = this.code.concat("def(");
	break;
      case TokenType.DEFUN:
	this.code = this.code.concat("defun(");
	break;
      case TokenType.PRINT:
	this.code = this.code.concat("print(");
	break;
      case TokenType.STR:
	this.code = this.code.concat(`str(\`${token.literal}\`),`);
	break;
      case TokenType.CODE:
	let runtime = "let nestedLevel=0;let inFunction=true;let counter=0;let map;let functions=new Map;let globalMap=new Map;const startProgram=(...functions)=>functions.map(x=>x());const leftParenthesis=(...functions)=>()=>functions.map(x=>x());const False=()=>()=>false;const True=()=>()=>true;const not=arg=>()=>!arg;const minus=(...args)=>()=>args.map(x=>x()).reduce((a,b)=>a-b);const plus=(...args)=>()=>args.map(x=>x()).reduce((a,b)=>a+b);const divide=(...args)=>()=>args.map(x=>x()).reduce((a,b)=>a/b);const asterisk=(...args)=>()=>args.map(x=>x()).reduce((a,b)=>a*b);const notEqual=(arg1,arg2)=>()=>arg1()!==arg2();const equalEqual=(arg1,arg2)=>()=>arg1()===arg2();const greater=(arg1,arg2)=>()=>arg1()>arg2();const greaterEqual=(arg1,arg2)=>()=>arg1()>=arg2();const less=(arg1,arg2)=>()=>arg1()<arg2();const lessEqual=(arg1,arg2)=>()=>arg1()<=arg2();const and=(arg1,arg2)=>()=>arg1()&&arg2();const or=(arg1,arg2)=>()=>arg1()||arg2();const wloop=(exp,...code)=>()=>{while(exp()[0]===true){startProgram(...code)}};const ifq=(exp,...code)=>()=>{if(exp()[0]===true){startProgram(...code)}};const def=(name,val)=>()=>{globalMap.set(name(),val());eval(`${name()} = ${val()}`)};const concatenate=(...args)=>()=>args.map(x=>x()).reduce((a,b)=>a.concat(b));const arrayCreate=(...args)=>()=>[...args.map(x=>x())];const print=exp=>()=>console.log(exp()[0]?exp()[0]:exp());const str=val=>()=>val;const inte=val=>()=>val;const flt=val=>()=>val;const nil=()=>()=>null;const retrn=val=>()=>val().flat(Infinity)[1]?val().flat(Infinity):val().flat(Infinity)[0];const identifier=val=>()=>val;const dollarSign=val=>()=>{if(inFunction){return eval(`eval(val())`)}else if(nestedLevel!=0&&Array.from(map.keys()).includes(val())){return eval(`${map.get(val())}`)}else if(Array.from(globalMap.keys()).includes(val())){return eval(`${val()}`)}else{return null}};const functionCall=(val,...args)=>()=>{inFunction=true;return functions.get(val())(...args.map(x=>x()))};const my=(name,val,...code)=>()=>{map=new Map;map.set(name(),`I${++counter}`);eval(`I${counter} = ${val()}`);nestedLevel++;startProgram(...code);nestedLevel--};const defun=(name,nos,code)=>()=>{nos=nos().toString();functions.set(name(),new Function(nos,`${code}`))};";
	let scanner = new Scanner(token.literal);
	let transpiler = new Transpiler(scanner.scanTokens());
	this.code = this.code.concat("'".concat(runtime.concat("return ".concat(transpiler.run())).concat("'")));
	break;
      case TokenType.INT:
	this.code = this.code.concat(`inte(${token.lexeme}),`);
	break;
      case TokenType.FLT:
	this.code = this.code.concat(`flt(${token.lexeme}),`);
	break;
      case TokenType.NIL:
	this.code = this.code.concat("nil(),");
	break;
      case TokenType.IDENTIFIER:
	this.code = this.code.concat(`identifier("${token.lexeme}"),`);
	break;
      case TokenType.DOLLAR_SIGN:
	this.code = this.code.concat(`dollarSign(`);
	break;
      case TokenType.COMMA:
	this.code = this.code.concat(`,`);
	break;
      case TokenType.FUNCTION_CALL:
	this.code = this.code.concat("functionCall(");
	break;
      case TokenType.END:
	this.code = this.code.concat(")");
	break;
      case TokenType.OK:
	this.code = this.code.concat("),");
	break;
      default:
	break;
    }
  }

  private parenthesiser(): void {
    for (let i of this.tokens) {
      let index = this.tokens.indexOf(i);
      switch (i.type) {
	case TokenType.NOT:
	  this.tokens.splice(index + 2, 0, new Token(TokenType.OK, "", null, -99));
	  break;
	case TokenType.DOLLAR_SIGN:
	  this.tokens.splice(index + 2, 0, new Token(TokenType.OK, "", null, -99));
	  break;
	default: break;
      }
    }
  }
  

  run(): string { 
    this.parenthesiser();
    this.tokens.map(this.creator);
    return this.code;
  }
}
