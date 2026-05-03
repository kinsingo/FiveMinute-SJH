import { hash } from "bcryptjs";
import { getPublicCollection } from "@/MongoDB/db-manager";
import { getPasswordResetToken } from "../util/tokenManager";

//private
async function getHashedPassword(password: string) {
  return await hash(password, 12);
}

//public
async function addUser(
  email: string,
  password: string,
  collectionName: string
) {
  try {
    const collection = await getPublicCollection(collectionName);
    await collection.insertOne({
      email: email,
      password: await getHashedPassword(password),
      resetToken: null,
      resetTokenExpires: null,
      isAdmin: false, //오직 나만
      isDeveloper: false, //팀원들
    });
  } catch (error: any) {
    throw new Error(`새로운 사용자를 추가할 수 없습니다 - ${error.message}`);
  }
}

async function modifyPassword(
  email: string,
  newPassword: string,
  collectionName: string
) {
  try {
    const collection = await getPublicCollection(collectionName);
    await collection.updateOne(
      { email }, // 업데이트 조건: 이메일이 일치하는 사용자
      { $set: { password: await getHashedPassword(newPassword) } } // 변경할 필드: 새로운 비밀번호로 갱신
    );
  } catch (error: any) {
    throw new Error(
      `사용자의 패스워드를 수정 할 수 없습니다 - ${error.message}`
    );
  }
}

async function findTokenValidUser(
  email: string,
  token: string,
  collectionName: string
) {
  const collection = await getPublicCollection(collectionName);
  const user = await collection.findOne({
    email,
    resetToken: getPasswordResetToken(token),
    resetTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error(`토큰이 유효하지 않거나 만료되었습니다.`);
  }
  return user;
}

async function findUserByEmail(email: string, collectionName: string) {
  const collection = await getPublicCollection(collectionName);
  const user = await collection.findOne({ email });
  if (!user) {
    throw new Error(`${email} 에 해당하는 사용자를 찾을 수 없습니다.`);
  }
  return user;
}

async function saveResetToken(
  email: string,
  token: string | null,
  expires: Date | null,
  collectionName: string
) {
  try {
    const collection = await getPublicCollection(collectionName);
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
    throw new Error(`사용자의 비밀번호를 업데이트 할 수 없습니다 - ${error.message}`);
  }
}

export {
  addUser,
  modifyPassword,
  findUserByEmail,
  saveResetToken,
  findTokenValidUser,
};
