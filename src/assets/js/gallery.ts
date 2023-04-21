
import { API_URL, BEARER_TOKEN, IMAGES_URL } from "../../consts";

 export class Gallery {
    currentPage: number;
    itemsPerPage: number;
    total: number | null;
    loadedCount: number;
    loading: boolean;

    constructor(
    ) {
      this.currentPage = 1;
      this.itemsPerPage = 10;
      this.total = null;
      this.loadedCount = 0;
      this.loading = false;
      this.init();
      this.masonry = new MiniMasonry({
        container: "#gallery",
        baseWidth: 320,
        gutter: 10,
        minify: true,
      });
    }

    async fetchData(page) {
      const tags = localStorage.getItem("tags");
      let endpoint = `${API_URL}images?populate=*&sort[0]=id%3Adesc&pagination[page]=${page}&pagination[pageSize]=${this.itemsPerPage}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      };

      if (tags) {
        endpoint += `&filters[tag][name][$eq]=${tags}`;
      }

      const response = await fetch(endpoint, { headers });
      this.loading = false;

      return await response.json();
    }

    createCardTemplate(item, index) {
      if (
        !item ||
        !item.attributes ||
        !item.attributes.image ||
        !item.attributes.image.data ||
        !item.attributes.image.data.attributes ||
        !item.attributes.image.data.attributes.formats
      ) {
        return ""; // retourne une chaîne vide si item ou l'une de ses propriétés est null ou undefined
      }

      const {
        attributes: {
          image: {
            data: {
              attributes: {
                formats: { small, medium },
              },
            },
          },
        },
      } = item;

      return `
    <div class="card">
      <img width="320px" height="100%"
        src="${IMAGES_URL}${small?.url ?? medium?.url}"
        alt="Image for post ${item?.attributes?.file_name}"
        loading="lazy" class="w-full card-img"
        style="transition-delay : ${index * 250}ms"
      >
    </div>
  `;
    }

    createDialogImageTemplate(item) {
      if (
        !item ||
        !item.attributes ||
        !item.attributes.image ||
        !item.attributes.image.data ||
        !item.attributes.image.data.attributes ||
        !item.attributes.image.data.attributes.formats
      ) {
        return ""; // retourne une chaîne vide si item ou l'une de ses propriétés est null ou undefined
      }

      const {
        attributes: {
          image: {
            data: {
              attributes: {
                formats: { small, medium },
              },
            },
          },
        },
      } = item;

      setTimeout(() => {
        const buttonCopyPrompt: HTMLButtonElement = document.getElementById("button-copy-prompt") as HTMLButtonElement
        buttonCopyPrompt.addEventListener('click', this.copyPrompt);
      }, 1000);

      return `
    <div class="flex gap-16 min-h-[340px]">
      <img width="320px" height="100%"
        src="${IMAGES_URL}${medium?.url ?? small?.url}"
        alt="Image for post ${item.attributes.file_name}"
        loading="lazy" class="min-h-[160px] h-fit"
      >
      <div class="rounded-2xl shadow-lg p-6 relative">
        <p class="font-bold">Prompt</p>
        <p id="prompt-to-copy">${item.attributes.prompt}</p>
        <p class="font-bold mt-4">Negative prompt</p>
        <p>${item.attributes.negative_promt?? 'N/A'}</p>
        <div class="flex  gap-2 mt-4">
          <p class="font-bold">Height: </p>
          <p>${item.attributes.height}</p>
          <p class="font-bold">Width: </p>
          <p>${item.attributes.width}</p>
          <p class="font-bold">cfg_scale: </p>
          <p>${item.attributes.cfg_scale}</p>
          <p class="font-bold">seed: </p>
          <p>${item.attributes.seed}</p>
          <p class="font-bold">steps: </p>
          <p>${item.attributes.steps}</p>
          <p class="font-bold">generator: </p>
          <p>${item.attributes.generator}</p>
        </div>
         <div class="flex  gap-2 mt-4">
            <p class="font-bold">model: </p>
            <p>${item.attributes.model}</p>
            <p class="font-bold">tag: </p>
            <p>${item.attributes.tag.data?? 'N/A'}</p>
         </div>
         <label id="button-copy-prompt" class="absolute left-7 bottom-4 flex items-center flex-row gap-2 text-md cursor-pointer"><img src='icons/icon-copy.svg' alt='copy'> <span> Copy prompt</span> </label>
      </div>
    </div>
  `;
    }

    copyPrompt() {
      const prompt: HTMLParagraphElement = document.getElementById("prompt-to-copy") as HTMLParagraphElement;
      const buttonCopyPrompt: HTMLButtonElement = document.getElementById("button-copy-prompt") as HTMLButtonElement
      if (prompt && buttonCopyPrompt) {
        const text = prompt.textContent;
        if(text){
          navigator.clipboard.writeText(text);
          buttonCopyPrompt.getElementsByTagName('span')[0].textContent = 'Copied !';
        }
      }
    }

    renderCards(data) {
      const cardContainer = document.getElementById("gallery");
      const imageDialogText = document.getElementById("image-dialog-text");

      if (cardContainer) {
        data.data.forEach((item, index) => {
          const cardTemplate = this.createCardTemplate(item, index);
          setInterval(() => {
            cardContainer.querySelectorAll("img").forEach((img) => {
              img.classList.add("is-visible");
              this.masonry.layout();
            });
          }, 250);
          cardContainer.insertAdjacentHTML("beforeend", cardTemplate);
          cardContainer?.lastElementChild
            ?.querySelector("img")
            ?.addEventListener("click", () => {
              if (imageDialogText) {
                const dialogTemplate = this.createDialogImageTemplate(item);
                imageDialogText.innerHTML = "";
                imageDialogText.insertAdjacentHTML("beforeend", dialogTemplate);
                // imageDialogText.textContent = 'You clicked on the image for post: ' + item.attributes.file_name;
              }
              openDialogId("img-dialog");
            });
        });
      }
    }

    setupInfiniteScroll() {
      const loadMoreElement = document.getElementById("load-more");

      window.addEventListener("scroll", async () => {
        const scrollPosition = window.innerHeight + window.scrollY + 300;
        const documentHeight = document.documentElement.offsetHeight;

        if (scrollPosition >= documentHeight && !this.loading) {
          this.loading = true;
          this.currentPage++;
          const gallery = document.getElementById("gallery");
          const images = gallery.querySelectorAll("img");
          this.loadedCount = 0;
          images.forEach((image) => {
            if (this.total === images.length && loadMoreElement) {
              loadMoreElement.textContent = "No more images to load";
              return;
            }
            if (image.complete) {
              this.loadedCount++;
            } else {
              image.addEventListener("load", async () => {
                // console.log('1');
                this.loadedCount++;
                if (this.loadedCount === images.length) {
                  const newData = await this.fetchData(this.currentPage);
                  this.renderCards(newData);
                  // console.log(this.loadedCount, images.length);
                }
              });
            }
          });
          if (this.loadedCount === images.length) {
            // console.log('2');
            const newData = await this.fetchData(this.currentPage);
            this.renderCards(newData);
            // console.log(this.loadedCount, images.length);
            // console.log('new data',await newData.meta.pagination.total);
          }
        }
      });
    }

    async reset() {
      this.currentPage = 1;
      const cardContainer = document.getElementById("gallery");
      if (cardContainer) {
        cardContainer.innerHTML = "";
        const initialData = await this.fetchData(this.currentPage);
        this.renderCards(initialData);
        this.setupInfiniteScroll();
        this.masonry.destroy();
        this.masonry.layout();
      }
    }

    async init() {
      const initialData = await this.fetchData(this.currentPage);
      this.renderCards(initialData);
      this.setupInfiniteScroll();
      this.masonry.layout();
    }
  }

//   const gallery = new Gallery();