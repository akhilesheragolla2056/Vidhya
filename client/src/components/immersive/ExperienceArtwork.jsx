const artworkLabels = {
  body: 'Cutaway illustration of the lungs and heart inside a human torso',
  'ar-body': 'Cutaway illustration of the lungs and heart inside a human torso',
  solar: 'Illustration of a solar system',
  chemistry: 'Water molecule showing one oxygen atom and two hydrogen atoms',
  physics: 'Laboratory pendulum with a metal frame and suspended bob',
  earth: 'Illustrated globe with continents and cloud bands',
  history: 'Illustration of the Colosseum in Rome',
  cell: 'Animal cell cross section showing major organelles',
}

export default function ExperienceArtwork({ type }) {
  return (
    <svg viewBox="0 0 360 190" role="img" aria-label={artworkLabels[type] || 'Illustration of the learning model'} className="h-full w-full">
      <defs>
        <linearGradient id={`scene-bg-${type}`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#edf3f6" /><stop offset="1" stopColor="#dce8ee" /></linearGradient>
        <radialGradient id={`lung-fill-${type}`} cx="35%" cy="28%"><stop stopColor="#dc8c87" /><stop offset="1" stopColor="#9c424c" /></radialGradient>
        <radialGradient id={`ocean-fill-${type}`} cx="34%" cy="28%"><stop stopColor="#56a8cf" /><stop offset=".68" stopColor="#1d658e" /><stop offset="1" stopColor="#163f67" /></radialGradient>
        <radialGradient id={`atom-red-${type}`} cx="30%" cy="22%"><stop stopColor="#ffaaa0" /><stop offset=".5" stopColor="#df4f45" /><stop offset="1" stopColor="#8f2929" /></radialGradient>
        <radialGradient id={`atom-white-${type}`} cx="30%" cy="22%"><stop stopColor="#fff" /><stop offset=".58" stopColor="#edf1f3" /><stop offset="1" stopColor="#aeb9c1" /></radialGradient>
        <linearGradient id={`stone-fill-${type}`} x1="0" x2="0.8" y1="0" y2="1"><stop stopColor="#d8c9ad" /><stop offset="1" stopColor="#998568" /></linearGradient>
        <linearGradient id={`cell-fill-${type}`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#e6d6a3" /><stop offset="1" stopColor="#90b2a0" /></linearGradient>
        <filter id={`soft-shadow-${type}`} x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur stdDeviation="5" /></filter>
        <clipPath id={`globe-clip-${type}`}><circle cx="180" cy="95" r="61" /></clipPath>
      </defs>
      <rect width="360" height="190" rx="22" fill={`url(#scene-bg-${type})`} />
      <ellipse cx="181" cy="158" rx="75" ry="9" fill="#42566a" opacity=".15" filter={`url(#soft-shadow-${type})`} />

      {type === 'solar' && <g>
        <g fill="none" stroke="#778b9c" strokeOpacity=".54" strokeWidth="1.4"><ellipse cx="180" cy="96" rx="106" ry="31" transform="rotate(-22 180 96)"/><ellipse cx="180" cy="96" rx="104" ry="31" transform="rotate(28 180 96)"/></g>
        <circle cx="180" cy="95" r="24" fill="#f6a926"/><circle cx="172" cy="87" r="7" fill="#fff1be" opacity=".65"/>
        <circle cx="222" cy="95" r="6" fill="#75b4d2"/><circle cx="123" cy="95" r="9" fill="#b98976"/><circle cx="180" cy="20" r="12" fill="#c4bdad"/><circle cx="180" cy="95" r="91" fill="none" stroke="#8493a1" strokeOpacity=".55" strokeDasharray="3 5"/>
      </g>}

      {(type === 'body' || type === 'ar-body') && <g>
        <path d="M180 33c-12 0-17 9-17 20 0 8 4 13 8 17l-2 8c-14 2-25 9-29 22l-9 36c-1 5 6 7 9 2l12-27 1 35c0 6 8 6 9 0l4-26 4 26c1 6 9 6 9 0l1-35 12 27c3 5 10 3 9-2l-9-36c-3-13-15-20-29-22l-2-8c5-5 8-10 8-18 0-10-5-19-16-19z" fill="#b98f7f" opacity=".42" stroke="#8e726a" strokeOpacity=".45" />
        <path d="M176 70v24m8-24v24" stroke="#d9cdbb" strokeWidth="4" strokeLinecap="round"/>
        <path d="M180 91c-8 1-14 9-15 22l-1 17c6 5 12 4 17-1 5 5 12 6 18 1l-2-19c-1-12-7-19-17-20z" fill={`url(#lung-fill-${type})`} stroke="#7d3540" strokeWidth="1.2"/>
        <path d="M180 90v15m0-5-8 5m8-5 8 5m-8-5-10 11m10-11 10 11" fill="none" stroke="#e7cdbb" strokeWidth="2.3" strokeLinecap="round"/>
        <path d="M166 117q8-2 13-3m-13 3 5 11m10-13 8 12" fill="none" stroke="#6f3239" strokeWidth="1.1" opacity=".8"/>
        <path d="M182 112c-3-6-12-3-9 4l8 10 9-10c4-7-6-10-8-4z" fill="#963141" stroke="#762637" strokeWidth="1"/>
        <path d="M163 87q17 8 34 0m-36 10q18 9 37 0m-39 11q19 8 40 0" fill="none" stroke="#e8ddca" strokeWidth="1.6" opacity=".85"/>
      </g>}

      {type === 'chemistry' && <g>
        <path d="m180 96-52-29m52 29 52-29" stroke="#89949b" strokeWidth="11" strokeLinecap="round"/>
        <path d="m180 96-52-29m52 29 52-29" stroke="#f4f6f5" strokeWidth="3" strokeLinecap="round" opacity=".9"/>
        <circle cx="180" cy="96" r="29" fill="#762d2b" opacity=".2" transform="translate(2 4)"/><circle cx="180" cy="96" r="29" fill={`url(#atom-red-${type})`} stroke="#8e3730" strokeWidth="1.5"/><circle cx="171" cy="87" r="8" fill="#fff" opacity=".38"/>
        <circle cx="128" cy="67" r="18" fill={`url(#atom-white-${type})`} stroke="#a7b0b6" strokeWidth="1.5"/><circle cx="122" cy="61" r="5" fill="#fff" opacity=".8"/>
        <circle cx="232" cy="67" r="18" fill={`url(#atom-white-${type})`} stroke="#a7b0b6" strokeWidth="1.5"/><circle cx="226" cy="61" r="5" fill="#fff" opacity=".8"/>
      </g>}

      {type === 'physics' && <g>
        <path d="M126 145h108" stroke="#394957" strokeWidth="8" strokeLinecap="round"/>
        <path d="M142 141V49m76 92V49m-5 0h10m-84 0h10" stroke="#596c78" strokeWidth="7" strokeLinecap="round"/>
        <path d="M137 48h86" stroke="#8997a0" strokeWidth="10" strokeLinecap="round"/><path d="M137 45h86" stroke="#e3e7e8" strokeWidth="2" strokeLinecap="round" opacity=".8"/>
        <path d="M180 52v73" stroke="#495b68" strokeWidth="2.5"/><path d="M180 125 164 93" stroke="#273b48" strokeWidth="3"/>
        <circle cx="180" cy="51" r="5" fill="#d9b45e" stroke="#735d32"/><circle cx="164" cy="94" r="15" fill="#9a692d" opacity=".22" transform="translate(2 3)"/><circle cx="164" cy="94" r="15" fill="#c39145" stroke="#79582e" strokeWidth="2"/><ellipse cx="159" cy="89" rx="4" ry="6" fill="#f6dba2" opacity=".55"/>
        <path d="M155 126a52 52 0 0 1 46-31" fill="none" stroke="#4f9ab4" strokeWidth="1.6" strokeDasharray="4 4"/>
        <path d="M134 150h92" stroke="#aeb9be" strokeWidth="1.5"/>
      </g>}

      {type === 'earth' && <g>
        <circle cx="180" cy="95" r="63" fill="#1e496d" opacity=".22" transform="translate(2 4)"/>
        <circle cx="180" cy="95" r="63" fill={`url(#ocean-fill-${type})`} stroke="#a8c8d7" strokeWidth="1.5"/>
        <g clipPath={`url(#globe-clip-${type})`} fill="#789269" stroke="#b6c092" strokeWidth="1">
          <path d="M120 55l13-12 19-4 12 7 18-2 10 10-6 9-16 4-4 11-12 4-8 13-11-4-7-14-13-5zM155 97l10 4 4 15-8 15-4 23-10 18-8-14 2-18-8-16 6-16zM191 49l14-8 23 2 13 7 17 1 8 11-9 8-19-3-11 8-16-5-13 5-8-11-13-1zM214 93l14-5 11 11 3 16-9 11-13-6-7-14zM239 135l20-8 17 9-4 17-21 5-15-10z"/>
        </g>
        <path d="M126 85q14 9 22 28m35-67q-14 29-4 59m25-45q17 19 32 20m-41 15q-8 17-3 33" fill="none" stroke="#e8f0d0" strokeOpacity=".3" strokeWidth="2"/>
        <ellipse cx="180" cy="95" rx="63" ry="22" fill="none" stroke="#d1e3e8" strokeOpacity=".42" strokeWidth="1.2"/>
        <path d="M125 68q22-15 43-7m16 62q26-14 48-5" fill="none" stroke="#fff" strokeOpacity=".58" strokeWidth="5" strokeLinecap="round"/>
        <circle cx="180" cy="95" r="67" fill="none" stroke="#7ac8eb" strokeOpacity=".45" strokeWidth="3"/>
      </g>}

      {type === 'history' && <g>
        <ellipse cx="180" cy="147" rx="93" ry="15" fill="#88775d" opacity=".28"/>
        <path d="M91 142v-42q0-28 25-28h128q25 0 25 28v42z" fill={`url(#stone-fill-${type})`} stroke="#88775d" strokeWidth="1.5"/>
        <path d="M96 99h168M102 73h156M93 143h174" stroke="#9a896d" strokeWidth="5"/>
        {[111, 145, 180, 215, 249].map(x => <g key={x}>
          <path d={`M${x - 11} 140v-16a11 11 0 0 1 22 0v16`} fill="#44505a" stroke="#b9a786" strokeWidth="4"/>
          <path d={`M${x - 11} 96v-12a11 11 0 0 1 22 0v12`} fill="#44505a" stroke="#b9a786" strokeWidth="3.5"/>
          <path d={`M${x - 11} 69v-5a11 11 0 0 1 22 0v5`} fill="#44505a" stroke="#b9a786" strokeWidth="3.5"/>
          <path d={`M${x - 13} 143h26M${x - 12} 97h24M${x - 12} 71h24`} stroke="#eee2c8" strokeWidth="2"/>
        </g>)}
        <path d="M98 68l8-13h148l8 13" fill="#c3b292" stroke="#8d7b60" strokeWidth="1.5"/>
        <path d="M99 51h162M102 44h156" stroke="#d5c7a8" strokeWidth="4"/>
      </g>}

      {type === 'cell' && <g>
        <ellipse cx="180" cy="96" rx="91" ry="59" fill="#627d6d" opacity=".18" transform="translate(2 4)"/>
        <ellipse cx="180" cy="96" rx="91" ry="59" fill={`url(#cell-fill-${type})`} stroke="#718e81" strokeWidth="5"/>
        <ellipse cx="180" cy="96" rx="82" ry="51" fill="#d8d7ac" fillOpacity=".6" stroke="#f1e9c9" strokeWidth="2"/>
        <ellipse cx="163" cy="95" rx="25" ry="23" fill="#86779d" stroke="#5f5076" strokeWidth="2"/><ellipse cx="166" cy="95" rx="9" ry="9" fill="#59486f"/>
        <path d="M142 71q17-9 29 0m-30 8q15-7 29 0m-32 9q15-7 30 0" fill="none" stroke="#648a8e" strokeWidth="3" strokeLinecap="round"/>
        <path d="M193 70q16-8 27-1m-25 9q16-8 28 0m-29 9q16-7 28 1" fill="none" stroke="#c29b62" strokeWidth="3" strokeLinecap="round"/>
        <g fill="#b5664e" stroke="#864b40" strokeWidth="1"><ellipse cx="211" cy="113" rx="17" ry="8" transform="rotate(-22 211 113)"/><ellipse cx="139" cy="116" rx="15" ry="7" transform="rotate(18 139 116)"/></g>
        <path d="M198 111q7-8 12 0t12 0m-88 5q7-7 13 0t12 0" fill="none" stroke="#f0b17f" strokeWidth="2"/>
        <path d="M222 83q11-7 19 0m-20 7q12-6 20 1m-20 7q12-7 20 0" fill="none" stroke="#c29258" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="122" cy="91" r="4" fill="#414f55"/><circle cx="231" cy="119" r="4" fill="#414f55"/><circle cx="181" cy="128" r="4" fill="#414f55"/>
      </g>}

      <circle cx="285" cy="40" r="3" fill="#e8b858" opacity=".8"/><circle cx="72" cy="133" r="2.5" fill="#72a6b4" opacity=".8"/>
    </svg>
  )
}
