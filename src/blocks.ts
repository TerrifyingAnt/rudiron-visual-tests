const VARIABLE_TYPES = [
    'int',
    'long',
    'float',
    'double',
    'char',
    'boolean',
    'byte',
    'String'
];

export function createVariableBlock(workspace: HTMLElement) {
    const draggableBlock = document.createElement('div');
    draggableBlock.classList.add('draggable');
    draggableBlock.dataset.type = 'variable';
    
    const header = document.createElement('div');
    header.classList.add('block-header');
    header.textContent = 'Variable';
    
    const content = document.createElement('div');
    content.classList.add('block-content');
    
    const variableContainer = document.createElement('div');
    variableContainer.classList.add('variable-container');

    const typeSelect = document.createElement('select');
    VARIABLE_TYPES.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'variable_name';
    nameInput.value = 'myVar';

    variableContainer.appendChild(typeSelect);
    variableContainer.appendChild(nameInput);
    content.appendChild(variableContainer);

    draggableBlock.appendChild(header);
    draggableBlock.appendChild(content);
    
    function updateBlockCode() {
        const type = typeSelect.value;
        const name = nameInput.value.trim() || 'myVar';
        draggableBlock.dataset.code = `${type} ${name} = 0;`;
    }

    typeSelect.addEventListener('change', updateBlockCode);
    nameInput.addEventListener('input', updateBlockCode);
    
    updateBlockCode();

    addDragAndDrop(draggableBlock, typeSelect, nameInput);
    
    workspace.appendChild(draggableBlock);
}

export function createDraggableBlock(workspace: HTMLElement, code: string) {
    const draggableBlock = document.createElement('div');
    draggableBlock.classList.add('draggable');
    draggableBlock.textContent = code;
    draggableBlock.dataset.code = code;
    draggableBlock.style.top = '20px';
    draggableBlock.style.left = '20px';

    addDragAndDrop(draggableBlock);

    workspace.appendChild(draggableBlock);
}

function addDragAndDrop(element: HTMLElement, typeSelect?: HTMLElement, nameInput?: HTMLElement) {
    element.style.top = '20px';
    element.style.left = '20px';

    element.onmousedown = function(event) {
        if ((typeSelect && event.target === typeSelect) || 
            (nameInput && event.target === nameInput)) {
            return;
        }

        event.preventDefault();

        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;

        function moveAt(pageX: number, pageY: number) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }

        moveAt(event.pageX, event.pageY);

        function onMouseMove(event: MouseEvent) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    };

    element.ondragstart = function() {
        return false;
    };
}