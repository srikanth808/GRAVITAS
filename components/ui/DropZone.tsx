'use client';

import { useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, XCircle, FileText, Loader2 } from 'lucide-react';

type DropState = 'idle' | 'dragover' | 'uploading' | 'success' | 'error';

export default function DropZone() {
  const router = useRouter();
  const [state, setState] = useState<DropState>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgress = () => {
    setProgress(0);
    // Animate from 0 to 90% over ~3 seconds
    let p = 0;
    progressIntervalRef.current = setInterval(() => {
      p = Math.min(90, p + Math.random() * 8 + 2);
      setProgress(p);
      if (p >= 90) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      }
    }, 200);
  };

  const finishProgress = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(100);
  };

  const uploadFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setState('error');
      setErrorMsg('Only PDF files are accepted.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setState('error');
      setErrorMsg('File exceeds 10 MB limit.');
      return;
    }

    setFileName(file.name);
    setState('uploading');
    startProgress();

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      finishProgress();

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setState('error');
        setErrorMsg(data.error ?? 'Upload failed. Please try again.');
        return;
      }

      setState('success');
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch {
      finishProgress();
      setState('error');
      setErrorMsg('Network error. Please check your connection.');
    }
  }, [router]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState('idle');
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const getBorderColor = () => {
    if (state === 'dragover') return '#00d4ff';
    if (state === 'success') return '#00e676';
    if (state === 'error') return '#ff4444';
    return '#6c63ff';
  };

  const getBg = () => {
    if (state === 'dragover') return 'rgba(0,212,255,0.04)';
    if (state === 'success') return 'rgba(0,230,118,0.04)';
    if (state === 'error') return 'rgba(255,68,68,0.04)';
    return 'transparent';
  };

  const reset = () => {
    setState('idle');
    setProgress(0);
    setErrorMsg('');
    setFileName('');
  };

  return (
    <motion.div
      onDragOver={(e) => { e.preventDefault(); setState((s) => s === 'idle' ? 'dragover' : s); }}
      onDragLeave={() => setState((s) => s === 'dragover' ? 'idle' : s)}
      onDrop={onDrop}
      animate={{ scale: state === 'dragover' ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        border: `2px dashed ${getBorderColor()}`,
        borderRadius: '16px',
        background: getBg(),
        padding: '48px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        cursor: state === 'uploading' || state === 'success' ? 'default' : 'pointer',
        transition: 'background 0.3s, border-color 0.3s',
        minHeight: '260px',
        boxShadow: state === 'dragover' ? '0 0 40px rgba(0,212,255,0.1)' : 'none',
      }}
      onClick={() => state === 'idle' && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={onFileChange}
        style={{ display: 'none' }}
      />

      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={28} color="#6c63ff" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#e2e8f0', fontSize: '16px' }}>
                Drop FIR Report here
              </p>
              <p style={{ margin: '6px 0 0', color: '#4a5568', fontSize: '13px' }}>
                or click to browse · PDF only · max 10 MB
              </p>
            </div>
          </motion.div>
        )}

        {state === 'dragover' && (
          <motion.div
            key="dragover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,212,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={28} color="#00d4ff" />
            </div>
            <p style={{ margin: 0, fontWeight: 600, color: '#00d4ff', fontSize: '16px' }}>
              Release to upload
            </p>
          </motion.div>
        )}

        {state === 'uploading' && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Loader2 size={40} color="#6c63ff" />
            </motion.div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#e2e8f0' }}>
                Analysing document...
              </p>
              <p style={{ margin: '4px 0 0', color: '#4a5568', fontSize: '12px' }}>
                {fileName}
              </p>
            </div>
            {/* Progress bar */}
            <div style={{ width: '100%', background: '#1e2330', borderRadius: '4px', height: '6px', overflow: 'hidden', maxWidth: '320px' }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #6c63ff, #00d4ff)',
                  borderRadius: '4px',
                }}
              />
            </div>
            <span style={{ color: '#4a5568', fontSize: '12px' }}>{Math.round(progress)}%</span>
          </motion.div>
        )}

        {state === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <CheckCircle size={56} color="#00e676" />
            </motion.div>
            <p style={{ margin: 0, fontWeight: 700, color: '#00e676', fontSize: '18px' }}>
              Report classified!
            </p>
            <p style={{ margin: 0, color: '#4a5568', fontSize: '13px' }}>
              Redirecting to dashboard...
            </p>
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
          >
            <XCircle size={48} color="#ff4444" />
            <p style={{ margin: 0, fontWeight: 600, color: '#ff4444', fontSize: '16px', textAlign: 'center' }}>
              {errorMsg}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              style={{
                padding: '8px 20px',
                background: 'rgba(255,68,68,0.1)',
                border: '1px solid #ff4444',
                borderRadius: '6px',
                color: '#ff4444',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
