'use client';

import { useState, useCallback } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useTranslatorHf } from '@/hooks/useTranslatorHf';
import { useTranslatorApi } from '@/hooks/useTranslatorApi';

import styles from '@/app/huggingface_translate/huggingface_translate.module.scss';

export default function Tensorflow() {
  const [xenovaTranslating, setXenovaTranslating] = useState(false);
  const [xenovaInput, setXenovaInput] = useState('');
  const [xenovaTranslatedLabel, setXenovaTranslatedLabel] = useState('');
  const [helsinkiNLPTranslating, setHelsinkiNLPTranslating] = useState(false);
  const [helsinkiNLPInput, setHelsinkiNLPInput] = useState('');
  const [helsinkiNLPTranslatedLabel, setHelsinkiNLPTranslatedLabel] = useState('');
  const [apiInput, setApiInput] = useState('');
  const [translatePayload, setTranslatePayload] = useState('');
  const {
    translatedLabel: apiTranslatedLabel,
    isLoading: apiTranslating
  } = useTranslatorApi(translatePayload);
  // For some reason a component ref is being added into the payload?

  const translateXenova = useTranslatorHf('Xenova/opus-mt-en-zh');
  const translateHelsinkiNLP = useTranslatorHf('Helsinki-NLP/opus-mt-en-zh', process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN);

  const handleTranslateXenova = useCallback(async () => {
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

  const handleTranslateApi = useCallback(async () => {
    setTranslatePayload({ msg: apiInput });
  }, [apiInput]);

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

      <Box component="form"
        sx={{ marginBottom: 4 }}
        onSubmit={(e) => { e.preventDefault(); handleTranslateApi(); }}
      >
        <h2>透過呼叫伺服器上的 api 使用 Xenova/opus-mt-en-zh 翻譯模型</h2>

        <TextField
          label="翻譯文字"
          variant="filled"
          multiline={true}
          fullWidth={true}
          sx={{ marginBottom: 4 }}
          onChange={(event) => setApiInput(event.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ marginBottom: 4 }}
        >
          翻譯
        </Button>

        {apiTranslating === true ? (
          <Skeleton variant="rounded" width="100%" height={106} />
        ) : ''}
        {
          typeof apiTranslatedLabel === 'string' && apiTranslatedLabel !== '' ?
            (<div>
              <p>翻譯為: </p>
              <p>{apiTranslatedLabel}</p>
            </div>)
            : ''
        }
      </Box>
    </main>
  );
}
