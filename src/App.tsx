import React, { useState } from 'react';
import nsLogo from './assets/images/NSLOGO1.jpeg';
import { DeviceSimulator } from './components/DeviceSimulator';
import { CodeViewer } from './components/CodeViewer';
import { CustomizationPanel } from './components/CustomizationPanel';
import { QuickStartGuide } from './components/QuickStartGuide';
import { InstallModal } from './components/InstallModal';
import { ScreenState, SplashConfig } from './types';
import { Sparkles, Smartphone, Code2, Sliders, CheckCircle2, Copy, Download, Zap, Layers } from 'lucide-react';
import { kotlinFiles } from './data/kotlinCode';
import { downloadAndroidProjectZip } from './utils/downloadProject';

export default function App() {
  const [screenState, setScreenState] = useState<ScreenState>('splash');
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'guide'>('simulator');
  const [splashKey, setSplashKey] = useState<number>(0);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [androidAppOnly, setAndroidAppOnly] = useState<boolean>(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);

  const [config, setConfig] = useState<SplashConfig>({
    appName: 'NS',
    appTitle: 'ns creaction',
    logoUrl: nsLogo,
    splashDuration: 3,
    autoNavigate: true,
    isConnected: true,
    isLoggedIn: false,
    fontStyle: 'syne',
    themeGradient: {
      start: '#0A192F',
      middle: '#0B2D52',
      end: '#044343',
    },
    animationSpeed: 1,
    showNoInternetDialog: false,
  });

  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [downloadNotice, setDownloadNotice] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  const handleResetSplash = () => {
    setSplashKey((prev) => prev + 1);
    setScreenState('splash');
  };

  const handleCopyKotlinCode = () => {
    const mainFile = kotlinFiles.find((f) => f.id === 'main_activity') || kotlinFiles[0];
    if (mainFile) {
      navigator.clipboard.writeText(mainFile.code);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleDirectDownloadZip = async () => {
    setIsDownloadingZip(true);
    setDownloadNotice({
      msg: 'Packaging full Native Android Studio Kotlin project into ZIP...',
      type: 'info',
    });
    try {
      await downloadAndroidProjectZip();
      setDownloadNotice({
        msg: 'Project ZIP downloaded! Check your browser Downloads. If your browser blocks popups/downloads inside the preview iframe, open in a New Tab or use AI Studio Settings > Export to ZIP.',
        type: 'success',
      });
      setTimeout(() => setDownloadNotice(null), 8000);
    } catch (e) {
      console.error(e);
      setDownloadNotice({
        msg: 'Browser iframe blocked download. Please open the app in a New Tab ↗ or export via the AI Studio Settings menu (Export to ZIP / GitHub).',
        type: 'error',
      });
      setTimeout(() => setDownloadNotice(null), 9000);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-white/20 shadow-md flex items-center justify-center overflow-hidden">
              <img
                src={config.logoUrl || nsLogo}
                alt="NS Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                  NS Electrical <span className="text-emerald-400 font-medium">Android App</span>
                </h1>
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Android App
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                NS Smart Electrical &amp; Power Solutions • Field Survey Android Application
              </p>
            </div>
          </div>

          {/* Center Tabs (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-300" />
              Android App &amp; Device
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Native Kotlin Source ({kotlinFiles.length} Files)
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Android Studio Guide
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAndroidAppOnly(!androidAppOnly)}
              title="Toggle Fullscreen Android App View"
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                androidAppOnly
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{androidAppOnly ? 'Standard View' : 'Full Android View'}</span>
            </button>
            <button
              onClick={() => setShowInstallModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-450 hover:to-emerald-550 text-white text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95 border border-teal-400/30"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <button
              onClick={handleDirectDownloadZip}
              disabled={isDownloadingZip}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95 border border-blue-400/30"
              title="Download Android Project ZIP with 1 click"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloadingZip ? 'animate-bounce' : ''}`} />
              <span>{isDownloadingZip ? 'Downloading...' : 'Direct Download'}</span>
            </button>
            <button
              onClick={handleCopyKotlinCode}
              className={`hidden sm:flex px-3 py-1.5 rounded-xl border text-xs font-semibold items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                copiedToast
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              {copiedToast ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Kotlin</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden border-t border-slate-800 bg-slate-900/60 px-2 py-1.5 justify-around text-xs">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-1 px-3 rounded-lg font-semibold flex items-center gap-1 ${
              activeTab === 'simulator' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            App
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-1 px-3 rounded-lg font-semibold flex items-center gap-1 ${
              activeTab === 'code' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Kotlin
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-1 px-3 rounded-lg font-semibold flex items-center gap-1 ${
              activeTab === 'guide' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Guide
          </button>
          <button
            onClick={handleDirectDownloadZip}
            disabled={isDownloadingZip}
            className="py-1 px-3 rounded-lg font-bold flex items-center gap-1 bg-blue-600 text-white shadow-sm"
          >
            <Download className={`w-3.5 h-3.5 ${isDownloadingZip ? 'animate-bounce' : ''}`} />
            {isDownloadingZip ? '...' : 'Download'}
          </button>
        </div>
      </header>

      {/* Global Download / Status Notification Bar */}
      {downloadNotice && (
        <div
          className={`border-b px-4 py-3 text-xs flex items-center justify-between gap-3 ${
            downloadNotice.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-800/80 text-emerald-200'
              : downloadNotice.type === 'error'
              ? 'bg-rose-950/90 border-rose-800/80 text-rose-200'
              : 'bg-blue-950/90 border-blue-800/80 text-blue-200'
          }`}
        >
          <div className="flex items-center gap-2 max-w-4xl">
            <Download className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{downloadNotice.msg}</span>
          </div>
          <button
            onClick={() => setDownloadNotice(null)}
            className="text-slate-400 hover:text-white px-2 py-1 font-bold text-xs rounded transition cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'simulator' && (
          androidAppOnly ? (
            <div className="flex flex-col items-center justify-center min-h-[82vh] py-2">
              <div className="w-full flex justify-between items-center max-w-[380px] mb-2 px-1 text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  Android Native App Experience
                </span>
                <button
                  onClick={() => setAndroidAppOnly(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 font-medium cursor-pointer"
                >
                  Exit App View
                </button>
              </div>
              <DeviceSimulator
                key={splashKey}
                config={config}
                screenState={screenState}
                onScreenChange={setScreenState}
                onConfigChange={setConfig}
                onResetSplash={handleResetSplash}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Device Simulator */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <DeviceSimulator
                  key={splashKey}
                  config={config}
                  screenState={screenState}
                  onScreenChange={setScreenState}
                  onConfigChange={setConfig}
                  onResetSplash={handleResetSplash}
                />
              </div>

              {/* Right Column: Customization Controls & Quick Specs */}
              <div className="lg:col-span-6 space-y-6">
                <CustomizationPanel
                  config={config}
                  onChange={setConfig}
                  onResetSplash={handleResetSplash}
                />

                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Native Android Kotlin Architecture
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Target Language</span>
                      <span className="font-mono text-purple-300 font-semibold">100% Pure Kotlin</span>
                    </div>
                    <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">UI Framework</span>
                      <span className="font-mono text-purple-300 font-semibold">Jetpack Compose &amp; M3</span>
                    </div>
                    <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Target Platform</span>
                      <span className="font-mono text-emerald-300 font-semibold">Android 14+ (API 34)</span>
                    </div>
                    <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Build System</span>
                      <span className="font-mono text-cyan-300 font-semibold">Gradle Kotlin DSL (.kts)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {activeTab === 'code' && (
          <div className="h-[760px]">
            <CodeViewer />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <QuickStartGuide />

            {/* Folder Structure Overview */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 text-slate-200">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Native Android Project Structure (Kotlin DSL)
              </h4>
              <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto border border-slate-800">
                <pre>{`NSElectrical/
├── app/
│   ├── build.gradle.kts                 <-- Jetpack Compose & Kotlin config
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml      <-- Permissions (Camera, GPS, Internet)
│           ├── java/com/nselectrical/app/
│           │   ├── MainActivity.kt      <-- NavHost & Activity entry
│           │   ├── data/
│           │   │   ├── model/Models.kt  <-- DTRRecord, PoleSurvey, UserProfile
│           │   │   └── repository/      <-- Firebase & Offline Repository
│           │   ├── ui/
│           │   │   ├── screens/
│           │   │   │   ├── SplashScreen.kt
│           │   │   │   ├── LoginScreen.kt
│           │   │   │   ├── HomeScreen.kt
│           │   │   │   ├── DTRScreen.kt
│           │   │   │   ├── DTRListScreen.kt
│           │   │   │   ├── AddPoleScreen.kt
│           │   │   │   └── SettingsScreen.kt
│           │   │   └── theme/
│           │   │       └── Theme.kt     <-- Material 3 color & typography
│           └── res/values/
│               ├── strings.xml
│               └── colors.xml
├── build.gradle.kts                     <-- Root Gradle config
├── settings.gradle.kts                  <-- Project & repository dependencies
└── gradle/wrapper/gradle-wrapper.properties`}</pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>NS Smart Electrical &amp; Power Solutions • 100% Pure Native Kotlin Android</span>
          <span className="text-[11px] text-slate-600">Built with Kotlin, Jetpack Compose, Material 3 &amp; Coroutines</span>
        </div>
      </footer>

      {/* Mobile Download & Installation Modal */}
      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}
