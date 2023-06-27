export interface ImageObject {
  id?: string;
  title?: string;
  prompt: string;
  negative_prompt?: string;
  model?: string;
  control_net?: ControlNetObject;
  seed?: string;
  width: string;
  height: string;
  cfg_scale?: string;
  steps?: string;
  generator: string;
  sampler?: string;
  creator?: string;
  creatorId?: string;
}

export interface ControlNetObject {
  version?: string
  preprocessor?: string
  model?: string
  modelId?: string
  weight?: number
  start?: number
  end?: number
  resizeMode?: string
  pixelPerfect?: boolean
  controlMode?: string
  param1?: number
  param2?: number
  param3?: number
}
