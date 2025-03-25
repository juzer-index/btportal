import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Card from "./Card";
import "./Board.scss"; // Tell webpack that Button.js uses these styles

const List = ({ id, title, items }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="list"
        >
          <h3 className="list-title ">{title}</h3>
          {items.map((item, index) => (
            <Card
              key={item.id}
              text={item.content}
              index={index}
              draggableId={item.id}
            />
          ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default List;
