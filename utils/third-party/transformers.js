import { pipeline } from '@huggingface/transformers';
import { InferenceClient } from '@huggingface/inference';

// https://huggingface.co/Helsinki-NLP/opus-mt-en-zh?text=My+name+is+Wolfgang+and+I+live+in+Berlin
// https://huggingface.co/Xenova/opus-mt-en-zh

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
    this.#pipeline = pipeline;
    this.#InferenceClient = InferenceClient;
  }
  #pipeline = null;
  #InferenceClient = null;
  #token = '';
  #modelName = '';
  #translator = null;
  #inferenceClient = null;

  pipeline = { get: () => this.#pipeline };
  InferenceClient = { get: () => this.#InferenceClient };
  modelName = { get: () => this.#modelName };
  translator = { get: () => this.#translator };
  inferenceClient = { get: () => this.#inferenceClient };

  /**
   * 載入翻譯模型
   * @param {string} model - 欲載入翻譯模型名稱，預設與 initInferenceClient 不同，預設為 Xenova/nllb-200-distilled-600M
   * @returns {Translator} 翻譯函式
   */
  loadTransformers = async (model = '') => {
    console.log('Loading translation model...');

    // 選擇一個英翻中的模型
    // 'Helsinki-NLP/opus-mt-en-zh' //（Helsinki-NLP 系列的一個常用模型）
    // 'Xenova/opus-mt-en-zh'
    // 'facebook/nllb-200-distilled-600M'
    // 'Xenova/nllb-200-distilled-600M'
    this.#translator = await this.#pipeline('translation', model || 'Xenova/opus-mt-en-zh', { cache_dir: '.transformers-cache' });
    // this.#translator = await this.#pipeline('translation', model || 'Helsinki-NLP/opus-mt-en-zh', {
    //   subfolder: '',
    //   model_file_name: 'tf_model.h5',
    //   cache_dir: '.transformers-cache'
    // });
    // this.#translator = await this.#pipeline('translation', model || 'Xenova/nllb-200-distilled-600M', { cache_dir: '.transformers-cache' });
    // this.#translator = await this.#pipeline('translation', model || 'facebook/nllb-200-distilled-600M', { cache_dir: '.transformers-cache' });

    console.log('Translation model loaded.');

    return this.#translator;
  };

  /**
   * 初始化 transformers 翻譯用推理模型
   * @param {string} token - 推理客戶端token
   * @param {string} model - 模型名稱，預設與 loadTransformers 不同，預設為 Helsinki-NLP/opus-mt-en-zh，在 handleTranslate 時使用
   * @returns {InferenceClient} 推理模型實例
   */
  initInferenceClient = async (token, model = 'Helsinki-NLP/opus-mt-en-zh') => {
    console.log('init inferenceClient...');

    this.#modelName = model;
    this.#token = token || process.env.HUGGINGFACE_TOKEN;
    this.#inferenceClient = new this.#InferenceClient(this.#token);

    console.log('InferenceClient inited.');

    return this.#inferenceClient;
  };

  handleTranslate = async (msg, options = { src_lang: 'eng_Latn', tgt_lang: 'zho_Hant' }) => {
    if (this.#inferenceClient !== null) {
      return await this.#inferenceClient.translation(
        {
          provider: 'hf-inference',
          ...options,
          inputs: msg,
          model: this.#modelName || 'Helsinki-NLP/opus-mt-en-zh'
        }
      );
    }


    let translator = this.#translator;

    if (translator === null) {
      translator = await this.loadTransformers();
      this.#translator = translator;
    }
    return translator(msg, options);
  };
}

let _Translator = global.Translator || null;
if (!_Translator) {
  _Translator = new TranslatorConstructor(pipeline, InferenceClient);
  global.Translator = _Translator;
}

export const Translator = _Translator;

export default Translator;