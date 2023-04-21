import { ImageObject } from "../../types/ImageObject";

interface InputObject {
    model: string;
    model_weights: string;
    model_hash: string;
    app_id: string;
    app_version: string;
    image: {
        prompt: string;
        steps: number;
        cfg_scale: number;
        threshold: number;
        perlin: number;
        height: number;
        width: number;
        seed: number;
        hires_fix: boolean;
        seamless: boolean;
        type: string;
        postprocessing: any;
        sampler: string;
        variations: any[];
    };
}

export default function convertInvokeMetadata(input: InputObject): ImageObject {

    // console.log('convertInvokeMetadata REÇOIS', input);

    const regex = /\[(.*?)\]/g;
    // const matches = input.image.prompt.match(regex) || [];
    const matches = typeof input.image.prompt === "string" ? input.image.prompt.match(regex) || [] : [];
    const negativePrompt = matches.join(" ").replace(/\[|\]/g, "");
    const promptWithoutnegativePrompt = input.image.prompt.replace(regex, "");

    const output: ImageObject = {
        prompt: promptWithoutnegativePrompt,
        negative_prompt: negativePrompt,
        model: input.model_weights,
        seed: input.image.seed.toString(),
        width: input.image.width.toString(),
        height: input.image.height.toString(),
        cfg_scale: input.image.cfg_scale.toString().replace(/,/g, '.'),
        steps: input.image.steps.toString(),
        generator: input.app_id.toString(),
    };
    return output;
}

