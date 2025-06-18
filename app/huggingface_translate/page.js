'use client';

import { useState, useCallback } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useTranslatorHf } from '@/hooks/useTranslatorHf';

import styles from '@/app/huggingface_translate/huggingface_translate.module.scss';

export default function Tensorflow() {
  const [xenovaTranslating, setXenovaTranslating] = useState(false);
  const [xenovaInput, setXenovaInput] = useState(false);
  const [helsinkiNLPTranslating, setHelsinkiNLPTranslating] = useState(false);
  const [helsinkiNLPInput, setHelsinkiNLPInput] = useState(false);
  const [xenovaTranslatedLabel, setXenovaTranslatedLabel] = useState('');
  const [helsinkiNLPTranslatedLabel, setHelsinkiNLPTranslatedLabel] = useState('');

  const translateXenova = useTranslatorHf('Xenova/opus-mt-en-zh');
  const translateHelsinkiNLP = useTranslatorHf('Helsinki-NLP/opus-mt-en-zh', process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN);

  const handleTranslateXenova = useCallback(async () => {
    console.log('123');
    setXenovaTranslating(true);

    try {
      if (typeof xenovaInput !== 'string' || xenovaInput === '') return;
      const newXenovaTranslatedLabel = await translateXenova(xenovaInput);

      console.log({ newXenovaTranslatedLabel });
      setXenovaTranslatedLabel(newXenovaTranslatedLabel[0]?.translation_text || '');
    } catch (error) {
      console.error(error);
    } finally {
      setXenovaTranslating(false);
    }

  }, [xenovaInput, translateXenova]);


  const handleTranslateHelsinkiNL = useCallback(async () => {
    setHelsinkiNLPTranslating(true);

    try {
      if (typeof helsinkiNLPInput !== 'string' || helsinkiNLPInput === '') return;
      const newHelsinkiNLPInput = await translateHelsinkiNLP(helsinkiNLPInput);

      console.log({ newHelsinkiNLPInput });
      setHelsinkiNLPTranslatedLabel(newHelsinkiNLPInput?.translation_text || '');
    } catch (error) {
      console.error(error);
    } finally {
      setHelsinkiNLPTranslating(false);
    }

  }, [helsinkiNLPInput, translateHelsinkiNLP]);

  return (
    <main className={styles.huggingface_translate_page}>
      <Box
        component="form"
        sx={{ marginBottom: 4 }}
        onSubmit={(e) => { e.preventDefault(); handleTranslateXenova(); }}
      >
        <h2>Xenova/opus-mt-en-zh 翻譯模型</h2>

        <TextField
          label="翻譯文字"
          variant="filled"
          multiline={true}
          fullWidth={true}
          sx={{ marginBottom: 4 }}
          onChange={(event) => setXenovaInput(event.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ marginBottom: 4 }}
        >
          翻譯
        </Button>

        {xenovaTranslating === true ? (
          <Skeleton variant="rounded" width="100%" height={106} />
        ) : ''}
        {
          typeof xenovaTranslatedLabel === 'string' && xenovaTranslatedLabel !== '' ?
            (<div>
              <p>翻譯為: </p>
              <p>{xenovaTranslatedLabel}</p>
            </div>)
            : ''
        }
      </Box>

      <Box component="form"
        sx={{ marginBottom: 4 }}
        onSubmit={(e) => { e.preventDefault(); handleTranslateHelsinkiNL(); }}
      >
        <h2>Helsinki-NLP/opus-mt-en-zh 翻譯模型</h2>

        <TextField
          label="翻譯文字"
          variant="filled"
          multiline={true}
          fullWidth={true}
          sx={{ marginBottom: 4 }}
          onChange={(event) => setHelsinkiNLPInput(event.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ marginBottom: 4 }}
        >
          翻譯
        </Button>

        {helsinkiNLPTranslating === true ? (
          <Skeleton variant="rounded" width="100%" height={106} />
        ) : ''}
        {
          typeof helsinkiNLPTranslatedLabel === 'string' && helsinkiNLPTranslatedLabel !== '' ?
            (<div>
              <p>翻譯為: </p>
              <p>{helsinkiNLPTranslatedLabel}</p>
            </div>)
            : ''
        }
      </Box>
    </main>
  );
}
