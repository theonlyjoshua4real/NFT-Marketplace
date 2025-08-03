import React from "react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-brand-pale dark:bg-brand-dark py-16 px-4 flex justify-center">
      <div className="max-w-5xl w-full bg-white dark:bg-brand-dark rounded-2xl shadow-lg p-8 border border-brand-navy/10 dark:border-brand-pale/10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy dark:text-brand-sky mb-8 text-center">Terms of Service</h1>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-brand-navy dark:text-brand-sky mb-2">1. Introduction</h2>
          <p className="text-brand-dark dark:text-brand-pale text-base leading-relaxed">
            Welcome to NFTVerse! By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-brand-navy dark:text-brand-sky mb-2">2. User Obligations</h2>
          <p className="text-brand-dark dark:text-brand-pale text-base leading-relaxed">
            You agree to use NFTVerse in compliance with all applicable laws and regulations. You are responsible for maintaining the security of your account and wallet.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-brand-navy dark:text-brand-sky mb-2">3. Intellectual Property</h2>
          <p className="text-brand-dark dark:text-brand-pale text-base leading-relaxed">
            All content, trademarks, and data on NFTVerse are the property of their respective owners. You may not use, copy, or distribute any content without permission.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-brand-navy dark:text-brand-sky mb-2">4. Disclaimers</h2>
          <p className="text-brand-dark dark:text-brand-pale text-base leading-relaxed">
            NFTVerse is provided "as is" without warranties of any kind. We do not guarantee the accuracy, security, or availability of the platform.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-brand-navy dark:text-brand-sky mb-2">5. Limitation of Liability</h2>
          <p className="text-brand-dark dark:text-brand-pale text-base leading-relaxed">
            NFTVerse and its affiliates are not liable for any damages or losses arising from your use of the platform.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-bold text-brand-navy dark:text-brand-sky mb-2">6. Contact</h2>
          <p className="text-brand-dark dark:text-brand-pale text-base leading-relaxed">
            If you have any questions about these Terms, please contact us at <a href="mailto:support@nftverse.com" className="text-brand-sky underline">support@nftverse.com</a>.
          </p>
        </section>
        <div className="text-xs text-brand-navy/60 dark:text-brand-pale/60 text-center mt-8">
          &copy; {new Date().getFullYear()} NFTVerse. All rights reserved.
        </div>
      </div>
    </div>
  );
}



