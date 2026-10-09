import styles from './Feedback.module.css'

interface FeedbackProps {
  tone: 'loading' | 'error' | 'empty'
  message: string
  onRetry?: () => void
}

export default function Feedback({ tone, message, onRetry }: FeedbackProps) {
  return (
    <div className={`${styles.box} ${tone === 'error' ? styles.error : ''}`} role={tone === 'error' ? 'alert' : 'status'}>
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={styles.retry}>
          Tentar de novo
        </button>
      )}
    </div>
  )
}
