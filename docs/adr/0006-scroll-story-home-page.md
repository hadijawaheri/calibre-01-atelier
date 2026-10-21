# 0006. A scroll story home page with a travelling movement

Status: accepted

The owner asked for a home page in the spirit of oryzo.ai: one object that stays on screen and turns, lifts and
flips as the page scrolls, inertial scrolling, studio light and a lot of empty space.

- The object is the real movement from the owner's photographs, cut out with rembg (`isnet-general-use`, alpha
  matting) into two faces cropped to the same box. A 3D model would be closer to oryzo, but no real CAD movement
  exists yet (ADR 0005) and a drawn model would break the rule that only real calibres are shown.
- `MovementFlight` is one fixed layer. Each section marks its stop with `data-stage`; the layer measures those
  sections and maps scroll position to a pose (offset, scale, spin, flip about the winding stem) through a spring.
  The two faces are back to back with `backface-visibility: hidden`, so the flip shows the dial side. A sheen masked
  to the movement's outline and a contact shadow follow the pose, and a fine pointer tilts it a few degrees.
- Lenis gives the home page inertial scrolling. It is not used in the lab, where the wheel zooms the 3D canvas.
- With reduced motion the flight and Lenis are off and the hero shows the still photograph.
- The blueprint is drawn from the lab's own arbor positions and pitch radii, so the drawing and the 3D lab are the
  same machine.
