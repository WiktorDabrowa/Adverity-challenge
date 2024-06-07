import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { link } from "fs";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.card}>
              <h2>Browse</h2>
              <h2>Enrich</h2>
              <h2>Preview</h2>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Link
            key="login"
            href="/login"
            className={styles.homepageLink}
          >Login
          </Link>
          <Link
            key="register"
            href='/register'
            className={styles.homepageLink}
          >Register
          </Link>
        </div>
      </div>
    </main>
  );
}
