import Joi from "joi";
import { getDB } from "*/config/mongodb";

//Define Board collection
const boardCollectionName = "boards";
const boardCollectionSchema = Joi.object({
  title: Joi.string().required().min(3).max(20),
  columnOrder: Joi.array().items(Joi.string()).default([]),
  createAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
});

const validateSchema = async (data) => {
  return await boardCollectionSchema.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    const value = await validateSchema(data);
    const result = await getDB()
      .collection(boardCollectionName)
      .insertOne(value);

    if (result.acknowledged) {
      let res = await getDB()
        .collection(boardCollectionName)
        .findOne(result.insertedId);
      return res;
    }

    // return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const BoardModel = { createNew };
