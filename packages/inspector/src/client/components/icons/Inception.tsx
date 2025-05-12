import type { IconProps } from "./type";

export function InceptionIcon({ style, ...props }: IconProps) {
  return (
    <svg
      {...props}
      data-testid="geist-icon"
      width="16"
      height="16"
      strokeLinejoin="miter"
      viewBox="0 46 99.01 99"
      style={{ color: "currentcolor", ...style }}
    >
      <title>Inception</title>
      <defs>
        <clipPath id="clip0_inception">
          <rect x="0" y="46" width="99.01" height="99" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip0_inception)">
        <path
          fill="currentColor"
          d="M31.3338 108.339H0V77.1781L31.3338 46H62.65V77.1781H31.3338V108.339Z"
        />
        <path
          fill="currentColor"
          d="M67.6854 82.6611H99.0015V113.839L67.6854 145H36.3516V113.839H67.6854V82.6611Z"
        />
      </g>
    </svg>
  );
}
