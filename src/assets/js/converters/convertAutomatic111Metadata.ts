import { ImageObject } from "../../types/ImageObject";

export default function convertAutomatic111Metadata(input: string): ImageObject {

  console.log('convertAutomatic111Metadata REÇOIS :       ', input);

  // Expression régulière pour extraire la largeur et la hauteur de l'image
  const sizeRegExp = /Size: (\d+)x(\d+)/;

  // Expression régulière pour extraire les informations de la ligne "Steps"
  const stepsRegExp = /Steps: (\d+), Sampler: (\w+) ([a-z]), CFG scale: (\d+), Seed: (\d+), (.+)/i;


  const sizeMatch = input.match(sizeRegExp);
  const stepsMatch = input.match(stepsRegExp);

  // Extraction des informations du texte d'entrée en utilisant les expressions régulières
  const [, width, height] = sizeMatch || [];
  const [, steps, generator, cfg_scale, seed, model] = stepsMatch || []; // handle null by providing a default empty array

  const negativePromptMatch = input.match(/Negative prompt: (.+)/);
  const negativePrompt = negativePromptMatch ? negativePromptMatch[1] : "";

  // Création de l'objet "ImageObject"
  const output: ImageObject = {
    prompt: input.split("\n")[0],
    negative_prompt: negativePrompt,
    model: model || "",
    seed: seed || "",
    width: width,
    height: height,
    cfg_scale: cfg_scale || "",
    steps: steps || "",
    generator: 'Automatic111',
  };

  console.log('ouput', output);


  return output;
}
