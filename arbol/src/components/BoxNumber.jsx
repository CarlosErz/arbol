import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export function BoxNumber() {
  const [numbers, setNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [binaryTree, setBinaryTree] = useState([]);

  useEffect(() => {
    const generatedNumbers = [];
    for (let i = 0; i < 5; i++) {
      generatedNumbers.push({ id: `item-${i}`, content: Math.floor(Math.random() * 100) + 1 });
    }
    setNumbers(generatedNumbers);
  }, []);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const validateBinaryTree = (tree) => {
    for (let i = 0; i < tree.length; i++) {
      const leftChildIndex = 2 * i + 1;
      const rightChildIndex = 2 * i + 2;

      if (leftChildIndex < tree.length && tree[leftChildIndex] > tree[i]) {
        return false;
      }

      if (rightChildIndex < tree.length && tree[rightChildIndex] > tree[i]) {
        return false;
      }
    }

    return true;
  };

  return (
    <DragDropContext
      onDragEnd={(result) => {
        const { destination, source } = result;

        if (!destination) {
          return;
        }

        if (destination.index === source.index && destination.droppableId === source.droppableId) {
          return;
        }

        const newNumbers = reorder(numbers, source.index, destination.index);
        setNumbers(newNumbers);

        const newSelectedNumbers = newNumbers.slice(0, 5).map((item) => item.content);
        setSelectedNumbers(newSelectedNumbers);

        const newBinaryTree = newSelectedNumbers.slice().sort((a, b) => b - a);
        setBinaryTree(newBinaryTree);
      }}
    >
      <div className="Contenedor">
        <Droppable droppableId="content">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="box_number"
            >
              {numbers.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(DraggableProvided) => (
                    <li
                      {...DraggableProvided.draggableProps}
                      {...DraggableProvided.dragHandleProps}
                      ref={DraggableProvided.innerRef}
                    >
                      {item.content}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </div>
      <div className="tree">
        <div className="binary_tree" id="lf">
          {selectedNumbers.map((item, index) => (
            <Droppable key={index} droppableId={`node-${index}`}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="node"
                >
                  {item}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
      {validateBinaryTree(binaryTree) ? (
        <div className="valid_tree">Árbol binario de heap sort válido</div>
      ) : (
        <div className="invalid_tree">Árbol binario de heap sort no válido</div>
      )}
    </DragDropContext>
  );
      }