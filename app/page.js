import Link from 'next/link';
import Button from '@mui/material/Button';
import styles from '@/app/page.module.scss';

export default function Home() {
  return (
    <main className={styles.index_page}>
      <Button variant="contained" component={Link} href="/p5ml5">
        p5 + ml5
      </Button>
      <Button variant="contained" component={Link} href="/tensorflowjs">
        TensorflowJS
      </Button>
      <Button variant="contained" component={Link} href="/huggingface_translate">
        huggingface翻譯
      </Button>
    </main>
  );
}
