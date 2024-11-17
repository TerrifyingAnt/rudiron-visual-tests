// Обновляем логику создания блоков
blockPanel.addEventListener('click', (event) => {
    const block = event.target;
    if (block.classList.contains('block')) {
        const blockType = block.dataset.type;

        // Логика для блока переменных
        if (blockType === 'variable') {
            createVariableBlock();
        } else {
            const blockCode = block.dataset.code || block.textContent;
            createDraggableBlock(blockCode, blockType);
        }
    }
});

// Добавляем класс "dragging" при начале перетаскивания
document.addEventListener('mousedown', (event) => {
    const block = event.target.closest('.draggable');
    if (block) {
        block.classList.add('dragging');
    }
});