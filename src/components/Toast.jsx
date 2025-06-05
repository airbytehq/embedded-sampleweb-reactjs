import { useEffect } from 'react';

export function Toast({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const handleClick = () => {
    onRemove(toast.id);
  };

  return (
    <div 
      className={`toast toast-${toast.type}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {toast.message}
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <>
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onRemove={onRemove} 
        />
      ))}
    </>
  );
}
