"""Check generated copy, SEO pairs, local links and the shared form contract."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import json
import re
import subprocess
import sys
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
PAGES = ('index.html', 'privacy.html', 'terms.html', 'cookies.html', 'credits.html', 'financial-statements.html')


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.elements, self.copy, self.ids, self.scripts = [], [], [], []
        self.script = False
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.elements.append((tag, attrs))
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        if tag == 'script':
            self.script = True

    handle_startendtag = handle_starttag

    def handle_endtag(self, tag):
        if tag == 'script':
            self.script = False

    def handle_data(self, data):
        (self.scripts if self.script else self.copy).append(data)

    def find(self, tag, **attrs):
        return [a for t, a in self.elements if t == tag and all(a.get(k) == v for k, v in attrs.items())]


class Languages(unittest.TestCase):
    def test_generated_pages_are_current(self):
        subprocess.run([sys.executable, str(ROOT / 'scripts/build-english.py'), '--check'], check=True)

    def test_language_pairs_and_translated_copy(self):
        for filename in PAGES:
            for language in ('el', 'en'):
                with self.subTest(page=filename, language=language):
                    prefix = 'en/' if language == 'en' else ''
                    page = Page(ROOT / prefix / filename)
                    url = 'https://tax14.gr/' + prefix + ('' if filename == 'index.html' else filename)
                    self.assertEqual(page.find('html')[0]['lang'], language)
                    self.assertEqual(page.find('link', rel='canonical')[0]['href'], url)
                    self.assertEqual(page.find('meta', property='og:url')[0]['content'], url)
                    for code in ('el', 'en', 'x-default'):
                        expected = 'https://tax14.gr/' + ('en/' if code == 'en' else '') + ('' if filename == 'index.html' else filename)
                        self.assertEqual(page.find('link', rel='alternate', hreflang=code)[0]['href'], expected)
                    links = [attrs for tag, attrs in page.elements if 'data-language-link' in attrs]
                    self.assertEqual(len(links), 2)
                    self.assertEqual([a['hreflang'] for a in links if a.get('aria-current') == 'page'], [language])
                    for link in links:
                        path = ('/en/' if link['hreflang'] == 'en' else '/') + ('' if filename == 'index.html' else filename)
                        self.assertEqual(link['href'], path)
                    self.assertEqual(len(page.ids), len(set(page.ids)))
                    if language == 'en':
                        self.assertNotRegex(''.join(page.copy + page.scripts), r'[\u0370-\u03ff\u1f00-\u1fff]')
                        for tag, attrs in page.elements:
                            if 'data-language-link' in attrs:
                                continue  # Language names are deliberately native.
                            for attribute in ('aria-label', 'alt', 'placeholder', 'data-label', 'title', 'content'):
                                self.assertNotRegex(attrs.get(attribute, ''), r'[\u0370-\u03ff\u1f00-\u1fff]')

    def test_local_links_assets_and_sections_exist(self):
        for filename in PAGES:
            for prefix in ('', 'en/'):
                path = prefix + filename
                page = Page(ROOT / path)
                base = 'https://tax14.gr/' + path
                for tag, attrs in page.elements:
                    for key in ('href', 'src'):
                        if key not in attrs:
                            continue
                        url = urlsplit(urljoin(base, attrs[key]))
                        if url.scheme not in ('http', 'https') or url.netloc != 'tax14.gr':
                            continue
                        target = ROOT / unquote(url.path.lstrip('/'))
                        if target.is_dir():
                            target /= 'index.html'
                        self.assertTrue(target.is_file(), f'{path}: missing {attrs[key]}')
                        if url.fragment and target.suffix == '.html':
                            self.assertIn(unquote(url.fragment), Page(target).ids, f'{path}: missing section {attrs[key]}')

    def test_forms_keep_the_server_contract(self):
        greek, english = Page(ROOT / 'index.html'), Page(ROOT / 'en/index.html')
        # Translating labels must not break service prefills, segment or contact modes.
        def contract(page):
            return [(tag, {k: v for k, v in attrs.items() if k in ('name', 'value', 'id') or k.startswith('data-prefill-')})
                    for tag, attrs in page.elements if tag in ('input', 'select', 'option', 'textarea') or 'data-prefill-segment' in attrs]
        self.assertEqual(contract(greek), contract(english))
        self.assertEqual(greek.ids, english.ids)

    def test_all_pages_are_in_sitemap(self):
        sitemap = ET.parse(ROOT / 'sitemap.xml')
        locations = {node.text for node in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
        for filename in PAGES:
            for prefix in ('', 'en/'):
                self.assertIn('https://tax14.gr/' + prefix + ('' if filename == 'index.html' else filename), locations)


if __name__ == '__main__':
    unittest.main()
