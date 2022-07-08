"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runner = void 0;
const scanner_1 = require("./scanner");
const transpiler_1 = require("./transpiler");
function runner(code) {
    const scanner = new scanner_1.Scanner(code);
    const transpiler = new transpiler_1.Transpiler(scanner.scanTokens());
    const runtime = "let nestedLevel=0;let inFunction=true;let counter=0;let map;let functions=new Map;let globalMap=new Map;const startProgram=(...functions)=>functions.map(x=>x());const leftParenthesis=(...functions)=>()=>functions.map(x=>x());const False=()=>()=>false;const True=()=>()=>true;const not=arg=>()=>!arg;const minus=(...args)=>()=>args.map(x=>x()).reduce((a,b)=>a-b);const plus=(...args)=>()=>args.map(x=>x()).reduce((a,b)=>a+b);const divide=(...args)=>()=>args.map(x=>x()).reduce((a,b)=>a/b);const asterisk=(...args)=>()=>args.map(x=>x()).reduce((a,b)=>a*b);const notEqual=(arg1,arg2)=>()=>arg1()!==arg2();const equalEqual=(arg1,arg2)=>()=>arg1()===arg2();const greater=(arg1,arg2)=>()=>arg1()>arg2();const greaterEqual=(arg1,arg2)=>()=>arg1()>=arg2();const less=(arg1,arg2)=>()=>arg1()<arg2();const lessEqual=(arg1,arg2)=>()=>arg1()<=arg2();const and=(arg1,arg2)=>()=>arg1()&&arg2();const or=(arg1,arg2)=>()=>arg1()||arg2();const wloop=(exp,...code)=>()=>{while(exp()[0]===true){startProgram(...code)}};const ifq=(exp,...code)=>()=>{if(exp()[0]===true){startProgram(...code)}};const def=(name,val)=>()=>{globalMap.set(name(),val());eval(`${name()} = ${val()}`)};const concatenate=(...args)=>()=>args.map(x=>x()).reduce((a,b)=>a.concat(b));const arrayCreate=(...args)=>()=>[...args.map(x=>x())];const print=exp=>()=>console.log(exp()[0]?exp()[0]:exp());const str=val=>()=>val;const inte=val=>()=>val;const flt=val=>()=>val;const nil=()=>()=>null;const retrn=val=>()=>val().flat(Infinity)[1]?val().flat(Infinity):val().flat(Infinity)[0];const identifier=val=>()=>val;const dollarSign=val=>()=>{if(inFunction){return eval(`eval(val())`)}else if(nestedLevel!=0&&Array.from(map.keys()).includes(val())){return eval(`${map.get(val())}`)}else if(Array.from(globalMap.keys()).includes(val())){return eval(`${val()}`)}else{return null}};const functionCall=(val,...args)=>()=>{inFunction=true;return functions.get(val())(...args.map(x=>x()))};const my=(name,val,...code)=>()=>{map=new Map;map.set(name(),`I${++counter}`);eval(`I${counter} = ${val()}`);nestedLevel++;startProgram(...code);nestedLevel--};const defun=(name,nos,code)=>()=>{nos=nos().toString();functions.set(name(),new Function(nos,`${code}`))};";
    return (runtime.concat(transpiler.run()));
}
exports.runner = runner;
