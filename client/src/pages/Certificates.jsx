import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Share2, Eye } from 'lucide-react'
import api from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Certificate Preview Component
function CertificatePreview({ certificate, onClose }) {
  const handleDownload = () => {
    // In a real app, this would generate a PDF
    console.log('Downloading certificate:', certificate._id)
    alert('Certificate download functionality would be implemented with PDF generation library')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Certificate Design */}
        <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-12 border-8 border-amber-800">
          <div className="text-center">
            {/* Decorative elements */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="w-24 h-1 bg-amber-700"></div>
              <span className="text-4xl">⭐</span>
              <div className="w-24 h-1 bg-amber-700"></div>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold text-amber-900 mb-2">Certificate</h1>
            <p className="text-amber-700 text-lg mb-8">of Completion</p>

            {/* Content */}
            <p className="text-amber-800 mb-2">This is proudly presented to</p>
            <p className="text-3xl font-bold text-amber-900 mb-6">
              {certificate.user?.name || 'Student'}
            </p>

            <p className="text-amber-800 mb-2">For successfully completing the course</p>
            <p className="text-2xl font-bold text-amber-900 mb-8">{certificate.course?.title}</p>

            {/* Details */}
            <div className="mb-8 space-y-2 text-amber-800">
              <p>
                Completion Date:{' '}
                <span className="font-semibold">
                  {new Date(certificate.completionDate).toLocaleDateString()}
                </span>
              </p>
              <p>
                Certificate Number:{' '}
                <span className="font-mono font-semibold">{certificate.certificateNumber}</span>
              </p>
              <p>
                Test Score: <span className="font-semibold">{certificate.testScore}%</span>
              </p>
            </div>

            {/* Signature line */}
            <div className="flex justify-around mt-12 pt-8 border-t-2 border-amber-700">
              <div className="text-center">
                <p className="text-amber-800 font-semibold">Vidhya Team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 p-6 bg-gray-50 border-t">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all"
          >
            <Download size={20} />
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 text-text-primary rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null)

  const { data: certificatesData, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const res = await api.get('/progress/certificates/user')
      return res.data.data || []
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-text-primary mb-4">My Certificates</h1>
          <p className="text-xl text-text-secondary">
            Showcase your achievements and learning progress
          </p>
        </div>

        {certificatesData && certificatesData.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificatesData.map(cert => (
              <div
                key={cert._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105"
              >
                {/* Certificate Preview Thumbnail */}
                <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-8 relative">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-900 mb-2">Certificate</p>
                    <p className="text-amber-700 font-semibold text-sm">of Completion</p>
                    <p className="text-amber-800 mt-4 text-xs max-h-12 overflow-hidden">
                      {cert.course?.title}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 text-3xl">⭐</div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="font-bold text-text-primary mb-2">{cert.course?.title}</h3>
                  <div className="space-y-2 text-sm text-text-secondary mb-6">
                    <p>
                      <span className="font-semibold">Issued:</span>{' '}
                      {new Date(cert.issueDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Score:</span> {cert.testScore}%
                    </p>
                    <p className="text-xs font-mono text-gray-500">{cert.certificateNumber}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-primary rounded-lg font-semibold hover:bg-blue-200 transition-all text-sm"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => {
                        console.log('Download cert:', cert._id)
                        alert('PDF download functionality would be implemented')
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-all text-sm"
                    >
                      <Download size={16} />
                      Download
                    </button>
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/certificates/${cert._id}`
                        navigator.clipboard.writeText(url)
                        alert('Certificate link copied to clipboard!')
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition-all text-sm"
                    >
                      <Share2 size={16} />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📜</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">No Certificates Yet</h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Complete your courses and pass the mock tests to earn certificates. Keep learning and
              achieving!
            </p>
            <a
              href="/courses"
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all"
            >
              Browse Courses
            </a>
          </div>
        )}
      </div>

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <CertificatePreview certificate={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </div>
  )
}

export default Certificates
