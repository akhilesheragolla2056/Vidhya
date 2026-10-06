import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, BookOpen, CalendarClock, CheckCircle2, FilePlus2, Plus, Radio, Trash2, Users } from 'lucide-react'
import { classroomAPI, coursesAPI, testsAPI } from '../services/api'

const errorText = error => error?.response?.data?.message || 'Please try again in a moment.'
const makeExamQuestion = () => ({ question: '', options: ['', '', '', ''], correctAnswer: 0 })

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [classTitle, setClassTitle] = useState('Science lesson')
  const [capacity, setCapacity] = useState(100)
  const [scheduledAt, setScheduledAt] = useState('')
  const [courseId, setCourseId] = useState('')
  const [examTitle, setExamTitle] = useState('')
  const [examQuestions, setExamQuestions] = useState([makeExamQuestion()])
  const [examDuration, setExamDuration] = useState(30)
  const [notice, setNotice] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { data: classrooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['teacher-classrooms'],
    queryFn: async () => (await classroomAPI.getMine()).data?.data || [],
    refetchInterval: 15_000,
  })
  const { data: courses = [] } = useQuery({
    queryKey: ['teacher-course-options'],
    queryFn: async () => (await coursesAPI.getAll({ limit: 100 })).data?.data || [],
  })
  const { data: exams = [] } = useQuery({
    queryKey: ['teacher-exams'],
    queryFn: async () => (await testsAPI.getTeacherTests()).data?.data || [],
  })

  const createClassroom = useMutation({
    mutationFn: async () => {
      const payload = { title: classTitle.trim(), settings: { maxParticipants: Number(capacity) } }
      if (scheduledAt) payload.scheduledAt = new Date(scheduledAt).toISOString()
      return classroomAPI.create(payload)
    },
    onSuccess: async response => {
      const scheduled = Boolean(scheduledAt)
      setClassTitle('Science lesson')
      setScheduledAt('')
      setErrorMessage('')
      setNotice(scheduled ? 'Lesson scheduled. Share the classroom code with students.' : 'Classroom ready. Opening the live room…')
      await queryClient.invalidateQueries({ queryKey: ['teacher-classrooms'] })
      await queryClient.invalidateQueries({ queryKey: ['classrooms-mine'] })
      if (!scheduled) navigate(response.data?.data?.joinUrl)
    },
    onError: error => {
      setNotice('')
      setErrorMessage(errorText(error))
    },
  })
  const createExam = useMutation({
    mutationFn: () => testsAPI.create({
      course: courseId,
      title: examTitle.trim(),
      duration: Number(examDuration),
      passingScore: 70,
      questions: examQuestions.map(question => ({
        question: question.question.trim(),
        options: question.options.map(option => option.trim()),
        correctAnswer: Number(question.correctAnswer),
        points: 1,
      })),
    }),
    onSuccess: async () => {
      setExamTitle('')
      setExamQuestions([makeExamQuestion()])
      setNotice('Exam created and published for students.')
      setErrorMessage('')
      await queryClient.invalidateQueries({ queryKey: ['teacher-exams'] })
    },
    onError: error => {
      setNotice('')
      setErrorMessage(errorText(error))
    },
  })

  const now = Date.now()
  const completedLessons = classrooms.filter(room => room.status === 'ended')
  const upcomingLessons = classrooms.filter(room => room.status !== 'ended' && room.scheduledAt && new Date(room.scheduledAt).getTime() > now)
  const liveLessons = classrooms.filter(room => room.status === 'active')
  const otherRooms = classrooms.filter(room => room.status !== 'ended' && (!room.scheduledAt || new Date(room.scheduledAt).getTime() <= now))
  const studentCount = new Set(classrooms.flatMap(room => (room.participants || []).map(person => person.userId))).size

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-custom py-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-700">Teaching workspace</p>
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Teacher dashboard</h1>
          <p className="max-w-2xl text-slate-600">Schedule and run live lessons, review completed classrooms, and publish course exams for your students.</p>
        </div>
      </header>

      <div className="container-custom space-y-8 py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <TeacherStat icon={Radio} label="Live classes" value={liveLessons.length} />
          <TeacherStat icon={CalendarClock} label="Upcoming lessons" value={upcomingLessons.length} />
          <TeacherStat icon={CheckCircle2} label="Completed lessons" value={completedLessons.length} />
          <TeacherStat icon={Users} label="Students reached" value={studentCount} />
        </div>

        {(notice || errorMessage) && <p role={errorMessage ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${errorMessage ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{errorMessage || notice}</p>}

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><Users size={21} /></div>
              <div><h2 className="font-bold text-slate-900">Set up a class</h2><p className="text-sm text-slate-500">Host up to 200 students with chat, shared notes, and optional camera/mic.</p></div>
            </div>
            <form onSubmit={event => { event.preventDefault(); setErrorMessage(''); setNotice(''); createClassroom.mutate() }} className="space-y-4">
              <div>
                <label htmlFor="teacher-class-title" className="mb-1.5 block text-sm font-medium text-slate-700">Lesson title</label>
                <input id="teacher-class-title" required maxLength={120} value={classTitle} onChange={event => setClassTitle(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="teacher-capacity" className="mb-1.5 block text-sm font-medium text-slate-700">Student capacity</label>
                  <select id="teacher-capacity" value={capacity} onChange={event => setCapacity(Number(event.target.value))} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-600">
                    {[50, 100, 150, 200].map(size => <option key={size} value={size}>{size} students</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="teacher-class-time" className="mb-1.5 block text-sm font-medium text-slate-700">Start time (optional)</label>
                  <input id="teacher-class-time" type="datetime-local" min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)} value={scheduledAt} onChange={event => setScheduledAt(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-indigo-600" />
                </div>
              </div>
              <button disabled={createClassroom.isPending || !classTitle.trim()} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 font-semibold text-white transition hover:bg-indigo-800 disabled:opacity-50">
                {createClassroom.isPending ? 'Setting up…' : scheduledAt ? 'Schedule lesson' : 'Start live class'} <ArrowRight size={17} />
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><FilePlus2 size={21} /></div>
              <div><h2 className="font-bold text-slate-900">Create and publish an exam</h2><p className="text-sm text-slate-500">Students can take published exams from Mock Tests.</p></div>
            </div>
            <form onSubmit={event => { event.preventDefault(); setErrorMessage(''); setNotice(''); createExam.mutate() }} className="space-y-3">
              <div>
                <label htmlFor="teacher-exam-title" className="mb-1.5 block text-sm font-medium text-slate-700">Exam title</label>
                <input id="teacher-exam-title" required maxLength={120} value={examTitle} onChange={event => setExamTitle(event.target.value)} placeholder="Chapter 1 check-in" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-600" />
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
                <div>
                  <label htmlFor="teacher-exam-course" className="mb-1.5 block text-sm font-medium text-slate-700">Course</label>
                  <select id="teacher-exam-course" required value={courseId} onChange={event => setCourseId(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-violet-600">
                    <option value="">Choose a course</option>
                    {courses.map(course => <option key={course._id} value={course._id}>{course.title}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="teacher-exam-duration" className="mb-1.5 block text-sm font-medium text-slate-700">Minutes</label>
                  <input id="teacher-exam-duration" type="number" min="5" max="240" required value={examDuration} onChange={event => setExamDuration(Number(event.target.value))} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-600" />
                </div>
              </div>
              <div className="space-y-5">
                {examQuestions.map((question, questionIndex) => (
                  <fieldset key={questionIndex} className="space-y-3 rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <legend className="text-sm font-semibold text-slate-800">Question {questionIndex + 1}</legend>
                      {examQuestions.length > 1 && <button type="button" onClick={() => setExamQuestions(previous => previous.filter((_, index) => index !== questionIndex))} aria-label={`Remove question ${questionIndex + 1}`} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"><Trash2 size={16} /></button>}
                    </div>
                    <textarea aria-label={`Question ${questionIndex + 1}`} required maxLength={1000} rows={2} value={question.question} onChange={event => setExamQuestions(previous => previous.map((item, index) => index === questionIndex ? { ...item, question: event.target.value } : item))} placeholder="Write a multiple-choice question" className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-600" />
                    <p className="text-xs text-slate-500">Choose the radio button beside the correct answer.</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input aria-label={`Question ${questionIndex + 1}, option ${optionIndex + 1}`} value={option} onChange={event => setExamQuestions(previous => previous.map((item, index) => index === questionIndex ? { ...item, options: item.options.map((value, itemOption) => itemOption === optionIndex ? event.target.value : value) } : item))} required maxLength={160} placeholder={`Option ${optionIndex + 1}`} className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-violet-600" />
                          <input type="radio" name={`correct-exam-answer-${questionIndex}`} aria-label={`Mark option ${optionIndex + 1} correct`} checked={Number(question.correctAnswer) === optionIndex} onChange={() => setExamQuestions(previous => previous.map((item, index) => index === questionIndex ? { ...item, correctAnswer: optionIndex } : item))} className="h-4 w-4 accent-violet-700" />
                        </div>
                      ))}
                    </div>
                  </fieldset>
                ))}
                <button type="button" disabled={examQuestions.length >= 10} onClick={() => setExamQuestions(previous => [...previous, makeExamQuestion()])} className="inline-flex items-center gap-2 rounded-lg border border-violet-200 px-3 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-50 disabled:opacity-50"><Plus size={16} /> Add question</button>
              </div>
              <button disabled={createExam.isPending || !courseId || !examTitle.trim() || examQuestions.some(question => !question.question.trim() || question.options.some(option => !option.trim()))} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 font-semibold text-white transition hover:bg-violet-800 disabled:opacity-50">
                {createExam.isPending ? 'Publishing…' : 'Publish exam'} <ArrowRight size={17} />
              </button>
            </form>
            {!courses.length && <p className="mt-3 text-xs text-slate-500">Exams need a published course in the course library.</p>}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <LessonList title="Upcoming and live lessons" icon={CalendarClock} rooms={[...upcomingLessons, ...otherRooms]} loading={roomsLoading} />
          <LessonList title="Completed lessons" icon={CheckCircle2} rooms={completedLessons} loading={roomsLoading} completed />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-violet-700">Assessment library</p><h2 className="text-2xl font-bold text-slate-900">Published exams</h2></div>
            <Link to="/mock-tests" className="text-sm font-semibold text-violet-700 hover:text-violet-900">View exam library</Link>
          </div>
          {exams.length ? <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{exams.map(exam => <article key={exam._id} className="rounded-xl border border-slate-200 p-4"><h3 className="mb-1 font-semibold text-slate-900">{exam.title}</h3><p className="mb-3 text-sm text-slate-500">{exam.course?.title || 'Course'} · {exam.totalQuestions || 0} questions · {exam.duration} min</p><Link to={`/test/${exam._id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700">Open preview <ArrowRight size={15} /></Link></article>)}</div> : <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-600">No exams published yet. Create an exam above to make it available in Mock Tests.</p>}
        </section>
      </div>
    </main>
  )
}

function TeacherStat({ icon: Icon, label, value }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><Icon size={19} /></div><div className="text-2xl font-bold text-slate-900">{value}</div><div className="text-sm text-slate-500">{label}</div></div>
}

function LessonList({ title, icon: Icon, rooms, loading, completed = false }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900"><Icon size={19} className="text-indigo-700" /> {title}</h2>
      {loading ? <p className="text-sm text-slate-500">Loading classes…</p> : rooms.length ? (
        <div className="space-y-3">
          {rooms.map(room => (
            <article key={room._id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><BookOpen size={18} /></div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-slate-900">{room.title}</h3>
                <p className="text-sm text-slate-500">
                  {completed ? `Completed ${room.endedAt ? new Date(room.endedAt).toLocaleString() : ''}` : room.scheduledAt ? new Date(room.scheduledAt).toLocaleString() : room.status === 'active' ? 'Live now' : 'Ready to start'}
                  {' · '}{room.participants?.length || 0} participants · Code <span className="font-mono font-semibold text-slate-700">{room.code}</span>
                </p>
              </div>
              {!completed && <Link to={`/classroom/${room._id}`} className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-indigo-700 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-800">{room.status === 'active' ? 'Join live' : 'Open lesson'} <ArrowRight size={15} /></Link>}
              {completed && <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700"><CheckCircle2 size={16} /> Finished</span>}
            </article>
          ))}
        </div>
      ) : <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-600">{completed ? 'Completed classes will appear here.' : 'No lessons are scheduled yet.'}</p>}
    </section>
  )
}
