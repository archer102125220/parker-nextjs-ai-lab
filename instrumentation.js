// https://nextjs.org/docs/app/guides/instrumentation
export async function register() {
  const { Translator } = await import('@/utils/third-party/transformers');
  await Translator.loadTransformers('Xenova/nllb-200-distilled-600M');
}