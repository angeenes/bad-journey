export interface ImageObject {
    prompt: string;
    negative_prompt?: string;
    model?: string;
    seed?: string;
    width: string;
    height: string;
    cfg_scale?: string;
    steps?: string;
    generator: string;
  }