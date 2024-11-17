// Логика вложения блоков
workspace.addEventListener('mouseup', (event) => {
    const draggedBlock = document.querySelector('.dragging');
    if (draggedBlock) {
        const targetContainer = document.elementFromPoint(event.clientX, event.clientY);

        // Проверяем, попал ли блок в тело setup или loop
        if (targetContainer && targetContainer.classList.contains('block-body')) {
            targetContainer.appendChild(draggedBlock);
            draggedBlock.style.position = 'relative';
            draggedBlock.style.left = '0';
            draggedBlock.style.top = '0';

            // Обновляем размер родительского блока
            adjustBlockSize(targetContainer);
        }

        // Убираем состояние перетаскивания
        draggedBlock.classList.remove('dragging');
    }
});

// Функция изменения размера блока
function adjustBlockSize(container) {
    const parentBlock = container.closest('.draggable');
    const contentHeight = container.scrollHeight + 20; // Учитываем внутренний отступ
    parentBlock.style.height = `${contentHeight}px`;
}