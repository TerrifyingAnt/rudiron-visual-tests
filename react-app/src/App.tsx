import React from "react";
import Workspace from "./components/Workspace";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App: React.FC = () => {
    return (
      <DndProvider backend={HTML5Backend}>
        <Workspace />
      </DndProvider>
    );
};

export default App;
