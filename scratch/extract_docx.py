import zipfile
import xml.etree.ElementTree as ET
import sys

docx_path = r'd:\laravel\happy-health2\docs\docx\บทที่ 4 (2).docx'
out_path = r'd:\laravel\happy-health2\docs\docx\extracted_chapter4.txt'

with zipfile.ZipFile(docx_path) as z:
    xml_content = z.read('word/document.xml')

root = ET.fromstring(xml_content)
namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

lines = []

# Function to process paragraph
def get_p_text(p):
    texts = [node.text for node in p.findall('.//w:t', namespaces) if node.text]
    return ''.join(texts).strip()

for child in root.find('w:body', namespaces):
    tag = child.tag.split('}')[-1]
    if tag == 'p':
        txt = get_p_text(child)
        if txt:
            lines.append(txt)
    elif tag == 'tbl':
        lines.append("\n[TABLE START]")
        for row in child.findall('.//w:tr', namespaces):
            row_cells = []
            for cell in row.findall('.//w:tc', namespaces):
                cell_texts = []
                for p in cell.findall('.//w:p', namespaces):
                    t = get_p_text(p)
                    if t:
                        cell_texts.append(t)
                row_cells.append(' '.join(cell_texts))
            lines.append(" | ".join(row_cells))
        lines.append("[TABLE END]\n")

with open(out_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Successfully extracted {len(lines)} lines to {out_path}")
