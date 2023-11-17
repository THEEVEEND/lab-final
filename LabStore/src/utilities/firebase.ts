import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";

export const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage();

// This function uploads the product. It first uploads the product image to get the URL and then uploads the data.
export const uploadProduct = async (name: string, description: string, price: string, quantity: string, image: File) => {
  console.log(image);
  const imageURL: string | void = await uploadFile(image);
  await uploadData(name, description, price, quantity, imageURL);
};

// Create products function
const createProducts = async (productContainer: HTMLElement) => {
  const productList = await getProducts();
  productContainer.innerHTML = "";
  productList.forEach((product) => {
    const singleProductContainer = document.createElement("div");
    singleProductContainer.classList.add("singleProductContainer");
    productContainer.appendChild(singleProductContainer);

    const productImage = document.createElement("img");
    productImage.src = product.image;
    singleProductContainer.appendChild(productImage);

    const productName = document.createElement("h1");
    productName.innerText = product.name;
    singleProductContainer.appendChild(productName);

    const productPrice = document.createElement("h2");
    productPrice.innerText = product.price;
    singleProductContainer.appendChild(productPrice);

    const productQuantity = document.createElement("h3");
    productQuantity.innerText = product.quantity;
    singleProductContainer.appendChild(productQuantity);

    const productDescription = document.createElement("p");
    productDescription.innerText = product.description;
    singleProductContainer.appendChild(productDescription);
  });
};

export const getProducts = async () => {
  const q = await query(collection(db, "products"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  const productList: any[] = [];
  querySnapshot.forEach((doc) => {
    productList.push(doc.data());
  });
  return productList;
};

export const realTimeProducts = async (container: HTMLElement) => {
  const q = await query(collection(db, "products"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    createProducts(container);
  });
};

// Upload the image. Important to add await to uploadBytes to wait for the image to upload before requesting the URL.
export const uploadFile = async (file: File) => {
  const storageRef = await ref(storage, `productImages/${file.name}`);
  await uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
  return await requestURL(`productImages/${file.name}`);
};

// Get the URL of the uploaded image based on the given name. Works only if the image is already uploaded.
export const requestURL = async (path: string) => {
  const url = await getDownloadURL(ref(storage, `${path}`));
  console.log(url);
  return url;
};

// Upload the data of each product after the image has been uploaded.
const uploadData = async (name: string, description: string, price: string, quantity: string, image: string | void) => {
  await setDoc(doc(db, "products", name), {
    name: name,
    description: description,
    price: price,
    quantity: quantity,
    image: image,
    date: new Date()
  });
  console.log("Product uploaded");
};
