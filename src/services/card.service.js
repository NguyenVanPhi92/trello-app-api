import { CardModel } from "*/models/card.model";

const createNew = async (data) => {
  try {
    const result = await CardModel.createNew(data);
    return result;
  } catch (error) {
    // console.log(error);

    throw new Error(error); //dùng throw error để trả vế lỗi, như thế thì bên controller mới nhận được lỗi và in ra
  }
};

export const CardService = { createNew };
