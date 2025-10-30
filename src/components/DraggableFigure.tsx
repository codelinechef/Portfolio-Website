import { motion } from 'framer-motion';
import { Code, Cpu, Database, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const icons = [Code, Cpu, Database, Zap];

interface Figure {
  id: string;
  icon: number;
  position: { x: number; y: number };
}

export const DraggableFigures = () => {
  const [figures, setFigures] = useState<Figure[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('draggable-figures');
    if (saved) {
      setFigures(JSON.parse(saved));
    } else {
      // Default figures
      setFigures([
        { id: '1', icon: 0, position: { x: 100, y: 100 } },
        { id: '2', icon: 1, position: { x: 200, y: 150 } },
      ]);
    }
  }, []);

  const saveFigures = (newFigures: Figure[]) => {
    localStorage.setItem('draggable-figures', JSON.stringify(newFigures));
    setFigures(newFigures);
  };

  const addFigure = () => {
    const newFigure: Figure = {
      id: Date.now().toString(),
      icon: Math.floor(Math.random() * icons.length),
      position: { x: Math.random() * 300, y: Math.random() * 300 },
    };
    saveFigures([...figures, newFigure]);
  };

  const removeFigure = (id: string) => {
    saveFigures(figures.filter(f => f.id !== id));
  };

  const updatePosition = (id: string, x: number, y: number) => {
    if (isLocked) return;
    const newFigures = figures.map(f =>
      f.id === id ? { ...f, position: { x, y } } : f
    );
    saveFigures(newFigures);
  };

  return (
    <>
      {/* Toolbar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2 glass-card p-3 rounded-full">
        <motion.button
          onClick={addFigure}
          className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Figure
        </motion.button>
        <motion.button
          onClick={() => setIsLocked(!isLocked)}
          className={`px-4 py-2 rounded-full font-medium text-sm ${
            isLocked ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-secondary-foreground'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLocked ? 'Locked' : 'Unlocked'}
        </motion.button>
        <motion.button
          onClick={() => saveFigures([])}
          className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-medium text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset
        </motion.button>
      </div>

      {/* Draggable Figures */}
      {figures.map((figure) => {
        const Icon = icons[figure.icon];
        return (
          <motion.div
            key={figure.id}
            drag={!isLocked}
            dragMomentum={false}
            dragElastic={0}
            onDragEnd={(_, info) => {
              updatePosition(
                figure.id,
                figure.position.x + info.offset.x,
                figure.position.y + info.offset.y
              );
            }}
            initial={figure.position}
            animate={figure.position}
            whileHover={{ scale: 1.1 }}
            whileDrag={{ scale: 1.2, zIndex: 50 }}
            className="fixed w-16 h-16 glass-card rounded-full flex items-center justify-center cursor-move group z-30"
            style={{
              left: figure.position.x,
              top: figure.position.y,
            }}
            onDoubleClick={() => removeFigure(figure.id)}
          >
            <Icon className="w-8 h-8 text-primary" />
            {!isLocked && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap bg-background px-2 py-1 rounded">
                Double-click to remove
              </div>
            )}
          </motion.div>
        );
      })}
    </>
  );
};
