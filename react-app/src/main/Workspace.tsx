import React, { useState, useRef } from "react";
import Menu from "./Sidebar";
import VariableBlock from "../components/Blocks/Var/VariableBlock";
import VariableSelectorBlock from "../components/Blocks/Var/VariableSelectorBlock";
import SetupBlock from "../components/Blocks/Func/SetupBlock";
import SerialInitBlock from "../components/Blocks/SerialPort/SerialPortInit";
import "../App.css";

const Workspace: React.FC = () => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [blocks, setBlocks] = useState<{ id: string; position: { x: number; y: number }; element: JSX.Element }[]>([]);
    const [isWorkspaceHovered, setIsWorkspaceHovered] = useState(false);
    const startPoint = useRef({ x: 0, y: 0 });
    const workspaceRef = useRef<HTMLDivElement>(null); // Ref for the workspace element

    const handleMouseDownCanvas = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).classList.contains("workspace")) {
            setIsPanning(true);
            startPoint.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
        }
    };

    const handleMouseMoveCanvas = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isPanning) {
            const newOffset = {
                x: event.clientX - startPoint.current.x,
                y: event.clientY - startPoint.current.y,
            };
            setOffset(newOffset);
        }
    };

    const handleMouseUpCanvas = () => {
        setIsPanning(false);
    };

    const addBlockToWorkspace = (block: JSX.Element, position: { x: number; y: number }) => {
        const id = `${Date.now()}`;
        setBlocks((prevBlocks) => [
            ...prevBlocks,
            {
                id,
                position,
                element: React.cloneElement(block, {
                    id,
                    position,
                    onMove: moveBlock,
                    onCodeChange: updateBlockCode, // Ensure it's passed
                }),
            },
        ]);
    };

    const moveBlock = (id: string, position: { x: number; y: number }) => {
        setBlocks((prevBlocks) =>
            prevBlocks.map((block) =>
                block.id === id
                    ? { ...block, position, element: React.cloneElement(block.element, { position }) }
                    : block
            )
        );
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsWorkspaceHovered(true);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        if (event.relatedTarget && (event.relatedTarget as HTMLElement).closest(".workspace") === null) {
            setIsWorkspaceHovered(false);
        }
    };

    const updateBlockCode = (id: string, newCode: string) => {
        setBlocks((prevBlocks) =>
            prevBlocks.map((block) =>
                block.id === id
                    ? {
                        ...block,
                        element: React.cloneElement(block.element, { code: newCode }),
                    }
                    : block
            )
        );
    };

    const generateCode = () => {
        let setupCode = "";
        let loopCode = "";

        const workspaceElement = workspaceRef.current;
        if (workspaceElement) {
            // Convert the HTMLCollection to an array
            const blocks = Array.from(workspaceElement.getElementsByClassName("draggable"));
            blocks.forEach((blockElement) => {
                const block = blockElement as HTMLElement;
                const top = parseInt(block.style.top || "0", 10);
                const code = block.dataset.code || "";
                console.log(block)
                setupCode += ` ${code}\n`
            });
        }

        console.log("Generated Code:\n", setupCode);
    };


    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsWorkspaceHovered(false);
    };

    const blockDefinitions = [
        {
            id: "variable",
            label: "Объявление переменной",
            createBlock: () => (
                <VariableBlock
                    key={Date.now()}
                    id={Date.now().toString()}
                    position={{ x: 0, y: 0 }}
                    onMove={moveBlock}
                    code="int myVariable = 10;"
                    onCodeChange={updateBlockCode} // Ensure this is passed
                />
            ),
        },
        {
            id: "variable-selector",
            label: "Выбор переменной",
            createBlock: () => (
                <VariableSelectorBlock
                    key={Date.now()}
                    id={Date.now().toString()}
                    position={{ x: 0, y: 0 }}
                    onMove={moveBlock}
                    code="myVariable"
                    onCodeChange={updateBlockCode}
                />
            ),
        },
        {
            id: "setup",
            label: "Функция инициализации",
            createBlock: () => (
                <SetupBlock
                    key={Date.now()}
                    id={Date.now().toString()}
                    position={{ x: 0, y: 0 }}
                    onMove={moveBlock}
                    code="void setup() { // setup code }"
                />
            ),
        },
        {
            id: "serial-init",
            label: "Инициализация Serial",
            createBlock: () => (
                <SerialInitBlock
                    key={Date.now()}
                    id={Date.now().toString()}
                    position={{ x: 0, y: 0 }}
                    onMove={moveBlock}
                    code="Serial.begin(9600);"
                />
            ),
        },
    ];

    return (
        <div className="app-container" style={{ display: "flex", height: "100vh" }}>
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
                ref={workspaceRef} // Attach the ref to the workspace div
                className={`workspace ${isWorkspaceHovered ? "drag-over" : ""}`}
                onMouseDown={handleMouseDownCanvas}
                onMouseMove={handleMouseMoveCanvas}
                onMouseUp={handleMouseUpCanvas}
                onMouseLeave={handleMouseUpCanvas}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    backgroundPosition: `${offset.x}px ${offset.y}px`,
                }}
            >
                {blocks.map((block) => (
                    <div
                        key={block.id}
                        className="draggable"
                        style={{
                            position: "absolute",
                            left: block.position.x + offset.x,
                            top: block.position.y + offset.y,
                        }}
                        data-code={block.element.props.code} // Attach code as a data attribute
                    >
                        {React.cloneElement(block.element, { onCodeChange: updateBlockCode })} {/* Ensure this */}
                    </div>
                ))}
            </div>
            <div style={{ padding: "10px", textAlign: "center" }}>
                <button
                    id="generateButton"
                    onClick={generateCode}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Generate Code
                </button>
            </div>
        </div>
    );
};

export default Workspace;
