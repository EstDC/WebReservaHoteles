import { motion } from 'framer-motion';

const facilities = [
  {
    title: "Private Parking",
    description: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    icon: (
      <svg className="w-14 h-14 mx-auto mb-6 text-[#b6a179]" fill="none" stroke="currentColor" viewBox="0 0 48 48">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 40V20l16-8 16 8v20M12 40V24m24 16V24M16 40v-4a4 4 0 014-4h8a4 4 0 014 4v4" />
        <rect x="18" y="28" width="12" height="8" rx="2" stroke="#b6a179" strokeWidth="2" fill="none" />
      </svg>
    )
  },
  {
    title: "High Speed Wifi",
    description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
    icon: (
      <svg className="w-14 h-14 mx-auto mb-6 text-[#b6a179]" fill="none" stroke="currentColor" viewBox="0 0 48 48">
        <rect x="14" y="32" width="20" height="8" rx="2" stroke="#b6a179" strokeWidth="2" fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M24 32v-4m-8 4a8 8 0 0116 0" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 24a12 12 0 0124 0" />
      </svg>
    )
  },
  {
    title: "Bar & Restaurant",
    description: "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    icon: (
      <svg className="w-14 h-14 mx-auto mb-6 text-[#b6a179]" fill="none" stroke="currentColor" viewBox="0 0 48 48">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 36h24M24 36V12m0 0l8 8m-8-8l-8 8" />
        <circle cx="24" cy="24" r="20" stroke="#b6a179" strokeWidth="2" fill="none" />
      </svg>
    )
  },
  {
    title: "Swimming Pool",
    description: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.",
    icon: (
      <svg className="w-14 h-14 mx-auto mb-6 text-[#b6a179]" fill="none" stroke="currentColor" viewBox="0 0 48 48">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 32c4 4 8 4 12 0s8-4 12 0 8 4 12 0" />
        <rect x="8" y="36" width="32" height="4" rx="2" stroke="#b6a179" strokeWidth="2" fill="none" />
      </svg>
    )
  }
];

const FacilitiesSection = () => {
  return (
    <section className="py-24 bg-[#fcfaf6]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="uppercase tracking-[0.3em] text-[#b6a179] font-semibold text-sm block mb-2">Paradise Hotel</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Main Facilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {facilities.map((facility, index) => (
            <div key={index} className="bg-white rounded-2xl shadow p-8 text-center flex flex-col items-center h-full">
              {facility.icon}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{facility.title}</h3>
              <p className="text-gray-500 text-base">{facility.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection; 