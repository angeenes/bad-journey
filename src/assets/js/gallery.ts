
import { API_URL, BEARER_TOKEN, IMAGES_URL } from "../../consts";
import { DatasImages } from "../types/ApiDatasImages";

export class Gallery {
  private readonly url: string;
  private readonly pageSize: number;
  private page: number;
  private readonly imagesSection: HTMLDivElement;
  private readonly imageDialogText: HTMLDivElement;
  private isLoading: boolean;
  private readonly debounceTimeout: number;
  private masonryInstance: any;

  constructor() {
    this.url = API_URL;
    this.pageSize = 10;
    this.page = 1;
    this.imagesSection = document.getElementById('gallery') as HTMLDivElement;
    this.imageDialogText = document.getElementById('image-dialog-text') as HTMLDivElement;
    this.isLoading = false;
    this.debounceTimeout = 300;
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
      }, 1500);
    });

    // Call layout() once all cards are added to the DOM
    setTimeout(() => {
      this.masonryInstance.layout();
    }, 500);
  }


  private loadImages(page: number): Promise<any[]> {
    this.isLoading = true;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BEARER_TOKEN}`,
    };

    return fetch(`${this.url}images?populate=*&sort[0]=id%3Adesc&pagination[page]=${page}&pagination[pageSize]=${this.pageSize}`,
      { headers }
    )
      .then(response => response.json())
      // .then(data => console.log(data, 'data'))
      .then(data => data.data);
  }



  private createImageElements(images): HTMLElement[] {
    return images.map(({ attributes }, index) => {
      const html = `
        <div class="card">
          <img width="320"
            src="${IMAGES_URL}${attributes.image.data.attributes.formats.small.url}"
            alt="Image gallery"
            loading="lazy" class="w-full card-img h-full"
            style="transition-delay : ${index * 250}ms"
          >
        </div>
      `;
      const card = this.htmlToElement(html);
      if (card) {
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


  private createDialogImageTemplate(item) {

    console.log('createDialogImageTemplate', item);

    setTimeout(() => {
      const buttonCopyPrompt: HTMLButtonElement = document.getElementById("button-copy-prompt") as HTMLButtonElement
      buttonCopyPrompt.addEventListener('click', this.copyPrompt);
    }, 1000);

    return `
    <div class="flex gap-16 min-h-[340px]">
      <img width="320px" height="100%"
        src="${IMAGES_URL}${item?.image.data.attributes.formats.small?.url}"
        alt="Image gallery details"
        loading="lazy" class="min-h-[160px] h-fit"
      >
      <div class="rounded-2xl shadow-lg p-6 relative">
        <p class="font-bold">Prompt</p>
        <p id="prompt-to-copy">${item.prompt}</p>
        <p class="font-bold mt-4">Negative prompt</p>
        <p>${item.negative_promt ?? 'N/A'}</p>
        <div class="flex  gap-2 mt-4">
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
         <div class="flex  gap-2 mt-4">
            <p class="font-bold">model: </p>
            <p>${item.model}</p>
            <p class="font-bold">tag: </p>
            <p>${item.tag.data ?? 'N/A'}</p>
         </div>
         <label id="button-copy-prompt" class="absolute left-7 bottom-4 flex items-center flex-row gap-2 text-md cursor-pointer"><img src='icons/icon-copy.svg' alt='copy'> <span> Copy prompt</span> </label>
         <label id="button-twitter-share" class="absolute right-7 bottom-4 flex items-center flex-row gap-2 text-md cursor-pointer"><img src='icons/icon-twitter.svg' alt='twitter'> <span> Share on Twitter</span> </label>
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
      }
    } catch (error) {
      console.error('Erreur lors du chargement des images supplémentaires:', error);
    } finally {
      this.isLoading = false; // Réinitialisez isLoading à false dans le bloc finally
    }
  }



  public async init(): Promise<void> {
    console.log('init Gallery');

    try {
      const images = await this.loadImages(this.page);
      if (images && images.length > 0) {
        await this.addImagesToSection(images);
        this.isLoading = false;
      } else {
        console.error('Aucune image n\'a été chargée.');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
    }
  }


  private handleScroll(): void {
    console.log('handleScroll');

    if (!this.isLoading) {
      // const { scrollTop, scrollHeight, clientHeight } = document.body;
      // const threshold = 100;

      // console.log('scrollTop:', scrollTop);
      // console.log('scrollHeight:', scrollHeight);
      // console.log('clientHeight:', clientHeight);

      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        console.log('BOTTOM');
        this.isLoading = true;
        setTimeout(() => {
          this.loadMore();
        }, this.debounceTimeout);
      }

      // if (scrollTop + clientHeight >= scrollHeight - threshold) {
      //   console.log('Déclenchement du chargement de la page suivante');
      //   this.isLoading = true;
      //   setTimeout(() => {
      //     this.loadMore();
      //   }, this.debounceTimeout);
      // }
    }
  }


}

// export const loader = new Gallery();
// loader.init();

