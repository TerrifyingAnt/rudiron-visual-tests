import React, { useState } from "react";
import Block from "../BlockTemplate";
import "./SetupBlock.css";

interface SetupBlockProps {
    id: string;
    position: { x: number; y: number };
    onMove: (id: string, position: { x: number; y: number }) => void;
    code: string;
}

const SetupBlock: React.FC<SetupBlockProps> = ({ id, position, onMove, code }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [innerBlocks, setInnerBlocks] = useState<any[]>([]);

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsHovered(true);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Необходимо для корректной работы drop-события
    };

    const handleDragLeave = () => setIsHovered(false);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const newBlock = { id: `block-${Date.now()}` }; // Генерация нового блока
        setInnerBlocks((prevBlocks) => [...prevBlocks, newBlock]);
        setIsCollapsed(false);
        setIsHovered(false);
    };

    const handleRemoveBlock = (blockIndex: number) => {
        const updatedBlocks = innerBlocks.filter((_, idx) => idx !== blockIndex);
        setInnerBlocks(updatedBlocks);
        if (updatedBlocks.length === 0) {
            setIsCollapsed(true);
        }
    };

    return (
        <Block id={id} type="setup" position={position} code="void setup() {}" onMove={onMove}>
            <div className="block-header">Инициализация</div>
            <div
                className={`block-body ${isCollapsed ? "collapsed" : ""} ${isHovered ? "drag-over" : ""} ${
                    innerBlocks.length === 0 ? "empty" : ""
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {innerBlocks.length === 0 ? (
                    <p>Перетащите блоки сюда</p>
                ) : (
                    innerBlocks.map((block, index) => (
                        <div key={block.id} className="draggable-block" draggable>
                            {`Block ${index + 1}`}
                            <button onClick={() => handleRemoveBlock(index)}>Удалить</button>
                        </div>
                    ))
                )}
            </div>
        </Block>
    );
};

export default SetupBlock;
