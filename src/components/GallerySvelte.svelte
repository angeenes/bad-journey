<script lang="ts">
  import MiniMasonry from "minimasonry";
  import { BEARER_TOKEN } from "src/consts";

  let images = [
    {
      width: 416,
      height: 277,
      src: "https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 624,
      src: "https://res.cloudinary.com/dculmxe31/image/upload/v1685188592/small_00085_345653682_33563dfc8e.webp",
    },
    {
      width: 416,
      height: 277,
      src: "https://res.cloudinary.com/dculmxe31/image/upload/v1685134361/small_00096_2623739577_278d21cfcf.webp",
    },
    {
      width: 416,
      height: 624,
      src: "https://res.cloudinary.com/dculmxe31/image/upload/v1684690978/small_00030_1784338067_1cd5d5d626.webp",
    },
    {
      width: 416,
      height: 277,
      src: "https://res.cloudinary.com/dculmxe31/image/upload/v1684616440/small_000470_1087f882_3401852428_b6f7fb0b52.webp",
    },
    {
      width: 416,
      height: 624,
      src: "https://res.cloudinary.com/dculmxe31/image/upload/v1684615299/small_00016_1564749781_3ba969fee9.webp",
    },
    {
      width: 416,
      height: 624,
      src: "https://res.cloudinary.com/dculmxe31/image/upload/v1684615388/small_00046_146946367_04971579c8.webp",
    },
    {
      width: 416,
      height: 277,
      src: "https://images.unsplash.com/photo-1582864918540-8725580f31d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 312,
      src: "https://res.cloudinary.com/dculmxe31/image/upload/v1684615333/small_00009_2897749226_6b975c8a3e.webp",
    },
    {
      width: 416,
      height: 277,
      src: "https://images.unsplash.com/photo-1582816907658-acb2085dbcc1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 624,
      src: "https://images.unsplash.com/photo-1582793863191-debca6278c90?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 234,
      src: "https://res.cloudinary.com/dculmxe31/image/upload/v1684677757/small_00001_1899710820_black_futuris_b1343d8d33.webp",
    },
    {
      width: 416,
      height: 520,
      src: "https://images.unsplash.com/photo-1581911543185-c860183be47a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 520,
      src: "https://images.unsplash.com/photo-1561634109-465ffe688b50?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 624,
      src: "https://images.unsplash.com/photo-1582830500208-dd6dbfcfc0b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 624,
      src: "https://images.unsplash.com/photo-1582841828369-9728531f1a19?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 520,
      src: "https://images.unsplash.com/photo-1582858291683-cdcd04a5c430?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 593,
      src: "https://images.unsplash.com/photo-1582850178720-ea2e711beaaa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 624,
      src: "https://images.unsplash.com/photo-1582833736361-711004046fb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 520,
      src: "https://images.unsplash.com/photo-1579286607636-bd61ef2ef888?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 624,
      src: "https://images.unsplash.com/photo-1582829542174-2c42e7ecfd39?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 278,
      src: "https://images.unsplash.com/photo-1582840996732-e9c89c6feb34?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
    {
      width: 416,
      height: 624,
      src: "https://images.unsplash.com/photo-1582842107966-1d6bc1e372f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    },
  ];

  // calculate aspect ratio for element height
  // if (images.length) {
  //   images = images.map((img) => ({
  //     src: img.src,
  //     padding: (img.height / img.width) * 100,
  //   }));
  // }

  function setup() {
    loadImages().then((images) => {
      this.images = images;
      this.isLoading = false;
      this.page = 1;
    });
    const masonry = new MiniMasonry({
      container: "#grid",
      gutter: 10,
      baseWidth: 320,
      resize: true,
      minify: true,
    })();
  }

  function loadImages(page?: number): Promise<any[]> {
    this.isLoading = true;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BEARER_TOKEN}`,
    };

    let endpointTags = "";

    if (this.tag) {
      endpointTags += `&filters[tag][name][$eq]=${this.tag}`;
    }

    if (this.userId) {
      endpointTags += `&filters[users_permissions_user][id][$eq]=${this.userId}`;
    }

    if (this.searchString) {
      endpointTags += `&filters[prompt][$containsi]=${this.searchString}`;
    }

    return (
      fetch(
        `${this.url}/images?populate=*&sort[0]=id%3Adesc&pagination[page]=${page}&pagination[pageSize]=${this.pageSize}${endpointTags}`,
        // return fetch(`${this.url}/images?populate[users_permissions_user][fields][0]=username&populate[users_permissions_user][populate][0]=avatar&populate[image][fields][0]=formats&populate[tag][fields][0]=name&sort[0]=id%3Adesc&pagination[page]=${page}&pagination[pageSize]=${this.pageSize}${endpointTags}`,
        // &populate[users_permissions_user][fields][0]=username&populate[users_permissions_user][fields][1]=id
        { headers }
      )
        .then((response) => response.json())
        // .then(data => console.log(data, 'data'))
        .then((data) => data.data)
    );
  }

  function launchLightbox(e) {
    // on click - open lightbox - bigpicture
    e.preventDefault();
    // BigPicture({
    //   el: e.target,
    //   gallery: "#grid"
    // });
  }
</script>

<!-- <main> -->
<div id="grid" class="relative block w-full" use:setup>
  {#each images as image, i}
    <!-- <div class="grid-item" data-background-image={image.src}>
      <div class="gi-padding" style="padding-bottom:{image.padding}%" />
      <a
        href={image.src}
        target="_blank"
        data-bp={image.src}
        on:click={launchLightbox}
      >
        <span class="sr-only">{image.src}</span>
      </a>
    </div> -->

    <article class="card is-visible">
      <img
        width="320"
        src={image.src}
        alt="Image gallery"
        loading="lazy"
        class="w-full card-img h-full"
        style="transition-delay : {i * 1000}ms"
      />
      <div
        class="btn-like icon-like px-3 py-2 bg-white font-black flex justify-center items-center rounded-md absolute z-20 top-3 right-3 text-black hover:text-pink-500 text-base"
      >
        ♡
      </div>
      <section class="card-overlay hover:block inset-0 absolute z-10 px-3">
        <div class="flex items-center justify-between w-full text-white">
          <button class="flex items-center">
            <img
              src="https://res.cloudinary.com/dculmxe31/image/upload/v1684161890/IMG_3850_547ec428b7.webp"
              alt="nelson.patrao"
              width="32"
              height="32"
              class="rounded-full mr-2 h-8 w-8 /> nelson.patrao
          </button>
          <button class="
            /> ♥ 0
          </button>
          <span class="flex items-center gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="14"
              fill="none"
              ><path
                fill="currentColor"
                d="M9.983 4.377a2.634 2.634 0 1 0 0 5.268 2.634 2.634 0 0 0 0-5.268Zm0-4.139C4.997.238.954 5.882.954 7.011c0 1.129 4.044 6.772 9.03 6.772 4.987 0 9.03-5.643 9.03-6.772 0-1.129-4.043-6.773-9.03-6.773Zm0 10.912a4.138 4.138 0 1 1 0-8.277 4.138 4.138 0 0 1 0 8.277Z"
              /></svg
            >
            35k
          </span>
        </div>
      </section>
    </article>
  {/each}
</div>
