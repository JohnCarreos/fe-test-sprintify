import styles from './StatusAnnouncer.module.scss'

interface StatusAnnouncerProps {
  message: string
}

/** Visually hidden live region; screen readers announce changes to `message`. */
export function StatusAnnouncer({ message }: StatusAnnouncerProps) {
  return (
    <p role="status" aria-live="polite" aria-atomic="true" className={styles.announcer}>
      {message}
    </p>
  )
}
