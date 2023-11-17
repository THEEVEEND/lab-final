import "./utilities/firebase";
import { uploadProduct, realTimeProducts, getProducts } from "./utilities/firebase";

class AppContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.mount();
    }

    mount() {
        this.render();
    }

    render() {
        if (this.shadowRoot) {
            const linkCSS = this.ownerDocument.createElement("link");
            linkCSS.setAttribute("rel", "stylesheet");
            linkCSS.setAttribute("href", "/src/index.css");
            this.shadowRoot.appendChild(linkCSS);

            const mainContainer = this.ownerDocument.createElement("section");
            mainContainer.setAttribute("id", "mainContainerSection");
            this.shadowRoot.appendChild(mainContainer);

            const openUploadProductButton = this.ownerDocument.createElement("button");
            openUploadProductButton.innerHTML = "Upload a Product";
            openUploadProductButton.id = "test";
            mainContainer.appendChild(openUploadProductButton);

            const formContainer = this.ownerDocument.createElement("div");
            formContainer.id = "formContainer";
            formContainer.classList.add("hidden");
            mainContainer.appendChild(formContainer);

            const productContainer = this.ownerDocument.createElement("div");
            productContainer.id = "productContainer";
            mainContainer.appendChild(productContainer);

            const xButton = this.ownerDocument.createElement("button");
            xButton.innerText = "X";
            formContainer.appendChild(xButton);

            const inputName = this.ownerDocument.createElement("input");
            inputName.setAttribute("type", "text");
            inputName.setAttribute("placeholder", "Enter the product name");
            formContainer.appendChild(inputName);

            const inputDesc = this.ownerDocument.createElement("input");
            inputDesc.setAttribute("type", "text");
            inputDesc.setAttribute("placeholder", "Enter the product description");
            formContainer.appendChild(inputDesc);

            const inputPrice = this.ownerDocument.createElement("input");
            inputPrice.setAttribute("type", "text");
            inputPrice.setAttribute("placeholder", "Enter the product price");
            formContainer.appendChild(inputPrice);

            const inputQuantity = this.ownerDocument.createElement("input");
            inputQuantity.setAttribute("type", "text");
            inputQuantity.setAttribute("placeholder", "Enter the product quantity");
            formContainer.appendChild(inputQuantity);

            const inputImage = this.ownerDocument.createElement("input");
            inputImage.setAttribute("type", "file");
            inputImage.setAttribute("placeholder", "Upload the product image");
            formContainer.appendChild(inputImage);

            const uploadButton = this.ownerDocument.createElement("button");
            uploadButton.innerText = "UPLOAD";
            formContainer.appendChild(uploadButton);

            realTimeProducts(productContainer);

            openUploadProductButton.addEventListener("click", () => {
                if (formContainer.classList.contains("hidden")) {
                    formContainer.classList.remove("hidden");
                    formContainer.classList.add("formContainer");
                } else {
                    this.closeUploadModal(formContainer);
                }
            });

            xButton.addEventListener("click", () => {
                this.closeUploadModal(formContainer);
            });

            uploadButton.addEventListener("click", () => {
                uploadProduct(inputName.value, inputDesc.value, inputPrice.value, inputQuantity.value, inputImage.files![0]);
                this.closeUploadModal(formContainer);
            });
        }
    }

    closeUploadModal(modal: HTMLElement) {
        modal.classList.remove("formContainer");
        modal.classList.add("hidden");
    }
}

customElements.define("app-container", AppContainer);
