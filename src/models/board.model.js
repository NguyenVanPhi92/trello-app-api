import Joi from 'joi';
import { getDB } from '*/config/mongodb';
import { ObjectId } from 'mongodb';
import { ColumnModel } from './column.model';
import { CardModel } from './card.model';

//Define Board collection
const boardCollectionName = 'boards';
const boardCollectionSchema = Joi.object({
  title: Joi.string().required().min(3).max(20).trim(),
  columnOrder: Joi.array().items(Joi.string()).default([]),
  createAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
});

// validate data receive from client
const validateSchema = async (data) => {
  return await boardCollectionSchema.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    const value = await validateSchema(data);

    const result = await getDB().collection(boardCollectionName).insertOne(value);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// find one
const findOneById = async (id) => {
  try {
    const result = await getDB()
      .collection(boardCollectionName)
      .findOne({ _id: ObjectId(id) });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 *thêm _id bảng con vào bảng cha
 *
 * @param {string} boardId
 * @param {string} newColumnId
 * @returns
 */
const pushColumnOrder = async (boardId, newColumnId) => {
  try {
    const result = await getDB()
      .collection(boardCollectionName)
      .findOneAndUpdate(
        { _id: ObjectId(boardId) },
        { $push: { columnOrder: newColumnId } },
        { returnDocument: 'after' }, // returnDocument: 'after' => sẽ trả về bản ghi sau khi update
      );

    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

// lấy ra 1 Board với all data bên trong nó
// trường hợp này so sánh _id kiểu object
const getFullBoard = async (boardId) => {
  try {
    const result = await getDB()
      .collection(boardCollectionName)
      .aggregate([
        {
          $match: {
            _id: ObjectId(boardId),
            _destroy: false,
          },
        }, // lấy ra item có id là ... và _destroy = false

        // {
        //   $addFields: {
        //     _id: { $toString: "$_id" }, // ghi đè khi trùng key and chuyển obj _id của mongoDb sang string
        //   },
        // },
        // ... sau đó lấy ra hết các phần tử bên trong item đó
        // get columns in board
        {
          $lookup: {
            from: ColumnModel.columnCollectionName, //collection name.
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns', // name return
          },
        },
        // get card in columns in board
        {
          $lookup: {
            from: CardModel.cardCollectionName, //collection name.
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards', // name return
          },
        },
      ])
      .toArray();

    return result[0] || {}; // nếu kh có item thì trả về mảng rỗng
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    const updateData = { ...data };

    const result = await getDB()
      .collection(boardCollectionName)
      .findOneAndUpdate(
        { _id: ObjectId(id) }, // tìm item có id...
        { $set: updateData }, // update data
        { returnDocument: 'after' }, // returnDocument: "after" => sẽ trả về bản ghi sau khi update
      );

    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

export const BoardModel = {
  createNew,
  getFullBoard,
  pushColumnOrder,
  findOneById,
  update,
};
