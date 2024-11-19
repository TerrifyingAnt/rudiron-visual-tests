import React, { useState, useEffect } from "react";
import { useVariableContext } from "./VariableContext";
import Block from "./BlockTemplate";

interface VariableBlockProps {
    id: string;
    position: { x: number; y: number };
    onMove: (id: string, position: { x: number; y: number }) => void;
}

const VariableBlock: React.FC<VariableBlockProps> = ({ id, position, onMove }) => {
    const typeMapping = {
        int: "Целое число",
        float: "Число с плавающей точкой",
        double: "Двойная точность",
        char: "Символ",
        string: "Строка",
        bool: "Логический тип",
    };

    const [variableType, setVariableType] = useState("int");
    const [variableName, setVariableName] = useState(`var${id}`);
    const [hasConflict, setHasConflict] = useState(false);
    const [isNameInvalid, setIsNameInvalid] = useState(false);
    const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);
    const { variables, updateVariable } = useVariableContext();

    useEffect(() => {
        updateVariable(id, variableName);
    }, [variableName, id, updateVariable]);

    useEffect(() => {
        const conflict = variables.some(
            (variable) => variable.name === variableName && variable.id !== id
        );
        setHasConflict(conflict);
    }, [variables, variableName, id]);

    const validateName = (name: string) => {
        const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        setIsNameInvalid(!regex.test(name));
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setVariableType(event.target.value);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        setVariableName(newName);
        validateName(newName);
    };

    const generateCode = (): string => {
        return `${variableType} ${variableName};`;
    };

    const disableDragging = () => setIsDraggingEnabled(false);
    const enableDragging = () => setIsDraggingEnabled(true);

    const noop = () => {};

    return (
        <Block
            id={id}
            type="variable"
            position={position}
            code={generateCode()}
            onMove={isDraggingEnabled ? onMove : noop}
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
                    border: hasConflict || isNameInvalid ? "2px solid red" : "2px solid transparent",
                    cursor: isDraggingEnabled ? "grab" : "default",
                }}
            >
                <label style={{ display: "flex", alignItems: "center" }}>
                    Тип:
                    <select
                        value={variableType}
                        onChange={handleTypeChange}
                        onFocus={disableDragging}
                        onBlur={enableDragging}
                        style={{
                            marginLeft: "5px",
                            padding: "5px",
                            borderRadius: "3px",
                            border: "1px solid #ccc",
                        }}
                    >
                        {Object.entries(typeMapping).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
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
                        onFocus={disableDragging}
                        onBlur={enableDragging}
                        onMouseDown={(event) => event.stopPropagation()} // Отключаем перетаскивание при выделении текста
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
