import type { HTMLAttributes } from "react";

const Logo = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`
        flex size-14 shrink-0 flex-col items-center justify-center
        text-primary
        transition-colors duration-300
        ${className || ""}
      `}
      {...props}
    >
      <span
        className="
          mt-0.5
          font-serif text-2xl font-bold leading-none
        "
      >
        B
      </span>

      <span
        className="
          mt-0.5
          font-serif text-[7px] font-normal uppercase
          tracking-[0.15em]
        "
      >
        BOOKVERSE
      </span>

    </div>
  );
};

export default Logo;