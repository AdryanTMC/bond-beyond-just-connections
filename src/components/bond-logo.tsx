import bondLogo from "@/assets/bond-logo.png";

type Props = {
  /** "mark" = só o coração; "full" = coração + wordmark "bond" */
  variant?: "mark" | "full";
  /** altura em px */
  size?: number;
  className?: string;
};

/**
 * Logo oficial Bond.
 * - variant="mark": só o coração (recortado via background-position do PNG).
 * - variant="full": coração + wordmark "bond" (PNG completo).
 */
export function BondLogo({ variant = "mark", size = 32, className = "" }: Props) {
  if (variant === "full") {
    return (
      <img
        src={bondLogo}
        alt="Bond"
        loading="eager"
        decoding="async"
        className={`object-contain ${className}`}
        style={{ height: size, width: "auto" }}
      />
    );
  }
  // O PNG original tem o coração na metade superior centralizado.
  // Recortamos via background para isolar só o coração em um quadrado.
  return (
    <span
      aria-label="Bond"
      role="img"
      className={`inline-block bg-no-repeat bg-center ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${bondLogo})`,
        backgroundSize: "210% auto",
        backgroundPosition: "center 22%",
      }}
    />
  );
}