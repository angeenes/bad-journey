
import { API_URL, BEARER_TOKEN, IMAGES_URL } from "../../consts";

 export class Gallery {
    currentPage: number;
    itemsPerPage: number;
    total: number | null;
    loadedCount: number;
    loading: boolean;

    constructor() {
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

      return `
    <div class="flex">
      <div>
        <p>Prompt : ${item.attributes.prompt}</p>
        <p>Negative prompt : ${item.attributes.negative_promt}</p>
        <p>Height: ${item.attributes.height}</p>
        <p>Width: ${item.attributes.width}</p>
        <p>cfg_scale: ${item.attributes.cfg_scale}</p>
        <p>seed: ${item.attributes.seed}</p>
        <p>steps: ${item.attributes.steps}</p>
        <p>generator: ${item.attributes.generator}</p>
        <p>model: ${item.attributes.model}</p>
        <p>tag: ${item.attributes.tag.data}</p>
      </div>
      <img width="320px" height="100%"
        src="${IMAGES_URL}${medium?.url ?? small?.url}"
        alt="Image for post ${item.attributes.file_name}"
        loading="lazy" class="min-h-[160px]"
      >
    </div>
  `;
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
            if (this.total === images.length) {
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