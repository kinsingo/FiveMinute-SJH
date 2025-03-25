import { hash } from "bcryptjs";
import { getPublicCollection } from "@/MongoDB/db-manager";
import { getPasswordResetToken } from "../util/tokenManager";

//private
async function getHashedPassword(password: string) {
  return await hash(password, 12);
}

//public
async function addUser(email: string, password: string) {
  try {
    const collection = await getPublicCollection("users");
    await collection.insertOne({
      email: email,
      password: await getHashedPassword(password),
      resetToken: null,
      resetTokenExpires: null,
      isAdmin: false, //오직 나만
      isDeveloper: false, //팀원들
    });
  } catch (error: any) {
    throw new Error(`Could not add new user - ${error.message}`);
  }
}

async function modifyPassword(email: string, newPassword: string) {
  try {
    const collection = await getPublicCollection("users");
    await collection.updateOne(
      { email }, // 업데이트 조건: 이메일이 일치하는 사용자
      { $set: { password: await getHashedPassword(newPassword) } } // 변경할 필드: 새로운 비밀번호로 갱신
    );
  } catch (error: any) {
    throw new Error(`Could not update the user's password - ${error.message}`);
  }
}

async function findTokenValidUser(email: string, token: string) {
  const collection = await getPublicCollection("users");
  const user = await collection.findOne({
    email,
    resetToken: getPasswordResetToken(token),
    resetTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error(`Token is invalid or expired.`);
  }
  return user;
}

async function isAdmin(email: string) {
  const user = await findUserByEmail(email);
  return user.isAdmin;
}

async function isAdminOrDeveloper(email: string) {
  const user = await findUserByEmail(email);
  return user.isAdmin || user.isDeveloper;
}

async function findUserByEmail(email: string) {
  const collection = await getPublicCollection("users");
  const user = await collection.findOne({ email });
  if (!user) {
    throw new Error(`Could not find user for email ${email}`);
  }
  return user;
}

async function saveResetToken(
  email: string,
  token: string | null,
  expires: Date | null
) {
  try {
    const collection = await getPublicCollection("users");
    await collection.updateOne(
      { email }, // 업데이트 조건: 이메일이 일치하는 사용자
      {
        $set: {
          resetToken: token,
          resetTokenExpires: expires,
        },
      }
    );
  } catch (error: any) {
    throw new Error(`Could not update the user's password - ${error.message}`);
  }
}

export {
  addUser,
  modifyPassword,
  findUserByEmail,
  saveResetToken,
  findTokenValidUser,
  isAdmin,
  isAdminOrDeveloper,
};
