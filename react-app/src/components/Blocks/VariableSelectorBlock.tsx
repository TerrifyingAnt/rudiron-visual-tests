import React, { useState } from "react";
import { useVariableContext } from "./VariableContext";
import Block from "./BlockTemplate";

interface VariableSelectorBlockProps {
    id: string;
    position: { x: number; y: number };
    onMove: (id: string, position: { x: number; y: number }) => void;
}

const VariableSelectorBlock: React.FC<VariableSelectorBlockProps> = ({ id, position, onMove }) => {
    const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
    const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);
    const { variables } = useVariableContext();

    // Получение уникальных имен переменных
    const uniqueVariables = Array.from(new Set(variables.map((variable) => variable.name)));

    const handleVariableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVariable(event.target.value);
    };

    const generateCode = (): string => {
        return selectedVariable ? `useVariable(${selectedVariable});` : "// No variable selected";
    };

    const disableDragging = () => setIsDraggingEnabled(false);
    const enableDragging = () => setIsDraggingEnabled(true);

    const noop = () => {};

    return (
        <Block
            id={id}
            type="variable-selector"
            position={position}
            code={generateCode()}
            onMove={isDraggingEnabled ? onMove : noop}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    backgroundColor: "#3f51b5",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    cursor: isDraggingEnabled ? "grab" : "default",
                    border: selectedVariable ? "2px solid transparent" : "2px solid red", // Красная обводка, если переменная не выбрана
                }}
            >
                <label style={{ display: "flex", alignItems: "center", flex: "1" }}>
                    Переменная:
                    <select
                        value={selectedVariable || ""}
                        onChange={handleVariableChange}
                        onFocus={disableDragging}
                        onBlur={enableDragging}
                        style={{
                            marginLeft: "5px",
                            padding: "5px",
                            borderRadius: "3px",
                            border: "1px solid #ccc",
                            width: "100px",
                        }}
                    >
                        <option value="" disabled>
                            Выберите
                        </option>
                        {uniqueVariables.map((variableName) => (
                            <option key={variableName} value={variableName}>
                                {variableName}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </Block>
    );
};

export default VariableSelectorBlock;
