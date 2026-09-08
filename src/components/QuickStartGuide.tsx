import React from 'react';
import { Terminal, Sparkles, CheckCircle2, Smartphone } from 'lucide-react';

export const QuickStartGuide: React.FC = () => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-2xl space-y-4 text-slate-200">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="font-bold text-sm text-white">Native Android Studio &amp; Kotlin Guide</h3>
      </div>

      <div className="space-y-3.5 text-xs">
        {/* Step 1 */}
        <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
            1
          </span>
          <div className="space-y-1">
            <p className="font-semibold text-white">Open in Android Studio</p>
            <p className="text-slate-400 leading-relaxed">
              Click <strong className="text-white">Direct Download</strong> to get the ZIP. Extract it, launch <strong className="text-white">Android Studio</strong>, and click <code className="text-purple-300">File &gt; Open</code> to select the extracted folder.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
            2
          </span>
          <div className="space-y-1">
            <p className="font-semibold text-white">Native Gradle Sync</p>
            <p className="text-slate-400 leading-relaxed">
              Android Studio will automatically detect the Gradle Kotlin DSL scripts (<code className="text-purple-300">build.gradle.kts</code>) and sync all Jetpack Compose dependencies.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
            3
          </span>
          <div className="space-y-1">
            <p className="font-semibold text-white">Connect Phone via USB</p>
            <p className="text-slate-400 leading-relaxed">
              Plug your phone in with a USB cable, enable <strong className="text-purple-300">USB Debugging</strong> in Developer Options, and tap <strong className="text-emerald-400">&quot;Allow&quot;</strong> on your phone.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
            4
          </span>
          <div className="space-y-1">
            <p className="font-semibold text-white">Run &amp; Install on Phone</p>
            <p className="text-slate-400 leading-relaxed">
              Select your phone from the device dropdown at the top of Android Studio and click the green <strong className="text-emerald-400">Play (▶)</strong> button!
            </p>
            <div className="bg-slate-900 px-2.5 py-1.5 rounded-lg font-mono text-purple-300 text-[11px] flex items-center justify-between mt-1">
              <span>.\gradlew.bat installDebug</span>
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
