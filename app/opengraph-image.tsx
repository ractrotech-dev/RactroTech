import { ImageResponse } from "next/og";

export const alt = "Ractrotech — Custom Web, App & SaaS Development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#facc15",
          padding: 64,
          border: "12px solid #000",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: "0.35em",
            color: "rgba(0,0,0,0.55)",
            marginBottom: 24,
          }}
        >
          RACTROTECH
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.05,
            color: "#000",
            maxWidth: 900,
          }}
        >
          Custom Web, App & SaaS Development
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            fontWeight: 600,
            color: "rgba(0,0,0,0.75)",
            maxWidth: 800,
          }}
        >
          Websites, apps, stores, SaaS & more — built for founders and businesses.
        </div>
      </div>
    ),
    { ...size },
  );
}
