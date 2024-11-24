import React, { useState, useEffect } from "react";
import Block from "../BlockTemplate";
import "./DigitalReadBlock.css"; // Стили для блока

interface DigitalReadBlockProps {
    id: string;
    position: { x: number; y: number };
    onMove: (id: string, position: { x: number; y: number }) => void;
    code: string; // Генерируемый код
    onCodeChange: (id: string, newCode: string) => void; // Callback для обновления кода
}

const DigitalReadBlock: React.FC<DigitalReadBlockProps> = ({
    id,
    position,
    onMove,
    code,
    onCodeChange,
}) => {
    const [selectedPin, setSelectedPin] = useState<string | null>(null);
    const [isDraggingEnabled, setIsDraggingEnabled] = useState(true);

    // Доступные пины для Arduino
    const availablePins = ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "A0", "A1", "A2", "A3", "A4", "A5"];

    // Генерация кода `digitalRead(pin)`
    const generateCode = (pin: string | null): string => {
        return pin ? `digitalRead(${pin});` : "// No pin selected";
    };

    // Обновление выбранного пина
    const handlePinChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const pin = event.target.value;
        setSelectedPin(pin);

        const newCode = generateCode(pin);
        if (typeof onCodeChange === "function") {
            onCodeChange(id, newCode); // Сообщение родителю о смене кода
        }
    };

    // Управление перетаскиванием
    const disableDragging = () => setIsDraggingEnabled(false);
    const enableDragging = () => setIsDraggingEnabled(true);

    useEffect(() => {
        // Обновляем код, если выбранный пин изменяется
        if (selectedPin) {
            const newCode = generateCode(selectedPin);
            onMove(id, { ...position });
        }
    }, [selectedPin, id, position, onMove]);

    return (
        <Block
            id={id}
            type="digital-read"
            position={position}
            code={generateCode(selectedPin)} // Генерация текущего кода
            onMove={isDraggingEnabled ? onMove : () => {}}
        >
            <div className="digital-read-block">
                <label className="digital-read-pin-label">Пин</label>
                <select
                    value={selectedPin || ""}
                    onChange={handlePinChange}
                    className="digital-read-pin-selector-dropdown"
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
        </Block>
    );
};

export default DigitalReadBlock;
