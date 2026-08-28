import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/common/Button/Button";
import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  onClear: () => void;
  onViewAll: () => void;
};

export function EmptyState({ onClear, onViewAll }: EmptyStateProps) {
  return (
    <section className={styles.emptyState}>
      <Image
        className={styles.illustration}
        src="/images/no-campers.png"
        alt=""
        width={488}
        height={463}
        priority
      />

      <div className={styles.content}>
        <h2>No campers found</h2>

        <p>
          We couldn&apos;t find any campers that match your filters.
          <br />
          Try adjusting your search or clearing some filters.
        </p>
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          className={styles.actionButton}
          onClick={onClear}
        >
          <X size={20} />
          Clear filters
        </Button>

        <Button className={styles.actionButton} onClick={onViewAll}>
          View all campers
        </Button>
      </div>
    </section>
  );
}
