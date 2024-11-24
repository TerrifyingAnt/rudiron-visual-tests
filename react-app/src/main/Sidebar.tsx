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
        Условия: false,
        "Основные функции": false,
        Переменные: false,
    });

    const [searchQuery, setSearchQuery] = useState(""); // Состояние для строки поиска

    // Типизация категорий
    const categories: Record<"Условия" | "Основные функции" | "Переменные" | "Чтение/Запись" | "Монитор порта", string[]> = {
        "Условия": [],
        "Основные функции": ["setup", ], // Добавлен "digital-read"
        "Переменные": ["variable", "variable-selector"],
        "Чтение/Запись": ["digital-read", "digital-write", "pinmode"],
        "Монитор порта": ["serial-init"]
    };

    // Функция для переключения состояния свёрнутой категории
    const toggleCategory = (category: keyof typeof categories) => {
        setCollapsedCategories((prevState) => ({
            ...prevState,
            [category]: !prevState[category],
        }));
    };

    // Фильтрация блоков на основе строки поиска
    const filteredBlocks = blocks.filter((block) =>
        block.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Рендеринг блоков по категории
    const renderBlocksByCategory = (category: keyof typeof categories) =>
        filteredBlocks
            .filter((block) => categories[category].includes(block.id))
            .map((block) => (
                <div
                    key={block.id}
                    className={`menu-item menu-item-${category}`} // Добавлен класс для категории
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
            ));
    

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

            {/* Категория: Условия */}
            <div className="menu-category" onClick={() => toggleCategory("Условия")}>
                Условия
                <span>{collapsedCategories["Условия"] ? "▲" : "▼"}</span>
            </div>
            {!collapsedCategories["Условия"] && (
                <div>
                    <p style={{ color: "#bbb", fontSize: "12px", padding: "8px 16px" }}>
                        В этой категории пока нет блоков.
                    </p>
                </div>
            )}

            {/* Категория: Основные функции */}
            <div className="menu-category" onClick={() => toggleCategory("Основные функции")}>
                Основные функции
                <span>{collapsedCategories["Основные функции"] ? "▲" : "▼"}</span>
            </div>
            {!collapsedCategories["Основные функции"] && (
                <div>{renderBlocksByCategory("Основные функции")}</div>
            )}

            {/* Категория: Переменные */}
            <div className="menu-category" onClick={() => toggleCategory("Переменные")}>
                Переменные
                <span>{collapsedCategories["Переменные"] ? "▲" : "▼"}</span>
            </div>
            {!collapsedCategories["Переменные"] && (
                <div>{renderBlocksByCategory("Переменные")}</div>
            )}
            
            {/* Категория: Чтение/Запись */}
            <div className="menu-category" onClick={() => toggleCategory("Чтение/Запись")}>
            Чтение/Запись
                <span>{collapsedCategories["Чтение/Запись"] ? "▲" : "▼"}</span>
            </div>
            {!collapsedCategories["Чтение/Запись"] && (
                <div>{renderBlocksByCategory("Чтение/Запись")}</div>
            )}

            {/* Категория: Чтение/Запись */}
            <div className="menu-category" onClick={() => toggleCategory("Монитор порта")}>
            Монитор порта
                <span>{collapsedCategories["Монитор порта"] ? "▲" : "▼"}</span>
            </div>
            {!collapsedCategories["Монитор порта"] && (
                <div>{renderBlocksByCategory("Монитор порта")}</div>
            )}
        </div>
    );
};

export default Menu;
