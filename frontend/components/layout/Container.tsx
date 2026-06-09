type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        paddingLeft: "32px",
        paddingRight: "32px",
      }}
    >
      {children}
    </div>
  );
}
