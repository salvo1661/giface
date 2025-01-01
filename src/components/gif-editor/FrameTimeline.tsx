import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { GifFrame } from '@/types/gif';
import type { Translations } from '@/i18n/translations';

interface FrameTimelineProps {
  t: Translations;
  frames: GifFrame[];
  selectedFrameId: string | null;
  currentFrameIndex: number;
  onSelectFrame: (id: string, index: number) => void;
  onDeleteFrame: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
}

function SortableFrame({
  frame,
  index,
  isSelected,
  isCurrent,
  onSelect,
  onDelete,
}: {
  frame: GifFrame;
  index: number;
  isSelected: boolean;
  isCurrent: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: frame.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`frame-thumb flex-shrink-0 group ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="relative">
        <img
          src={frame.dataUrl}
          alt={`Frame ${index + 1}`}
          className="h-16 w-auto rounded"
          draggable={false}
        />
        {isCurrent && (
          <div className="absolute inset-0 rounded border-2 border-accent pointer-events-none" />
        )}
        <button
          className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X className="h-3 w-3" />
        </button>
        <span className="absolute bottom-0.5 left-1 text-[9px] font-mono text-foreground bg-background/70 px-1 rounded">
          {index + 1}
        </span>
      </div>
    </div>
  );
}

export function FrameTimeline({
  t,
  frames,
  selectedFrameId,
  currentFrameIndex,
  onSelectFrame,
  onDeleteFrame,
  onReorder,
}: FrameTimelineProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id));
    }
  };

  if (frames.length === 0) {
    return (
      <div className="h-24 border-t border-border bg-card flex items-center justify-center text-xs text-muted-foreground">
        {t.timelineEmpty}
      </div>
    );
  }

  return (
    <div className="h-24 border-t border-border bg-card">
      <ScrollArea className="h-full w-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={frames.map(f => f.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex items-center gap-2 px-3 py-2 h-full">
              {frames.map((frame, i) => (
                <SortableFrame
                  key={frame.id}
                  frame={frame}
                  index={i}
                  isSelected={frame.id === selectedFrameId}
                  isCurrent={i === currentFrameIndex}
                  onSelect={() => onSelectFrame(frame.id, i)}
                  onDelete={() => onDeleteFrame(frame.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
