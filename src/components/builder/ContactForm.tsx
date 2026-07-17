"use client";

import { useState } from "react";

interface ContactFormProps {
  onContactSubmit: (name: string, email: string, phone: string, message: string) => void;
  buttonStyle?: string;
  primaryColor?: string;
}

export function ContactForm({ onContactSubmit, buttonStyle, primaryColor }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const getBtnClass = (defaultClass: string) => {
    const styleMap: Record<string, string> = {
      rounded: "rounded-lg",
      pill: "rounded-full",
      square: "rounded-none",
    };
    const btnStyle = buttonStyle || "rounded";
    return defaultClass.replace(/rounded-\w+/g, styleMap[btnStyle] || "rounded-lg");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    onContactSubmit(name, email, phone, message);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        required
        className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Your Email"
        required
        className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        type="tel"
        placeholder="Phone (optional)"
        className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your Message"
        rows={4}
        required
        className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none"
      />
      <button
        type="submit"
        className={`w-full py-3 text-white font-medium ${getBtnClass("rounded-xl")}`}
        style={{ backgroundColor: primaryColor || "var(--primary-color, #2563EB)" }}
      >
        Send Message
      </button>
    </form>
  );
}
