# Dev Log

## Home cherry blossom petals

**Status:** Partially active on Home only

**Where:**
- `src/components/motif/FallingLeaves.js` + `FallingLeaves.css` — petal renderer
- `src/components/motif/petalFeatures.js` — feature flags
- Wired from `Home.js` / `HomeMobile.js`

### Flags (`petalFeatures.js`)

| Flag | Current | What it controls |
|------|---------|------------------|
| `ENABLE_PETAL_TRANSITIONS` | **`false` (off)** | Intro + exit screen-covering gusts. When on, exit delays navigation ~0.9s. |
| `ENABLE_AMBIENT_PETALS` | **`true` (on)** | Ongoing windfall behind UI / over bonsai while on Home. |

### Transition code (kept, currently disabled)

Intro/exit gust logic still lives in Home components behind `ENABLE_PETAL_TRANSITIONS`. It uses two layers (`behind` / `front`), dense petal counts, linear gust speed, and steeper spawn. **Do not delete** — set the flag to `true` to restore.

**To re-enable page petal transitions:** set `ENABLE_PETAL_TRANSITIONS = true` in `petalFeatures.js`. Note that exit will again delay route changes until the gust finishes.

**Not used on:** About, Projects, Contact, Navbar.

## Atmosphere watermark (interior pages)

**Status:** Placeholder present, visually hidden

**Where:** `src/components/motif/PageAtmosphere.js`

Corner watermark `<img>` elements still render in the DOM on About, Projects, and Contact (desktop and mobile). They currently point at `/bonsai.png` and use the class `page-atmosphere__watermark--hidden` so they do not show.

**Why:** The home bonsai image is not the right asset for faint page atmosphere. A dedicated leaf/branch/texture asset should replace it later.

**To re-enable:**
1. Drop the new asset in `public/` (e.g. `atmosphere.png` or similar).
2. Update the `src` on the watermark `<img>` tags in `PageAtmosphere.js`.
3. Remove `page-atmosphere__watermark--hidden` from those elements (or delete the hide rule in `PageAtmosphere.css`).
4. Tune opacity in `.page-atmosphere__watermark` if needed.

**Marker:** `data-dev-placeholder="atmosphere-watermark"` on the img nodes for easy search.
