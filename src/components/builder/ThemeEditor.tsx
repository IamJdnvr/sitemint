"use client";

import { useState } from "react";
import {
  Palette,
  Type,
  Moon,
  Sun,
  Monitor,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fontOptions } from "@/lib/templates";
import type { Website } from "@/types";

const presetColors = [
  { name: "Blue", primary: "#2563EB", secondary: "#EFF6FF" },
  { name: "Green", primary: "#059669", secondary: "#D1FAE5" },
  { name: "Purple", primary: "#7C3AED", secondary: "#EDE9FE" },
  { name: "Red", primary: "#DC2626", secondary: "#FEE2E2" },
  { name: "Orange", primary: "#EA580C", secondary: "#FFEDD5" },
  { name: "Pink", primary: "#DB2777", secondary: "#FCE7F3" },
  { name: "Teal", primary: "#0D9488", secondary: "#CCFBF1" },
  { name: "Brown", primary: "#8B4513", secondary: "#FEF3C7" },
];

interface ThemeEditorProps {
  website: Website;
  onUpdate: (updates: Partial<Website>) => void;
}

export function ThemeEditor({ website, onUpdate }: ThemeEditorProps) {
  const [primaryColor, setPrimaryColor] = useState(website.primary_color || "#2563EB");
  const [secondaryColor, setSecondaryColor] = useState(website.secondary_color || "#EFF6FF");
  const [fontFamily, setFontFamily] = useState(website.font_family || "Inter");
  const [buttonStyle, setButtonStyle] = useState<"rounded" | "pill" | "square">(
    website.button_style || "rounded"
  );
  const [darkMode, setDarkMode] = useState(website.dark_mode || false);

  const handleApplyPreset = (preset: typeof presetColors[0]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    onUpdate({
      primary_color: preset.primary,
      secondary_color: preset.secondary,
    });
  };

  const handlePrimaryChange = (value: string) => {
    setPrimaryColor(value);
    onUpdate({ primary_color: value });
  };

  const handleSecondaryChange = (value: string) => {
    setSecondaryColor(value);
    onUpdate({ secondary_color: value });
  };

  const handleFontChange = (value: string) => {
    setFontFamily(value);
    onUpdate({ font_family: value });
  };

  const handleButtonStyleChange = (style: "rounded" | "pill" | "square") => {
    setButtonStyle(style);
    onUpdate({ button_style: style });
  };

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    onUpdate({ dark_mode: newValue });
  };

  return (
    <div className="space-y-6">
      {/* Color Scheme */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider font-semibold">
          <Palette className="w-3.5 h-3.5" />
          Color Scheme
        </Label>
        <div className="flex gap-2 flex-wrap">
          {presetColors.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleApplyPreset(preset)}
              className="group relative w-8 h-8 rounded-full transition-all hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
              }}
              title={preset.name}
            >
              {primaryColor === preset.primary && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white drop-shadow-md" />
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Primary</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg border border-gray-200 shrink-0"
                style={{ backgroundColor: primaryColor }}
              />
              <Input
                value={primaryColor}
                onChange={(e) => handlePrimaryChange(e.target.value)}
                className="font-mono text-sm h-8"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Secondary</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg border border-gray-200 shrink-0"
                style={{ backgroundColor: secondaryColor }}
              />
              <Input
                value={secondaryColor}
                onChange={(e) => handleSecondaryChange(e.target.value)}
                className="font-mono text-sm h-8"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider font-semibold">
          <Type className="w-3.5 h-3.5" />
          Font
        </Label>
        <select
          value={fontFamily}
          onChange={(e) => handleFontChange(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          style={{ fontFamily }}
        >
          {fontOptions.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Button Style */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider font-semibold">
          <Monitor className="w-3.5 h-3.5" />
          Button Style
        </Label>
        <div className="flex gap-2">
          {(["rounded", "pill", "square"] as const).map((style) => (
            <button
              key={style}
              onClick={() => handleButtonStyleChange(style)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                buttonStyle === style
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <div
                className="mx-auto w-16 h-8 bg-gray-900"
                style={{
                  borderRadius:
                    style === "rounded"
                      ? "8px"
                      : style === "pill"
                      ? "999px"
                      : "0px",
                }}
              />
              <span className="text-xs mt-1 block capitalize">{style}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dark Mode */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider font-semibold">
          {darkMode ? (
            <Moon className="w-3.5 h-3.5" />
          ) : (
            <Sun className="w-3.5 h-3.5" />
          )}
          Theme Mode
        </Label>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setDarkMode(false);
              onUpdate({ dark_mode: false });
            }}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all border-2 flex items-center justify-center gap-2 ${
              !darkMode
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <Sun className="w-4 h-4" />
            Light
          </button>
          <button
            onClick={() => {
              setDarkMode(true);
              onUpdate({ dark_mode: true });
            }}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all border-2 flex items-center justify-center gap-2 ${
              darkMode
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <Moon className="w-4 h-4" />
            Dark
          </button>
        </div>
      </div>
    </div>
  );
}
