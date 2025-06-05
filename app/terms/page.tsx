"use client"

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-32">
      <h1 className="text-4xl font-bold text-primary mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg">
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Agreement to Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using ClaimMate's services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">2. Service Description</h2>
          <p className="text-muted-foreground mb-4">
            ClaimMate provides AI-powered insurance claims drafting services. Our service includes:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4">
            <li>AI-assisted claims drafting</li>
            <li>Document management</li>
            <li>Template library access</li>
            <li>Export capabilities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">3. User Responsibilities</h2>
          <p className="text-muted-foreground mb-4">You agree to:</p>
          <ul className="list-disc pl-6 text-muted-foreground mb-4">
            <li>Provide accurate and complete information</li>
            <li>Maintain the confidentiality of your account</li>
            <li>Use the service in compliance with applicable laws</li>
            <li>Review and verify all AI-generated content</li>
            <li>Not misuse or attempt to manipulate the service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">4. Intellectual Property</h2>
          <p className="text-muted-foreground mb-4">
            The service, including its original content, features, and functionality, is owned by ClaimMate and is protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">5. Subscription and Payments</h2>
          <ul className="list-disc pl-6 text-muted-foreground mb-4">
            <li>Subscription fees are billed in advance</li>
            <li>All payments are non-refundable</li>
            <li>You can cancel your subscription at any time</li>
            <li>Price changes will be notified in advance</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">6. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            ClaimMate is not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service. You are responsible for reviewing and verifying all generated content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">7. Service Modifications</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify, suspend, or discontinue any part of our service at any time. We will provide notice of significant changes when possible.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">8. Termination</h2>
          <p className="text-muted-foreground">
            We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">9. Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">10. Contact Information</h2>
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