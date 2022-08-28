import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// eslint-disable-next-line max-len
export const setCustomClaims = functions.auth.user().onCreate(async ( user ) => {
  const customClaims = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "staff",
      "x-hasura-allowed-roles": ["staff"],
      "x-hasura-user-id": user.uid,
    },
  };

  try {
    await admin.auth().setCustomUserClaims(user.uid, customClaims);
    // setCustomUserClaims()は、処理にかかる時間にばらつきがあるため、Reactとの同期を図るため、
    // 処理が終わり次第firestoreにユーザのmeta情報を書き込む。
    // React側でonSnapshotを用いて"user_meta"の更新状態を監視し、同期を図る
    await admin.firestore().collection("user_meta").doc(user.uid).create({
      // firestoreのcollection("user_meta")という場所に、user.uidを記したdocを作成する
      refreshTime: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.log(e);
  }
});
