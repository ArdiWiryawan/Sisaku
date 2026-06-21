type EmptyStateProps = {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, body, actionLabel, onAction }: EmptyStateProps) {
  return (
    <section className="empty-state">
      <h2>{title}</h2>
      <p>{body}</p>
      {actionLabel && onAction ? (
        <button className="btn btn-primary" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
