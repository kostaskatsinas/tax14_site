#!/usr/bin/env python3
"""Generate /en from the Greek pages and reviewed copy. Run after editing either.

Fails on untranslated Greek copy; never translates form values/API enums.
Use --check in CI to verify the committed pages are up to date.
"""
import argparse
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
PAGES = ('index.html', 'privacy.html', 'terms.html', 'cookies.html', 'credits.html', 'financial-statements.html')
TRANSLATIONS = json.loads((ROOT / 'design-system/translations/en.json').read_text())
GREEK = re.compile(r'[\u0370-\u03ff\u1f00-\u1fff]')


def page_url(page, language):
    return 'https://tax14.gr/' + ('en/' if language == 'en' else '') + ('' if page == 'index.html' else page)


def language_switcher(page, language):
    links = []
    for code, name in [('el', 'Ελληνικά'), ('en', 'English')]:
        path = page_url(page, code).removeprefix('https://tax14.gr')
        current = ' aria-current="page"' if language == code else ''
        links.append(f'<a class="language-switcher__link" data-language-link href="{path}" hreflang="{code}" lang="{code}" aria-label="{name}"{current}><img src="/assets/flags/{code}.svg" width="24" height="16" alt="" aria-hidden="true"><span>{code.upper()}</span></a>')
    return '<!-- LANGUAGE:START -->\n    <nav class="language-switcher" aria-label="Language">\n      ' + '\n      '.join(links) + '\n    </nav>\n    <!-- LANGUAGE:END -->'


def translate(text):
    stripped = text.strip()
    if stripped in TRANSLATIONS:
        result = TRANSLATIONS[stripped]
    else:
        # Archive labels remain current when new years/PDFs are added.
        result = re.sub(r'Προβολή PDF οικονομικών καταστάσεων (\d{4}) \(νέα καρτέλα\)', r'View \1 financial statements PDF (new tab)', stripped)
        result = re.sub(r'Λήψη οικονομικών καταστάσεων (\d{4}) σε PDF', r'Download \1 financial statements PDF', result)
        result = re.sub(r'Β5 & Β6 · PDF · (\d+) KB', r'B5 & B6 · PDF · \1 KB', result)
        if GREEK.search(result):
            raise ValueError(f'Missing English translation: {stripped}')
    return text[:len(text)-len(text.lstrip())] + result + text[len(text.rstrip()):] if stripped else text


class EnglishPage(HTMLParser):
    def __init__(self, page):
        super().__init__(convert_charrefs=True)
        self.page = page
        self.output = []
        self.script = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        raw = self.get_starttag_text()
        replacements = {}
        for key, value in attrs.items():
            if value is None:
                continue
            new = value
            if tag == 'html' and key == 'lang':
                new = 'en'
            elif key in ('aria-label', 'alt', 'title', 'placeholder', 'data-label') and 'data-language-link' not in attrs:
                new = translate(value)
            elif tag == 'meta' and key == 'content':
                if attrs.get('property') == 'og:locale':
                    new = 'en_GB'
                elif attrs.get('property') == 'og:locale:alternate':
                    new = 'el_GR'
                elif attrs.get('property') == 'og:url':
                    new = page_url(self.page, 'en')
                else:
                    new = translate(value)
            elif tag == 'link' and attrs.get('rel') == 'canonical' and key == 'href':
                new = page_url(self.page, 'en')
            elif key in ('href', 'src', 'action') and value.startswith(('assets/', 'css/', 'js/', 'api/')):
                new = '/' + value
            elif key in ('srcset', 'imagesrcset'):
                new = re.sub(r'(?<![/\w])assets/', '/assets/', value)
            if new != value:
                replacements[key] = new
        for key, value in replacements.items():
            raw = re.sub(r'(?<![\w-])' + re.escape(key) + r'\s*=\s*("[^"]*"|\x27[^\x27]*\x27)', lambda _: f'{key}="{html.escape(value, quote=True)}"', raw, count=1, flags=re.I)
        self.output.append(raw)
        if tag == 'script':
            self.script = attrs.get('type', '')

    handle_startendtag = handle_starttag

    def handle_endtag(self, tag):
        self.output.append(f'</{tag}>')
        if tag == 'script':
            self.script = None

    def handle_data(self, data):
        if self.script == 'application/ld+json':
            def localize(value):
                if isinstance(value, dict):
                    return {key: localize(item) for key, item in value.items()}
                if isinstance(value, list):
                    return [localize(item) for item in value]
                if isinstance(value, str):
                    if value == 'https://tax14.gr/#faq':
                        return 'https://tax14.gr/en/#faq'
                    return translate(value)
                return value
            self.output.append('\n' + json.dumps(localize(json.loads(data)), ensure_ascii=False, indent=2) + '\n')
        elif self.script is not None:
            self.output.append(data)
        else:
            self.output.append(html.escape(translate(data), quote=False))

    def handle_comment(self, data):
        self.output.append(f'<!--{data}-->')

    def handle_decl(self, decl):
        self.output.append(f'<!{decl}>')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    stale = []
    for page in PAGES:
        source = (ROOT / page).read_text()
        source = re.sub(r'<!-- LANGUAGE:START -->.*?<!-- LANGUAGE:END -->', lambda _: language_switcher(page, 'en'), source, flags=re.S)
        source = re.sub(r'<link rel="preload" href="assets/fonts/manrope-greek[^\n]+\n', '', source)
        if 'rel="preload" href="assets/fonts/manrope-latin' not in source:
            source = source.replace('<link rel="stylesheet" href="css/fonts.css', '<link rel="preload" href="assets/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="stylesheet" href="css/fonts.css')
        renderer = EnglishPage(page)
        renderer.feed(source)
        rendered = ''.join(renderer.output)
        path = ROOT / 'en' / page
        if args.check:
            if not path.exists() or path.read_text() != rendered:
                stale.append(str(path.relative_to(ROOT)))
        else:
            path.parent.mkdir(exist_ok=True)
            path.write_text(rendered)
    if stale:
        raise SystemExit('Run python3 scripts/build-english.py; stale pages: ' + ', '.join(stale))
    print(f'English pages {"verified" if args.check else "generated"}: {len(PAGES)}')


if __name__ == '__main__':
    main()
