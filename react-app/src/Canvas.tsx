import React from 'react';
import { useDrop, DropTargetMonitor } from 'react-dnd';

interface DragItem {
  type: string;
}

const Canvas: React.FC = () => {
  const [, drop] = useDrop<
    DragItem,
    void,
    unknown
  >({
    accept: 'block',
    drop: (item: DragItem, monitor: DropTargetMonitor) => {
      const offset = monitor.getClientOffset();
      console.log('Dropped at: ', offset);
    },
  });

  return (
    <div
      ref={drop}
      style={{
        width: '100%',
        height: '500px',
        border: '1px solid black',
        position: 'relative',
      }}
    >
      {/* Здесь можно отобразить перетаскиваемые блоки */}
    </div>
  );
};

export default Canvas;
