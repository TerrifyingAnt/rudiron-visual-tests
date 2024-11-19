import React, { useState, useRef } from "react";
import Draggable from 'react-draggable';

interface BlockProps {
    id: string;
    type: string;
    position: { x: number; y: number };
    code: string; // Code associated with the block
    children?: React.ReactNode;
    onMove: (id: string, position: { x: number; y: number }) => void;
}

const Block: React.FC<BlockProps> = ({ id, type, position, code, children, onMove }) => {

    return (
        <Draggable>
            <div
                className={`block ${type}`}
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
        </Draggable>
    );
};

export default Block;