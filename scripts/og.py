"""Branded 1200x630 Open Graph images. One JPEG per public route."""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
CREAM = (247, 244, 236)
FOREST = (15, 61, 46)
GOLD = (201, 162, 74)
INK = (26, 36, 28)
REGULAR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'


def wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ''
    for word in words:
        trial = word if not current else f'{current} {word}'
        if draw.textlength(trial, font=font) <= width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines[:4]


def draw_card(title: str, dest: Path) -> None:
    image = Image.new('RGB', (W, H), CREAM)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 18, H), fill=FOREST)
    draw.rectangle((18, 0, W, 8), fill=FOREST)
    draw.rectangle((72, 118, 168, 124), fill=GOLD)
    brand = ImageFont.truetype(BOLD, 28)
    body = ImageFont.truetype(BOLD, 64)
    small = ImageFont.truetype(REGULAR, 26)
    draw.text((72, 72), 'FARCON WEALTH', font=brand, fill=FOREST)
    lines = wrap(draw, title, body, 1000)
    y = 168
    for line in lines:
        draw.text((72, y), line, font=body, fill=INK)
        y += 78
    draw.text((72, 548), 'ARN 329006  ·  Mutual fund distributor', font=small, fill=FOREST)
    dest.parent.mkdir(parents=True, exist_ok=True)
    image.save(dest, 'JPEG', quality=86, optimize=True)


def main() -> None:
    manifest = json.loads(Path(sys.argv[1]).read_text())
    for item in manifest:
        draw_card(item['title'], Path(item['file']))
    print(f'Wrote {len(manifest)} Open Graph images.')


if __name__ == '__main__':
    main()
