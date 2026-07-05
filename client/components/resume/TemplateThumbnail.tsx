"use client";

import { Resume } from "@/types/resume";

interface Props {
  template: Resume["template"];
}

export default function TemplateThumbnail({ template }: Props) {
  if (template === "minimal") {
    return (
      <div className="h-full w-full bg-white p-3 text-[5px] text-black">
        <div className="mb-2 border-b pb-1 text-center font-bold">
          JOHN DOE
        </div>

        <div className="space-y-2">
          <div>
            <div className="mb-1 font-bold">SUMMARY</div>
            <div className="h-1 rounded bg-gray-200"></div>
            <div className="mt-1 h-1 w-4/5 rounded bg-gray-200"></div>
          </div>

          <div>
            <div className="mb-1 font-bold">EXPERIENCE</div>
            <div className="h-1 rounded bg-gray-200"></div>
            <div className="mt-1 h-1 w-5/6 rounded bg-gray-200"></div>
          </div>

          <div>
            <div className="mb-1 font-bold">SKILLS</div>
            <div className="flex gap-1">
              <span className="rounded bg-gray-200 px-1">React</span>
              <span className="rounded bg-gray-200 px-1">Node</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template === "ats") {
    return (
      <div className="h-full w-full bg-white p-3 text-[5px] text-black">
        <div className="text-center text-[7px] font-bold">
          JOHN DOE
        </div>

        <div className="mt-2 space-y-2">
          {["SUMMARY", "EDUCATION", "EXPERIENCE", "SKILLS"].map((section) => (
            <div key={section}>
              <div className="border-b border-black font-bold">
                {section}
              </div>

              <div className="mt-1 h-1 rounded bg-gray-300"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (template === "creative") {
    return (
      <div className="flex h-full">
        <div className="w-1/3 bg-blue-600"></div>

        <div className="flex-1 bg-white p-2 text-[5px]">
          <div className="font-bold">JOHN DOE</div>

          <div className="mt-2 space-y-1">
            <div className="h-1 rounded bg-gray-300"></div>
            <div className="h-1 rounded bg-gray-300"></div>
            <div className="h-1 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white p-3 text-[5px]">
      <div className="rounded bg-blue-600 p-2 text-center text-white">
        <div className="text-[7px] font-bold">
          JOHN DOE
        </div>

        <div>Software Engineer</div>
      </div>

      <div className="mt-3 space-y-2">
        {["Education", "Experience", "Projects", "Skills"].map((item) => (
          <div key={item}>
            <div className="mb-1 h-[1px] bg-blue-500"></div>
            <div className="h-1 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
}