import type { SVGProps } from 'react'

const PATHS: Record<string, string> = {
  camera:
    'M3 9a2 2 0 0 1 2-2h1.5l1-2h5l1 2H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Zm9 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  check: 'M20 6 9 17l-5-5',
  split: 'M4 6h6m10 0h-6M4 18h6m10 0h-6M10 6v12m4-12v12',
  code: 'm16 18 6-6-6-6M8 6l-6 6 6 6',
  bug: 'M9 9V6a3 3 0 0 1 6 0v3m-9 3H3m18 0h-3M6 12a6 6 0 0 0 12 0v-1H6v1Zm0 0c0 3 1 5 3 6m9-6c0 3-1 5-3 6',
  board: 'M4 5h16v14H4zM9 5v14M15 5v14',
  sparkle: 'M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2 2m8 8 2 2m0-12-2 2M8 16l-2 2',
}

export function Icon({
  name,
  size = 20,
  ...rest
}: { name: keyof typeof PATHS | string; size?: number } & SVGProps<SVGSVGElement>) {
  const d = PATHS[name] ?? PATHS.sparkle
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d={d} />
    </svg>
  )
}
