import Joi from 'joi';
import { getDB } from '*/config/mongodb';
import { ObjectId } from 'mongodb';

// SCHEMA
//Define Cards collection
const cardCollectionName = 'cards';
const cardCollectionSchema = Joi.object({
  boardId: Joi.string().required(), // Also objectId when create new
  columnId: Joi.string().required(), // Also objectId when create new
  title: Joi.string().required().min(3).max(50).trim(),
  cover: Joi.string().default(null),
  createAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
});

// METHOD
// validate data receive from client
const validateSchema = async (data) => {
  return await cardCollectionSchema.validateAsync(data, {
    abortEarly: false,
  });
};

// find one
const findOneById = async (id) => {
  try {
    const result = await getDB()
      .collection(cardCollectionName)
      .findOne({ _id: ObjectId(id) });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data);

    // change id string to _id Object
    const insertValue = {
      ...validatedValue,
      boardId: ObjectId(validatedValue.boardId),
      columnId: ObjectId(validatedValue.columnId),
    };

    const result = await getDB().collection(cardCollectionName).insertOne(insertValue);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    const updateData = { ...data };

    if (data.boardId) updateData.boardId = ObjectId(data.boardId);
    if (data.columnId) updateData.columnId = ObjectId(data.columnId);

    const result = await getDB()
      .collection(cardCollectionName)
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

/**
 *
 * @param {Array of string card id} ids
 */
const deleteMany = async (ids) => {
  try {
    const transformIds = ids.map((item) => ObjectId(item)); // map lại tất các id string => _id Object

    const result = await getDB()
      .collection(cardCollectionName)
      .updateMany(
        { _id: { $in: transformIds } }, // update những th có id trong mảng ids
        { $set: { _destroy: true } },
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const CardModel = {
  cardCollectionName,
  createNew,
  deleteMany,
  findOneById,
  update,
};
