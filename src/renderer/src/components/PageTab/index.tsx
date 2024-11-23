import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
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
import { TabProvider } from "@renderer/hooks/TabContext";

export const PageTab = ({ id, name, onRemove }: { id: string; name: string; onRemove: (id: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TabsTrigger className="flex items-center gap-2 h-8" key={id} value={id} asChild>
        <div>
          <Button variant="ghost" className="cursor-move" {...listeners}>
            <GripVertical />
          </Button>
          <span className="truncate">{name}</span>

          <Button variant={"ghost"} onClick={() => onRemove(id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </TabsTrigger>
    </div>
  );
};

export const PageTabs = () => {
  const { activeTable, tabs, rearrangeTabs, removeTab, addNewTab } = useTableStore();

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
      const newIndex = tabs.findIndex((tab) => tab.id === over.id);

      rearrangeTabs(oldIndex, newIndex);
    }
  };

  const handleRemove = (id: string) => {
    removeTab(id);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <Tabs defaultValue={tabs[0]?.id}>
      <TabsList>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tabs} strategy={verticalListSortingStrategy}>
            {tabs.map((tab) => {
              return <PageTab key={tab.id} id={tab.id} name={tab.name} onRemove={handleRemove} />;
            })}
          </SortableContext>

          <Button className="h-8 w-8 ml-2" variant="outline" onClick={() => addNewTab()}>
            <Plus />
          </Button>
        </DndContext>
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <TabProvider value={{ tab }}>{activeTable && <QueryBuilder />}</TabProvider>
        </TabsContent>
      ))}
    </Tabs>
  );
};
