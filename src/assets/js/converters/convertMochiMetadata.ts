import { ImageObject } from "../../types/ImageObject";

export default function convertMochiMetadata(input): ImageObject {
    
    console.log('convertMochiMetadata', input);

    const inputString: string = input.value;

    const object: ImageObject = {
        prompt: "",
        negative_prompt: "",
        model: "",
        seed: "",
        width: "",
        height: "",
        cfg_scale: "",
        steps: "",
        generator: "",
      };
      const inputArray: string[] = inputString.split(";");
      const includeArray: string[] = inputArray[0].split(":");
      const excludeArray: string[] = inputArray[1].split(":");
      object.prompt = includeArray[1].trim();
      object.negative_prompt = excludeArray[1].trim();
      const parametersString: string = inputArray.slice(2).join(",");
      const parametersArray: string[] = parametersString.split(",");
      for (let i: number = 0; i < parametersArray.length; i++) {
        const param: string[] = parametersArray[i].split(":");
        const key: string = param[0].trim().replace(" ", "_");
        let value: any;
        if (param[1]) {
          value = param[1].trim();
          if (key === "Size") {
            const sizeArray: string[] = value.split("x");
            object.width = sizeArray[0];
            object.height = sizeArray[1];
          } else {
            const subValue: string = value
              .split(";")
              .map((str: string) => {
                return str.trim().replace("{", "").replace("}", "");
              })[0];
            value = { [key]: subValue };
          }

            if(key === 'Model'){
                object.model = param[1].trim();
            }
            if(key === 'Seed'){
                object.seed = param[1].trim();
            }
            if(key === 'Steps'){
                object.steps = param[1].trim();
            }
            if(key === 'Guidance_Scale'){
                object.cfg_scale = param[1].trim();
            }
            if(key === 'Generator'){
                object.generator = 'Mochi';
            }

        }
      }
      return object;

}

