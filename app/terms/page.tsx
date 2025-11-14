export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="bg-white shadow rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using WorkQit, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Use of Service</h2>
            <p className="text-gray-600 mb-2">You agree to use WorkQit only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Use the service in any way that violates any applicable law or regulation</li>
              <li>Impersonate or attempt to impersonate another user or person</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use of the service</li>
              <li>Use any automated system to access the service</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">User Accounts</h2>
            <p className="text-gray-600">
              When you create an account with us, you must provide accurate, complete, and current 
              information. You are responsible for safeguarding your password and for all activities 
              that occur under your account.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Job Postings and Applications</h2>
            <p className="text-gray-600 mb-2">For Employers:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>You are responsible for the accuracy of job postings</li>
              <li>You must comply with all applicable employment laws</li>
              <li>You agree not to discriminate in hiring practices</li>
            </ul>
            <p className="text-gray-600 mt-3 mb-2">For Job Seekers:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>You must provide accurate information in your profile and applications</li>
              <li>You are responsible for the content of your resume and cover letters</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Intellectual Property</h2>
            <p className="text-gray-600">
              The service and its original content, features, and functionality are owned by WorkQit 
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Limitation of Liability</h2>
            <p className="text-gray-600">
              WorkQit shall not be liable for any indirect, incidental, special, consequential, or 
              punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify or replace these Terms at any time. We will provide notice 
              of any changes by posting the new Terms on this page.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms, please contact us at legal@workqit.com
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
