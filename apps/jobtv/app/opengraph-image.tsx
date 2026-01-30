import { ImageResponse } from "next/og";

// Image metadata
export const alt = "JOBTV - 動画就活情報サイト";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 64,
        background: "linear-gradient(to bottom, #000000, #1a1a1a)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        padding: "80px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "40px"
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: "bold",
            color: "#EF4444",
            marginRight: "20px"
          }}
        >
          JOBTV
        </div>
      </div>
      <div
        style={{
          fontSize: 40,
          textAlign: "center",
          color: "#ffffff",
          maxWidth: "1000px"
        }}
      >
        採用動画配信サービス
      </div>
      <div
        style={{
          fontSize: 28,
          textAlign: "center",
          color: "#999999",
          marginTop: "20px",
          maxWidth: "900px"
        }}
      >
        企業の採用動画を無料で視聴できます
      </div>
    </div>,
    {
      ...size
    }
  );
}
