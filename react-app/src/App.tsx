import React from "react";
import Workspace from "./components/Workspace";
import { VariableProvider } from "./components/Blocks/VariableContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App: React.FC = () => {
    return (
      <DndProvider backend={HTML5Backend}>
        <VariableProvider>
            <Workspace />
        </VariableProvider>
      </DndProvider>
    );
};

export default App;
