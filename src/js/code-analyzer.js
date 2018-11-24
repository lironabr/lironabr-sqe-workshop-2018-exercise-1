import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};

var handlers=[];
const types=['AssignmentExpression','FunctionDeclaration','VariableDeclaration','WhileStatement','IfStatement',
    'ReturnStatement','BlockStatement','ExpressionStatement','ForStatement'];
handlers['AssignmentExpression']=AssignmentExpressionHandler;
handlers['FunctionDeclaration']=FunctionDeclarationHandler;
handlers['VariableDeclaration']=VariableDeclarationHandler;
handlers['WhileStatement']=WhileStatementHandler;
handlers['IfStatement']=IfStatementHandler;
handlers['ReturnStatement']=ReturnStatementHandler;
handlers['BlockStatement']=BlockStatementHandler;
handlers['ExpressionStatement']=ExpressionStatementHandler;
handlers['ForStatement']=ForStatementHandler;

var myArr=[];

function AssignmentExpressionHandler(node) {
    myArr.push([node.loc.start.line, node.type, node.left.name,null,escodegen.generate(node.right)]);
}
function FunctionDeclarationHandler(node){
    myArr.push([node.loc.start.line, node.type,node.id.name, null,null]);
    node.params.forEach(param=>myArr.push([node.loc.start.line,'VariableDeclaration',param.name,null,null]));
    applyHandler(node.body);
}
function VariableDeclarationHandler(node) {
    node.declarations.forEach(decl=>myArr.push([node.loc.start.line, 'VariableDeclaration',
        decl.id.name,null,(decl.init) ? escodegen.generate(decl.init): null]));
}
function WhileStatementHandler(node) {
    myArr.push([node.loc.start.line,node.type,null,escodegen.generate(node.test),null] );
    applyHandler(node.body);
}

function IfStatementHandler(node) {
    myArr.push([node.loc.start.line, node.type, null, escodegen.generate(node.test),null]);
    applyHandler(node.consequent);
    if(node.alternate)
        if(node.alternate.type==='IfStatement')
            ElseIfStatementHandler(node.alternate);
        else handlers[node.alternate.type](node.alternate);

}
function ElseIfStatementHandler(node) {
    myArr.push([node.loc.start.line, 'ElseIfStatement', null, escodegen.generate(node.test),null]);
    applyHandler(node.consequent);
    if(node.alternate)
        if(node.alternate.type==='IfStatement')
            ElseIfStatementHandler(node.alternate);
        else handlers[node.alternate.type](node.alternate);
}

function ReturnStatementHandler(node){
    myArr.push([node.loc.start.line, node.type,null,null,escodegen.generate(node.argument)]);
}

function BlockStatementHandler(node){
    node.body.forEach(node=>applyHandler(node));
}

function ExpressionStatementHandler(node){
    applyHandler(node.expression);
}

function ForStatementHandler(node) {
    myArr.push([node.loc.start.line,node.type,null,escodegen.generate(node.test),null]);
    applyHandler(node.init);
    applyHandler(node.test);
    applyHandler(node.update);
    applyHandler(node.body);

}

function applyHandler(node){
    if(node)
        types.includes(node.type)? handlers[node.type](node): null;
}

function astToArray(ast) {
    myArr=[];
    Array.from(ast.body).forEach((node)=>applyHandler(node));
    return myArr;
}
export {parseCode, astToArray};
