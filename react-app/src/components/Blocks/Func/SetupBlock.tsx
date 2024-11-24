import React, { useState, useEffect } from "react";
import Block from "../BlockTemplate";
import "./SetupBlock.css";

interface SetupBlockProps {
    id: string;
    position: { x: number; y: number };
    onMove: (id: string, position: { x: number; y: number }) => void;
    onNest: (parentId: string, childId: string) => void; // Notify workspace of nesting
    onUnnest: (parentId: string, childId: string) => void; // Notify workspace of unnesting
    code: string;
    childrenBlocks: string[]; // IDs of nested blocks
}

const SetupBlock: React.FC<SetupBlockProps> = ({
    id,
    position,
    onMove,
    onNest,
    onUnnest,
    code,
    childrenBlocks,
}) => {
    const [localChildren, setLocalChildren] = useState<string[]>(childrenBlocks);

    // Sync local state with props for reactive updates
    useEffect(() => {
        setLocalChildren(childrenBlocks);
        console.log(`[SetupBlock ${id}] Updated childrenBlocks:`, childrenBlocks);
    }, [childrenBlocks]);

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        const childId = event.dataTransfer.getData("blockId");
        if (childId && !localChildren.includes(childId)) {
            console.log(`[SetupBlock ${id}] Adding child: ${childId}`);
            onNest(id, childId); // Notify workspace of nesting
        }
    };

    const handleRemoveChild = (childId: string) => {
        console.log(`[SetupBlock ${id}] Removing child: ${childId}`);
        onUnnest(id, childId); // Notify workspace of unnesting
    };

    return (
        <Block id={id} type="setup" position={position} code={code} onMove={onMove}>
            <div className="block-header">Инициализация</div>
            <div
                className="block-body"
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {localChildren.length === 0 ? (
                    <p>Перетащите блоки сюда</p>
                ) : (
                    localChildren.map((childId) => (
                        <div key={childId} className="child-block">
                            {`Block ${childId}`}
                            <button onClick={() => handleRemoveChild(childId)}>Удалить</button>
                        </div>
                    ))
                )}
            </div>
        </Block>
    );
};

export default SetupBlock;
