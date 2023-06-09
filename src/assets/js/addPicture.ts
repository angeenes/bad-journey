import { API_URL } from "../../consts";
import convertAutomatic111Metadata from "@classes/MetaDataExtrators/convertAutomatic111Metadata";
import convertInvokeMetadata from "@classes/MetaDataExtrators/convertInvokeMetadata";
import convertMochiMetadata from "@classes/MetaDataExtrators/convertMochiMetadata";
import { ImageObject } from "../interfaces/ImageObject.js";
import { log } from "astro/dist/core/logger/core";

export class ImageMetadataForm {
  constructor(
    private imagePreview: HTMLImageElement = document.getElementById("imagePreview") as HTMLImageElement,
    private imageInput = document.getElementById("image") as HTMLInputElement,
    public formEl: HTMLFormElement = document.getElementById("image-form") as HTMLFormElement,
    private loadingEl: HTMLDivElement = document.getElementById("publishing-loading") as HTMLDivElement,
    // private successDialog: HTMLDialogElement = document.getElementById("success-upload-image") as HTMLDialogElement,
    // private notAuthorizedDialog: HTMLDialogElement = document.getElementById("not-authorized") as HTMLDialogElement,
    private publishButtonSubmitEl: HTMLButtonElement = document.getElementById("publish-button") as HTMLButtonElement,
    private token: string | null = "",
    private isConnected = false,
    private user: string | null = "",
    private uploadImageParameter: boolean = location.href.includes('uploadimage=true')
  ) {
    this.token = localStorage.getItem('jwt');
    this.user = localStorage.getItem('user');
    this.isConnected = this.token === 'undefined' || this.token === null ? false : true;
  }

  public async init(): Promise<void> {
    this.formEl.addEventListener("submit", this.handleSubmit.bind(this));
    this.imageInput.addEventListener("change", this.previewImage.bind(this));
    this.listenToImageSrcLoad();
  }

  private resetUploadImageParameter() {
    if (!this.uploadImageParameter) return;
    setTimeout(() => {
      window.history.pushState(null, '', window.location.href.split('?')[0]);
    }, 2000);
  }

  private listenToImageSrcLoad() {
    if (!this.uploadImageParameter) return;
    this.imagePreview.addEventListener("load", (e) => {
      this.updateFormFields(this.imagePreview.src as unknown as File).then(() => {
        this.resetUploadImageParameter();
      });
    });
  };


  private previewImage() {

    if (!this.imageInput.files || this.imageInput.files.length === 0) return;

    const imageFile = this.imageInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target) return;

      this.imagePreview.src = e.target.result as string;
      this.updateFormFields(imageFile);
    };
    reader.readAsDataURL(imageFile);
  }

  private async updateFormFields(imageFile: File) {
    let objectImageDatas: ImageObject = {} as ImageObject;
    try {
      const metadata = await exifr.parse(imageFile, {
        tiff: false,
        xmp: true,
      });

      if (metadata) {
        console.log("metadata", metadata);
        if (metadata["sd-metadata"]) {
          // console.log("INVOKE");
          const jsObject = JSON.parse(metadata["sd-metadata"]);
          objectImageDatas = convertInvokeMetadata(jsObject);
          console.log("objectImageDatas RETOURNE", objectImageDatas);
          this.fillForm(objectImageDatas);
        }


        if (metadata["description"]) {
          // console.log("MOCHI");
          objectImageDatas = convertMochiMetadata(metadata["description"]);
          console.log("objectImageDatas RETOURNE", objectImageDatas);
          this.fillForm(objectImageDatas);
        }


        if (metadata["parameters"]) {
          // console.log("AUTOMATIC111");
          const object = metadata["parameters"]
          objectImageDatas = convertAutomatic111Metadata(object);
          console.log("objectImageDatas RETOURNE", objectImageDatas);
          this.fillForm(objectImageDatas);
        }


      }
    } catch (error) {
      console.error("Failed to read metadata:", error);
    }
  }

  private fillForm(data: ImageObject) {
    for (const key in data) {
      const element = this.formEl.querySelector(`[name="${key}"]`) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | null;
      if (element) {
        if (element.type === "checkbox") {
          (element as HTMLInputElement).checked = data[key] as boolean;
        } if (key === 'control_net') {
          const controlNetModel = this.formEl.querySelector(`[name="control_net-model"]`) as HTMLInputElement;
          controlNetModel.value = data.control_net?.model || '';
        } else {
          element.value = data[key];
        }
      }
    }
    if (this.isConnected) {
      this.allowBtnPublish();
    } else {
      this.notAuthorizedToUpload();
    }
  }

  private notAuthorizedToUpload() {
    closeDialogId("uploadImage");
    this.resetForm();
    openDialogId("not-authorized");
    throw new Error("Method not implemented.");
  }

  private allowBtnPublish(): void {
    this.publishButtonSubmitEl.classList.remove("opacity-5");
    this.publishButtonSubmitEl.disabled = false;
    this.publishButtonSubmitEl.classList.toggle("cursor-not-allowed");
  }

  private toggleLoadingPublishImage(): void {

    this.publishButtonSubmitEl.classList.toggle("opacity-70");
    this.publishButtonSubmitEl.disabled = !this.publishButtonSubmitEl.disabled;
    this.loadingEl.classList.toggle("active");
    // publishButtonSubmitEl.innerHTML="PUBLISHING..."
  }

  private resetForm() {
    this.formEl.reset();
  }

  private dataURItoBlob(dataURI: string): Blob {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0) {
      byteString = atob(dataURI.split(",")[1]);
    } else {
      byteString = decodeURI(dataURI.split(",")[1]);
    }

    // separate out the mime component
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    console.log("ia", ia);
    return new Blob([ia], { type: mimeString });
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    this.toggleLoadingPublishImage();

    const form = event.target as HTMLFormElement;
    let data = {};
    const formData = new FormData();

    if (this.user) {
      const userId = JSON.parse(this.user);
      data = {
        "users_permissions_user": userId.id,
      };
    }

    Array.from(form.elements).forEach(({ name, type, value, files }) => {

      if (!["submit", "file"].includes(type)) {
        if (name === 'tag') {
          data[name] = value;
        } else {
          data[name] = value;
        }
      }

      //   Array.from(files).forEach((file) => {
      //     formData.append(`files.${name}`, file as Blob, file.name as string);
      //   });

      const nameTimeStamp = Date.now().toString();
      const imageBlob = this.dataURItoBlob(this.imagePreview.src);
      formData.append(`files.image`, imageBlob as Blob, `${nameTimeStamp}.png` as string);
    }
    );

    formData.append("data", JSON.stringify(data));

    try {
      const response = await fetch(`${API_URL}/images?populate=*`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          // Authorization: `Bearer ${BEARER_TOKEN_POST_IMAGES}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Data submitted successfully");
        this.resetForm();
        closeDialogId("uploadImage");
        this.resetForm();
        this.toggleLoadingPublishImage()
        openDialogId("success-upload-image");
      } else {
        console.error("Failed to submit data:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to submit data:", error);
    }
  }
}