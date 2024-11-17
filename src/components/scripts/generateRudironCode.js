// Генерация Arduino-кода
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

    const code = `
        void setup() {
        ${setupCode}}

        void loop() {
        ${loopCode}}`;

    vscode.postMessage({ command: 'showCode', code });
});