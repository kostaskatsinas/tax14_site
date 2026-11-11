#!/usr/bin/env python3
"""Rebuild the static archive from the PDF filenames; no server runtime required."""
from pathlib import Path
import html
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / 'financial-statements.html'
START, END = '<!-- STATEMENTS:START -->', '<!-- STATEMENTS:END -->'


def main():
    documents = []
    for path in (ROOT / 'assets/financial-statements').glob('*.pdf'):
        match = re.fullmatch(r'tax14-financial-statements-(\d{4})\.pdf', path.name)
        if not match:
            raise ValueError(f'Unexpected PDF filename: {path.name}')
        with path.open('rb') as stream:
            if stream.read(5) != b'%PDF-':
                raise ValueError(f'Not a PDF: {path.name}')
        documents.append((int(match[1]), path))
    if not documents:
        raise ValueError('No financial statement PDFs found')
    rows = []
    for year, path in sorted(documents, reverse=True):
        href = html.escape(path.relative_to(ROOT).as_posix(), quote=True)
        size = round(path.stat().st_size / 1024)
        rows.append(f'''          <li class="financial-row">
            <h3 class="financial-year">{year}</h3>
            <div>
              <p class="financial-document-title">Ισολογισμός &amp; αποτελέσματα χρήσης</p>
              <p class="financial-document-meta">Β5 &amp; Β6 · PDF · {size} KB</p>
            </div>
            <div class="financial-actions">
              <a class="btn btn--secondary" href="{href}" target="_blank" rel="noopener" aria-label="Προβολή PDF οικονομικών καταστάσεων {year} (νέα καρτέλα)">Προβολή PDF <span aria-hidden="true">↗</span></a>
              <a class="financial-download" href="{href}" download aria-label="Λήψη οικονομικών καταστάσεων {year} σε PDF">Λήψη</a>
            </div>
          </li>''')
    source = PAGE.read_text(encoding='utf-8')
    if source.count(START) != 1 or source.count(END) != 1:
        raise ValueError('Expected exactly one archive placeholder')
    before, remainder = source.split(START)
    _, after = remainder.split(END)
    PAGE.write_text(before + START + '\n' + '\n'.join(rows) + '\n' + END + after, encoding='utf-8')
    subprocess.run([sys.executable, str(ROOT / 'scripts/build-english.py')], check=True)
    print(f'Updated {PAGE.name}: {len(documents)} years, newest first.')


if __name__ == '__main__':
    main()
