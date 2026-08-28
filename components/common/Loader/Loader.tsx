import styles from "./Loader.module.css";

type LoaderProps = {
  title?: string;
  description?: string;
};

export function Loader({
  title = "Loading campers...",
  description = "Please wait while we fetch the best travel trucks for you",
}: LoaderProps) {
  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        role="status"
        aria-live="polite"
        aria-label={title}
      >
        <span className={styles.spinner} aria-hidden="true" />

        <div className={styles.content}>
          <p className={styles.title}>{title}</p>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );
}
