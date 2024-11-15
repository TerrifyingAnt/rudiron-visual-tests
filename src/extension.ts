import * as vscode from 'vscode';
import { getWebviewContent } from './webview';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('rudiron-visual-test.helloWorld', () => {
            const panel = vscode.window.createWebviewPanel(
                'arduinoBlocks',
                'Arduino Blocks',
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            panel.webview.onDidReceiveMessage(
                message => {
                    if (message.command === 'showCode') {
                        const doc = vscode.workspace.openTextDocument({
                            content: message.code,
                            language: 'cpp'
                        });
                        doc.then((document) => vscode.window.showTextDocument(document));
                    }
                },
                undefined,
                context.subscriptions
            );

            panel.webview.html = getWebviewContent();
        })
    );
}

export function deactivate() {}