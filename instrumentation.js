// https://nextjs.org/docs/app/guides/instrumentation
export async function register() {
  const { Translator } = await import('@/utils/third-party/transformers');
  // await Translator.loadTransformers('Helsinki-NLP/opus-mt-en-zh');
  // await Translator.loadTransformers('Xenova/nllb-200-distilled-600M');
  // await Translator.loadTransformers('facebook/nllb-200-distilled-600M');
  await Translator.initInferenceClient(process.env.HUGGINGFACE_TOKEN, 'Helsinki-NLP/opus-mt-en-zh');
}