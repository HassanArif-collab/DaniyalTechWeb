"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Phone, MapPin, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = `Hi! My name is ${formData.name}. ${formData.message} (${formData.email})`;
    window.open(
      `https://wa.me/923001234567?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank"
    );
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-terracotta">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal font-medium">Contact Us</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mb-4">Contact Us</h1>
        <p className="text-muted-foreground mb-10 text-lg">
          Have a question or need help? Reach out to us through any of the channels below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
            <h2 className="font-semibold text-charcoal text-lg mb-6">Send us a Message</h2>
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-sage-green/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-sage-green" />
                </div>
                <h3 className="font-semibold text-charcoal text-lg">Message Sent!</h3>
                <p className="text-muted-foreground mt-2">Your message has been forwarded to WhatsApp. We will get back to you soon!</p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-4 border-terracotta text-terracotta">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-deep-slate mb-1.5 block">Name</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="border-soft-clay/40 focus:border-terracotta focus:ring-terracotta/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-deep-slate mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="border-soft-clay/40 focus:border-terracotta focus:ring-terracotta/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-deep-slate mb-1.5 block">Message</label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    rows={4}
                    className="border-soft-clay/40 focus:border-terracotta focus:ring-terracotta/20"
                  />
                </div>
                <Button type="submit" className="w-full bg-terracotta hover:bg-terracotta-hover text-white rounded-xl h-11">
                  <Send className="mr-2 h-4 w-4" />
                  Send via WhatsApp
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <a
              href="https://wa.me/923001234567?text=Hi! I want to inquire about your products."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-5 bg-sage-green/5 border border-sage-green/20 rounded-xl hover:bg-sage-green/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-sage-green/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-6 w-6 text-sage-green" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal">WhatsApp</h3>
                <p className="text-sm text-muted-foreground mt-1">+92 300 1234567</p>
                <p className="text-xs text-sage-green font-medium mt-1">Click to chat now</p>
              </div>
            </a>

            <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
              <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                <Phone className="h-6 w-6 text-terracotta" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal">Phone</h3>
                <p className="text-sm text-muted-foreground mt-1">+92 300 1234567</p>
                <p className="text-xs text-muted-foreground">Mon-Sat: 10AM - 8PM PKT</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
              <div className="w-12 h-12 rounded-full bg-muted-gold/10 flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-muted-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal">Email</h3>
                <p className="text-sm text-muted-foreground mt-1">info@daniyaltech.pk</p>
                <p className="text-xs text-muted-foreground">We reply within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
              <div className="w-12 h-12 rounded-full bg-soft-clay/30 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-deep-slate" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal">Location</h3>
                <p className="text-sm text-muted-foreground mt-1">Lahore, Punjab, Pakistan</p>
                <p className="text-xs text-muted-foreground">Online store — delivery nationwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
