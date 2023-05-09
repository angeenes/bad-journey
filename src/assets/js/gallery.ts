
import { API_URL, BEARER_TOKEN, IMAGES_URL } from "../../consts";
import { DatasImages } from "../interfaces/ApiDatasImages";
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
  public tag: string | null | undefined;
  public userId: number | null | undefined;

  constructor(tag?: string, userId?: number) {
    this.tag = tag;
    this.userId = userId;
    this.url = API_URL;
    this.pageSize = 15;
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

    // console.log('addImagesToSection');

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

    if(this.userId) {
      endpointTags += `&filters[users_permissions_user][id][$eq]=${this.userId}`;
    }

    return fetch(`${this.url}/images?populate[users_permissions_user][fields][0]=username&populate[users_permissions_user][populate][0]=avatar&populate[image][fields][0]=formats&populate[tag][fields][0]=name&sort[0]=id%3Adesc&pagination[page]=${page}&pagination[pageSize]=${this.pageSize}${endpointTags}`,
    // &populate[users_permissions_user][fields][0]=username&populate[users_permissions_user][fields][1]=id
      { headers }
    )
      .then(response => response.json())
      // .then(data => console.log(data, 'data'))
      .then(data => data.data);
  }



  private createImageElements(images): HTMLElement[] {
    // console.log(images, 'images');
    
    return images.map(({ attributes }, index, images) => {    
      const creatorUserName = attributes.users_permissions_user.data?.attributes?.username ? attributes.users_permissions_user.data.attributes?.username : 'Anonymous';
      const creatorUserAvatar = attributes.users_permissions_user.data?.attributes?.avatar?.data?.attributes?.formats?.thumbnail.url ?? '/uploads/fake_avatar_e5303ab97f.jpg';
      const html = `
        <article class="card">
          <img width="320"
            src="${IMAGES_URL}${attributes.image.data.attributes.formats.medium.url}"
            alt="Image gallery"
            loading="lazy" class="w-full card-img h-full"
            style="transition-delay : ${index * 250}ms"
          >
          <div class="btn-like icon-like px-3 py-2 bg-white font-black flex justify-center items-center rounded-md absolute z-20 top-3 right-3 text-black hover:text-pink-500 text-base"> ♡ </div>
          <section class="card-overlay hover:block inset-0 absolute z-10 px-3">
            <div class="flex items-center justify-between w-full text-white">
              <button class="flex items-center">  
                <img src="${IMAGES_URL}${creatorUserAvatar}" alt="${creatorUserName}" width="32" height="32" class="rounded-full mr-2 h-8 w-8 />  ${creatorUserName}
              </button>
              <button class="btn-like"> ♥ 66 </button>
              <span class="flex items-center gap-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" fill="none"><path fill="currentColor" d="M9.983 4.377a2.634 2.634 0 1 0 0 5.268 2.634 2.634 0 0 0 0-5.268Zm0-4.139C4.997.238.954 5.882.954 7.011c0 1.129 4.044 6.772 9.03 6.772 4.987 0 9.03-5.643 9.03-6.772 0-1.129-4.043-6.773-9.03-6.773Zm0 10.912a4.138 4.138 0 1 1 0-8.277 4.138 4.138 0 0 1 0 8.277Z"/></svg> 
                35k
              </span>
            </div>
          </section>
        </article>
      `;
      const card = this.htmlToElement(html);
      if (card) {
        const btnLike = card.querySelector('.btn-like');
        
        btnLike.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.likeImage(images[index]);
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

  private likeImage(id ) {
    console.log('likeImage receives the image id: ', id);
    
    alert('likeImage mot implemented yet');
  }

  // private getUser(): User {
  //   const user = localStorage.getItem('user');
  //   return user ? JSON.parse(user) : null;
  // }


  private createDialogImageTemplate(item) {
    // console.log('createDialogImageTemplate', item);
    const creatorUserName = item.users_permissions_user.data?.attributes?.username ? item.users_permissions_user.data.attributes?.username : 'Anonymous';
    const creatorUserAvatar = item.users_permissions_user.data?.attributes?.avatar?.data?.attributes?.formats?.thumbnail.url ?? '/uploads/fake_avatar_e5303ab97f.jpg';

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
      <article>
      <button class="flex items-center">  <img src="${IMAGES_URL}${creatorUserAvatar}" alt="${creatorUserName}" width="32" height="32" class="rounded-full mr-2 h-8 w-8" />  ${creatorUserName} </button>
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
            <p>${item.tag.data.attributes.name ?? 'N/A'}</p>
          </div>
        </div>
        </section>
        <section class="flex justify-between mt-7">
         <button id="button-copy-prompt" class="flex items-center flex-row gap-2 text-md cursor-pointer"><img src='/icons/icon-copy.svg' alt='copy'> <span> Copy prompt</span> </button>
        </section>
      </div>
      <section class="flex items-center justify-between">
      <div class="flex gap-5 items-center p-3 text-primary">
      <button class="btn-like">♥ 66</button>
      <span class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" fill="none"><path fill="currentColor" d="M9.983 4.377a2.634 2.634 0 1 0 0 5.268 2.634 2.634 0 0 0 0-5.268Zm0-4.139C4.997.238.954 5.882.954 7.011c0 1.129 4.044 6.772 9.03 6.772 4.987 0 9.03-5.643 9.03-6.772 0-1.129-4.043-6.773-9.03-6.773Zm0 10.912a4.138 4.138 0 1 1 0-8.277 4.138 4.138 0 0 1 0 8.277Z"/></svg> 35841</span>
      </div>
      <button id="button-twitter-share" class="flex items-center flex-row gap-2 text-md cursor-pointer"><img src='/icons/icon-twitter.svg' alt='twitter'> <span> Share on Twitter</span> </button>
</section>
      <article>
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

