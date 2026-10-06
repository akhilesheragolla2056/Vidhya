import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Award, BookOpen, CheckCircle2, Clock3, Link2, Medal, Users } from 'lucide-react'
import { parentLinksAPI } from '../services/api'

const requestError = error => error?.response?.data?.message || 'Please try again in a moment.'

export default function ParentDashboard() {
  const queryClient = useQueryClient()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { data: children = [], isLoading, isError } = useQuery({
    queryKey: ['parent-linked-children'],
    queryFn: async () => (await parentLinksAPI.getChildren()).data?.data || [],
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
  })
  const connectChild = useMutation({
    mutationFn: () => parentLinksAPI.connect(code),
    onSuccess: async response => {
      setCode('')
      setErrorMessage('')
      setMessage(response.data?.message || 'Student connected to your parent account.')
      await queryClient.invalidateQueries({ queryKey: ['parent-linked-children'] })
    },
    onError: error => {
      setMessage('')
      setErrorMessage(requestError(error))
    },
  })

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-custom py-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-700">Family overview</p>
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Parent dashboard</h1>
          <p className="max-w-2xl text-slate-600">Connect to a student account to view their course progress, completed lessons, achievements, badges, and certificates.</p>
        </div>
      </header>

      <div className="container-custom space-y-8 py-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700"><Link2 size={21} /></div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Connect a student</h2>
            <p className="mb-5 text-sm leading-6 text-slate-600">Ask the student to sign in and open Profile → Family connection. They can create a one-time code for you to enter here.</p>
            <form
              onSubmit={event => {
                event.preventDefault()
                setMessage('')
                setErrorMessage('')
                connectChild.mutate()
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="student-link-code" className="sr-only">Student connection code</label>
              <input
                id="student-link-code"
                required
                minLength={10}
                maxLength={10}
                value={code}
                onChange={event => setCode(event.target.value.replace(/[^a-f\d]/gi, '').slice(0, 10).toUpperCase())}
                placeholder="10-character student code"
                className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono tracking-[0.18em] outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
              <button type="submit" disabled={connectChild.isPending || code.length !== 10} className="rounded-xl bg-indigo-700 px-5 py-3 font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50">
                {connectChild.isPending ? 'Connecting…' : 'Connect student'}
              </button>
            </form>
            {message && <p role="status" className="mt-3 text-sm font-medium text-emerald-700">{message}</p>}
            {errorMessage && <p role="alert" className="mt-3 text-sm font-medium text-rose-700">{errorMessage}</p>}
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Users size={21} /></div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Private family access</h2>
            <p className="text-sm leading-6 text-slate-600">Only student accounts can create a connection code, and the code works once. Your dashboard only displays students who have shared a code with this parent account.</p>
          </div>
        </section>

        <section aria-labelledby="children-heading">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-700">Linked student accounts</p>
              <h2 id="children-heading" className="text-2xl font-bold text-slate-900">Learning progress</h2>
            </div>
            {!isLoading && <span className="text-sm text-slate-500">{children.length} connected</span>}
          </div>
          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">Loading student progress…</div>
          ) : isError ? (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800">Progress could not be loaded. Refresh the page to try again.</div>
          ) : children.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <Users size={30} className="mx-auto mb-3 text-slate-400" />
              <h3 className="font-semibold text-slate-900">No students connected yet</h3>
              <p className="mt-1 text-sm text-slate-600">Enter a code shared from a student profile to see their learning progress here.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {children.map(child => (
                <article key={child.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-5 border-b border-slate-100 p-6 md:flex-row md:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-100 text-xl font-bold text-indigo-800">
                        {child.avatar ? <img src={child.avatar} alt="" className="h-full w-full object-cover" /> : child.name?.charAt(0)?.toUpperCase() || 'S'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-xl font-bold text-slate-900">{child.name}</h3>
                        <p className="text-sm text-slate-500">Student account</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <ProgressStat icon={BookOpen} label="Courses finished" value={child.progress?.coursesCompleted || 0} />
                      <ProgressStat icon={CheckCircle2} label="Lessons done" value={child.progress?.lessonsCompleted || 0} />
                      <ProgressStat icon={Clock3} label="Hours learned" value={child.progress?.hoursLearned || 0} />
                      <ProgressStat icon={Award} label="Certificates" value={child.progress?.certificatesEarned || 0} />
                    </div>
                  </div>
                  <div className="grid gap-6 p-6 lg:grid-cols-2">
                    <div>
                      <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900"><BookOpen size={17} className="text-indigo-700" /> Course progress</h4>
                      {child.courses?.length ? (
                        <div className="space-y-4">
                          {child.courses.map(course => (
                            <div key={String(course.id)}>
                              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                                <span className="truncate font-medium text-slate-800">{course.title}</span>
                                <span className="shrink-0 text-slate-500">{course.progress}%</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${Math.max(0, Math.min(100, course.progress))}%` }} /></div>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-sm text-slate-500">No course progress recorded yet.</p>}
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-900"><Medal size={17} className="text-amber-600" /> Badges and achievements</h4>
                        {child.badges?.length ? (
                          <div className="flex flex-wrap gap-2">{child.badges.map((badge, index) => <span key={`${badge}-${index}`} className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">{typeof badge === 'string' ? badge.replace(/[-_]/g, ' ') : badge.title || 'Achievement'}</span>)}</div>
                        ) : <p className="text-sm text-slate-500">No badges earned yet.</p>}
                      </div>
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-900"><Award size={17} className="text-emerald-700" /> Certificates</h4>
                        {child.certificates?.length ? (
                          <ul className="space-y-2">{child.certificates.map(certificate => <li key={certificate._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm"><span className="font-medium text-slate-800">{certificate.course?.title || 'Course certificate'}</span><span className="font-mono text-xs text-slate-500">{certificate.certificateNumber}</span></li>)}</ul>
                        ) : <p className="text-sm text-slate-500">No certificates earned yet.</p>}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function ProgressStat({ icon: Icon, label, value }) {
  return (
    <div className="min-w-[90px] rounded-xl bg-slate-50 px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-indigo-700"><Icon size={14} /><span className="text-lg font-bold text-slate-900">{value}</span></div>
      <span className="text-[11px] leading-tight text-slate-500">{label}</span>
    </div>
  )
}
