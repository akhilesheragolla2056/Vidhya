import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BadgeCheck, XCircle, Printer } from 'lucide-react'
import api from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const formatDate = value => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString()
}

export default function CertificateVerification() {
  const { certificateId } = useParams()
  const { data: certificate, isLoading, error } = useQuery({
    queryKey: ['certificate-verification', certificateId],
    queryFn: async () => {
      const response = await api.get(`/progress/${certificateId}`)
      return response.data.data
    },
    retry: false,
  })

  if (isLoading) return <LoadingSpinner />

  const isVerified = Boolean(certificate?.isVerified)

  return (
    <main className="container-custom flex min-h-[70vh] items-center justify-center py-12">
      <section className="certificate-print-sheet w-full max-w-3xl rounded-2xl border-8 border-amber-800 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-7 text-center shadow-xl md:p-12">
        <div className="mb-5 flex items-center justify-center gap-4 text-amber-700" aria-hidden="true">
          <span className="h-1 w-20 bg-current" />★<span className="h-1 w-20 bg-current" />
        </div>
        {isVerified ? (
          <BadgeCheck className="mx-auto mb-4 text-emerald-700" size={42} />
        ) : (
          <XCircle className="mx-auto mb-4 text-red-700" size={42} />
        )}
        <h1 className="mb-2 text-3xl font-bold text-amber-950 md:text-4xl">
          {error ? 'Certificate not found' : isVerified ? 'Verified certificate' : 'Certificate not verified'}
        </h1>
        {certificate && (
          <>
            <p className="mb-8 text-amber-800">Certificate of course completion</p>
            <p className="mb-2 text-sm text-amber-800">Awarded to</p>
            <p className="mb-6 text-2xl font-bold text-amber-950">
              {certificate.user?.name || 'Learner'}
            </p>
            <p className="mb-2 text-sm text-amber-800">For completing</p>
            <p className="mb-7 text-xl font-semibold text-amber-950">
              {certificate.course?.title || 'Course'}
            </p>
            <dl className="mx-auto mb-8 grid max-w-xl gap-3 text-sm text-amber-900 sm:grid-cols-2">
              <div>
                <dt className="font-semibold">Certificate number</dt>
                <dd className="font-mono">{certificate.certificateNumber}</dd>
              </div>
              <div>
                <dt className="font-semibold">Completion date</dt>
                <dd>{formatDate(certificate.completionDate)}</dd>
              </div>
              <div>
                <dt className="font-semibold">Course test score</dt>
                <dd>{certificate.testScore}%</dd>
              </div>
              <div>
                <dt className="font-semibold">Verification code</dt>
                <dd className="font-mono">{certificate.verificationCode}</dd>
              </div>
            </dl>
          </>
        )}
        {error && <p className="mb-6 text-text-secondary">This link does not match a certificate in Vidhya.</p>}
        <div className="certificate-print-actions flex flex-wrap justify-center gap-3">
          {certificate && isVerified && (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark"
            >
              <Printer size={18} /> Print certificate
            </button>
          )}
          <Link to="/courses" className="inline-flex items-center rounded-lg bg-white px-5 py-3 font-semibold text-primary hover:bg-amber-100">
            Browse courses
          </Link>
        </div>
      </section>
    </main>
  )
}
