import React, { useState } from "react";
import Block from "./BlockTemplate";

interface SetupBlockProps {
    id: string;
    position: { x: number; y: number };
    onMove: (id: string, position: { x: number; y: number }) => void;
}

const SetupBlock: React.FC<SetupBlockProps> = ({ id, position, onMove }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleDragEnter = () => setIsHovered(true);
    const handleDragLeave = () => setIsHovered(false);

    return (
        <Block id={id} type="setup" position={position} code="void setup() {}" onMove={onMove}>
            <div
                className="block-header"
                style={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "5px 5px 0 0",
                    textAlign: "center",
                    fontWeight: "bold",
                }}
            >
                Инициализация
            </div>
            <div
                className="block-body"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                style={{
                    border: isHovered ? "3px solid #ff9800" : "2px dashed #ccc",
                    borderRadius: "0 0 5px 5px",
                    padding: "15px",
                    backgroundColor: "#f1f1f1",
                    minHeight: "100px",
                    transition: "border 0.2s ease",
                }}
            >
                {/* Сюда можно вложить другие блоки */}
                {isHovered ? (
                    <p style={{ color: "#ff9800", fontWeight: "bold", textAlign: "center" }}>
                        Отпустите, чтобы вложить
                    </p>
                ) : (
                    <p style={{ color: "#aaa", textAlign: "center" }}>Перетащите блоки сюда</p>
                )}
            </div>
        </Block>
    );
};

export default SetupBlock;
