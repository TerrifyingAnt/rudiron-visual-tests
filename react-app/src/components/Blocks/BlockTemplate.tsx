import React, { useState, useRef } from "react";

interface BlockProps {
    id: string;
    type: string;
    position: { x: number; y: number };
    code: string; // Code associated with the block
    children?: React.ReactNode;
    onMove: (id: string, position: { x: number; y: number }) => void;
}

const Block: React.FC<BlockProps> = ({ id, type, position, code, children, onMove }) => {
    const [isDragging, setIsDragging] = useState(false);
    const startPoint = useRef({ x: 0, y: 0 });

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation(); // Prevent workspace dragging
        setIsDragging(true);
        startPoint.current = { x: event.clientX - position.x, y: event.clientY - position.y };
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            const newPosition = {
                x: event.clientX - startPoint.current.x,
                y: event.clientY - startPoint.current.y,
            };
            onMove(id, newPosition);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            className={`block ${type}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                cursor: "grab",
                userSelect: "none", // Отключает выделение текста при перетаскивании
                padding: "10px",
                borderRadius: "5px", // Радиус углов блока
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Тень блока
            }}
        >
            <div className="block-content">
                {children || type}
            </div>
        </div>
    );
};

export default Block;