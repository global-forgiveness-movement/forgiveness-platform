#!/usr/bin/env python3
"""Draw a site illustration with Gemini, in the REACH workbook's botanical style.

Wyatt, 6 Oct: the site's pictures are Gemini's, in the style of the PDF book —
thin navy line art, almond leaves in the brand colors, no people. This script
is the ONE way they are made, so every new picture matches the last.

    python3 scripts/art/gen-illustration.py <subject> [n]      # draw one (raw PNG → .planning/art/)
    python3 scripts/art/gen-illustration.py --cut <subject> [n] # cut it out → assets/illustrations/<subject>.webp
    python3 scripts/art/gen-illustration.py --list

References are built from the repo every run (two workbook pages, and the
site's own illustrations on cream), so nothing depends on a scratch folder.
The API key is read from ~/.config/gemini/key and never enters the repo.
Needs: pdftoppm (poppler), Pillow, numpy.
"""
import base64, io, json, os, subprocess, sys, tempfile, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
RAW = os.path.join(ROOT, '.planning', 'art')
OUT = os.path.join(ROOT, 'assets', 'illustrations')
PDF = os.path.join(ROOT, 'assets', 'workbooks', 'REACH-Forgiveness-Workbook-English.pdf')
STYLE_REFS = ['on-your-own', 'in-a-group', 'watch-video']   # site pictures to match
MODEL = 'gemini-3-pro-image'
CREAM = (245, 241, 226)

STYLE = ("Match EXACTLY the illustration style of the attached images: flat vector botanical line art, thin dark navy "
         "(#003D57) outlines, simple almond-shaped leaves filled flat in teal (#00887A), plum (#770061), mustard (#FAB812) "
         "and sage (#8FBCAD), some leaves slightly translucent and overlapping, no gradients, no shading, no texture. The "
         "last three attached images are the exact style to match: same line weight, leaf shapes and colors. Plain cream "
         "background (#F5F1E2), generous empty space, centered, 4:3. Absolutely NO people, faces, hands, text, letters or words. ")

# Every picture the site uses, by file name. Add a line to make a new one.
SUBJECTS = {
    'on-your-own': "Subject: a single open book seen from slightly above, with one slender branch growing up out of its pages and a few leaves. Quiet, solitary, calm.",
    'in-a-group': "Subject: five small open books arranged in a loose circle, each with a slender branch growing from it; the branches curve toward the center and intertwine into one shared canopy of leaves.",
    'watch-video': "Subject: one small rounded screen shape in flat navy outline with a small flat teal play-triangle in its center; one slender leafy branch curves up from behind it. Lots of empty space, nothing touching the edges.",
    'trial-flask': "Subject: one small laboratory flask (Erlenmeyer) drawn as a thin navy outline, with one slender leafy branch growing up out of its neck.",
    'globe': "Subject: a simple round globe drawn as a thin navy outline with a few curved latitude and longitude lines, with two slender leafy branches curving around it.",
    'hero-path': "Subject: a gentle winding path drawn as two thin navy lines, rising from the bottom left toward a small half sun on a low horizon at the upper right. Slender leafy branches grow beside the path, and a few loose leaves drift upward and away from it, light and free. Calm, hopeful, open.",
    'start-a-group': "Subject: one small rounded screen shape in flat navy outline with a small flat teal play-triangle in its center, and in front of it three small open books in a gentle arc, as if gathered to watch together. A slender leafy branch grows up from each book, the three curving toward the screen. Lots of empty space, nothing touching the edges.",
    'sunrise': "Subject: a half sun rising above a straight horizon line, drawn as a thin navy outline with a few short rays, and one slender branch in fresh leaf rising beside it.",
}


def b64(data, mime):
    return {'inline_data': {'mime_type': mime, 'data': base64.b64encode(data).decode()}}


def references():
    from PIL import Image
    parts = []
    with tempfile.TemporaryDirectory() as tmp:
        for page in (1, 2):
            stem = os.path.join(tmp, f'ref{page}')
            subprocess.run(['pdftoppm', '-r', '70', '-jpeg', '-f', str(page), '-l', str(page), '-singlefile', PDF, stem],
                           check=True, capture_output=True)
            parts.append(b64(open(stem + '.jpg', 'rb').read(), 'image/jpeg'))
    for name in STYLE_REFS:
        im = Image.open(os.path.join(OUT, name + '.webp')).convert('RGBA')
        bg = Image.new('RGBA', im.size, CREAM + (255,))
        bg.alpha_composite(im)
        buf = io.BytesIO()
        bg.convert('RGB').save(buf, 'PNG')
        parts.append(b64(buf.getvalue(), 'image/png'))
    return parts


def draw(subject, n):
    key = open(os.path.expanduser('~/.config/gemini/key')).read().strip()
    body = {'contents': [{'parts': references() + [{'text': STYLE + SUBJECTS[subject]}]}],
            'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': '4:3'}}}
    req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent',
                                 data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': key})
    reply = json.load(urllib.request.urlopen(req, timeout=300))
    os.makedirs(RAW, exist_ok=True)
    for part in reply['candidates'][0]['content']['parts']:
        if 'inlineData' in part:
            path = os.path.join(RAW, f'{subject}-{n}.png')
            open(path, 'wb').write(base64.b64decode(part['inlineData']['data']))
            print('wrote', os.path.relpath(path, ROOT))
            return
    sys.exit('Gemini returned no image')


def cut(subject, n):
    """The cream background keyed out to transparency, trimmed, saved as WebP."""
    import numpy as np
    from PIL import Image
    im = np.asarray(Image.open(os.path.join(RAW, f'{subject}-{n}.png')).convert('RGB')).astype(float)
    edge = np.concatenate([im[:20].reshape(-1, 3), im[-20:].reshape(-1, 3), im[:, :20].reshape(-1, 3), im[:, -20:].reshape(-1, 3)])
    bg = np.median(edge, axis=0)
    a = np.clip((np.sqrt(((im - bg) ** 2).sum(-1)) - 6) / 40, 0, 1)
    rgb = np.where(a[..., None] > 0.01, (im - bg * (1 - a[..., None])) / np.maximum(a[..., None], 0.01), im)
    img = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), a * 255]).astype(np.uint8))
    img = img.crop(img.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())
    pad = int(max(img.size) * 0.04)
    framed = Image.new('RGBA', (img.width + 2 * pad, img.height + 2 * pad), (0, 0, 0, 0))
    framed.paste(img, (pad, pad))
    framed.thumbnail((720, 720))
    path = os.path.join(OUT, subject + '.webp')
    framed.save(path, 'WEBP', quality=88, method=6)
    print('wrote', os.path.relpath(path, ROOT), framed.size)


if __name__ == '__main__':
    args = sys.argv[1:]
    if not args or args[0] == '--list':
        print('\n'.join(SUBJECTS))
    elif args[0] == '--cut':
        cut(args[1], args[2] if len(args) > 2 else '1')
    else:
        draw(args[0], args[1] if len(args) > 1 else '1')
