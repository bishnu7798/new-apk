import React, { useState } from 'react';
import { Copy, Check, FileCode, Download, Sparkles, Terminal, ExternalLink } from 'lucide-react';
import { kotlinFiles } from '../data/kotlinCode';
import { KotlinFile } from '../types';
import { downloadAndroidProjectZip } from '../utils/downloadProject';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<KotlinFile>(kotlinFiles[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const fullText = kotlinFiles
      .map(
        (f) => `// ==========================================\n// FILE: ${f.path}\n// ==========================================\n\n${f.code}\n`
      )
      .join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      await downloadAndroidProjectZip();
      setDownloadSuccessToast('Project ZIP downloaded! Check your browser Downloads folder.');
      setTimeout(() => setDownloadSuccessToast(null), 5000);
    } catch (err) {
      console.error('Download error:', err);
      setDownloadSuccessToast('Tip: If your browser blocked the download inside the preview iframe, open the app in a New Tab or use AI Studio Settings > Export to ZIP.');
      setTimeout(() => setDownloadSuccessToast(null), 8000);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleDownload = (file: KotlinFile) => {
    const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    }, 60000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="bg-slate-950/80 border-b border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Native Android Kotlin Source Code
              <span className="text-[10px] uppercase tracking-wider bg-purple-500/20 text-purple-300 font-semibold px-2 py-0.5 rounded-full border border-purple-500/30">
                Kotlin &amp; Jetpack Compose
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              100% Native Android Studio project — no Flutter SDK required!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadZip}
            disabled={isDownloadingZip}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md border border-purple-400/30 active:scale-95"
            title="Download full Android Studio project ZIP"
          >
            <Download className={`w-3.5 h-3.5 ${isDownloadingZip ? 'animate-bounce' : ''}`} />
            <span>{isDownloadingZip ? 'Generating ZIP...' : 'Download Project (ZIP)'}</span>
          </button>
          <button
            onClick={handleCopyAll}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700 shadow-sm"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied All Files!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Entire Project</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Download Alert / Notification Banner */}
      {downloadSuccessToast && (
        <div className="bg-purple-950/80 border-b border-purple-800/80 px-4 py-2.5 text-xs text-purple-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-300 flex-shrink-0" />
            <span>{downloadSuccessToast}</span>
          </div>
          <button
            onClick={() => setDownloadSuccessToast(null)}
            className="text-purple-400 hover:text-white text-xs font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* File Tabs Bar */}
      <div className="bg-slate-950/40 border-b border-slate-800/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {kotlinFiles.map((file) => {
          const isActive = selectedFile.id === file.id;
          return (
            <button
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  file.category === 'screen'
                    ? 'bg-purple-400'
                    : file.category === 'service'
                    ? 'bg-emerald-400'
                    : file.category === 'constant'
                    ? 'bg-amber-400'
                    : file.category === 'model'
                    ? 'bg-cyan-400'
                    : 'bg-blue-400'
                }`}
              />
              <span className="font-mono">{file.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active File Metadata & Action Bar */}
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-purple-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            {selectedFile.path}
          </span>
          <span className="text-slate-400 hidden sm:inline-block">
            {selectedFile.description}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload(selectedFile)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleCopy(selectedFile.code, selectedFile.id)}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer active:scale-95"
          >
            {copiedId === selectedFile.id ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy File</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed select-text">
        <pre className="overflow-x-auto">
          <code>{selectedFile.code}</code>
        </pre>
      </div>

      {/* Footer / Quick Guide */}
      <div className="bg-slate-950/90 border-t border-slate-800 p-3.5 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>
            Open directly in Android Studio &bull; Click <strong className="text-emerald-400">Run ▶</strong> or run <code className="text-purple-300 bg-slate-900 px-1.5 py-0.5 rounded">.\gradlew.bat installDebug</code>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500">
            Official Developer: <code className="text-purple-300">Nirmalya Sarkar</code>
          </span>
        </div>
      </div>
    </div>
  );
};
