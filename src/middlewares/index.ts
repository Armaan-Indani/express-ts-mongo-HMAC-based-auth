import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/users";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    console.log(get(req, "identity._id"));
    const currentUserId = get(req, "identity._id") as unknown as string;

    if (!currentUserId) {
      console.log("!currentUserId");
      return res.sendStatus(403);
    }

    if (currentUserId.toString() != id) {
      console.log("currentUserId.toString() != id");
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["ABC-AUTH-TOKEN"];
    if (!sessionToken) {
      // console.log("no token found");
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      // console.log("not existing user");
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
