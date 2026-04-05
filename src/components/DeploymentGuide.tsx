import { motion } from 'motion/react';
import { Download, Smartphone, Globe, Code, Rocket, CheckCircle2, Terminal, ExternalLink } from 'lucide-react';

export function DeploymentGuide() {
  const steps = [
    {
      title: "Step 1: Export from AI Studio",
      icon: Download,
      color: "bg-blue-500",
      content: "Click the 'Settings' (gear icon) in the top-right corner of the AI Studio interface. Select 'Download ZIP' to get the full source code on your computer, or 'Export to GitHub' to push it to a repository."
    },
    {
      title: "Step 2: Environment Setup",
      icon: Code,
      color: "bg-purple-500",
      content: "Unzip the files and open the folder in VS Code. Run 'npm install' in your terminal to install all dependencies. Ensure you have Node.js and Android Studio installed on your machine."
    },
    {
      title: "Step 3: Add Capacitor Mobile Support",
      icon: Smartphone,
      color: "bg-green-500",
      content: "Capacitor is the bridge that turns this web app into a native mobile app. Run these commands in your terminal:\n\n1. npm install @capacitor/core @capacitor/cli\n2. npx cap init\n3. npm run build\n4. npx cap add android"
    },
    {
      title: "Step 4: Build for Android",
      icon: Terminal,
      color: "bg-slate-700",
      content: "Sync your web code with the Android project by running 'npx cap sync'. Then, run 'npx cap open android' to open the project in Android Studio."
    },
    {
      title: "Step 5: Generate Signed Bundle",
      icon: Rocket,
      color: "bg-orange-500",
      content: "In Android Studio, go to 'Build' > 'Generate Signed Bundle / APK'. Follow the prompts to create your .aab file. This is the file you will upload to the Google Play Console."
    },
    {
      title: "Step 6: Submit to Play Console",
      icon: Globe,
      color: "bg-blue-600",
      content: "Log in to the Google Play Console, create a new app, and upload your .aab file. Complete the store listing, pricing, and distribution sections, then submit for review."
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="text-blue-600" size={24} />
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Deployment Intelligence</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Nova OS is architected as a high-performance web application that can be seamlessly wrapped into a native mobile container. Follow these protocols to deploy Nova AI to the global market.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`h-10 w-10 ${step.color} rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-black/5`}>
              <step.icon size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{step.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 text-white">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="text-green-400" size={20} />
          <h3 className="text-sm font-bold uppercase tracking-widest">Verification Protocol</h3>
        </div>
        <ul className="space-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <li className="flex items-center gap-2"><div className="h-1 w-1 bg-green-400 rounded-full" /> Assets Optimized for Mobile</li>
          <li className="flex items-center gap-2"><div className="h-1 w-1 bg-green-400 rounded-full" /> Responsive Layout Verified</li>
          <li className="flex items-center gap-2"><div className="h-1 w-1 bg-green-400 rounded-full" /> API Key Security Hardened</li>
        </ul>
      </div>

      <div className="flex justify-center">
        <a 
          href="https://capacitorjs.com/docs/getting-started" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
        >
          View Full Capacitor Documentation <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
