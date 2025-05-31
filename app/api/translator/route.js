import { NextResponse } from 'next/server';

import { Translator } from '@/utils/third-party/transformers';

// 定義 API 路由的處理函數
export async function GET(request) {
  // 從 URL 獲取查詢參數
  const searchParams = request.nextUrl.searchParams;
  const msg = searchParams.get('msg');
  const srcLang = searchParams.get('src_lang') || 'eng_Latn';
  const tgtLang = searchParams.get('tgt_lang') || 'zho_Hant';

  try {
    const translatedOutput = await Translator.handleTranslate(msg, srcLang, tgtLang);

    // // 返回 JSON 響應
    return NextResponse.json({
      label: translatedOutput?.[0].translation_text,
      translatedOutput
    });
    // return NextResponse.json({
    //   label: '????'
    // });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}