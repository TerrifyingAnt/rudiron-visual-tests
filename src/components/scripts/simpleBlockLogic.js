function createVariableBlock() {
    const variableBlock = document.createElement('div');
    variableBlock.classList.add('draggable', 'variable');

    // Создаем поля для типа и имени переменной
    variableBlock.innerHTML = `
        <div class="variable-field">
            <select id="variableType">
                <option value="int">int</option>
                <option value="float">float</option>
                <option value="char">char</option>
                <option value="bool">bool</option>
            </select>
            <input id="variableName" type="text" placeholder="Variable Name">
        </div>
    `;

    // Позиционирование по умолчанию
    variableBlock.style.left = '50px';
    variableBlock.style.top = '50px';

    // Добавляем перетаскивание
    variableBlock.onmousedown = function (event) {
        // Если клик на элементе внутри блока (select или input), игнорируем перетаскивание
        if (event.target.tagName === 'SELECT' || event.target.tagName === 'INPUT') {
            return;
        }

        event.preventDefault();

        let shiftX = event.clientX - variableBlock.getBoundingClientRect().left;
        let shiftY = event.clientY - variableBlock.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            variableBlock.style.left = pageX - shiftX + workspace.scrollLeft + 'px';
            variableBlock.style.top = pageY - shiftY + workspace.scrollTop + 'px';
        }

        moveAt(event.pageX, event.pageY);

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    };

    variableBlock.ondragstart = function () {
        return false;
    };

    workspace.appendChild(variableBlock);

    // Добавляем обработчики для полей ввода
    const typeField = variableBlock.querySelector('#variableType');
    const nameField = variableBlock.querySelector('#variableName');

    // Следим за изменением значений
    typeField.addEventListener('change', () => updateBlockCode(variableBlock));
    nameField.addEventListener('input', () => updateBlockCode(variableBlock));
}

// Функция обновления кода блока переменной
function updateBlockCode(block) {
    const typeField = block.querySelector('#variableType');
    const nameField = block.querySelector('#variableName');

    const variableType = typeField ? typeField.value : 'int';
    const variableName = nameField ? nameField.value.trim() : 'variable';

    block.dataset.code = `${variableType} ${variableName} = 0;`;
}





