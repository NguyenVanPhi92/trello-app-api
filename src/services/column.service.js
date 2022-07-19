import { ColumnModel } from "*/models/column.model";
import { BoardModel } from "*/models/board.model";

const createNew = async (data) => {
  try {
    const newColumn = await ColumnModel.createNew(data);

    // update columnsOrder Array in board collections
    await BoardModel.pushColumnOrder(
      newColumn.boardId.toString(),
      newColumn._id.toString()
    );

    return newColumn;
  } catch (error) {
    //dùng throw error để trả vế lỗi, như thế thì bên controller mới nhận được lỗi và in ra
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now(),
    };

    const result = await ColumnModel.update(id, updateData);
    return result;
  } catch (error) {
    //dùng throw error để trả vế lỗi, như thế thì bên controller mới nhận được lỗi và in ra
    throw new Error(error);
  }
};

export const ColumnService = { createNew, update };
