import { Express, Request, Response, NextFunction } from 'express';
import UserService from '../services';
import logger from '../../util/logger';
import ImageService from '../../util/image.handler';
import { IUserRequest } from '../interfaces';

/**
 * @param {Request} request - Request from the frontend
 * @param {Response} response - Response that need to send to the client
 * @param {NextFunction} next - Next function
 * @returns {IUser} User document
 */
export const createUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const bucketDirectoryName = 'profile-images';

  const profileImagePath = await ImageService.uploadImage(
    request.file,
    bucketDirectoryName
  );

  const userInfo: IUserRequest = {
    firstName: request.body.firstName as string,
    lastName: request.body.lastName as string,
    phoneNumber01: request.body.phoneNumber01 as string,
    phoneNumber02: request.body.phoneNumber02 as string,
    email: request.body.email as string,
    userName: request.body.userName as string,
    password: request.body.password as string,
    profileImage: profileImagePath as string,
    permissionLevel: request.body.permissionLevel as string,
  };

  await UserService.insertUser(userInfo)
    .then((data) => {
      logger.info(`New user with ID ${data._id} created`);
      request.handleResponse.successRespond(response)(data);
      next();
    })
    .catch((error: any) => {
      logger.error(error.message);
      request.handleResponse.errorRespond(response)(error.message);
      next();
    });
};

/**
 * @param {Request} request - Request from the frontend
 * @param {Response} response - Response that need to send to the client
 * @param {NextFunction} next - Next function
 * @returns {IUser} Authenticated user document
 */
export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { userName, password } = request.body;

  if (userName && password) {
    await UserService.authenticateUser(userName, password)
      .then(async (user) => {
        const authToken = await user.generateAuthToken();
        const authResponseData = {
          token: authToken,
        };

        request.handleResponse.successRespond(response)(authResponseData);
      })
      .catch((error) => {
        logger.error(error.message);
        request.handleResponse.errorRespond(response)(error.message);
        next();
      });
  } else {
    logger.error('Username or Password is missing');
    request.handleResponse.errorRespond(response)(
      'Username or Password is missing'
    );
    next();
  }
};

/**
 * @todo implement a @function getAllUsers that calls
 * @function getUsers in the UserService
 *
 * @param {Request} request - Request from the frontend
 * @param {Response} response - Response that need to send to the client
 * @param {NextFunction} next - Next function
 * @returns {IUser[]} All user documents in the system
 */

export const getAllUsers = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  await UserService.getUsers()
    .then((data) => {
      request.handleResponse.successRespond(response)(data);
      next();
    })
    .catch((error) => {
      logger.error(error.message);
      request.handleResponse.errorRespond(response)(error.message);
      next();
    });
};

/**
 * @todo implement a @function updateUser that calls
 * @function updateUser in the UserService
 *
 * @param {Request} request - Request from the frontend
 * @param {Response} response - Response that need to send to the client
 * @param {NextFunction} next - Next function
 * @returns {IUser} Updated user document
 */

export const updateUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const bucketDirectoryName = 'profile-images';

  const profileImagePath = await ImageService.uploadImage(
    request.file,
    bucketDirectoryName
  );

  const userInfo: IUserRequest = {
    firstName: request.body.firstName as string,
    lastName: request.body.lastName as string,
    phoneNumber01: request.body.phoneNumber01 as string,
    phoneNumber02: request.body.phoneNumber02 as string,
    email: request.body.email as string,
    userName: request.body.userName as string,
    password: request.body.password as string,
    profileImage: profileImagePath as string,
    permissionLevel: request.body.permissionLevel as string,
  };

  await UserService.updateUser(request.params.id, userInfo)
    .then((data) => {
      logger.info(`User with ID ${data._id} updated`);
      request.handleResponse.successRespond(response)(data);
      next();
    })
    .catch((error: any) => {
      logger.error(error.message);
      request.handleResponse.errorRespond(response)(error.message);
      next();
    });
};

/**
 * @todo implement a @function removeUser that calls
 * @function deleteUser in the UserService
 *
 * @param {Request} request - Request from the frontend
 * @param {Response} response - Response that need to send to the client
 * @param {NextFunction} next - Next function
 * @returns {IUser} Deleted user document
 */

export const removeUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userId = request.params.id;
  if (userId) {
    await UserService.deleteUser(userId)
      .then((data) => {
        request.handleResponse.successRespond(response)(data);
        next();
      })
      .catch((error: any) => {
        request.handleResponse.errorRespond(response)(error.message);
        next();
      });
  } else {
    request.handleResponse.errorRespond(response)('User ID is missing');
    next();
  }
};
