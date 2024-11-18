import React, { useState, useRef } from "react";
import Block from "./BlockTemplate";

interface VariableBlockProps {
    id: string;
    position: { x: number; y: number };
    onMove: (id: string, position: { x: number; y: number }) => void;
}

const VariableBlock: React.FC<VariableBlockProps> = ({ id, position, onMove }) => {
    const [variableType, setVariableType] = useState("int");
    const [variableName, setVariableName] = useState(`var${id}`);
    const [isDragging, setIsDragging] = useState(false);
    const startPoint = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);

    const types = ["int", "float", "double", "char", "string", "bool"];

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            // If clicked on the workspace, enable panning
            setIsPanning(true);
            startPoint.current = { x: event.clientX - position.x, y: event.clientY - position.y };
        } else {
            // If clicked on a block, enable dragging
            event.stopPropagation();
            setIsDragging(true);
            startPoint.current = { x: event.clientX - position.x, y: event.clientY - position.y };
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (isDragging) {
            const newPosition = {
                x: event.clientX - startPoint.current.x,
                y: event.clientY - startPoint.current.y,
            };
            onMove(id, newPosition);
        } else if (isPanning) {
            const newOffset = {
                x: event.clientX - startPoint.current.x,
                y: event.clientY - startPoint.current.y,
            };
            onMove("workspace", newOffset); // Assuming workspace movement is handled
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsPanning(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setVariableType(event.target.value);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariableName(event.target.value);
    };
    const generateCode = (): string => {
        return `${variableType} ${variableName};`;
    };

    return (
        <Block
            id={id}
            type="variable"
            position={position}
            code={generateCode()}
            onMove={onMove}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    backgroundColor: "#4caf50",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    cursor: isDragging ? "grabbing" : isPanning ? "move" : "grab",
                }}
                onMouseDown={handleMouseDown}
            >
                <label style={{ display: "flex", alignItems: "center" }}>
                    Тип:
                    <select
                        value={variableType}
                        onChange={handleTypeChange}
                        style={{
                            marginLeft: "5px",
                            padding: "5px",
                            borderRadius: "3px",
                            border: "1px solid #ccc",
                        }}
                    >
                        {types.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>
                <label style={{ display: "flex", alignItems: "center" }}>
                    Название:
                    <input
                        type="text"
                        value={variableName}
                        onChange={handleNameChange}
                        placeholder={`var${id}`}
                        style={{
                            marginLeft: "5px",
                            padding: "5px",
                            borderRadius: "3px",
                            border: "1px solid #ccc",
                        }}
                    />
                </label>
            </div>
        </Block>
    );
};

export default VariableBlock;