"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const NewsletterSection = () => {
  return (
    <section className="rounded-3xl bg-zinc-900 px-6 py-16 dark:bg-zinc-900/50 sm:px-12 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
          <Mail className="h-6 w-6 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Stay updated with the latest stories.
        </h2>
        
        <p className="mt-4 text-lg leading-8 text-zinc-400">
          No spam. Just high-quality technical articles and tutorials delivered straight to your inbox once a week.
        </p>

        <form className="mt-10 flex flex-col gap-x-4 gap-y-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 outline-none"
          />
          <Button type="submit" variant="default" className="bg-white text-black hover:bg-zinc-200">
            Subscribe
          </Button>
        </form>
        
        <p className="mt-4 text-xs text-zinc-500">
          By subscribing, you agree to our Privacy Policy and provide consent to receive updates.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;