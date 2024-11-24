import React, { useRef, useEffect, useState } from "react";

interface BlockProps {
    id: string;
    type: string;
    position: { x: number; y: number };
    children?: React.ReactNode;
    code: string;
    onMove: (id: string, position: { x: number; y: number }) => void;
    onNest?: (parentId: string, childId: string) => void; // Для уведомления о вложении
}

const Block: React.FC<BlockProps> = ({
    id,
    type,
    position,
    children,
    code,
    onMove,
    onNest,
}) => {
    const blockRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 });
    const [nested, setNested] = useState(false); // Отслеживаем состояние вложенности

    const handleMouseDown = (event: React.MouseEvent) => {
        setDragging(true);
        document.body.classList.add("dragging");

        setCurrentOffset({ x: event.clientX, y: event.clientY });
        setStartPosition({ x: position.x, y: position.y });
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (dragging && !nested) {
            const deltaX = event.clientX - currentOffset.x;
            const deltaY = event.clientY - currentOffset.y;

            const newX = startPosition.x + deltaX;
            const newY = startPosition.y + deltaY;

            onMove(id, { x: newX, y: newY });
        }
    };

    const handleMouseUp = (event: MouseEvent) => {
        if (dragging) {
            setDragging(false);
            document.body.classList.remove("dragging");

            const target = document.elementFromPoint(event.clientX, event.clientY);
            if (target && target.classList.contains("block-body")) {
                const container = target as HTMLElement;

                // Уведомляем о вложении
                if (onNest) {
                    const parentId = container.dataset.blockId; // ID родительского блока
                    if (parentId) {
                        onNest(parentId, id);
                        nestBlock(container); // Устанавливаем вложение
                    }
                }
            }
        }
    };

    const nestBlock = (container: HTMLElement) => {
        setNested(true);

        // Убираем из предыдущей позиции
        blockRef.current!.style.position = "relative";
        blockRef.current!.style.left = "0";
        blockRef.current!.style.top = "0";
        blockRef.current!.style.width = "80%"; // Уменьшаем размер
        blockRef.current!.style.margin = "4px auto"; // Центрируем блок

        // Добавляем в новый контейнер
        container.appendChild(blockRef.current!);

        adjustBlockSize(container);
    };

    const adjustBlockSize = (container: HTMLElement) => {
        const parentBlock = container.closest(".draggable") as HTMLElement;
        if (parentBlock) {
            const contentHeight = container.scrollHeight + 20; // Учитываем внутренний отступ
            parentBlock.style.height = `${contentHeight}px`;
        }
    };

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, currentOffset, startPosition, position, nested]);

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData("blockId", id);
        console.log("Dragging block with ID:", id);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const childId = event.dataTransfer.getData("blockId");
        console.log(`Dropped block with ID: ${childId} into block ID: ${id}`);
        if (onNest) onNest(id, childId);
    };

    return (
        <div
            ref={blockRef}
            className={`draggable block ${type}`}
            data-block-id={id}
            draggable={true}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            
            onMouseDown={handleMouseDown}
        >
            <div className="block-content">{children || type}</div>
        </div>
    );
};

export default Block;
