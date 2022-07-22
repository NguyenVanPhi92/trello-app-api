import { BoardModel } from '*/models/board.model';
import { CardModel } from '*/models/card.model';
import { ColumnModel } from '../models/column.model';

const createNew = async (data) => {
  try {
    const createdColumn = await ColumnModel.createNew(data);
    const getNewColumn = await ColumnModel.findOneById(createdColumn.insertedId.toString());
    getNewColumn.cards = []; // tạo trường dữ liệu này đển bên frontend để có thể sort

    // update columnsOrder Array in board collections
    await BoardModel.pushColumnOrder(getNewColumn.boardId.toString(), getNewColumn._id.toString());

    return getNewColumn;
  } catch (error) {
    //dùng throw error để trả vế lỗi, như thế thì bên controller mới nhận được lỗi và in ra
    throw new Error(error);
  }
};

// UPDATE OR REMOVE WITH DESTROY === TRUE
const update = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now(),
    };

    if (updateData._id) delete updateData._id; // id kh được update nên xóa
    if (updateData.cards) delete updateData.cards; // không lưu cards array vào columns

    const updatedColumn = await ColumnModel.update(id, updateData);

    if (updatedColumn._destroy) {
      //delete many cards in this column
      CardModel.deleteMany(updatedColumn.cardOrder);
    }
    return updatedColumn;
  } catch (error) {
    console.log(error);
    //dùng throw error để trả vế lỗi, như thế thì bên controller mới nhận được lỗi và in ra
    throw new Error(error);
  }
};

export const ColumnService = { createNew, update };
