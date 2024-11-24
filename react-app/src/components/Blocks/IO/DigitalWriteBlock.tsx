import React, { useState, useEffect } from "react";
import Block from "../BlockTemplate";
import "./DigitalWriteBlock.css"; // Стили для блока

interface DigitalWriteBlockProps {
    id: string;
    position: { x: number; y: number };
    onMove: (id: string, position: { x: number; y: number }) => void;
    code: string; // Генерируемый код
    onCodeChange: (id: string, newCode: string) => void; // Callback для обновления кода
}

const DigitalWriteBlock: React.FC<DigitalWriteBlockProps> = ({
    id,
    position,
    onMove,
    code,
    onCodeChange,
}) => {
    const [selectedPin, setSelectedPin] = useState<string | null>(null);
    const [selectedValue, setSelectedValue] = useState<string | null>("HIGH");
    const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);

    // Доступные пины для Arduino
    const availablePins = ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "A0", "A1", "A2", "A3", "A4", "A5"];

    // Генерация кода `digitalWrite(pin, value)`
    const generateCode = (pin: string | null, value: string | null): string => {
        return pin && value ? `digitalWrite(${pin}, ${value});` : "// No pin or value selected";
    };

    // Обновление выбранного пина
    const handlePinChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const pin = event.target.value;
        setSelectedPin(pin);

        const newCode = generateCode(pin, selectedValue);
        if (typeof onCodeChange === "function") {
            onCodeChange(id, newCode); // Сообщение родителю о смене кода
        }
    };

    // Обновление выбранного значения (HIGH/LOW)
    const handleValueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedValue(value);

        const newCode = generateCode(selectedPin, value);
        if (typeof onCodeChange === "function") {
            onCodeChange(id, newCode); // Сообщение родителю о смене кода
        }
    };

    // Управление перетаскиванием
    const disableDragging = () => setIsDraggingEnabled(false);
    const enableDragging = () => setIsDraggingEnabled(true);

    useEffect(() => {
        // Обновляем код, если выбранные пин или значение изменяются
        if (selectedPin && selectedValue) {
            const newCode = generateCode(selectedPin, selectedValue);
            onMove(id, { ...position });
        }
    }, [selectedPin, selectedValue, id, position, onMove]);

    return (
        <Block
            id={id}
            type="digital-write"
            position={position}
            code={generateCode(selectedPin, selectedValue)} // Генерация текущего кода
            onMove={isDraggingEnabled ? onMove : () => {}}
        >
            <div className="digital-write-block">
                <div className="digital-write-row">
                    <div className="digital-write-pin-selector">
                        <label className="digital-write-pin-label">Пин</label>
                        <select
                            value={selectedPin || ""}
                            onChange={handlePinChange}
                            className="digital-write-pin-selector-dropdown"
                            onFocus={disableDragging}
                            onBlur={enableDragging}
                        >
                            <option value="" disabled>
                                Выберите пин
                            </option>
                            {availablePins.map((pin) => (
                                <option key={pin} value={pin}>
                                    {pin}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="digital-write-value-selector">
                        <label className="digital-write-value-label">Значение</label>
                        <select
                            value={selectedValue || ""}
                            onChange={handleValueChange}
                            className="digital-write-value-selector-dropdown"
                            onFocus={disableDragging}
                            onBlur={enableDragging}
                        >
                            <option value="1">HIGH</option>
                            <option value="0">LOW</option>
                        </select>
                    </div>
                </div>
            </div>
        </Block>
    );
};

export default DigitalWriteBlock;
