# Calibre 01 Atelier

Create a cinematic, ultra-luxury e-commerce landing page for an haute-horlogerie Swiss automatic timepiece called "KRONOS Atelier - Calibre 01".

Theme & Visual Direction:
- Theme: Deep Obsidian & Onyx dark mode (#08080A, #121214) with subtle brushed metallic textures.
- Accents: Horological Champagne Gold (#D4AF37), polished titanium accents, and deep sapphire reflections.
- Typography: Editorial serif headings (Playfair / Cormorant style) paired with precise technical sans-serif for caliper specs and movement parameters.

Hero Section - Interactive Exploded View Showcase:
- An ultra-sleek, interactive 3D Exploded View demonstration of the automatic timepiece.
- Layer Breakdown: Visually separate the watch components along the Z-axis in an interactive layered stack:
  1. Top Layer: Domed anti-reflective Sapphire Crystal.
  2. Bezel & Dial: Skeletonized dial with applied rose-gold indices and luminescent hands.
  3. Complications: Flying Tourbillon and date wheel assembly.
  4. Automatic Movement: The mechanical Calibre 01 heart, escapement, and balance wheel with subtle rotational CSS animations.
  5. Skeletonized Rotor & Bridges: 22K gold oscillating weight.
  6. Case Back & Strap: Titanium exhibition caseback transitioning into a supple alligator leather / integrated steel bracelet on a simulated wrist contour.
- Interactivity:
  - Provide a scrubbable slider or scroll-driven state ("Deconstruct / Reassemble") that expands the parts outward along the Z-axis with depth blur and shadows, then smoothly snaps them back together into the fully assembled watch.
  - Interactive hotspot pins on individual layers (e.g., "Co-Axial Escapement", "4Hz / 28,800 vph", "72-Hour Power Reserve") that reveal technical tooltips on click/hover.
  - A subtle 3D parallax tilt effect following mouse movement.

Key Page Sections:
1. Architectural Hero: Exploded showcase container with "Engineering Eternity" headline, audio toggle for mechanical ticking sound effects (UI toggle), CTA buttons ("Reserve Timepiece", "Explore Calibre"), and certified Swiss-Made trust metrics.
2. The Anatomy of Calibre 01: Interactive technical breakdown grid with live stats (Jewels: 33, Frequency: 4Hz, Water Resistance: 100m, Power Reserve gauge with dynamic progress bar).
3. Wrist Fit & Finish Visualizer: Interactive toggle previewing the assembled watch on different strap options (Matte Alligator, Brushed Titanium, Milanese Mesh).
4. Craftsmanship Storytelling: High-end editorial showcase explaining hand-finishing, Côtes de Genève engravings, and artisan assembly.
5. Bespoke Atelier Checkout / Reservation Drawer: Minimalist order configuration modal with serial number reservation, engraving customization input, and sleek payment breakdown.

Tech & Implementation:
- Modern React, Tailwind CSS, Lucide icons, Framer Motion for smooth assembly/disassembly animations, and modular component hierarchy.
- Code should be clean, modular, and designed so that the exploded view canvas container can easily be swapped with a real Three.js / React Three Fiber (.glb) canvas later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/87085a43-c79b-41bf-87f5-12f6af6cfae9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
