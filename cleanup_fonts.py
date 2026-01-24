import os
import re

root_dir = r"f:\Matrix_Gin\frontend\src"
replacements = {
    r'\bfont-bold\b': 'font-medium',
    r'\bfont-semibold\b': 'font-medium',
    r'\bfont-extrabold\b': 'font-medium',
    r'\bfont-black\b': 'font-medium',
    r"['\"]Inter['\"]": "'Geist'",
    r"['\"]Roboto['\"]": "'Geist'",
    r"['\"]Geist Sans['\"]": "'Geist'"
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
            print(f"Updated: {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css')):
            process_file(os.path.join(root, file))
