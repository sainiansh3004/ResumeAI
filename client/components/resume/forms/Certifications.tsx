"use client";

import { useEffect, useState } from "react";
import { Certification } from "@/types/resume";

interface CertificationsProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
}

export default function Certifications({
  certifications,
  onChange,
}: CertificationsProps) {
  const [certificationList, setCertificationList] =
    useState<Certification[]>(certifications);

  useEffect(() => {
    setCertificationList(certifications);
  }, [certifications]);

  const updateCertifications = (list: Certification[]) => {
    setCertificationList(list);
    onChange(list);
  };

  const handleChange = (
    index: number,
    field: keyof Certification,
    value: string
  ) => {
    const updated = [...certificationList];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    updateCertifications(updated);
  };

  const addCertification = () => {
    updateCertifications([
      ...certificationList,
      {
        name: "",
        organization: "",
        issueDate: "",
        credentialId: "",
        credentialUrl: "",
      },
    ]);
  };

  const removeCertification = (index: number) => {
    updateCertifications(
      certificationList.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Certifications
        </h2>

        <button
          type="button"
          onClick={addCertification}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Certification
        </button>
      </div>

      {certificationList.length === 0 && (
        <p className="text-sm text-gray-500">
          No certifications added yet.
        </p>
      )}

      {certificationList.map((certification, index) => (
        <div
          key={index}
          className="rounded-lg border bg-white p-5 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">
              Certification {index + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeCertification(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Certification Name
            </label>

            <input
              type="text"
              value={certification.name}
              onChange={(e) =>
                handleChange(index, "name", e.target.value)
              }
              placeholder="AWS Certified Developer Associate"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Organization
            </label>

            <input
              type="text"
              value={certification.organization}
              onChange={(e) =>
                handleChange(
                  index,
                  "organization",
                  e.target.value
                )
              }
              placeholder="Amazon Web Services"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Issue Date
            </label>

            <input
              type="month"
              value={certification.issueDate}
              onChange={(e) =>
                handleChange(
                  index,
                  "issueDate",
                  e.target.value
                )
              }
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Credential ID
            </label>

            <input
              type="text"
              value={certification.credentialId}
              onChange={(e) =>
                handleChange(
                  index,
                  "credentialId",
                  e.target.value
                )
              }
              placeholder="ABC123XYZ"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Credential URL
            </label>

            <input
              type="url"
              value={certification.credentialUrl}
              onChange={(e) =>
                handleChange(
                  index,
                  "credentialUrl",
                  e.target.value
                )
              }
              placeholder="https://..."
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
}