import React from "react";
import { Draggable } from "react-beautiful-dnd";
import "./Board.scss"; // Tell webpack that Button.js uses these styles

const Card = ({ text, index, draggableId }) => {
  // console.log(
  //   `Rendering Card with text: ${text}, index: ${index}, draggableId: ${draggableId}`
  // );

  return (
    <Draggable draggableId={text} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="card"
        >
          {text}
        </div>
      )}
    </Draggable>
  );
};

export default Card;
