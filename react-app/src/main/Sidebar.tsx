import React, { useState } from "react";
import "./menu.css";
import companyLogo from "./xd.png";

interface MenuProps {
    blocks: { id: string; label: string; createBlock: () => JSX.Element }[];
    onAddBlockToWorkspace: (block: JSX.Element) => void;
}

const Menu: React.FC<MenuProps> = ({ blocks, onAddBlockToWorkspace }) => {
    const [collapsedCategories, setCollapsedCategories] = useState<{
        [key: string]: boolean;
    }>({
        Функции: false,
        Циклы: false,
        "Дополнительно": false,
    });

    const [searchQuery, setSearchQuery] = useState(""); // Состояние для строки поиска

    // Функция для переключения состояния свёрнутой категории
    const toggleCategory = (category: string) => {
        setCollapsedCategories((prevState) => ({
            ...prevState,
            [category]: !prevState[category],
        }));
    };

    // Фильтрация блоков на основе строки поиска
    const filteredBlocks = blocks.filter((block) =>
        block.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="menu">
            {/* Логотип */}
            <img src={companyLogo} alt="Рудирон Education" className="menu-logo" />

            {/* Заголовок */}
            <h3>Блоки</h3>

            {/* Поле поиска */}
            <input
                type="text"
                className="menu-search"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Обновление строки поиска
            />

            {/* Категория: Функции */}
            <div className="menu-category" onClick={() => toggleCategory("Функции")}>
                Функции
                <span>{collapsedCategories["Функции"] ? "▲" : "▼"}</span>
            </div>
            {!collapsedCategories["Функции"] && (
                <div>
                    {filteredBlocks.map((block) => (
                        <div
                            key={block.id}
                            className="menu-item"
                            onClick={() => onAddBlockToWorkspace(block.createBlock())}
                        >
                            <span className="menu-item-label">
                                <span>{block.label}</span>
                            </span>
                            <span className="menu-item-info">
                                <span>2</span>
                                <i>ℹ️</i>
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Категория: Циклы */}
            <div className="menu-category" onClick={() => toggleCategory("Циклы")}>
                Циклы
                <span>{collapsedCategories["Циклы"] ? "▲" : "▼"}</span>
            </div>
            {!collapsedCategories["Циклы"] && (
                <div>
                    {blocks
                        .filter((block) => block.label === "for" || block.label === "while")
                        .filter((block) => block.label.toLowerCase().includes(searchQuery.toLowerCase())) // Применяем поиск
                        .map((block) => (
                            <div
                                key={block.id}
                                className="menu-item"
                                onClick={() => onAddBlockToWorkspace(block.createBlock())}
                            >
                                <span className="menu-item-label">
                                    <span>{block.label}</span>
                                </span>
                                <span className="menu-item-info">
                                    <span>2</span>
                                    <i>ℹ️</i>
                                </span>
                            </div>
                        ))}
                </div>
            )}

            {/* Новая пустая категория */}
            <div className="menu-category" onClick={() => toggleCategory("Дополнительно")}>
                Дополнительно
                <span>{collapsedCategories["Дополнительно"] ? "▲" : "▼"}</span>
            </div>
            {!collapsedCategories["Дополнительно"] && (
                <div>
                    <p style={{ color: "#bbb", fontSize: "12px", padding: "8px 16px" }}>
                        В этой категории пока нет блоков.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Menu;
