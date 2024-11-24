import React, { useState, useRef } from "react";
import Menu from "./Sidebar";
import VariableBlock from "../components/Blocks/Var/VariableBlock";
import VariableSelectorBlock from "../components/Blocks/Var/VariableSelectorBlock";
import SetupBlock from "../components/Blocks/Func/SetupBlock";
import SerialInitBlock from "../components/Blocks/SerialPort/SerialPortInit";
import PinModeBlock from "../components/Blocks/IO/PinModeBlock";
import DigitalReadBlock from "../components/Blocks/IO/DigitalReadBlock";
import DigitalWriteBlock from "../components/Blocks/IO/DigitalWriteBlock";
import LoopBlock from "../components/Blocks/Func/LoopBlock"
import DelayBlock from "../components/Blocks/Condition/DelayBlock";
import { useBlockContext } from "../components/Blocks/Var/BlockContext"; // Импорт контекста блоков


import "../App.css";

const Workspace: React.FC = () => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [blocks, setBlocks] = useState<{ id: string; position: { x: number; y: number }; element: JSX.Element }[]>([]);
    const [isWorkspaceHovered, setIsWorkspaceHovered] = useState(false);
    const startPoint = useRef({ x: 0, y: 0 });
    const workspaceRef = useRef<HTMLDivElement>(null); // Ref for the workspace element
    const { blocksArray } = useBlockContext(); // Получаем массив блоков из контекста


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

    const { addBlock } = useBlockContext(); // Получаем метод addBlock из контекста

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
                    onCodeChange: (blockId: string, newCode: string) => {
                        updateBlockCode(blockId, newCode);
                    },
                }),
            },
        ]);

        // Добавляем блок в контекст
        addBlock(id, block.props.type || "unknown", block.props.code || "");
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

    function extractSetupAndLoop(input: string): string {
        // Regular expressions to match setup and loop blocks
        const setupRegex = /setup\s*\(\s*\)\s*{([\s\S]*?)}/;
        const loopRegex = /loop\s*\(\s*\)\s*{([\s\S]*?)}/;
    
        // Find matches for setup and loop
        const setupMatch = input.match(setupRegex);
        const loopMatch = input.match(loopRegex);
    
        // Extract the content inside the curly braces if matches are found
        const setupContent = setupMatch ? setupMatch[0] : '';
        const loopContent = loopMatch ? loopMatch[0] : '';
    
        // Combine setup and loop contents into the desired result
        const result = `${setupContent}\n\n${loopContent}`;
    
        return result;
    }
    
    

    const generateCode = () => {
        let currentCode = "";

        const generateBlockCode = (blockId: string): string => {
            const block = blocks.find((b) => b.id === blockId);
            if (!block) return ""; // Если блок не найден, ничего не делаем.

            const blockCode = block.element.props.code || ""; // Получаем код текущего блока.
            const children = block.element.props.childrenBlocks || []; // Получаем дочерние блоки.

            // Рекурсивно генерируем код для дочерних блоков.
            const childrenCode = children.map((childId: string) => generateBlockCode(childId)).join("\n");

            // Формируем блок кода с вложенными дочерними блоками.
            if (children.length > 0) {
                return `${blockCode} {\n${childrenCode}\n}`;
            } else {
                return blockCode;
            }
        };

        blocks.forEach((block) => {
            // Если блок не имеет родительского элемента, начинаем с него.
            if (!block.element.props.parentId) {
                currentCode += generateBlockCode(block.id) + "\n"; // Начинаем с корневых блоков.
            }
        });
        console.log("Generated Arduino Code:\n", currentCode.trim());
        const optimizedCode: string = extractSetupAndLoop(currentCode.trim());
        console.log("Generated Arduino Code:\n", optimizedCode);

        // Возвращаем результат
        return optimizedCode;
    };


    
    const handleRightClick = (blockId: string, event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== blockId));
    };



    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsWorkspaceHovered(false);
    };
    const blockDefinitions = [
        {
            id: "delay",
            label: "Задержка",
            createBlock: () => (
                <DelayBlock
                    key={Date.now()}
                    id={Date.now().toString()}
                    position={{ x: 0, y: 0 }}
                    onMove={moveBlock}
                    code={"delay(100);"}
                    onCodeChange={updateBlockCode} // Ensure this is passed
                />
            ),
        },
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
                    code="setup()"
                    onNest={nestBlock}
                    onUnnest={unnestBlock}
                    onMove={moveBlock}
                    childrenBlocks={[]}

                />
            ),
        },
        {
            id: "loop",
            label: "Основная функция",
            createBlock: () => (
                <LoopBlock
                    key={Date.now()}
                    id={Date.now().toString()}
                    position={{ x: 0, y: 0 }}
                    code="loop()"
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
                    position={{ x: 0, y: 0 }}
                    onMove={moveBlock}
                    code="pinMode(5, OUTPUT);"
                    onCodeChange={updateBlockCode} />
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
        console.log("BBBB")
        setBlocks((prevBlocks) =>
            prevBlocks.map((block) => {
                if (block.id === parentId) {
                    console.log("AAAAAAA")
                    const currentChildren = block.element.props.childrenBlocks || [];
                    const uniqueChildren = Array.from(
                        new Set(currentChildren.concat(childId))
                    ); // Используем Array.from и concat
                    return {
                        ...block,
                        element: React.cloneElement(block.element, {
                            childrenBlocks: uniqueChildren,
                        }),
                    };
                }
                return block;
            })
        );
    };


    const unnestBlock = (parentId: string, childId: string) => {
        setBlocks((prevBlocks) =>
            prevBlocks.map((block) => {
                if (block.id === parentId) {
                    const currentChildren = block.element.props.childrenBlocks || [];
                    return {
                        ...block,
                        element: React.cloneElement(block.element, {
                            childrenBlocks: currentChildren.filter((id: string) => id !== childId),
                        }),
                    };
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
                        onContextMenu={(e) => handleRightClick(block.id, e)}
                        style={{
                            position: "absolute",
                            left: block.position.x + offset.x,
                            top: block.position.y + offset.y,
                        }}
                        data-code={block.element.props.code}
                    >
                        {React.cloneElement(block.element, { onCodeChange: updateBlockCode })}
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
