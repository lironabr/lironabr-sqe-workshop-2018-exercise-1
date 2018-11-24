import assert from 'assert';

import {astToArray, parseCode} from '../src/js/code-analyzer';

it('The javascript parser is parsing an empty function correctly', () => {
    assert.deepEqual(
        astToArray(parseCode('')),[]
    );
});

it('The javascript parser is parsing a simple variable declaration correctly', () => {
    assert.deepEqual(
        astToArray(parseCode('let a = 1;')),
        [[1,'VariableDeclaration','a',null,'1']]
    );
});

it('The javascript parser is parsing an empty variable declaration correctly', () => {
    assert.deepEqual(
        astToArray(parseCode('let a;')),
        [[1,'VariableDeclaration','a',null,null]]
    );
});

it('The javascript parser is parsing a simple function correctly',()=>{
    assert.deepEqual(
        astToArray(parseCode('function f(x){\nx=5;\nreturn x;\n}')),
        [[1,'FunctionDeclaration','f',null,null],
            [1,'VariableDeclaration','x',null,null],
            [2,'AssignmentExpression','x',null,'5'],
            [3,'ReturnStatement',null,null,'x']]
    );
});

it('The javascript parser is parsing an if statement correctly',()=>{
    assert.deepEqual(
        astToArray(parseCode('if (x>3)\n x=3;')),
        [[1,'IfStatement',null ,'x > 3',null],
            [2,'AssignmentExpression','x',null,'3']]
    );
});

it('The javascript parser is parsing an else statement correctly',()=>{
    assert.deepEqual(
        astToArray(parseCode('if (x>3)\n x=4;\n else x=0')),
        [[1,'IfStatement',null ,'x > 3',null],
            [2,'AssignmentExpression','x',null,'4'],
            [3,'AssignmentExpression','x',null,'0']]
    );
});

it('The javascript parser is parsing else if statements correctly',()=>{
    assert.deepEqual(
        astToArray(parseCode('if (x>3)\n x=4;\n else if(x<1)\n x=0;\n else if(x==3)\n x=3;')),
        [[1,'IfStatement',null ,'x > 3',null],
            [2,'AssignmentExpression','x',null,'4'],
            [3,'ElseIfStatement',null,'x < 1',null],
            [4,'AssignmentExpression','x',null,'0'],
            [5,'ElseIfStatement',null,'x == 3',null],
            [6,'AssignmentExpression','x',null,'3']]
    );
});

it('The javascript parser is parsing else if else statements correctly',()=>{
    assert.deepEqual(
        astToArray(parseCode('if (x>3)\n x=4;\n else if(x<3)\n x=2;\n else \n x=3')),
        [[1,'IfStatement',null ,'x > 3',null],
            [2,'AssignmentExpression','x',null,'4'],
            [3,'ElseIfStatement',null,'x < 3',null],
            [4,'AssignmentExpression','x',null,'2'],
            [6,'AssignmentExpression','x',null,'3']]
    );
});

it('The javascript parser is parsing a for statement correctly',()=>{
    assert.deepEqual(
        astToArray(parseCode('for(let i=0;i<20;i=i+1)\n{\n i=i*2;\n }')),
        [[1,'ForStatement',null ,'i < 20',null],
            [1,'VariableDeclaration','i',null,'0'],
            [1,'AssignmentExpression','i',null,'i + 1'],
            [3,'AssignmentExpression','i',null,'i * 2']]
    );
});

it('The javascript parser is parsing a for statement w/o init correctly',()=>{
    assert.deepEqual(
        astToArray(parseCode('for(;i<20;i=i+1)\n{\n i=i*2;\n }')),
        [[1,'ForStatement',null ,'i < 20',null],
            [1,'AssignmentExpression','i',null,'i + 1'],
            [3,'AssignmentExpression','i',null,'i * 2']]
    );
});

it('The javascript parser is parsing a while statement correctly',()=>{
    assert.deepEqual(
        astToArray(parseCode('while(i<30 && i!=4)\n i=i*1.5;')),
        [[1,'WhileStatement',null ,'i < 30 && i != 4',null],
            [2,'AssignmentExpression','i',null,'i * 1.5']]
    );
});





