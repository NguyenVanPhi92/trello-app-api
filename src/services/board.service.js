import { BoardModel } from "*/models/board.model";

const createNew = async (data) => {
  try {
    const result = await BoardModel.createNew(data);
    return result;
  } catch (error) {
    //dùng throw error để trả vế lỗi, như thế thì bên controller mới nhận được lỗi và in ra
    throw new Error(error);
  }
};

const getFullBoard = async (boardId) => {
  try {
    const board = await BoardModel.getFullBoard(boardId);

    if (!board || !board.columns) {
      throw new Error("Board not found!");
    }

    //Add card to each column
    await board.columns.forEach((column) => {
      column.cards = board.cards.filter(
        (c) => c.columnId.toString() === column._id.toString()
      );
    });

    // remove cards data from board when return
    delete board.cards;

    return board;
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
};

export const BoardService = { createNew, getFullBoard };
