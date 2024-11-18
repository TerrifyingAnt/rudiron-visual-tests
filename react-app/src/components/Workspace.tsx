import React, { useState, useRef } from "react";
import Menu from "./Menu";
import VariableBlock from "./Blocks/VariableBlock";
import "../App.css";

const Workspace: React.FC = () => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [blocks, setBlocks] = useState<{ id: string; position: { x: number; y: number }; element: JSX.Element }[]>([]);
    const startPoint = useRef({ x: 0, y: 0 });

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsPanning(true);
        startPoint.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isPanning) {
            const newOffset = {
                x: event.clientX - startPoint.current.x,
                y: event.clientY - startPoint.current.y,
            };
            setOffset(newOffset);

            // Move all blocks with the workspace offset
            setBlocks((prevBlocks) =>
                prevBlocks.map((block) => ({
                    ...block,
                    position: {
                        x: block.position.x + (newOffset.x - offset.x),
                        y: block.position.y + (newOffset.y - offset.y),
                    },
                }))
            );
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const addBlockToWorkspace = (block: JSX.Element, position: { x: number; y: number }) => {
        const id = `${Date.now()}`;
        setBlocks((prevBlocks) => [
            ...prevBlocks,
            { id, position, element: React.cloneElement(block, { id, position }) },
        ]);
    };

    const moveBlock = (id: string, position: { x: number; y: number }) => {
        setBlocks((prevBlocks) =>
            prevBlocks.map((block) =>
                block.id === id ? { ...block, position, element: React.cloneElement(block.element, { position }) } : block
            )
        );
    };

    const blockDefinitions = [
        {
            id: "variable",
            label: "Объявление переменной", // Русское название блока
            createBlock: () => (
                <VariableBlock
                    key={Date.now()}
                    id={Date.now().toString()}
                    position={{ x: 0, y: 0 }}
                    onMove={moveBlock}
                />
            ),
        },
        // Можно добавить другие блоки с русскими названиями
    ];

    return (
        <div className="app-container">
            <Menu
                blocks={blockDefinitions.map((def) => ({
                    id: def.id,
                    label: def.label,
                    createBlock: def.createBlock,
                }))}
                onAddBlockToWorkspace={(block: JSX.Element) =>
                    addBlockToWorkspace(block, { x: 200, y: 200 })
                }
            />
            <div
                className="workspace"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                    cursor: isPanning ? "grabbing" : "grab",
                    backgroundPosition: `${offset.x}px ${offset.y}px`,
                    backgroundColor: "#2b2b2b",
                }}
            >
                {blocks.map((block) => (
                    <div
                        key={block.id}
                        style={{
                            position: "absolute",
                            left: block.position.x,
                            top: block.position.y,
                        }}
                    >
                        {block.element}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Workspace;
