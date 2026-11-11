
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

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
  const [show3D, setShow3D] = useState(false);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      {show3D ? (
        <SneakerCanvas color={selectedColor} />
      ) : (
        <div
          style={{
            width: "100%",
            height: "400px",
            display: "grid",
            placeItems: "center",
            backgroundColor: "#f3f4f6",
          }}
        >
          <img
            src="/images/sneaker-fallback.webp"
            alt="Blue athletic sneaker product preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {!show3D ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          <p>View the sneaker in 3D and explore its colours.</p>
          <button
            type="button"
            onClick={() => setShow3D(true)}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "white",
              cursor: "pointer",
            }}
          >
            Load interactive 3D preview
          </button>
        </div>
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
              aria-pressed={selectedColor === colorOption.value}
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
