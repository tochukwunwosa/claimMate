"use client"

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-32">
      <h1 className="text-4xl font-bold text-primary mb-8">Privacy Policy</h1>

      <div className="prose prose-lg">
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Introduction</h2>
          <p className="text-muted-foreground">
            {`ClaimMate ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered claims drafting service.`}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold text-primary mb-2">2.1 Information You Provide</h3>
          <ul className="list-disc pl-6 text-muted-foreground mb-4">
            <li>Account information (name, email, password)</li>
            <li>Professional information (company, role, license numbers)</li>
            <li>Claim-related information and documents</li>
            <li>Payment information</li>
          </ul>

          <h3 className="text-xl font-semibold text-primary mb-2">2.2 Automatically Collected Information</h3>
          <ul className="list-disc pl-6 text-muted-foreground mb-4">
            <li>Device and browser information</li>
            <li>Usage data and analytics</li>
            <li>Cookies and similar technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-muted-foreground mb-4">
            <li>To provide and improve our services</li>
            <li>To process your claims and generate drafts</li>
            <li>To communicate with you about our services</li>
            <li>To ensure security and prevent fraud</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">4. Data Security</h2>
          <p className="text-muted-foreground mb-4">
            We implement appropriate technical and organizational security measures to protect your information, including:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Secure data storage practices</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">5. Data Retention</h2>
          <p className="text-muted-foreground">
            We retain your information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your data by contacting our support team.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">6. Your Rights</h2>
          <p className="text-muted-foreground mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">7. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            Email: <a href="mailto:getclaimmate@gmail.com" className="text-primary hover:text-primary/90 transition-colors underline">getclaimmate@gmail.com</a>
            <br />
            Address: Unit 1, 123 Main St, Anytown, USA
          </p>
        </section>
      </div>
    </div>
  )
} 