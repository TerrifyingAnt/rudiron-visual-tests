import React, { useState, useRef } from "react";
import Menu from "./Sidebar";
import VariableBlock from "../components/Blocks/Var/VariableBlock";
import VariableSelectorBlock from "../components/Blocks/Var/VariableSelectorBlock";
import SetupBlock from "../components/Blocks/Func/SetupBlock";
import SerialInitBlock from "../components/Blocks/SerialPort/SerialPortInit";
import PinModeBlock from "../components/Blocks/IO/PinModeBlock";
import DigitalReadBlock from "../components/Blocks/IO/DigitalReadBlock";
import DigitalWriteBlock from "../components/Blocks/IO/DigitalWriteBlock";
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
                    onCodeChange: (blockId: string, innerCode: string[]) => {
                        updateBlockCode(blockId, innerCode.join("\n")); // Convert string[] to string
                    },
                }),
            },
        ]);
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
        // Helper function to recursively generate code for a block and its children
        // const generateBlockCode = (blockId: string): string => {
        //     const block = blocks.find((b) => b.id === blockId);
        //     if (!block) return "";
    
        //     const { element, position } = block;
        //     const blockType = element.props.type;
        //     const children = element.props.childrenBlocks || [];
        //     const blockCode = element.props.code;
    
        //     // Generate code for child blocks recursively
        //     const childrenCode = children.map((childId: string) => generateBlockCode(childId)).join("\n");
    
        //     // Insert children code into the parent block's structure
        //     if (blockType === "setup") {
        //         return `void setup() {\n${childrenCode}\n}`;
        //     }
    
        //     return blockCode + (childrenCode ? `\n${childrenCode}` : "");
        // };
    
        let setupCode = "";
        let otherCode = "";
    
        blocks.forEach((block) => {
            console.log(block.element.props);
        });
    
        const finalCode = `${setupCode}\n${otherCode}`;
        console.log("Generated Code:\n", finalCode);
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
                    code={"int " + Date.now().toString() + " = 0;"} 
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
                    code="void setup() { // setup code }"
                    onNest={nestBlock}
                    onUnnest={unnestBlock}
                    onMove={moveBlock}
                    childrenBlocks={[]}
            
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
                    onCodeChange={updateBlockCode}
                />
            ),
        },
        {
            id: "pinmode",
            label: "Настройка Пина",
            createBlock: () => (
                <PinModeBlock
                    key={Date.now()}
                    id={Date.now().toString()}
                    position={{x: 0, y: 0}}
                    onMove={moveBlock}
                    code="pinMode(5, OUTPUT)"
                    onCodeChange={updateBlockCode}/>
            )
        },
        {
            id: "digital-read",
            label: "Чтение цифрового значения",
            createBlock: () => (
                <DigitalReadBlock
                    key={Date.now()}
                    id={Date.now().toString()}
                    position={{ x: 0, y: 0 }}
                    onMove={moveBlock}
                    code="digitalRead(D5);"
                    onCodeChange={updateBlockCode}
                />
            ),
        },
        {
            id: "digital-write",
            label: "Запись цифрового значения",
            createBlock: () => (
                <DigitalWriteBlock
                    key={Date.now()}
                    id={Date.now().toString()}
                    position={{ x: 0, y: 0 }}
                    onMove={moveBlock}
                    code="digitalWrite(D5, 1);"
                    onCodeChange={updateBlockCode}
                />
            ),
        }
    ];

    const moveBlock = (id: string, position: { x: number; y: number }) => {
        setBlocks((prevBlocks) =>
            prevBlocks.map((block) =>
                block.id === id ? { ...block, position } : block
            )
        );
    };

    const nestBlock = (parentId: string, childId: string) => {
        setBlocks((prevBlocks) =>
            prevBlocks.map((block) => {
                if (block.id === parentId) {
                    const childrenBlocks = block.element.props.childrenBlocks || [];
                    return {
                        ...block,
                        element: React.cloneElement(block.element, {
                            childrenBlocks: [...childrenBlocks, childId],
                        }),
                    };
                }
                if (block.id === childId) {
                    return { ...block, parentId };
                }
                return block;
            })
        );
    };

    const unnestBlock = (parentId: string, childId: string) => {
        setBlocks((prevBlocks) =>
            prevBlocks.map((block) => {
                if (block.id === parentId) {
                    const childrenBlocks = block.element.props.childrenBlocks.filter(
                        (id: string) => id !== childId
                    );
                    return {
                        ...block,
                        element: React.cloneElement(block.element, {
                            childrenBlocks,
                        }),
                    };
                }
                if (block.id === childId) {
                    return { ...block, parentId: undefined };
                }
                return block;
            })
        );
    };

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
