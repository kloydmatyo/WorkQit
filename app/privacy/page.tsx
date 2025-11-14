export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-white shadow rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Introduction</h2>
            <p className="text-gray-600">
              At WorkQit, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
            <p className="text-gray-600 mb-2">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Name, email address, and contact information</li>
              <li>Resume and professional profile information</li>
              <li>Job application data</li>
              <li>Account credentials</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
            <p className="text-gray-600 mb-2">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process job applications and connect job seekers with employers</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your Rights</h2>
            <p className="text-gray-600 mb-2">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at privacy@workqit.com
            </p>
          </section>
          
          <p className="text-sm text-gray-500 mt-8">
            Last updated: November 14, 2025
          </p>
        </div>
      </div>
    </div>
  )
}
