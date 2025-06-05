import { NextResponse } from 'next/server';

import { Translator } from '@/utils/third-party/transformers';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const msg = searchParams.get('msg');
  const srcLang = searchParams.get('src_lang') || 'eng_Latn';
  const tgtLang = searchParams.get('tgt_lang') || 'zho_Hant';

  try {
    const translatedOutput = await Translator.handleTranslate(msg, srcLang, tgtLang);

    return NextResponse.json({
      label: (translatedOutput?.[0] || translatedOutput)?.translation_text,
      translatedOutput
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}