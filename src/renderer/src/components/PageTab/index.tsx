import { useState } from "react";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { QueryBuilder } from "../QueryBuilder/QueryBuilder";
import { CSS } from "@dnd-kit/utilities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Tabs";
import useTableStore from "@renderer/store";
import { GripVertical, Plus, X } from "lucide-react";
import { Button } from "../Button";
import { id } from "@renderer/util/id";

export const PageTab = ({ id, label, onRemove }: { id: string; label: string; onRemove: (id: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TabsTrigger className="flex items-center gap-2 h-8" key={id} value={id}>
        <Button variant="ghost" className="cursor-move" {...listeners}>
          <GripVertical />
        </Button>
        <span className="truncate">{label}</span>

        <Button variant="ghost" onClick={() => onRemove(id)}>
          <X className="h-4 w-4" />
        </Button>
      </TabsTrigger>
    </div>
  );
};

export const PageTabs = () => {
  const { activeTable } = useTableStore();
  const [pages, setPages] = useState([{ id: id(), label: "My first tab" }]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((tab) => tab.id === active.id);
        const newIndex = items.findIndex((tab) => tab.id === over.id);

        console.log(oldIndex, newIndex);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemove = (id: string) => {
    const items = [...pages];
    const index = items.findIndex((tab) => tab.id === id);
    if (index > -1) {
      items.splice(index, 1);
    }
    setPages(items);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <Tabs defaultValue="1">
      <TabsList>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={pages} strategy={verticalListSortingStrategy}>
            {pages.map((tab) => {
              return <PageTab key={tab.id} id={tab.id} label={tab.label} onRemove={handleRemove} />;
            })}
          </SortableContext>

          <Button
            className="h-8 w-8 ml-2"
            variant="outline"
            onClick={() => setPages([...pages, { id: id(), label: "New" }])}
          >
            <Plus />
          </Button>
        </DndContext>
      </TabsList>

      {pages.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {activeTable && <QueryBuilder />}
        </TabsContent>
      ))}
    </Tabs>
  );
};
