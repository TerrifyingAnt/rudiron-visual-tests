import React from "react";

interface MenuProps {
    blocks: { id: string; label: string; createBlock: () => JSX.Element }[];
    onAddBlockToWorkspace: (block: JSX.Element) => void;
}

const Menu: React.FC<MenuProps> = ({ blocks, onAddBlockToWorkspace }) => {
    return (
        <div className="menu" style={{ padding: "10px"}}>
            <h3>Блоки</h3>
            {blocks.map((block) => (
                <div
                    key={block.id}
                    className="menu-item"
                    onClick={() => onAddBlockToWorkspace(block.createBlock())}
                    style={{
                        padding: "10px",
                        marginBottom: "10px",
                        backgroundColor: "#4caf50",
                        color: "white",
                        borderRadius: "5px",
                        textAlign: "center",
                        cursor: "pointer",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        userSelect: "none",
                    }}
                >
                    <div style={{ fontSize: "14px", fontWeight: "bold" }}>{block.label}</div>
                </div>
            ))}
        </div>
    );
};

export default Menu;
