import { pipeline } from '@huggingface/transformers';


/*
const DEVICE_TYPES = Object.freeze({
    auto: 'auto', // Auto-detect based on device and environment
    gpu: 'gpu', // Auto-detect GPU
    cpu: 'cpu', // CPU
    wasm: 'wasm', // WebAssembly
    webgpu: 'webgpu', // WebGPU
    cuda: 'cuda', // CUDA
    dml: 'dml', // DirectML

    webnn: 'webnn', // WebNN (default)
    'webnn-npu': 'webnn-npu', // WebNN NPU
    'webnn-gpu': 'webnn-gpu', // WebNN GPU
    'webnn-cpu': 'webnn-cpu', // WebNN CPU
});
*/

export class TranslatorConstructor {
  constructor(pipeline) {
    this.pipeline = pipeline;
  }
  translator = null
  loadTransformers = async (model) => {
    console.log('Loading translation model...');


    this.translator = await this.pipeline('translation', model || 'Xenova/nllb-200-distilled-600M', { cache_dir: '.transformers-cache' });

    console.log('Translation model loaded.');

    return this.translator;
  }
  handleTranslate = async (msg, srcLang, tgtLang) => {
    let translator = this.translator;

    if (translator === null) {
      translator = await this.loadTransformers();
      this.translator = translator;
    }
    return translator(msg, { src_lang: srcLang, tgt_lang: tgtLang });
  }
}


export const Translator = new TranslatorConstructor(pipeline);

export default Translator;