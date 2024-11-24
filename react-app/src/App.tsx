import React from "react";
import Workspace from "./main/Workspace";
import { VariableProvider } from "./components/Blocks/Var/VariableContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App: React.FC = () => {
    return (
        <VariableProvider>
            <DndProvider backend={HTML5Backend}>
                <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                    
                    <main style={{ flex: 1, position: "relative" }}>
                        <Workspace />
                    </main>
                </div>
            </DndProvider>
        </VariableProvider>
    );
};

export default App;
