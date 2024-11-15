import styles from '../src/styles.module.css';
export function getWebviewContent(): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Arduino Blocks</title>
            <style>
                ${styles}
            </style>
        </head>
        <body>
            <div id="blockPanel">
                <div class="block" data-type="variable">Variable Declaration</div>
                <div class="block" data-type="if" data-code="if (condition) {\n  // code\n}">If Statement</div>
                <div class="block" data-type="digitalWrite" data-code="digitalWrite(pin, HIGH);">Digital Write</div>
            </div>

            <div id="workspace">
                <div class="static-block" id="setupBlock">void setup() {\n}</div>
                <div class="static-block" id="loopBlock">void loop() {\n}</div>
            </div>

            <button id="generateButton">Generate Arduino Code</button>

            <script>
                const vscode = acquireVsCodeApi();
                const workspace = document.getElementById('workspace');
                const blockPanel = document.getElementById('blockPanel');

                blockPanel.addEventListener('click', (event) => {
                    const block = event.target;
                    if (block.classList.contains('block')) {
                        if (block.dataset.type === 'variable') {
                            createVariableBlock(workspace);
                        } else {
                            createDraggableBlock(workspace, block.getAttribute('data-code'));
                        }
                    }
                });

                document.getElementById('generateButton').addEventListener('click', () => {
                    let setupCode = '';
                    let loopCode = '';

                    const blocks = workspace.getElementsByClassName('draggable');
                    for (let block of blocks) {
                        const top = parseInt(block.style.top);
                        if (top < 150) {
                            setupCode += '  ' + block.dataset.code + '\n';
                        } else {
                            loopCode += '  ' + block.dataset.code + '\n';
                        }
                    }

                    vscode.postMessage({ command: 'showCode', code: code });
                });

                document.onselectstart = () => false;
            </script>
        </body>
        </html>`;
}