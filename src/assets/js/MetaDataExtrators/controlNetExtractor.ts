export class ControlNetMetadataExtractor {
  public extractDataFromString(chaine: string): any { //Note :  Not tested outside Automatic111
    if (chaine.includes('ControlNet')) {
      const regex = /Version:\s+(.*?)\s*,.*ControlNet:\s+"preprocessor:\s+(.*?)\s*,\s*model:\s+(.*?)\s+\[(.*?)\],\s*weight:\s+(\d+)\s*,\s*starting\/ending:\s+\((\d+),\s*(\d+)\)\s*,\s*resize\s*mode:\s+(.*?)\s*,\s*pixel\s*perfect:\s*(.*?)\s*,\s*control\s*mode:\s+(.*?)\s*,\s*preprocessor\s*params:\s*\((\d+),\s*(\d+),\s*(\d+)\)/;
      const matches = regex.exec(chaine);

      if (matches) {
        const [, version, preprocessor, model, modelId, weight, start, end, resizeMode, pixelPerfect, controlMode, param1, param2, param3] = matches;

        return {
          version,
          preprocessor,
          model,
          modelId,
          weight: parseInt(weight),
          start: parseInt(start),
          end: parseInt(end),
          resizeMode,
          pixelPerfect: pixelPerfect === 'True',
          controlMode,
          param1: parseInt(param1),
          param2: parseInt(param2),
          param3: parseInt(param3)
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
