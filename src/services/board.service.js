import { BoardModel } from '*/models/board.model';
import { cloneDeep } from 'lodash';

const createNew = async (data) => {
  try {
    const createBoard = await BoardModel.createNew(data);
    const getNewBoard = await BoardModel.findOneById(createBoard.insertedId.toString());
    return getNewBoard;
  } catch (error) {
    //dùng throw error để trả vế lỗi, như thế thì bên controller mới nhận được lỗi và in ra
    throw new Error(error);
  }
};

const getFullBoard = async (boardId) => {
  try {
    const board = await BoardModel.getFullBoard(boardId);

    if (!board || !board.columns) {
      throw new Error('Board not found!');
    }

    const transformBoards = cloneDeep(board);
    //Filter deleted columns
    transformBoards.columns = transformBoards.columns.filter((column) => !column._destroy);

    //Add card to each column
    transformBoards.columns.forEach((column) => {
      column.cards = transformBoards.cards.filter((c) => c.columnId.toString() === column._id.toString());
    });

    // remove cards data from board when return
    delete transformBoards.cards;

    return transformBoards;
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now(),
    };

    if (updateData._id) delete updateData._id; // id kh update được nên xóa
    if (updateData.columns) delete updateData.columns; // không lưu cards array vào columns

    const updatedBoard = await BoardModel.update(id, updateData);

    return updatedBoard;
  } catch (error) {
    console.log(error);
    //dùng throw error để trả vế lỗi, như thế thì bên controller mới nhận được lỗi và in ra
    throw new Error(error);
  }
};

export const BoardService = { createNew, getFullBoard, update };
