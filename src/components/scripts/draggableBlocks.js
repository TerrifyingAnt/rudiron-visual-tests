// Функция для создания draggable-блока
function createDraggableBlock(code, type = null) {
    const draggableBlock = document.createElement('div');
    draggableBlock.classList.add('draggable');
    draggableBlock.textContent = code;
    draggableBlock.dataset.code = code;

    if (type === 'setup' || type === 'loop') {
        draggableBlock.classList.add(type);
        draggableBlock.innerHTML = `
            <div class="block-header">${code.split('{')[0]} </div>
            <div class="block-body"></div>
            <div class="block-footer"></div>`;
    }

    // Позиционирование по умолчанию
    draggableBlock.style.left = '50px';
    draggableBlock.style.top = '50px';

    // События для выделения блока
    draggableBlock.addEventListener('click', (event) => {
        event.stopPropagation(); // Чтобы избежать снятия выделения
        selectBlock(draggableBlock);
    });

    // События для перемещения блока
    draggableBlock.onmousedown = function (event) {
        event.preventDefault();

        let shiftX = event.clientX - draggableBlock.getBoundingClientRect().left;
        let shiftY = event.clientY - draggableBlock.getBoundingClientRect().top;

        // тут нужно центрировать элементы
        function moveAt(pageX, pageY) {
            draggableBlock.style.left = pageX - shiftX + workspace.scrollLeft + 'px';
            draggableBlock.style.top = pageY - shiftY + workspace.scrollTop + 'px';
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

    draggableBlock.ondragstart = function () {
        return false;
    };

    workspace.appendChild(draggableBlock);
}

