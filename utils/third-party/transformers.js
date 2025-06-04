import { pipeline, InferenceClient } from '@huggingface/transformers';

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
  constructor(pipeline, InferenceClient) {
    this.pipeline = pipeline;
    this.InferenceClient = InferenceClient;
  }
  translator = null;
  inferenceClient = null;

  loadTransformers = async (model) => {
    console.log('Loading translation model...');


    // 選擇一個英翻中的模型
    // 例如：'Helsinki-NLP/opus-mt-en-zh' 是 Helsinki-NLP 系列的一個常用模型
    // 'facebook/nllb-200-distilled-600M'
    // 'Xenova/nllb-200-distilled-600M'
    this.translator = await this.pipeline('translation', model || 'Helsinki-NLP/opus-mt-en-zh', { cache_dir: '.transformers-cache' });
    // this.translator = await this.pipeline('translation', model || 'Xenova/nllb-200-distilled-600M', { cache_dir: '.transformers-cache' });
    // this.translator = await this.pipeline('translation', model || 'facebook/nllb-200-distilled-600M', { cache_dir: '.transformers-cache' });


    console.log('Translation model loaded.');

    return this.translator;
  };

  initInferenceClient = async (token) => {
    this.inferenceClient = new this.InferenceClient(token || process.env.HUGGINGFACE_TOKEN);
    return this.inferenceClient;
  };

  handleTranslate = async (msg, srcLang, tgtLang) => {

    // if (this.translator !== null) {
    //   return await this.translator(msg, { src_lang: srcLang, tgt_lang: tgtLang });
    // } else if (this.inferenceClient !== null) {
    //   return await this.inferenceClient.translate(msg, { src_lang: srcLang, tgt_lang: tgtLang });
    // }


    let translator = this.translator;

    if (translator === null) {
      translator = await this.loadTransformers();
      this.translator = translator;
    }
    return translator(msg, { src_lang: srcLang, tgt_lang: tgtLang });
  };
}


export const Translator = new TranslatorConstructor(pipeline, InferenceClient);

export default Translator;