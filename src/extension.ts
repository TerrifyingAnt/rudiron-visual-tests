import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('rudiron-visual-test.helloWorld', () => {
            const panel = vscode.window.createWebviewPanel(
                'reactWebview',
                'React View',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    localResourceRoots: [
                        vscode.Uri.file(path.join(context.extensionPath, 'out')),
                        vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview'))
                    ]
                }
            );

            const reactAppPath = path.join(context.extensionPath, 'out', 'react-app.js');
            const stylesPath = path.join(context.extensionPath, 'src', 'webview', 'styles.css');
            const htmlPath = path.join(context.extensionPath, 'src', 'webview', 'webview.html');

            let htmlContent = fs.readFileSync(htmlPath, 'utf8');
            const reactAppUri = panel.webview.asWebviewUri(vscode.Uri.file(reactAppPath));
            const stylesUri = panel.webview.asWebviewUri(vscode.Uri.file(stylesPath));

            // Заменяем плейсхолдеры в HTML
            htmlContent = htmlContent.replace('%REACT_APP%', reactAppUri.toString());
            htmlContent = htmlContent.replace('%STYLESHEET%', stylesUri.toString());

            panel.webview.html = htmlContent;
        })
    );
}
