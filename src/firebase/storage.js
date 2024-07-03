import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";
import firebaseConfig from "./connection";

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

export async function createNewsImage(id, img){
  try {
    const storage = getStorage(firebaseConfig);
    const storageRef = ref(storage, `images/news/${id}/${img.name}`);
    await uploadBytes(storageRef, img);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    window.alert("Erro ao fazer upload da midia imagem: " + error.message);
    return false;
  }
}

export async function createDragonImage(id, img){
  try {
    const storage = getStorage(firebaseConfig);
    const storageRef = ref(storage, `images/dragons/${id}/${img.name}`);
    await uploadBytes(storageRef, img);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    window.alert("Erro ao fazer upload da midia imagem: " + error.message);
    return false;
  }
}

export async function updateProfileImage(id, newImg) {
  try {
    const storage = getStorage(firebaseConfig);
    const userImagesRef = ref(storage, `images/users/${id}`);
    const userImagesSnapshot = await listAll(userImagesRef);
    const deletePromises = userImagesSnapshot.items.map(itemRef => deleteObject(itemRef));
    await Promise.all(deletePromises);
    const newImageRef = ref(storage, `images/users/${id}/${newImg.name}`);
    await uploadBytes(newImageRef, newImg);
    const downloadUrl = await getDownloadURL(newImageRef);
    return downloadUrl;
  } catch (error) {
    window.alert("Erro ao atualizar a imagem do perfil: " + error.message);
    return false;
  }
}

export async function updateDragonImage(id, newImg) {
  try {
    const storage = getStorage(firebaseConfig);
    const userImagesRef = ref(storage, `images/dragons/${id}`);
    const userImagesSnapshot = await listAll(userImagesRef);
    const deletePromises = userImagesSnapshot.items.map(itemRef => deleteObject(itemRef));
    await Promise.all(deletePromises);
    const newImageRef = ref(storage, `images/dragons/${id}/${newImg.name}`);
    await uploadBytes(newImageRef, newImg);
    const downloadUrl = await getDownloadURL(newImageRef);
    return downloadUrl;
  } catch (error) {
    window.alert("Erro ao atualizar a imagem do Dragão: " + error.message);
    return false;
  }
}

export async function deleteDragonDirectory(id) {
  try {
    const storage = getStorage(firebaseConfig);
    const directoryRef = ref(storage, `images/dragons/${id}`);
    await deleteObject(directoryRef);
    return true;
  } catch (error) {
    return false;
  }
}