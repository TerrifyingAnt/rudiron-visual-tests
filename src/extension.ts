import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('rudiron-visual-react.helloWorld', () => {
    const panel = vscode.window.createWebviewPanel(
      'dragAndDropCanvas',
      'Drag and Drop Canvas',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
      }
    );

    const appPath = path.join(context.extensionPath, 'media', 'index.html');
    let html = fs.readFileSync(appPath, 'utf8');

    // Обновляем пути к ресурсам в HTML
    html = html.replace(/(href|src)="([^"]*)"/g, (match, p1, p2) => {
      const resourcePath = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, 'media', p2))
      );
      return `${p1}="${resourcePath}"`;
    });

    // Добавляем Content Security Policy
    html = html.replace(
      '<head>',
      `<head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${panel.webview.cspSource} blob: data:; script-src 'unsafe-inline' ${panel.webview.cspSource}; style-src 'unsafe-inline' ${panel.webview.cspSource};">
      `
    );

    panel.webview.html = html;
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
