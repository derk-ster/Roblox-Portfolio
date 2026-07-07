/** Dark transparent placeholder — avoids white flashes during 3D scene loads. */
export function SceneLoadingFallback() {
  return (
    <div
      className="pointer-events-none absolute inset-0 bg-bg/0"
      aria-hidden
    />
  );
}
