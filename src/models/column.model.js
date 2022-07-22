import { getDB } from '*/config/mongodb';
import Joi from 'joi';
import { ObjectId } from 'mongodb';

//Define Column collection
const columnCollectionName = 'columns';
const columnCollectionSchema = Joi.object({
  boardId: Joi.string().required(), // Also objectId when create new
  title: Joi.string().required().min(3).max(20).trim(),
  cardOrder: Joi.array().items(Joi.string()).default([]),
  createAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
});

// validate data receive from client
const validateSchema = async (data) => {
  return await columnCollectionSchema.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data);

    // change id string to _id Object
    const insertValue = {
      ...validatedValue,
      boardId: ObjectId(validatedValue.boardId),
    };

    const result = await getDB().collection(columnCollectionName).insertOne(insertValue);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// find one
const findOneById = async (id) => {
  try {
    const result = await getDB()
      .collection(columnCollectionName)
      .findOne({ _id: ObjectId(id) });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 *thêm _id của bàng con vào bảng cha
 *
 * @param {string} columnId
 * @param {string} newCardId
 * @returns
 */
const pushCardOrder = async (columnId, newCardId) => {
  try {
    const result = await getDB()
      .collection(columnCollectionName)
      .findOneAndUpdate(
        { _id: ObjectId(columnId) },
        { $push: { cardOrder: newCardId } },
        { returnDocument: 'after' }, // returnDocument: "after" => sẽ trả về bản ghi sau khi update
      );

    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    const updateData = { ...data };

    if (data.boardId) updateData.boardId = ObjectId(data.boardId);

    const result = await getDB()
      .collection(columnCollectionName)
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

export const ColumnModel = {
  columnCollectionName,
  createNew,
  update,
  pushCardOrder,
  findOneById,
};
