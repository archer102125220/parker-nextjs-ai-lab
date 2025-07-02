import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import styles from '@/app/page.module.scss';

export default function Home() {
  return (
    <main className={styles.index_page}>
      <Typography variant="h2" sx={{ marginBottom: 3 }} className={styles['index_page-title']}>
        基於Next.js測試並整合人工智慧相關套件
      </Typography>

      <Box className={styles['index_page-content']}>
        <Button variant="contained" component={Link} href="/p5ml5">
          p5 + ml5
        </Button>
        <Button variant="contained" component={Link} href="/tensorflowjs">
          TensorflowJS
        </Button>
        <Button variant="contained" component={Link} href="/huggingface_translate">
          huggingface翻譯
        </Button>
      </Box>
    </main>
  );
}
