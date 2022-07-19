import Joi from "joi";
import { getDB } from "*/config/mongodb";
import { ObjectId } from "mongodb";

//Define Cards collection
const cardCollectionName = "cards";
const cardCollectionSchema = Joi.object({
  boardId: Joi.string().required(), // Also objectId when create new
  columnId: Joi.string().required(), // Also objectId when create new
  title: Joi.string().required().min(3).max(50).trim(),
  cover: Joi.string().default(null),
  createAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
});

// validate data receive from client
const validateSchema = async (data) => {
  return await cardCollectionSchema.validateAsync(data, {
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
      columnId: ObjectId(validatedValue.columnId),
    };

    const result = await getDB()
      .collection(cardCollectionName)
      .insertOne(insertValue);

    if (result.acknowledged) {
      let res = await getDB()
        .collection(cardCollectionName)
        .findOne(result.insertedId);
      return res;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const CardModel = { cardCollectionName, createNew };
