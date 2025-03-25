import React, { useState } from "react";
import List from "./List";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "./Board.scss"; // Tell webpack that Button.js uses these styles
import { v4 as uuidv4 } from "uuid";

const Board = () => {
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) return;

    // Reordering in the same list
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(state[source.droppableId].items);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const newState = {
        ...state,
        [source.droppableId]: {
          ...state[source.droppableId],
          items,
        },
      };

      setState(newState);
    } else {
      // Moving between lists
      const sourceItems = Array.from(state[source.droppableId].items);
      const [removedItem] = sourceItems.splice(source.index, 1);
      const destinationItems = Array.from(state[destination.droppableId].items);
      destinationItems.splice(destination.index, 0, removedItem);

      const newState = {
        ...state,
        [source.droppableId]: {
          ...state[source.droppableId],
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...state[destination.droppableId],
          items: destinationItems,
        },
      };

      setState(newState);
    }
  };

  const [state, setState] = useState({
    todo: {
      title: "To Do",
      items: [
        { id: "1", content: "Task 1" },
        { id: "12", content: "Task 2" },
        { id: "13", content: "Task 3" },
        { id: "2", content: "Task 1" },
        { id: "22", content: "Task 233" },
      ],
    },
    inProgress: {
      title: "In Progress",
      items: [
        { id: "14", content: "Task 4" },
        { id: "15", content: "Task 5" },
        { id: "53", content: "Task 36" },
        { id: "73", content: "Task 37" },
      ],
    },
    completed: {
      title: "Completed",
      items: [
        { id: "16", content: "Task 6" },
        { id: "74", content: "Task 300" },
        { id: "75", content: "Task 39" },
        { id: "33", content: "Task 34" },
        { id: "43", content: "Task 35" },
      ],
    },
  });

  return (
    <div className="board" style={{ maxHeight: "400px" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <List id="todo" title="To Do" items={state.todo.items} />
        <List
          id="inProgress"
          title="In Progress"
          items={state.inProgress.items}
        />
        <List id="completed" title="Completed" items={state.completed.items} />
      </DragDropContext>
    </div>
  );
};

export default Board;
