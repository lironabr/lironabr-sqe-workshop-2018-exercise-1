import $ from 'jquery';
import {astToArray, parseCode} from './code-analyzer';

function makeTableHTML(myArray) {
    let result ='<table border=1>';
    result+=makeTableHeader(['Line','Type','Name','Condition','Value']);
    for(let i=0; i<myArray.length; i++) {
        result += '<tr>';
        for(let j=0; j<myArray[i].length; j++){
            result += '<td>'+((myArray[i][j])?myArray[i][j]:'')+'</td>';
        }
        result += '</tr>';
    }
    result += '</table>';

    return result;
}
function makeTableHeader(headers){
    let result='<tr>';
    for(let i=0;i<headers.length;i++){

        result += '<th>'+headers[i]+'</th>';
    }
    result += '</tr>';
    return result;
}

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').empty().append(makeTableHTML(astToArray( parsedCode)));
    });



});
