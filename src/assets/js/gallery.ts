
import { API_URL, BEARER_TOKEN, IMAGES_URL } from "../../consts";
import { DatasImages } from "../types/ApiDatasImages";
import MiniMasonry from "minimasonry";

export class Gallery {
  private readonly url: string;
  private readonly pageSize: number;
  private page: number;
  private readonly imagesSection: HTMLDivElement;
  private readonly imageDialogText: HTMLDivElement;
  private readonly loadMoreTextEl: HTMLDivElement;
  private readonly loaderBarEl: HTMLDivElement;
  private isLoading: boolean;
  private noMoreImages: boolean;
  private readonly debounceTimeout: number;
  private masonryInstance: any;
  public tag: string;

  constructor(tag: string) {
    this.tag = tag;
    this.url = API_URL;
    this.pageSize = 10;
    this.page = 1;
    this.imagesSection = document.getElementById('gallery') as HTMLDivElement;
    this.imageDialogText = document.getElementById('image-dialog-text') as HTMLDivElement;
    this.loadMoreTextEl = document.getElementById('load-more') as HTMLDivElement;
    this.loaderBarEl = document.getElementById('loader-bar') as HTMLDivElement;
    this.isLoading = false;
    this.noMoreImages = false;
    this.debounceTimeout = 500;
    this.masonryInstance = new MiniMasonry({
      container: '#gallery',
      gutter: 10,
      baseWidth: 320,
      resize: true,
      minify: true,
    });

    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private htmlToElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }


  private addImagesToSection(images: DatasImages['data']): void {

    console.log('addImagesToSection');

    const imageElements = this.createImageElements(images);
    this.imagesSection.append(...imageElements);

    imageElements.forEach((card) => {
      setTimeout(() => {
        card.classList.add('is-visible');
        this.masonryInstance.layout();
      }, 1500);
    });

    // Call layout() once all cards are added to the DOM
    // setTimeout(() => {
    //   this.masonryInstance.layout();
    // }, 500);
  }


  private loadImages(page: number): Promise<any[]> {
    this.isLoading = true;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BEARER_TOKEN}`,
    };

    console.log('tag', this.tag);

    let endpointTags = '';

    if (this.tag) {
      endpointTags += `&filters[tag][name][$eq]=${this.tag}`;
    }

    return fetch(`${this.url}images?populate=*&sort[0]=id%3Adesc&pagination[page]=${page}&pagination[pageSize]=${this.pageSize}${endpointTags}`,
      { headers }
    )
      .then(response => response.json())
      // .then(data => console.log(data, 'data'))
      .then(data => data.data);
  }



  private createImageElements(images): HTMLElement[] {
    return images.map(({ attributes }, index) => {
      const html = `
        <article class="card">
          <img width="320"
            src="${IMAGES_URL}${attributes.image.data.attributes.formats.medium.url}"
            alt="Image gallery"
            loading="lazy" class="w-full card-img h-full"
            style="transition-delay : ${index * 250}ms"
          >
          <section class="card-overlay hover:block inset-0 absolute z-10">
            <button class="card-like text-pink-500">
            ♥
            </button>
          </section>
        </article>
      `;
      const card = this.htmlToElement(html);
      if (card) {
        const btnLike = card.querySelector('.card-like');
        
        btnLike.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.likeImage(e.target as HTMLElement);
        });
        
        card.addEventListener('click', () => {
          if (this.imageDialogText) {
            const dialogTemplate = this.createDialogImageTemplate(attributes);
            this.imageDialogText.innerHTML = "";
            this.imageDialogText.insertAdjacentHTML("beforeend", dialogTemplate);
          }
          openDialogId("img-dialog");

        });
      }
      return card;
    });
  }

  private likeImage(target: HTMLElement) {
    console.log('likeImage', target);
    
    alert('likeImage mot implemented yet');
  }


  private createDialogImageTemplate(item) {

    console.log('createDialogImageTemplate', item);

    setTimeout(() => {
      const buttonCopyPrompt: HTMLButtonElement = document.getElementById("button-copy-prompt") as HTMLButtonElement
      buttonCopyPrompt.addEventListener('click', this.copyPrompt);
    }, 1000);

    return `
    <div class="flex gap-16 min-h-[340px]">
      <img width="320px" height="100%"
        src="${IMAGES_URL}${item?.image.data.attributes.formats.large?.url ?? item?.image.data.attributes.formats.medium?.url}"
        alt="Image gallery details"
        loading="lazy" class="min-h-[160px] h-fit max-h-[80vh] hover:w-max"
      >
      <div class="rounded-2xl shadow-lg p-6 flex justify-between flex-col">
      <section>
        <p class="font-bold">Prompt</p>
        <p id="prompt-to-copy">${item.prompt}</p>
        <p class="font-bold mt-4">Negative prompt</p>
        <p>${item.negative_promt ?? 'N/A'}</p>
        
        <div class="flex flex-wrap gap-2 mt-4">
          <p class="font-bold">Height: </p>
          <p>${item.height}</p>
          <p class="font-bold">Width: </p>
          <p>${item.width}</p>
          <p class="font-bold">cfg_scale: </p>
          <p>${item.cfg_scale}</p>
          <p class="font-bold">seed: </p>
          <p>${item.seed}</p>
          <p class="font-bold">steps: </p>
          <p>${item.steps}</p>
          <p class="font-bold">generator: </p>
          <p>${item.generator}</p>
        </div>
        <div class="mt-4">
        <div class="flex gap-2">
          <p class="font-bold">model: </p>
          <p>${item.model}</p>
          </div>
            <div class="flex gap-2">
            <p class="font-bold">tag: </p>
            <p>${item.tag.data ?? 'N/A'}</p>
          </div>
        </div>
        </section>
        <section class="flex justify-between mt-7">
         <label id="button-copy-prompt" class="flex items-center flex-row gap-2 text-md cursor-pointer"><img src='icons/icon-copy.svg' alt='copy'> <span> Copy prompt</span> </label>
         <label id="button-twitter-share" class="flex items-center flex-row gap-2 text-md cursor-pointer"><img src='icons/icon-twitter.svg' alt='twitter'> <span> Share on Twitter</span> </label>
        </section>
      </div>
    </div>
  `;
  }

  copyPrompt() {
    const prompt: HTMLParagraphElement = document.getElementById("prompt-to-copy") as HTMLParagraphElement;
    const buttonCopyPrompt: HTMLButtonElement = document.getElementById("button-copy-prompt") as HTMLButtonElement
    if (prompt && buttonCopyPrompt) {
      const text = prompt.textContent;
      if (text) {
        navigator.clipboard.writeText(text);
        buttonCopyPrompt.getElementsByTagName('span')[0].textContent = 'Copied !';
      }
    }
  }



  public async loadMore(): Promise<void> {
    console.log('Chargement de la page suivante');
    this.page++;
    try {
      const images = await this.loadImages(this.page);
      if (images && images.length > 0) {
        await this.addImagesToSection(images);
      } else {
        console.error('Aucune image supplémentaire à charger.');
        this.loadMoreTextEl.innerText = 'You reached the end of your journey.No more images to load';
        this.noMoreImages = true;
        this.loaderBarEl.style.display = 'none';
      }
    } catch (error) {
      console.error('Erreur lors du chargement des images supplémentaires:', error);
    } finally {
      this.isLoading = false; // Réinitialisez isLoading à false dans le bloc finally
    }
  }



  public async init(): Promise<void> {
    // console.log('init Gallery');

    try {
      const images = await this.loadImages(this.page);
      if (images && images.length > 0) {
        await this.addImagesToSection(images);
        this.isLoading = false;
      } else {
        console.error('Aucune image n\'a été chargée.');
        this.loadMoreTextEl.innerText = 'No images to load';
      }
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
    }
  }


  private handleScroll(): void {

    if (!this.isLoading && !this.noMoreImages) {

      const threshold = 500;

      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight + threshold) {

        this.isLoading = true;
        setTimeout(() => {
          this.loadMore();
        }, this.debounceTimeout);
      }
    }
  }


}

// export const loader = new Gallery();
// loader.init();

