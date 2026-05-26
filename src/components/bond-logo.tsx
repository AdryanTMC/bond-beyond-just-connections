import bondLogo from "@/assets/bond-logo.png";

type Props = {
  /** "mark" = só o coração; "full" = coração + wordmark "bond" */
  variant?: "mark" | "full";
  /** altura em px */
  size?: number;
  className?: string;
};

/**
 * Logo oficial Bond. O arquivo de origem já contém o coração + wordmark.
 * Para variant="mark" recortamos visualmente só a parte do coração (top ~60%).
 */
export function BondLogo({ variant = "mark", size = 32, className = "" }: Props) {
  if (variant === "full") {
    return (
      <img
        src={bondLogo}
        alt="Bond"
        width={size * 2.4}
        height={size}
        loading="eager"
        decoding="async"
        className={`object-contain ${className}`}
        style={{ height: size, width: "auto" }}
      />
    );
  }
  // mark: usa a imagem inteira mas com aspect 1:1 e recorte focado no coração
  return (
    <span
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={bondLogo}
        alt="Bond"
        loading="eager"
        decoding="async"
        style={{
          width: "180%",
          height: "180%",
          objectFit: "contain",
          objectPosition: "center top",
          transform: "translate(-22%, -8%)",
          display: "block",
        }}
      />
    </span>
  );
}