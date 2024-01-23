import Link from 'next/link';
import Button from '@mui/material/Button';
import styles from '@/app/page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Button variant="contained">
        <Link href="/ml5">ml5</Link>
      </Button>
      <Button variant="contained">
        <Link href="/tensorflowjs">TensorflowJS</Link>
      </Button>
    </main>
  );
}
