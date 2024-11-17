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
                        vscode.Uri.file(path.join(context.extensionPath, 'src', 'components', 'webview')),
                        vscode.Uri.file(path.join(context.extensionPath, 'src', 'components', 'styles')),
                        vscode.Uri.file(path.join(context.extensionPath, 'src', 'components', 'scripts'))

                    ]
                }
            );

            const reactAppPath = path.join(context.extensionPath, 'out', 'react-app.js');

            const htmlPath = path.join(context.extensionPath, 'src', 'components', 'webview', 'webview.html');

            const styleBase = path.join(context.extensionPath, 'src', 'components', 'styles', 'base.css')
            const styleBlocks = path.join(context.extensionPath, 'src', 'components', 'styles', 'blocks.css')
            const styleButtons = path.join(context.extensionPath, 'src', 'components', 'styles', 'button.css')
            const styleWorkspace = path.join(context.extensionPath, 'src', 'components', 'styles', 'workspace.css')

            const scriptsDraggableBlockLogic = path.join(context.extensionPath, 'src', 'components', 'scripts', 'draggableBlocks.js')
            const scriptsGenerateCode = path.join(context.extensionPath, 'src', 'components', 'scripts', 'generateCode.js')
            const scriptsInsertBlocks = path.join(context.extensionPath, 'src', 'components', 'scripts', 'insertBlocks.js')
            const scriptsEventListenersBlocks = path.join(context.extensionPath, 'src', 'components', 'scripts', 'eventListeners.js')

            let htmlContent = fs.readFileSync(htmlPath, 'utf8');
            const reactAppUri = panel.webview.asWebviewUri(vscode.Uri.file(reactAppPath));

            const stylesUriBase = panel.webview.asWebviewUri(vscode.Uri.file(styleBase));
            const stylesUriBlocks = panel.webview.asWebviewUri(vscode.Uri.file(styleBlocks));
            const stylesUriButtons = panel.webview.asWebviewUri(vscode.Uri.file(styleButtons));
            const stylesUriWorkspace = panel.webview.asWebviewUri(vscode.Uri.file(styleWorkspace));

            const scriptsUriBlockDraggable = panel.webview.asWebviewUri(vscode.Uri.file(scriptsDraggableBlockLogic)); 
            const scriptUriGenerateCode = panel.webview.asWebviewUri(vscode.Uri.file(scriptsGenerateCode));
            const scriptsUriInsertBlocks = panel.webview.asWebviewUri(vscode.Uri.file(scriptsInsertBlocks)); 
            const scriptUriEventListeners = panel.webview.asWebviewUri(vscode.Uri.file(scriptsEventListenersBlocks));

            // Заменяем плейсхолдеры в HTML
            htmlContent = htmlContent.replace('%REACT_APP%', reactAppUri.toString());
            htmlContent = htmlContent.replace('%STYLESHEET_BASE%', stylesUriBase.toString());
            htmlContent = htmlContent.replace('%STYLESHEET_BLOCKS%', stylesUriBlocks.toString());           
            htmlContent = htmlContent.replace('%STYLESHEET_BUTTONS%', stylesUriButtons.toString());          
            htmlContent = htmlContent.replace('%STYLESHEET_WORKSPACE%', stylesUriWorkspace.toString());

            htmlContent = htmlContent.replace('%SCRIPTS_DRAGGABLE_BLOCK%', scriptsUriBlockDraggable.toString());
            htmlContent = htmlContent.replace('%SCRIPTS_GENERATE_CODE%', scriptUriGenerateCode.toString());
            htmlContent = htmlContent.replace('%SCRIPTS_INSERT_BLOCK%', scriptsUriInsertBlocks.toString());
            htmlContent = htmlContent.replace('%SCRIPTS_EVENT_LISTENERS%', scriptUriEventListeners.toString());
            panel.webview.html = htmlContent;
        })
    );
}
