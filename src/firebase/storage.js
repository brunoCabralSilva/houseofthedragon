import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import firebaseConfig from "./connection";

export async function createSessionImage(title, data){
  try {
    const storage = getStorage(firebaseConfig);
    const storageRef = ref(storage, `images/${title}/${data.name}`);
    await uploadBytes(storageRef, data);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    window.alert("Erro ao fazer upload da midia imagem: " + error.message);
    return false;
  }
}

export async function createProfileImage(id, img){
  try {
    const storage = getStorage(firebaseConfig);
    const storageRef = ref(storage, `images/users/${id}/${img.name}`);
    await uploadBytes(storageRef, img);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    window.alert("Erro ao fazer upload da midia imagem: " + error.message);
    return false;
  }
}