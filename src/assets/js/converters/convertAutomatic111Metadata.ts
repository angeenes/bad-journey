import { ImageObject } from "../../interfaces/ImageObject";

export default function convertAutomatic111Metadata(input: string): ImageObject {

  console.log('DEBUG : convertAutomatic111Metadata REÇOIS :      ', input);

  // Définition des expressions régulières pour chaque information à extraire
  const sizeRegExp = /Size: (\d+)x(\d+)/;
  const stepsRegExp = /Steps: (\d+)/i;
  const modelRegExp = /Model: (.+)/i;
  const seddRegExp = /Seed: (\d+)/i;
  const gfcScaleRegExp = /scale:\s*(\d+)/i;
  const samplerRegExp = /Sampler: (\w+) ([a-z])/i

  // Extraction des informations du texte d'entrée en utilisant les expressions régulières
  const sizeMatch = input.match(sizeRegExp);
  const stepsMatch = input.match(stepsRegExp);
  const modelMatch = input.match(modelRegExp);
  const seedMatch = input.match(seddRegExp);
  const gfcScaleMatch = input.match(gfcScaleRegExp);
  const samplerMatch = input.match(samplerRegExp);

  // Attribution des valeurs correspondantes à chaque information extraite
  const [, widthValue, heightValue] = sizeMatch || [];
  const [, stepsValue] = stepsMatch || [];
  const [, modelValue] = modelMatch || [];
  const [, seedValue] = seedMatch || [];
  const [, cfg_scaleValue] = gfcScaleMatch || [];
  const [, samplerValue] = samplerMatch || [];

  // Extraction de la prompt négative, si elle existe
  const negativePromptMatch = input.match(/Negative prompt: (.+)/);
  const negativePrompt = negativePromptMatch ? negativePromptMatch[1] : "";

  // Création de l'objet "ImageObject" en utilisant les valeurs extraites et la prompt d'entrée
  const output: ImageObject = {
    prompt: input.split("\n")[0],
    negative_prompt: negativePrompt,
    model: modelValue || "",
    seed: seedValue || "",
    width: widthValue,
    height: heightValue,
    cfg_scale: cfg_scaleValue || "",
    steps: stepsValue || "",
    generator: 'Automatic111',
    sampler: samplerValue || ""
  };

  console.log('DEBUG output', output);

  return output;
}
