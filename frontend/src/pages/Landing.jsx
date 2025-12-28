import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black mb-6 gradient-text">
            Send a Message to the Future
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed">
            Write something meaningful today — deliver it when the time is
            right.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="btn">
              Get Started Free
            </Link>
            <Link to="/signin" className="btn ">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Time Capsule?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "📅",
              title: "Smart Scheduling",
              desc: "Choose any future date and we'll deliver your message automatically.",
            },
            {
              icon: "🔒",
              title: "Privacy First",
              desc: "Add optional password protection to keep your messages secure.",
            },
            {
              icon: "📊",
              title: "Live Tracking",
              desc: "Monitor pending capsules with live countdown timers.",
            },
          ].map((f, i) => (
            <div key={i} className="glass p-8 text-center">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="glass p-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to send a message to the future?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Join users creating meaningful time capsules.
          </p>
          <Link to="/signup" className="btn">
            Start Now
          </Link>
        </div>
      </section>
    </div>
  );
}
