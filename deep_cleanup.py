import os
import re

root_dir = r"f:\Matrix_Gin\frontend\src"

# Regular expressions for precise matching
replacements = {
    # 1. Fonts (Geist Canon)
    r"['\"]Inter['\"]": "'Geist'",
    r"['\"]Roboto['\"]": "'Geist'",
    r"['\"]Geist Sans['\"]": "'Geist'",
    
    # 2. Weights (Standardization to 500/400)
    r'\bfont-bold\b': 'font-medium',
    r'\bfont-semibold\b': 'font-medium',
    r'\bfont-extrabold\b': 'font-medium',
    r'\bfont-black\b': 'font-medium',
    
    # 3. Theme Migration (Dark to Light/Geist Neutral)
    # Target common patterns that cause "white-on-white" or legacy dark looks
    r'\btext-white\b(?!\s*bg-(?:indigo|blue|red|emerald|rose|purple))': 'text-[#030213]', # Make white text dark UNLESS it's on a colored background
    r'\btext-gray-400\b': 'text-[#717182]',
    r'\btext-gray-500\b': 'text-[#717182]',
    r'\btext-slate-400\b': 'text-[#717182]',
    r'\btext-slate-500\b': 'text-[#717182]',
    
    r'\bbg-gray-900\b': 'bg-white',
    r'\bbg-black\b': 'bg-white',
    r'\bbg-slate-900\b': 'bg-white',
    r'\bbg-slate-950\b': 'bg-[#F3F3F5]',
    
    r'\bborder-gray-800\b': 'border-black/10',
    r'\bborder-slate-800\b': 'border-black/10',
    r'\bborder-white/10\b': 'border-black/10'
}

def process_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for pattern, replacement in replacements.items():
            new_content = re.sub(pattern, replacement, new_content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Refactored: {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css')):
            # Skip theme file to avoid messing with base definitions
            if 'matrixGinTheme.ts' in file:
                continue
            process_file(os.path.join(root, file))
