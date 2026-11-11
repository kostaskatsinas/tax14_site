# Website photography and archived creative briefs

Last checked against source: **2026-11-11**, through `7c0d19e`. The active hero
photograph was replaced in `85354f6`; the split layout was refined in
`0c45d54`. The older office/handshake briefs below are historical references.

## Current hero photograph

The Greek and English homepages use a real HD photograph of the Acropolis and
Parthenon viewed from Philopappos Hill, by **A.Savin, Wikipedia**, via
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Attica_06-13_Athens_50_View_from_Philopappos_-_Acropolis_Hill.jpg),
licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).
The source is 5000 × 3125 pixels. Resized WebP derivatives retain the same licence;
attribution and the responsive crop are disclosed on [credits.html](../credits.html)
and [en/credits.html](../en/credits.html). This is not an AI-generated image.

| File | Dimensions |
| --- | --- |
| [acropolis-960.webp](../assets/img/acropolis-960.webp) | 960 × 600 |
| [acropolis-1280.webp](../assets/img/acropolis-1280.webp) | 1280 × 800 |
| [acropolis-1920.webp](../assets/img/acropolis-1920.webp) | 1920 × 1200 |
| [acropolis-2560.webp](../assets/img/acropolis-2560.webp) | 2560 × 1600 |
| [acropolis-3840.webp](../assets/img/acropolis-3840.webp) | 3840 × 2400 |

The hero uses an HTML image with `srcset`, `sizes`, explicit dimensions,
`fetchpriority="high"`, matching preload and translated descriptive alt text.
The photo sits beside the text on desktop and below it under 1024px. CSS uses
`object-fit: cover`, position 58% 45% on desktop and 58% 38% below 1024px.
It is a neighbourhood landmark, not a photograph of TAX14's premises.

The previous `assets/img/philopappos-{960,1280,1920}.webp` files remain in the
repository but are not referenced by current homepage HTML. No active office,
handshake or adviser portrait is present in the current layout.

The shared social image remains [og-image.png](../assets/og-image.png), 1200 ×
630 pixels, with source [og-image-source.html](og-image-source.html). It is
separate from the responsive hero image. Homepage SEO changes in `7c0d19e`
updated sharing text, not either image.

## Archived briefs

These preserve earlier creative direction; they are not instructions to generate
or restore images. The files `assets/accounting-office.webp` and
`assets/client-handshake.webp` are absent from the current checkout. No original
PNGs or `generated-images/` folder are present. Do not treat these briefs as
evidence of asset provenance or photographs of actual staff/premises.
Current layout guidance is in [TAX14.md](TAX14.md).

### Office brief

Use case: photorealistic-natural. Asset type: wide editorial photograph for an accounting office website section. Primary request: a contemporary accounting office in Athens, Greece, calm and approachable. Scene: a tidy professional desk with a calculator, a few neatly arranged financial documents with no readable text, a closed navy folder, laptop viewed obliquely, and two comfortable visitor chairs; softly blurred shelving and large windows behind. No people. Composition: landscape 3:2, a complete scene that remains clear at 400 pixels wide, practical real office rather than a luxury showroom. Lighting: natural Mediterranean daylight, realistic soft shadows. Palette: navy blue, muted teal, light oak, white. Photographic realism and natural material textures. No logos, no lettering, no watermarks, no stock-photo decorative graphics.

Historical asset name: `assets/accounting-office.webp` (not currently shipped).

### Handshake brief

Use case: photorealistic-natural. Asset type: wide editorial photograph for an accounting services website section about starting a professional collaboration. Primary request: two adult professionals, an accountant and a client, shaking hands across the corner of an office desk after a consultation. Frame their upper bodies and the single natural handshake clearly in the center; one wears a navy blazer and the other a pale blue shirt. A neat folder and calculator, a softly blurred contemporary Greek office in the background. Composition: landscape 3:2, friendly and candid, readable at 400 pixels wide. Lighting: soft Mediterranean daylight. Palette: navy, muted teal details, white and light oak. Natural anatomy, exactly two people and one handshake. No logos, lettering, watermarks or decorative graphics.

Historical asset name: `assets/client-handshake.webp` (not currently shipped).
