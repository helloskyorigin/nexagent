const fs = require('fs');
let code = fs.readFileSync('components/chat/ChatComposer.tsx', 'utf8');

// Add icons
code = code.replace(
  'import {',
  'import {\n  Plus,\n  Image as ImageIcon,\n  FileText,'
);

// Add props
code = code.replace(
  'webSearchEnabled?: boolean;',
  'webSearchEnabled?: boolean;\n  onGenerateImage?: (prompt: string, style?: string, ratio?: string) => void;'
);

// Add state
code = code.replace(
  'const [isListening, setIsListening] = useState(false);',
  'const [isListening, setIsListening] = useState(false);\n  const [showPlusMenu, setShowPlusMenu] = useState(false);\n  const [showImagePanel, setShowImagePanel] = useState(false);\n  const [imgPrompt, setImgPrompt] = useState("");\n  const [imgStyle, setImgStyle] = useState("");\n  const [imgRatio, setImgRatio] = useState("1:1");'
);

// Replace Paperclip button with Plus menu + Image Panel
const plusMenuCode = `
            {/* Plus Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPlusMenu(!showPlusMenu)}
                className="h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
                title="Add"
              >
                <Plus className="h-4 w-4" />
              </button>

              {showPlusMenu && (
                <div
                  className="absolute right-0 bottom-full mb-1.5 w-40 rounded-xl bg-[#15181D] border border-slate-800 shadow-xl p-1 z-50 text-xs space-y-0.5"
                  onMouseLeave={() => setShowPlusMenu(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowPlusMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-slate-300 hover:bg-white/5 cursor-pointer font-medium flex items-center gap-2"
                  >
                    <FileText className="h-3.5 w-3.5 text-blue-400" />
                    Attach file
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (inputText.trim().length > 10) {
                         // generate immediately
                         if (props.onGenerateImage) props.onGenerateImage(inputText.trim());
                         onChangeText("");
                      } else {
                         setImgPrompt(inputText.trim());
                         setShowImagePanel(true);
                      }
                      setShowPlusMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-slate-300 hover:bg-white/5 cursor-pointer font-medium flex items-center gap-2"
                  >
                    <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
                    Create image
                  </button>
                </div>
              )}
            </div>
`;

code = code.replace(
  /<button[\s\S]*?Paperclip className="h-4 w-4" \/>[\s\S]*?<\/button>/,
  plusMenuCode
);

// Inject Image Panel above attachments
const imagePanelCode = `
        {showImagePanel && (
          <div className="p-3 bg-[#0D0F12] rounded-xl border border-slate-800/80 space-y-3 mb-2 animate-fadeIn relative">
            <button type="button" onClick={() => setShowImagePanel(false)} className="absolute top-2 right-2 text-slate-500 hover:text-white">&times;</button>
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5 text-emerald-400" /> Create Image</h4>
            <div className="space-y-2">
              <input type="text" placeholder="Describe the image (e.g. A futuristic city...)" value={imgPrompt} onChange={e => setImgPrompt(e.target.value)} className="w-full bg-[#15181D] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500/50" />
              <div className="flex gap-2">
                <input type="text" placeholder="Style (optional)" value={imgStyle} onChange={e => setImgStyle(e.target.value)} className="flex-1 bg-[#15181D] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none" />
                <select value={imgRatio} onChange={e => setImgRatio(e.target.value)} className="bg-[#15181D] border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-200 outline-none">
                  <option value="1:1">1:1 Square</option>
                  <option value="16:9">16:9 Widescreen</option>
                  <option value="9:16">9:16 Portrait</option>
                </select>
              </div>
              <button type="button" onClick={() => {
                 if (imgPrompt.trim() && props.onGenerateImage) {
                   props.onGenerateImage(imgPrompt, imgStyle, imgRatio);
                   setShowImagePanel(false);
                   setImgPrompt("");
                 }
              }} className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 py-2 rounded-lg text-xs font-semibold transition-colors">
                Generate Image
              </button>
            </div>
          </div>
        )}
`;

code = code.replace(
  '{/* Attached Chips */}',
  imagePanelCode + '\n        {/* Attached Chips */}'
);

// fix props usage inside the new code
code = code.replace(/props\.onGenerateImage/g, 'onGenerateImage');
code = code.replace(
  'webSearchEnabled,',
  'webSearchEnabled,\n  onGenerateImage,'
);

fs.writeFileSync('components/chat/ChatComposer.tsx', code);
