import { db } from "./FirebaseConfig.js";

//cria sala
function createRoom(roomSpecs) {
  console.log(roomSpecs);
  db.collection("salas").add(roomSpecs);
}
//fim cria sala

//recupera salas
const roomsRef = db.collection("salas");
const snapshot = await roomsRef.get();
//fim recupera salas

async function getInfoRoom(id) {
  const roomInfo = db.collection("salas").doc(id);
  const doc = await roomInfo.get();
  if (!doc.exists) {
    return "not found";
  } else {
    return doc.data();
  }
}

export { createRoom, snapshot, getInfoRoom };
