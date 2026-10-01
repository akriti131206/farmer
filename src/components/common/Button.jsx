export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  as = "button",
  ...rest
}) {
  const Tag = as;
  const variantClass =
    variant === "outline" ? "btn-agri-outline" : variant === "ghost" ? "btn-agri-ghost" : "btn-agri-primary";
  const sizeClass = size === "sm" ? "btn-agri-sm" : "";

  return (
    <Tag className={`btn-agri ${variantClass} ${sizeClass} ${className}`} {...rest}>
      {icon}
      {children}
    </Tag>
  );
}
