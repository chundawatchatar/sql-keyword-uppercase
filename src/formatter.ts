import * as vscode from 'vscode';
import { keywords } from './sql-keyword';

export class formatter {
    document: vscode.TextDocument;
    edit: vscode.WorkspaceEdit;
    skippingCharacters = [' ', '\t', ':', ';', ',', '(', ')', ''];
    txt = '';
    line = 0;
    lineCharacter = 0;
    constructor(_document: vscode.TextDocument, _edit: vscode.WorkspaceEdit) {
        this.document = _document;
        this.edit = _edit;
    }

    upperCase() {
        for (let line = 0; line < this.document.lineCount; line++) {
            this.txt = this.document.lineAt(line).text;
            let token = '';
            for (this.lineCharacter = 0; this.lineCharacter <= this.txt.length;) {
                if (this.skippingCharacters.indexOf(this.txt.charAt(this.lineCharacter)) !== -1) {
                    if (token && keywords.indexOf(token.toUpperCase()) !== -1) {
                        let start = new vscode.Position(line, this.lineCharacter - (token.length));
                        let end = new vscode.Position(line, (this.lineCharacter));
                        let range = new vscode.Range(start, end);
                        this.edit.replace(this.document.uri, range, token.toUpperCase());
                        token = '';
                    }
                    this.skipWhiteSpace();
                }
                else {
                    token = this.findToken();
                }

            }
        }
    }

    skipWhiteSpace() {
        while (true) {
            if (this.lineCharacter <= this.txt.length && this.skippingCharacters.indexOf(this.txt.charAt(this.lineCharacter)) !== -1) {
                this.lineCharacter++;
                continue;
            }
            break;
        }
    }

    findToken() {
        let token = '';
        while (true) {
            if (this.lineCharacter >= this.txt.length || this.skippingCharacters.indexOf(this.txt.charAt(this.lineCharacter)) !== -1) {
                break;
            }
            token += this.txt.charAt(this.lineCharacter);
            this.lineCharacter++;
        }
        return token;
    }
}