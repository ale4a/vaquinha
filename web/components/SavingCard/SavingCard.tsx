function PeopleIcon() {
  return <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_156_2508)">
      <path d="M2.5 12.9879C2.5 11.743 2.98983 10.5491 3.86173 9.66886C4.73363 8.78859 5.91618 8.29405 7.14923 8.29405C8.38229 8.29405 9.56484 8.78859 10.4367 9.66886C11.3086 10.5491 11.7985 11.743 11.7985 12.9879H2.5ZM7.14923 7.70732C5.22271 7.70732 3.66231 6.13194 3.66231 4.18691C3.66231 2.24189 5.22271 0.666504 7.14923 0.666504C9.07576 0.666504 10.6362 2.24189 10.6362 4.18691C10.6362 6.13194 9.07576 7.70732 7.14923 7.70732Z" fill="#929292" />
    </g>
    <defs>
      <clipPath id="clip0_156_2508">
        <rect width="15" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>

}
function DateIcon() {
  return <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.4688 4.25H0.53125C0.376563 4.25 0.25 4.12344 0.25 3.96875V3.125C0.25 2.50391 0.753906 2 1.375 2H2.5V0.78125C2.5 0.626563 2.62656 0.5 2.78125 0.5H3.71875C3.87344 0.5 4 0.626563 4 0.78125V2H7V0.78125C7 0.626563 7.12656 0.5 7.28125 0.5H8.21875C8.37344 0.5 8.5 0.626563 8.5 0.78125V2H9.625C10.2461 2 10.75 2.50391 10.75 3.125V3.96875C10.75 4.12344 10.6234 4.25 10.4688 4.25ZM0.53125 5H10.4688C10.6234 5 10.75 5.12656 10.75 5.28125V11.375C10.75 11.9961 10.2461 12.5 9.625 12.5H1.375C0.753906 12.5 0.25 11.9961 0.25 11.375V5.28125C0.25 5.12656 0.376563 5 0.53125 5ZM6.56172 8.75L7.68906 7.62266C7.79922 7.5125 7.79922 7.33437 7.68906 7.22422L7.02578 6.56094C6.91563 6.45078 6.7375 6.45078 6.62734 6.56094L5.5 7.68828L4.37266 6.56094C4.2625 6.45078 4.08437 6.45078 3.97422 6.56094L3.31094 7.22422C3.20078 7.33437 3.20078 7.5125 3.31094 7.62266L4.43828 8.75L3.31094 9.87734C3.20078 9.9875 3.20078 10.1656 3.31094 10.2758L3.97422 10.9391C4.08437 11.0492 4.2625 11.0492 4.37266 10.9391L5.5 9.81172L6.62734 10.9391C6.7375 11.0492 6.91563 11.0492 7.02578 10.9391L7.68906 10.2758C7.79922 10.1656 7.79922 9.9875 7.68906 9.87734L6.56172 8.75Z" fill="#929292" />
  </svg>

}

export default function SavingCard() {
  return (
    <div className="flex justify-between bg-bg-100 p-1 border-b-2 border-white/25">
      <div>
        <h2 className="text-base font-bold">Pasanaku</h2>
        <h3 className="text-2xl font-bold">68 USDT</h3>
        <p className="text-sm font-satoshi">Collateral: 341 USDT</p>
        <p className="text-sm font-satoshi">Start In: 10-10-2024 (3 days)</p>
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <PeopleIcon />
            <p>3/5</p>
          </div>
          <div className="flex items-center gap-1">
            <DateIcon />
            <p>Montly</p>
          </div>
        </div>
        <button className="rounded-xl px-6 py-1 bg-primary-200 text-2xl">Save</button>
      </div>
    </div>
  )
}