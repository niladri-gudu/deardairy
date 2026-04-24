interface VerifyEmailProps {
  name: string;
  url: string;
}

export function VerifyEmail({ name, url }: VerifyEmailProps) {
  return (
    <div
      style={{
        fontFamily: "ui-monospace, monospace",
        backgroundColor: "#020617",
        color: "#e4e4e7",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          backgroundColor: "#09090b",
          border: "1px solid #27272a",
          borderRadius: "16px",
          padding: "40px",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <span
            style={{
              fontSize: "22px",
              fontWeight: "900",
              color: "#f4f4f5",
              letterSpacing: "-1px",
            }}
          >
            withink.
          </span>
        </div>

        <h1
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#f4f4f5",
            margin: "0 0 8px 0",
            letterSpacing: "-0.5px",
          }}
        >
          Initialize your sanctuary
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "#a1a1aa",
            margin: "0 0 32px 0",
            lineHeight: "1.6",
          }}
        >
          Hey {name}, thanks for joining. Click the button below to verify your
          email address and start journaling.
        </p>

        <a
          href={url}
          style={{
            display: "inline-block",
            backgroundColor: "#f4f4f5",
            color: "#09090b",
            fontWeight: "600",
            fontSize: "14px",
            padding: "12px 28px",
            borderRadius: "10px",
            textDecoration: "none",
          }}
        >
          Verify email
        </a>

        <div style={{ borderTop: "1px solid #27272a", margin: "32px 0" }} />

        <p style={{ fontSize: "12px", color: "#52525b", margin: 0 }}>
          This link expires in 24 hours. Welcome to the archives.
        </p>
      </div>
    </div>
  );
}
