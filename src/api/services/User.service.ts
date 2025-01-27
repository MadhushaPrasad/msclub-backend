import { DocumentDefinition } from 'mongoose';
import { IUser, IUserRequest } from '../interfaces';
import UserModel from '../models/User.model';
import bcrypt from 'bcrypt';

/**
 * @param {IUser} userData
 * @returns {Document} User document
 */
export const insertUser = async (
  userData: DocumentDefinition<IUserRequest>
) => {
  return await UserModel.create(userData)
    .then(async (user) => {
      await user.generateAuthToken();
      return user;
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};

export const authenticateUser = async (userName: string, password: string) => {
  try {
    return await UserModel.findByUsernamePassword(userName, password);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * fetch all the users in the system
*/

export const getUsers = async () => {
  return await UserModel.aggregate([{ $match: { deletedAt: { $eq: null } } }])
    .then((user) => {
      return user;
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};

/**
 * update user
 * @param userId @type string
 * @param updateData @type DocumentDefinition<IUser>
 */
export const updateData = async (
  userId: string,
  updateData: DocumentDefinition<IUser>
) => {
  return await UserModel.findById(userId)
    .then(async (userDetails) => {
      if (userDetails) {
        if (userDetails.deletedAt) {
          if (updateData.firstName) {
            userDetails.firstName = updateData.firstName;
          }
          if (updateData.lastName) {
            userDetails.lastName = updateData.lastName;
          }
          if (updateData.phoneNumber01) {
            userDetails.phoneNumber01 = updateData.phoneNumber01;
          }
          if (updateData.phoneNumber02) {
            userDetails.phoneNumber02 = updateData.phoneNumber02;
          }
          if (updateData.email) {
            userDetails.email = updateData.email;
          }
          if (updateData.userName) {
            userDetails.userName = updateData.userName;
          }
          if (updateData.password) {
            userDetails.password = updateData.password;
          }
          if (updateData.profileImage) {
            userDetails.profileImage = updateData.profileImage;
          }
          if (updateData.permissionLevel) {
            userDetails.permissionLevel = updateData.permissionLevel;
          }
          
          return await userDetails.save();
        } else {
          throw new Error("User is not found");
        }
      } else {
        return null;
      }
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};

export const updateUser = async (
  userId: string,
  updateData: DocumentDefinition<IUserRequest>
) => {
  return await UserModel.findById(userId).then(async (user) => {
    if (user) {
      await user.updateOne(updateData);
      return user;
    }
    throw new Error('User not found');
  });
};

/**
 * delete user
 * @param userId @type string
 */

export const deleteUser = async (userId: string) => {
  return await UserModel.findById(userId)
    .then(async (user) => {
      if (user?.deletedAt) {
        user.deletedAt = new Date();
        return await user.save();
      } else {
        return null;
      }
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};
