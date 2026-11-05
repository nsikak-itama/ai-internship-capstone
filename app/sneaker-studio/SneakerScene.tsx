"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";



const SneakerCanvas = dynamic(
  () => import("./SneakerCanvas"),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        style={{
          width: "100%",
          height: "400px",
          display: "grid",
          placeItems: "center",
          backgroundColor: "#f3f4f6",
        }}
      >
        Loading 3D sneaker...
      </div>
    ),
  }
);



export default function SneakerScene() {
  const [selectedColor, setSelectedColor] = useState("#2563eb");
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setReduceMotion(mediaQuery.matches);
    };

    updatePreference();

    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);
  return (
    <div style={{ width: "100%", height: "400px" }}>
      {reduceMotion ? (
        <img
              src="/images/sneaker-fallback.webp "
              alt="Blue athletic sneaker product preview"
              style={{
                width: "100%",
                height: "400px",
                objectFit: "contain",
                backgroundColor: "#f3f4f6",
              }}
            />
      ) : (
      <SneakerCanvas color={selectedColor} />

      )}

      {reduceMotion? (
        <p style={{ textAlign: "center", padding: "12px" }}>
    Interactive color customization is unavailable in static preview mode.
    Enable animations to explore sneaker colors in 3D.
  </p>
      ) : (

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          padding: "16px",
          flexWrap: "wrap",
        }}
      >
        {[
          { name: "Blue", value: "#2563eb" },
          { name: "Red", value: "#dc2626" },
          { name: "Black", value: "#171717" },
          { name: "White", value: "#f5f5f5" },
        ].map((colorOption) => (
          <button
            key={colorOption.value}
            type="button"
            aria-label={`Change sneaker color to ${colorOption.name}`}
            onClick={() => setSelectedColor(colorOption.value)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: colorOption.value,
              border:
                selectedColor === colorOption.value
                  ? "3px solid #64748b"
                  : "1px solid #9ca3af",
              cursor: "pointer",
            }}
          >
            {colorOption.name}
          </button>
        ))}
      </div>
      )}
    </div>
  );
}


