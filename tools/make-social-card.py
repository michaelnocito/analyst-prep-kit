"""Regenerate a 1200x630 social card for a guide.

Matches the existing assets/social/*.png design: dark ground with an upper-right
glow, blue kicker, two-line bold title, blue rule, two-line subtitle, the site
URL, and the five-class RdYlBu swatch strip.

Usage:
  python tools/make-social-card.py

Edit CARD below, run it, and check the PNG before committing.
"""

from PIL import Image, ImageDraw, ImageFont
import math
import sys

OUT = "assets/social/sample-database-for-sql-practice.png"

CARD = {
    "kicker": "ANALYST PREP KIT",
    "title": ["Get a Sample Database", "to Practice SQL"],
    "subtitle": [
        "One CSV cannot teach you joins. Eleven linked",
        "tables on your machine in five minutes.",
    ],
    "url": "michaelnocito.github.io",
}

W, H = 1200, 630
BG = (10, 12, 15)
GLOW = (26, 42, 51)
GLOW_AT = (1150, 60)
GLOW_R = 900
BLUE = (56, 160, 222)
WHITE = (255, 255, 255)
SUBTLE = (150, 158, 168)
FAINT = (110, 118, 128)
SWATCHES = [(44, 123, 182), (171, 217, 233), (255, 255, 191), (253, 174, 97), (215, 25, 28)]

FONT_BOLD = "C:/Windows/Fonts/segoeuib.ttf"
FONT_REG = "C:/Windows/Fonts/segoeui.ttf"

MARGIN = 84


def background():
    im = Image.new("RGB", (W, H), BG)
    px = im.load()
    gx, gy = GLOW_AT
    for y in range(H):
        for x in range(W):
            d = math.hypot(x - gx, y - gy) / GLOW_R
            f = max(0.0, 1.0 - d) ** 2
            px[x, y] = tuple(int(BG[i] + (GLOW[i] - BG[i]) * f) for i in range(3))
    return im


def tracked(draw, xy, text, font, fill, spacing):
    """Draw text with extra letter spacing, the way the kicker is set."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + spacing


def build():
    im = background()
    d = ImageDraw.Draw(im)

    kicker = ImageFont.truetype(FONT_BOLD, 21)
    title = ImageFont.truetype(FONT_BOLD, 76)
    sub = ImageFont.truetype(FONT_REG, 25)
    url = ImageFont.truetype(FONT_REG, 19)

    tracked(d, (MARGIN, 73), CARD["kicker"], kicker, BLUE, 5.6)

    y = 178
    for line in CARD["title"]:
        d.text((MARGIN, y), line, font=title, fill=WHITE)
        y += 78

    d.rectangle([MARGIN, 372, MARGIN + 194, 376], fill=BLUE)

    y = 406
    for line in CARD["subtitle"]:
        d.text((MARGIN, y), line, font=sub, fill=SUBTLE)
        y += 36

    d.text((MARGIN + 1, 562), CARD["url"], font=url, fill=FAINT)

    x = 812
    for c in SWATCHES:
        d.rectangle([x, 540, x + 60, 558], fill=c)
        x += 68

    im.save(OUT)
    print("wrote", OUT, im.size)


if __name__ == "__main__":
    # Optional CLI: slug "Title line 1|Title line 2" "Sub line 1|Sub line 2"
    # With no arguments it uses the CARD dict above, as it always has.
    if len(sys.argv) == 4:
        slug, title, subtitle = sys.argv[1], sys.argv[2], sys.argv[3]
        OUT = f"assets/social/{slug}.png"
        CARD["title"] = title.split("|")
        CARD["subtitle"] = subtitle.split("|")
    build()
