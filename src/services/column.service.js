import { ColumnModel } from "*/models/column.model";

const createNew = async (data) => {
  try {
    const result = await ColumnModel.createNew(data);
    return result;
  } catch (error) {
    // console.log(error);

    throw new Error(error); //dùng throw error để trả vế lỗi, như thế thì bên controller mới nhận được lỗi và in ra
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
    // console.log(error);

    throw new Error(error); //dùng throw error để trả vế lỗi, như thế thì bên controller mới nhận được lỗi và in ra
  }
};

export const ColumnService = { createNew, update };
