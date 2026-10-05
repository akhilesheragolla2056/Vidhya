const escapeXml = value =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const wrapText = (value, maxLength = 42) => {
  const words = String(value ?? '').trim().split(/\s+/)
  const lines = []
  let line = ''

  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word
    if (nextLine.length > maxLength && line) {
      lines.push(line)
      line = word
    } else {
      line = nextLine
    }
  }

  if (line) lines.push(line)
  return lines.slice(0, 2)
}

const filenameFor = value =>
  String(value ?? 'course')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'course'

export function downloadCourseCertificate({ learnerName, courseTitle, completedAt = new Date() }) {
  const date = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(completedAt))
  const courseLines = wrapText(courseTitle).map((line, index) =>
    `<tspan x="800" dy="${index === 0 ? 0 : 58}">${escapeXml(line)}</tspan>`
  ).join('')
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100" role="img" aria-labelledby="title description">
  <title id="title">Certificate of Completion</title>
  <desc id="description">Awarded to ${escapeXml(learnerName)} for completing ${escapeXml(courseTitle)} on ${escapeXml(date)}.</desc>
  <rect width="1600" height="1100" fill="#fbf8f0"/>
  <rect x="34" y="34" width="1532" height="1032" rx="10" fill="none" stroke="#172554" stroke-width="8"/>
  <rect x="54" y="54" width="1492" height="992" rx="6" fill="none" stroke="#c7a45a" stroke-width="3"/>
  <circle cx="800" cy="156" r="52" fill="#172554"/>
  <path d="M800 119l11 23 25 4-18 18 4 25-22-12-22 12 4-25-18-18 25-4z" fill="#f5d98b"/>
  <text x="800" y="258" text-anchor="middle" font-family="Georgia,serif" font-size="28" letter-spacing="8" fill="#475569">LUMINA LEARNING</text>
  <text x="800" y="368" text-anchor="middle" font-family="Georgia,serif" font-size="66" font-weight="700" letter-spacing="3" fill="#172554">CERTIFICATE</text>
  <text x="800" y="420" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" letter-spacing="8" fill="#9a7b36">OF COMPLETION</text>
  <path d="M300 460H1300" stroke="#c7a45a" stroke-width="2"/>
  <text x="800" y="530" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" fill="#475569">This certificate is awarded to</text>
  <text x="800" y="615" text-anchor="middle" font-family="Georgia,serif" font-size="54" font-style="italic" fill="#172554">${escapeXml(learnerName || 'Learner')}</text>
  <text x="800" y="700" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" fill="#475569">for successfully completing the course</text>
  <text x="800" y="780" text-anchor="middle" font-family="Georgia,serif" font-size="42" font-weight="700" fill="#172554">${courseLines}</text>
  <text x="800" y="900" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#475569">Completed on ${escapeXml(date)}</text>
  <path d="M620 950H980" stroke="#172554" stroke-width="2"/>
  <text x="800" y="990" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#172554">Lumina Learning</text>
</svg>`

  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `lumina-certificate-${filenameFor(courseTitle)}.svg`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default downloadCourseCertificate
