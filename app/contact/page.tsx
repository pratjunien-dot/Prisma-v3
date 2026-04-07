import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center text-center max-w-2xl">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-900">
          <Mail size={32} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Have a question or want to work together? Feel free to reach out to us. This page demonstrates the contact route.
        </p>
      </div>
    </main>
  );
}
