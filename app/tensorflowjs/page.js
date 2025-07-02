import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import styles from '@/app/tensorflowjs/tensorflow.module.scss';

export default function Tensorflowjs() {


  return (
    <main className={styles.tensorflowjs_page}>
      <h2>Tensorflow.js 測試紀錄</h2>
      <Box>
        <Button variant="contained" component={Link} href="/tensorflowjs/mobilenet">
          MobileNet 模型測試
        </Button>
      </Box>
    </main>
  );
}
