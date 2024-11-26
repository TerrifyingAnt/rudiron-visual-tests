import React, { useState, useEffect } from "react";
import { useVariableContext } from "../Var/VariableContext";
import Block from "../BlockTemplate";
import "./ConditionBlock.css"; // Подключение CSS файла

interface IfBlockProps {
    id: string;
    position: { x: number; y: number };
    onMove: (id: string, position: { x: number; y: number }) => void;
    code: string; // Код передается в блок
    onCodeChange: (id: string, newCode: string) => void; // Колбэк для обновления кода
    onNest: (parentId: string, childId: string) => void; // Функция для добавления вложенного блока
    onUnnest: (parentId: string, childId: string) => void; // Функция для удаления вложенного блока
    childrenBlocks: string[]; // Список вложенных блоков
}

const IfBlock: React.FC<IfBlockProps> = ({
    id,
    position,
    onMove,
    code,
    onCodeChange,
    onNest,
    onUnnest,
    childrenBlocks,
}) => {
    const [leftOperand, setLeftOperand] = useState<string | null>(null); // Значение по умолчанию
    const [rightOperand, setRightOperand] = useState<string | null>(null); // Значение по умолчанию
    const [localChildren, setLocalChildren] = useState<string[]>(childrenBlocks);
    const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);

    // Доступные значения
    const numberOptions = [
        { label: "Кнопка 1", value: "35" },
        { label: "Кнопка 2", value: "31" },
        { label: "Кнопка 3", value: "32" },
    ];
    const highLowOptions = [
        { label: "Кнопка нажата", value: "HIGH" },
        { label: "Кнопка не нажата", value: "LOW" },
    ];

    // Генерация кода
    const generateCode = (): string => {
        if (leftOperand && rightOperand) {
            const conditionCode = `if (${leftOperand} == ${rightOperand}) {\n`;
            const childrenCode = localChildren.map((childId) => `    // Block ${childId}`).join("\n");
            return `${conditionCode}${childrenCode}\n}`;
        }
        return "// Не выбраны операнды";
    };

    // Синхронизация состояния с пропсами
    useEffect(() => {
        setLocalChildren(childrenBlocks);
    }, [childrenBlocks]);

    // Обновление кода
    useEffect(() => {
        const newCode = generateCode();
        if (typeof onCodeChange === "function") {
            onCodeChange(id, newCode);
        } else {
            console.warn("onCodeChange prop is missing or not a function.");
        }
    }, [leftOperand, rightOperand, localChildren, id, onCodeChange]);

    // Управление добавлением вложенных блоков
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const childId = event.dataTransfer.getData("blockId");
        if (childId && !localChildren.includes(childId)) {
            onNest(id, childId);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleRemoveChild = (childId: string) => {
        onUnnest(id, childId);
    };

    return (
        <Block
            id={id}
            type="if"
            position={position}
            code={generateCode()} // Генерация текущего кода
            onMove={isDraggingEnabled ? onMove : () => {}}
        >
            <div className="if-block">
                {/* Поля выбора на одной линии */}
                <div className="if-row">
                    {/* Левый операнд */}
                    <select
                        value={leftOperand || ""}
                        onChange={(e) => setLeftOperand(e.target.value)}
                        className="if-dropdown"
                        onFocus={() => setIsDraggingEnabled(false)}
                        onBlur={() => setIsDraggingEnabled(true)}
                    >
                        <option value="" disabled>
                            Выберите кнопку
                        </option>
                        {numberOptions.map(({ label, value }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>

                    {/* Правый операнд */}
                    <select
                        value={rightOperand || ""}
                        onChange={(e) => setRightOperand(e.target.value)}
                        className="if-dropdown"
                        onFocus={() => setIsDraggingEnabled(false)}
                        onBlur={() => setIsDraggingEnabled(true)}
                    >
                        <option value="" disabled>
                            Выберите состояние
                        </option>
                        {highLowOptions.map(({ label, value }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Контейнер для вложенных блоков */}
                <div
                    className={`if-body ${localChildren.length === 0 ? "empty" : ""}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {localChildren.length === 0 ? (
                        <p className="if-placeholder">Перетащите блоки сюда</p>
                    ) : (
                        localChildren.map((childId) => (
                            <div key={childId} className="draggable-block">
                                {`Block ${childId}`}
                                <button onClick={() => handleRemoveChild(childId)}>Удалить</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Block>
    );
};

export default IfBlock;
