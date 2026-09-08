import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share2, Check, X, Globe, FileCode, Terminal, CheckCircle2, ShieldCheck, Zap, Usb } from 'lucide-react';
import nsLogo from '../assets/images/NSLOGO1.jpeg';
import { kotlinFiles } from '../data/kotlinCode';
import { downloadAndroidProjectZip } from '../utils/downloadProject';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'usb' | 'zip' | 'source'>('usb');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingSource, setDownloadingSource] = useState(false);
  const [modalBanner, setModalBanner] = useState<string | null>(null);

  const showBanner = (msg: string) => {
    setModalBanner(msg);
    setTimeout(() => setModalBanner(null), 6000);
  };

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-xsxzavs2v7wmz44zk3jozk-368700276170.asia-east1.run.app';

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      showBanner('To install on Android: Open in Google Chrome on your phone, tap ⋮ (top-right menu), and tap "Add to Home screen" or "Install app"!');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCodeSnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(id);
    setTimeout(() => setCopiedCommand(null), 2500);
  };

  // Generate and download full native Android Kotlin project ZIP
  const handleDownloadAndroidZip = async () => {
    setDownloadingZip(true);
    try {
      await downloadAndroidProjectZip();
      showBanner('Native Android Studio Kotlin project downloaded successfully!');
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
      showBanner('Note: Generating Android project ZIP encountered an issue. Please try again.');
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleDownloadAllSourceCode = () => {
    setDownloadingSource(true);
    try {
      let combined = `// ==========================================\n// NS ELECTRICAL - COMPLETE NATIVE ANDROID KOTLIN SOURCE SUITE\n// Technology: Pure Kotlin & Jetpack Compose (Material 3)\n// Surveyor & Lead Engineer: Nirmalya Sarkar\n// Official Contact: bishnusarkar4321@gmail.com\n// ==========================================\n\n`;
      
      kotlinFiles.forEach((file) => {
        combined += `// ==========================================\n// FILE: ${file.path} (${file.name})\n// ==========================================\n\n`;
        combined += file.code;
        combined += `\n\n`;
      });

      const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ns_electrical_native_kotlin_source_suite.kt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setDownloadingSource(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white p-1 border border-white/20 shadow-md flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={nsLogo}
                alt="NS Electrical Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Install NS Electrical App
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Native Kotlin
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Install via USB Debugging, Android Studio, or direct ZIP download
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Banner / Notification */}
        {modalBanner && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-200 px-4 py-2.5 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{modalBanner}</span>
            </div>
            <button
              onClick={() => setModalBanner(null)}
              className="text-emerald-400 hover:text-white text-xs px-1.5 py-0.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-800 bg-slate-950/60 p-2 gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('usb')}
            className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'usb'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Usb className="w-3.5 h-3.5" />
            <span>USB Install</span>
          </button>
          <button
            onClick={() => setActiveTab('zip')}
            className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'zip'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'pwa'
                ? 'bg-[#00A896] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone Web App</span>
          </button>
          <button
            onClick={() => setActiveTab('source')}
            className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'source'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Single Kotlin File</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-200 text-sm">
          {/* TAB 1: USB INSTALL GUIDE */}
          {activeTab === 'usb' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/60 space-y-2">
                <span className="font-bold text-purple-200 block text-sm flex items-center gap-2">
                  <Usb className="w-4 h-4 text-purple-400" />
                  Install directly on your Phone via USB (No Flutter Required!)
                </span>
                <p className="text-purple-300 leading-relaxed">
                  Follow these 3 simple steps to install the native Kotlin app onto your phone using Android Studio:
                </p>
              </div>

              {/* Step 1 */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-300">1. Download and Open Project:</span>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white">Download Native Android Studio ZIP</p>
                    <p className="text-slate-400 text-[11px]">Unzip and open folder in Android Studio (<code className="text-purple-300">File &gt; Open</code>)</p>
                  </div>
                  <button
                    onClick={handleDownloadAndroidZip}
                    disabled={downloadingZip}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-md"
                  >
                    {downloadingZip ? 'Downloading...' : 'Get ZIP'}
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-300">2. Enable USB Debugging on your Phone:</span>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-slate-300 text-[11px] leading-relaxed">
                  <p>• Go to phone <strong>Settings &gt; About Phone &gt; tap "Build Number" 7 times</strong>.</p>
                  <p>• Go to <strong>Developer Options &gt; turn ON "USB Debugging"</strong>.</p>
                  <p>• Connect phone to PC with USB cable and tap <strong className="text-emerald-400">"Allow USB Debugging"</strong> on your phone screen.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-300">3. Click Run in Android Studio or Run via Terminal:</span>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-purple-300 flex items-center justify-between">
                  <span>.\gradlew.bat installDebug</span>
                  <button
                    onClick={() => handleCopyCodeSnippet('.\\gradlew.bat installDebug', 'cmd_gradle')}
                    className="p-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer font-sans text-[11px]"
                  >
                    {copiedCommand === 'cmd_gradle' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 pl-1">
                  Or just click the green <strong>Play (▶)</strong> button at the top toolbar in Android Studio!
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DOWNLOAD ZIP */}
          {activeTab === 'zip' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/60 space-y-2">
                <span className="font-bold text-blue-200 block text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-400" />
                  Complete Native Android Kotlin Project (.ZIP)
                </span>
                <p className="text-blue-300 leading-relaxed">
                  Download the complete standalone project with Gradle Kotlin DSL (<code className="text-blue-200">build.gradle.kts</code>), AndroidManifest.xml, permissions, and all Jetpack Compose screens, models, and themes ready to open in Android Studio.
                </p>
              </div>

              <button
                onClick={handleDownloadAndroidZip}
                disabled={downloadingZip}
                className="w-full py-4 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950 active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloadingZip ? 'Packaging Android Project (.zip)...' : 'Download Complete Android Project (ZIP)'}</span>
              </button>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">What's included in this ZIP archive:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px] text-slate-300">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> build.gradle.kts (Kotlin DSL)</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> AndroidManifest.xml (GPS, Camera, Storage)</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> MainActivity.kt &amp; NavHost</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> SplashScreen.kt (Animations)</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> HomeScreen.kt (Dashboard)</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> DTRScreen.kt (Diagnostics)</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> AddPoleScreen.kt (GPS Survey)</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Models.kt &amp; Theme.kt</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: PHONE WEB APP (PWA) */}
          {activeTab === 'pwa' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-800/60 flex items-start gap-3">
                <Globe className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-teal-200 block">Instant Full-Screen Mobile App</span>
                  <p className="text-teal-300 leading-relaxed">
                    Install NS Electrical directly onto your Android phone's home screen. It runs full-screen, offline-capable, with camera, GPS, and local data persistence.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleInstallPWA}
                  className="py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-450 hover:to-emerald-550 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-950 active:scale-95 transition cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{deferredPrompt ? 'Tap to Install on Phone' : 'Install App on Phone'}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Mobile Link'}</span>
                </button>
              </div>

              {/* Step-by-step instructions for Android */}
              <div className="space-y-3 pt-1">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  How to install on Android phone:
                </h4>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-[11px] border border-teal-500/40">1</span>
                    <p className="text-slate-300">Open Google Chrome on your Android phone and visit this link.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-[11px] border border-teal-500/40">2</span>
                    <p className="text-slate-300">Tap the three dots <strong>⋮</strong> at the top-right corner of Chrome.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-[11px] border border-teal-500/40">3</span>
                    <p className="text-slate-300">Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SINGLE KOTLIN SOURCE BUNDLE */}
          {activeTab === 'source' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 space-y-2">
                <span className="font-bold text-amber-200 block text-sm">Download Single Combined Kotlin Source</span>
                <p className="text-amber-300 leading-relaxed">
                  Download all {kotlinFiles.length} native Kotlin &amp; Jetpack Compose source files concatenated into a single annotated <code className="text-amber-200">.kt</code> file.
                </p>
              </div>

              <button
                onClick={handleDownloadAllSourceCode}
                disabled={downloadingSource}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950 active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                <FileCode className="w-4 h-4" />
                <span>{downloadingSource ? 'Preparing Bundle...' : 'Download Single Kotlin File (.kt)'}</span>
              </button>

              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider block">Included Kotlin Files ({kotlinFiles.length} modules):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto pr-1">
                  {kotlinFiles.map((file) => (
                    <div key={file.id} className="p-2 rounded-xl bg-slate-950 border border-slate-800 truncate">
                      • {file.path}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
