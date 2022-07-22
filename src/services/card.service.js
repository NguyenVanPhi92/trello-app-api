import { CardModel } from '*/models/card.model';
import { ColumnModel } from '*/models/column.model';

const createNew = async (data) => {
  try {
    const createCard = await CardModel.createNew(data);
    const getNewCard = await CardModel.findOneById(createCard.insertedId.toString());

    // update columnsOrder Array in board collections
    await ColumnModel.pushCardOrder(getNewCard.columnId.toString(), getNewCard._id.toString());

    return getNewCard;
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

    if (updateData._id) delete updateData._id; // id kh update được nên xóa

    const updatedCard = await CardModel.update(id, updateData);
    return updatedCard;
  } catch (error) {
    console.log(error);
    //dùng throw error để trả vế lỗi, như thế thì bên controller mới nhận được lỗi và in ra
    throw new Error(error);
  }
};

export const CardService = { createNew, update };
