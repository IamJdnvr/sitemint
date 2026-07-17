"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Layout,
  Paintbrush,
  Globe,
  Zap,
  Shield,
  Smartphone,
  Check,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SiteMint</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
              <Link href="#templates" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Templates</Link>
              {user ? (
                <Link href="/dashboard"><Button>Dashboard</Button></Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/login"><Button variant="ghost">Sign In</Button></Link>
                  <Link href="/auth/register"><Button>Get Started Free</Button></Link>
                </div>
              )}
            </div>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-3">
              <Link href="#features" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="#templates" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>Templates</Link>
              {user ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}><Button className="w-full">Dashboard</Button></Link>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}><Button variant="outline" className="w-full">Sign In</Button></Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}><Button className="w-full">Get Started Free</Button></Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        <motion.div className="max-w-4xl mx-auto text-center relative" variants={stagger} initial="initial" animate="animate">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-sm text-blue-600 font-medium mb-8">
            <Zap className="w-4 h-4" /> No-code website builder
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Build a Beautiful<br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Website in Minutes</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            No coding required. Choose a template, customize with drag-and-drop, and publish your professional website today.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? "/dashboard" : "/auth/register"}>
              <Button size="xl" className="text-base gap-2">Start Building for Free <ArrowRight className="w-5 h-5" /></Button>
            </Link>
            <Link href="#features"><Button size="xl" variant="outline" className="text-base">See How It Works</Button></Link>
          </motion.div>
          <motion.div variants={fadeInUp} className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> No credit card</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> Free templates</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> Publish instantly</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features designed for non-technical users</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Layout, title: "Drag & Drop Builder", description: "Intuitive visual editor. Just drag sections, drop them, and customize." },
              { icon: Paintbrush, title: "Beautiful Templates", description: "Start with professionally designed templates for any business type." },
              { icon: Globe, title: "Instant Publishing", description: "Publish your site with one click. Get your own sitemint.app subdomain." },
              { icon: Smartphone, title: "Fully Responsive", description: "Your site looks perfect on desktop, tablet, and mobile devices." },
              { icon: Zap, title: "Autosave", description: "Never lose your work. Changes are saved automatically every 15 seconds." },
              { icon: Shield, title: "SEO Optimized", description: "Built-in SEO tools help your site rank higher in search results." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Professional Templates</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose from 8 expertly designed templates for your business</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Restaurant", emoji: "🍽️", color: "from-amber-500 to-orange-600" },
              { name: "Coffee Shop", emoji: "☕", color: "from-amber-700 to-amber-900" },
              { name: "Salon & Spa", emoji: "💇", color: "from-purple-500 to-pink-600" },
              { name: "Portfolio", emoji: "🎨", color: "from-blue-500 to-indigo-600" },
              { name: "Freelancer", emoji: "💻", color: "from-emerald-500 to-green-600" },
              { name: "Agency", emoji: "🚀", color: "from-violet-500 to-purple-600" },
              { name: "Small Business", emoji: "🏪", color: "from-blue-600 to-blue-800" },
              { name: "Landing Page", emoji: "📄", color: "from-rose-500 to-red-600" },
            ].map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.05 }}
                className="template-card group cursor-pointer"
              >
                <div className={`h-40 rounded-2xl bg-gradient-to-br ${template.color} p-6 flex flex-col justify-between relative overflow-hidden`}>
                  <span className="text-4xl">{template.emoji}</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-4"><h3 className="font-semibold text-gray-900">{template.name}</h3></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Build Your Website?</h2>
          <p className="text-xl text-blue-100 mb-10">Join thousands of small business owners who built their online presence with SiteMint.</p>
          <Link href={user ? "/dashboard" : "/auth/register"}>
            <Button size="xl" className="bg-white text-blue-600 hover:bg-blue-50 text-base gap-2">Get Started Free <ArrowRight className="w-5 h-5" /></Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold text-white">SiteMint</span>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} SiteMint. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
