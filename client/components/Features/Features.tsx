const features = [
  {
    title: "AI Resume Builder",
    description: "Generate professional resumes with AI assistance."
  },
  {
    title: "Portfolio Website",
    description: "Publish your portfolio with one click."
  },
  {
    title: "ATS Resume Checker",
    description: "Improve your resume score for recruiters."
  },
  {
    title: "Cover Letter Generator",
    description: "Generate personalized cover letters instantly."
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-gray-50">

      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center mb-16">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-bold mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}