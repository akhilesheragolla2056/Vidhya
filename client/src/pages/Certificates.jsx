import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { AlertCircle, Download, Eye, Share2, X } from 'lucide-react'
import api from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { coursesData } from '../data/coursesData'
import { getCourseProgress } from '../utils/progressTracker'
import downloadCourseCertificate from '../utils/downloadCourseCertificate'

const formatDate = value => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString()
}

function CertificatePreview({ certificate, userName, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-preview-title"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <article className="certificate-print-sheet border-8 border-amber-800 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-8 md:p-12">
          <div className="text-center">
            <div className="mb-6 flex items-center justify-center gap-4" aria-hidden="true">
              <div className="h-1 w-16 bg-amber-700 md:w-24" />
              <span className="text-4xl">★</span>
              <div className="h-1 w-16 bg-amber-700 md:w-24" />
            </div>
            <h1 id="certificate-preview-title" className="mb-2 text-4xl font-bold text-amber-900 md:text-5xl">
              Certificate
            </h1>
            <p className="mb-8 text-lg text-amber-700">of Completion</p>
            <p className="mb-2 text-amber-800">Presented to</p>
            <p className="mb-6 text-3xl font-bold text-amber-900">
              {certificate.user?.name || userName || 'Learner'}
            </p>
            <p className="mb-2 text-amber-800">For successfully completing</p>
            <p className="mb-8 text-2xl font-bold text-amber-900">
              {certificate.course?.title || 'Course'}
            </p>
            <div className="mb-8 space-y-2 text-amber-800">
              <p>
                Completion date: <span className="font-semibold">{formatDate(certificate.completionDate || certificate.issueDate)}</span>
              </p>
              <p>
                Certificate number: <span className="font-mono font-semibold">{certificate.certificateNumber}</span>
              </p>
              <p>
                Test score: <span className="font-semibold">{certificate.testScore}%</span>
              </p>
              {certificate.verificationCode && (
                <p>
                  Verification code: <span className="font-mono font-semibold">{certificate.verificationCode}</span>
                </p>
              )}
            </div>
            <div className="mt-12 border-t-2 border-amber-700 pt-8">
              <p className="font-semibold text-amber-800">Vidhya Learning</p>
            </div>
          </div>
        </article>
        <div className="certificate-print-actions flex flex-wrap gap-3 border-t bg-gray-50 p-5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            <Download size={18} /> Print / Save as PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-5 py-3 font-semibold text-text-primary transition hover:bg-gray-300"
          >
            <X size={18} /> Close
          </button>
        </div>
      </div>
    </div>
  )
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const input = document.createElement('textarea')
  input.value = text
  input.setAttribute('readonly', '')
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.appendChild(input)
  input.select()
  const copied = document.execCommand('copy')
  input.remove()
  if (!copied) throw new Error('Clipboard is unavailable')
}

function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null)
  const [notice, setNotice] = useState('')
  const currentUser = useSelector(state => state.user.currentUser)
  const userName = currentUser?.name || currentUser?.email?.split('@')[0] || 'Learner'
  const userKey = currentUser?._id || currentUser?.id || currentUser?.email || 'learner'

  const {
    data: certificates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['certificates', userKey],
    refetchOnMount: 'always',
    queryFn: async () => {
      const localCertificates = coursesData.flatMap(course => {
        const courseProgress = getCourseProgress(course.id)
        const quizScores = course.playlist.map(lesson => courseProgress.mcqScores[lesson.id])
        const allQuizzesPassed = quizScores.length > 0 && quizScores.every(score => score?.percentage >= 60)
        if (!allQuizzesPassed) return []

        const completionDate = courseProgress.completedAt || courseProgress.lastAccessed || new Date().toISOString()
        const testScore = Math.round(
          quizScores.reduce((total, score) => total + score.percentage, 0) / quizScores.length
        )

        return [{
          _id: `local-${course.id}`,
          localOnly: true,
          user: { name: userName },
          course: { _id: course.id, title: course.title },
          issueDate: completionDate,
          completionDate,
          testScore,
          certificateNumber: `LOCAL-${course.id.toUpperCase()}`,
        }]
      })

      let serverCertificates = []
      try {
        const response = await api.get('/progress/certificates/user')
        serverCertificates = Array.isArray(response.data.data) ? response.data.data : []
      } catch (requestError) {
        if (!localCertificates.length) throw requestError
      }

      const serverCourseIds = new Set(serverCertificates.map(certificate =>
        String(certificate.course?._id || certificate.course)
      ))
      return [
        ...serverCertificates,
        ...localCertificates.filter(certificate => !serverCourseIds.has(String(certificate.course._id))),
      ]
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 md:mb-12">
          <h1 className="mb-3 text-3xl font-bold text-text-primary md:text-5xl">My Certificates</h1>
          <p className="text-lg text-text-secondary">View, download, and print your course achievements.</p>
        </header>

        {notice && (
          <p role="status" className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {notice}
          </p>
        )}

        {error ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <AlertCircle className="mx-auto mb-3 text-red-600" size={32} />
            <h2 className="mb-2 text-xl font-bold text-text-primary">Certificates could not be loaded</h2>
            <p className="text-text-secondary">Check your connection and try again.</p>
          </div>
        ) : certificates.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map(certificate => (
              <article
                key={certificate._id}
                className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-7">
                  <div className="text-center">
                    <p className="mb-1 text-3xl font-bold text-amber-900">Certificate</p>
                    <p className="text-sm font-semibold text-amber-700">of Completion</p>
                    <p className="mt-4 line-clamp-2 text-sm text-amber-800">
                      {certificate.course?.title || 'Completed course'}
                    </p>
                  </div>
                  <div className="absolute right-3 top-2 text-2xl text-amber-700" aria-hidden="true">★</div>
                </div>
                <div className="p-5">
                  <h2 className="mb-3 font-bold text-text-primary">
                    {certificate.course?.title || 'Completed course'}
                  </h2>
                  <div className="mb-5 space-y-2 text-sm text-text-secondary">
                    <p>Issued: {formatDate(certificate.issueDate || certificate.completionDate)}</p>
                    <p>Test score: {certificate.testScore}%</p>
                    <p className="break-all font-mono text-xs">{certificate.certificateNumber}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCert(certificate)}
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-50 px-2 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-100"
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCert(certificate)}
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-50 px-2 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
                    >
                      <Download size={16} /> Print
                    </button>
                    {certificate.localOnly ? (
                      <button
                        type="button"
                        onClick={() => downloadCourseCertificate({
                          learnerName: certificate.user?.name || userName,
                          courseTitle: certificate.course?.title,
                          completedAt: certificate.completionDate || certificate.issueDate,
                        })}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-violet-50 px-2 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100"
                      >
                        <Download size={16} /> Download
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={async () => {
                          const url = `${window.location.origin}/certificates/${certificate._id}`
                          try {
                            await copyText(url)
                            setNotice('Verification link copied to the clipboard.')
                          } catch {
                            setNotice(`Copy this verification link: ${url}`)
                          }
                        }}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-violet-50 px-2 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100"
                      >
                        <Share2 size={16} /> Share
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-100 bg-white p-8 text-center shadow-sm md:p-12">
            <div className="mb-4 text-5xl" aria-hidden="true">▤</div>
            <h2 className="mb-2 text-2xl font-bold text-text-primary">No certificates yet</h2>
            <p className="mx-auto mb-6 max-w-md text-text-secondary">
              Pass all lesson quizzes in a course and its certificate will appear here.
            </p>
            <Link to="/courses" className="inline-flex rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">
              Browse Courses
            </Link>
          </div>
        )}
      </div>

      {selectedCert && (
        <CertificatePreview
          certificate={selectedCert}
          userName={currentUser?.name}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </main>
  )
}

export default Certificates
